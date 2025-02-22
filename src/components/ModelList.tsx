import React, { useEffect, useRef, useState } from "react";
import ModelCard from "./ModelCard";
import { motion, AnimatePresence } from "framer-motion";
import { Model } from "@/types/types";
import { Button } from "@/components/ui/button";
import {
   ChevronLeft,
   ChevronRight,
   ChevronDown,
   ChevronUp,
} from "lucide-react";

interface ModelListProps {
   models: Model[];
   categorySlug: string;
}

const ModelList: React.FC<ModelListProps> = ({ models, categorySlug }) => {
   const containerRef = useRef<HTMLDivElement | null>(null);
   const [canScrollLeft, setCanScrollLeft] = useState(false);
   const [canScrollRight, setCanScrollRight] = useState(true);
   const [isExpanded, setIsExpanded] = useState(false);

   const ITEMS_PER_ROW = 4;
   const INITIAL_ROWS = 2;
   const initialVisibleItems = ITEMS_PER_ROW * INITIAL_ROWS;

   const checkOverflow = () => {
      const container = containerRef.current;
      if (container) {
         const { scrollLeft, scrollWidth, clientWidth } = container;
         setCanScrollLeft(scrollLeft > 0);
         setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
   };

   const scrollLeft = () => {
      containerRef.current?.scrollBy({ left: -280, behavior: "smooth" });
   };

   const scrollRight = () => {
      containerRef.current?.scrollBy({ left: 280, behavior: "smooth" });
   };

   useEffect(() => {
      checkOverflow();
      window.addEventListener("resize", checkOverflow);
      return () => window.removeEventListener("resize", checkOverflow);
   }, []);

   const visibleModels = isExpanded
      ? models
      : models.slice(0, initialVisibleItems);

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5 }}
         className="relative py-8"
      >
         {/* Background Gradient */}
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="absolute inset-x-0 h-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-50/50 via-blue-100/20 to-blue-50/50 blur-2xl -z-10"
         />

         {/* Mobile View */}
         <div className="block xl:hidden">
            <div className="relative">
               <div
                  ref={containerRef}
                  className="flex overflow-x-auto gap-4 -mx-3 px-3 hide-scrollbar scroll-smooth 
                  [scrollbar-width:none] [-ms-overflow-style:none] 
                  [&::-webkit-scrollbar]:hidden"
                  onScroll={checkOverflow}
               >
                  <AnimatePresence>
                     {models.map((model, index) => (
                        <motion.div
                           key={model.id}
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: index * 0.1 }}
                           className="flex-shrink-0 w-[280px]"
                        >
                           <ModelCard
                              model={model}
                              categorySlug={categorySlug}
                           />
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>

               <AnimatePresence>
                  {canScrollLeft && (
                     <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-10"
                     >
                        <Button
                           onClick={scrollLeft}
                           variant="outline"
                           size="icon"
                           className="rounded-full w-10 h-10 bg-white shadow-lg"
                        >
                           <ChevronLeft className="w-4 h-4" />
                        </Button>
                     </motion.div>
                  )}

                  {canScrollRight && (
                     <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute -right-2 top-1/2 -translate-y-1/2 z-10"
                     >
                        <Button
                           onClick={scrollRight}
                           variant="outline"
                           size="icon"
                           className="rounded-full w-10 h-10 bg-white shadow-lg"
                        >
                           <ChevronRight className="w-4 h-4" />
                        </Button>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>

         {/* Desktop View */}
         <div className="hidden xl:block">
            <div className="grid grid-cols-4 gap-x-8 gap-y-10">
               <AnimatePresence>
                  {visibleModels.map((model, index) => (
                     <div key={model.id} className="w-full">
                        <motion.div
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.1 }}
                           className="h-full"
                        >
                           <ModelCard
                              model={model}
                              categorySlug={categorySlug}
                           />
                        </motion.div>
                     </div>
                  ))}
               </AnimatePresence>
            </div>

            {models.length > initialVisibleItems && (
               <div className="mt-8 text-center">
                  <Button
                     onClick={() => setIsExpanded(!isExpanded)}
                     variant="outline"
                     className="gap-2 px-6"
                  >
                     {isExpanded ? (
                        <>
                           See Less <ChevronUp className="w-4 h-4" />
                        </>
                     ) : (
                        <>
                           See More <ChevronDown className="w-4 h-4" />
                        </>
                     )}
                  </Button>
               </div>
            )}
         </div>
      </motion.div>
   );
};

export default ModelList;
