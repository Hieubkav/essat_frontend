import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "@/components/SettingsProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { InitialLoadingScreen } from "@/components/InitialLoadingScreen";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* Critical CSS for initial loading - renders before JS bundle */}
        <style dangerouslySetInnerHTML={{ __html: `
          #initial-loading-screen {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            transition: opacity 0.3s ease-out, visibility 0.3s ease-out;
          }
          #initial-loading-screen.fade-out {
            opacity: 0;
            visibility: hidden;
          }
          .initial-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid #e2e8f0;
            border-top-color: #2ea64e;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        ` }} />
      </head>
      <body className="antialiased " >
        <InitialLoadingScreen />

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
