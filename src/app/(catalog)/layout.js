import { vaud } from '@/app/fonts';
import "../globals.css";

import Header from "../components/pageComponents/header/Header";
import { CartProvider } from '../context/CartContext';


export const metadata = {
  title: "The Good Decisions",
  description: "Customization Market",
};


export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      <div className="flex">
        {children}
      </div>
    </>
  );
}
