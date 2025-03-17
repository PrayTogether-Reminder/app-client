/**
 * 기본 이메일 유효성 검사 함수
 * @param email 검사할 이메일 주소
 * @returns 이메일 유효성 (true/false)
 */
export function validateEmail(email: string): boolean {
  // 빈 문자열 또는 null 체크
  if (!email || email.trim() === "") {
    return false;
  }

  // 이메일 정규식 패턴
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 기본 정규식 검사
  if (!emailRegex.test(email)) {
    return false;
  }

  // 추가 검증 로직
  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;

  // 로컬 파트 길이 제한 (64자 이하)
  if (localPart.length > 64) return false;

  // 도메인 길이 제한 (255자 이하)
  if (domain.length > 255) return false;

  // 특수한 이메일 패턴 추가 검증
  const invalidPatterns = [
    /\.{2,}/, // 연속된 점 방지
    /^\./, // 점으로 시작하는 경우 방지
    /\.$/, // 점으로 끝나는 경우 방지
    /[<>()[\]\\,;:\s"]/, // 특수 문자 방지
  ];
  return !invalidPatterns.some((pattern) => pattern.test(email));
}

/**
 * 이메일 형식 오류 메시지 반환
 * @param email 검사할 이메일 주소
 * @returns 오류 메시지 (유효하면 null)
 */
export function getEmailErrorMessage(email: string): string | null {
  if (!email || email.trim() === "") {
    return "이메일 주소를 입력해주세요.";
  }

  if (!validateEmail(email)) {
    return "유효하지 않은 이메일 형식입니다.";
  }

  return null;
}

/**
 * 이메일 도메인 추출
 * @param email 이메일 주소
 * @returns 도메인 (없으면 null)
 */
export function extractDomain(email: string): string | null {
  if (!validateEmail(email)) {
    return null;
  }

  return email.split("@")[1];
}
