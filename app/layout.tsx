import type { Metadata } from "next";
import { Figtree } from "next/font/google";

import "./globals.css";
import SideBar from "@/components/SIdeBar";
import SuperbaseProvider from "@/providers/SupabaseProvider";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Music Library",
  description: "Listen to music!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <SuperbaseProvider>
          <UserProvider>
            <ModalProvider />
            <SideBar>
              {children}
            </SideBar>
          </UserProvider>
        </SuperbaseProvider>
      </body>
    </html>
  );
}
