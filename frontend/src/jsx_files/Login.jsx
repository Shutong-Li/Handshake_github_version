/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseTemplate from './Base_Template';
import '../css_files/Login.css';
import { login } from './api';

function clearBorderColor(ref) {
  if (ref.current) {
    ref.current.style.borderColor = ''; // Clear the border color
  }
}

function Login({ setCurrentUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  async function submitLogin(e) {
    e.preventDefault();
    try {
      const res = await login(username, password);
      sessionStorage.setItem('access_token', res.access_token);
      sessionStorage.setItem('refresh_token', res.refresh_token);
      navigate(`/profile/`);
    } catch (error) {
      if (error.response) {
        console.error("Error response received:", error.response);
        if (error.response.status === 401 || error.response.status === 400) {
          alert("Login Failed, incorrect username or password");
          if (usernameRef.current && passwordRef.current) {
            usernameRef.current.style.borderColor = 'red';
            usernameRef.current.value = '';
            passwordRef.current.style.borderColor = 'red';
            passwordRef.current.value = '';
          }
        } else {
          console.error("An error occurred:", error.response.data);
        }
      } else if (error.request) {
        console.error("Request was made but no response received:", error.request);
        alert("Network error, try checking your connection before continuing");
      } else {
        alert("An error occurred:", error.message);
      }
    }
  }

  return (
    <BaseTemplate>
      <div className="login-center">
        {/* Need something to go behidn the login */}
        <div className="register-link">
          <span>Don't have an account? </span>
          <a href="/register" >Sign up!</a>
        </div>
        <h1><b>WELCOME BACK</b></h1>
        <form onSubmit={submitLogin} className="left-align-form">
          <div className="form-group">
            <label className="form-label"><strong>Login with Organisation E-mail: </strong></label>
            <input
              ref={usernameRef}
              type="text"
              placeholder="example@example.ac.uk"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onClick={() => clearBorderColor(usernameRef)}
              className="custom-input"
            />
          </div>
          <div className="form-group">
            <label className="form-label"><strong>Password: </strong></label>
            <input
              ref={passwordRef}
              type="password"
              placeholder="************"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onClick={() => clearBorderColor(passwordRef)}
              className="custom-input"
            />
          </div>
          <div className="button-container">
            <button type="submit" className="submit-button">Login</button>
          </div>
        </form>
      </div>

    </BaseTemplate>
  );
}

export default Login;