import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  const { getByText } = render(<App />);
  console.log(getByText);
  const owner = getByText(/Login As Owner/i);
  const caseWorker = getByText(/Login As Case Worker/i);
  expect(owner).toBeInTheDocument();
  expect(caseWorker).toBeInTheDocument();
});
