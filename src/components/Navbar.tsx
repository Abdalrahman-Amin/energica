"use client";

import Image from "next/image";
import logo from "../../public/logo.png";
import searchIcon from "../../public/icons-search.svg";
import { useCallback, useEffect, useRef, useState } from "react";
// import { FaXmark, FaBars } from "react-icons/fa6";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import useCategoryStore from "@/store/useCategoryStore";
import FloatingContactButton from "./FloatingContactButton";
import { FaWhatsapp } from "react-icons/fa";

function Navbar() {
   const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
   const [activeSection, setActiveSection] = useState<string | null>(null);
   const [searchQuery, setSearchQuery] = useState("");
   const pathname = usePathname();
   const {
      categories,
      fetchModelsForCategory,
      fetchSearchResults,
      searchResults,
      models,
   } = useCategoryStore();
   const router = useRouter();
   const [openCategory, setOpenCategory] = useState<number | null>(null);
   const buttonRef = useRef<HTMLDivElement>(null);
   const [isSearchOpen, setIsSearchOpen] = useState(false);

   useEffect(() => {
      if (
         searchResults.categories.length > 0 ||
         searchResults.models.length > 0
         // ||
         // searchResults.products.length > 0
      ) {
         setIsSearchOpen(true);
      }
   }, [searchResults.categories.length, searchResults.models.length]);

   const handleToggle = (categoryId: number) => {
      setOpenCategory(openCategory === categoryId ? null : categoryId);
   };

   const handleSearch = async (query: string) => {
      if (query.length > 2) {
         await fetchSearchResults(query);
      }
   };

   const handleSearchResultClick = (query: string, type: string) => {
      if (type === "category") {
         router.push(`/category/${query}`);
      } else if (type === "model") {
         router.push(`/model/${query}`);
      }
      setIsSearchOpen(false);
      setSearchQuery("");
   };

   const handleClickOutside = (event: MouseEvent) => {
      if (
         buttonRef.current &&
         !buttonRef.current.contains(event.target as Node)
      ) {
         setIsNavMenuOpen(false);
         setOpenCategory(null);
      }
   };

   useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      handleSearch(query);
   };

   // Removed unused handleSearchResultClick function

   // Scroll to category section
   const handleCategoryClick = (categoryId: string) => {
      if (pathname !== "/") {
         setActiveSection(categoryId);
         router.push(`/`);
         setTimeout(() => {
            const section = document.getElementById(`category-${categoryId}`);
            const navbarHeight =
               document.querySelector("header")?.offsetHeight || 0;
            if (section) {
               window.scrollTo({
                  top: section.offsetTop - navbarHeight,
                  behavior: "smooth",
               });
            }
         }, 500);
      }
      const section = document.getElementById(`category-${categoryId}`);
      const navbarHeight = document.querySelector("header")?.offsetHeight || 0;

      if (section) {
         window.scrollTo({
            top: section.offsetTop - navbarHeight,
            behavior: "smooth",
         });
         // setActiveSection(categoryId);
      }

      setIsNavMenuOpen(false); // Close menu on mobile after click
      setOpenCategory(null);
   };

   const handleScroll = useCallback(() => {
      let currentSection: string | null = null;
      const navbarHeight = document.querySelector("header")?.offsetHeight || 0;

      categories.forEach((category) => {
         const section = document.getElementById(`category-${category.title}`);
         if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= navbarHeight + 100 && rect.bottom >= navbarHeight) {
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

   useEffect(() => {
      categories.forEach((category) => {
         fetchModelsForCategory(category.id);
      });
   }, [categories, fetchModelsForCategory]);
   if (pathname.includes("/admin")) return null;

   return (
      <header className="fixed top-0 w-full z-50 bg-white shadow-md xl:px-80 lg:px-40 md:px-20">
         {/* First Row: Logo, Search Bar, and Contact Info */}
         <div className="flex flex-row items-center justify-between px-4  py-2">
            {/* Logo */}
            <Link href="/" className="w-24 md:w-36">
               <Image
                  height={100}
                  src={logo}
                  alt="logo"
                  className="cursor-pointer hover:scale-110 transition-transform"
               />
            </Link>

            {/* Search Bar */}
            <div className="relative flex items-center w-full max-w-md md:max-w-lg my-3 md:my-0 mx-2">
               <Image
                  src={searchIcon}
                  alt="search"
                  className="absolute left-3 w-4 md:w-5 text-gray-400"
               />
               <input
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search ..."
                  type="text"
                  className="py-1 md:py-2 pl-8 md:pl-10 pr-4 w-full rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-sm md:text-base"
               />
               {isSearchOpen ? (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 z-10">
                     {searchResults.categories.map((category) => (
                        <div
                           key={category.id}
                           className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                           onClick={() =>
                              handleSearchResultClick(
                                 category.title,
                                 "category"
                              )
                           }
                        >
                           {category.title}
                        </div>
                     ))}
                     {searchResults.models.map((model) => (
                        <div
                           key={model.id}
                           className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                           onClick={() =>
                              handleSearchResultClick(
                                 model.id.toString(),
                                 "model"
                              )
                           }
                        >
                           {model.title}
                        </div>
                     ))}
                  </div>
               ) : null}
            </div>

            {/* Contact Info (Visible on Mobile and Desktop) */}
            <div className="flex items-center gap-2">
               {/* WhatsApp Contact */}
               <div className="flex items-center gap-1 md:gap-2 bg-blue-50 px-1 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-blue-100 transition-all duration-200 ease-in-out shadow-sm hover:shadow-md">
                  <FaWhatsapp className="h-3 w-3 md:h-5 md:w-5 text-green-500 flex-shrink-0" />
                  <a
                     className="text-gray-700 font-medium text-[0.5rem] md:text-base hover:text-blue-600 transition-colors duration-200"
                     href="https://wa.me/+2001066651786"
                     target="_blank"
                     rel="noopener noreferrer"
                  >
                     01066651786
                  </a>
               </div>

               {/* Floating Contact Button */}
               <FloatingContactButton />
            </div>
         </div>

         {/* Second Row: Toggle Button and Navigation Buttons */}
         <div className="flex items-center justify-between px-4 md:px-8 lg:px-32 py-2 bg-white shadow-md">
            {/* Mobile Menu Button */}
            {/* <button
               onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
               aria-expanded={isNavMenuOpen}
               aria-label="Toggle navigation menu"
               className="md:hidden w-8 h-8 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center justify-center"
            >
               {isNavMenuOpen ? (
                  <FaXmark size={20} className="text-blue-600" />
               ) : (
                  <FaBars size={20} className="text-blue-600" />
               )}
            </button> */}

            {/* Navigation Buttons - Always Visible & Compact */}
            <div
               className={clsx(
                  "flex flex-nowrap gap-1 md:gap-2 justify-center w-full"
                  // pathname !== "/" && "hidden"
               )}
            >
               {categories.map((category) => (
                  <button
                     key={category.id}
                     onClick={() => handleCategoryClick(category.title)}
                     className={`whitespace-nowrap px-3 py-1 text-xs md:text-sm rounded-lg font-medium transition-all shadow-md bg-blue-50 text-blue-600 
                  ${
                     activeSection === category.title
                        ? "bg-blue-500 text-white"
                        : ""
                  }`}
                  >
                     {category.title}
                  </button>
               ))}
            </div>
         </div>

         {/* Mobile Menu (Dropdown) */}
         {isNavMenuOpen && (
            <div
               className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden z-50"
               ref={buttonRef}
            >
               <nav className="flex flex-col items-center gap-3 py-4">
                  {categories.map((category) => (
                     <div
                        key={category.id}
                        className="w-full px-4 border-b border-gray-100 last:border-b-0"
                     >
                        {/* Clickable Category Header */}
                        <button
                           onClick={() => handleToggle(category.id)}
                           className="w-full text-left text-xl font-semibold text-gray-800 flex justify-between items-center py-3 hover:bg-gray-50 rounded-lg transition-all duration-200 ease-in-out"
                        >
                           <span>{category.title}</span>
                           <span className="text-gray-500 transform transition-transform duration-200">
                              {openCategory === category.id ? "▲" : "▼"}
                           </span>
                        </button>

                        {/* Show models if the category is open */}
                        {openCategory === category.id && (
                           <ul className="mt-2 pl-6 text-gray-600 space-y-2">
                              {models[category.id]?.map((model) => (
                                 <Link
                                    key={model.id}
                                    href={`/model/${model.id}`}
                                    passHref
                                    onClick={() => {
                                       setIsNavMenuOpen(false);
                                       setOpenCategory(null);
                                    }}
                                 >
                                    <li
                                       key={model.id}
                                       className="text-base hover:text-blue-600 hover:bg-gray-50 px-3 py-1.5 rounded-md transition-all duration-200 ease-in-out"
                                    >
                                       {model.title}
                                    </li>
                                 </Link>
                              ))}
                           </ul>
                        )}
                     </div>
                  ))}
               </nav>
            </div>
         )}
      </header>
   );
}

export default Navbar;
