/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React from "react";
import "../css_files/Profile_Dropdown.css";
import { useNavigate } from 'react-router-dom';
import { logout } from "./api";

const ProfileDropdown = () => {
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
    };

    return (
        <div className="dropdown-menu">
            <a className="dropdown-link" href="/profile/">Profile</a>
            <a className="dropdown-link" onClick={handleLogout}>Logout</a>
        </div>
    );
};

export default ProfileDropdown;