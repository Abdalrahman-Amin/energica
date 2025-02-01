"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const withAdminAuth = (WrappedComponent: React.ComponentType) => {
   const AuthenticatedComponent = (
      props: React.ComponentProps<typeof WrappedComponent>
   ) => {
      const [isLoading, setIsLoading] = useState(true);
      const [isAuthenticated, setIsAuthenticated] = useState(false);
      const supabase = createClientComponentClient();
      const router = useRouter();

      useEffect(() => {
         const checkAuth = async () => {
            const {
               data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
               router.push("/admin/login");
            } else {
               setIsAuthenticated(true);
            }
            setIsLoading(false);
         };

         checkAuth();
      }, [supabase, router]);

      if (isLoading) {
         return <div>Loading...</div>;
      }

      if (!isAuthenticated) {
         return null;
      }

      return <WrappedComponent {...props} />;
   };

   return AuthenticatedComponent;
};

export default withAdminAuth;
