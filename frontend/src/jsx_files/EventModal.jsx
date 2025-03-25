/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React from 'react';
import Modal from 'react-modal';

// Set the root element for accessibility purposes
Modal.setAppElement("#root");

/*
  EventModal Component
  - Displays detailed information about an event in a modal.
  - Shows the event's title, image, description, type, date, location, subject area, area of expertise, and creator's username.
  - Provides a close button to dismiss the modal.
*/

function EventModal({ isOpen, onRequestClose, event }) {
    // If no event data is provided, do not render the modal
    if (!event) return null;

    return (
        <Modal
            isOpen={isOpen} // Controls whether the modal is visible
            onRequestClose={onRequestClose} // Function to close the modal
            className="modal-content" // CSS class for modal content
            overlayClassName="modal-overlay" // CSS class for modal overlay
        >
            {/* Display event details */}
            <h2>{event.title}</h2>
            <img src={event.image} alt={event.title} /> {/* Event image */}
            <p>{event.description}</p> {/* Event description */}
            <p><strong>Type:</strong> {event.event_type}</p> {/* Event type */}
            <p><strong>Date:</strong> {new Date(event.event_date).toLocaleString()}</p> {/* Event date */}
            <p><strong>Location:</strong> {event.location}</p> {/* Event location */}
            <p><strong>Subject Area:</strong> {event.subject_area}</p> {/* Event subject area */}
            <p><strong>Area of Expertise:</strong> {event.area_of_expertise}</p> {/* Event area of expertise */}
            <p><strong>Created By:</strong> {event.created_by_username}</p> {/* Event creator's username */}
            
            {/* Close button to dismiss the modal */}
            <button onClick={onRequestClose}>Close</button>
        </Modal>
    );
}

export default EventModal;