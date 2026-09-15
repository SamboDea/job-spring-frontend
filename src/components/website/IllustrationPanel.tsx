import Image from "next/image";
import RegisterIllustration from "@public/illustration/jobspring_login.png";

export default function IllustrationPanel() {
    return (
        <div className="hidden md:flex w-1/2 relative bg-white items-center justify-center overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#71dd37]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#07c4ec]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="w-4/5 h-4/5 relative z-10">
                <Image
                    src={RegisterIllustration}
                    alt="JobSpring Career Growth Illustration"
                    fill
                    sizes="(max-width: 768px) 0px, 40vw"
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}