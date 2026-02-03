import { vaud } from '@/app/fonts';
import "../globals.css";

import Header from "../components/pageComponents/Header";
import AsideFilters from "../components/pageComponents/AsideFilters";
import TopFilters from "../components/pageComponents/TopFilters";


export const metadata = {
  title: "The Good Decisions",
  description: "Customization Market",
};


export default async function RootLayout({ children }) {
  

  return (
    <html lang="en">
      <body
        className={`${vaud.variable} ${vaud.variable} antialiased`}
      >
        <Header />
          <TopFilters />
          <div className="flex">
            <AsideFilters />
            {children}
          </div>
      </body>
    </html>
  );
}
