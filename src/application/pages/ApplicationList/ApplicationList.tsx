import "./ApplicationList.scss";
import React, { useCallback, useEffect, useState } from "react";
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CLink,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
} from "@coreui/react";
import DataTable, { IDataTableColumn } from "react-data-table-component";
import NumberFormat from "react-number-format";
import { useSelector } from "react-redux";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { ReactSVG } from "react-svg";
import ArrowRedRight from "../../../common/assets/images/arrow-right-red.svg";
import ArrowWhiteRight from "../../../common/assets/images/arrow-right-white.svg";
import Badge, { BADGE_COLORS } from "../../../common/components/Badge";
import Loading from "../../../common/components/Loading";
import { QuestButton } from "../../../common/components/QuestButton";
import { DATATABLE_MAX_ROWS } from "../../../common/constants/datatable";
import { getOffset, parseSortingObject } from "../../../common/utils/dataTable";
import { dateFormat } from "../../../common/utils/date";
import { parseNumber } from "../../../common/utils/number";
import { getErrorMessageSelector } from "../../../error-handler";
import { cloneApplication } from "../../actions/creators/applicationForm";
import { getApplicationList } from "../../actions/creators/applicationList";
import WithdrawModal from "../../components/WithdrawModal";
import {
  APPLICATION_STATUS_COLORS,
  APPLICATION_PUBLIC_STATUS_LABELS,
  APPLICATION_STATUS_GROUP,
  APPLICATION_PUBLIC_STATUSES,
} from "../../constants/applicationStatuses";
import {
  useApplicationFormDispatch,
  useApplicationListDispatch,
} from "../../dispatchers";
import {
  getCloneApplicationLoadingSelector,
  getClonedApplicationIdSelector,
} from "../../selectors/applicationForm";
import {
  getApplicationListSelector,
  getLoadingSelector,
  getApplicationCountSelector,
  getStatusSelector,
  getSearchSelector,
  getResetPageSelector,
  getOrderSelector,
  getLimitSelector,
} from "../../selectors/applicationList";
import {
  ApplicationListRequest,
  applicationListRequestDefaultValue,
} from "../../types/ApplicationListRequest";
import { ApplicationResponse } from "../../types/ApplicationResponse";

const ApplicationList: React.FunctionComponent<RouteComponentProps> = ({
  location,
}: RouteComponentProps) => {
  const [
    selectedApplication,
    setSelectedApplication,
  ] = useState<ApplicationResponse | null>(null);
  const applications = useSelector(getApplicationListSelector);
  const isLoading = useSelector(getLoadingSelector);
  const applicationCount = useSelector(getApplicationCountSelector);
  const status = useSelector(getStatusSelector);
  const search = useSelector(getSearchSelector);
  const resetPage = useSelector(getResetPageSelector);
  const order = useSelector(getOrderSelector);
  const limit = useSelector(getLimitSelector);
  const errors = useSelector(getErrorMessageSelector);
  const cloneApplicationLoading = useSelector(
    getCloneApplicationLoadingSelector
  );
  const clonedApplicationId = useSelector(getClonedApplicationIdSelector);

  const dispatch = useApplicationListDispatch();
  const dispatchApplication = useApplicationFormDispatch();

  const history = useHistory();

  const processListPayload = useCallback((): ApplicationListRequest => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("status") ?? undefined;
    const page = queryParams.get("page")
      ? parseNumber(queryParams.get("page"))
      : 1;
    const order = queryParams.get("order") ?? undefined;
    const search = queryParams.get("search") ?? undefined;
    let requestPayload: ApplicationListRequest = {
      ...applicationListRequestDefaultValue,
      offset: getOffset(page, DATATABLE_MAX_ROWS),
      limit: DATATABLE_MAX_ROWS,
    };

    if (order) {
      requestPayload = {
        ...requestPayload,
        order,
      };
    }

    if (status) {
      requestPayload = {
        ...requestPayload,
        status,
      };
    }

    if (search) {
      requestPayload = {
        ...requestPayload,
        search,
      };
    }

    return requestPayload;
  }, [location.search]);

  const closeWithdrawModalHandler = () => {
    setSelectedApplication(null);
  };
  const onWithdrawSuccessHandler = () => {
    dispatch(getApplicationList(processListPayload()));
    setSelectedApplication(null);
  };

  const getApplicationListWithPayload = useCallback(
    (overrideValues: {
      order?: string | null;
      status?: string | null;
      offset?: number;
      limit?: number | null;
    }) => {
      const payload = { ...processListPayload(), ...overrideValues };
      dispatch(getApplicationList(payload));
    },
    [dispatch, processListPayload]
  );

  useEffect(() => {
    getApplicationListWithPayload({});
  }, [getApplicationListWithPayload]);

  useEffect(() => {
    if (clonedApplicationId) {
      history.push(`/application/applications/${clonedApplicationId}/quotes`);
    }
  }, [clonedApplicationId, history]);

  const handleCloneApplication = async (id: string) => {
    dispatchApplication(cloneApplication(id));
  };

  const handleWithdrawApplication = (application: ApplicationResponse) => {
    setSelectedApplication(application);
  };

  const renderApplicationIdColumn = (application: ApplicationResponse) => (
    <div
      style={{
        width: "75px",
      }}
    >
      <CLink
        to={`/application/applications/${application.id}/quotes`}
        className="btn-sm btn btn-link"
        data-testid={`application-${application.applicationNumber}`}
      >
        {application.applicationNumber}
      </CLink>
    </div>
  );

  const renderApplicantColumn = (application: ApplicationResponse) => (
    <div data-testid={`applicant-${application.applicationNumber}`}>
      {application.name}
    </div>
  );

  const getBadgeColor = (status: string): string => {
    let badgeColor = "default";
    for (const color in APPLICATION_STATUS_COLORS) {
      const statusFound = (APPLICATION_STATUS_COLORS[color] as string[]).find(
        (item) => {
          return item === status;
        }
      );
      if (statusFound) {
        badgeColor = color;
        break;
      }
    }

    return badgeColor;
  };

  const renderStatusColumn = (application: ApplicationResponse) => {
    const badgeColor = getBadgeColor(application.publicStatus);
    return (
      <Badge
        color={badgeColor as BADGE_COLORS}
        data-testid={`application-${application.id}-status`}
        text={APPLICATION_PUBLIC_STATUS_LABELS[application.publicStatus]}
      />
    );
  };
  const renderSecurityColumn = (application: ApplicationResponse) => {
    return (
      <div
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        data-testid={`application-${application.id}-security`}
      >
        {application.security?.name || ""}
      </div>
    );
  };
  const renderSubmittedTimeColumn = (application: ApplicationResponse) => {
    let submittedTime = "";
    if (application.submittedAt) {
      const submittedAt = new Date(application.submittedAt);
      submittedTime = dateFormat(submittedAt, "dd/MM/yyyy - kk:mm");
    }

    return <div>{submittedTime}</div>;
  };
  const renderActionColumn = (application: ApplicationResponse) => (
    <div>
      {application.status !== APPLICATION_PUBLIC_STATUSES.QUOTED && (
        <CButton
          className="btn-link btn-sm mr-1"
          type="button"
          onClick={() => handleCloneApplication(application.id)}
          data-testid={`application-${application.id}-clone`}
        >
          Clone
        </CButton>
      )}
      {(APPLICATION_STATUS_GROUP.LOCKED as string[]).includes(
        application.status
      ) !== true && (
        <CButton
          className="btn-link btn-sm"
          type="button"
          onClick={() => handleWithdrawApplication(application)}
          data-testid={`application-${application.id}-withdraw`}
        >
          Withdraw
        </CButton>
      )}
    </div>
  );
  const renderAmountFinancedColumn = (application: ApplicationResponse) => {
    return (
      <div data-testid={`application-${application.id}-amountFinanced`}>
        {application.quote ? (
          <NumberFormat
            thousandSeparator
            prefix={"$"}
            value={
              application.quote.amountFinanced
                ? application.quote.amountFinanced.toFixed(2)
                : 0
            }
            displayType="text"
            decimalScale={2}
            className="quest-amount-financed"
          />
        ) : (
          0
        )}
      </div>
    );
  };

  const columns: IDataTableColumn<ApplicationResponse>[] = [
    {
      selector: "applicationNumber",
      name: "Loan #",
      cell: renderApplicationIdColumn,
      sortable: true,
      width: "100px",
    },
    {
      selector: "name",
      name: "Applicant",
      cell: renderApplicantColumn,
      sortable: true,
      width: "175px",
    },
    {
      selector: "security.name",
      name: "Asset",
      cell: (item: ApplicationResponse) => renderSecurityColumn(item),
      sortable: false,
      width: "175px",
    },
    {
      selector: "submittedAt",
      name: "Submitted time",
      cell: (item: ApplicationResponse) => renderSubmittedTimeColumn(item),
      sortable: true,
    },
    {
      selector: "status",
      name: "Status",
      cell: (item: ApplicationResponse) => renderStatusColumn(item),
      sortable: true,
      width: "175px",
    },
    {
      selector: "quote.amountFinanced",
      name: "Amount financed",
      cell: (item: ApplicationResponse) => renderAmountFinancedColumn(item),
      sortable: false,
      right: true,
    },
    {
      selector: "actions",
      name: "Actions",
      cell: (item: ApplicationResponse) => renderActionColumn(item),
      sortable: false,
    },
  ];

  const btnFilterMore = Object.keys(APPLICATION_PUBLIC_STATUS_LABELS).slice(
    Math.max(Object.keys(APPLICATION_PUBLIC_STATUS_LABELS).length - 2, 0)
  );

  return (
    <>
      <CRow className={`mb-4`}>
        <CCol xs={12}>
          <CLink to="/application/quotes/quick-quote">
            <QuestButton
              className="big cta mr-3"
              type="button"
              data-testid="quick-quote-button"
            >
              Quick Quote
            </QuestButton>
          </CLink>
          <CLink to="/application/applications/new">
            <QuestButton
              className="big transparent"
              type="button"
              data-testid="new-application-button"
            >
              New Application
              <ReactSVG src={ArrowRedRight} />
            </QuestButton>
          </CLink>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs="12">
          <CCard className="quest-card">
            <CCardBody className="quest-datatable application-list">
              {!search && (
                <>
                  <h4 className="f-bold f-quest-navy">Application filters:</h4>
                  <CNav variant="pills" className="quest-nav-pills mb-2">
                    <CNavItem className="mr-3">
                      <CNavLink
                        className={`quest-nav-link ${!status ? "active" : ""}`}
                        onClick={() =>
                          getApplicationListWithPayload({
                            status: "",
                            offset: 0,
                            limit,
                          })
                        }
                        data-testid={`recent-apps`}
                      >
                        Recent Apps
                      </CNavLink>
                    </CNavItem>
                    {Object.keys(APPLICATION_PUBLIC_STATUS_LABELS)
                      .slice(1, -2)
                      .map((item, index) => {
                        return (
                          <CNavItem key={index} className="mr-3">
                            <CNavLink
                              className={`quest-nav-link ${
                                status === item ? "active" : ""
                              }`}
                              onClick={() => {
                                getApplicationListWithPayload({
                                  status: item,
                                  offset: 0,
                                });
                              }}
                              data-testid={`status-${item}`}
                            >
                              {APPLICATION_PUBLIC_STATUS_LABELS[item]}
                            </CNavLink>
                          </CNavItem>
                        );
                      })}
                    <CNavItem className="mr-3">
                      <CDropdown className="quest-dropdown">
                        <CDropdownToggle
                          className={`quest-nav-link ${
                            btnFilterMore.includes(status as string)
                              ? "active"
                              : ""
                          }`}
                          data-testid="more-button"
                        >
                          More{" "}
                          <ReactSVG className="chevron" src={ArrowWhiteRight} />
                          <CDropdownMenu
                            className="quest-dropdown-menu"
                            placement="bottom-end"
                          >
                            {btnFilterMore.map((item, index) => {
                              return (
                                <CDropdownItem
                                  onClick={() => {
                                    getApplicationListWithPayload({
                                      offset: 0,
                                      status: item,
                                    });
                                  }}
                                  key={index}
                                  className={`quest-dropdown-item ${
                                    status === item ? "active" : ""
                                  }`}
                                  data-testid={`status-${item}`}
                                >
                                  {APPLICATION_PUBLIC_STATUS_LABELS[item]}
                                </CDropdownItem>
                              );
                            })}
                          </CDropdownMenu>
                        </CDropdownToggle>
                      </CDropdown>
                    </CNavItem>
                  </CNav>
                </>
              )}
              {errors && typeof errors === "string" && (
                <CAlert color="danger">{errors}</CAlert>
              )}
              <DataTable
                className="application-table"
                noHeader
                responsive
                columns={columns}
                data={applications}
                sortServer
                onSort={(column, direction) => {
                  const order = parseSortingObject({
                    column: column.selector as string,
                    direction,
                  });
                  getApplicationListWithPayload({
                    offset: 0,
                    order,
                    limit,
                  });
                }}
                pagination
                paginationServer
                paginationDefaultPage={1}
                paginationResetDefaultPage={resetPage as boolean}
                paginationTotalRows={applicationCount}
                paginationComponentOptions={{ noRowsPerPage: true }}
                progressPending={isLoading}
                onChangePage={(page) => {
                  getApplicationListWithPayload({
                    offset: getOffset(page, DATATABLE_MAX_ROWS),
                    limit,
                    order,
                    status,
                  });
                }}
              />
            </CCardBody>
            {cloneApplicationLoading && (
              <Loading text={"Cloning application. Please wait..."} />
            )}
          </CCard>
        </CCol>
      </CRow>
      <WithdrawModal
        application={selectedApplication}
        onClose={closeWithdrawModalHandler}
        onWithdrawSuccess={onWithdrawSuccessHandler}
      />
    </>
  );
};

export default ApplicationList;
