import { ListResponse } from "../../../common/types/ListResponse";
import { ApplicationListRequest } from "../../types/ApplicationListRequest";
import { ApplicationResponse } from "../../types/ApplicationResponse";
import {
  GetApplicationList,
  GetApplicationListError,
  GetApplicationListSuccess,
  GET_APPLICATION_LIST,
  GET_APPLICATION_LIST_ERROR,
  GET_APPLICATION_LIST_SUCCESS,
} from "../types/applicationList";

export const getApplicationList = (
  payload: ApplicationListRequest
): GetApplicationList => ({
  type: GET_APPLICATION_LIST,
  payload,
});

export const getApplicationListSuccess = (
  applicationResponse: ListResponse<ApplicationResponse>
): GetApplicationListSuccess => ({
  type: GET_APPLICATION_LIST_SUCCESS,
  applications: applicationResponse.data,
  applicationCount: applicationResponse.count ? applicationResponse.count : 0,
});

export const getApplicationListError = (): GetApplicationListError => ({
  type: GET_APPLICATION_LIST_ERROR,
});
