import APIService from "../../common/services/APIService";
import { SingleResponse } from "../../common/types/SingleResponse";
import { AuthenticateRequest } from "../types/AuthenticateRequest";
import { LogoutRequest } from "../types/LogoutRequest";
import { ResetPasswordRequest } from "../types/ResetPasswordRequest";
import { TokenResponse } from "../types/TokenResponse";
import { UpdatePasswordRequest } from "../types/UpdatePassword";

class AuthService {
  public static async resetPasswordRequest(
    data: ResetPasswordRequest
  ): Promise<SingleResponse<string> | undefined> {
    const result = await APIService.jsonRequest<
      SingleResponse<string>,
      ResetPasswordRequest
    >({
      method: "POST",
      path: `/iam/auth/reset-password`,
      data,
    });
    return result;
  }
  public static async authenticate(
    data: AuthenticateRequest
  ): Promise<SingleResponse<TokenResponse> | undefined> {
    const result = await APIService.jsonRequest<
      SingleResponse<TokenResponse>,
      AuthenticateRequest
    >({
      method: "POST",
      path: `/iam/auth/login`,
      data,
    });
    return result;
  }
  public static async updatePassword(
    data: UpdatePasswordRequest
  ): Promise<SingleResponse<string> | undefined> {
    const result = await APIService.jsonRequest<
      SingleResponse<string>,
      UpdatePasswordRequest
    >({
      method: "PUT",
      path: `/iam/auth/reset-password`,
      data,
    });
    return result;
  }
  public static logout(refreshToken: string): void {
    APIService.jsonRequest<SingleResponse<string>, LogoutRequest>({
      method: "POST",
      path: `/iam/auth/logout`,
      data: { refreshToken },
    });
  }
}

export default AuthService;
