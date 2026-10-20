import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { headers } from "next/headers";
import { auth } from "@/src/lib/auth"; // adjust to your actual Better Auth server instance
import { pool } from "@/src/lib/db"; // adjust to your actual pool import

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
        if (err.code !== "ENOENT") throw err;
    }
}

async function getAuthenticatedUserId() {
    const session = await auth.api.getSession({ headers: await headers() });
    return session?.user?.id ?? null;
}

async function updateUserImage(userId: string, url: string) {
    await pool.query(`UPDATE "user" SET image = $1 WHERE id = $2`, [url, userId]);
}

// First-time upload (no previous photo to replace).
export async function POST(req: NextRequest) {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    await updateUserImage(userId, url);

    return NextResponse.json({ url });
}

// Replace an existing photo: saves the new file, updates the DB, then
// removes the old file. DB write happens right after save so the "user"
// row is never left pointing at a deleted file, even if cleanup fails.
export async function PATCH(req: NextRequest) {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    await updateUserImage(userId, url);

    if (oldUrl) {
        try {
            await deleteFile(oldUrl);
        } catch (err) {
            console.error("Failed to delete previous avatar:", err);
            // DB already points at the new file — safe to not fail the request.
        }
    }

    return NextResponse.json({ url });
}

export async function DELETE(req: NextRequest) {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url || typeof url !== "string") {
        return NextResponse.json({ error: "No url provided" }, { status: 400 });
    }

    if (!isValidAvatarPath(url)) {
        return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    try {
        await deleteFile(url);
        await updateUserImage(userId, "");
    } catch {
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}