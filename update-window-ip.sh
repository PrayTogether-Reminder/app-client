#!/bin/bash
# Windows 환경에서 Expo 프로젝트의 .env 파일의 EXPO_PUBLIC_API_URL을 자동으로 업데이트하는 스크립트
# 주의: 이 스크립트는 한글 Windows 환경에서만 동작합니다.

# 한글 Windows 환경에서 IPv4 주소 추출 - 정확한 패턴 매칭
IP_ADDRESS=$(ipconfig | grep -A 10 "무선 LAN 어댑터 Wi-Fi" | grep "IPv4" | grep -o "[0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+")

# 추출된 IP 주소 확인
if [ -z "$IP_ADDRESS" ]; then
  echo "IPv4 주소를 찾지 못했습니다. 다른 방법으로 시도합니다..."
  
  # 대안 방법: 모든 IPv4 주소 패턴을 찾음
  IP_ADDRESS=$(ipconfig | grep -o "[0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+" | head -1)
  
  if [ -z "$IP_ADDRESS" ]; then
    echo "Error: 어떤 IPv4 주소도 찾을 수 없습니다."
    exit 1
  fi
fi

echo "감지된 IPv4 주소: $IP_ADDRESS"

# .env 파일 경로 (현재 디렉토리의 .env 파일 기준, 필요시 경로 수정)
ENV_FILE=".env"

# 파일 존재 여부 확인
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: $ENV_FILE 파일을 찾을 수 없습니다."
  exit 1
fi

# 이전 IP 주소 추출
PREVIOUS_IP=$(grep "^EXPO_PUBLIC_API_URL=" "$ENV_FILE" | grep -o "[0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+")

# 기존 .env 파일 백업
cp "$ENV_FILE" "${ENV_FILE}.bak"

# 새 파일 생성 - 라인별로 처리
> "${ENV_FILE}.new"

# 파일 읽어서 IP 주소 변경
while IFS= read -r line || [ -n "$line" ]; do
  if [[ $line =~ ^EXPO_PUBLIC_API_URL= ]]; then
    echo "EXPO_PUBLIC_API_URL=http://$IP_ADDRESS:3000/api/v1" >> "${ENV_FILE}.new"
  else
    echo "$line" >> "${ENV_FILE}.new"
  fi
done < "$ENV_FILE"

# 새 파일을 원래 파일로 이동
mv "${ENV_FILE}.new" "$ENV_FILE"

echo ".env 파일의 EXPO_PUBLIC_API_URL이 업데이트되었습니다."
echo "이전 파일은 ${ENV_FILE}.bak으로 백업되었습니다."

# 이전 IP와 변경된 IP 출력
echo "-----------------------------------------"
echo "이전 IP 주소: $PREVIOUS_IP"
echo "변경 IP 주소: $IP_ADDRESS"
echo "-----------------------------------------"