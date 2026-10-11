import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "जनता का न्याय — जनता की भाषा में", description: "जन-समर्थन दर्ज करने हेतु डिजिटल प्रपत्र।" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="hi"><body>{children}</body></html>;
}
