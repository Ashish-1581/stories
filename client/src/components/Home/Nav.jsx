import React, { useState } from "react";
import AddStoryModal from "./AddStoryModal";
import LoginModal from "../Auth/LoginModal";
import RegisterModal from "../Auth/RegisterModal";
import Styles from "./Nav.module.css";
import { FaBookmark, FaBars } from "react-icons/fa6"; // FaBars for the hamburger menu
import { useNavigate } from "react-router-dom";

function Nav() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showAddStory, setShowAddStory] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // State for toggling the hamburger menu

  const username = localStorage.getItem("username");
  const isLogin = localStorage.getItem("isLogin");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("isLogin");
    navigate("/");
  };

  return (
    <>
      {!isLogin ? (
        <div className={Styles.layout}>
          <button
            className={Styles.button}
            style={{ background: "#FF7373" }}
            onClick={() => setShowSignUp(true)}
          >
            Register Now
          </button>
          <button
            className={Styles.button}
            style={{ background: "#73ABFF" }}
            onClick={() => setShowLogin(true)}
          >
            Sign In
          </button>

          {showLogin && <LoginModal setShowLogin={setShowLogin} />}
          {showSignUp && <RegisterModal setShowSignUp={setShowSignUp} />}
        </div>
      ) : (
        <div className={Styles.layout}>
          <button
            className={Styles.button}
            style={{ background: "#FF7373" }}
            onClick={() => navigate("/bookmark")}
          >
            <FaBookmark /> Bookmark
          </button>
          <button
            className={Styles.button}
            style={{ background: "#FF7373" }}
            onClick={() => setShowAddStory(true)}
          >
            Add Story
          </button>

          {/* Hamburger Menu Button */}
          <button
            className={Styles.hamburger}
            onClick={() => setShowMenu(!showMenu)}
          >
            <FaBars />
          </button>

        
          {showMenu && (
            <div className={Styles.menu}>
              <p>{username}</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}

          {showAddStory && <AddStoryModal setShowAddStory={setShowAddStory} />}
        </div>
      )}
    </>
  );
}

export default Nav;
