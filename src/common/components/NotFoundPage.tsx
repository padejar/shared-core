import React from "react";
import { CCard, CCardBody, CCol, CRow } from "@coreui/react";

type NotFoundPageProps = {
  redirectLink?: string;
  redirectLinkText?: string;
};

const NotFoundPage: React.FunctionComponent<NotFoundPageProps> = ({
  redirectLink,
  redirectLinkText,
}: NotFoundPageProps) => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardBody>
            <CRow>
              <CCol className="text-center">
                <h1>404</h1>
              </CCol>
            </CRow>
            <CRow>
              <CCol className="text-center">
                <h2>Oops! The page you are looking for does not exists.</h2>
                {redirectLink && redirectLinkText && (
                  <a className="btn-link" href={redirectLink}>
                    {redirectLinkText}
                  </a>
                )}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default NotFoundPage;
