import { useRouter } from "next/router";
import React from "react";

const ProductPage = () => {
   const router = useRouter();
   const { slug } = router.query;

   return (
      <div>
         <h1>Products for Model: {slug}</h1>
         {/* Add your product listing logic here */}
      </div>
   );
};

export default ProductPage;
