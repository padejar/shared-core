import React, { useCallback, useMemo, useState } from "react";
import { CButton, CButtonGroup } from "@coreui/react";
import { ReactSVG } from "react-svg";
import ArrowLeft from "../../../common/assets/images/arrow-left-navy.svg";
import ArrowRight from "../../../common/assets/images/arrow-right-navy.svg";
import Loading from "../../../common/components/Loading";
import { AuditLogResponse } from "../../types";
import AuditItem from "../AuditItem";

type AuditListProps = {
  auditLogs: AuditLogResponse[];
  auditLogsCount: number;
  dataPerPage: number;
  isLoading: boolean;
  onPageChange: (pageNumber: number) => void;
};
const AuditList: React.FunctionComponent<AuditListProps> = ({
  auditLogs,
  auditLogsCount,
  dataPerPage,
  isLoading,
  onPageChange,
}: AuditListProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const getTotalPages = useMemo(() => {
    return auditLogsCount < dataPerPage
      ? 1
      : Math.ceil(auditLogsCount / dataPerPage);
  }, [dataPerPage, auditLogsCount]);

  const isNextDisabled = useMemo(() => {
    return currentPage === getTotalPages;
  }, [currentPage, getTotalPages]);

  const onPageChangeCallback = useCallback(
    (page: number) => {
      onPageChange(page);
    },
    [onPageChange]
  );

  const handlePreviousButton = () => {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
    onPageChangeCallback(newPage);
  };

  const handleNextButton = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
    onPageChangeCallback(newPage);
  };

  return (
    <div className="audit-log-list">
      {auditLogs.map((auditLog) => (
        <AuditItem key={auditLog.id} auditLog={auditLog} />
      ))}
      {auditLogs.length === 0 && (
        <div className="text-center f-quest-navy" data-testid="auditEmptyList">
          No logs exists
        </div>
      )}
      {auditLogs.length > 0 && (
        <div className="nav pagination" data-testid="auditPagination">
          <div className="page-info">
            <span data-testid="auditPaginationInfo">
              Page {currentPage} of total {getTotalPages} pages
            </span>
          </div>
          <CButtonGroup>
            <CButton
              color="default"
              onClick={() => handlePreviousButton()}
              disabled={currentPage === 1}
              data-testid="auditPaginationPreviousButton"
            >
              <ReactSVG src={ArrowLeft} />
            </CButton>
            <CButton
              onClick={() => handleNextButton()}
              color="default"
              disabled={isNextDisabled}
              data-testid="auditPaginationNextButton"
            >
              <ReactSVG src={ArrowRight} />
            </CButton>
          </CButtonGroup>
        </div>
      )}
      {isLoading && (
        <Loading text="Getting audit log list..." testId="auditLoading" />
      )}
    </div>
  );
};

export default AuditList;
