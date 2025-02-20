"use client";

import { Model, Product } from "@/types/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
   ChevronLeft,
   ChevronRight,
   Download,
   MessageCircle,
} from "lucide-react";

export const ModelSection = ({
   model,
   products,
   handleWhatsAppClick,
}: {
   model: Model;
   products: Product[];
   handleWhatsAppClick: (params: { product: Product | null }) => void;
}) => {
   const containerRef = useRef<HTMLDivElement>(null);
   const [canScrollLeft, setCanScrollLeft] = useState(false);
   const [canScrollRight, setCanScrollRight] = useState(false);

   const checkOverflow = () => {
      const container = containerRef.current;
      if (container) {
         const { scrollLeft, scrollWidth, clientWidth } = container;
         setCanScrollLeft(scrollLeft > 0);
         setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      }
   };

   const scrollLeft = () => {
      const container = containerRef.current;
      if (container) {
         container.scrollBy({ left: -280, behavior: "smooth" });
      }
   };

   const scrollRight = () => {
      const container = containerRef.current;
      if (container) {
         container.scrollBy({ left: 280, behavior: "smooth" });
      }
   };

   useEffect(() => {
      checkOverflow();
      window.addEventListener("resize", checkOverflow);
      return () => window.removeEventListener("resize", checkOverflow);
   }, []);

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5 }}
         className="mb-12"
         id={`model-${model.id}`}
         key={`${model.id}-${model.title}`}
      >
         <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="model-section flex items-center justify-between mb-6"
         >
            <h3 className="text-xl font-semibold text-gray-700 pl-4 border-l-4 border-blue-500">
               {model.title}
            </h3>
         </motion.div>

         <div className="relative -mx-4 px-4">
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.5 }}
               className="absolute inset-x-0 h-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-50/50 via-blue-100/20 to-blue-50/50 blur-2xl -z-10"
            />

            <div
               ref={containerRef}
               className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 hide-scrollbar scroll-smooth 
              [scrollbar-width:none] [-ms-overflow-style:none] 
              [&::-webkit-scrollbar]:hidden"
               onScroll={checkOverflow}
            >
               <AnimatePresence>
                  {products.map((product, index) => (
                     <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex-shrink-0 w-[280px]"
                     >
                        <Card className="h-full transition-all duration-300 hover:shadow-lg">
                           <div className="relative h-48 overflow-hidden bg-gray-50">
                              <motion.div
                                 whileHover={{ scale: 1.05 }}
                                 transition={{ duration: 0.3 }}
                              >
                                 <a
                                    href={product.image}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block h-full w-full"
                                 >
                                    <Image
                                       src={product.image}
                                       alt={product.title}
                                       width={280}
                                       height={192}
                                       className="w-full h-full object-cover"
                                    />
                                 </a>
                              </motion.div>
                              {product.rating_value && (
                                 <Badge
                                    variant="secondary"
                                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm"
                                 >
                                    {product.rating_value} {product.rating_unit}
                                 </Badge>
                              )}
                           </div>

                           <CardContent className="p-4 space-y-3">
                              <div className="space-y-1.5">
                                 <h4 className="font-semibold text-gray-900 leading-tight">
                                    {product.title}
                                 </h4>
                                 <p className="text-xs text-gray-600 line-clamp-2">
                                    {product.description}
                                 </p>
                              </div>

                              <div className="flex gap-2">
                                 <Button
                                    onClick={() =>
                                       handleWhatsAppClick({ product })
                                    }
                                    className="flex-1"
                                    variant="default"
                                    size="sm"
                                 >
                                    <MessageCircle className="w-4 h-4 mr-1.5" />
                                    WhatsApp
                                 </Button>

                                 {product.data_sheet && (
                                    <Button
                                       asChild
                                       className="flex-1"
                                       variant="secondary"
                                       size="sm"
                                    >
                                       <a
                                          href={product.data_sheet}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                       >
                                          <Download className="w-4 h-4 mr-1.5" />
                                          Data Sheet
                                       </a>
                                    </Button>
                                 )}
                              </div>
                           </CardContent>
                        </Card>
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
                  >
                     <Button
                        onClick={scrollLeft}
                        variant="outline"
                        size="icon"
                        className="absolute -left-2 top-1/2 -translate-y-1/2 rounded-full w-10 h-10"
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
                  >
                     <Button
                        onClick={scrollRight}
                        variant="outline"
                        size="icon"
                        className="absolute -right-2 top-1/2 -translate-y-1/2 rounded-full w-10 h-10"
                     >
                        <ChevronRight className="w-4 h-4" />
                     </Button>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </motion.div>
   );
};
