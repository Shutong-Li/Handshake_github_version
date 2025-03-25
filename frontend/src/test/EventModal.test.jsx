/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Modal from 'react-modal';
import EventModal from '../jsx_files/EventModal';

Modal.setAppElement(document.createElement('div'));

describe('EventModal Component', () => {
    const mockEvent = {
        title: 'Tech Conference 2025',
        image: 'https://example.com/image.jpg',
        description: 'An exciting tech conference.',
        event_type: 'Conference',
        event_date: '2025-06-15T10:00:00Z',
        location: 'San Francisco, CA',
        subject_area: 'Technology',
        area_of_expertise: 'Software Development',
        created_by_username: 'JohnDoe'
    };

    const mockOnRequestClose = vi.fn();

    it('renders correctly when open', () => {
        render(<EventModal isOpen={true} onRequestClose={mockOnRequestClose} event={mockEvent} />);
        
        expect(screen.getByText(mockEvent.title)).toBeInTheDocument();
        expect(screen.getByAltText(mockEvent.title)).toBeInTheDocument();
        expect(screen.getByText(mockEvent.description)).toBeInTheDocument();
        expect(screen.getByText(`${mockEvent.event_type}`)).toBeInTheDocument();
        expect(screen.getByText(`${mockEvent.location}`)).toBeInTheDocument();
        expect(screen.getByText(`${mockEvent.subject_area}`)).toBeInTheDocument();
        expect(screen.getByText(`${mockEvent.created_by_username}`)).toBeInTheDocument();
    });

    it('does not render when event is null', () => {
        render(<EventModal isOpen={true} onRequestClose={mockOnRequestClose} event={null} />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('triggers onRequestClose when close button is clicked', async () => {
        render(<EventModal isOpen={true} onRequestClose={mockOnRequestClose} event={mockEvent} />);
        
        const closeButton = screen.getByText('Close');
        await userEvent.click(closeButton);
        expect(mockOnRequestClose).toHaveBeenCalledTimes(1);
    });
});
