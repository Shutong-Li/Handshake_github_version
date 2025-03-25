/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React from 'react';
import Modal from 'react-modal';

// Set the root element for accessibility purposes
Modal.setAppElement("#root");

/*
  PostModal Component
  - Displays detailed information about a post in a modal.
  - Shows the post's title, image, description, subject area, area of expertise, and creator's username.
  - Provides a close button to dismiss the modal.
*/

function PostModal({ isOpen, onRequestClose, post }) {
    // If no post data is provided, do not render the modal
    if (!post) return null;

    return (
        <Modal
            isOpen={isOpen} // Controls whether the modal is visible
            onRequestClose={onRequestClose} // Function to close the modal
            className="modal-content" // CSS class for modal content
            overlayClassName="modal-overlay" // CSS class for modal overlay
        >
            {/* Display post details */}
            <h2>{post.title}</h2>
            <img src={post.image} alt={post.title} /> {/* Post image */}
            <p>{post.description}</p> {/* Post description */}
            <p><strong>Subject Area:</strong> {post.subject_area}</p> {/* Post subject area */}
            <p><strong>Area of Expertise:</strong> {post.area_of_expertise}</p> {/* Post area of expertise */}
            <p><strong>Created By:</strong> {post.created_by_username}</p> {/* Post creator's username */}
            
            {/* Close button to dismiss the modal */}
            <button onClick={onRequestClose}>Close</button>
        </Modal>
    );
}

export default PostModal;