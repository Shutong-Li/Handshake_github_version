/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import DeleteAccount from '../jsx_files/Delete_Account';
import { deleteAccount } from '../jsx_files/api';
import { describe, test, expect, vi, beforeEach } from 'vitest';

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: vi.fn(),
}));

vi.mock('../jsx_files/api', () => ({
  deleteAccount: vi.fn(),
}));

describe('DeleteAccount Component', () => {
  let navigateMock;
  beforeEach(() => {
    navigateMock = vi.fn();
    useNavigate.mockReturnValue(navigateMock);
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  test('renders the warning message and buttons', () => {
    render(<DeleteAccount />);
    expect(screen.getByText('Warning: Account Deletion')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone. Are you sure you want to delete your account?')).toBeInTheDocument();
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('calls deleteAccount and navigates to home on confirm deletion', async () => {
    deleteAccount.mockResolvedValueOnce();
    render(<DeleteAccount />);
    fireEvent.click(screen.getByText('Confirm Deletion'));
    expect(deleteAccount).toHaveBeenCalledTimes(1);
  });

  test('navigates back on cancel', () => {
    render(<DeleteAccount />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  test('handles error when deleteAccount fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    deleteAccount.mockRejectedValueOnce(new Error('Failed to delete account'));
    render(<DeleteAccount />);
    fireEvent.click(screen.getByText('Confirm Deletion'));
    expect(deleteAccount).toHaveBeenCalledTimes(1);
    consoleErrorSpy.mockRestore();
  });
});