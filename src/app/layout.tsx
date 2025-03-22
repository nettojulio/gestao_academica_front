// app/layout.tsx (Server Component)
import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider/AuthProvider";
import ClientThemeProvider from "@/components/AuthProvider/clientThemeProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientWrapper from "@/components/AuthProvider/ClientWrapper";

export const metadata: Metadata = {
  title: "Sistema de Gestão",
  description: "Sistema de gestão interna",
};

// ✅ Código limpo e organizado
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="antialiased bg-gray-100">
        <AuthProvider>
          <ClientThemeProvider>
            <ClientWrapper>{children}</ClientWrapper>
            <ToastContainer />
          </ClientThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
