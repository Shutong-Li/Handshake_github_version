/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Modal from 'react-modal';
import PostModal from '../jsx_files/PostModal';

Modal.setAppElement(document.createElement('div'));

describe('PostModal Component', () => {
    const mockPost = {
        title: 'New Research on AI Ethics',
        image: 'https://example.com/image.jpg',
        description: 'A study on the ethical implications of AI.',
        subject_area: 'Artificial Intelligence',
        area_of_expertise: 'Ethics in AI',
        created_by_username: 'JaneDoe'
    };

    const mockOnRequestClose = vi.fn();

    it('renders correctly when open', () => {
        render(<PostModal isOpen={true} onRequestClose={mockOnRequestClose} post={mockPost} />);
        expect(screen.getByText(mockPost.title)).toBeInTheDocument();
        expect(screen.getByAltText(mockPost.title)).toBeInTheDocument();
        expect(screen.getByText(mockPost.description)).toBeInTheDocument();
        expect(screen.getByText(`${mockPost.subject_area}`)).toBeInTheDocument();
        expect(screen.getByText(`${mockPost.area_of_expertise}`)).toBeInTheDocument();
        expect(screen.getByText(`${mockPost.created_by_username}`)).toBeInTheDocument();
    });

    it('does not render when post is null', () => {
        render(<PostModal isOpen={true} onRequestClose={mockOnRequestClose} post={null} />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('triggers onRequestClose when close button is clicked', async () => {
        render(<PostModal isOpen={true} onRequestClose={mockOnRequestClose} post={mockPost} />);
        const closeButton = screen.getByText('Close');
        await userEvent.click(closeButton);
        expect(mockOnRequestClose).toHaveBeenCalledTimes(1);
    });
});
