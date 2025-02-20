"use client";

import Image from "next/image";
import logo from "../../public/logo.png";
import searchIcon from "../../public/icons-search.svg";
import { useCallback, useEffect, useRef, useState } from "react";
// import { FaXmark, FaBars } from "react-icons/fa6";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import clsx from "clsx";
import useCategoryStore from "@/store/useCategoryStore";
import FloatingContactButton from "./FloatingContactButton";
import ScrollableButton from "./ScrollableButton";
// import { FaWhatsapp } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function Navbar() {
   // const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
   const [activeSection, setActiveSection] = useState<string | null>(null);
   const [searchQuery, setSearchQuery] = useState("");
   const pathname = usePathname();
   const {
      categories,
      fetchModelsForCategory,
      fetchSearchResults,
      searchResults,
      // models,
   } = useCategoryStore();
   const router = useRouter();
   // const [openCategory, setOpenCategory] = useState<number | null>(null);
   const buttonRef = useRef<HTMLDivElement>(null);
   const searchRef = useRef<HTMLDivElement>(null);
   const [isSearchOpen, setIsSearchOpen] = useState(false);

   useEffect(() => {
      if (
         searchResults.categories.length > 0 ||
         searchResults.models.length > 0 ||
         searchResults.products.length > 0
      ) {
         if (searchQuery.length > 0) {
            setIsSearchOpen(true);
         } else {
            setIsSearchOpen(false);
         }
      }
   }, [
      searchResults.categories.length,
      searchResults.models.length,
      searchQuery,
      searchResults.products.length,
   ]);

   // const handleToggle = (categoryId: number) => {
   //    setOpenCategory(
   //       String(openCategory) === String(categoryId) ? null : String(categoryId)
   //    );
   // };

   useEffect(() => {
      console.log("DEBUG-----------------------", activeSection);
   }, [activeSection]);

   const handleSearch = async (query: string) => {
      if (query.length > 0) {
         await fetchSearchResults(query);
      }
   };

   const handleSearchResultClick = (id: number, type: string) => {
      if (type === "category") {
         router.push(`/category#category-${id}`);
      } else if (type === "model") {
         router.push(`/category#model-${id}`);
      } else if (type === "product") {
         router.push(`/category#product-${id}`);
      }
      setIsSearchOpen(false);
      setSearchQuery("");
   };

   const handleClickOutside = (event: MouseEvent) => {
      if (
         buttonRef.current &&
         !buttonRef.current.contains(event.target as Node)
      ) {
         // setIsNavMenuOpen(false);
         // setOpenCategory(null);
      }
   };
   const handleClickOutsideSearch = (event: MouseEvent) => {
      if (
         searchRef.current &&
         !searchRef.current.contains(event.target as Node)
      ) {
         setIsSearchOpen(false);
      } else {
         setIsSearchOpen(true);
      }
   };

   useEffect(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("mousedown", handleClickOutsideSearch);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
         document.removeEventListener("mousedown", handleClickOutsideSearch);
      };
   }, []);

   const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
      handleSearch(query);
   };

   // Removed unused handleSearchResultClick function

   // Scroll to category section
   const handleCategoryClick = (categoryId: number) => {
      console.log("DEBUG: ~ handleCategoryClick ~ categoryId:", categoryId);
      const section = document.getElementById(`category-${categoryId}`);
      const navbarHeight = document.querySelector("header")?.offsetHeight || 0;
      console.log("DEBUG: ~ handleCategoryClick ~ navbarHeight:", navbarHeight);

      if (section) {
         window.scrollTo({
            top: section.offsetTop - navbarHeight - 44,
            behavior: "smooth",
         });
         setActiveSection(String(categoryId));
      }

      // setIsNavMenuOpen(false); // Close menu on mobile after click
      // setOpenCategory(null);
   };

   const handleScroll = useCallback(() => {
      let currentSection: number | null = null;
      const navbarHeight = document.querySelector("header")?.offsetHeight || 0;

      categories.forEach((category) => {
         const section = document.getElementById(`category-${category.id}`);
         if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= navbarHeight + 100 && rect.bottom >= navbarHeight) {
               currentSection = category.id;
            }
         }
      });

      setActiveSection(String(currentSection));
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
      if (categories.length > 0) {
         setActiveSection(String(categories[0].id));
      }
   }, [categories, fetchModelsForCategory]);
   if (pathname.includes("/admin")) return null;

   return (
      <motion.header
         initial={{ y: -100 }}
         animate={{ y: 0 }}
         className="fixed top-0 w-full z-50 bg-white xl:px-80 lg:px-40 md:px-20"
      >
         {/* First Row */}
         <div className="flex flex-row items-center justify-between px-4 py-2">
            <motion.div
               whileHover={{ scale: 1.1 }}
               transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
               <Link href="/" className="w-24 md:w-36">
                  <Image
                     height={100}
                     src={logo}
                     alt="logo"
                     className="cursor-pointer"
                  />
               </Link>
            </motion.div>

            <div
               className="relative flex items-center w-full max-w-md md:max-w-lg my-3 md:my-0 mx-2"
               ref={searchRef}
            >
               <Image
                  src={searchIcon}
                  alt="search"
                  className="absolute left-3 w-4 md:w-5 text-gray-400"
               />
               <Input
                  value={searchQuery}
                  onChange={(e) => {
                     handleSearchInputChange(e);
                     setIsSearchOpen(true);
                  }}
                  placeholder="Search ..."
                  className="pl-8 md:pl-10 pr-4"
               />

               <AnimatePresence>
                  {isSearchOpen && (
                     <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 w-full mt-1 z-10"
                     >
                        <Card className="max-h-60 overflow-y-auto">
                           {searchResults.categories.map((category) => (
                              <motion.div
                                 key={category.id}
                                 whileHover={{
                                    backgroundColor: "rgb(243 244 246)",
                                 }}
                                 className="px-4 py-2 cursor-pointer"
                                 onClick={() =>
                                    handleSearchResultClick(
                                       category.id,
                                       "category"
                                    )
                                 }
                              >
                                 {category.title}
                              </motion.div>
                           ))}
                           {/* Similar mapping for models and products */}
                           {searchResults.models.map((model) => (
                              <motion.div
                                 key={model.id}
                                 whileHover={{
                                    backgroundColor: "rgb(243 244 246)",
                                 }}
                                 className="px-4 py-2 cursor-pointer"
                                 onClick={() =>
                                    handleSearchResultClick(model.id, "model")
                                 }
                              >
                                 {model.title}
                              </motion.div>
                           ))}
                           {searchResults.products.map((product) => (
                              <motion.div
                                 key={product.id}
                                 whileHover={{
                                    backgroundColor: "rgb(243 244 246)",
                                 }}
                                 className="px-4 py-2 cursor-pointer"
                                 onClick={() =>
                                    handleSearchResultClick(
                                       product.id,
                                       "product"
                                    )
                                 }
                              >
                                 {`${product.title} ${product.rating_value} ${product.rating_unit}`}
                              </motion.div>
                           ))}
                        </Card>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>

            <div className="flex items-center gap-2">
               <FloatingContactButton />
            </div>
         </div>

         {/* Second Row */}
         <motion.div className="flex items-center justify-between px-4 md:px-8 lg:px-32 py-2 bg-white shadow-md">
            <div className="grid grid-cols-4 gap-1.5 w-full md:grid-cols-none md:flex md:flex-row">
               {categories.map((category) => (
                  <ScrollableButton
                     key={category.title}
                     title={category.title}
                     isActive={String(activeSection) === String(category.id)}
                     onClick={() => handleCategoryClick(category.id)}
                  />
               ))}
            </div>
         </motion.div>
      </motion.header>
   );
}

export default Navbar;
