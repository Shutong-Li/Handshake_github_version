/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EditProfile from '../jsx_files/Edit_Profile';
import { updateProfile } from '../jsx_files/api';
import { vi } from 'vitest';

vi.mock('../jsx_files/api', () => ({
  updateProfile: vi.fn(() => Promise.resolve()),
}));

const mockProfileData = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john.doe@example.com',
  affiliation: 0,
  user_type: 'Researcher',
  subject_area: 'Animal Physiology',
  area_of_expertise: 'Zoology',
  ecological_area: 'Marine (offshore)',
  variant: 'Zoology',
  biography: 'A passionate researcher in animal physiology.',
  willing_peer_review: true,
  willing_allyship: false,
  willing_seminar: true,
  willing_PHDhelper: false,
};

const mockAffiliationList = ['University of Example', 'Another University'];

const mockSetProfileData = vi.fn();
const mockSetEditing = vi.fn();

describe('EditProfile', () => {
  beforeEach(() => {
    render(
      <MemoryRouter> 
        <EditProfile
          profileData={mockProfileData}
          setProfileData={mockSetProfileData}
          setEditing={mockSetEditing}
          affiliationList={mockAffiliationList}
          email="john.doe@example.com"
        />
      </MemoryRouter>
    );
  });

  test('renders form fields with initial values', () => {
    expect(screen.getByLabelText('First Name').value).toBe('John');
    expect(screen.getByLabelText('Last Name').value).toBe('Doe');
    expect(screen.getByLabelText('Email').value).toBe('john.doe@example.com');
    expect(screen.getByLabelText('Willing to Peer Review').checked).toBe(true);
    expect(screen.getByLabelText('Willing for Allyship').checked).toBe(false);
    expect(screen.getByLabelText('Willing for Seminar').checked).toBe(true);
    expect(screen.getByLabelText('Willing to be a PhD Helper').checked).toBe(false);
  });

  test('calls updateProfile and setEditing on form submission', async () => {
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(mockProfileData);
      expect(mockSetEditing).toHaveBeenCalledWith(false);
    });
  });

  test('calls setEditing with false on cancel button click', () => {
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockSetEditing).toHaveBeenCalledWith(false);
  });

  test('updates profile data when form fields are changed', () => {
    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    expect(mockSetProfileData).toHaveBeenCalled();
    const updaterFunction = mockSetProfileData.mock.calls[0][0];
    const updatedProfileData = updaterFunction(mockProfileData);
    expect(updatedProfileData).toEqual({
      ...mockProfileData,
      first_name: 'Jane',
    });
  });
});