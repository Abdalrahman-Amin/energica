"use client";
import BackButton from "@/components/BackButton";
import AdminDashboard from "@/components/dashboard";
export default function Dashboard() {
   return (
      <>
         <div style={{ position: "absolute", top: "10px", left: "10px" }}>
            <BackButton />
         </div>
         <AdminDashboard />
      </>
   );
}
