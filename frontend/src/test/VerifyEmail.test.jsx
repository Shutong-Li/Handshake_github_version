/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useNavigate, useParams} from 'react-router-dom';
import VerifyEmail from '../jsx_files/VerifyEmail';
import { client } from '../jsx_files/api';

vi.mock('../jsx_files/api', () => ({
  client: {
    get: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn(),
  };
});

describe('VerifyEmail Component', () => {
  let navigateMock;
  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock = vi.fn();
    useNavigate.mockReturnValue(navigateMock);
  });

  const renderComponent = (token) => {
    useParams.mockReturnValue({ token });
    return render(
      <MemoryRouter>
        <VerifyEmail />
      </MemoryRouter>
    );
  };

  it('renders the spinner while verifying', () => {
    client.get.mockImplementation(() => new Promise(() => {}));
    renderComponent('test-token');
    expect(screen.getByText(/Verifying Email Address.../i)).toBeInTheDocument();
    expect(screen.getByText(/Please wait while we confirm your email/i)).toBeInTheDocument();
  });

  it('displays the success message on successful verification', async () => {
    client.get.mockResolvedValueOnce({});
    renderComponent('test-token');
    await waitFor(() => {
      expect(screen.getByText(/✓ Email Verified Successfully!/i)).toBeInTheDocument();
      expect(screen.getByText(/You can now safely close this window./i)).toBeInTheDocument();
    });
  });

  it('displays the error message on failed verification', async () => {
    client.get.mockRejectedValueOnce({ name: 'Error', response: { data: { error: 'Invalid token' } } });
    renderComponent('test-token');
    await waitFor(() => {
      expect(screen.getByText(/✗ Verification Failed/i)).toBeInTheDocument();
      expect(screen.getByText(/Please try registering again./i)).toBeInTheDocument();
    });
  });

  it('does not navigate or close the window if the request is aborted', async () => {
    const abortError = { name: 'CanceledError' };
    client.get.mockRejectedValueOnce(abortError);
    const closeMock = vi.spyOn(window, 'close').mockImplementation(() => {});
    renderComponent('test-token');
    await waitFor(() => {
      expect(navigateMock).not.toHaveBeenCalled();
      expect(closeMock).not.toHaveBeenCalled();
    });
    
    closeMock.mockRestore();
  });
});