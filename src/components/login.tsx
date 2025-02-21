"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const LoginPage = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const supabase = createClientComponentClient();
   const router = useRouter();

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
         const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
         });

         if (error) throw error;

         // Redirect to the admin dashboard after successful login
         router.push("/admin/dashboard");
      } catch (error) {
         setError("Invalid email or password.");
         console.error("Login error:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
         {/* Login Card Container */}
         <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md text-center transform transition-all duration-300 hover:shadow-2xl">
            {/* Login Header */}
            <h1 className="text-4xl font-bold text-gray-800 mb-8">
               Admin Login
            </h1>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
               {/* Email Input Field */}
               <div className="flex flex-col gap-2">
                  <label
                     htmlFor="email"
                     className="text-sm font-medium text-gray-600 text-left"
                  >
                     Email
                  </label>
                  <input
                     type="email"
                     id="email"
                     placeholder="Enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                     required
                  />
               </div>

               {/* Password Input Field */}
               <div className="flex flex-col gap-2">
                  <label
                     htmlFor="password"
                     className="text-sm font-medium text-gray-600 text-left"
                  >
                     Password
                  </label>
                  <input
                     type="password"
                     id="password"
                     placeholder="Enter your password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all duration-200"
                     required
                  />
               </div>

               {/* Login Button */}
               <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
               >
                  {loading ? (
                     <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                        Logging in...
                     </div>
                  ) : (
                     "Login"
                  )}
               </button>

               {/* Error Message Display */}
               {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </form>
         </div>
      </div>
   );
};

export default LoginPage;
