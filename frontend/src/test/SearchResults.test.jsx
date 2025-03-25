/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SearchResults from "../jsx_files/Search_Results";

vi.mock("../jsx_files/BaseTemplate", () => ({
    default: ({ children }) => <div data-testid="base-template">{children}</div>,
}));

global.fetch = vi.fn();
describe("SearchResults", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Renders search page correctly", async () => {
        render(
            <MemoryRouter initialEntries={["/results?q=test"]}>
                <Routes>
                    <Route path="/results" element={<SearchResults />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByPlaceholderText("Search Handshake")).toBeInTheDocument();
    });

    test("Renders correctly when no users are returned by the search API", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ users: [] }),
        });
        render(
            <MemoryRouter initialEntries={["/results?q=notfound"]}>
                <Routes>
                    <Route path="/results" element={<SearchResults />} />
                </Routes>
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(screen.getByText(/No users found/i)).toBeInTheDocument();
        });
    });

    test("Shows error message when search fails", async () => {
        fetch.mockRejectedValueOnce(new Error("Network Error"));
        render(
            <MemoryRouter initialEntries={["/results?q=error"]}>
                <Routes>
                    <Route path="/results" element={<SearchResults />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole("heading", {name: /error/i })).toBeInTheDocument();
            expect(screen.getByText("Network Error")).toBeInTheDocument();
        });
    });
});