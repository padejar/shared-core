import "./KitchenSink.scss";
import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormGroup,
  CImg,
  CInput,
  CInputCheckbox,
  CLabel,
  CRow,
  CSelect,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";
import ArrowLeftNavy from "../../common/assets/images/arrow-left-navy.svg";
import ArrowLeftRed from "../../common/assets/images/arrow-left-red.svg";
import ArrowRightNavy from "../../common/assets/images/arrow-right-navy.svg";
import ArrowRightRed from "../../common/assets/images/arrow-right-red.svg";
import IconLoginPassword from "../../common/assets/images/icon-login-password.svg";
import iconMenuClose from "../../common/assets/images/icon-menu-close.svg";
import iconMenuOpen from "../../common/assets/images/icon-menu-open.svg";
import userIcon from "../../common/assets/images/icon-user-outline.svg";
import QuestLogo from "../../common/assets/images/quest-logo.svg";
import QuestConnectBlue from "../../common/assets/images/QuestConnect-Logo-blue.svg";
import QuestConnectWhite from "../../common/assets/images/QuestConnect-Logo-white.svg";
import LabelRadioGroups from "../../common/components/LabelRadioGroups";
import {
  BUTTON_COLORS,
  QuestButton,
} from "../../common/components/QuestButton";

const options = [
  {
    label: "Label 1",
    value: "label1",
  },
  {
    label: "Label 2",
    value: "label2",
  },
];

const KitchenSink: React.FunctionComponent = () => {
  const [exampleRadio, setExampleRadio] = useState<string>("label1");
  const [exampleCheckbox, setExampleCheckbox] = useState<boolean>(false);

  return (
    <CContainer>
      <CRow className="quest-page-header-section pt-5">
        <CCol xs={12} className="align-items-center d-flex">
          <h2 className="quest-header-text">Kitchen Sink</h2>
        </CCol>
      </CRow>
      <CRow className="kitchen-sink">
        <CCol xs={12}>
          <CCard className="quest-card">
            <CCardBody>
              <CRow className="mb-5">
                <CCol md={6}>
                  <h1 className="f-quest-navy f-bold mb-4">Login: </h1>
                  <CRow>
                    <CCol md="10" className="auth-form">
                      <CCard>
                        <CCardHeader className="text-center  d-flex justify-content-center align-items-center">
                          <CImg src={QuestLogo} className="logo" />
                        </CCardHeader>
                        <CCardBody>
                          <CForm
                            className="text-center quest-form"
                            data-testid="loginForm"
                          >
                            <CFormGroup className={"mb-3"}>
                              <CLabel>Email</CLabel>
                              <div className="big-field has-icon">
                                <i className="cil-envelope-closed"></i>
                                <CInput
                                  type="email"
                                  autoComplete="email"
                                  name="email"
                                />
                              </div>
                            </CFormGroup>

                            <CFormGroup className="mb-4">
                              <CLabel>Password</CLabel>
                              <div className="big-field has-icon">
                                <img
                                  src={IconLoginPassword}
                                  alt="icon-password"
                                />
                                <CInput
                                  type="password"
                                  name="password"
                                  autoComplete="password"
                                />
                              </div>
                            </CFormGroup>
                            <QuestButton
                              big
                              type="button"
                              className="mb-2"
                              data-testid="loginButton"
                              color={BUTTON_COLORS.CTA}
                              block
                            >
                              Login
                            </QuestButton>
                            <Link
                              to="/auth/forgot-password"
                              className="forgot-password-link"
                            >
                              Forgot Password?
                            </Link>

                            <span className="need-help">Need Help?</span>
                            <span className="need-help-details">
                              <a href="mailto:help@quest.finance">
                                help@quest.finance
                              </a>{" "}
                              or 1300 465 363
                            </span>
                          </CForm>
                        </CCardBody>
                      </CCard>
                    </CCol>
                  </CRow>
                </CCol>
                <CCol md={6}>
                  <h1 className="f-quest-navy f-bold mb-4">Text Styles: </h1>
                  <h1 className="f-quest-navy f-bold mb-4">
                    Heading 1 (38px){" "}
                  </h1>
                  <h2 className="f-quest-navy f-bold mb-4">
                    Heading 2 (24px){" "}
                  </h2>
                  <h3 className="f-quest-navy f-bold mb-4">
                    Heading 3 (20px){" "}
                  </h3>
                  <h4 className="f-quest-navy f-bold mb-4">
                    Heading 4 (16px){" "}
                  </h4>
                  <p className="f-quest-navy mb-4">Body copy (14px)</p>
                  <p className="f-quest-navy f-12 mb-4">Small (12px)</p>
                  <span className="quest-block-quote">Block Quote (40px)</span>

                  <div className="logo-container white">
                    <img src={QuestConnectBlue} alt="quest-connect-blue" />
                  </div>

                  <div className="logo-container blue">
                    <img src={QuestConnectWhite} alt="quest-connect-white" />
                  </div>
                </CCol>
              </CRow>
              <CRow>
                <CCol md={6}>
                  <h1 className="f-quest-navy f-bold">Colours: </h1>
                  <div className="colour-container">
                    <div className="colour navy"></div>
                    <div className="colour-label">#1A0352 (Quest Navy)</div>
                  </div>
                  <div className="colour-container">
                    <div className="colour navy-90"></div>
                    <div className="colour-label">#311C63 (Quest Navy 90%)</div>
                  </div>
                  <div className="colour-container">
                    <div className="colour green"></div>
                    <div className="colour-label">#05F58F (Quest Green)</div>
                  </div>
                  <div className="colour-container">
                    <div className="colour red"></div>
                    <div className="colour-label">#EB3359 (Quest Red)</div>
                  </div>
                  <div className="colour-container">
                    <div className="colour light-grey"></div>
                    <div className="colour-label">#E5E5E5 (Light Grey)</div>
                  </div>
                  <div className="colour-container">
                    <div className="colour grey"></div>
                    <div className="colour-label">#C4C4C4 (Grey)</div>
                  </div>
                  <div className="colour-container">
                    <div className="colour dark-grey"></div>
                    <div className="colour-label">#555555 (Dark Grey)</div>
                  </div>
                  <div className="colour-container">
                    <div className="colour yellow"></div>
                    <div className="colour-label">
                      #F3BB1C (Yellow/In-Progress)
                    </div>
                  </div>
                  <div className="colour-container">
                    <div className="colour green-success"></div>
                    <div className="colour-label">
                      #F3BB1C (Approved - Success)
                    </div>
                  </div>
                </CCol>
                <CCol md={6}>
                  <h1 className="f-quest-navy f-bold">Elements: </h1>
                  <CRow className="mb-3">
                    <CCol md={6}>
                      <LabelRadioGroups
                        options={options}
                        handleChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setExampleRadio(event.target.value);
                        }}
                        fieldName="exampleRadio"
                        checkedValue={exampleRadio}
                      />
                    </CCol>
                    <CCol md={6}>
                      <div>
                        <ReactSVG src={ArrowLeftRed} className="svg inline" />
                        <ReactSVG src={ArrowLeftNavy} className="svg inline" />
                      </div>
                      <div>
                        <ReactSVG src={ArrowRightRed} className="svg inline" />
                        <ReactSVG src={ArrowRightNavy} className="svg inline" />
                      </div>
                    </CCol>
                  </CRow>
                  Notes: the following labels and inputs must be wrapped inside
                  the <span className="code">quest-form</span> class in order
                  for the styles to apply.
                  <CRow className="quest-form">
                    <CCol md={4}>
                      <CFormGroup>
                        <CLabel>Label</CLabel>
                        <CInput />
                      </CFormGroup>
                    </CCol>
                    <CCol md={4}>
                      <CFormGroup className="with-error">
                        <CLabel>Label</CLabel>
                        <CInput />
                        <span className="validation-error">
                          Error message under field
                        </span>
                      </CFormGroup>
                    </CCol>
                    <CCol md={4}>
                      <CFormGroup className="with-error">
                        <CLabel>Label</CLabel>
                        <CSelect>
                          <option>Select</option>
                        </CSelect>
                        <span className="validation-error">
                          Error message under field
                        </span>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol md={6}>
                      <CFormGroup variant="custom-checkbox" inline>
                        <CInputCheckbox
                          custom
                          className="quest-checkbox"
                          id="exampleCheckbox"
                          name="exampleCheckbox"
                          value={1}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setExampleCheckbox(event.target.checked);
                          }}
                          checked={exampleCheckbox}
                        />
                        <CLabel
                          variant="custom-checkbox"
                          htmlFor="exampleCheckbox"
                        >
                          Example checkbox
                        </CLabel>
                      </CFormGroup>
                    </CCol>
                  </CRow>
                  <hr />
                  <h2 className="f-bold f-quest-navy">Drop-menu:</h2>
                  <CDropdown className="quest-dropdown">
                    <CDropdownToggle className={`quest-nav-link`}>
                      Dropdown
                      <CDropdownMenu
                        className="quest-dropdown-menu"
                        placement="bottom-end"
                      >
                        <CDropdownItem className="quest-dropdown-item">
                          Drop down item 1
                        </CDropdownItem>
                        <CDropdownItem className="quest-dropdown-item">
                          Drop down item 1
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdownToggle>
                  </CDropdown>
                  <hr />
                  <h2 className="f-bold f-quest-navy">Buttons:</h2>
                  <CRow>
                    <CCol md={6} className="right-border">
                      <button
                        type="button"
                        className="quest-sidebar-toggler no-hover"
                      >
                        <ReactSVG src={iconMenuOpen} alt="icon-menu-open" />
                      </button>
                      <br />
                      <br />
                      <button
                        type="button"
                        className="quest-sidebar-toggler no-hover"
                      >
                        <ReactSVG src={iconMenuClose} alt="icon-menu-close" />
                      </button>
                      <br />
                      <br />
                      <CDropdown className="quest-dropdown" dir="down">
                        <CDropdownToggle
                          caret={false}
                          className="c-header-nav-link p-0 no-hover"
                        >
                          <div className="c-avatar">
                            <ReactSVG src={userIcon} />
                          </div>
                        </CDropdownToggle>
                      </CDropdown>
                      <br />
                      <br />
                      <LabelRadioGroups
                        className="no-hover"
                        options={[
                          {
                            label: "Active",
                            value: "active",
                          },
                          {
                            label: "Selected",
                            value: "selected",
                          },
                        ]}
                        handleChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => setExampleRadio(event.target.value)}
                        fieldName="activeSelected"
                        checkedValue="selected"
                      />
                      <br />
                      <br />
                      <QuestButton
                        color={BUTTON_COLORS.PRIMARY}
                        className="no-hover long-button"
                      >
                        Primary
                      </QuestButton>
                      <br />
                      <br />
                      <QuestButton
                        color={BUTTON_COLORS.SECONDARY}
                        className="no-hover long-button"
                      >
                        Secondary
                      </QuestButton>
                      <br />
                      <br />
                      <QuestButton
                        color={BUTTON_COLORS.COMMIT}
                        className="no-hover long-button"
                      >
                        Commit
                      </QuestButton>
                      <br />
                      <br />
                      <QuestButton
                        color={BUTTON_COLORS.CTA}
                        className="no-hover long-button"
                      >
                        CTA
                      </QuestButton>
                    </CCol>
                    <CCol md={6}>
                      <button
                        type="button"
                        className="quest-sidebar-toggler hover"
                      >
                        <ReactSVG src={iconMenuOpen} alt="icon-menu-open" />
                      </button>
                      <br />
                      <br />
                      <button
                        type="button"
                        className="quest-sidebar-toggler hover"
                      >
                        <ReactSVG src={iconMenuClose} alt="icon-menu-close" />
                      </button>
                      <br />
                      <br />
                      <CDropdown className="quest-dropdown" dir="down">
                        <CDropdownToggle
                          caret={false}
                          className="c-header-nav-link p-0 hover"
                        >
                          <div className="c-avatar">
                            <ReactSVG src={userIcon} />
                          </div>
                        </CDropdownToggle>
                      </CDropdown>
                      <br />
                      <br />
                      <LabelRadioGroups
                        className="hover"
                        options={[
                          {
                            label: "Hover",
                            value: "hover",
                          },
                        ]}
                        handleChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => setExampleRadio(event.target.value)}
                        fieldName="hover"
                        checkedValue=""
                      />
                      <br />
                      <br />
                      <QuestButton
                        color={BUTTON_COLORS.PRIMARY}
                        className="hover long-button"
                      >
                        Primary
                      </QuestButton>
                      <br />
                      <br />
                      <QuestButton
                        color={BUTTON_COLORS.SECONDARY}
                        className="hover long-button"
                      >
                        Secondary
                      </QuestButton>
                      <br />
                      <br />
                      <QuestButton
                        color={BUTTON_COLORS.COMMIT}
                        className="hover long-button"
                      >
                        Commit
                      </QuestButton>
                      <br />
                      <br />
                      <QuestButton
                        color={BUTTON_COLORS.CTA}
                        className="hover long-button"
                      >
                        CTA
                      </QuestButton>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default KitchenSink;
