import { Action } from "redux";
import { ApplicationListRequest } from "../../types/ApplicationListRequest";
import { ApplicationResponse } from "../../types/ApplicationResponse";

export const GET_APPLICATION_LIST = "GET_APPLICATION_LIST";
export interface GetApplicationList extends Action {
  type: typeof GET_APPLICATION_LIST;
  payload: ApplicationListRequest;
}

export const GET_APPLICATION_LIST_SUCCESS = "GET_APPLICATION_LIST_SUCCESS";
export interface GetApplicationListSuccess extends Action {
  type: typeof GET_APPLICATION_LIST_SUCCESS;
  applications: ApplicationResponse[];
  applicationCount: number;
}

export const GET_APPLICATION_LIST_ERROR = "GET_APPLICATION_LIST_ERROR";
export interface GetApplicationListError extends Action {
  type: typeof GET_APPLICATION_LIST_ERROR;
}

export type ApplicationListActions =
  | GetApplicationList
  | GetApplicationListSuccess
  | GetApplicationListError;
