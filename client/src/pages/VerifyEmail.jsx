import React from "react";
import { sendEmail } from "../APIs/backend.api";

function VerifyEmail() {
  const handleVerifyEmail = async () => {
    const result = await sendEmail("GET");
    if(result.status === 200) {
      console.log("Email sent successfully");
    }
  };
  return <div className="bg-neutral-700 p-4 rounded-full top-20 relative w-fit cursor-pointer" onClick={handleVerifyEmail}>Verify Email</div>;
}

export default VerifyEmail;
