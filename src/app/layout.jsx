import "./globals.css";

export const metadata = {
  title: '陈涛のCube Timer',
  description: '陈涛的Cube Timer 魔方计时器 cuber timer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta metadata />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
