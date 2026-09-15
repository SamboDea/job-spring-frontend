import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "avatars");
const URL_PREFIX = "/uploads/avatars/";

function isValidAvatarPath(url: string) {
    const filename = path.basename(url);
    return url.startsWith(URL_PREFIX) && !filename.includes("..");
}

async function saveFile(file: File) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = file.type.split("/")[1];
    const filename = `${crypto.randomUUID()}.${ext}`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return `${URL_PREFIX}${filename}`;
}

async function deleteFile(url: string) {
    const filename = path.basename(url);
    try {
        await unlink(path.join(UPLOAD_DIR, filename));
    } catch (err: any) {
        // Already gone is fine — nothing left to clean up.
        if (err.code !== "ENOENT") throw err;
    }
}

// First-time upload (no previous photo to replace).
export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const url = await saveFile(file);
    return NextResponse.json({ url });
}

// Replace an existing photo: saves the new file, then removes the old one.
// The new file is written and returned first — if deleting the old file
// fails, the user still ends up with a working photo, just an orphaned
// old file on disk (logged, non-fatal).
export async function PATCH(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;
    const oldUrl = formData.get("oldUrl") as string | null;

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: "File too large" }, { status: 400 });
    }
    if (oldUrl && !isValidAvatarPath(oldUrl)) {
        return NextResponse.json({ error: "Invalid previous file path" }, { status: 400 });
    }

    const url = await saveFile(file);

    if (oldUrl) {
        try {
            await deleteFile(oldUrl);
        } catch (err) {
            console.error("Failed to delete previous avatar:", err);
            // Don't fail the request — the new photo is already live.
        }
    }

    return NextResponse.json({ url });
}

export async function DELETE(req: NextRequest) {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
        return NextResponse.json({ error: "No url provided" }, { status: 400 });
    }

    if (!isValidAvatarPath(url)) {
        return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    try {
        await deleteFile(url);
    } catch {
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}