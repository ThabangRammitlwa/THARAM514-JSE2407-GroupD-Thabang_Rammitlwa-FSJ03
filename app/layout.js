import './globals.css';
import { Inter } from 'next/font/google';
import Head from 'next/head';


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Family Store | something for everyone',
    template: '%s | Family Store',
  },
  description: 'Discover amazing products at great prices on Family Store.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Family Store | Your One-Stop Shop',
    description: 'Amazing products at great prices on Family Store.',
    url: 'https://quickcart-emporium.vercel.app',
    siteName: 'Family Store',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Family Store',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Family Store" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>
      <body className={`${inter.className} font-sans bg-gradient-to-br from-amber-100 via-purple-100 to-pink-100 min-h-screen`}>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {children}
          </main>
   
      </body>
    </html>
  );
}
