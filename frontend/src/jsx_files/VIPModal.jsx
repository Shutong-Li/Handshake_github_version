/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React from 'react';
import Modal from 'react-modal';

// Set the root element for accessibility purposes
Modal.setAppElement("#root");

/*
  VIPModal Component
  - Displays detailed information about a VIP (Very Important Project) in a modal.
  - Allows users to view project details and download associated files.
  - Provides a close button to dismiss the modal.
*/

function VIPModal({ isOpen, onRequestClose, vip }) {
    // If no VIP data is provided, do not render the modal
    if (!vip) return null;

    // Handles the download of the file associated with the VIP
    const handleDownload = () => {
        if (vip.file_url) {
            const link = document.createElement('a'); // Create a temporary anchor element
            link.href = vip.file_url; // Set the file URL
            link.download = vip.file_url.split('/').pop(); // Extract the file name from the URL
            document.body.appendChild(link); // Append the link to the document
            link.click(); // Trigger the download
            document.body.removeChild(link); // Remove the link after download
        }
    };

    return (
        <Modal
            isOpen={isOpen} // Controls whether the modal is visible
            onRequestClose={onRequestClose} // Function to close the modal
            className="modal-content" // CSS class for modal content
            overlayClassName="modal-overlay" // CSS class for modal overlay
        >
            {/* Display VIP details */}
            <h2>{vip.title}</h2>
            <p><strong>Theme:</strong> {vip.theme}</p>
            <p><strong>Subject Area:</strong> {vip.subject_area}</p>
            <p><strong>Area of Expertise:</strong> {vip.area_of_expertise}</p>
            <p><strong>Preferred Interests and Skills:</strong> {vip.preferred_interests_and_skills}</p>
            <p><strong>Preparation:</strong> {vip.preparation}</p>
            <p><strong>Goals:</strong> {vip.goals}</p>
            <p><strong>Specific Issues Addressed:</strong> {vip.specific_issues_addressed}</p>
            <p><strong>Methods:</strong> {vip.methods}</p>
            <p><strong>Data Available:</strong> {vip.data_available}</p>
            <p><strong>Field/Lab Work:</strong> {vip.field_lab_work}</p>
            <p><strong>Meeting Schedule:</strong> {vip.meeting_schedule}</p>
            <p><strong>Meeting Location:</strong> {vip.meeting_location}</p>
            <p><strong>Partner/Sponsor:</strong> {vip.partner_sponsor}</p>

            {/* File download button, displayed only if a file URL is available */}
            {vip?.file_url && (
                <div className="file-download">
                    <button onClick={handleDownload}>
                        Download Attachment
                    </button>
                </div>
            )}

            {/* Close button to dismiss the modal */}
            <button onClick={onRequestClose}>Close</button>
        </Modal>
    );
}

export default VIPModal;