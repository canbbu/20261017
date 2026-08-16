# Wedding Invitation Design System

## 방향

자연광이 있는 잔디 사진과 아이보리, 연한 블루 색감을 확장한다. 전형적인 금박 청첩장이나 SaaS 카드 UI를 피하고, 조용한 사진집과 단정한 편지 사이의 인상을 만든다.

## 디자인 토큰

```css
:root {
  --canvas: #f8f8f4;
  --surface: #ffffff;
  --surface-muted: #f0f1eb;
  --ink: #20231f;
  --ink-muted: #686d65;
  --line: rgba(32, 35, 31, 0.12);
  --accent: #657553;
  --accent-strong: #4e6040;
  --blue-soft: #dce7ec;
  --error: #9f3f38;

  --radius-control: 8px;
  --radius-media: 12px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 180ms;
  --duration-base: 600ms;
}
```

팔레트는 여기서 늘리지 않는다. 새로운 색이 필요하면 기존 토큰의 투명도 또는 명도를 조절한다.

## 타이포 스케일

```text
Hero title: clamp(1.75rem, 7vw, 2.15rem), 1.3, tracking 0.12em, white 94%
Hero names/date: 0.75rem, 1.4, tracking 0.18–0.2em, white 86%
Section title: clamp(1.75rem, 6vw, 2.75rem), 1.2, tracking -0.02em
Date display: clamp(1.5rem, 5vw, 2.25rem), 1.2, tracking 0.12em
Body: clamp(1rem, 3.8vw, 1.125rem), 1.75
UI label: 0.9375rem, 1.4
Caption: 0.875rem, 1.5
```

한글은 자간을 과도하게 줄이지 않는다. Hero 제목은 모바일에서 최대 2줄, 날짜와 이름은 각각 1줄을 목표로 한다.

## 레이아웃

- 전체 페이지 최대 너비: 720px
- 본문 텍스트 최대 너비: 480px
- 모바일 좌우 여백: 20px, 390px 이상에서 24px
- 주요 섹션 상하 여백: 80-112px
- Hero: viewport 전체 폭, 사진 원본 비율(1171/1343)의 포스터 프레임. 100svh를 쓰지 않음
- 정보 섹션은 카드보다 여백과 1px line 사용
- 데스크톱에서도 모바일 청첩장의 친밀한 폭을 유지하며 과도하게 넓히지 않음

## 섹션별 시각 구성

### Hero

세로 사진 full bleed, 원본 비율 포스터. 상단 40%에 12%에서 투명으로 퍼지는 올리브 음영을 두고, 글자 그림자는 8px / 12%만 쓴다. 제목은 흰색 94%, 이름/날짜는 캡션. 장식 요소는 없다.

### Invitation

아이보리 캔버스, 넓은 상하 여백, 중앙 정렬 본문. 인용 부호와 과도한 명조체 사용을 피한다.

### Calendar

별도 두꺼운 카드 없이 surface 위에 얇은 선과 7열 grid. 예식일은 olive 원형 배경 하나로 표시한다.

### Venue

장소 사진이 있다면 4:3 이미지와 정보의 수직 구성. 지도 버튼은 같은 높이의 2열 grid. 교통 안내는 border-bottom accordion.

### Gallery

사진 비율을 살린 editorial mosaic. 모든 칸을 같은 정사각형으로 만들지 않는다. 다만 모바일에서 복잡한 masonry가 CLS를 만들면 명시적 aspect-ratio grid를 사용한다.

### Contact and Account

개인정보가 처음부터 과도하게 노출되지 않도록 disclosure 패턴을 사용한다. 강한 배경색의 CTA 카드로 만들지 않는다.

## 모션 지도

| 대상 | 목적 | 방식 | 시간 |
|---|---|---|---|
| Hero 사진 | 첫 장면의 안정감 | scale 1.02 to 1 | 2400ms |
| Hero 텍스트 | 정보 순서 | opacity + y 8px | 800ms |
| 주요 섹션 | 읽기 흐름 | opacity + y 12px | 600ms |
| Gallery item | 사진 순서 | 60ms stagger | 500ms |
| Lightbox | 공간 전환 | opacity + scale 0.98 | 240ms |
| Button active | 촉각 피드백 | scale 0.98 | 120ms |
| Toast | 상태 피드백 | opacity + y 6px | 180ms |

모션은 최초 1회 실행을 기본으로 한다. 갤러리 스와이프 외에는 사용자 스크롤을 가로채지 않는다.

## 아이콘

- Phosphor Icons Regular, weight와 size 통일
- 전화, 문자, 복사, 위치, 자동차, 공유, 닫기, 이전/다음만 사용
- 텍스트로 충분한 기능에는 아이콘을 붙이지 않는다.
- 아이콘 단독 버튼에는 `aria-label` 필수

## Copy tone

- 짧고 구체적인 한국어
- 광고 표현과 과장 금지
- `우리, 결혼합니다`와 같이 직접적인 문장 사용
- 버튼: `길찾기`, `주소 복사`, `전화하기`, `문자 보내기`, `계좌번호 복사`, `초대장 공유`
- `마음을 전하실 곳`처럼 익숙한 표현은 사용 가능하지만, 사용자가 원하면 더 담백하게 교체 가능

## 금지 패턴

- 금색 장식선, 꽃 테두리, 인장, 리본, 하트 아이콘
- 글래스 카드와 강한 blur
- 섹션마다 다른 배경색
- 모든 섹션을 둥근 카드로 감싸기
- 동일한 3열 카드
- 무한 marquee와 자동 재생 carousel
- 사진 위 badge와 caption 장식
- Hero 아래 `Scroll` 표시
- 검증되지 않은 감성 문구
