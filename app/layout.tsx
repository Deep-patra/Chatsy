import { Metadata } from 'next'
import { Suspense } from 'react'
import Provider from '@/components/Provider'
import NoInternet from '@/components/noInternet'
import Analytics from '@/components/analytics'
import RegisterSW from '@/components/registerSW'
import Loader from '@/components/loader'
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

const Fallback = () => {
  return (
    <div className="w-full h-full | flex flex-row items-center justify-center">
      <div className="w-10 h-10">
        <Loader color="white" />
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preload" href="/noInternet" />
        <link rel="manifest" href="/app.webmanifest" />
      </head>

      <body>
        <NoInternet />

        <Suspense fallback={<Fallback />}>
          <>
            {/* Register the Service worker */}
            <RegisterSW />

            <Provider>
              <Analytics>{children}</Analytics>
            </Provider>
          </>
        </Suspense>
      </body>
    </html>
  )
}
