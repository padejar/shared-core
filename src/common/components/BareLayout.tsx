import React from "react";
import classNames from "classnames";
import { Notification } from "../../notification";

type BareLayoutProps = {
  children?: React.ReactNode;
  className?: string;
};

const BareLayout: React.FunctionComponent<BareLayoutProps> = (
  props: BareLayoutProps
) => {
  const { children, className, ...restProps } = props;
  return (
    <div {...restProps} className={classNames("bare-layout", className)}>
      <Notification />
      {children}
    </div>
  );
};

export default BareLayout;
