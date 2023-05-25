import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import authentication from "./authentication";
import watchResetPassword from "./resetPassword";

export default function* authSagas(): Generator<
  AllEffect<ForkEffect<void>>,
  void,
  unknown
> {
  yield all([fork(authentication), fork(watchResetPassword)]);
}
