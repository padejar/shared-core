import "./../assets/lookup.scss";
import React, { useCallback, useRef, useState } from "react";
import { AxiosError } from "axios";
import { NumberFormatValues } from "react-number-format";
import IconSearch from "../../common/assets/images/icon-search.svg";
import { NumberField } from "../../common/components/NumberField";
import { handleEnterKey } from "../../common/utils/keyboardEvents";
import { replaceAll } from "../../common/utils/string";
import { processErrorMessage } from "../../error-handler/utils";
import { actionCreator, dispatch } from "../../notification";
import ABRService from "../services/ABRService";
import { ABNResponse } from "../types/ABN";

const { useNotificationDispatch } = dispatch;
const { setNotification } = actionCreator;

type ABNLookupProps = {
  value: string;
  onAbnFound: (data: ABNResponse | null) => void;
  onValueChange: (values: NumberFormatValues) => void;
  readOnly?: boolean;
};
const ABNLookup: React.FunctionComponent<ABNLookupProps> = ({
  value,
  onAbnFound,
  onValueChange,
  readOnly,
}: ABNLookupProps) => {
  const abnValue = useRef<string>(value);
  const notifDispatch = useNotificationDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const onAbnFoundCallback = useCallback(
    (data: ABNResponse) => {
      onAbnFound(data);
    },
    [onAbnFound]
  );

  const abnSearch = async () => {
    if (readOnly) return;
    try {
      setIsLoading(true);
      const { data } = await ABRService.abnSearch(value);
      onAbnFoundCallback(data);
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
    if (event.target.value !== "" && newValue !== abnValue.current) {
      abnSearch();
      abnValue.current = newValue;
    }
  };

  return (
    <div className="has-icon lookup">
      <NumberField
        readOnly={readOnly}
        name="abn"
        type="tel"
        onValueChange={onValueChange}
        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
          handleEnterKey(event, abnSearch);
        }}
        onBlur={handleOnInputBlur}
        value={value}
        format="## ### ### ###"
        disabled={isLoading}
        data-testid="abn"
      />
      <img src={IconSearch} alt="abn-lookup icon" />
    </div>
  );
};

export default ABNLookup;
