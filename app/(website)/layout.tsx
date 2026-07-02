import Footer from "../../src/components/layout/website/footer";
import Header from "../../src/components/layout/website/header";
import "../../src/styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-full flex mt-24 flex-col text-black">
            <Header />
            <main className="flex-1 px-5">{children}</main>
            <Footer />
        </div>
    );
}