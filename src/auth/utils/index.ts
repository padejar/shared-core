import APIService from "../../common/services/APIService";
import { SingleResponse } from "../../common/types/SingleResponse";
import { SentryService } from "../../error-handler";
import { TokenData } from "../types/TokenData";
import { TokenResponse } from "../types/TokenResponse";

export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

export const refreshTokens = async (
  refreshToken: string | null
): Promise<SingleResponse<TokenResponse> | undefined> => {
  if (!refreshToken) throw new Error("Refresh token not found");
  const result = await APIService.callApi<
    SingleResponse<TokenResponse>,
    { refreshToken: string }
  >({
    method: "POST",
    path: "/iam/auth/refresh",
    data: {
      refreshToken,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  const {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  } = result.data;

  storeTokens(newAccessToken, newRefreshToken);

  return result;
};

export const storeTokens = (
  accessToken: string,
  refreshToken: string
): void => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};

export const deleteTokens = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

export const decodeJwtToken = (token: string): TokenData | null => {
  if (token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (error) {
      SentryService.report(error);
    }
  }

  return null;
};
