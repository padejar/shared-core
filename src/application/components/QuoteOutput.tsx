import React, { useRef } from "react";
import { CCol, CRow } from "@coreui/react";
import ReactNumberFormat from "react-number-format";
import PopoverInfo from "../../common/components/PopoverInfo";
import { REPAYMENT_TERM_OPTION_LABELS } from "../constants/repaymentTermOptions";
import { QuoteFormSave } from "../types/QuoteFormSave";
import { QuoteResponse } from "../types/QuoteResponse";
import "./QuoteOutput.scss";

type QuoteOutputProps = {
  quoteDetails: QuoteResponse;
  quoteForm: QuoteFormSave;
  isLoading: boolean;
};

const GstPopover = React.memo(function GstPopover({
  containerParent,
}: {
  containerParent?: HTMLElement;
}) {
  return (
    <PopoverInfo
      positions={["top"]}
      content="This includes GST on the fees"
      containerParent={containerParent}
    />
  );
});

const QuoteOutput: React.FunctionComponent<QuoteOutputProps> = ({
  quoteDetails,
  isLoading,
  quoteForm,
}: QuoteOutputProps) => {
  const gstPopoverFirstInstalment = useRef<HTMLElement>();
  const gstPopoverNetAmount = useRef<HTMLElement>();
  const applicationFeePopover = useRef<HTMLElement>();
  const renderValue = (
    name: string,
    value: number,
    options: { prefix?: string; suffix?: string }
  ) => {
    if (isLoading) return <span>Calculating...</span>;
    const { prefix, suffix } = options;
    return (
      <ReactNumberFormat
        value={value}
        prefix={prefix}
        suffix={suffix}
        displayType="text"
        decimalScale={2}
        fixedDecimalScale
        thousandSeparator=","
        data-testid={name}
      />
    );
  };

  return (
    <div className="quote-output-container">
      <div className="quote-output-inner">
        <h1 className="quest-block-quote text-center mb-3 mt-3">Summary</h1>
        <CRow>
          <CCol xs={8} className="label">
            {REPAYMENT_TERM_OPTION_LABELS[quoteForm.repaymentTermOption]}{" "}
            payments
          </CCol>
          <CCol xs={4} className="value">
            {renderValue("installmentAmount", quoteDetails.installmentAmount, {
              prefix: "$",
            })}
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={8} className="label" innerRef={gstPopoverFirstInstalment}>
            First instalment
            {!quoteForm.includeFees && (
              <GstPopover containerParent={gstPopoverFirstInstalment.current} />
            )}
          </CCol>
          <CCol xs={4} className="value">
            {renderValue(
              "firstInstallmentAmount",
              quoteDetails.firstInstallmentAmount,
              { prefix: "$" }
            )}
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={8} className="label">
            Balloon
          </CCol>
          <CCol xs={4} className="value">
            {renderValue("balloonNominal", quoteDetails.balloonNominal, {
              prefix: "$",
            })}
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={8} className="label" innerRef={gstPopoverNetAmount}>
            Net amount financed
            {quoteForm.includeFees && (
              <GstPopover containerParent={gstPopoverNetAmount.current} />
            )}
          </CCol>
          <CCol xs={4} className="value">
            {renderValue("amountFinanced", quoteDetails.amountFinanced, {
              prefix: "$",
            })}
          </CCol>
        </CRow>
        <br />
        <CRow>
          <CCol xs={8} className="label" innerRef={applicationFeePopover}>
            Application fee (ex GST)
            <PopoverInfo
              containerParent={applicationFeePopover.current}
              positions={["top"]}
              content={
                <>
                  Dealer sale: $395
                  <br />
                  Private sale &amp; refinance: $545
                </>
              }
            />
          </CCol>
          <CCol xs={4} className="value">
            {renderValue("applicationFee", quoteDetails.applicationFee, {
              prefix: "$",
            })}
          </CCol>
        </CRow>
        <br />
        <CRow>
          <CCol xs={8} className="label">
            Total payment to introducer (inc GST)
          </CCol>
          <CCol xs={4} className="value">
            {renderValue(
              "totalPaymentToBrokerWithGst",
              quoteDetails.totalPaymentToBrokerWithGst,
              { prefix: "$" }
            )}
          </CCol>
        </CRow>

        <div className="container-arrow"></div>
      </div>
    </div>
  );
};

export default QuoteOutput;
