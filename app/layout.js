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
    url: '', 
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
        {/* Dynamic SEO Metadata */}
        <title>{metadata.title.default}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta property="og:type" content={metadata.openGraph.type} />

        {/* Mobile App Specific Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Family Store" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
      </Head>
      <body className={`${inter.className} font-sans bg-gradient-to-br from-amber-100 via-purple-100 to-pink-100 min-h-screen`}>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-label="Main content">
          {children}
        </main>
      </body>
    </html>
  );
}

