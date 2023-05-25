import React, { useState } from "react";
import { ArrowContainer, Popover } from "react-tiny-popover";

interface SubmitButtonProps extends React.ComponentPropsWithoutRef<"button"> {
  isSubmitted?: boolean;
}

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
  function submitButtonRender(props: SubmitButtonProps, ref) {
    const { className, isSubmitted, disabled, ...allProps } = props;
    return (
      <button
        {...allProps}
        ref={ref}
        className={`submit-button ${className ? className : ""} ${
          isSubmitted ? "submitted" : ""
        }`}
        disabled={disabled}
      >
        {allProps.children}
      </button>
    );
  }
);

type SubmitButtonContainerProps = {
  popOverPositions?: ("left" | "right" | "top" | "bottom")[];
  popOverParentContainer?: HTMLDivElement | null;
  popOverContent?: () => JSX.Element;
  isSubmitted: boolean;
  disableSubmit: boolean;
  btnSubmitText: string;
  onClick: () => void;
};

export const SubmitButtonContainer: React.FunctionComponent<SubmitButtonContainerProps> = ({
  popOverPositions = ["top"],
  popOverParentContainer,
  popOverContent,
  isSubmitted,
  disableSubmit,
  btnSubmitText,
  onClick,
}: SubmitButtonContainerProps) => {
  const [isPopOverOpen, setIsPopOverOpen] = useState(false);
  return (
    <Popover
      isOpen={isPopOverOpen}
      positions={popOverPositions}
      padding={0}
      containerParent={popOverParentContainer as HTMLDivElement}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor="#d1faf5"
          arrowSize={10}
        >
          <div
            className="popover-content"
            data-testid="popover-content-submit-button"
          >
            {popOverContent && popOverContent()}
          </div>
        </ArrowContainer>
      )}
    >
      <SubmitButton
        onMouseEnter={() => {
          if (disableSubmit || isSubmitted) setIsPopOverOpen(true);
        }}
        onMouseLeave={() => {
          if (disableSubmit || isSubmitted) setIsPopOverOpen(false);
        }}
        className={disableSubmit ? "disallowed" : ""}
        isSubmitted={isSubmitted}
        type="button"
        onClick={() => {
          if (!disableSubmit) {
            onClick();
          }
        }}
        data-testid="submit-button"
      >
        {btnSubmitText}
      </SubmitButton>
    </Popover>
  );
};

export default SubmitButton;
