import { apiClient } from ".";

type HouseholdPayload = {
  name: string;
  wastescore: number;
};

type JoinPayload = {
  inviteCode: string;
};

export const createHousehold = async (data: HouseholdPayload) => {
  const response = await apiClient.post("/households", data);
  return response.data;
};

export const joinHousehold = async (data: JoinPayload) => {
  const response = await apiClient.post("/households/join", data);
  return response.data;
};
