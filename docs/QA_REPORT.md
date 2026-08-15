# QA Report

검수 일시: 2026-08-16  
Git commit: 없음. 이 폴더는 아직 git 저장소가 아니다.  
테스트 환경: Windows 10, Node.js, Next.js 15.5.23, Playwright Chromium (Pixel 7 프로필), 로컬 `next start` 포트 3101

## 명령별 결과

| 명령 | 결과 |
|---|---|
| `npm run lint` (`next lint`) | 성공. 경고 없음 |
| `npm run typecheck` | 성공 |
| `npm run test` (Vitest 16) | 성공 |
| `npm run build` | 성공. `/` 55.6 kB, First Load JS 159 kB |
| `npx playwright test` | 성공. 9 / 9 |

## Viewport별 screenshot 경로

사람이 확인한 Hero 크롭 결과: 360, 390, 430에서 두 사람 얼굴과 상체가 보이며, 제목/이름/날짜가 사진 위 잔디 영역에 겹친다. 세로 화면은 `object-fit: cover`로 좌우 잔디만 잘리고, 인물은 중앙에 유지된다.

- `docs/screenshots/hero-360x800.png`
- `docs/screenshots/hero-390x844.png`
- `docs/screenshots/hero-430x932.png`
- `docs/screenshots/hero-320x568.png`
- `docs/screenshots/page-360x800.png`
- `docs/screenshots/page-390x844.png`
- `docs/screenshots/page-430x932.png`
- `docs/screenshots/page-320x568.png`

## Lighthouse 수치

로컬 headless Chrome. Accessibility는 100.

| 조건 | Performance | LCP | CLS | TBT / INP | 비고 |
|---|---|---|---|---|---|
| 모바일 화면, 스로틀 없음 | 100 | 0.2s | 0 | TBT 0ms | 로컬 `next start` |
| 모바일 화면, 시뮬 4G | 56 | 13.2s | 0 | TBT 0ms | 랩 스로틀. CDN 배포 전 수치 |
| INP | 미측정 | | | | navigation 감사에는 상호작용 샘플이 없음 |

Hero는 14MB 원본을 쓰지 않고 1600px / 약 626KB 파생본을 쓴다. 원본 `DSCF0055.jpg`(3000x4000)는 `public/images/DSCF0055_retouch_3000x4000.jpg`와 상위 폴더에 그대로 있다.

## 체크리스트

### 콘텐츠

- [x] placeholder는 사용자 데이터로 교체하지 않았고, 화면과 이 보고서에 입력 전 상태로 표시했다.
- [x] 예식일 2026-08-15 토요일, 달력 강조일도 15일이다.
- [x] 보이는 문구를 다시 읽었다. 과장 광고 문구 없음.
- [x] em dash / en dash 없음.
- [x] 이름, 날짜, 개인정보는 `src/content/wedding.ts`에서만 온다.

### 비주얼

- [x] Hero에는 사진과 텍스트만 있다.
- [x] 360 / 390 / 430에서 인물이 잘리지 않는다.
- [x] Hero 제목 2줄 이하, 이름과 날짜가 읽힌다.
- [x] canvas / surface / ink / olive accent만 사용.
- [x] 섹션 테마가 뒤집히지 않는다.
- [x] radius는 이미지 12px, 버튼 8px.
- [x] 배지, 꽃 SVG, 하트, 섹션 번호, 스크롤 안내 없음.
- [x] 동일한 카드 그리드 반복 없음.

### 갤러리

- [x] Playwright에서 스와이프/키보드 다음이 동작한다.
- [x] Escape로 닫힌다.
- [x] 닫은 뒤 원래 썸네일로 focus가 돌아간다.
- [x] 현재 번호와 닫기 버튼에 접근성 이름이 있다.
- [x] 이미지 로드 실패 시 `SafeImage`가 레이아웃을 유지한다.
- [x] 초기 화면 아래 이미지는 `loading="lazy"`다.

### 기능

- [x] 전화/문자는 번호가 있을 때만 `tel:` / `sms:`로 연결된다. 현재는 비어 있어 버튼을 숨긴다.
- [x] 복사 성공/실패 토스트와 실패 시 선택 가능한 텍스트.
- [x] Web Share 미지원 시 URL 복사.
- [x] 지도 링크는 https만 렌더링. 현재 URL이 없어 버튼을 숨긴다.
- [x] RSVP `enabled: false`라 섹션과 가짜 성공이 없다.
- [x] 복사 실패, 빈 연락처, 빈 지도, 빈 갤러리 대비 상태를 구현했다.

### 접근성

- [x] 버튼/링크 최소 44px. 320px 공유 버튼 높이 확인.
- [x] 본문 ink on canvas는 AA를 넘는다. Lighthouse a11y 100.
- [x] `:focus-visible` outline 유지.
- [x] 사진 alt는 한국어 설명. 장식 이미지 없음.
- [x] `prefers-reduced-motion`에서 Hero zoom/reveal이 꺼진다.
- [x] 320px에서도 기능이 남는다. 200% zoom은 코드상 상대 단위이나 실기기 확대는 미확인.
- [x] 토스트 `aria-live="polite"`.

### 성능

- [x] Hero에 width/height, `priority`, `sizes="100vw"`.
- [x] 모든 이미지에 width/height 또는 aspect-ratio.
- [x] transform/opacity만 애니메이션.
- [x] `window.addEventListener('scroll')` 없음.
- [x] motion/lightbox/toast 타이머에 cleanup이 있다.
- [~] Lighthouse 모바일 90 목표: 스로틀 없는 로컬은 100, 시뮬 4G는 56. 배포 후 재측정 필요.
- [~] LCP < 2.5s: 로컬 0.2s, 시뮬 4G 13.2s. CLS 0. INP는 랩에서 미측정.

### 빌드와 테스트

- [x] lint
- [x] typecheck
- [x] unit/component
- [x] production build
- [x] Playwright mobile E2E
- [x] 360 / 390 / 430 스크린샷 사람 확인
- [~] 실기기 Chrome/Safari 터치는 아직이다. Playwright Chromium 모바일에서 라이트박스 스와이프와 탭을 확인했다.

## 미통과 항목과 이유

1. 실기기 터치 검수 없음. Playwright Pixel 7만 통과.
2. 시뮬 4G Lighthouse Performance 56 / LCP 13.2s. 로컬 이미지 최적화와 랩 스로틀 때문이며, 배포 도메인에서 다시 재야 한다.
3. INP 미측정.
4. 200% 확대는 코드 단위로만 대응했고 실기기 확인은 없다.
5. `DSCF0055_retouch_3000x4000.png` 파일은 디스크에 없었다. 같은 구도의 3000x4000 `아카이브/A cut clear/DSCF0055.jpg`를 복사해 사용했다. 원본은 삭제하지 않았다.

## 사용자 확인이 필요한 개인정보/콘텐츠

`src/content/wedding.ts`만 수정하면 된다.

- 신랑 이름, 신부 이름
- 예식 일시 `startsAt` (지금은 2026-08-15T13:00:00+09:00)
- 예식장 이름, 홀/층, 도로명 주소, 예식장 전화
- 네이버지도 / 카카오맵 / 티맵 https 링크
- 지하철, 버스, 자가용, 주차 안내
- 신랑/신부/혼주 전화번호
- 혼주 성함과 관계
- RSVP를 쓸 경우 `rsvp.enabled`와 외부 폼 URL
- 계좌를 공개할 경우 `accounts.enabled`와 계좌 항목
- 갤러리 05, 07, 11, 12번 alt를 더 구체적으로 다듬을 수 있다
