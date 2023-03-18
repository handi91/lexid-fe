/* eslint-disable jsx-a11y/alt-text */
import Link from "next/link"
import Image from "next/image"

function Header() {
  return (
    <header className='flex w-full p-5 items-center text-lg text-black justify-center fixed top-0 border-b shadow-md bg-white z-10'>
      <div className='flex space-x-7 items-center justify-evently lg:w-2/3'>
        <div className="flex items-center">
          <Link href={'/'}>
            <div className="flex space-x-2">
              <Image 
              src="/Iconleak-Or-Auction-hammer.256.png"
              width={40}
              height={40}
              />
              <p className="text-2xl font-medium">Lexid</p>
            </div>
          </Link>
        </div>
        <div className='flex space-x-3 items-center'>
          <Link href={'/about'}>
            <p className='menu'>Tentang</p>
          </Link>
          <Link href={'/'}>
            <p className="menu">Tanya</p>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header;