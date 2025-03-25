/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Affiliates from "../jsx_files/Affiliates";
import { fetchOrganisations } from "../jsx_files/api";
import { vi } from "vitest";

vi.mock("../jsx_files/api", () => ({
  fetchOrganisations: vi.fn(),
}));

describe("Affiliates Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the component correctly", async () => {
    fetchOrganisations.mockResolvedValue({
      Organisations: [
        {
          name: "University of Glasgow",
          picture: "glasgow.png",
          ambassador: "John Doe",
          email: "contact@glasgow.ac.uk",
          phone: "+44 123 4567",
        },
      ],
    });
    render(
      <MemoryRouter>
        <Affiliates />
      </MemoryRouter>
    );
    expect(screen.getByText("Our Partner Organisations")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("University of Glasgow")).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "University of Glasgow logo" })).toBeInTheDocument();
    });
  });

  test("displays affiliates fetched from API", async () => {
    fetchOrganisations.mockResolvedValue({
      Organisations: [
        {
          name: "University of Edinburgh",
          picture: "edinburgh.png",
          ambassador: "Jane Doe",
          email: "contact@ed.ac.uk",
          phone: "+44 987 6543",
        },
      ],
    });

    render(
      <MemoryRouter>
        <Affiliates />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("University of Edinburgh")).toBeInTheDocument();
      expect(screen.getByRole("img", { name: "University of Edinburgh logo" })).toBeInTheDocument();
    });
  });

  test("opens and closes modal when affiliate is clicked", async () => {
    const testAffiliates = {
      Organisations: [
        {
          name: "University of Oxford",
          picture: "oxford.png",
          ambassador: "Alice Smith",
          email: "alice@ox.ac.uk",
          phone: "+44 555 6789",
        },
      ],
    };
    fetchOrganisations.mockResolvedValue(testAffiliates);

    render(
      <MemoryRouter>
        <Affiliates />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("University of Oxford")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("University of Oxford"));
    await waitFor(() => {
      expect(screen.getByText("Alice Smith")).toBeInTheDocument();
      expect(screen.getByText("alice@ox.ac.uk")).toBeInTheDocument();
      expect(screen.getByText("+44 555 6789")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    await waitFor(() => {
      expect(screen.queryByText("Alice Smith")).not.toBeInTheDocument();
    });
  });
});