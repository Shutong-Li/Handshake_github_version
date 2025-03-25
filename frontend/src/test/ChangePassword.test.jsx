/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import ChangePassword from "../jsx_files/Change_Password";
import axios from "axios";

vi.mock("axios");

describe("ChangePassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.setItem("access_token", "fake_token");
  });

  test("renders the Change Password form", () => {
    render(
      <MemoryRouter>
        <ChangePassword />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Current Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Change Password/i })).toBeInTheDocument();
  });

  test("shows error when passwords do not match", async () => {
    render(
      <MemoryRouter>
        <ChangePassword />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: "wrongpassword" } });
    fireEvent.click(screen.getByRole("button", { name: /Change Password/i }));
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
  });
});
