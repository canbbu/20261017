# QA Report

검수 일시: 2026-10-25
Git commit: 커밋하지 않은 로컬 작업
테스트 환경: Windows, Node.js, Next.js 15.5.23, 로컬 `next dev` http://localhost:3001, Cursor 브라우저

## 명령별 결과

| 명령 | 결과 |
|---|---|
| `npm run lint` | 성공. 경고 없음 |
| `npm run typecheck` | 성공 |
| `npm run test` | 성공. 77건. 이후 제목 줄바꿈 확인으로 lottery, thanks-view 8건 다시 성공 |
| `npm run build` | 성공. `/`, `/mom`, `/gift`, `/edit`는 동적 렌더 |
| Playwright | 이 저장소에 Playwright 설정 파일이 없어 실행하지 못함 |
| 브라우저 확인 | `/`, `/mom`, `/gift`에 감사 문구, 제목, 추첨까지 남은 시간이 보임. 초대장 내용과 `/edit` 링크는 없음. `/edit`는 비밀번호가 연결되지 않았다는 안내만 보임. 남은 시간은 초 단위로 바뀜 |

## Viewport별 screenshot 경로

360, 390, 430에서 제목 `2026`와 `ハロウィーンジャンボおみくじ`가 각각 한 줄로 읽힌다. 이 화면에는 사진이 없다.

- `docs/screenshots/thanks-360x800.png`
- `docs/screenshots/thanks-390x844.png`
- `docs/screenshots/thanks-430x932.png`

## Lighthouse 수치

이번 검수에서 Lighthouse를 실행하지 못했다. 저장소에 Lighthouse 설정이 없고, 이전 점수는 초대장 페이지 기준이라 이 화면에 쓰지 않는다.

## 체크리스트

하객 주소는 청첩장 대신 감사와 할로윈 점보만 보여 준다. 갤러리, 전화, 계좌, 지도, 참석 의사는 이 주소에 없다.

### 콘텐츠

- [x] 감사 문구와 복권 제목은 `src/content/wedding.ts`에 있다.
- [x] 추첨 시각은 2026-10-26 12:00 KST다. 화면의 남은 시간이 그 시각과 맞다.
- [x] 보이는 문구를 다시 읽었다.
- [x] em dash / en dash 없음.
- [x] 하객이 보는 문구는 `wedding.ts`에서 온다. 당첨번호는 저장값이며 코드에 적어 두지 않았다.

### 비주얼

- [x] 이 화면에는 Hero 사진이 없다. 사진 위 장식도 없다.
- [x] 360 / 390 / 430에서 제목이 잘려 읽히지 않는 상태는 아니다. 인물 사진은 이 화면에 없다.
- [x] 제목은 연도와 복권 이름이 각각 한 줄이다.
- [x] canvas / surface / ink / olive accent만 사용.
- [x] 섹션 테마가 뒤집히지 않는다.
- [x] 입력칸과 버튼 radius는 8px.
- [x] 배지, 꽃 SVG, 하트, 섹션 번호, 스크롤 안내 없음.
- [x] 카드 그리드 없음.

### 갤러리

- [ ] 해당 없음. 하객 주소에서 갤러리를 빼기로 했다.

### 기능

- [ ] 해당 없음. 전화, 계좌, 공유, 지도, 참석 의사는 이 주소에 없다.
- [x] 번호가 저장되기 전에는 추첨 시각 전 남은 시간, 추첨 시각 후 「준비중입니다」.
- [x] 자릿수가 틀린 번호는 저장하지 않도록 검증한다. 단위 테스트로 확인.
- [x] `/edit`는 비밀번호가 없으면 저장 화면을 열지 않는다. 현재 환경은 비밀번호 미연결 안내가 보인다.

### 접근성

- [x] `/edit`의 비밀번호 입력과 버튼은 44px 이상. 지금 환경에서는 안내 문구만 보인다.
- [x] 본문은 ink, 상금은 accent-strong, 바탕은 canvas.
- [x] 기존 `focus-visible` outline을 유지.
- [x] 이 화면에는 내용 이미지가 없다.
- [x] 남은 시간 숫자는 움직이지 않고 값만 바뀐다. `Reveal`은 reduced motion에서 애니메이션을 끈다.
- [ ] 200% 확대는 이번 브라우저 확인에서 보지 못했다.
- [ ] 복사 토스트는 이 화면에 없다.

### 성능

- [x] 이 화면에는 Hero 이미지가 없다.
- [x] 내용 이미지가 없다.
- [x] layout 속성을 애니메이션하지 않는다.
- [x] `window.addEventListener('scroll')` 없음.
- [x] 남은 시간 interval은 cleanup한다.
- [ ] Lighthouse 미실행.

### 빌드와 테스트

- [x] lint 성공
- [x] typecheck 성공
- [x] unit test 성공
- [x] production build 성공
- [x] 360, 390, 430 screenshot 저장
- [ ] Playwright 터치 시나리오는 설정 파일이 없어 실행하지 못함. 브라우저에서 하객 주소 세 곳과 `/edit`를 열었다.

## 사용자 확인이 필요한 것

당첨번호를 저장하려면 이 사이트의 Supabase에 `supabase/lottery.sql`을 적용하고, 서버 환경변수 `LOTTERY_EDIT_PASSWORD`(8자 이상)와 `SUPABASE_SERVICE_ROLE_KEY`를 넣어야 한다. 지금은 `/edit`에 비밀번호 연결 안내만 나온다. 하객 주소에는 번호 입력칸이 없다.
