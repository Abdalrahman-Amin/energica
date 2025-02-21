"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
   const pathName = usePathname();

   if (pathName.includes("admin")) return null;

   const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
         opacity: 1,
         y: 0,
         transition: {
            duration: 0.6,
            staggerChildren: 0.1,
         },
      },
   };

   const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: {
         opacity: 1,
         y: 0,
         transition: { duration: 0.4 },
      },
   };

   type IconProps = {
      className?: string;
      // Add other props that your icons might accept
   };

   const ContactItem = ({
      icon: Icon,
      href,
      children,
   }: {
      icon: React.ComponentType<React.PropsWithChildren<IconProps>>;
      href: string;
      children: React.ReactNode;
   }) => (
      <motion.li
         // variants={itemVariants}
         className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
         <Icon className="h-4 w-4" />
         {href ? (
            <a href={href} className="hover:underline">
               {children}
            </a>
         ) : (
            <span>{children}</span>
         )}
      </motion.li>
   );

   return (
      <motion.footer
         initial="hidden"
         whileInView="visible"
         viewport={{ once: true }}
         variants={containerVariants}
         className="bg-gray-900 text-white py-12 w-full"
      >
         <div className="container mx-auto px-4">
            <motion.div
               variants={containerVariants}
               className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
               {/* About Section */}
               <motion.div variants={itemVariants} className="space-y-4">
                  <motion.h3
                     variants={itemVariants}
                     className="text-xl font-bold relative inline-block"
                  >
                     About Us
                     <motion.div
                        className="absolute -bottom-1 left-0 h-0.5 bg-purple-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                     />
                  </motion.h3>
                  <motion.p variants={itemVariants} className="text-gray-400">
                     We are dedicated to providing the best solutions for your
                     energy needs. Our products are designed to be reliable,
                     efficient, and sustainable.
                  </motion.p>
               </motion.div>

               {/* Contact Section */}
               <motion.div variants={itemVariants} className="space-y-4 ">
                  <motion.h3
                     variants={itemVariants}
                     className="text-xl font-bold relative inline-block"
                  >
                     Contact Us
                     <motion.div
                        className="absolute -bottom-1 left-0 h-0.5 bg-purple-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                     />
                  </motion.h3>
                  <motion.ul variants={containerVariants} className="space-y-3">
                     <ContactItem
                        icon={Mail}
                        href="mailto:Muhammadelshaer.energica@gmail.com"
                     >
                        Muhammadelshaer.energica@gmail.com
                     </ContactItem>
                     <ContactItem icon={Phone} href="tel:+2001070708070">
                        +20 107 070 8070
                     </ContactItem>
                     <ContactItem
                        icon={MessageCircle}
                        href="https://wa.me/+2001066651786"
                     >
                        Whatsapp: 01066651786
                     </ContactItem>
                     <ContactItem icon={MapPin} href="#">
                        33 Youssef El seddik St, Behind Elgharbiyya Governate
                     </ContactItem>
                  </motion.ul>
               </motion.div>
            </motion.div>

            <Separator className="my-8 bg-gray-800" />

            <motion.div variants={itemVariants} className="text-center">
               <p className="text-gray-400">
                  &copy; {new Date().getFullYear()} Energica. All rights
                  reserved.
               </p>
            </motion.div>
         </div>
      </motion.footer>
   );
};

export default Footer;
