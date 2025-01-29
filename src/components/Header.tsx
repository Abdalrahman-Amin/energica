"use client";

import Image from "next/image";
import logo from "../../public/next.svg";
import searchIcon from "../../public/icons-search.svg";
import phoneIcon from "../../public/phone.svg";
import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { FaBars } from "react-icons/fa6";
import Link from "next/link";

function Navbar() {
   const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

   const buttons = [
      { name: "Batteries", onclick: () => {}, path: "/batteries" },
      { name: "UPS", onclick: () => {}, path: "/ups" },
      { name: "Inverters", onclick: () => {}, path: "/inverters" },
      { name: "AVR", onclick: () => {}, path: "/avr" },
   ];

   return (
      <header className="sticky top-0 z-10 flex flex-col gap-4 items-center text-black py-4 px-4 bg-white md:px-8 lg:px-32 drop-shadow-lg">
         {/* Top Section */}
         <div className="flex flex-row items-center gap-3 justify-between w-full">
            {/* Logo */}
            <Link href="/">
               <Image
                  height={40}
                  src={logo}
                  alt="logo"
                  className="hover:scale-105 transition-all duration-300 w-16 md:w-20 cursor-pointer"
               />
            </Link>

            {/* Title */}
            <div>
               <h1 className="text-2xl md:text-3xl font-bold text-blue-600 bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
                  ENERGICA
               </h1>
            </div>

            {/* Phone Number */}
            <div className=" flex-row items-center justify-center gap-3 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors duration-300 hidden md:flex">
               <Image className="w-4 md:w-6" src={phoneIcon} alt="phone-icon" />
               <p className="text-gray-700 font-medium">01012731091</p>
            </div>
         </div>

         {/* Middle Section */}
         <div className="flex flex-row items-center justify-between w-full gap-3">
            {/* Hamburger Menu (Always Visible) */}
            <button
               onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
               aria-expanded={isNavMenuOpen}
               aria-label="Toggle navigation menu"
               className="cursor-pointer w-8 p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300 flex items-center justify-center "
            >
               {isNavMenuOpen ? (
                  <FaXmark size={24} className="text-blue-600" />
               ) : (
                  <FaBars size={24} className="text-blue-600" />
               )}
            </button>

            {/* Search Bar */}
            <div className="relative flex items-center justify-center gap-3 w-full sm:w-auto">
               <Image
                  src={searchIcon}
                  alt="search"
                  className="absolute left-3 w-5 text-gray-400"
               />
               <input
                  type="text"
                  placeholder="Search..."
                  className="py-2 pl-10 pr-4 rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full sm:w-96 transition-all duration-300"
               />
            </div>
         </div>

         {/* Bottom Section - Navigation Buttons (Always Visible) */}
         <div className="flex flex-row items-center gap-4 justify-center w-full">
            {buttons.map((btn) => (
               <Link href={btn.path} key={btn.name}>
                  <button className="px-4 py-2 rounded-md bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 hover:text-blue-700 hover:scale-105 transition-all duration-300">
                     {btn.name}
                  </button>
               </Link>
            ))}
         </div>
      </header>
   );
}

export default Navbar;
