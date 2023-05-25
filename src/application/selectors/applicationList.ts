import { createSelector } from "@reduxjs/toolkit";
import { ApplicationListState } from "../types/ApplicationListState";
import { ApplicationState } from "../types/ApplicationState";

export const applicationListStateSelector = (
  state: ApplicationState
): ApplicationListState => state.application.applicationList;

export const getApplicationListSelector = createSelector(
  applicationListStateSelector,
  (applicationList) => applicationList.applications
);

export const getApplicationCountSelector = createSelector(
  applicationListStateSelector,
  (applicationList) => applicationList.applicationCount
);

export const getLoadingSelector = createSelector(
  applicationListStateSelector,
  (applicationList) => applicationList.isLoading
);

export const getStatusSelector = createSelector(
  applicationListStateSelector,
  (applicationList) => applicationList.status
);

export const getSearchSelector = createSelector(
  applicationListStateSelector,
  (applicationList) => applicationList.search
);

export const getResetPageSelector = createSelector(
  applicationListStateSelector,
  (applicationList) => applicationList.resetPage
);

export const getLimitSelector = createSelector(
  applicationListStateSelector,
  (applicationList) => applicationList.limit
);

export const getOrderSelector = createSelector(
  applicationListStateSelector,
  (applicationList) => applicationList.order
);

export const getListPayloadSelector = createSelector(
  applicationListStateSelector,
  (applicationList) => ({
    search: applicationList.search,
    status: applicationList.status,
    limit: applicationList.limit,
    offset: applicationList.offset,
    order: applicationList.order,
  })
);
