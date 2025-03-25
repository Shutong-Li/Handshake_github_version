/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import App from "../jsx_files/App";

describe("App Routing", () => {
  const renderWithRouter = (initialRoute) => {
    render(<App />);
  };

  test("renders UserNoticeboard at default route", () => {
    renderWithRouter("/");
    expect(screen.getByText('Notice Board')).toBeInTheDocument();
  });

  test("renders navigation to Login page", async () => {
    renderWithRouter("/login");
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test("renders navigation to Register page", async () => {
    renderWithRouter("/register");
    expect(screen.getByText('Register')).toBeInTheDocument();
  });
});
