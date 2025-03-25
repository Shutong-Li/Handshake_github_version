/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */
/*
  VerifyEmail.jsx
  This component handles the email verification process after a user registers.
  - It verifies the email using a token passed via the URL.
  - Displays appropriate feedback to the user (verifying, success, or failure).
  - Redirects the user to the registration page in case of failure.
*/

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { client } from './api';

export default function VerifyEmail() {
    const { token } = useParams(); // Extract the verification token from the URL
    const navigate = useNavigate(); // React Router navigation hook
    const [status, setStatus] = useState('verifying'); // Tracks the current verification status

    // Spinner component: Displays a loading spinner while verification is in progress
    const Spinner = () => (
        <div className="verification-container">
            <h2>Verifying Email Address...</h2>
            <div className="spinner"></div>
            <p>Please wait while we confirm your email</p>
        </div>
    );

    // SuccessMessage component: Displays a success message when verification is successful
    const SuccessMessage = () => (
        <div className="verification-container">
            <h2 style={{ color: 'green' }}>✓ Email Verified Successfully!</h2>
            <p>You can now safely close this window.</p>
            <button 
                style={{
                    padding: '10px 20px',
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                onClick={() => window.close()} // Closes the current browser window
            >
                Close Window
            </button>
        </div>
    );

    // ErrorMessage component: Displays an error message when verification fails
    const ErrorMessage = () => (
        <div className="verification-container">
            <h2 style={{ color: 'red' }}>✗ Verification Failed</h2>
            <p>Please try registering again.</p>
            <button
                style={{
                    padding: '10px 20px',
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
                onClick={() => navigate('/register')} // Redirects the user to the registration page
            >
                Return to Registration
            </button>
        </div>
    );

    // useEffect: Handles the email verification process
    useEffect(() => {
        const controller = new AbortController(); // AbortController to handle cleanup and cancel requests

        // Send a GET request to verify the email using the token
        client.get(`/api/verify-email/${token}/`, {
            signal: controller.signal // Attach the abort signal to the request
        })
        .then(() => {
            setStatus('verified'); // Update status to 'verified' on success
            setTimeout(() => {
                window.close(); // Automatically close the window after 2 seconds
            }, 2000);
        })
        .catch((error) => {
            if (error.name === 'CanceledError') return; // Ignore errors caused by request cancellation
            setStatus('failed'); // Update status to 'failed' on error
            setTimeout(() => {
                // Redirect to the registration page with an error message
                navigate('/register', { 
                    state: { 
                        verificationError: error.response?.data?.error || 'Verification failed'
                    }
                });
            }, 2000);
        });

        // Cleanup function to abort the request when the component unmounts
        return () => {
            controller.abort();
        };
    }, [token, navigate]);

    // Render the appropriate component based on the verification status
    return (
        <>
            {status === 'verifying' && <Spinner />} {/* Show spinner while verifying */}
            {status === 'verified' && <SuccessMessage />} {/* Show success message on success */}
            {status === 'failed' && <ErrorMessage />} {/* Show error message on failure */}
        </>
    );
}