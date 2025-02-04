"use client";
import { usePathname } from "next/navigation";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
   const pathName = usePathname();
   if(pathName.includes("admin")) return null
   return (
      <footer className="bg-gray-900 text-white py-12  w-full">
         <div className="container mx-auto px-4">
            {/* Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {/* About Section */}
               <div className="space-y-4">
                  <h3 className="text-xl font-bold">About Us</h3>
                  <p className="text-gray-400">
                     We are dedicated to providing the best solutions for your
                     energy needs. Our products are designed to be reliable,
                     efficient, and sustainable.
                  </p>
               </div>

               {/* Quick Links Section */}
               <div className="space-y-4">
                  <h3 className="text-xl font-bold">Quick Links</h3>
                  <ul className="space-y-2">
                     <li>
                        <a
                           href="/batteries"
                           className="text-gray-400 hover:text-white transition-colors"
                        >
                           Batteries
                        </a>
                     </li>
                     <li>
                        <a
                           href="/ups"
                           className="text-gray-400 hover:text-white transition-colors"
                        >
                           UPS
                        </a>
                     </li>
                     <li>
                        <a
                           href="/inverters"
                           className="text-gray-400 hover:text-white transition-colors"
                        >
                           Inverters
                        </a>
                     </li>
                     <li>
                        <a
                           href="/avr"
                           className="text-gray-400 hover:text-white transition-colors"
                        >
                           AVR
                        </a>
                     </li>
                  </ul>
               </div>

               {/* Contact Section */}
               <div className="space-y-4">
                  <h3 className="text-xl font-bold">Contact Us</h3>
                  <ul className="space-y-2">
                     <li className="text-gray-400">Email: info@energica.com</li>
                     <li className="text-gray-400">Phone: +20 101 273 1091</li>
                     <li className="text-gray-400">
                        Address: 123 Energy St, Cairo, Egypt
                     </li>
                  </ul>
               </div>

               {/* Social Media Section */}
               <div className="space-y-4">
                  <h3 className="text-xl font-bold">Follow Us</h3>
                  <div className="flex space-x-4">
                     <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                     >
                        <FaFacebook size={24} />
                     </a>
                     <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                     >
                        <FaTwitter size={24} />
                     </a>
                     <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                     >
                        <FaInstagram size={24} />
                     </a>
                     <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                     >
                        <FaLinkedin size={24} />
                     </a>
                  </div>
               </div>
            </div>

            {/* Copyright Section */}
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
               <p className="text-gray-400">
                  &copy; {new Date().getFullYear()} Energica. All rights
                  reserved.
               </p>
            </div>
         </div>
      </footer>
   );
};

export default Footer;
