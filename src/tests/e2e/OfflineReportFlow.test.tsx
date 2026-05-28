import { jest } from "@jest/globals";

jest.mock("../../services/hazardService", () => ({
  submitHazardReport: jest.fn(),
}));
jest.mock("../../services/locationService", () => ({
  getCurrentLocation: jest.fn(),
}));
jest.mock("../../services/sqliteService", () => ({
  savePendingHazardReport: jest.fn(),
}));
jest.mock("../../services/cameraService", () => ({
  captureHazardPhoto: jest.fn(),
}));
jest.mock("../../services/localImageService", () => ({
  saveImageLocally: jest.fn(),
}));
jest.mock("../../services/notificationService", () => ({
  requestNotificationPermission: jest.fn(),
  sendHazardNotification: jest.fn(),
}));
jest.mock("@react-native-community/netinfo", () => ({
  fetch: jest.fn(),
}));

jest.spyOn(require("react-native").Alert, "alert").mockImplementation(() => {});

import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { describe, it, expect, beforeEach } from "@jest/globals";

import ReportHazardScreen from "../../screens/ReportHazardScreen";
import { ThemeProvider } from "../../context/ThemeContext";

import { getCurrentLocation } from "../../services/locationService";
import { savePendingHazardReport } from "../../services/sqliteService";
import { saveImageLocally } from "../../services/localImageService";
import {
  requestNotificationPermission,
  sendHazardNotification,
} from "../../services/notificationService";
import NetInfo from "@react-native-community/netinfo";

describe("E2E: Offline hazard report saves locally", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentLocation as any).mockResolvedValue({
      latitude: -34.9,
      longitude: 138.6,
    });
    (saveImageLocally as any).mockResolvedValue("");
    (requestNotificationPermission as any).mockResolvedValue(undefined);
    (sendHazardNotification as any).mockResolvedValue(undefined);
    (NetInfo.fetch as any).mockResolvedValue({ isConnected: false });
  });

  it('saves the report to local SQLite when device is offline', async () => {
    const navigation = { goBack: jest.fn(), replace: jest.fn() };

    const { getByText, getByPlaceholderText } = render(
      <ThemeProvider>
        <ReportHazardScreen navigation={navigation} route={{ params: {} }} />
      </ThemeProvider>
    );

    fireEvent.press(getByText('Flooding'));
    fireEvent.press(getByText('Medium'));
    fireEvent.changeText(
      getByPlaceholderText('Describe the hazard...'),
      'Road flooded after heavy rain'
    );

    await act(async () => {
      fireEvent.press(getByText('Capture GPS'));
    });
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      fireEvent.press(getByText('Submit Hazard Report'));
    });
    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(savePendingHazardReport).toHaveBeenCalledTimes(1);
    });

    expect(savePendingHazardReport).toHaveBeenCalledWith(
      'Flooding',
      'Medium',
      'Road flooded after heavy rain',
      -34.9,
      138.6
    );
  }, 15000);
});
