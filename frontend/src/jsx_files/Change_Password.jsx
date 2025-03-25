/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */


import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BaseTemplate from './Base_Template';

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function ChangePassword({ setCurrentUser }) {
  const access_token = sessionStorage.getItem("access_token");
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  async function submitPassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setNewPassword('');
      setConfirmPassword('');
      return;
    }
    else {
      await client.put("/handshake/change-password/", {'password': currentPassword, 'new_password': newPassword}, 
        { headers: {Authorization: `Bearer ${access_token}`, }}).then((response) => {
          navigate('/profile');
          console.log(response)
      });
      
    }
  }

  return (
    <BaseTemplate>
    <div className="center">
      <h1>Change Password</h1>
      <Form onSubmit={submitPassword}>
        <p>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label><strong>Current Password: </strong></Form.Label>
          <Form.Control type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
        </Form.Group>
        </p>

        <p>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label><strong>New Password: </strong></Form.Label>
          <Form.Control type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        </Form.Group>
        </p>

        <p>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label><strong>Confirm Password: </strong></Form.Label>
          <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        </Form.Group>
        </p>
        {errorMessage && <p className='text-danger'>{errorMessage}</p>}
        <p>
        <Button variant="primary" type="submit">Change Password</Button>
        <Button variant="secondary" onClick={() => navigate('/Profile')}>Cancel</Button>

        </p>
      </Form>
    </div>
    </BaseTemplate>
  );
}

export default ChangePassword;