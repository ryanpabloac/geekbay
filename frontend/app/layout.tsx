import type { Metadata } from "next";
import { Orbitron } from "next/font/google"; // Importa a sua nova fonte
import "./globals.css";


const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: "--font-orbitron",
});

// Altere aqui para o nome do seu projeto!
export const metadata: Metadata = {
  title: "GeekBay",
  description: "Sistema de gestão de compra e vendas de produtos Geek.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${orbitron.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}