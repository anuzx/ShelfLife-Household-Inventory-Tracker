import { authClient } from ".";

type SignupPayload = {
  name: string;
  email: string;
  password: string;
};

type SigninPayload = {
  email: string;
  password: string;
};

type SinginResponse = {
  statusCode: number;
  message: string;
  data: {
    token: string;
  };
};

const signup = async (data: SignupPayload) => {
  const response = await authClient.post("/auth/register", data);
  return response.data;
};

const signin = async (data: SigninPayload): Promise<SinginResponse> => {
  const response = await authClient.post("/auth/login", data);
  return response.data;
};

export { signup, signin };
