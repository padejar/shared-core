import React, { useState } from "react";
import ReactDiffViewer from "react-diff-viewer";
import { dateFormat } from "../../../common/utils/date";
import { AuditLogResponse } from "../../types";

type AuditItemProps = {
  auditLog: AuditLogResponse;
};
const AuditItem: React.FunctionComponent<AuditItemProps> = ({
  auditLog,
}: AuditItemProps) => {
  const [isLogExpanded, setIsLogExpanded] = useState(false);

  const handleToggleExpanded = () => {
    setIsLogExpanded(!isLogExpanded);
  };

  const renderActor = (actor?: typeof auditLog.actor) => {
    return (
      <span>
        {` by `}
        <span data-testid="auditActorName">
          {actor ? `${actor.firstName} ${actor.lastName}` : `N/A`}
        </span>
      </span>
    );
  };

  return (
    <div className="audit-item mb-3" data-testid="auditItem">
      <div className="audit-datetime f-bold f-quest-navy">
        <span>
          <span data-testid="auditCreatedTime">
            {dateFormat(new Date(auditLog.createdAt), "MMM d h:mm a")}
          </span>{" "}
          -{renderActor(auditLog.actor)}{" "}
        </span>
        <br />
        <button
          className="btn btn-link"
          type="button"
          onClick={() => handleToggleExpanded()}
          data-testid="auditToggleExpandContent"
        >
          {isLogExpanded ? "Hide values" : "Show values"}
        </button>
        {isLogExpanded && (
          <div className="audit-content" data-testid="auditContent">
            <ReactDiffViewer
              oldValue={JSON.stringify(auditLog.oldValues, null, "\t")}
              newValue={JSON.stringify(auditLog.newValues, null, "\t")}
              splitView={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditItem;
