import "../styles/globals.css";
import { Providers } from "../components/providers";

export default function RootLayout({ children }: any) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
