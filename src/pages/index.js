import Head from 'next/head';
import { Inter } from 'next/font/google';
import { ConnectKitButton } from 'connectkit';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Exorcise Your GHO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${inter.className}`}>
        <h1 className="logo">Exercise Your GHO</h1>
        <ConnectKitButton />
      </main>
    </>
  )
}
