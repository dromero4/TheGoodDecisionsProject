import { vaud } from '@/app/fonts';
import "../globals.css";

import Header from "../components/pageComponents/Header";
import AsideFilters from "../components/pageComponents/AsideFilters";
import TopFilters from "../components/pageComponents/TopFilters";
import { CartProvider } from '../context/CartContext';


export const metadata = {
  title: "The Good Decisions",
  description: "Customization Market",
};


export default function RootLayout({ children }) {
  return (
    <>
      <Header />
      <TopFilters />
      <div className="flex">
        <AsideFilters />
        {children}
      </div>
    </>
  );
}
