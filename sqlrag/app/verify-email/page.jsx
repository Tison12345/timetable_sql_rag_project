"use client";

import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function VerifyEmailPage() {

const router = useRouter();

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        console.log("Token received for email verification:", token);
        axios.post(`${process.env.NEXT_PUBLIC_BACKENDURL}/auth/verify-token?token=${token}`)
        .then((res)=>{
            console.log("Email verification successful:", res.data);
            router.push("/login");
            // Optionally, you can redirect the user to the login page or show a success message
        })
        .catch((err)=>{
            console.error("Email verification failed:", err.response ? err.response.data : err.message);
            // Optionally, you can show an error message to the user
        })
    },[])
    return(
        <div>verifying email</div>
    )
}

 