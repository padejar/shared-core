import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError, CancelToken } from "axios";
import { getAxiosCancelToken } from "../../../common/utils/api";
import { processErrorMessage } from "../../../error-handler/utils";
import * as notification from "../../../notification";
import GlassGuideService from "../../services/GlassGuideService";
import {
  GlassGuideNvicListRequest,
  GlassGuideNvicResponse,
  GlassGuideOptionResponse,
  GlassGuideResponse,
  GlassGuideDetailsResponse,
  GlassGuideDetailsListRequest,
  GlassGuideCalculationResult,
  glassGuideDetailsResponseDefaultValue,
} from "../../types/GlassGuide";

const {
  actionCreator: { setNotification },
  dispatch: { useNotificationDispatch },
} = notification;

interface UseGlassGuideArgs {
  nvicListRequest: GlassGuideNvicListRequest;
  getDetailsSpecRequest: GlassGuideDetailsListRequest;
  resultValues: GlassGuideCalculationResult;
}

interface UseGlassGuide {
  yearList: number[];
  makeList: GlassGuideResponse[];
  modelList: GlassGuideResponse[];
  variantList: string[];
  seriesList: GlassGuideResponse[];
  nvicList: GlassGuideNvicResponse[];
  optionList: GlassGuideOptionResponse[];
  detailsSpec: GlassGuideDetailsResponse;
  isLoading: boolean;
}
const useGlassGuide = ({
  nvicListRequest,
  getDetailsSpecRequest,
  resultValues,
}: UseGlassGuideArgs): UseGlassGuide => {
  const [isLoading, setIsLoading] = useState(false);
  const notifDispatch = useNotificationDispatch();

  const {
    modelTypeCode,
    yearCreate,
    manufacturerCode,
    familyCode,
    variantName,
    seriesCode,
  } = nvicListRequest;

  const [yearList, setYearList] = useState<number[]>([]);
  const [makeList, setMakeList] = useState<GlassGuideResponse[]>([]);
  const [modelList, setModelList] = useState<GlassGuideResponse[]>([]);
  const [variantList, setVariantList] = useState<string[]>([]);
  const [seriesList, setSeriestList] = useState<GlassGuideResponse[]>([]);
  const [nvicList, setNvicList] = useState<GlassGuideNvicResponse[]>([]);
  const [optionList, setOptionsList] = useState<GlassGuideOptionResponse[]>([]);
  const [detailsSpec, setDetailsSpec] = useState<GlassGuideDetailsResponse>(
    glassGuideDetailsResponseDefaultValue
  );
  const [shouldFetchOptions, setShouldFetchOptions] = useState(false);

  const clearDetailSpec = useCallback(() => {
    setDetailsSpec(glassGuideDetailsResponseDefaultValue);
  }, []);

  const getYearList = useCallback(
    async (modelTypeCode: string, cancelToken?: CancelToken) => {
      setOptionsList([]);
      try {
        setIsLoading(true);
        const { data } = await GlassGuideService.getYearList(
          { modelTypeCode },
          cancelToken
        );
        setYearList(data);
        setIsLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setIsLoading(false);
          const body = processErrorMessage(error as AxiosError);
          notifDispatch(
            setNotification({
              id: "GLASS_GUIDE_ERROR",
              body,
              className: "qst-notif-danger",
            })
          );
        }
      }
    },
    [notifDispatch]
  );

  const getMakeList = useCallback(
    async (yearCreate: number, cancelToken?: CancelToken) => {
      setOptionsList([]);
      try {
        setIsLoading(true);
        const { data } = await GlassGuideService.getMakeList(
          {
            modelTypeCode,
            yearCreate,
          },
          cancelToken
        );
        setMakeList(data);
        setIsLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setIsLoading(false);
          const body = processErrorMessage(error as AxiosError);
          notifDispatch(
            setNotification({
              id: "GLASS_GUIDE_ERROR",
              body,
              className: "qst-notif-danger",
            })
          );
        }
      }
    },
    [notifDispatch, modelTypeCode]
  );

  const getModelList = useCallback(
    async (manufacturerCode: string, cancelToken?: CancelToken) => {
      setOptionsList([]);
      try {
        setIsLoading(true);
        const { data } = await GlassGuideService.getModelList(
          {
            modelTypeCode,
            yearCreate,
            manufacturerCode,
          },
          cancelToken
        );
        setModelList(data);
        setIsLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setIsLoading(false);
          const body = processErrorMessage(error as AxiosError);
          notifDispatch(
            setNotification({
              id: "GLASS_GUIDE_ERROR",
              body,
              className: "qst-notif-danger",
            })
          );
        }
      }
    },
    [notifDispatch, modelTypeCode, yearCreate]
  );

  const getVariantList = useCallback(
    async (familyCode: string, cancelToken?: CancelToken) => {
      setOptionsList([]);
      try {
        setIsLoading(true);
        const { data } = await GlassGuideService.getVariantList(
          {
            modelTypeCode,
            yearCreate,
            manufacturerCode,
            familyCode,
          },
          cancelToken
        );
        setVariantList(data);
        setIsLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setIsLoading(false);
          const body = processErrorMessage(error as AxiosError);
          notifDispatch(
            setNotification({
              id: "GLASS_GUIDE_ERROR",
              body,
              className: "qst-notif-danger",
            })
          );
        }
      }
    },
    [notifDispatch, modelTypeCode, yearCreate, manufacturerCode]
  );

  const getSeriesList = useCallback(
    async (variantName: string, cancelToken?: CancelToken) => {
      setOptionsList([]);
      try {
        setIsLoading(true);
        const { data } = await GlassGuideService.getSeriesList(
          {
            modelTypeCode,
            yearCreate,
            manufacturerCode,
            familyCode,
            variantName,
          },
          cancelToken
        );
        setSeriestList(data);
        setIsLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setIsLoading(false);
          const body = processErrorMessage(error as AxiosError);
          notifDispatch(
            setNotification({
              id: "GLASS_GUIDE_ERROR",
              body,
              className: "qst-notif-danger",
            })
          );
        }
      }
    },
    [notifDispatch, modelTypeCode, yearCreate, manufacturerCode, familyCode]
  );

  const getNvicList = useCallback(
    async (
      variantName: string,
      seriesCode?: string | null,
      cancelToken?: CancelToken
    ) => {
      setOptionsList([]);
      try {
        setIsLoading(true);
        const { data } = await GlassGuideService.getNvicList(
          {
            modelTypeCode,
            yearCreate,
            manufacturerCode,
            familyCode,
            variantName,
            seriesCode,
          },
          cancelToken
        );
        setNvicList(data);
        setShouldFetchOptions(true);
        setIsLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setIsLoading(false);
          const body = processErrorMessage(error as AxiosError);
          notifDispatch(
            setNotification({
              id: "GLASS_GUIDE_ERROR",
              body,
              className: "qst-notif-danger",
            })
          );
        }
      }
    },
    [notifDispatch, modelTypeCode, yearCreate, manufacturerCode, familyCode]
  );

  const getOptionList = useCallback(
    async (modelTypeCode: string, nvic: string, cancelToken?: CancelToken) => {
      try {
        setIsLoading(true);
        const { data } = await GlassGuideService.getOptionList(
          modelTypeCode,
          nvic,
          null,
          cancelToken
        );
        setOptionsList(data);
        setShouldFetchOptions(false);
        setIsLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setIsLoading(false);
          const body = processErrorMessage(error as AxiosError);
          notifDispatch(
            setNotification({
              id: "GLASS_GUIDE_ERROR",
              body,
              className: "qst-notif-danger",
            })
          );
        }
      }
    },
    [notifDispatch]
  );

  const getDetailsSpec = useCallback(
    async (
      payload: GlassGuideDetailsListRequest,
      cancelToken?: CancelToken
    ) => {
      try {
        setIsLoading(true);
        const { data } = await GlassGuideService.getDetailsList(
          payload,
          cancelToken
        );

        if (data.length <= 0) {
          throw new Error("No details spec returned from the API");
        }

        setDetailsSpec(data[0]);
        setIsLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          setIsLoading(false);
          const body = processErrorMessage(error as AxiosError);
          notifDispatch(
            setNotification({
              id: "GLASS_GUIDE_ERROR",
              body,
              className: "qst-notif-danger",
            })
          );
        }
      }
    },
    [notifDispatch]
  );

  useEffect(() => {
    const cancelToken = getAxiosCancelToken();
    clearDetailSpec();
    if (modelTypeCode) {
      getYearList(modelTypeCode, cancelToken.token);
    }

    return () => {
      cancelToken.cancel();
    };
  }, [clearDetailSpec, getYearList, modelTypeCode]);

  useEffect(() => {
    const cancelToken = getAxiosCancelToken();
    clearDetailSpec();
    if (yearCreate) {
      getMakeList(yearCreate, cancelToken.token);
    }

    return () => {
      cancelToken.cancel();
    };
  }, [clearDetailSpec, getMakeList, yearCreate]);

  useEffect(() => {
    const cancelToken = getAxiosCancelToken();
    clearDetailSpec();
    if (manufacturerCode) {
      getModelList(manufacturerCode, cancelToken.token);
    }

    return () => {
      cancelToken.cancel();
    };
  }, [clearDetailSpec, getModelList, manufacturerCode]);

  useEffect(() => {
    const cancelToken = getAxiosCancelToken();
    clearDetailSpec();
    if (familyCode) {
      getVariantList(familyCode, cancelToken.token);
    }

    return () => {
      cancelToken.cancel();
    };
  }, [clearDetailSpec, getVariantList, familyCode]);

  useEffect(() => {
    const cancelToken = getAxiosCancelToken();
    clearDetailSpec();
    setNvicList([]);
    if (variantName) {
      getSeriesList(variantName, cancelToken.token);
      getNvicList(variantName, seriesCode, cancelToken.token);
    }

    return () => {
      cancelToken.cancel();
    };
  }, [clearDetailSpec, getSeriesList, getNvicList, variantName, seriesCode]);

  useEffect(() => {
    if (!getDetailsSpecRequest.shouldFetchDetails) {
      setDetailsSpec((previousData) => ({
        ...previousData,
        ...resultValues,
        nvicCur: getDetailsSpecRequest.nvic,
      }));
    }
  }, [resultValues, getDetailsSpecRequest]);

  useEffect(() => {
    const cancelToken = getAxiosCancelToken();
    if (
      shouldFetchOptions &&
      nvicListRequest.modelTypeCode &&
      getDetailsSpecRequest.nvic
    ) {
      getOptionList(
        nvicListRequest.modelTypeCode,
        getDetailsSpecRequest.nvic,
        cancelToken.token
      );
    }

    return () => {
      cancelToken.cancel();
    };
  }, [
    nvicListRequest,
    getDetailsSpecRequest,
    shouldFetchOptions,
    getOptionList,
  ]);

  useEffect(() => {
    const cancelToken = getAxiosCancelToken();
    if (
      getDetailsSpecRequest.nvic &&
      getDetailsSpecRequest.shouldFetchDetails
    ) {
      getDetailsSpec(
        {
          actualKm: getDetailsSpecRequest.actualKm,
          modelTypeCode: getDetailsSpecRequest.modelTypeCode,
          nvic: getDetailsSpecRequest.nvic,
          options: getDetailsSpecRequest.options,
          useCache: getDetailsSpecRequest.useCache,
        },
        cancelToken.token
      );
    }

    return () => {
      cancelToken.cancel();
    };
  }, [getDetailsSpec, getDetailsSpecRequest]);

  return {
    yearList,
    makeList,
    modelList,
    variantList,
    seriesList,
    nvicList,
    optionList,
    detailsSpec,
    isLoading,
  };
};

export default useGlassGuide;
