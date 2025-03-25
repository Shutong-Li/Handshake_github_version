/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { vi } from "vitest";
import SearchPage from "../jsx_files/Search_Page";

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    MemoryRouter: actual.MemoryRouter,
  };
});

describe('SearchPage', () => {
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders SearchPage with default elements', () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Search Handshake')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open to Seminar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open to Peer Review/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open to Allyship/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /PhD Helpers/i })).toBeInTheDocument();
    });

  test('updates query input when typing', () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );
    const searchInput = screen.getByPlaceholderText(/Search Handshake/i);
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    expect(searchInput).toHaveValue('test query');
  });

  test('toggles filter buttons and updates active class', () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );
    const seminarButton = screen.getByRole('button', { name: /Open to Seminar/i });
    const peerButton = screen.getByRole('button', { name: /Open to Peer Review/i });
    expect(seminarButton).not.toHaveClass('active');
    expect(peerButton).not.toHaveClass('active');
    fireEvent.click(seminarButton);
    expect(seminarButton).toHaveClass('active');
    fireEvent.click(peerButton);
    expect(peerButton).toHaveClass('active');
    fireEvent.click(seminarButton);
    expect(seminarButton).not.toHaveClass('active');
  });

  test('does not navigate when there is no query or selected filters', () => {
    const mockNavigate = vi.fn();
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );
    const searchButton = screen.getByTestId('search-button');
    fireEvent.click(searchButton);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('toggles filters when filter buttons are clicked', () => {
    render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );
    const seminarButton = screen.getByRole('button', { name: /Open to Seminar/i });
    const peerButton = screen.getByRole('button', { name: /Open to Peer Review/i });
    const allyshipButton = screen.getByRole('button', { name: /Open to Allyship/i });
    const phdButton = screen.getByRole('button', { name: /PhD Helpers/i });
    expect(seminarButton).not.toHaveClass('active');
    expect(peerButton).not.toHaveClass('active');
    expect(allyshipButton).not.toHaveClass('active');
    expect(phdButton).not.toHaveClass('active');
    fireEvent.click(seminarButton);
    expect(seminarButton).toHaveClass('active');
    fireEvent.click(peerButton);
    expect(peerButton).toHaveClass('active');
    fireEvent.click(allyshipButton);
    expect(allyshipButton).toHaveClass('active');
    fireEvent.click(phdButton);
    expect(phdButton).toHaveClass('active');
    fireEvent.click(seminarButton);
    expect(seminarButton).not.toHaveClass('active');
  });
});
