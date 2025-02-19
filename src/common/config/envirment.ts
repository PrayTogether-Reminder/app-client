type Environment = "dev" | "prod";

interface EnvConfig {
  apiUrl: string;
}

const ENV: Record<Environment, EnvConfig> = {
  dev: {
    apiUrl:
      process.env.REACT_APP_MOCK_API_URL ?? "http://localhost:8080/api/v1",
  },
  prod: {
    apiUrl: process.env.REACT_APP_API_URL ?? "",
  },
};

const getEnvironment = (): Environment => {
  if (process.env.NODE_ENV === "development") {
    return "dev";
  }
  return "prod";
};

// 설정값이 없을 경우 에러 처리
const config = ENV[getEnvironment()];
if (!config.apiUrl) {
  throw new Error("API URL is not configured");
}

export default config;
