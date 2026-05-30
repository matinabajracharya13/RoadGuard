import { jest } from "@jest/globals";

jest.mock("../../services/hazardService", () => ({
  getUserHazardReports: jest.fn(() =>
    Promise.resolve([
      {
        id: "r1",
        hazardType: "Pothole",
        severity: "High",
        description: "Large pothole near main road",
        latitude: -34.9285,
        longitude: 138.6007,
        createdAt: {
          toDate: () => new Date(2026, 4, 23, 14, 30),
        },
        source: "online",
      },
    ]),
  ),
}));

jest.mock("../../services/locationService", () => ({
  getAddressFromCoordinates: jest.fn(() =>
    Promise.resolve("Main Street, Melbourne"),
  ),
}));

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import { describe, it, expect } from "@jest/globals";

import DashboardScreen from "../../screens/DashboardScreen";
import { ThemeProvider } from "../../context/ThemeContext";

describe("DashboardScreen", () => {
  it("renders hazard feed and fetched report", async () => {
    const { getByText } = render(
      <ThemeProvider>
        <DashboardScreen
          navigation={{
            navigate: () => {},
            addListener: () => ({
              remove: () => {},
            }),
          }}
        />
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(getByText("Road Hazard Feed")).toBeTruthy();
      expect(getByText("Pothole")).toBeTruthy();
      expect(getByText("Large pothole near main road")).toBeTruthy();
    });
  });
});
