import localFont from "next/font/local";

export const vaud = localFont({
  src: [
    {
      path: "../fonts/VaudDisplay-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/VaudDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-vaud",
  display: "swap",
});
