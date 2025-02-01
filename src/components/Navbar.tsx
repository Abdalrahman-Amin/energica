"use client";

import Image from "next/image";
import logo from "../../public/logo.png";
import searchIcon from "../../public/icons-search.svg";
import phoneIcon from "../../public/phone.svg";
import { useCallback, useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { FaBars } from "react-icons/fa6";
import Link from "next/link";
import clsx from "clsx";

interface Category {
   id: number;
   title: string;
}

interface NavbarProps {
   categories?: Category[];
}

function Navbar({ categories = [] }: NavbarProps) {
   const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
   const [activeSection, setActiveSection] = useState<number | null>(null);

   const handleScroll = useCallback(() => {
      let currentSection: number | null = null;
      const navbarHeight = document.querySelector("header")?.offsetHeight || 0;

      categories.forEach((category) => {
         const section = document.getElementById(`category-${category.id}`);
         if (section) {
            const rect = section.getBoundingClientRect();
            if (
               rect.top <= navbarHeight + 100 &&
               rect.bottom >= navbarHeight + 100
            ) {
               currentSection = category.id;
            }
         }
      });

      setActiveSection(currentSection);
   }, [categories]);

   useEffect(() => {
      window.addEventListener("scroll", handleScroll);
      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, [handleScroll]);

   const handleCategoryClick = (categoryId: number) => {
      const section = document.getElementById(`category-${categoryId}`);
      const navbarHeight = document.querySelector("header")?.offsetHeight || 0;

      if (section) {
         window.scrollTo({
            top: section.offsetTop - navbarHeight,
            behavior: "smooth",
         });
      }
   };

   return (
      <header className="fixed w-full top-0 z-20 flex flex-col gap-4 items-center text-black py-4 px-4 bg-white md:px-8 lg:px-32 shadow-md h-56 transition-all duration-300">
         {/* Top Section */}
         <div className="flex flex-row items-center gap-4 justify-between w-full">
            {/* Logo */}
            <Link href="/">
               <Image
                  height={100}
                  src={logo}
                  alt="logo"
                  className="hover:scale-110 transition-transform duration-300 w-16 md:w-20 cursor-pointer"
               />
            </Link>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700 bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">
               ENERGICA
            </h1>

            {/* Contact & Admin Login */}
            <div className="flex flex-row gap-4 items-center">
               <div className="hidden md:flex flex-row items-center gap-3 bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors duration-300">
                  <Image
                     className="w-5 md:w-6"
                     src={phoneIcon}
                     alt="phone-icon"
                  />
                  <p className="text-gray-700 font-medium">01012731091</p>
               </div>
               <Link href="/admin/login">
                  <button className="px-5 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-md">
                     Admin Login
                  </button>
               </Link>
            </div>
         </div>

         {/* Middle Section */}
         <div className="flex flex-row items-center justify-between w-full gap-4">
            {/* Hamburger Menu */}
            <button
               onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
               aria-expanded={isNavMenuOpen}
               aria-label="Toggle navigation menu"
               className="w-10 h-10 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-300 flex items-center justify-center"
            >
               {isNavMenuOpen ? (
                  <FaXmark size={24} className="text-blue-600" />
               ) : (
                  <FaBars size={24} className="text-blue-600" />
               )}
            </button>

            {/* Search Bar */}
            <div className="relative flex items-center w-full sm:w-auto">
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

         {/* Bottom Section - Navigation Buttons */}
         <div className="flex flex-row items-center gap-4 justify-center w-full">
            {categories.map((category) => (
               <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={clsx(
                     "px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-md",
                     activeSection === category.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 hover:scale-105"
                  )}
                  aria-current={
                     activeSection === category.id ? "page" : undefined
                  }
               >
                  {category.title}
               </button>
            ))}
         </div>
      </header>
   );
}

export default Navbar;
