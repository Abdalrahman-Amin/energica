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
         const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
         });
         console.log("DEBUG: ~ handleLogin:", data);

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 p-6">
         <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md text-center">
            <h1 className="text-3xl font-extrabold text-blue-700 mb-6">
               Admin Login
            </h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
               <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
               />
               <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
               />
               <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md disabled:bg-gray-400"
               >
                  {loading ? "Logging in..." : "Login"}
               </button>
               {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
         </div>
      </div>
   );
};

export default LoginPage;
