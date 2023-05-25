import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import changePassword from "./changePassword";

export default function* userSagas(): Generator<
  AllEffect<ForkEffect<void>>,
  void,
  unknown
> {
  yield all([fork(changePassword)]);
}
