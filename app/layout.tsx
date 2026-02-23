import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <h1>Terra-Scape Equipment Tracking Beta</h1>
          <nav className="card">
            <Link href="/dashboard">Dashboard</Link>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
