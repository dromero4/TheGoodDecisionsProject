import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "../components/pageComponents/header/Header";
import { vaud } from "../fonts";
import { CartProvider } from "../context/CartContext";

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
     <>
      <Header />
      {children}
    </>
  );
}
