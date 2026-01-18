# FingerAnimation 재시작 버그 수정 기록

## 문제 현상
화살표가 타겟을 "클릭"한 후, 사라지지 않고 **처음 위치에서 애니메이션이 다시 시작**되는 현상

## 원인
```typescript
useEffect(() => {
  // 애니메이션 시작 로직
}, [visible, resetKey, targetPosition.x, targetPosition.y]);
```

1. 하이라이트 적용 시 스타일 변경 (`backgroundColor`, `transform` 등)
2. 스타일 변경으로 `onLayout` 재호출
3. `measureLayout`으로 위치 재측정
4. `targetPosition`이 미세하게 변경됨
5. useEffect 의존성 배열에 `targetPosition`이 있어서 **애니메이션 재시작**

## 해결책
`targetPosition`을 직접 의존성으로 사용하지 않고, `resetKey`가 변경될 때만 위치를 "잠금"

```typescript
// 고정된 타겟 위치 (resetKey가 바뀔 때만 업데이트)
const lockedPositionRef = useRef({ x: 0, y: 0 });

// resetKey가 변경되면 위치 잠금 업데이트
if (resetKey !== prevResetKeyRef.current) {
  lockedPositionRef.current = { x: targetPosition.x, y: targetPosition.y };
  prevResetKeyRef.current = resetKey;
}

// useEffect 의존성에서 targetPosition 제거
useEffect(() => {
  // lockedPosition 사용
}, [visible, resetKey]); // targetPosition.x, targetPosition.y 제거
```

## 핵심 교훈
- `onLayout` + `measureLayout` 조합은 스타일 변경 시 재호출될 수 있음
- 애니메이션 useEffect에 측정값을 직접 의존성으로 넣으면 의도치 않은 재시작 발생
- **측정값은 ref로 "잠금"하고, 명시적인 트리거(resetKey)로만 업데이트**
