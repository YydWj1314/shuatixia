import './globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import AppShell from '../components/AppShell';

// server side
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AppShell>{children}</AppShell>
        </AntdRegistry>
      </body>
    </html>
  );
}
