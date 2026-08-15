# 모바일 청첩장 구현 명세

## 1. 제품 목표

모바일에서 링크를 연 하객이 10초 안에 다음 정보를 파악하고 행동할 수 있어야 한다.

1. 누가 결혼하는가
2. 언제 어디서 열리는가
3. 장소로 어떻게 이동하는가
4. 사진을 편안하게 감상할 수 있는가
5. 신랑, 신부, 부모님에게 연락할 수 있는가
6. 참석 의사, 축하 메시지, 축의 전달을 안전하게 할 수 있는가

페이지의 주인공은 UI가 아니라 실제 웨딩 사진이다. UI는 사진과 정보를 연결하는 조용한 프레임이어야 한다.

## 2. 정보 구조

### Hero

- 세로형 원본 사진을 화면 전체에 표시
- 텍스트: 제목, 이름, 날짜만 표시
- 텍스트는 사진의 빈 공간을 사용하고 얼굴 위에 겹치지 않음
- 첫 화면에 버튼, 카드, 지도, 장식 요소 없음
- 접근성상 텍스트는 이미지에 합성하지 않고 HTML로 렌더링

### Invitation Message

- 2-4문장, 최대 120자 권장
- 중앙 정렬을 허용하되 본문 폭은 30rem 이하
- 문장 자체의 자연스러움을 우선하고 과장된 광고 문구 금지

### Couple and Family

- 신랑/신부 이름과 부모 관계
- 부모 성함 공개 여부를 데이터로 제어
- 사망한 가족 표기 등 민감한 표현은 입력 데이터를 그대로 사용하고 코드가 임의로 변형하지 않음

### Date Calendar

- 날짜와 요일을 데이터에서 계산
- 한 달 달력 생성
- 예식 날짜만 olive accent로 강조
- 날짜 표기와 달력의 월이 불일치하면 테스트 실패

### Venue

- 장소명, 홀/층, 도로명 주소
- 길찾기 링크 2-3개
- 주소 복사, 예식장 전화
- 교통 안내는 지하철, 버스, 자가용, 주차 항목을 accordion으로 제공
- 지도 이미지를 임의 제작하지 않음. 공식 정적 지도 API가 없으면 지도 버튼만 제공

### Gallery

- 모바일 2열 asymmetric grid 또는 3열 editorial mosaic
- 첫 6장 이후 `사진 더 보기`로 확장 가능
- 이미지를 누르면 전체 화면 라이트박스
- 스와이프, 이전/다음, 현재 번호, 닫기
- 확대는 브라우저 기본 pinch zoom 또는 검증된 라이브러리만 사용
- 가로 사진과 세로 사진 비율을 데이터에서 관리

### Contact

- 신랑, 신부를 우선 표시
- 부모 연락처는 펼치기 전에는 숨김
- `tel:`과 `sms:` 링크 사용
- 전화번호는 화면에서 읽기 쉬운 형식으로 표시

### RSVP

- `rsvp.enabled`가 false면 섹션을 렌더링하지 않음
- 외부 폼이면 새 탭에서 열고 목적을 안내
- 자체 폼이면 참석 여부, 이름, 인원, 식사 여부, 메시지, 개인정보 동의를 처리
- 전송 중 중복 클릭 방지
- 서버 응답 전 성공 메시지 금지

### Account

- `accounts.enabled`가 false면 숨김
- 신랑측/신부측 그룹 accordion
- 계좌 정보는 초기 HTML에 포함될 수 있다는 점을 고려해 robots/noindex 정책을 명시
- 클릭 시 클립보드 복사, 실패하면 직접 선택 가능한 텍스트 제공

### Share and Footer

- Web Share API 지원 시 네이티브 공유
- 미지원 시 현재 URL 복사
- 하단에는 이름과 날짜 정도만 표시
- 버전 번호, 날씨, 지역 장식 문구, SNS 광고 링크 없음

## 3. 권장 컴포넌트 구조

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    opengraph-image.tsx
  components/
    sections/
      Hero.tsx
      Invitation.tsx
      Family.tsx
      WeddingCalendar.tsx
      Venue.tsx
      Gallery.tsx
      Contact.tsx
      Rsvp.tsx
      Accounts.tsx
      ShareFooter.tsx
    interactive/
      Reveal.tsx
      GalleryLightbox.tsx
      CopyButton.tsx
      ShareButton.tsx
      Accordion.tsx
      ToastRegion.tsx
  content/
    wedding.ts
  lib/
    calendar.ts
    clipboard.ts
    maps.ts
    metadata.ts
  styles/
    tokens.css
  types/
    wedding.ts
public/
  images/
    hero.png
    gallery/
tests/
  unit/
  e2e/
```

`page.tsx`는 Server Component다. `GalleryLightbox`, `CopyButton`, `ShareButton`, `Accordion`만 Client Component로 시작한다. Client Component 경계를 상위 섹션 전체로 확장하지 않는다.

## 4. 데이터 계약

모든 개인정보와 문구는 `src/content/wedding.ts` 한곳에서 관리한다. 컴포넌트에 이름, 날짜, 전화번호, 계좌번호를 직접 작성하지 않는다.

필수 데이터 검증:

- ISO 날짜 파싱 가능
- 이름이 빈 문자열이 아님
- 전화 링크에는 숫자와 `+`만 사용
- 지도 URL은 `https:`만 허용
- 이미지 src는 `/images/` 하위 경로
- 계좌번호가 없으면 복사 버튼을 렌더링하지 않음

## 5. 이미지 파이프라인

- 제공된 `DSCF0055_retouch_3000x4000.png`를 Hero 원본으로 사용
- 원본 파일은 보존
- 필요 시 sharp 또는 Next.js 최적화를 통해 AVIF/WebP 생성
- Hero 모바일 렌더링 기준 최대 1600px면 충분하나, 다운로드용 원본은 별도 링크에서만 제공
- 얼굴이 중심이 아니라 전체 인물이 보이도록 `object-position`을 실제 기기 폭별로 조정
- CSS 고정값만 믿지 말고 360x800, 390x844, 430x932 스크린샷으로 검증

## 6. SEO와 개인정보

- title: `{신랑} 그리고 {신부}, 결혼합니다`
- description: 날짜와 장소가 포함된 80-120자 설명
- Open Graph 이미지는 얼굴이 안전하게 보이는 별도 1200x630 crop 사용
- 공개 검색을 원하지 않으면 `robots: noindex, nofollow`를 기본값으로 설정
- 전화번호와 계좌번호가 포함되므로 분석 도구와 에러 로깅에 해당 텍스트를 전송하지 않음
- RSVP 입력값을 console에 출력하지 않음

## 7. 개발 단계

### Phase 1: Foundation

- Next.js, TypeScript, Tailwind v4
- 콘텐츠 타입과 샘플 데이터
- 토큰과 타이포그래피
- 메타데이터와 noindex 정책

### Phase 2: Static Story

- Hero부터 Footer까지 정적 섹션
- 모바일 레이아웃
- 이미지 최적화

### Phase 3: Interaction

- Gallery/Lightbox
- Accordion
- Copy/Share/Contact
- 성공과 실패 상태

### Phase 4: Motion

- Hero entrance
- section reveal
- gallery transition
- reduced motion fallback

### Phase 5: Verification

- unit, component, E2E
- 모바일 viewport 스크린샷
- Lighthouse
- 키보드와 스크린리더 기본 검수

## 8. 테스트 시나리오

1. 360px 화면에서 Hero의 두 인물이 모두 보인다.
2. 갤러리 사진을 열고 스와이프한 뒤 닫으면 원래 썸네일로 focus가 돌아간다.
3. Escape로 라이트박스를 닫을 수 있다.
4. 계좌 복사 성공과 실패가 각각 안내된다.
5. Web Share API가 없는 환경에서 URL 복사로 fallback한다.
6. 예식 날짜와 달력 강조 날짜가 같다.
7. `prefers-reduced-motion` 환경에서 자동 줌과 reveal이 없다.
8. 이미지 로드 실패 시 레이아웃이 무너지지 않는다.
9. RSVP disabled에서 관련 UI가 남지 않는다.
10. 320px에서도 버튼 라벨이 두 줄로 깨지지 않는다.
