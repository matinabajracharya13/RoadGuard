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

import { submitHazardReport } from "../../services/hazardService";
import { getCurrentLocation } from "../../services/locationService";
import { saveImageLocally } from "../../services/localImageService";
import {
  requestNotificationPermission,
  sendHazardNotification,
} from "../../services/notificationService";
import NetInfo from "@react-native-community/netinfo";

describe("E2E: Submit hazard report flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getCurrentLocation as any).mockResolvedValue({
      latitude: -34.9285,
      longitude: 138.6007,
    });
    (submitHazardReport as any).mockResolvedValue({ id: "new123" });
    (saveImageLocally as any).mockResolvedValue("file:///saved.jpg");
    (requestNotificationPermission as any).mockResolvedValue(undefined);
    (sendHazardNotification as any).mockResolvedValue(undefined);
    (NetInfo.fetch as any).mockResolvedValue({ isConnected: true });
  });

  it('submits a complete hazard report when all fields are filled', async () => {
    const navigation = { goBack: jest.fn(), replace: jest.fn() };

    const { getByText, getByPlaceholderText } = render(
      <ThemeProvider>
        <ReportHazardScreen navigation={navigation} route={{ params: {} }} />
      </ThemeProvider>
    );

    fireEvent.press(getByText('Pothole'));
    fireEvent.press(getByText('High'));
    fireEvent.changeText(
      getByPlaceholderText('Describe the hazard...'),
      'Large pothole near the intersection'
    );

    // Capture GPS — flush the promise + state update fully
    await act(async () => {
      fireEvent.press(getByText('Capture GPS'));
    });
    // extra flush so setLocation has definitely committed
    await act(async () => {
      await Promise.resolve();
    });

    // Submit — flush again
    await act(async () => {
      fireEvent.press(getByText('Submit Hazard Report'));
    });
    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(submitHazardReport).toHaveBeenCalledTimes(1);
    });

    expect(submitHazardReport).toHaveBeenCalledWith(
      expect.objectContaining({
        hazardType: 'Pothole',
        severity: 'High',
        description: 'Large pothole near the intersection',
        latitude: -34.9285,
        longitude: 138.6007,
      })
    );
  }, 15000);
});
