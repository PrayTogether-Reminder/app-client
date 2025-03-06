import Constants from "expo-constants";
import { Alert } from "react-native";

const getApiUrl = (): string => {
  const expoConfig = Constants.expoConfig as any;
  const apiUrl = expoConfig?.runtimeEnvs?.EXPO_PUBLIC_API_URL as
    | string
    | undefined;

  console.log(expoConfig?.runtimeEnvs);

  if (!apiUrl) {
    if (__DEV__) {
      Alert.alert(
        "환경 변수 오류",
        ".env 파일에 EXPO_PUBLIC_API_URL이 설정되어 있는지 확인하세요. ="
      );
      // default
      return "http://localhost:3000/api/v1";
    } else {
      throw new Error(
        "API URL이 설정되지 않았습니다. EAS Secret이 제대로 설정되었는지 확인하세요."
      );
    }
  }

  return apiUrl;
};

const API_URL = getApiUrl();

export default API_URL;
