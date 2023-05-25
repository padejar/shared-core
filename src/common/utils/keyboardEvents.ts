import React from "react";

export const handleEnterKey = <T>(
  event: React.KeyboardEvent<T>,
  callback: () => void
): void => {
  if (event.key === "Enter") {
    callback();
  }
};
