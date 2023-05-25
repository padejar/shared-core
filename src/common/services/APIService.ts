import axios, {
  AxiosError,
  AxiosRequestConfig,
  CancelToken,
  Method,
} from "axios";
import { getAccessToken, getRefreshToken, refreshTokens } from "../../auth";
import { UploadRequest } from "../../files";
import { LOADING_STATUS } from "../constants/loadingStatuses";

export interface ProgressEvent {
  total: number;
  loaded: number;
}
export interface RequestParameters<T> {
  method: Method;
  path: string;
  data?: T;
  headers: Record<string, string | number | boolean>;
  onUpload?: (progressEvent: ProgressEvent) => void;
  cancelToken?: CancelToken;
}

export interface JSONRequest<T> {
  method: Method;
  path: string;
  data?: T;
}

export interface FormDataRequest<T extends UploadRequest> {
  method: Method;
  path: string;
  data: T;
  onUpload?: (progressEvent: ProgressEvent) => void;
}

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

class APIService {
  refreshTokenStatus = LOADING_STATUS.IDLE;
  onTokenRefresh:
    | null
    | ((
        error: null | Error,
        tokens?: { accessToken: string; refreshToken: string } | undefined
      ) => void) = null;

  async callApi<T, R>({
    method,
    path,
    data,
    headers,
    cancelToken,
    onUpload,
  }: RequestParameters<R>): Promise<T> {
    const config: AxiosRequestConfig = {
      url: path,
      method,
      headers,
      data,
      onUploadProgress: onUpload,
      cancelToken,
    };

    const response = await axiosInstance(config);
    return response.data;
  }

  setAuthorizationHeader(
    headers: Record<string, string | number | boolean>
  ): Record<string, string | number | boolean> {
    const accessToken = getAccessToken();
    headers = {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    };

    return headers;
  }

  async checkRefreshTokenProgress() {
    return new Promise((resolve) => {
      const tokenCheck = () => {
        if (this.refreshTokenStatus === LOADING_STATUS.LOADING) {
          setTimeout(tokenCheck, 1000);
          return;
        }
        return resolve(true);
      };

      tokenCheck();
    });
  }

  async refreshToken() {
    if (this.refreshTokenStatus === LOADING_STATUS.LOADING) return;

    this.refreshTokenStatus = LOADING_STATUS.LOADING;

    try {
      const refreshToken = getRefreshToken();
      const result = await refreshTokens(refreshToken);
      if (result && this.onTokenRefresh) {
        this.onTokenRefresh(null, result.data);
      }
    } catch (e) {
      if (this.onTokenRefresh) this.onTokenRefresh(e as AxiosError);
    } finally {
      this.refreshTokenStatus = LOADING_STATUS.IDLE;
    }
  }

  async errorHandler<T, R>(
    error: AxiosError,
    requestConfig: RequestParameters<R>
  ): Promise<T> {
    if (!error.response || (error.response && error.response.status !== 401))
      throw error;

    await this.refreshToken();
    return this.retryRequest(error, requestConfig);
  }

  async retryRequest<T, R>(
    error: AxiosError,
    requestConfig: RequestParameters<R>
  ) {
    await this.checkRefreshTokenProgress();

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      throw error;
    }
    requestConfig.headers = this.setAuthorizationHeader(requestConfig.headers);
    return await this.callApi<T, R>(requestConfig);
  }

  async jsonRequest<T, R>(
    request: JSONRequest<R>,
    authenticated?: boolean,
    cancelToken?: CancelToken
  ): Promise<T> {
    let headers: Record<string, string | number | boolean> = {
      "Content-Type": "application/json",
    };

    if (authenticated) headers = this.setAuthorizationHeader(headers);

    const requestConfig = {
      ...request,
      headers,
      cancelToken,
    };

    try {
      return await this.callApi<T, R>(requestConfig);
    } catch (error) {
      return this.errorHandler(error as AxiosError, requestConfig);
    }
  }

  async uploadRequest<T, R extends UploadRequest>(
    request: FormDataRequest<R>,
    authenticated?: boolean,
    cancelToken?: CancelToken
  ): Promise<T> {
    const { data, ...rest } = request;
    let headers: Record<string, string | number | boolean> = {
      "Content-Type": "multipart/form-data",
    };

    if (authenticated) headers = this.setAuthorizationHeader(headers);

    const formData = new FormData();

    for (const field in data) {
      formData.append(field, data[field]);
    }

    const requestConfig = {
      ...rest,
      data: formData,
      headers,
      cancelToken,
    };

    try {
      const result = await this.callApi<T, FormData>(requestConfig);
      return result;
    } catch (error) {
      return this.errorHandler(error as AxiosError, requestConfig);
    }
  }
}

export default new APIService();
