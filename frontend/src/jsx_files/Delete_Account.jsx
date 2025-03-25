/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteAccount, logout } from './api';
import BaseTemplate from './Base_Template';

const DeleteAccount = () => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deleteAccount();
            sessionStorage.clear();
            navigate('/');
        } catch (error) {
            console.error('There was an error deleting the account!', error);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <BaseTemplate>
            <div className="delete-account">
                <h2>Warning: Account Deletion</h2>
                <p>This action cannot be undone. Are you sure you want to delete your account?</p>
                <button onClick={handleDelete}>Confirm Deletion</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </BaseTemplate>
    );
};

export default DeleteAccount;