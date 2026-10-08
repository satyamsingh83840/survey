import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'जनता का न्याय — जनता की भाषा में', description: 'डिजिटल जन-समर्थन प्रपत्र' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="hi"><body>{children}</body></html>; }
