import { CustomError } from "../model/CustomError";

export interface SignUpData {
  email: string;
  username: string;
  password: string;
  user_id: number;

}

export const createUser = async (
  userData: SignUpData,
  onSuccess: () => void,
  onError: (error: CustomError) => void
) => {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new CustomError(errorData.message || "Sign-up failed");
    }

    onSuccess();
  } catch (error: any) {
    onError(new CustomError(error.message || "An unexpected error occurred"));
  }
};
