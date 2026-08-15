# Cursor Master Prompt: Mobile Wedding Invitation

이 문서는 Cursor Agent에게 그대로 전달하는 최상위 실행 지시서다. 아래 요구사항을 생략하거나 임의로 바꾸지 말고, 저장소의 `docs/IMPLEMENTATION_SPEC.md`, `docs/DESIGN_SYSTEM.md`, `docs/QA_CHECKLIST.md`, `src/content/wedding.ts`를 먼저 모두 읽은 뒤 구현한다.

## 역할

당신은 모바일 웹 성능과 접근성에 강한 시니어 Next.js 프론트엔드 엔지니어이자 에디토리얼 디자이너다. 목표는 사진이 주인공인 자연스럽고 모던한 한국형 모바일 청첩장을 완성하는 것이다. 레퍼런스를 픽셀 복제하지 말고, 사용자의 실제 사진과 콘텐츠에 맞는 고유한 페이지를 만든다.

## Design Read

Reading this as: 사진 중심의 개인 이벤트 페이지 for 모바일로 초대장을 확인하는 하객, with a 자연스럽고 차분한 모던 에디토리얼 language, leaning toward native CSS + restrained Motion + selective GSAP.

- `DESIGN_VARIANCE: 5`
- `MOTION_INTENSITY: 4`
- `VISUAL_DENSITY: 3`
- 테마: 라이트 전용. 청첩장의 인쇄물 같은 정서를 위해 의도적으로 고정한다.
- 핵심 감정: 초록 잔디, 아이보리 드레스, 연한 블루 셔츠가 만드는 맑고 편안한 분위기

## 기술 스택

- Next.js 최신 안정 버전, App Router, TypeScript strict
- Tailwind CSS v4
- 정적 레이아웃은 React Server Components
- 상호작용이 필요한 최소 컴포넌트만 `'use client'`
- 일반 진입 모션: `motion/react`
- GSAP + ScrollTrigger: 반드시 필요한 한 장면에만 사용. 필요 없으면 설치하지 않는다.
- 아이콘: `@phosphor-icons/react` 한 종류만 사용
- 갤러리: Swiper를 우선 사용하되, 번들 크기와 접근성을 확인한다.
- 테스트: Vitest + Testing Library, Playwright

어떤 패키지도 `package.json` 확인 전에 import하지 않는다. 없는 패키지는 설치 명령과 이유를 먼저 제시한 뒤 설치한다.

## 구현 순서

1. 관련 문서와 이미지 파일을 확인한다.
2. `<design_plan>` 블록을 작성한다. 여기에는 섹션 구조, 토큰, 모션의 목적, 모바일 대응, 의존성을 포함한다.
3. Next.js 프로젝트가 없으면 현재 폴더에 초기화한다. 기존 파일과 이미지를 삭제하거나 덮어쓰지 않는다.
4. `src/content/wedding.ts`의 데이터만 수정하면 모든 문구와 연락처가 바뀌도록 만든다.
5. 디자인 토큰과 기본 타이포그래피를 먼저 구현한다.
6. 정적 섹션을 Server Component로 구현한다.
7. 갤러리, 라이트박스, 복사, 공유, 전화 연결을 Client Component로 격리한다.
8. 진입 모션과 갤러리 모션을 추가한다.
9. 로딩, 이미지 오류, 클립보드 실패, 지도 앱 미설치 등 실패 상태를 구현한다.
10. 테스트와 Lighthouse 검수를 실행하고 `docs/QA_REPORT.md`에 결과를 기록한다.

## 페이지 구조

다음 순서를 유지한다.

1. Hero
2. Invitation Message
3. Couple and Family
4. Wedding Date Calendar
5. Venue and Transportation
6. Gallery
7. Contact
8. RSVP 또는 축하 메시지 안내
9. Account Information
10. Share and Footer

내비게이션 바와 불필요한 메뉴는 만들지 않는다. 모바일 청첩장은 하나의 자연스러운 스크롤 이야기여야 한다.

## 가장 중요한 시각 규칙

- Hero에는 실제 사진과 텍스트만 둔다. 배지, 스탬프, 꽃 일러스트, 장식 SVG, 스크롤 안내, 카드, 유리 효과를 추가하지 않는다.
- Hero 기본 이미지는 `/DSCF0055_retouch_3000x4000.png`다. 실제 파일 위치에 맞춰 `public/images/hero.png`로 복사하거나 명시적으로 참조하되 원본은 삭제하지 않는다.
- 인물의 얼굴, 머리, 손, 발이 잘리지 않게 한다. 모바일에서 `object-position`을 직접 조정하고 360, 390, 430px 너비에서 확인한다.
- 페이지 전체에 하나의 중성 팔레트와 하나의 올리브 포인트만 쓴다.
- 사진 위 텍스트는 명암비가 확보되는 위치에만 배치한다. 필요하면 검정 오버레이가 아니라 8-14% 수준의 아주 약한 상하 방향 음영만 사용한다.
- 과도한 베이지, 금색, 갈색의 전형적인 청첩장 팔레트를 쓰지 않는다.
- 카드 남발 금지. 그룹은 여백, 얇은 구분선, 배경색 차이로 구분한다.
- 둥근 모서리는 이미지와 정보 패널에 12px로 통일한다. 버튼은 8px다. 거대한 pill 컨테이너는 금지한다.
- 그림자는 기본적으로 사용하지 않는다. 라이트박스와 플로팅 토스트에만 낮은 불투명도로 허용한다.
- 이모지, 장식용 점, 섹션 번호, `SECTION 01` 같은 메타 라벨을 사용하지 않는다.
- 보이는 텍스트에 em dash와 en dash를 사용하지 않는다. 문장을 다시 쓴다.

## 타이포그래피

- 한글 본문: Pretendard Variable 또는 SUIT Variable을 로컬/최적화 방식으로 사용
- 영문 및 숫자: 같은 산세리프 계열을 기본으로 하여 통일감을 유지
- Hero 제목에만 우아한 한글 명조 계열을 선택적으로 허용한다. 사용 시 한 가족만 쓰고 본문과 혼합을 최소화한다.
- 텍스트는 절대 순백/순흑을 피하고 `#F8F8F4`, `#20231F` 계열을 사용한다.
- 모바일 본문 최소 16px, 보조 정보 최소 14px
- 날짜 숫자의 자간은 넓게, 한글 본문의 줄간격은 1.7 전후

## 모션 원칙

모든 애니메이션은 다음 목적 중 하나를 가져야 한다: 정보의 순서, 사용자 행동에 대한 피드백, 갤러리의 공간 전환. 단순히 멋있어 보이기 위한 모션은 제거한다.

- Hero: 최초 1회, 이미지 `scale(1.03 -> 1)` 1.6초와 텍스트 opacity/y 진입
- 섹션: `opacity 0 -> 1`, `translateY 12px -> 0`, 600ms, ease `[0.16, 1, 0.3, 1]`
- 갤러리: 손가락 스와이프, 관성, 현재 위치 표시, 탭 시 라이트박스
- 모달: 공유 요소 확대 또는 단순 fade/scale. 브라우저 히스토리 뒤로가기로 닫히게 한다.
- 전화, 복사, 공유 버튼: active 시 `scale(0.98)`
- 무한 마키, 스크롤 가로채기, 커스텀 커서, 자석 버튼, 반복되는 배경 애니메이션은 금지한다.
- `window.addEventListener('scroll')` 금지. Motion, IntersectionObserver 또는 ScrollTrigger를 사용한다.
- `prefers-reduced-motion: reduce`에서 모든 자동 모션과 smooth scroll을 제거한다.
- transform과 opacity만 애니메이션한다.

## 기능 요구사항

- 갤러리: 썸네일 그리드 + 전체 화면 라이트박스 + 스와이프 + 키보드 + 닫기 버튼 + 이미지 번호
- 연락하기: 신랑/신부 전화와 문자 링크, 부모님 연락처는 아코디언 안에 배치
- 계좌번호: 그룹별 아코디언, 복사 버튼, 성공/실패 토스트, 민감 정보가 URL에 노출되지 않게 처리
- 장소: 주소 복사, 전화, 네이버지도/카카오맵/T맵 링크. 링크는 `wedding.ts` 데이터에서 관리
- 공유: Web Share API 우선, 미지원 환경은 URL 복사
- 캘린더: 실제 날짜와 요일을 계산해서 표시하고 해당 날짜에만 포인트 컬러 사용
- RSVP가 활성화된 경우 명확한 label, validation, loading, success, error 상태를 구현한다. 백엔드가 없으면 가짜 성공 처리를 하지 말고 기능을 비활성화하거나 외부 폼 URL을 사용한다.
- 모든 외부 링크에는 목적이 분명한 접근성 이름을 제공한다.

## 반응형과 접근성

- 기준 너비: 320, 360, 390, 430, 768, 1024px
- Hero는 `min-height: 100svh`와 `100dvh` 폴백을 사용하고 `h-screen`을 쓰지 않는다.
- 모바일 safe area를 고려한다.
- 모든 버튼의 터치 영역은 최소 44x44px
- 본문 명암비 WCAG AA 4.5:1 이상, 큰 글자 3:1 이상
- 키보드 focus-visible 상태를 제거하지 않는다.
- 라이트박스는 focus trap, Escape 닫기, 이전 focus 복원을 구현한다.
- 이미지에는 내용에 맞는 한국어 alt를 작성한다. 장식용 이미지만 빈 alt를 쓴다.
- `aria-live="polite"`로 복사 완료 토스트를 알린다.

## 성능 기준

- LCP < 2.5초, INP < 200ms, CLS < 0.1
- Hero 이미지는 `next/image`의 `priority` 또는 preload를 적용하고 정확한 sizes를 지정한다.
- 갤러리 이미지는 AVIF/WebP 파생본을 사용하고 초기 화면 아래 이미지는 lazy loading한다.
- 이미지 원본 비율을 보존하고 width/height 또는 aspect-ratio를 선언한다.
- 갤러리/라이트박스 코드는 필요 시 dynamic import한다.
- 모바일에서 스크롤 중 55fps 아래로 반복 하락하는 효과는 제거한다.

## 금지 사항

- 레퍼런스 이미지 자체를 웹페이지 한 장의 배경으로 사용
- 이미지를 base64로 소스 코드에 삽입
- 임의의 신랑/신부 이름, 계좌번호, 전화번호를 실제 정보인 것처럼 생성
- `Lorem ipsum`, John Doe, Acme, 의미 없는 감성 문구
- 3개의 동일한 카드가 나란히 놓인 SaaS형 레이아웃
- 보라색/파란색 AI 그라데이션, 글래스모피즘, 강한 드롭 섀도
- 이미지 위 장식 배지와 pill 태그
- 모바일에서 인물이 잘리는 `object-cover`를 검수 없이 사용
- CSS로 가짜 지도나 가짜 사진을 제작
- 테스트 없이 완료 선언

## 완료 조건

`docs/QA_CHECKLIST.md`의 모든 필수 항목을 통과해야 완료다. 실패한 항목은 숨기지 말고 `docs/QA_REPORT.md`에 원인과 후속 작업을 기록한다. 구현 후 다음 명령이 모두 성공해야 한다.

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright test
```

마지막 응답에는 변경 파일, 실행 방법, 실제 테스트 결과, 사용자가 반드시 교체해야 하는 placeholder 데이터를 짧게 정리한다.
