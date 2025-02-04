import BackButton from "@/components/BackButton";
import AdminLogin from "@/components/login";

export default function Login() {
   return (
      <>
         <div style={{ position: "absolute", top: "10px", left: "10px" }}>
            <BackButton />
         </div>
         <AdminLogin />
      </>
   );
}
