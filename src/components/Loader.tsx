import React from "react";
import clsx from "clsx";
interface LoaderProps {
   size?: "sm" | "md" | "lg";
}
const Loader: React.FC<LoaderProps> = ({ size }) => {
   return (
      <div className="flex justify-center items-center h-screen">
         <div
            className={clsx(
               "animate-spin rounded-full border-t-4 border-b-4 border-blue-500",
               size === "sm"
                  ? "w-6 h-6"
                  : size === "md"
                  ? "w-8 h-8"
                  : "w-12 h-12"
            )}
         ></div>
      </div>
   );
};

export default Loader;
