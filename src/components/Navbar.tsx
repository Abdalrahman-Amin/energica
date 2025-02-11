"use client";

import Image from "next/image";
import logo from "../../public/logo.png";
import searchIcon from "../../public/icons-search.svg";
import phoneIcon from "../../public/phone.svg";
import { useCallback, useEffect, useState } from "react";
import { FaXmark, FaBars } from "react-icons/fa6";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import clsx from "clsx";
import useCategoryStore from "@/store/useCategoryStore";

function Navbar() {
   const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
   const [activeSection, setActiveSection] = useState<string | null>(null);
   const [searchResults, setSearchResults] = useState<
      { id: number; title: string; slug: string; type: string }[]
      >([]);
      const [searchQuery, setSearchQuery] = useState("");
      const supabase = createClientComponentClient();
   const pathname = usePathname();
   console.log("DEBUG: ~ Navbar ~ pathname:", pathname);
   const { categories } = useCategoryStore();
   const router = useRouter();

   const handleSearch = async (query: string) => {
      if (query.length > 2) {
         const { data: products, error: productsError } = await supabase
            .from("products")
            .select("id, title, slug")
            .ilike("title", `%${query}%`);

         if (productsError) {
            console.error("Error fetching search results:", productsError);
            return;
         }

         setSearchResults([
            ...products.map((product) => ({ ...product, type: "product" })),
         ]);
      } else {
         setSearchResults([]);
      }
   };

   const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      handleSearch(query);
   };

   const handleSearchResultClick = (slug: string) => {
      router.push(`/product/${slug}`);
      setSearchQuery("");
      setSearchResults([]);
   };

   // Scroll to category section
   const handleCategoryClick = (categoryId: string) => {
      const section = document.getElementById(`category-${categoryId}`);
      const navbarHeight = document.querySelector("header")?.offsetHeight || 0;

      if (section) {
         window.scrollTo({
            top: section.offsetTop - navbarHeight,
            behavior: "smooth",
         });
         setActiveSection(categoryId);
      }

      setIsNavMenuOpen(false); // Close menu on mobile after click
   };

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

   if (pathname.includes("/admin")) return null;

   return (
      <header className="fixed top-0 w-full z-50 bg-white shadow-md">
         <div className="flex flex-col md:flex-row items-center justify-between px-4 md:px-8 lg:px-32 py-3">
            {/* Top Section (Logo & Search Bar) */}
            <div className="flex items-center justify-between w-full md:w-auto">
               {/* Logo */}
               <Link href="/" className="w-36">
                  <Image
                     height={100}
                     src={logo}
                     alt="logo"
                     className="cursor-pointer hover:scale-110 transition-transform"
                  />
               </Link>

               {/* Mobile Menu Button */}
               <button
                  onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
                  aria-expanded={isNavMenuOpen}
                  aria-label="Toggle navigation menu"
                  className="md:hidden w-10 h-10 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center justify-center"
               >
                  {isNavMenuOpen ? (
                     <FaXmark size={24} className="text-blue-600" />
                  ) : (
                     <FaBars size={24} className="text-blue-600" />
                  )}
               </button>
            </div>

            {/* Search Bar - Always Visible */}
            <div className="relative flex items-center w-full max-w-lg my-3 md:my-0">
               <Image
                  src={searchIcon}
                  alt="search"
                  className="absolute left-3 w-5 text-gray-400"
               />
               <input
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  placeholder="Search for products, models, or categories..."
                  type="text"
                  className="py-2 pl-10 pr-4 w-full rounded-xl border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
               />
               {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 z-10">
                     {searchResults.map((result) => (
                        <div
                           key={result.id}
                           onClick={() => handleSearchResultClick(result.slug)}
                           className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                           {result.title}
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Contact Info (Desktop Only) */}
            <div className="hidden md:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100">
               <Image src={phoneIcon} alt="phone-icon" className="w-4" />
               <p className="text-gray-700 font-medium">01012731091</p>
            </div>
         </div>

         {/* Navigation Buttons - Always Visible & Compact */}
         <div
            className={clsx(
               "bg-white shadow-md w-full overflow-x-auto scrollbar-hide",
               pathname !== "/" && "hidden"
            )}
         >
            <div className="flex flex-nowrap gap-2 px-4 md:px-8 lg:px-32 py-2 justify-center">
               {categories.map((category) => (
                  <button
                     key={category.id}
                     onClick={() => handleCategoryClick(category.title)}
                     className={`whitespace-nowrap px-4 py-2 text-sm md:text-base rounded-lg font-medium transition-all shadow-md bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white
                        
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
            <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden">
               <nav className="flex flex-col items-center gap-3 py-4">
                  {categories.map((category) => (
                     <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.title)}
                        className={`w-full text-center py-3 text-lg font-medium bg-blue-50 text-blue-600 hover:bg-blue-100
                        `}
                     >
                        {category.title}
                     </button>
                  ))}
               </nav>
            </div>
         )}
      </header>
   );
}

export default Navbar;
