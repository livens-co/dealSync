import { Contract } from "../types";

export const fetchContracts = async (): Promise<Contract[]> => {
  // TODO Connect app to API
  const response = await fetch("http://localhost:3000/contracts");
  if (!response.ok) {
    throw new Error("Network error");
  }
  return response.json();
};
