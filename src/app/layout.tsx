import 'styles/globals.css';
import DarkModeProvider from 'ui/DarkModeProvider';
import { Metadata } from 'next';

interface IProps {
	children: React.ReactNode;
}

export default async function RootLayout({ children }: IProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body>
				<DarkModeProvider>
					{children}
				</DarkModeProvider>
			</body>
		</html>
	);
}

export const metadata: Metadata = {
	title: 'HoloEN Fan Website',
	description: 'A website featuring amazing projects organized by the community!',
	keywords: ['hololive en', 'hef', 'hololive fan', 'hololive en fan', 'hololive'],
	themeColor: '#FF3D3D',
	openGraph: {
		title: 'HoloEN Fan Website',
		description: 'A website featuring amazing projects organized by the community!',
		images: 'https://holoen.fans/img/logo.png',
		type: 'website',
		siteName: 'HoloEN Fan Website',
	},
	twitter: {
		title: 'HoloEN Fan Website',
		description: 'A website featuring amazing projects organized by the community!',
		images: 'https://holoen.fans/img/logo.png',
		site: '@HEF_Website',
		card: 'summary_large_image',
	},
	other: {
		subject: 'HoloEN Fan Website',
		language: 'EN',
		url: 'https://holoen.fans',
	},
};