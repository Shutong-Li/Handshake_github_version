/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import icon from "../assets/profile-icon.png";
import "../css_files/Base_Template.css";
import ProfileDropdown from "./Profile_Dropdown";

function useClickOutside(ref, onClickOutside) {
  useEffect(() => {
    /**
     * Invoke Function onClick outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }
    // Bind
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // dispose
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
}

const BaseTemplate = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem("access_token");
  const dropRef = useRef(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  useClickOutside(dropRef, () => {
    setDropdownVisible(false);
  });

  const navigate = useNavigate();

  const handleNavigation = (page) => {
    navigate(`/${page}/`);
  };

  return (
    <div className="page-content">
      {/* Header Section */}

      <div className="header-container">
        <button className="handshake-title" onClick={() => navigate("/")}>
          Handshake
        </button>

        <div className="header-items">
          {isAuthenticated ? (
            <>
              <div className="header-links">
                <a
                  className="header-link"
                  onClick={() => handleNavigation("noticeboard")}
                >
                  Notice Board
                </a>
                <a
                  className="header-link"
                  onClick={() => handleNavigation("search")}
                >
                  Search
                </a>
                <a
                  className="header-link"
                  onClick={() => handleNavigation("affiliates")}
                >
                  Affiliates
                </a>
              </div>
              <div className="dropdown" ref={dropRef}>
                <img
                  src={icon}
                  alt="profile-icon"
                  onClick={() => setDropdownVisible(!isDropdownVisible)}
                />

                {isDropdownVisible && <ProfileDropdown />}
              </div>
            </>
          ) : (
            <>
              <div className="header-links">
                <a
                  href=""
                  className="header-link"
                  onClick={() => handleNavigation("noticeboard")}
                >
                  Notice Board
                </a>
                <a
                  href=""
                  className="header-link"
                  onClick={() => handleNavigation("login")}
                >
                  Login
                </a>
                <a
                  href=""
                  className="header-link"
                  id="register"
                  onClick={() => handleNavigation("register")}
                >
                  Register
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {children || <p>This is where your main content will be displayed.</p>}
      </div>

      {/* Footer Section */}
      <div className="footer-container">
        <p>Handshake 2024 ©</p>
        <div className="footer-links">
          <a href="privacy_policy" className="footer-link">
            Privacy Policy
          </a>
          <a href="accessibility" className="footer-link">
            Accessibility
          </a>
          <a href="cookie_policy" className="footer-link">
            Cookie Policy
          </a>
          <a href="links_policy" className="footer-link">
            Links Policy
          </a>
          <a href="copyright" className="footer-link">
            Copyright
          </a>
          <a href="feedback" className="footer-link">
            Feedback
          </a>
        </div>
      </div>
    </div>
  );
};

export default BaseTemplate;
