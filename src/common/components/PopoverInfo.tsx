import React, { ReactNode, useState } from "react";
import { ArrowContainer, Popover, PopoverProps } from "react-tiny-popover";

type PopoverInfoProps = {
  positions: PopoverProps["positions"];
  content: ReactNode;
  containerParent?: HTMLElement;
  containerStyle?: Partial<CSSStyleDeclaration> | undefined;
};

const PopoverInfo: React.FunctionComponent<PopoverInfoProps> = ({
  positions,
  content,
  containerParent,
  containerStyle,
}: PopoverInfoProps): React.ReactElement => {
  const [poporverOpen, setPoporverOpen] = useState(false);

  return (
    <Popover
      containerParent={containerParent}
      isOpen={poporverOpen}
      positions={positions}
      padding={0}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor="#d1faf5"
          arrowSize={10}
        >
          <div className="popover-content">{content}</div>
        </ArrowContainer>
      )}
      containerStyle={containerStyle}
    >
      <span
        className="popover-info"
        onMouseEnter={() => setPoporverOpen(true)}
        onMouseLeave={() => setPoporverOpen(false)}
        onClick={() => setPoporverOpen((previousState) => !previousState)}
      >
        i
      </span>
    </Popover>
  );
};

export default PopoverInfo;
