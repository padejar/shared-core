import { eventChannel, EventChannel, buffers, END } from "@redux-saga/core";
import axios from "axios";
import { ProgressEvent } from "../../common/services/APIService";
import DocumentService from "../services/DocumentService";
import { UploadChannelEmittedData } from "../types/UploadChannelEmittedData";
import { UploadRequest } from "../types/UploadRequest";

export const createUploadFileChannel = <T, R extends UploadRequest>(
  uploadPath: string,
  data: R
): EventChannel<UploadChannelEmittedData<T>> => {
  return eventChannel((emit) => {
    const onProgress = ({ total, loaded }: ProgressEvent) => {
      const percentage = Math.floor((loaded * 100) / total);
      emit({ progress: percentage });
    };

    const cancelTokenSource = axios.CancelToken.source();

    DocumentService.uploadDocument<T, R>(
      uploadPath,
      data,
      onProgress,
      cancelTokenSource.token
    )
      .then((data) => {
        if (!data) throw new Error("data not found");
        emit({ result: data });
        emit(END);
      })
      .catch((error) => {
        emit({ error });
        emit(END);
      });

    return () => {
      cancelTokenSource.cancel();
    };
  }, buffers.sliding(2));
};
