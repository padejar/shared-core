import React, { useCallback, useEffect, useState } from "react";
import {
  CModal,
  CHeader,
  CModalBody,
  CModalFooter,
  CSelect,
  CTextarea,
} from "@coreui/react";
import { AxiosError } from "axios";
import {
  BUTTON_COLORS,
  QuestButton,
} from "../../common/components/QuestButton";
import { processErrorMessage } from "../../error-handler/utils";
import { actionCreator, dispatch } from "../../notification";
import {
  STATUS_GROUP_OTHER,
  APPLICATION_STATUSES,
} from "../constants/applicationStatuses";
import ApplicationService from "../services/ApplicationService";
import { ApplicationResponse } from "../types/ApplicationResponse";
import { StatusReason } from "../types/WithdrawRequest";

const { setNotification } = actionCreator;
const { useNotificationDispatch } = dispatch;

type WithdrawModalProps = {
  application: ApplicationResponse | null;
  onClose: () => void;
  onWithdrawSuccess: () => void;
};

const WithdrawModal: React.FunctionComponent<WithdrawModalProps> = ({
  application,
  onClose,
  onWithdrawSuccess,
}: WithdrawModalProps) => {
  const [reasonOptions, setReasonOptions] = useState<{
    loading: boolean;
    byId: Record<string, StatusReason>;
    data: StatusReason[];
  }>({
    loading: true,
    byId: {},
    data: [],
  });
  const [reason, setReason] = useState<Partial<StatusReason>>({});
  const [otherReason, setOtherReason] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const notifDispatch = useNotificationDispatch();

  const onChangeOtherReasonHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setOtherReason(event.target.value);
  };

  const onChangeReasonHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = event.target.value;
    setReason(reasonOptions.byId[id] || {});
  };

  const onWithdrawHandler = async () => {
    let errorMsg = "";
    if (!reason.statusGroup) {
      errorMsg = "Please select a reason.";
    } else if (reason.statusGroup === STATUS_GROUP_OTHER && !otherReason) {
      errorMsg = "Please specify your own reason.";
    }

    if (application?.assessmentId && errorMsg) {
      notifDispatch(
        setNotification({
          body: errorMsg,
          className: "qst-notif-danger",
        })
      );
      return;
    }

    setWithdrawing(true);
    try {
      await ApplicationService.withdrawApplication(application?.id as string, {
        reasonId: reason.id || null,
        statusReason: otherReason,
      });
      onWithdrawSuccess();
    } catch (error) {
      const message = processErrorMessage(error as AxiosError);
      notifDispatch(
        setNotification({
          body: message,
          className: "qst-notif-danger",
        })
      );
    } finally {
      setWithdrawing(false);
    }
  };

  const getWithdrawReasons = useCallback(async () => {
    setReasonOptions({
      loading: true,
      byId: {},
      data: [],
    });

    const byId: Record<string, StatusReason> = {};
    let options: StatusReason[] = [];
    try {
      const { data } = await ApplicationService.getStatusReasons([
        APPLICATION_STATUSES.WITHDRAWN_BY_INTRODUCER,
        STATUS_GROUP_OTHER,
      ]);
      data.forEach((item) => {
        byId[item.id] = item;
      });
      options = data;
    } catch (error) {
      const message = processErrorMessage(error as AxiosError);
      notifDispatch(
        setNotification({
          body: message,
          className: "qst-notif-danger",
        })
      );
    } finally {
      setReasonOptions({
        byId,
        data: options,
        loading: false,
      });
    }
  }, [notifDispatch]);

  useEffect(() => {
    setOtherReason("");
    setReason({});

    if (application?.assessmentId) {
      getWithdrawReasons();
    }
  }, [application, getWithdrawReasons]);

  return (
    <CModal
      className="modal-glass-guide"
      show={application !== null}
      onClose={onClose}
      closeOnBackdrop={false}
      centered={true}
    >
      <CHeader>
        <h3 data-testid="withdraw-modal-header">
          Withdraw application {application?.applicationNumber}
        </h3>
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          data-testid="withdraw-close-btn"
        >
          x
        </button>
      </CHeader>
      <CModalBody className="px-5">
        {application?.assessmentId ? (
          <>
            <CSelect
              onChange={onChangeReasonHandler}
              value={reason.id}
              data-testid="withdraw-reason-selector"
            >
              <option value="">Please select reason</option>
              {Object.values(reasonOptions.data).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.reason}
                </option>
              ))}
            </CSelect>
            {reason.statusGroup === STATUS_GROUP_OTHER && (
              <CTextarea
                className="mt-3"
                value={otherReason}
                style={{ maxHeight: 200 }}
                onChange={onChangeOtherReasonHandler}
                maxLength={500}
                placeholder="Enter your reason"
                data-testid="withdraw-other-reason"
              />
            )}
          </>
        ) : (
          <div className="text-center">
            Are you sure you want to proceed with this action?
          </div>
        )}
      </CModalBody>
      <CModalFooter>
        <QuestButton
          color={BUTTON_COLORS.SECONDARY}
          onClick={onClose}
          data-testid="withdraw-cancel-btn"
        >
          Cancel
        </QuestButton>
        <QuestButton
          color={BUTTON_COLORS.COMMIT}
          onClick={onWithdrawHandler}
          data-testid="withdraw-submit-btn"
          disabled={withdrawing}
        >
          {withdrawing ? "Loading..." : "Withdraw"}
        </QuestButton>
      </CModalFooter>
    </CModal>
  );
};

export default WithdrawModal;
