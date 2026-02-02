import { Great_Vibes, Dancing_Script } from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
  display: "swap",
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "My Dearest Khaterinya",
  description: "A gift for my dearest Khaterinya",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${greatVibes.variable} ${dancingScript.variable}`}
    >
      <body className={`${dancingScript.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
