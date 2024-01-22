import React from "react";
import { render, fireEvent} from "@testing-library/react";
import Weather from "./Weather";

describe("Weather Component", () => {
  it("renders the component", () => {
    render(<Weather />);
  });

  it("allows users to input a location", () => {
    const { getByPlaceholderText } = render(<Weather />);
    const input = getByPlaceholderText(/Enter Location/i) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "New York" } });
    expect(input.value).toBe("New York");
  });

  it("allows users to toggle temperature units", () => {
    const { getByLabelText } = render(<Weather />);
    const toggleButton = getByLabelText(/Toggle Unit/i) as HTMLInputElement;

    fireEvent.click(toggleButton);
    expect(toggleButton.checked).toBe(true);
  });
});
