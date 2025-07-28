import Image from "next/image";
import Link from "next/link";

export function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Quick Links */}
          <div className="sm:col-span-1">
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              QUICK LINKS
            </h3>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  FAQS
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  TERMS AND CONDITIONS
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  CONTACT US
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">HELP & SUPPORT</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  WHAT IS BITCOIN?
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  HOW TO BUY BITCOIN
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  REGISTER
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  LOGIN
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-orange-500 transition-colors"
                >
                  FORGOT PASSWORD
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">CONTACT US</h3>
            <div className="space-y-2 text-gray-300">
              <p>Wales, Australia, England</p>
              <a
                href="mailto:support@letbuilt.com"
                className="text-orange-500 hover:text-orange-400"
              >
                support@letbuilt.com
              </a>
              <p>MON-SAT 08AM ⇾ 05PM</p>
              <div className="flex space-x-2 mt-4">
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
                >
                  f
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center"
                >
                  t
                </a>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              <div>
                <div className="text-xl md:text-2xl font-bold text-orange-500">
                  $198.76B
                </div>
                <div className="text-gray-400 text-xs md:text-sm">
                  MARKET CAP
                </div>
                <div className="text-xl md:text-2xl font-bold text-orange-500 mt-2">
                  69K+
                </div>
                <div className="text-gray-400 text-xs md:text-sm">
                  ACTIVE ACCOUNTS
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-500">243K</div>
                <div className="text-gray-400 text-sm">WEEKLY TRANSACTIONS</div>
                <div className="text-2xl font-bold text-orange-500 mt-2">
                  127
                </div>
                <div className="text-gray-400 text-sm">SUPPORTED COUNTRIES</div>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">
                SUPPORTED PAYMENT METHODS
              </p>
              <div className="flex space-x-2">
                <Image
                  src="/f-bitcoin.png"
                  alt="Bitcoin"
                  width={30}
                  height={30}
                  className="bg-orange-500 rounded-full"
                />
                <Image
                  src="/f-etherium.png"
                  alt="Ethereum"
                  width={30}
                  height={30}
                  className="bg-blue-500 rounded-full"
                />
                <Image
                  src="/skrill.png"
                  alt="Litecoin"
                  width={30}
                  height={30}
                  className="bg-gray-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 my-8" />
        <p className="text-center text-gray-400">
          Copyright © {year} LetBuilt, All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
