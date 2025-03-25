/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Profile from '../jsx_files/Profile';
import { fetchUsername, fetchProfile, authenticateProfile, fetchUserVIPs, fetchUserPosts, fetchUserEvents, fetchOrganisations } from '../jsx_files/api';

vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('../jsx_files/api', () => ({
  fetchUsername: vi.fn(),
  fetchProfile: vi.fn(),
  authenticateProfile: vi.fn(),
  fetchUserVIPs: vi.fn(),
  fetchUserPosts: vi.fn(),
  fetchUserEvents: vi.fn(),
  fetchOrganisations: vi.fn(),
  createVIP: vi.fn(),
}));

vi.mock('../jsx_files/Base_Template', () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock('../jsx_files/VIPModal', () => ({
  default: ({ isOpen, onRequestClose, vip }) => (
    <div data-testid="vip-modal">
      {isOpen && <div>{vip?.title}</div>}
      <button onClick={onRequestClose}>Close VIP Modal</button>
    </div>
  ),
}));

vi.mock('../jsx_files/EventModal', () => ({
  default: ({ isOpen, onRequestClose, event }) => (
    <div data-testid="event-modal">
      {isOpen && <div>{event?.title}</div>}
      <button onClick={onRequestClose}>Close Event Modal</button>
    </div>
  ),
}));

vi.mock('./PostModal', () => ({
  default: ({ isOpen, onRequestClose, post }) => (
    <div data-testid="post-modal">
      {isOpen && <div>{post?.title}</div>}
      <button onClick={onRequestClose}>Close Post Modal</button>
    </div>
  ),
}));

vi.mock('./Edit_Profile', () => ({
  default: ({ profileData, setProfileData, setEditing, affiliation, email }) => (
    <div data-testid="edit-profile">
      <button onClick={() => setEditing(false)}>Save</button>
    </div>
  ),
}));

describe('Profile Component', () => {
  const mockNavigate = vi.fn();
  const mockSearchParams = new URLSearchParams('u=1');
  beforeEach(() => {
    vi.clearAllMocks();
    useSearchParams.mockReturnValue([mockSearchParams]);
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders the profile page with user data', async () => {
    fetchUsername.mockResolvedValue({ id: 1, username: 'testuser' });
    fetchProfile.mockResolvedValue({
      first_name: 'John',
      last_name: 'Doe',
      affiliation: { name: 'University of Test' },
      biography: 'Test biography',
      subject_area: 'Test Subject',
      ecological_area: 'Test Ecological Area',
      area_of_expertise: 'Test Expertise',
      variant: 'Test Variant',
      user_type: 'Test Role',
      willing_peer_review: true,
      willing_allyship: false,
      willing_seminar: false,
      willing_PHDhelper: false,
    });

    authenticateProfile.mockResolvedValue(true);
    fetchUserVIPs.mockResolvedValue([]);
    fetchUserPosts.mockResolvedValue([]);
    fetchUserEvents.mockResolvedValue([]);
    fetchOrganisations.mockResolvedValue({ Organisations: [{ name: 'University of Test' }] });
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('testuser')).toBeInTheDocument();
      expect(screen.getByText('Test biography')).toBeInTheDocument();
      expect(screen.getByText('Test Subject')).toBeInTheDocument();
      expect(screen.getByText('Test Ecological Area')).toBeInTheDocument();
      expect(screen.getByText('Test Expertise')).toBeInTheDocument();
      expect(screen.getByText('Test Variant')).toBeInTheDocument();
      expect(screen.getByText('Test Role')).toBeInTheDocument();
      expect(screen.getByText('Willing to Peer Review')).toBeInTheDocument();
    });
  });

  it('opens and closes the VIP modal', async () => {
    fetchUsername.mockResolvedValue({ id: 1, username: 'testuser' });
    fetchProfile.mockResolvedValue({});
    authenticateProfile.mockResolvedValue(true);
    fetchUserVIPs.mockResolvedValue([]);
    fetchUserPosts.mockResolvedValue([]);
    fetchUserEvents.mockResolvedValue([]);
    fetchOrganisations.mockResolvedValue({ Organisations: [] });

    render(<Profile />);
    fireEvent.click(screen.getByRole('button', { name: /Create VIP/i }));
    expect(screen.getByRole('heading', { name: /Create VIP/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(screen.queryByRole('heading', { name: /Create VIP/i })).not.toBeInTheDocument();
  });

  it('handles VIP details modal', async () => {
    fetchUsername.mockResolvedValue({ id: 1, username: 'testuser' });
    fetchProfile.mockResolvedValue({});
    authenticateProfile.mockResolvedValue(true);
    fetchUserVIPs.mockResolvedValue([{ id: 1, title: 'Test VIP' }]);
    fetchUserPosts.mockResolvedValue([]);
    fetchUserEvents.mockResolvedValue([]);
    fetchOrganisations.mockResolvedValue({ Organisations: [] });
    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText('Test VIP')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Test VIP'));
    expect(screen.getByTestId('vip-modal')).toBeInTheDocument();
  });
});