import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaPhone, FaCommentDots } from "react-icons/fa";
import { FaEnvelope, FaXmark } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
   Tooltip,
   TooltipContent,
   TooltipProvider,
   TooltipTrigger,
} from "@/components/ui/tooltip";

const FloatingContactButton = () => {
   const [isOpen, setIsOpen] = useState(false);

   const toggleContactDetails = () => setIsOpen(!isOpen);

   const buttonVariants = {
      initial: { scale: 0.8, rotate: -180 },
      animate: { scale: 1, rotate: 0 },
      whileHover: { scale: 1.1 },
      whileTap: { scale: 0.95 },
   };

   const contactItems = [
      {
         icon: <FaEnvelope className="h-5 w-5 text-red-500" />,
         label: "Email",
         href: "mailto:Muhammadelshaer.energica@gmail.com",
         delay: 0.1,
      },
      {
         icon: <FaPhone className="h-5 w-5 text-blue-500" />,
         label: "Phone",
         href: "tel:+2001070708070",
         content: "01070708070",
         delay: 0.2,
      },
      {
         icon: <FaWhatsapp className="h-5 w-5 text-green-500" />,
         label: "WhatsApp",
         href: "https://wa.me/+2001066651786",
         content: "01066651786",
         delay: 0.3,
      },
   ];

   return (
      <div className="relative z-50">
         <TooltipProvider>
            <Tooltip>
               <TooltipTrigger asChild>
                  <motion.div
                     initial="initial"
                     animate="animate"
                     whileHover="whileHover"
                     whileTap="whileTap"
                     variants={buttonVariants}
                  >
                     <Button
                        onClick={toggleContactDetails}
                        size="icon"
                        className="rounded-full shadow-lg"
                        aria-label="Contact Me"
                        aria-expanded={isOpen}
                     >
                        <motion.div
                           animate={{ rotate: isOpen ? 180 : 0 }}
                           transition={{ duration: 0.3 }}
                        >
                           {isOpen ? (
                              <FaXmark className="h-4 w-4 md:h-5 md:w-5" />
                           ) : (
                              <FaCommentDots className="h-4 w-4 md:h-5 md:w-5" />
                           )}
                        </motion.div>
                     </Button>
                  </motion.div>
               </TooltipTrigger>
               <TooltipContent>
                  <p>Contact Us</p>
               </TooltipContent>
            </Tooltip>
         </TooltipProvider>

         <AnimatePresence>
            {isOpen && (
               <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 right-0 "
               >
                  <Card className="p-4 w-64 shadow-lg">
                     <motion.div className="space-y-3">
                        {contactItems.map((item) => (
                           <motion.div
                              key={item.label}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: item.delay }}
                              className="group"
                           >
                              <motion.a
                                 href={item.href}
                                 className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                 whileHover={{ x: 5 }}
                                 whileTap={{ scale: 0.98 }}
                              >
                                 <motion.div
                                    whileHover={{
                                       rotate: [0, -10, 10, -10, 0],
                                    }}
                                    transition={{ duration: 0.5 }}
                                 >
                                    {item.icon}
                                 </motion.div>
                                 <span className="text-gray-700 group-hover:text-blue-600">
                                    {item.content || item.label}
                                 </span>
                              </motion.a>
                           </motion.div>
                        ))}
                     </motion.div>
                  </Card>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default FloatingContactButton;
