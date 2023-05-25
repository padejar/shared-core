import axios, { CancelTokenSource } from "axios";

export const getAxiosCancelToken = (): CancelTokenSource => {
  const CancelToken = axios.CancelToken;
  return CancelToken.source();
};
