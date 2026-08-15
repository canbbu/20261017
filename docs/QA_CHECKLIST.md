# 모바일 청첩장 완료 체크리스트

Cursor는 모든 `[필수]` 항목을 통과하기 전 완료라고 말하지 않는다.

## 콘텐츠

- [ ] [필수] placeholder 이름, 전화번호, 계좌번호, 주소를 사용자 데이터로 교체했거나 명확히 표시했다.
- [ ] [필수] 예식 날짜, 요일, 달력 강조 날짜가 일치한다.
- [ ] [필수] 모든 visible string을 다시 읽고 문법 오류와 어색한 AI 문구를 제거했다.
- [ ] [필수] 보이는 텍스트에 em dash 또는 en dash가 없다.
- [ ] [필수] 이름, 날짜, 개인정보가 컴포넌트에 하드코딩되지 않았다.

## 비주얼

- [ ] [필수] Hero에는 사진과 텍스트만 있다.
- [ ] [필수] 360x800, 390x844, 430x932에서 신랑과 신부의 얼굴과 주요 신체가 잘리지 않는다.
- [ ] [필수] Hero 제목이 모바일에서 2줄 이하이며 날짜와 이름이 읽힌다.
- [ ] [필수] 팔레트는 canvas, surface, ink, olive accent 범위에서 일관된다.
- [ ] [필수] 섹션마다 테마가 뒤집히지 않는다.
- [ ] [필수] 모서리 radius 시스템이 일관된다.
- [ ] [필수] 장식 배지, 꽃 SVG, 하트, 섹션 번호, 스크롤 안내가 없다.
- [ ] [필수] 동일한 카드형 레이아웃이 반복되지 않는다.

## 갤러리

- [ ] [필수] 터치 스와이프가 동작한다.
- [ ] [필수] 키보드 이전/다음과 Escape 닫기가 동작한다.
- [ ] [필수] 라이트박스 focus trap과 이전 focus 복원이 동작한다.
- [ ] [필수] 현재 이미지 번호와 닫기 버튼을 스크린리더가 읽을 수 있다.
- [ ] [필수] 이미지 로드 실패가 전체 레이아웃을 깨뜨리지 않는다.
- [ ] [필수] 초기 화면 아래 이미지는 lazy load된다.

## 기능

- [ ] [필수] 전화와 문자 링크가 올바른 대상에게 연결된다.
- [ ] [필수] 계좌와 주소 복사 성공/실패가 안내된다.
- [ ] [필수] Web Share 미지원 환경에서 URL 복사가 동작한다.
- [ ] [필수] 외부 지도 링크가 HTTPS이며 새 탭에서 안전하게 열린다.
- [ ] [필수] RSVP가 비활성 상태면 가짜 form 또는 성공 상태가 표시되지 않는다.
- [ ] [필수] loading, empty, error 상태가 필요한 상호작용에 구현됐다.

## 접근성

- [ ] [필수] 모든 interactive target이 최소 44x44px이다.
- [ ] [필수] 본문 contrast 4.5:1, 큰 글자 3:1 이상이다.
- [ ] [필수] focus-visible outline이 명확하다.
- [ ] [필수] 이미지 alt가 맥락에 맞고 장식 이미지에만 빈 alt가 있다.
- [ ] [필수] `prefers-reduced-motion`에서 자동 모션이 사라진다.
- [ ] [필수] 200% zoom에서 콘텐츠와 기능이 손실되지 않는다.
- [ ] [필수] 복사 토스트가 `aria-live`로 안내된다.

## 성능

- [ ] [필수] Hero에 정확한 이미지 크기와 priority/preload가 지정됐다.
- [ ] [필수] 모든 이미지에 width/height 또는 aspect-ratio가 있다.
- [ ] [필수] layout property를 애니메이션하지 않는다.
- [ ] [필수] `window.addEventListener('scroll')`을 사용하지 않는다.
- [ ] [필수] animation effect와 event listener에 cleanup이 있다.
- [ ] [필수] Lighthouse mobile Performance 90 이상을 목표로 하고 실제 점수를 기록했다.
- [ ] [필수] LCP < 2.5s, CLS < 0.1, INP < 200ms를 기록했거나 실패 이유를 기록했다.

## 빌드와 테스트

- [ ] [필수] lint 성공
- [ ] [필수] TypeScript typecheck 성공
- [ ] [필수] unit/component test 성공
- [ ] [필수] production build 성공
- [ ] [필수] Playwright mobile E2E 성공
- [ ] [필수] 360, 390, 430px screenshots를 저장하고 사람이 확인했다.
- [ ] [필수] Chrome 또는 Safari 계열 모바일 환경에서 터치 기능을 확인했다.

## 보고서 형식

`docs/QA_REPORT.md`에 다음을 기록한다.

```text
검수 일시:
Git commit:
테스트 환경:
명령별 결과:
Viewport별 screenshot 경로:
Lighthouse 수치:
미통과 항목과 이유:
사용자 확인이 필요한 개인정보/콘텐츠:
```
