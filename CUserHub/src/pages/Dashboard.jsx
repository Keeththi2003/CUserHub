import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";

export const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/users")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div className=" bg-black min-h-full">
      <Navbar isAuthorized={false}></Navbar>
      <h1 className="font-medium text-2xl text-center">User Details</h1>
      <div className="flex flex-wrap justify-evenly items-start m-10 gap-4 ">

         {data.map(user => (
        <div key={user.id}className="flex flex-col bg-neutral-900 p-10 rounded-md gap-3  ">
          <p className="text-md">ID : {user.id}</p>
          <p className="text-md">Name : {user.fname} </p>
          <p className="text-md">Email : {user.email}</p>
          <p className="text-md">Phone : {user.phone}</p>
        </div>))}
      </div>
    </div>
  );
};
