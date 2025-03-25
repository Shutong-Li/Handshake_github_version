/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Noticeboard from '../jsx_files/Noticeboard';
import { fetchEvents, fetchUsername, createPostEvent, deletePostEvent, fetchAllVIPs, createVIP } from '../jsx_files/api';
import { describe, test, expect, vi, beforeEach, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => (store[key] = value.toString()),
    clear: () => (store = {}),
  };
})();
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

vi.mock('../jsx_files/api', () => ({
  fetchEvents: vi.fn(),
  fetchUsername: vi.fn(),
  createPostEvent: vi.fn(),
  deletePostEvent: vi.fn(),
  fetchAllVIPs: vi.fn(),
  createVIP: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Noticeboard Component', () => {
  const mockEvents = [
    {
      id: 1,
      post_or_event: 'Event',
      title: 'Test Event 1',
      description: 'This is a test event',
      event_date: '2023-12-31T12:00:00Z',
      location: 'Test Location',
      event_type: 'Seminar',
      subject_area: 'Animal Physiology',
      area_of_expertise: 'Zoology',
      image: 'test-image-url',
      created_by: 1,
      created_by_username: 'testuser',
    },
    {
      id: 2,
      post_or_event: 'Post',
      title: 'Test Post 1',
      description: 'This is a test post',
      event_date: '2023-11-15T12:00:00Z',
      location: '',
      event_type: '',
      subject_area: 'Behavioural ecology',
      area_of_expertise: 'Zoology',
      image: 'test-image-url',
      created_by: 2,
      created_by_username: 'anotheruser',
    },
  ];

  const mockUser = {
    id: 1,
    username: 'testuser',
  };

  const mockVIPs = [
    { id: 1, title: 'VIP 1', theme: 'Theme 1' },
    { id: 2, title: 'VIP 2', theme: 'Theme 2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    fetchEvents.mockResolvedValue(mockEvents);
    fetchUsername.mockResolvedValue(mockUser);
    createPostEvent.mockResolvedValue({ status: 201 });
    deletePostEvent.mockResolvedValue({ status: 204 });
    fetchAllVIPs.mockResolvedValue(mockVIPs);
    sessionStorage.setItem('access_token', 'test-token');
  });

  const renderComponent = (isAuthenticated = true) => {
    if (isAuthenticated) {
      sessionStorage.setItem('access_token', 'fake-access-token');
    }
    return render(
      <MemoryRouter>
        <Noticeboard />
      </MemoryRouter>
    );
  };

  test('renders the Noticeboard component', async () => {
    renderComponent();
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
    expect(screen.getByText('All in Database')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    });
  });

  test('opens and closes the create post modal', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Create Post'));
    expect(screen.getByText('Create Post/Event')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Create Post/Event')).not.toBeInTheDocument();
  });

  test('filters events by date', async () => {
    renderComponent();
    fireEvent.click(screen.getByText('Filter by Time'));
    fireEvent.change(screen.getByLabelText('Start Date:'), { target: { value: '2023-12-01' } });
    fireEvent.change(screen.getByLabelText('End Date:'), { target: { value: '2023-12-31' } });
    fireEvent.click(screen.getByText('Apply Filter'));
    await waitFor(() => {
      expect(screen.queryByText('Test Post 1')).toBeInTheDocument();
    });
  });

  it('renders the Create Post and Create VIP buttons when authenticated', () => {
    renderComponent();
    expect(screen.getByText(/Create Post/i)).toBeInTheDocument();
    expect(screen.getByText(/Create VIP/i)).toBeInTheDocument();
  });

  it('fetches VIPs on component mount', async () => {
    renderComponent();
    await waitFor(() => {
      expect(fetchEvents).toHaveBeenCalled();
      expect(fetchAllVIPs).toHaveBeenCalled();
    });
    expect(screen.getByText(/VIP 1/i)).toBeInTheDocument();
    expect(screen.getByText(/VIP 2/i)).toBeInTheDocument();
  });
});