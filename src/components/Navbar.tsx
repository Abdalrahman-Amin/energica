"use client";

import Image from "next/image";
import logo from "../../public/logo.png";
import searchIcon from "../../public/icons-search.svg";
import phoneIcon from "../../public/phone.svg";
import { useCallback, useEffect, useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { FaBars } from "react-icons/fa6";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
   id: number;
   title: string;
}

interface NavbarProps {
   categories?: Category[];
}

function Navbar({ categories = [] }: NavbarProps) {
   const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
   const [activeSection, setActiveSection] = useState<string | null>(null);
   const pathname = usePathname();

   const handleScroll = useCallback(() => {
      let currentSection: string | null = null;
      const navbarHeight = document.querySelector("header")?.offsetHeight || 0;

      categories.forEach((category) => {
         const section = document.getElementById(`category-${category.title}`);
         if (section) {
            const rect = section.getBoundingClientRect();
            if (
               rect.top <= navbarHeight + 500 &&
               rect.bottom >= navbarHeight + 100
            ) {
               currentSection = category.title;
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

   const handleCategoryClick = (categoryId: string) => {
      const section = document.getElementById(`category-${categoryId}`);
      const navbarHeight = document.querySelector("header")?.offsetHeight || 0;

      if (section) {
         window.scrollTo({
            top: section.offsetTop - navbarHeight - 100,
            behavior: "smooth",
         });
      }
   };

   if (pathname.includes("/admin")) return null;

   return (
      <header className="fixed w-full top-0 z-20 flex flex-col items-center text-black py-4 px-4 bg-white shadow-md transition-all duration-300 md:px-8 lg:px-32 h-auto">
         {/* Top Section */}
         <div className="flex items-center justify-between w-full gap-4">
            {/* Logo */}
            <Link href="/" className="w-40">
               <Image
                  height={100}
                  src={logo}
                  alt="logo"
                  className="hover:scale-110 transition-transform duration-300 w-16 md:w-20 cursor-pointer"
               />
            </Link>

            {/* Search Bar */}
            <div className="relative flex items-center w-full max-w-xs sm:max-w-md md:max-w-lg">
               <Image
                  src={searchIcon}
                  alt="search"
                  className="absolute left-3 w-5 text-gray-400"
               />
               <input
                  type="text"
                  placeholder="Search..."
                  className="py-2 pl-10 pr-4 w-full rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-300"
               />
            </div>

            {/* Contact & Admin Login */}
            <div className="flex flex-col items-center gap-4 w-40">
               <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-300">
                  <Image
                     src={phoneIcon}
                     alt="phone-icon"
                     className="w-5 md:w-6"
                  />
                  <p className="text-gray-700 font-medium">01012731091</p>
               </div>
               <Link href="/admin/login" className="w-full">
                  <button className="px-5 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-md w-full">
                     Admin Login
                  </button>
               </Link>
            </div>
         </div>

         {/* Navigation Buttons Always Visible */}
         <div className="flex flex-row items-center gap-4 justify-center w-full mt-4 ">
            {/* Hamburger Menu for Mobile */}
            <button
               onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
               aria-expanded={isNavMenuOpen}
               aria-label="Toggle navigation menu"
               className="md:hidden w-10 h-10 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-300 flex items-center justify-center"
            >
               {isNavMenuOpen ? (
                  <FaXmark size={24} className="text-blue-600" />
               ) : (
                  <FaBars size={24} className="text-blue-600" />
               )}
            </button>
            <div className="flex flex-row items-center gap-4 justify-center ">
               {categories.map((category) => (
                  <button
                     key={category.id}
                     onClick={() => handleCategoryClick(category.title)}
                     className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-md ${
                        activeSection === category.title
                           ? "bg-blue-600 text-white shadow-lg"
                           : "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                     }`}
                     aria-current={
                        activeSection === category.title ? "page" : undefined
                     }
                  >
                     {category.title}
                  </button>
               ))}
            </div>
         </div>
      </header>
   );
}

export default Navbar;
