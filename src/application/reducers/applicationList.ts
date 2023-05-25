import { DATATABLE_MAX_ROWS } from "../../common/constants/datatable";
import {
  ApplicationListActions,
  GET_APPLICATION_LIST,
  GET_APPLICATION_LIST_ERROR,
  GET_APPLICATION_LIST_SUCCESS,
} from "../actions/types/applicationList";
import { ApplicationListState } from "../types/ApplicationListState";

export const applicationListState: ApplicationListState = {
  applications: [],
  applicationCount: 0,
  isLoading: false,
  resetPage: false,
};

export const reducer = (
  state: ApplicationListState = applicationListState,
  action: ApplicationListActions
): ApplicationListState => {
  switch (action.type) {
    case GET_APPLICATION_LIST: {
      const { offset, limit, status, order, search } = action.payload;

      let resetPage = false;
      if (
        order !== state.order ||
        status !== state.status ||
        search !== state.search
      )
        resetPage = true;

      return {
        ...state,
        status: status ? status : undefined,
        order: order ? order : undefined,
        search: search ? search : undefined,
        limit: limit ? limit : DATATABLE_MAX_ROWS,
        offset: offset ? offset : state.offset,
        resetPage,
        isLoading: true,
      };
    }
    case GET_APPLICATION_LIST_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        resetPage: false,
        applications: action.applications,
        applicationCount: action.applicationCount,
      };
    }
    case GET_APPLICATION_LIST_ERROR: {
      return {
        ...state,
        isLoading: false,
      };
    }

    default: {
      return state;
    }
  }
};
