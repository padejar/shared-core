import { CancelToken } from "axios";
import APIService from "../../common/services/APIService";
import { ListResponse } from "../../common/types/ListResponse";
import { SingleResponse } from "../../common/types/SingleResponse";
import {
  GlassGuideDetailsListRequest,
  GlassGuideDetailsResponse,
  GlassGuideNvicListRequest,
  GlassGuideNvicResponse,
  GlassGuideOptionListRequest,
  GlassGuideOptionResponse,
  GlassGuideResponse,
} from "../types/GlassGuide";

class GlassGuideService {
  public static async checkGlassGuide(
    cancelToken?: CancelToken
  ): Promise<SingleResponse<boolean>> {
    const result = await APIService.jsonRequest<
      SingleResponse<boolean>,
      unknown
    >(
      {
        method: "POST",
        path: "/vehicle/glass-guides/check",
      },
      true,
      cancelToken
    );

    return result;
  }

  public static async getYearList(
    { modelTypeCode }: Partial<GlassGuideNvicListRequest>,
    cancelToken?: CancelToken
  ): Promise<ListResponse<number>> {
    const result = await APIService.jsonRequest<ListResponse<number>, unknown>(
      {
        method: "POST",
        path: "/vehicle/glass-guides/year-list",
        data: { modelTypeCode },
      },
      true,
      cancelToken
    );

    return result;
  }

  public static async getMakeList(
    { modelTypeCode, yearCreate }: Partial<GlassGuideNvicListRequest>,
    cancelToken?: CancelToken
  ): Promise<ListResponse<GlassGuideResponse>> {
    const result = await APIService.jsonRequest<
      ListResponse<GlassGuideResponse>,
      Partial<GlassGuideNvicListRequest>
    >(
      {
        method: "POST",
        path: "/vehicle/glass-guides/make-list",
        data: { modelTypeCode, yearCreate },
      },
      true,
      cancelToken
    );

    return result;
  }

  public static async getModelList(
    {
      modelTypeCode,
      yearCreate,
      manufacturerCode,
    }: Partial<GlassGuideNvicListRequest>,
    cancelToken?: CancelToken
  ): Promise<ListResponse<GlassGuideResponse>> {
    const result = await APIService.jsonRequest<
      ListResponse<GlassGuideResponse>,
      Partial<GlassGuideNvicListRequest>
    >(
      {
        method: "POST",
        path: "/vehicle/glass-guides/model-list",
        data: { modelTypeCode, yearCreate, manufacturerCode },
      },
      true,
      cancelToken
    );

    return result;
  }

  public static async getVariantList(
    {
      modelTypeCode,
      yearCreate,
      manufacturerCode,
      familyCode,
    }: Partial<GlassGuideNvicListRequest>,
    cancelToken?: CancelToken
  ): Promise<ListResponse<string>> {
    const result = await APIService.jsonRequest<
      ListResponse<string>,
      Partial<GlassGuideNvicListRequest>
    >(
      {
        method: "POST",
        path: "/vehicle/glass-guides/variant-list",
        data: { modelTypeCode, yearCreate, manufacturerCode, familyCode },
      },
      true,
      cancelToken
    );

    return result;
  }

  public static async getSeriesList(
    {
      modelTypeCode,
      yearCreate,
      manufacturerCode,
      familyCode,
      variantName,
    }: Partial<GlassGuideNvicListRequest>,
    cancelToken?: CancelToken
  ): Promise<ListResponse<GlassGuideResponse>> {
    const result = await APIService.jsonRequest<
      ListResponse<GlassGuideResponse>,
      Partial<GlassGuideNvicListRequest>
    >(
      {
        method: "POST",
        path: "/vehicle/glass-guides/series-list",
        data: {
          modelTypeCode,
          yearCreate,
          manufacturerCode,
          familyCode,
          variantName,
        },
      },
      true,
      cancelToken
    );

    return result;
  }

  public static async getNvicList(
    {
      modelTypeCode,
      yearCreate,
      manufacturerCode,
      familyCode,
      variantName,
      seriesCode = null,
      keyword = null,
    }: Partial<GlassGuideNvicListRequest>,
    cancelToken?: CancelToken
  ): Promise<ListResponse<GlassGuideNvicResponse>> {
    const result = await APIService.jsonRequest<
      ListResponse<GlassGuideNvicResponse>,
      Partial<GlassGuideNvicListRequest>
    >(
      {
        method: "POST",
        path: "/vehicle/glass-guides/nvic-list",
        data: {
          modelTypeCode,
          yearCreate,
          manufacturerCode,
          familyCode,
          variantName,
          seriesCode,
          keyword,
        },
      },
      true
    );

    return result;
  }

  public static async getOptionList(
    modelTypeCode: string,
    nvic: string,
    optionType: string | null = null,
    cancelToken?: CancelToken
  ): Promise<ListResponse<GlassGuideOptionResponse>> {
    const result = await APIService.jsonRequest<
      ListResponse<GlassGuideOptionResponse>,
      GlassGuideOptionListRequest
    >(
      {
        method: "POST",
        path: "/vehicle/glass-guides/nvic-option-list",
        data: { modelTypeCode, nvic, optionType },
      },
      true,
      cancelToken
    );

    return result;
  }

  public static async getDetailsList(
    data: GlassGuideDetailsListRequest,
    cancelToken?: CancelToken
  ): Promise<ListResponse<GlassGuideDetailsResponse>> {
    const result = await APIService.jsonRequest<
      ListResponse<GlassGuideDetailsResponse>,
      GlassGuideDetailsListRequest
    >(
      {
        method: "POST",
        path: "/vehicle/glass-guides/details-specification-list",
        data,
      },
      true,
      cancelToken
    );

    return result;
  }
}

export default GlassGuideService;
