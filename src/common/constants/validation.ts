export const MOBILE_VALIDATION_PATTERN = /^\({0,1}((04)){0,1}\){0,1}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{1}( |-){0,1}[0-9]{3}$/;
export const PHONE_VALIDATION_PATTERN = /^\({0,1}((0|1)){1}[0-9]{1}\){0,1}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{2}( |-){0,1}[0-9]{1}( |-){0,1}[0-9]{3}$/;
export const EMAIL_VALIDATION_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const ALLOWED_FILE_TYPES = [
  ".doc",
  ".docx",
  ".html",
  ".jpg",
  ".jpeg",
  ".pdf",
  ".png",
  ".xls",
  ".xlsx",
];

export const ALLOWED_FILE_SIZE_MEGABYTES = 30;
