/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Login from "../jsx_files/Login";
import { login as client } from "../jsx_files/api";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../jsx_files/api", () => ({
  login: vi.fn(),
}));

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("successful login stores tokens and redirects", async () => {
    client.mockResolvedValue({
      access_token: "mockAccessToken",
      refresh_token: "mockRefreshToken",
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const usernameInput = screen.getByPlaceholderText("example@example.ac.uk");
    const passwordInput = screen.getByPlaceholderText("************");
    const submitButton = screen.getByRole("button", { name: /login/i });
    await userEvent.type(usernameInput, "testuser@gla.ac.uk");
    await userEvent.type(passwordInput, "password123");
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(sessionStorage.getItem("access_token")).toBe("mockAccessToken");
      expect(sessionStorage.getItem("refresh_token")).toBe("mockRefreshToken");
      expect(mockNavigate).toHaveBeenCalledWith("/profile/");
    });
  });

  test("handles incorrect login (401 error)", async () => {
    client.mockRejectedValue({
      response: { status: 401 },
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    window.alert = vi.fn();
    const usernameInput = screen.getByPlaceholderText("example@example.ac.uk");
    const passwordInput = screen.getByPlaceholderText("************");
    const submitButton = screen.getByRole("button", { name: /login/i });
    await userEvent.type(usernameInput, "wronguser@edi.ac.uk");
    await userEvent.type(passwordInput, "wrongpass");
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Login Failed, incorrect username or password");
      expect(usernameInput).toHaveStyle("border-color: red");
      expect(passwordInput).toHaveStyle("border-color: red");
    });
  });

  test("handles network errors", async () => {
    client.mockRejectedValue({
      request: {},
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    window.alert = vi.fn();
    const usernameInput = screen.getByPlaceholderText("example@example.ac.uk");
    const passwordInput = screen.getByPlaceholderText("************");
    const submitButton = screen.getByRole("button", { name: /login/i });
    await userEvent.type(usernameInput, "testuser@gla.ac.uk");
    await userEvent.type(passwordInput, "password123");
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Network error, try checking your connection before continuing");
    });
  });
});
