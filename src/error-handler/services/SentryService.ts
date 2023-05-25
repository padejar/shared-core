import * as Sentry from "@sentry/react";

class SentryService {
  public static initMonitoring(): void {
    Sentry.init({
      dsn: process.env.REACT_APP_ERROR_HANDLER_SENTRY_DSN,
      environment: process.env.REACT_APP_ENV,
    });
  }

  public static report(error: unknown): void {
    Sentry.captureException(error);
  }

  public static addBreadCrumb(breadCrumb: Sentry.Breadcrumb): void {
    Sentry.addBreadcrumb(breadCrumb);
  }
}

export default SentryService;
