import React from "react";

export enum BUTTON_COLORS {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  COMMIT = "commit",
  CTA = "cta",
  TRANSPARENT = "transparent",
}

type QuestButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  big?: boolean;
  block?: boolean;
  color?: BUTTON_COLORS;
};

export const QuestButton: React.FunctionComponent<QuestButtonProps> = ({
  big,
  block = false,
  children,
  color,
  className,
  ...props
}: QuestButtonProps) => {
  return (
    <button
      {...props}
      className={`quest-button ${block ? "block" : ""} ${
        big ? "big" : ""
      } ${color} ${className ? className : ""}`}
    >
      {children}
    </button>
  );
};
