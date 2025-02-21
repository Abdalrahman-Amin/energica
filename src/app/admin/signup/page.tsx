"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

const SignUpPage = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const supabase = createClientComponentClient();
   const router = useRouter();

   const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
         const { error } = await supabase.auth.signUp({
            email,
            password,
         });

         if (error) throw error;

         // Redirect to the login page after successful sign-up
         router.push("/admin/login");
      } catch (error) {
         setError("Error signing up. Please try again.");
         console.error("Sign-up error:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
         <div style={{ position: "absolute", top: "10px", left: "10px" }}>
            <BackButton />
         </div>
         <h1 className="text-2xl font-bold mb-4">Admin Sign Up</h1>
         <form
            onSubmit={handleSignUp}
            className="flex flex-col gap-4 bg-white p-8 rounded-lg shadow-md"
         >
            <input
               type="email"
               placeholder="Email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="px-4 py-2 border rounded-lg"
               required
            />
            <input
               type="password"
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="px-4 py-2 border rounded-lg"
               required
            />
            <button
               type="submit"
               disabled={loading}
               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
               {loading ? "Signing up..." : "Sign Up"}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
         </form>
      </div>
   );
};

export default SignUpPage;
