import { NativeModules, Platform } from "react-native";

/**
 * 사용자의 모바일 기기에서 현재 타임존을 가져옵니다.
 * @returns 현재 타임존 (예: 'Asia/Seoul')
 */
export const getUserTimeZone = (): string => {
  // iOS와 Android에서 타임존 가져오는 방법이 다름
  if (Platform.OS === "ios") {
    const timezone =
      NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0];
    return timezone;
  } else if (Platform.OS === "android") {
    return NativeModules.I18nManager.localeIdentifier;
  }

  // 기본값으로 UTC 반환
  return "UTC";
};

/**
 * 타임존 오프셋을 분 단위로 가져옵니다.
 * @returns 현재 타임존의 UTC 기준 오프셋 (분 단위)
 */
export const getTimeZoneOffset = (): number => {
  // 현재 시간의 타임존 오프셋을 분 단위로 반환 (양수는 UTC보다 뒤, 음수는 UTC보다 앞)
  return new Date().getTimezoneOffset() * -1;
};

/**
 * UTC 시간을 사용자의 로컬 타임존으로 변환합니다.
 * @param utcDate UTC 기준 Date 객체 또는 ISO 문자열
 * @returns 사용자 로컬 타임존으로 변환된 Date 객체
 */
export const convertUTCToLocal = (utcDate: Date | string): Date => {
  // 입력이 문자열인 경우 Date 객체로 변환
  const date =
    typeof utcDate === "string" ? new Date(utcDate) : new Date(utcDate);

  // 로컬 시간으로 변환
  const localTime = new Date(date.getTime() + getTimeZoneOffset() * 60000);

  return localTime;
};

/**
 * UTC 시간을 지정된 타임존으로 변환합니다.
 * @param utcDate UTC 기준 Date 객체 또는 ISO 문자열
 * @param targetTimeZone 변환할 타임존 (예: 'Asia/Seoul', 'America/New_York')
 * @returns 지정된 타임존으로 변환된 날짜/시간 문자열
 */
export const convertUTCToTimeZone = (
  utcDate: Date | string,
  targetTimeZone: string
): string => {
  // 입력이 문자열인 경우 Date 객체로 변환
  const date =
    typeof utcDate === "string" ? new Date(utcDate) : new Date(utcDate);

  // Intl.DateTimeFormat을 사용하여 지정된 타임존으로 날짜/시간 포맷
  const formatter = new Intl.DateTimeFormat(getUserTimeZone(), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: targetTimeZone,
    hour12: false,
  });

  return formatter.format(date);
};

/**
 * 로컬 시간을 UTC로 변환합니다.
 * @param localDate 로컬 타임존의 Date 객체 또는 날짜 문자열
 * @returns UTC 시간으로 변환된 Date 객체
 */
export const convertLocalToUTC = (localDate: Date | string): Date => {
  const date =
    typeof localDate === "string" ? new Date(localDate) : new Date(localDate);

  const utcTime = new Date(date.getTime() - getTimeZoneOffset() * 60000);

  return utcTime;
};

/**
 * 날짜 객체를 포맷팅된 문자열로 변환합니다.
 * @param date 변환할 Date 객체
 * @param format 원하는 포맷 (기본값: 'YYYY-MM-DD HH:mm:ss')
 * @returns 포맷팅된 날짜 문자열
 */
export const formatDate = (
  date: Date,
  format: string = "YYYY-MM-DD"
): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return format
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day);
};
