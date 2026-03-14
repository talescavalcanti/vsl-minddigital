import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VDA • Página Oficial",
  description:
    "O sistema com IA que me faz vender todos os dias no automático e pode te gerar R$500 por dia ainda essa semana.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
