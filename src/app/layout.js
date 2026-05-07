import "./globals.css";
import { CartProvider } from "./context/CartContext";

export const metadata = {
  title: "The Good Decisions",
  description: "Customization Market",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}