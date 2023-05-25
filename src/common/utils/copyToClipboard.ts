export const copyToClipboard = (
  element: HTMLInputElement,
  onCopySuccess?: () => void
): void => {
  element.select();
  document.execCommand("copy");
  element.focus();
  if (typeof onCopySuccess === "function") {
    onCopySuccess();
  }
};
