"use client"; // Mark this as a Client Component
import { useRouter } from "next/navigation";

export default function BackButton({ text = "Go Back", icon = true }) {
   const router = useRouter();

   return (
      <button
         onClick={() => router.back()}
         className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 active:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
         aria-label="Go back to the previous page"
      >
         <span className="flex items-center justify-center space-x-2">
            {icon && (
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
               >
                  <path
                     fillRule="evenodd"
                     d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                     clipRule="evenodd"
                  />
               </svg>
            )}
            <span>{text}</span>
         </span>
      </button>
   );
}
