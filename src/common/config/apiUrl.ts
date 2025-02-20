import { API_URL, MOCK_API_URL } from "@env";
import Constants from "expo-constants";

const getApiUrl = () => {
  if (!__DEV__) {
    // EAS Build
    const apiUrl = Constants.expoConfig?.extra?.API_URL;
    if (!apiUrl) return "";

    return apiUrl;
  }
  // Expo GO Dev
  return MOCK_API_URL;
};

export default getApiUrl();
