import Head from 'next/head'
import Header from '@/components/Header'
import Link from 'next/link'

function About() {
  return (
    <div className='flex flex-col items-center justify-center w-screen h-screen'>
      <Head>
        <title>Lexid</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Iconleak-Or-Auction-hammer.ico" />
      </Head>
      <Header />
      <div className='flex flex-col items-center justify-center flex-grow'>
        <p className='text-black text-3xl font-medium'>Lexid - Indonesian Legal Knowledge Graph</p>
        <p className='mt-4 text-xl'>Tanya seputar Peraturan Perundang-undangan di Indonesia</p>
        <Link href={'/ask'}>
          <button className="mt-10 bg-amber-700 hover:bg-amber-600 text-white font-bold py-2 px-4 border-b-4 border-amber-800 hover:border-amber-700 rounded">
            Mulai Tanya
          </button>
        </Link>
      </div>
      
    </div>
  );
}

export default About;