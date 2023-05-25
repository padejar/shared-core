import APIService from "../../common/services/APIService";
import { ChangePassword } from "../types/ChangePassword";

class UserService {
  static async changePassword(
    data: ChangePassword
  ): Promise<string | undefined> {
    return APIService.jsonRequest<string, ChangePassword>(
      {
        method: "POST",
        path: "/iam/auth/change-password",
        data,
      },
      true
    );
  }
}

export default UserService;
