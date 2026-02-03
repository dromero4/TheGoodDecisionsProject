import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "../components/pageComponents/Header";
import { vaud } from "../fonts";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "The Good Decisions",
  description: "Customization Market",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${vaud.variable} ${vaud.variable} antialiased`}
        >
        <Header/>
          {children}
      </body>
    </html>
  );
}
