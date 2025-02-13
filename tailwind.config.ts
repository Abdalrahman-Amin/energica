import type { Config } from "tailwindcss";

export default {
   darkMode: "class", // or "media"
   content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
   ],
   theme: {
      extend: {
         colors: {},
      },
   },
   plugins: [],
} satisfies Config;
