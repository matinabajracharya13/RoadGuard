import { jest } from "@jest/globals";

jest.mock("../../services/authService", () => ({
  logoutUser: jest.fn(() => Promise.resolve()),
}));

jest.mock("../../components/TorchToggle", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return function MockTorchToggle() {
    return <Text>Emergency Flash</Text>;
  };
});

jest.mock("../../components/AdBanner", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return function MockAdBanner() {
    return <Text>Ad Banner</Text>;
  };
});

import React from "react";
import { render } from "@testing-library/react-native";
import { describe, it, expect } from "@jest/globals";

import SettingsScreen from "../../screens/SettingsScreen";
import { ThemeProvider } from "../../context/ThemeContext";

describe("SettingsScreen", () => {
  it("renders settings options", () => {
    const { getByText } = render(
      <ThemeProvider>
        <SettingsScreen
          navigation={{ getParent: () => ({ replace: () => {} }) }}
        />
      </ThemeProvider>,
    );

    expect(getByText("Settings")).toBeTruthy();
    expect(getByText("Dark Mode")).toBeTruthy();
    expect(getByText("Logout")).toBeTruthy();
    expect(getByText("Emergency Flash")).toBeTruthy();
    expect(getByText("Run Background Sync")).toBeTruthy();
    expect(getByText("Ad Banner")).toBeTruthy();
  });
});

jest.mock("../../services/syncService", () => ({
  syncPendingReports: jest.fn(() => Promise.resolve(1)),
}));
