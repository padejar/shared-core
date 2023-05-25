import "./../assets/lookup.scss";
import React, { useCallback, useRef, useState } from "react";
import { AxiosError } from "axios";
import { NumberFormatValues } from "react-number-format";
import IconSearch from "../../common/assets/images/icon-search.svg";
import { NumberField } from "../../common/components/NumberField";
import { handleEnterKey } from "../../common/utils/keyboardEvents";
import { replaceAll } from "../../common/utils/string";
import { processErrorMessage } from "../../error-handler/utils";
import { dispatch, actionCreator } from "../../notification";
import ABRService from "../services/ABRService";
import { ACNResponse } from "../types/ACN";

const { useNotificationDispatch } = dispatch;
const { setNotification } = actionCreator;

type ACNLookupProps = {
  value: string;
  onAcnFound: (data: ACNResponse | null) => void;
  onValueChange: (values: NumberFormatValues) => void;
  readOnly?: boolean;
};
const ACNLookup: React.FunctionComponent<ACNLookupProps> = ({
  value,
  onAcnFound,
  onValueChange,
  readOnly,
}: ACNLookupProps) => {
  const acnValue = useRef<string>(value);
  const notifDispatch = useNotificationDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const onAcnFoundCallback = useCallback(
    (data: ACNResponse) => {
      onAcnFound(data);
    },
    [onAcnFound]
  );

  const acnSearch = async () => {
    if (readOnly) return;
    try {
      setIsLoading(true);
      const { data } = await ABRService.acnSearch(value);
      onAcnFoundCallback(data);
    } catch (error) {
      const message = processErrorMessage(error as AxiosError);
      notifDispatch(
        setNotification({
          body: message,
          className: "qst-notif-danger",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newValue = replaceAll(event.target.value, " ", "");
    if (event.target.value !== "" && newValue !== acnValue.current) {
      acnSearch();
      acnValue.current = newValue;
    }
  };

  return (
    <div className="has-icon lookup">
      <NumberField
        readOnly={readOnly}
        name="trusteeAcn"
        type="tel"
        onValueChange={onValueChange}
        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
          handleEnterKey(event, acnSearch);
        }}
        onBlur={handleOnInputBlur}
        value={value}
        format="### ### ###"
        disabled={isLoading}
        data-testid="trusteeAcn"
      />
      <img src={IconSearch} alt="abn-lookup icon" />
    </div>
  );
};

export default ACNLookup;
