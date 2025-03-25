/* Copyright (C) 2025 HandShake
Licensed under the Apache License, Version 2.0.
See LICENSE file for details. */

import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import BaseTemplate from "../jsx_files/Base_Template";

const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("BaseTemplate", () => {
    beforeEach(() => {
        sessionStorage.clear();
    });

    test("Renders header and footer correctly", () => {
        renderWithRouter(<BaseTemplate />);
        expect(screen.getByText("Handshake")).toBeInTheDocument();
        expect(screen.getByText("Handshake 2024 ©")).toBeInTheDocument();
    });

    test("Renders unauthenticated links when user is not logged in", () => {
        renderWithRouter(<BaseTemplate />);
        expect(screen.getByText("Login")).toBeInTheDocument();
        expect(screen.getByText("Register")).toBeInTheDocument();
        expect(screen.queryByAltText("profile-icon")).not.toBeInTheDocument();
    });

    test("Renders authenticated links and profile icon when user is logged in", () => {
        sessionStorage.setItem("access_token", "fake_token");
        renderWithRouter(<BaseTemplate />);
        expect(screen.getByText("Notice Board")).toBeInTheDocument();
        expect(screen.getByText("Search")).toBeInTheDocument();
        expect(screen.getByText("Affiliates")).toBeInTheDocument();
        expect(screen.getByAltText("profile-icon")).toBeInTheDocument();
    });

    test("Toggles profile dropdown on profile icon click", () => {
        sessionStorage.setItem("access_token", "fake_token");
        renderWithRouter(<BaseTemplate />);
        const profileIcon = screen.getByAltText("profile-icon");
        expect(screen.queryByText("Profile")).not.toBeInTheDocument();
        fireEvent.click(profileIcon);
        expect(screen.getByText("Profile")).toBeInTheDocument();
        fireEvent.click(profileIcon);
        expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    });

    test("Closes dropdown when clicking outside", () => {
        sessionStorage.setItem("access_token", "fake_token");
        renderWithRouter(<BaseTemplate />);
        const profileIcon = screen.getByAltText("profile-icon");
        fireEvent.click(profileIcon);
        expect(screen.getByText("Profile")).toBeInTheDocument();
        fireEvent.mouseDown(document.body);
        expect(screen.queryByText("Profile")).not.toBeInTheDocument();
    });
});

