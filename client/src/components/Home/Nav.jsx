import React, { useState } from "react";
import AddStoryModal from "./AddStoryModal";
import LoginModal from "../Auth/LoginModal";
import RegisterModal from "../Auth/RegisterModal";
import Styles from "./Nav.module.css";
import { FaBookmark } from "react-icons/fa6";
function Nav() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
const [showAddStory, setShowAddStory] = useState(false);
  const username=localStorage.getItem("username");
  const isLogin=localStorage.getItem("isLogin");

  const handelLogout=()=>{
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("isLogin");
    window.location.reload();
   
  }
  return (
    <>
   {!isLogin ?(<div className={Styles.layout}>
      <button className={Styles.button} style={{background:"#FF7373"}}  onClick={() => setShowSignUp(true)}>Register Now</button>
      <button className={Styles.button} style={{background:"#73ABFF"}} onClick={() => setShowLogin(true)}>Sign In</button>

      {showLogin && <LoginModal setShowLogin={setShowLogin}  />}
      {showSignUp && <RegisterModal setShowSignUp={setShowSignUp} />}
    </div>):(<div className={Styles.layout}>
    <button className={Styles.button} style={{background:"#FF7373"}}  ><FaBookmark  />Bookmark</button>
    <button className={Styles.button} style={{background:"#FF7373"}}  onClick={()=>setShowAddStory(true)}>Add Story</button>
    <p>{username}</p>
    <button onClick={handelLogout}>Logout</button>
    {showAddStory && <AddStoryModal setShowAddStory={setShowAddStory} />}
    


      </div>)}
    </>
  );
}

export default Nav;
