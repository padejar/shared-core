import { useCallback, useState } from "react";
import { AxiosError } from "axios";
import { processErrorMessage } from "../../error-handler/utils";
import { dispatch, actionCreator } from "../../notification";
import DocumentService from "../services/DocumentService";

const { useNotificationDispatch } = dispatch;
const { setNotification } = actionCreator;

interface UseDownloadDocument {
  isLoading: boolean;
  downloadFile: (path: string) => Promise<void>;
}

const useDownloadDocument = (): UseDownloadDocument => {
  const [isLoading, setIsLoading] = useState(false);
  const notifDispatch = useNotificationDispatch();

  const downloadFile = useCallback(
    async (path) => {
      try {
        setIsLoading(true);
        const result = await DocumentService.downloadDocument(path);
        window.open(result.data, "_blank");
      } catch (error) {
        const body = processErrorMessage(error as AxiosError);
        notifDispatch(
          setNotification({
            id: "DOWNLOAD_FILE_ERROR",
            body,
            className: "qst-notif-danger",
          })
        );
      } finally {
        setIsLoading(false);
      }
    },
    [notifDispatch]
  );

  return {
    isLoading,
    downloadFile,
  };
};

export default useDownloadDocument;
