import "../assets/scss/index.scss";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CCol,
  CHeader,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CRow,
  CSelect,
} from "@coreui/react";
import MultiSelect from "react-multi-select-component";
import ReactNumberFormat from "react-number-format";
import Loading from "../../common/components/Loading";
import { NumberField } from "../../common/components/NumberField";
import {
  BUTTON_COLORS,
  QuestButton,
} from "../../common/components/QuestButton";
import { LabelValue } from "../../common/types/LabelValue";
import { extractProperties } from "../../common/utils/object";
import { GLASS_GUIDE_MODEL_TYPE_CODES } from "../constants/glassGuidemodelTypeCodes";
import useGlassGuide from "../hooks/useGlassGuide";
import {
  GlassGuideCalculationResult,
  glassGuideCalculationResultDefaultValue,
  GlassGuideDetailsListRequest,
  glassGuideDetailsListRequestDefaultValue,
  GlassGuideDetailsResponse,
  glassGuideDetailsResponseDefaultValue,
  GlassGuideNvicListRequest,
  GlassGuideOptionResponse,
  GlassGuideValues,
} from "../types/GlassGuide";

type GlassGuideProps = {
  isShown: boolean;
  useCache: boolean;
  initialValues: {
    modelTypeCode: string;
    yearCreate: number;
    manufacturerCode: string;
    familyCode: string;
    variantName: string;
    seriesCode: string;
    nvic: string;
    actualKm: number;
    options: string[];
  };
  initResultValues: GlassGuideCalculationResult;
  toggler: () => void;
  onSelected: (values: GlassGuideValues) => void;
};

const GlassGuide: React.FunctionComponent<GlassGuideProps> = ({
  isShown,
  useCache,
  initialValues,
  initResultValues,
  toggler,
  onSelected,
}: GlassGuideProps) => {
  const [nvicListRequest, setNvicListRequest] = useState<
    GlassGuideNvicListRequest
  >({
    modelTypeCode: initialValues.modelTypeCode,
    yearCreate: initialValues.yearCreate,
    manufacturerCode: initialValues.manufacturerCode,
    familyCode: initialValues.familyCode,
    variantName: initialValues.variantName,
    seriesCode: initialValues.seriesCode,
    keyword: "",
  });
  const [tempActualKm, setTempActualKm] = useState<{
    actualKm: number;
    shouldUpdateActualKm: boolean;
  }>({
    actualKm: initialValues.actualKm,
    shouldUpdateActualKm: false,
  });
  const [selectedOptionsDropdown, setSelectedOptionsDropdown] = useState<
    LabelValue[]
  >([]);
  const [resultValues, setResultValues] = useState(initResultValues);
  const [getDetailsSpecRequest, setGetDetailsSpecRequest] = useState<
    GlassGuideDetailsListRequest
  >({
    ...glassGuideDetailsListRequestDefaultValue,
    useCache,
    actualKm: initialValues.actualKm,
    options: initialValues.options,
    modelTypeCode: initialValues.modelTypeCode,
    nvic: initialValues.nvic,
    shouldFetchDetails: false,
  });

  const {
    isLoading,
    yearList,
    makeList,
    modelList,
    variantList,
    seriesList,
    nvicList,
    optionList,
    detailsSpec,
  } = useGlassGuide({
    resultValues,
    nvicListRequest,
    getDetailsSpecRequest,
  });

  const tempDetailSpec = useRef<GlassGuideDetailsResponse>(
    glassGuideDetailsResponseDefaultValue
  );

  useEffect(() => {
    setNvicListRequest((previousData) => ({
      ...previousData,
      yearCreate: initialValues.yearCreate,
    }));
  }, [initialValues]);

  useEffect(() => {
    const oldDetailsSpec = tempDetailSpec.current;
    const newDetailsSpec = detailsSpec;
    if (oldDetailsSpec.nvicCur !== newDetailsSpec.nvicCur) {
      tempDetailSpec.current = detailsSpec;
      setTempActualKm(() => ({
        shouldUpdateActualKm: false,
        actualKm: newDetailsSpec ? newDetailsSpec.averageKm ?? 0 : 0,
      }));
    }
  }, [detailsSpec]);

  const updateGetDetailsSpecRequest = useCallback(
    (newState: Partial<GlassGuideDetailsListRequest>) => {
      setGetDetailsSpecRequest((previousState) => ({
        ...previousState,
        ...newState,
      }));
    },
    []
  );

  const initSelectCar = useCallback(() => {
    if (initialValues.nvic) {
      const selectedNvic = nvicList.find(
        (nvicOption) => nvicOption.nvicCur === initialValues.nvic
      );
      if (selectedNvic) {
        const selectedOptions = optionList.filter((carOption) => {
          return initialValues.options.some((selectedOption) => {
            return selectedOption === carOption.optionCode;
          });
        });

        setSelectedOptionsDropdown(
          selectedOptions.map((selectedOption) => ({
            label: selectedOption.optionName,
            value: selectedOption.optionCode,
          }))
        );

        setTempActualKm({
          shouldUpdateActualKm: false,
          actualKm: initialValues.actualKm,
        });
      }
    }
  }, [initialValues, nvicList, optionList]);

  useEffect(() => {
    initSelectCar();
  }, [initSelectCar]);

  useEffect(() => {
    if (tempActualKm.shouldUpdateActualKm) {
      if (tempActualKm.actualKm !== getDetailsSpecRequest.actualKm) {
        setResultValues(glassGuideCalculationResultDefaultValue);
      }

      setGetDetailsSpecRequest((previousState) => ({
        ...previousState,
        actualKm: tempActualKm.actualKm,
        shouldFetchDetails: true,
      }));

      setTempActualKm((previousState) => ({
        ...previousState,
        shouldUpdateActualKm: false,
      }));
    }
  }, [tempActualKm, getDetailsSpecRequest]);

  const handleCarOptionsSelection = (selected: LabelValue[]) => {
    setSelectedOptionsDropdown(selected);
    const selectedCarOptions = optionList.filter((option) => {
      return selected.some((dropdown) => {
        return dropdown.value === option.optionCode;
      });
    });

    updateGetDetailsSpecRequest({
      shouldFetchDetails: true,
      options: selectedCarOptions.map(
        (selectedOption) => selectedOption.optionCode
      ),
    });
  };

  const clearSelection = useCallback(
    (
      name?:
        | keyof GlassGuideNvicListRequest
        | (keyof GlassGuideNvicListRequest)[]
        | undefined
    ) => {
      if (typeof name === "string") {
        setNvicListRequest((previousData) => ({
          ...previousData,
          [name]: "",
        }));
      } else if (Array.isArray(name)) {
        setNvicListRequest((previousData) => {
          let newState: Partial<GlassGuideNvicListRequest> = previousData;
          name.forEach((field) => {
            newState = {
              ...newState,
              [field]: "",
            };
          });
          return {
            ...previousData,
            ...newState,
          };
        });
      } else {
        setNvicListRequest((previousData) => {
          let newState = previousData;

          Object.keys(newState).forEach((field) => {
            if (field !== "modelTypeCode") {
              newState = {
                ...newState,
                [field]: "",
              };
            }
          });

          return {
            ...previousData,
            ...newState,
          };
        });
      }
      return;
    },
    [setNvicListRequest]
  );

  const getManufacturerName = useCallback(
    (manufacturerCode: string) => {
      if (manufacturerCode) {
        const manufacturer = makeList.find(
          (make) => make.code === manufacturerCode
        );
        if (manufacturer) return manufacturer.name;
      }

      return "";
    },
    [makeList]
  );

  const getModelFullName = useCallback(
    (nvic: string) => {
      if (nvic) {
        const model = nvicList.find((model) => model.nvicCur === nvic);
        if (model) return model.modelName;
      }

      return "";
    },
    [nvicList]
  );

  const handleSelectCarModel = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value: nvic } = event.target;
    updateGetDetailsSpecRequest({
      options: [],
      actualKm: 0,
      nvic,
      useCache: false,
      modelTypeCode: nvicListRequest.modelTypeCode,
      shouldFetchDetails: true,
    });
    setSelectedOptionsDropdown([]);
  };

  const onSelectedCallback = useCallback(
    (values: GlassGuideValues) => {
      onSelected(values);
      toggler();
    },
    [onSelected, toggler]
  );

  const onClose = useCallback(() => {
    toggler();
    clearSelection();
  }, [toggler, clearSelection]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNvicListRequest((previousData) => ({
      ...previousData,
      [name]: value,
    }));
    setResultValues(glassGuideCalculationResultDefaultValue);
    let newRequest: Partial<GlassGuideDetailsListRequest> = {
      shouldFetchDetails: false,
      nvic: "",
    };

    if (name === "modelTypeCode") {
      newRequest = {
        ...newRequest,
        modelTypeCode: value,
      };
    }
    updateGetDetailsSpecRequest(newRequest);
    setSelectedOptionsDropdown([]);
  };

  const convertCarOptions = (options: GlassGuideOptionResponse[]) =>
    options.map((option) => ({
      label: option.optionName,
      value: option.optionCode,
    }));

  return (
    <CModal
      size="lg"
      className="modal-glass-guide"
      show={isShown}
      onClose={onClose}
      closeOnBackdrop={false}
      data-testid="glass-guide-modal"
    >
      <CHeader>
        <h3>Glass lookup</h3>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          data-testid="close-glass-guide-modal"
        >
          x
        </button>
      </CHeader>
      <CModalBody>
        <CCol xs={12}>
          <CRow>
            <CCol sm={6} className="form-group">
              <CLabel>Vehicle type</CLabel>
              <CSelect
                name="modelTypeCode"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  clearSelection([
                    "manufacturerCode",
                    "familyCode",
                    "variantName",
                    "seriesCode",
                  ]);
                  handleChange(event);
                }}
                value={nvicListRequest.modelTypeCode}
                disabled={isLoading}
                data-testid="modelTypeCode"
              >
                <option value={GLASS_GUIDE_MODEL_TYPE_CODES.ALL}>All</option>
              </CSelect>
            </CCol>
            <CCol sm={6} className="form-group">
              <CLabel>Model year</CLabel>
              <CSelect
                name="yearCreate"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  clearSelection([
                    "manufacturerCode",
                    "familyCode",
                    "variantName",
                    "seriesCode",
                  ]);
                  handleChange(event);
                }}
                value={nvicListRequest.yearCreate}
                disabled={isLoading}
                data-testid="yearCreate"
              >
                <option key="" value=""></option>
                {yearList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </CSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm={6} className="form-group">
              <CLabel>Make</CLabel>
              <CSelect
                name="manufacturerCode"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  clearSelection(["familyCode", "variantName", "seriesCode"]);
                  handleChange(event);
                }}
                value={nvicListRequest.manufacturerCode}
                disabled={isLoading || !nvicListRequest.yearCreate}
                data-testid="manufacturerCode"
              >
                <option key="" value=""></option>
                {makeList.map((make) => (
                  <option key={make.code} value={make.code}>
                    {make.name}
                  </option>
                ))}
              </CSelect>
            </CCol>
            <CCol sm={6} className="form-group">
              <CLabel>Model</CLabel>
              <CSelect
                name="familyCode"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  clearSelection(["variantName", "seriesCode"]);
                  handleChange(event);
                }}
                value={nvicListRequest.familyCode}
                disabled={isLoading || !nvicListRequest.manufacturerCode}
                data-testid="familyCode"
              >
                <option key="" value=""></option>
                {modelList.map((model) => (
                  <option key={model.code} value={model.code}>
                    {model.name}
                  </option>
                ))}
              </CSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol sm={6} className="form-group">
              <CLabel>Variant</CLabel>
              <CSelect
                name="variantName"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  clearSelection(["seriesCode"]);
                  handleChange(event);
                }}
                value={nvicListRequest.variantName}
                disabled={isLoading || !nvicListRequest.familyCode}
                data-testid="variantName"
              >
                <option key="" value=""></option>
                {variantList.map((variant) => (
                  <option key={variant} value={variant}>
                    {variant}
                  </option>
                ))}
              </CSelect>
            </CCol>
            <CCol sm={6} xs={12} className="form-group">
              <CLabel>Series</CLabel>
              <CSelect
                name="seriesCode"
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  handleChange(event);
                }}
                value={
                  nvicListRequest.seriesCode ? nvicListRequest.seriesCode : ""
                }
                disabled={isLoading || !nvicListRequest.variantName}
                data-testid="seriesCode"
              >
                <option key="" value=""></option>
                {seriesList.map((series) => (
                  <option key={series.code} value={series.code}>
                    {series.name}
                  </option>
                ))}
              </CSelect>
            </CCol>
          </CRow>
          <CRow>
            <CCol xs={12} className="form-group">
              <CLabel>Car model</CLabel>
              <select
                className="form-control"
                name="nvic"
                onChange={handleSelectCarModel}
                value={getDetailsSpecRequest.nvic}
                disabled={
                  isLoading ||
                  (!nvicListRequest.seriesCode && !nvicListRequest.variantName)
                }
                data-testid="nvic"
              >
                <option key="" value=""></option>
                {nvicList.map((nvic) => (
                  <option key={nvic.nvicCur} value={nvic.nvicCur}>
                    {nvic.modelName}
                  </option>
                ))}
              </select>
            </CCol>
          </CRow>
          <CRow
            className={`${detailsSpec && detailsSpec.nvicCur ? "" : "d-none"}`}
          >
            <CCol sm={6} className="form-group">
              <CLabel>Options</CLabel>
              <MultiSelect
                disabled={isLoading}
                className="quest-multiselect"
                options={convertCarOptions(optionList)}
                value={selectedOptionsDropdown}
                onChange={(selected: LabelValue[]) =>
                  handleCarOptionsSelection(selected)
                }
                labelledBy={"Select"}
                data-testid="multiselect-glass-guide-options"
              />
            </CCol>
            <CCol sm={6} className="form-group">
              <CLabel>Actual KM</CLabel>
              <NumberField
                disabled={isLoading}
                value={tempActualKm.actualKm}
                onBlur={() => {
                  setTempActualKm((previousState) => ({
                    ...previousState,
                    shouldUpdateActualKm: true,
                  }));
                }}
                onValueChange={(values) => {
                  setTempActualKm((previousState) => ({
                    ...previousState,
                    actualKm: values.floatValue ?? 0,
                  }));
                }}
                data-testid="actualKm-glassguide"
              />
            </CCol>
          </CRow>
          {detailsSpec.nvicCur !== "" && (
            <CRow>
              <CCol xs={12} className="table-container">
                <table
                  className="table table-stripped pricing"
                  data-testid="glass-guide-table"
                >
                  <thead>
                    <tr>
                      <th>Pricing</th>
                      <th>RRP</th>
                      <th>Trade</th>
                      <th>Retail</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Glass&apos; value</td>
                      <td>
                        <ReactNumberFormat
                          value={detailsSpec.rrp}
                          prefix="$"
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator=","
                          data-testid="rrp"
                        />
                      </td>
                      <td>
                        <ReactNumberFormat
                          value={detailsSpec.trade}
                          prefix="$"
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator=","
                          data-testid="trade"
                        />
                      </td>
                      <td>
                        <ReactNumberFormat
                          value={detailsSpec.retail}
                          prefix="$"
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator=","
                          data-testid="retail"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>KM adjustment</td>
                      <td>-</td>
                      <td>
                        <ReactNumberFormat
                          allowNegative
                          value={detailsSpec.kmAdjustmentTradeValue}
                          prefix="$"
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator=","
                          data-testid="kmAdjustmentTradeValue"
                        />
                      </td>
                      <td>
                        <ReactNumberFormat
                          allowNegative
                          value={detailsSpec.kmAdjustmentRetailValue}
                          prefix="$"
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator=","
                          data-testid="kmAdjustmentRetailValue"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Value of options</td>
                      <td>
                        <ReactNumberFormat
                          value={detailsSpec.optionsRrpValue}
                          prefix="$"
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator=","
                          data-testid="optionsRrpValue"
                        />
                      </td>
                      <td>
                        <ReactNumberFormat
                          value={detailsSpec.optionsTradeValue}
                          prefix="$"
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator=","
                          data-testid="optionsTradeValue"
                        />
                      </td>
                      <td>
                        <ReactNumberFormat
                          value={detailsSpec.optionsRetailValue}
                          prefix="$"
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator=","
                          data-testid="optionsRetailValue"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Adjusted values</td>
                      <td>
                        <ReactNumberFormat
                          value={detailsSpec.adjustedRrpValue}
                          prefix="$"
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator=","
                          data-testid="adjustedRrpValue"
                        />
                      </td>
                      <td>
                        <ReactNumberFormat
                          value={detailsSpec.adjustedTradeValue}
                          prefix="$"
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator=","
                          data-testid="adjustedTradeValue"
                        />
                      </td>
                      <td>
                        <ReactNumberFormat
                          value={detailsSpec.adjustedRetailValue}
                          prefix="$"
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale
                          thousandSeparator=","
                          data-testid="adjustedRetailValue"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CCol>
            </CRow>
          )}
        </CCol>
      </CModalBody>
      <CModalFooter>
        <QuestButton
          color={BUTTON_COLORS.SECONDARY}
          onClick={() => onClose()}
          className="mr-3"
          disabled={isLoading}
          data-testid="cancel-glass-guide-modal"
          type="button"
        >
          Cancel
        </QuestButton>
        <QuestButton
          color={BUTTON_COLORS.COMMIT}
          disabled={isLoading || detailsSpec.nvicCur === ""}
          onClick={() =>
            onSelectedCallback({
              ...nvicListRequest,
              nvic: detailsSpec.nvicCur ?? "",
              manufacturerName: getManufacturerName(
                nvicListRequest.manufacturerCode
              ),
              actualKm: getDetailsSpecRequest.actualKm
                ? getDetailsSpecRequest.actualKm
                : detailsSpec.averageKm ?? 0,
              options: getDetailsSpecRequest.options,
              modelFullName: getModelFullName(getDetailsSpecRequest.nvic),
              manufactureYear: nvicListRequest.yearCreate,
              ...(extractProperties(
                detailsSpec,
                Object.keys(glassGuideCalculationResultDefaultValue)
              ) as GlassGuideCalculationResult),
            })
          }
          data-testid="select-glass-guide-modal"
          type="button"
        >
          Select
        </QuestButton>
      </CModalFooter>
      {isLoading && <Loading text="Please wait..." />}
    </CModal>
  );
};

export default GlassGuide;
