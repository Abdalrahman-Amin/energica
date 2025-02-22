"use client";
// import BackButton from "@/components/BackButton";
import AdminDashboard from "@/components/dashboard";
import withAdminAuth from "@/components/withAdminAuth";
const ProtectedAdminDashboard = withAdminAuth(AdminDashboard);
export default function Dashboard() {
   return (
      <>
         <ProtectedAdminDashboard />
      </>
   );
}
