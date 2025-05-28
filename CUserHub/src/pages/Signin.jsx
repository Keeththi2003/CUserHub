import React, { useState } from "react";
import { Button } from "../components/Button";
import { FaChevronLeft, FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export const Signin = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState({
    pwd: false,
    cpwd: false,
  });
  const [errors, setErrors] = useState({
    fname: "",
    lname: "",
    email: "",
    pwd: "",
    cpwd: "",
    phone: "",
  });
  const [inputs, setInputs] = useState({
    fname: "",
    lname: "",
    email: "",
    pwd: "",
    cpwd: "",
    phone: "+94",
  });

  const togglePassword = (name) => {
    setShowPassword((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };
  // console.log(inputs);
  // console.log(errors);

  const handleSubmit = (e) => {
    console.log(inputs)
    e.preventDefault();

    const newErrors = {};

    if (!inputs.fname.trim()) {
      newErrors.fname = "First Name is required";
    }
    if (!inputs.lname.trim()) {
      newErrors.lname = "Last Name is required";
    }
    if (!inputs.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(inputs.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!inputs.pwd.trim()) {
      newErrors.pwd = "Password is required";
    } else if (inputs.pwd.length < 8) {
      newErrors.pwd = "Password must be at least 8 characters";
    }

    if (!inputs.cpwd) {
      newErrors.cpwd = "Confirm Password is required";
    } else if (inputs.pwd !== inputs.cpwd) {
      newErrors.cpwd = "Passwords do not match";
    }
    if (!/^\+94\d{9}$/.test(inputs.phone)) {
      newErrors.phone = "Phone number must be in +94XXXXXXXXX format";
    }

    setErrors(newErrors);

    // console.log(newErrors)

    if(Object.keys(newErrors).length == 0){

      fetch('http://localhost:8080/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(inputs).toString()
    })
    .then(response => response.text()  
    )
    .then(data => {
      console.log("Server says:", data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
    }

    
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-980">
      <FaChevronLeft className="absolute top-0 left-0 ml-8 mt-8 text-white hover:cursor-pointer" onClick={()=> navigate(-1)}></FaChevronLeft>

      <div className="border px-16 py-8 rounded-2xl w-full max-w-lg m-4">
        <h2 className="text-2xl font-medium text-center mb-4">Sign In</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="fname" className="block mb-1">
              First Name
            </label>
            <input
              type="text"
              className="w-full bg-inherit px-4 py-2 border rounded-lg  placeholder:text-neutral-400 "
              placeholder="Enter your Firstname"
              name="fname"
              value={inputs.fname}
              onChange={handleChange}
            />
            <p
              className={`text-red-500 mt-2 text-sm transition-all duration-300 ${
                errors.fname
                  ? "opacity-100 h-auto"
                  : "opacity-0 h-0 overflow-hidden"
              }`}
            >
              {errors.fname}
            </p>{" "}
          </div>
          <div className="mb-4">
            <label htmlFor="lname" className="block mb-1">
              Last Name
            </label>
            <input
              type="text"
              className="w-full bg-inherit px-4 py-2 border rounded-lg  placeholder:text-neutral-400 "
              placeholder="Enter your Lastname"
              name="lname"
              value={inputs.lname}
              onChange={handleChange}
            />
            <p
              className={`text-red-500 mt-2 text-sm transition-all duration-300 ${
                errors.lname
                  ? "opacity-100 h-auto"
                  : "opacity-0 h-0 overflow-hidden"
              }`}
            >
              {errors.lname}
            </p>{" "}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full bg-inherit px-4 py-2 border rounded-lg  placeholder:text-neutral-400 "
              placeholder="Enter your Email"
              name="email"
              value={inputs.email}
              onChange={handleChange}
            />
            <p
              className={`text-red-500 mt-2 text-sm transition-all duration-300 ${
                errors.email
                  ? "opacity-100 h-auto"
                  : "opacity-0 h-0 overflow-hidden"
              }`}
            >
              {errors.email}
            </p>{" "}
          </div>
          <div className="mb-4 relative">
            <label htmlFor="pwd" className="block mb-1">
              Password
            </label>
            {showPassword.pwd ? (
              <FaEyeSlash
                className="absolute top-10 right-4 cursor-pointer"
                onClick={() => togglePassword("pwd")}
              />
            ) : (
              <FaEye
                className="absolute top-10 right-4 cursor-pointer"
                onClick={() => togglePassword("pwd")}
              />
            )}
            <input
              type={showPassword.pwd ? "text" : "password"}
              className="w-full bg-inherit px-4 py-2 border rounded-lg  placeholder:text-neutral-400 "
              placeholder="Enter your Password"
              name="pwd"
              value={inputs.pwd}
              onChange={handleChange}
            />
            <p
              className={`text-red-500 mt-2 text-sm transition-all duration-300 ${
                errors.pwd
                  ? "opacity-100 h-auto"
                  : "opacity-0 h-0 overflow-hidden"
              }`}
            >
              {errors.pwd}
            </p>
          </div>
          <div className="mb-4 relative">
            <label htmlFor="cpwd" className="block mb-1">
              Confirm Password
            </label>
            {showPassword.cpwd ? (
              <FaEyeSlash
                className="absolute top-10 right-4 cursor-pointer transition-all duration-600 transform scale-110"
                onClick={() => togglePassword("cpwd")}
              />
            ) : (
              <FaEye
                className="absolute top-10 right-4 cursor-pointer transition-all duration-600 transform scale-110"
                onClick={() => togglePassword("cpwd")}
              />
            )}
            <input
              type={showPassword.cpwd ? "text" : "password"}
              className="w-full bg-inherit px-4 py-2 border rounded-lg  placeholder:text-neutral-400 "
              placeholder="Renter your Password"
              name="cpwd"
              value={inputs.cpwd}
              onChange={handleChange}
            />
            <p
              className={`text-red-500 mt-2 text-sm transition-all duration-300 ${
                errors.cpwd
                  ? "opacity-100 h-auto"
                  : "opacity-0 h-0 overflow-hidden"
              }`}
            >
              {errors.cpwd}
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full bg-inherit px-4 py-2 border rounded-lg  placeholder:text-neutral-400 "
              placeholder="Enter your Phone Number"
              value={inputs.phone}
              name="phone"
              onChange={handleChange}
            />
            <p
              className={`text-red-500 mt-2 text-sm transition-all duration-300 ${
                errors.phone
                  ? "opacity-100 h-auto"
                  : "opacity-0 h-0 overflow-hidden"
              }`}
            >
              {errors.phone}
            </p>
          </div>

          <div className="flex flex-row-reverse justify-between ">
            <Button
              type="submit"
              label="Sign in"
              onClick={handleSubmit}
            ></Button>

            <Button type="button" label="Log in" varient="secondary" onClick={()=>{navigate("/login")}}></Button>
          </div>
        </form>
      </div>
    </div>
  );
};
