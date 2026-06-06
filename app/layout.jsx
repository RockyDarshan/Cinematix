import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";

export const metadata = {
  title: "Cinematix",
  description: "Find Movies You'll Enjoy Without the Hassle",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
