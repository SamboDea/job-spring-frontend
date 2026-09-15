import Footer from "@/src/components/website/footer";
import Header from "@/src/components/website/header";
import "@/src/assets/styles/website.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-full flex flex-col text-black">
            <Header />
            <main className="flex-1 px-5">{children}</main>
            <Footer />
        </div>
    );
}