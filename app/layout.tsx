import Providers from "./providers";
import "@/src/assets/styles/globals.css";
import { Kantumruy_Pro } from "next/font/google";

const kantumruyPro = Kantumruy_Pro({
  subsets: ["khmer", "latin"],
  variable: "--font-kantumruy-pro",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={kantumruyPro.variable}>
      <body suppressHydrationWarning className={kantumruyPro.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}