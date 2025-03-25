/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import axios from "axios";
import React from "react";
import { Route, BrowserRouter as Router, Routes, useNavigate } from "react-router-dom";
import Affiliates from "./Affiliates";
import "../css_files/App.css";
import ChangePassword from "./Change_Password";
import DeleteAccount from "./Delete_Account";
import UpdateProfile from "./Edit_Profile";
import Login from "./Login";
import Profile from "./Profile";
import Register from "./Register";
import SearchPage from "./Search_Page";
import SearchResults from "./Search_Results";
import Noticeboard from "./Noticeboard";
import VerifyEmail from "./VerifyEmail";
import { setNavigate } from "./api";
axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <NavigationHandler />
      <Routes>
        <Route path="/" element={<Noticeboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/noticeboard" element={<Noticeboard />} />
        <Route path="/affiliates" element={<Affiliates />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/results" element={<SearchResults />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
      </Routes>
    </Router>
  );

function NavigationHandler() {
  const navigate = useNavigate();
  setNavigate(navigate);
  return null; 
}
}
export default App;
