import axios from "axios";

export const getCurrenAppVersion = async (): Promise<string> => {
  let appVersion = "";
  try {
    const { data } = await axios.get("/meta.json");
    appVersion = data.version;
  } catch (e) {
    // do nothing
  }

  return appVersion;
};
