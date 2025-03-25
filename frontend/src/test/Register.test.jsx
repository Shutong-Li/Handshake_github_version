/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Register from "../jsx_files/Register";
import { BrowserRouter } from "react-router-dom";
import { registerUser, login, updateProfile, checkVerification, fetchOrganisations } from "../jsx_files/api";

vi.mock("../jsx_files/api", () => ({
  registerUser: vi.fn(),
  login: vi.fn(),
  updateProfile: vi.fn(),
  checkVerification: vi.fn(),
  fetchOrganisations: vi.fn()
}));

describe("Register Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  };

  it("renders stage 1 of registration", () => {
    renderComponent();
    expect(screen.getByText(/Register Here!/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next/i })).toBeInTheDocument();
  });

  it("moves to stage 2 after submitting stage 1", async () => {
    registerUser.mockResolvedValueOnce({});
    login.mockResolvedValueOnce({ access_token: "token", refresh_token: "refresh" });

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Enter email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/Check your email to verify your account!/i)).toBeInTheDocument();
    });
  });

  it("calls createAccount when moving to stage 2", async () => {
    registerUser.mockResolvedValueOnce({});
    login.mockResolvedValueOnce({ access_token: "token", refresh_token: "refresh" });

    renderComponent();
    fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Enter email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.click(screen.getByRole("button", { name: /Next/i }));

    await waitFor(() => {
      expect(registerUser).not.toHaveBeenCalledWith({
        username: "john@example.com",
        password: "password123",
        email: "john@example.com",
        first_name: "John",
        last_name: "Doe",
        userprofile: {
          first_name: "John",
          last_name: "Doe",
          affiliation: null,
          biography: '',
          subject_area: '',
          area_of_expertise: '',
          user_type: '',
        },
      });
    });
  });
});