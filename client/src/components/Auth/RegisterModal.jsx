import React, { useState } from "react";
import { signup } from "../../api/authApi";
import { toast } from "react-toastify";
import { login } from "../../api/authApi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import "../../Styles/Auth.css";


function RegisterModal({setShowSignUp}) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});


  const validate = () => {
    const newErrors = {};

 
    if (!username) {
      newErrors.username = "Username is required";
    } 
    if (!password) newErrors.password = "Password is required";


    return newErrors;
  };
  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await signup({
       
        username,
        password,
        
      });
      if (response.status === 200) {
        const loginResponse = await login({ username, password });

        if (loginResponse.status === 200) {
          localStorage.setItem("userId", loginResponse.data.user._id);
          localStorage.setItem("token", loginResponse.data.token);
          localStorage.setItem("username", response.data.user.username);
          localStorage.setItem("isLogin", true);
          toast.success("Logged In successfully!");
          setShowSignUp(false);
         
         
        } else {
          toast.error(loginResponse.message);
        }
      } else {
        toast.error(response.error || "Registration failed");
      }
      console.log(response);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.log(error);
    }
  };
  return (
    <div className={"overlay"}>
      <div
      className={"modal"}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
         
        }}
      >
      <IoMdCloseCircleOutline onClick={()=>setShowSignUp(false)} className="button-x"  />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "15px",
          
          }}
        >
        <h1>Register</h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "70px",
              flexWrap: "wrap",
        

              gap: "15px",
            }}
          >
            <label style={{ fontWeight: "bolder" }}>Username</label>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
              <input
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: `1px solid ${errors.username ? "red" : "#808080"}`,
                  outline: "none",
                  background: "none",
                  width: "100%"
                }}
                type="username"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrors((prev) => ({ ...prev, username: "" }));
                }}
              />
              {errors.username && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.username}
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "70px",
              flexWrap: "wrap",

              gap: "15px",
            }}
          >
            <label style={{ fontWeight: "bolder" }}>Password</label>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
              <input
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  border: `1px solid ${errors.password ? "red" : "#808080"}`,
                  outline: "none",
                  background: "none",
                  width: "100%",
                }}
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: "" }));
                }}
              />
              {errors.password && (
                <div style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.password}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          className="button"
          onClick={handleSubmit}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default RegisterModal;
