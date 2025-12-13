import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "@/components/SettingsProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <QueryProvider>
          <SettingsProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </SettingsProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
