import React from "react";
import "./Badge.scss";

export enum BADGE_COLORS {
  SUCCESS = "success",
  DANGER = "danger",
  WARNING = "warning",
  DEFAULT = "default",
}

type BadgeProps = {
  text: string;
  color: BADGE_COLORS;
};

const Badge: React.FunctionComponent<BadgeProps> = ({
  text,
  color,
  ...restProps
}: BadgeProps) => {
  return (
    <span className={`quest-badge ${color}`} {...restProps}>
      {text}
    </span>
  );
};

export default Badge;
