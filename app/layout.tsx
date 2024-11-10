import { Metadata } from 'next'
import Provider from '@/components/Provider'
import NoInternet from '@/components/noInternet'
import Analytics from '@/components/analytics'
import RegisterSW from '@/components/registerSW'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Chatsy',
    template: '%s | Chatsy',
  },
  description: 'A secure, safe, and reliable messaging application.',
  keywords: ['Chatsy', 'Messaging Application'],
  robots: 'index',
  authors: [
    {
      name: 'Deep patra',
      url: 'https://www.deeppatra.in',
    },
  ],

  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },

  openGraph: {
    title: 'Chatsy',
    description: 'A secure, safe, and reliable messaging application.',
    images: {
      url: '/favicon.svg',
      type: 'image/svg+xml',
      width: 300,
      height: 300,
    },
  },

  // manifest: '/app.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://cdn.jsdelivr.net/npm/jdenticon@3.2.0/dist/jdenticon.min.js"
          integrity="sha384-yBhgDqxM50qJV5JPdayci8wCfooqvhFYbIKhv0hTtLvfeeyJMJCscRfFNKIxt43M"
          crossOrigin="anonymous"
          async
          defer
        ></script>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preload" href="/noInternet" />
        <link rel="manifest" href="/app.webmanifest" />
      </head>

      <body>
        <NoInternet />

        {/* Register the Service worker */}
        <RegisterSW />

        <Provider>
          <Analytics>{children}</Analytics>
        </Provider>
      </body>
    </html>
  )
}
