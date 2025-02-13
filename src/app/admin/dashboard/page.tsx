"use client";
// import BackButton from "@/components/BackButton";
import AdminDashboard from "@/components/dashboard";
import withAdminAuth from "@/components/withAdminAuth";
import { useEffect } from "react";
const ProtectedAdminDashboard = withAdminAuth(AdminDashboard);
export default function Dashboard() {
   useEffect(() => {
      return () => {
         console.log("unmounting");
      };
   });
   return (
      <>
         <ProtectedAdminDashboard />
      </>
   );
}
