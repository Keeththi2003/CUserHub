import React from "react";
import { Button } from "./Button";
import { Navigate, useNavigate } from "react-router-dom";


export const Navbar = ({isAuthorized}) => {
const navigate =useNavigate();

  return (
    <div>
      <nav className="bg-black text-white flex justify-between items-center p-5  min-w-full">
        <h1 className=" text-xl" onClick={()=>navigate("/dashboard")}>
          CUserHub
        </h1>
{
(isAuthorized) ? 
  
    <div>Keeththi</div>
  :
      
        <Button label={"Sign in"} type={`button`} onClick={()=>{navigate("/")}}></Button>
  
  
  
}
      </nav>
    </div>
  );
};
