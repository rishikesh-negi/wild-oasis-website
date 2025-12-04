import Logo from "@/app/_components/Logo";

import { Josefin_Sans } from "next/font/google";

import "@/app/_styles/globals.css";
import Navigation from "./_components/navigation";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  // title: "The Wild Oasis",
  title: {
    template: "%s | The Wild Oasis",
    default: "Welcome / The Wild Oasis",
  },
  description:
    "Luxurious boutique hotel located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} bg-primary-950 text-primary-100 h-dvh`}>
        <header>
          <Logo />
          <Navigation />
        </header>
        <main>{children}</main>
        <footer>Copyright &copy; by The Wild Oasis</footer>
      </body>
    </html>
  );
}
