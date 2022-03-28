import Image from 'next/image'
import Link from 'next/link'

function Header() {
  return (
    <header className="mx-auto flex max-w-7xl justify-between p-5">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <Image
            className="w-44 cursor-pointer object-contain"
            src={require('../public/logo-full.png')}
            height={30}
            width={200}
            alt=""
          />
        </Link>

        <div>
          <div className="hidden items-center space-x-5 text-white md:inline-flex">
            <h3 className="cursor-pointer">About</h3>
            <h3 className="cursor-pointer">Contact</h3>
            <h3 className="cursor-pointer rounded-full bg-green-600 px-4 py-1">
              Follow
            </h3>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-5 ">
        <h3 className="cursor-pointer text-white ">Sign In</h3>
        <h3 className="font-strong cursor-pointer rounded-full border border-green-600 bg-white px-4 py-1 text-black">
          Get Started
        </h3>
      </div>
    </header>
  )
}

export default Header
