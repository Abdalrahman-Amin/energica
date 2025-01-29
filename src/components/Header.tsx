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
      <header className="sticky top-0 z-10 flex flex-col gap-4 items-center text-black py-4 px-4 bg-white md:px-8 lg:px-32 drop-shadow-md">
         {/* Top Section */}
         <div className="flex flex-row items-center gap-3 justify-between w-full">
            {/* Logo */}
            <Link href="/">
               <Image
                  height={30}
                  src={logo}
                  alt="logo"
                  className="hover:scale-105 transition-all duration-300"
               />
            </Link>

            {/* Title */}
            <div>
               <h1 className="text-2xl md:text-3xl font-bold text-blue-600">
                  ENERGICA
               </h1>
            </div>

            {/* Phone Number */}
            <div className="flex flex-row items-center gap-3">
               <Image className="w-6" src={phoneIcon} alt="phone-icon" />
               <p className="text-gray-700">01012731091</p>
            </div>
         </div>

         {/* Middle Section */}
         <div className="flex flex-row items-center justify-between w-full">
            {/* Hamburger Menu (Always Visible) */}
            <button
               onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
               aria-expanded={isNavMenuOpen}
               aria-label="Toggle navigation menu"
               className="cursor-pointer w-8"
            >
               {isNavMenuOpen ? <FaXmark size={30} /> : <FaBars size={30} />}
            </button>

            {/* Search Bar */}
            <div className="relative flex items-center justify-center gap-3 w-full sm:w-auto">
               <Image
                  src={searchIcon}
                  alt="search"
                  className="absolute left-3 w-5"
               />
               <input
                  type="text"
                  placeholder="Search..."
                  className="py-2 pl-10 rounded-xl border-2 border-blue-300 focus:bg-slate-100 focus:outline-sky-500 w-full sm:w-96"
               />
            </div>
         </div>

         {/* Bottom Section - Navigation Buttons (Always Visible) */}
         <div className="flex flex-row items-center gap-4 justify-center w-full">
            {buttons.map((btn) => (
               <Link href={btn.path} key={btn.name}>
                  <button className="px-4 py-2 rounded-md hover:bg-blue-50 hover:scale-110 transition-all transition-colors duration-300">
                     {btn.name}
                  </button>
               </Link>
            ))}
         </div>
      </header>
   );
}

export default Navbar;
