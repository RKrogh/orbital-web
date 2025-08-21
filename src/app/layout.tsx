import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";

export const metadata: Metadata = {
  title: "Orbital Web Portal",
  description: "A tranquil synthwave space experience - exploring the vastness of the digital cosmos",
  icons: {
    icon: "/orbital_icon.svg",
    shortcut: "/orbital_icon.svg",
    apple: "/orbital_icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning={true}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
