import { all, AllEffect, fork, ForkEffect } from "@redux-saga/core/effects";
import applicationForm from "./applicationForm";
import applicationList from "./applicationList";
import contracts from "./contracts";
import documentForm from "./documentForm";

export default function* applicationSagas(): Generator<
  AllEffect<ForkEffect<void>>,
  void,
  unknown
> {
  yield all([
    fork(applicationList),
    fork(applicationForm),
    fork(documentForm),
    fork(contracts),
  ]);
}
