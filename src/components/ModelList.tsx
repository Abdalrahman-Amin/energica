import React, { useEffect, useRef, useState } from "react";
import ModelCard from "./ModelCard";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Model } from "@/types/types";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ModelListProps {
   models: Model[];
   categorySlug: string;
}

const ModelList: React.FC<ModelListProps> = ({ models, categorySlug }) => {
   const containerRef = useRef<HTMLDivElement | null>(null);
   const [canScrollLeft, setCanScrollLeft] = useState(false);
   const [canScrollRight, setCanScrollRight] = useState(true);

   // Check scroll position to toggle navigation buttons
   const checkOverflow = () => {
      if (!containerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
   };

   // Scroll Functions
   const scrollLeft = () => {
      containerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
   };

   const scrollRight = () => {
      containerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
   };

   // Add event listener to update button visibility
   useEffect(() => {
      checkOverflow();
      const container = containerRef.current;
      if (!container) return;
      container.addEventListener("scroll", checkOverflow);
      return () => container.removeEventListener("scroll", checkOverflow);
   }, []);

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, ease: "easeOut" }}
         className="relative px-4"
      >
         {/* Background Gradient */}
         <div className="absolute inset-x-0 h-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-50/50 via-blue-100/20 to-blue-50/50 blur-2xl -z-10" />

         {/* Scrollable Cards */}
         <div
            ref={containerRef}
            className="models flex overflow-x-auto gap-4 py-8 px-2 hide-scrollbar scroll-smooth 
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
         >
            {models.map((model) => (
               <motion.div
                  key={model.id}
                  className="first:ml-0 last:mr-0"
                  whileHover={{ scale: 1.05 }}
               >
                  <ModelCard model={model} categorySlug={categorySlug} />
               </motion.div>
            ))}
         </div>

         {/* Scroll Buttons */}
         {canScrollLeft && (
            <Button
               onClick={scrollLeft}
               variant="ghost"
               size="icon"
               className="absolute -left-2 top-1/2 -translate-y-1/2 
            w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm 
            text-blue-600 flex items-center justify-center 
            shadow-md shadow-black/5 ring-1 ring-black/5
            transition-all duration-200 hover:bg-white hover:text-blue-700
            active:scale-95 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:ring-offset-2 
            disabled:opacity-50 disabled:cursor-not-allowed z-10"
               aria-label="Scroll left"
            >
               <FaArrowLeft className="w-4 h-4" />
            </Button>
         )}

         {canScrollRight && (
            <Button
               onClick={scrollRight}
               variant="ghost"
               size="icon"
               className="absolute -right-2 top-1/2 -translate-y-1/2 
            w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm 
            text-blue-600 flex items-center justify-center 
            shadow-md shadow-black/5 ring-1 ring-black/5
            transition-all duration-200 hover:bg-white hover:text-blue-700
            active:scale-95 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:ring-offset-2 
            disabled:opacity-50 disabled:cursor-not-allowed z-10"
               aria-label="Scroll right"
            >
               <FaArrowRight className="w-4 h-4" />
            </Button>
         )}
      </motion.div>
   );
};

export default ModelList;
