import TagManager from "react-gtm-module";

export const gtm = (gtmId: string): void => {
  const GTM_ID = process.env.REACT_APP_GTM_ID;

  if (GTM_ID) {
    TagManager.initialize({
      gtmId,
    });
  }
};

export default gtm;
