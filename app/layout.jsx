import './globals.css';

export const metadata = {
  title: 'สำนักงานราชการกลาง',
  description: 'แพลตฟอร์มบริการภาครัฐในรูปแบบดิจิทัล'
};

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body className="font-sans bg-slate-50 text-neutral">
        {children}
      </body>
    </html>
  );
}
