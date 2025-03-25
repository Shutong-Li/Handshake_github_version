/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Modal from 'react-modal';
import VIPModal from '../jsx_files/VIPModal';

Modal.setAppElement(document.createElement('div'));

describe('VIPModal Component', () => {
    const mockVIP = {
        title: 'AI Research Initiative',
        theme: 'Artificial Intelligence',
        subject_area: 'Machine Learning',
        area_of_expertise: 'Deep Learning',
        preferred_interests_and_skills: 'Python, TensorFlow',
        preparation: 'Basic knowledge of neural networks',
        goals: 'Develop an AI model for image recognition',
        specific_issues_addressed: 'Data bias in training sets',
        methods: 'Supervised learning techniques',
        data_available: 'Large dataset of labeled images',
        field_lab_work: 'None',
        meeting_schedule: 'Bi-weekly meetings',
        meeting_location: 'Online',
        partner_sponsor: 'Tech Corp',
        file_url: 'https://example.com/document.pdf'
    };

    const mockOnRequestClose = vi.fn();

    it('renders correctly when open', () => {
        render(<VIPModal isOpen={true} onRequestClose={mockOnRequestClose} vip={mockVIP} />);
        expect(screen.getByText(mockVIP.title)).toBeInTheDocument();
        expect(screen.getByText(`${mockVIP.theme}`)).toBeInTheDocument();
        expect(screen.getByText(`${mockVIP.subject_area}`)).toBeInTheDocument();
        expect(screen.getByText(`${mockVIP.area_of_expertise}`)).toBeInTheDocument();
        expect(screen.getByText(`${mockVIP.partner_sponsor}`)).toBeInTheDocument();
    });

    it('does not render when vip is null', () => {
        render(<VIPModal isOpen={true} onRequestClose={mockOnRequestClose} vip={null} />);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('triggers onRequestClose when close button is clicked', async () => {
        render(<VIPModal isOpen={true} onRequestClose={mockOnRequestClose} vip={mockVIP} />);
        const closeButton = screen.getByText('Close');
        await userEvent.click(closeButton);
        expect(mockOnRequestClose).toHaveBeenCalledTimes(1);
    });

    it('triggers file download when download button is clicked', async () => {
        render(<VIPModal isOpen={true} onRequestClose={mockOnRequestClose} vip={mockVIP} />);
        const downloadButton = screen.getByText('Download Attachment');
        await userEvent.click(downloadButton);
        expect(downloadButton).toBeInTheDocument();
    });
});
