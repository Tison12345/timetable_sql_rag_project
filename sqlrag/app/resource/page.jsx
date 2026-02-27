"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Resource() {

   const [msg, setMsg] = useState("Call Backend");

let router=useRouter();
async function handleSubmit(e) {
   e.preventDefault();

   try {
      const response = await axios.get(
         "http://localhost:8080/api/v1/hello",
         { withCredentials: true }
      );

      setMsg(response.data);

   } catch (error) {
      console.log(error.status);
      if (error.response && error.response.status === 403) {

         try {
            // Call refresh
            await axios.post(
               "http://localhost:8080/auth/refresh",
               {},
               { withCredentials: true }
            );

            // Retry original request
            const retryResponse = await axios.get(
               "http://localhost:8080/api/v1/hello",
               { withCredentials: true }
            );

            setMsg(retryResponse.data);

         } catch (refreshError) {
            setMsg("Unauthorized");
            router.push("/login");
         }

      } else {
         setMsg("Error occurred");
      }
   }
}

   

   return (
      <div>
         <button onClick={handleSubmit}>{msg}</button>
         
      </div>
   );
}