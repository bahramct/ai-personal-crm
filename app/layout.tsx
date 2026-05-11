import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'AI Personal CRM — مدیریت ارتباطات شخصی',
	description: 'سامانه مدیریت روابط شخصی با پشتیبانی هوش مصنوعی',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='fa' dir='rtl'>
			<body>{children}</body>
		</html>
	);
}
