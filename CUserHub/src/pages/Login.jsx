import React, { useState } from "react";
import { Button } from "../components/Button";
import { FaChevronLeft, FaEye, FaEyeSlash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    pwd: "",
  });
  const [inputs, setInputs] = useState({
    email: "",
    pwd: "",
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
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
  console.log(inputs);
  console.log(errors);

  const handleSubmit = (e) => {
    console.log("knwkj");
    e.preventDefault();

    const newErrors = {};

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
    setErrors(newErrors);

    if (Object.keys(newErrors).length == 0) {
      fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(inputs).toString(),
      })
        .then(response => response.text())
        .then((data) => {
          console.log("Server says: ", data)
          if (data.includes("Login Successful")) {
            navigate("/dashboard");  
          } else {
            console.log("Login failed: " + data);
          }})
        .catch(error=> {
            console.error("Error:", error);
          });
    
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-980">
      <FaChevronLeft className="absolute top-0 left-0 ml-8 mt-8 text-white hover:cursor-pointer" onClick={()=> navigate(-1)}></FaChevronLeft>

      <div className="border px-16 py-8 rounded-2xl w-full max-w-lg m-4">
        <h2 className="text-2xl font-medium text-center mb-4">Log In</h2>
        <form>
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
            {showPassword ? (
              <FaEyeSlash
                className="absolute top-10 right-4 cursor-pointer"
                onClick={togglePassword}
              />
            ) : (
              <FaEye
                className="absolute top-10 right-4 cursor-pointer"
                onClick={togglePassword}
              />
            )}
            <input
              type={showPassword ? "text" : "password"}
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

          <div className="flex flex-row-reverse justify-between ">
            <Button
              type="submit"
              label="Log in"
              onClick={handleSubmit}
            ></Button>

            <Button
              type="button"
              label="Sign in"
              varient="secondary"
              onClick={() => {
                navigate("/");
              }}
            ></Button>
          </div>
        </form>
      </div>
    </div>
  );
};
