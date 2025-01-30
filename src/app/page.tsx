import Category from "@/components/Category";
import React from "react";
import { Category as categoryType } from "@/types/types";

const categories: categoryType[] = [
   {
      id: 1,
      title: "Batteries",
      slug: "batteries",
      image: "https://picsum.photos/200/300",
   },
   { id: 2, title: "UPS", slug: "ups", image: "https://picsum.photos/200/300" },
   {
      id: 3,
      title: "Inverters",
      slug: "inverters",
      image: "https://picsum.photos/200/300",
   },
   { id: 4, title: "AVR", slug: "avr", image: "https://picsum.photos/200/300" },
];

export default function Home() {
   return (
      <div className="">
         <main className="">
            {categories.map((category) => (
               <section
                  id={`category-${category.id}`}
                  className="section"
                  key={category.id}
               >
                  <Category category={category} />
               </section>
            ))}
         </main>
      </div>
   );
}
