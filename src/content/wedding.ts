export type Person = {
  name: string;
  phone?: string;
  parents: Array<{
    relation: string;
    name: string;
    phone?: string;
  }>;
};

export type GalleryImage = {
  src: `/images/${string}`;
  alt: string;
  width: number;
  height: number;
  featured?: boolean;
};

export type Account = {
  side: "groom" | "bride";
  holder: string;
  bank: string;
  number: string;
  relation: string;
};

export const wedding = {
  couple: {
    groom: {
      name: "신랑",
      phone: "",
      parents: [] as Person["parents"],
    } satisfies Person,
    bride: {
      name: "신부",
      phone: "",
      parents: [] as Person["parents"],
    } satisfies Person,
  },

  event: {
    // TODO: 실제 예식 일시를 ISO 8601 형식으로 입력하세요.
    startsAt: "2026-08-15T13:00:00+09:00",
    timezone: "Asia/Seoul",
    venueName: "예식장 이름",
    hall: "홀과 층",
    address: "도로명 주소",
    phone: "",
    mapLinks: {
      naver: "",
      kakao: "",
      tmap: "",
    },
    transportation: {
      subway: "",
      bus: "",
      car: "",
      parking: "",
    },
  },

  copy: {
    heroTitle: "우리, 결혼합니다",
    invitation:
      "서로를 바라보던 평범한 날들이 모여, 이제 같은 방향으로 걸어가려 합니다. 저희의 새로운 시작을 함께해 주세요.",
  },

  hero: {
    // 웹용 파생본. 원본 3000x4000은 originals/DSCF0055_retouch_3000x4000.jpg
    src: "/images/hero.jpg" as const,
    alt: "푸른 잔디밭에 나란히 앉아 서로를 바라보는 신랑과 신부",
    width: 1086,
    height: 1448,
    objectPositionMobile: "50% 50%",
    objectPositionDesktop: "50% 42%",
  },

  gallery: [
    {
      src: "/images/gallery/DSCF0007.jpg",
      alt: "공원 벤치에 앉아 신부의 머리를 쓸어 올리는 신랑",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0033.jpg",
      alt: "공원 벤치에서 웃고 있는 신랑과 신부",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0047.jpg",
      alt: "잔디밭에 앉아 도쿄타워를 배경으로 마주 보는 두 사람",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0059.jpg",
      alt: "잔디밭에 앉아 서로를 바라보며 웃는 신랑과 신부",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0091.jpg",
      alt: "햇살 아래 눈을 감고 가까이 서 있는 두 사람",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0096.jpg",
      alt: "나무 그늘에서 웃고 있는 신랑과 곁의 신부",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0107.jpg",
      alt: "베일 아래에서 서로를 안고 있는 두 사람",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0154.jpg",
      alt: "도쿄타워를 배경으로 눈을 감고 서 있는 신랑과 신부",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0160.jpg",
      alt: "공원 연못 앞에서 마주 보는 신랑과 신부",
      width: 1600,
      height: 1200,
      featured: true,
    },
    {
      src: "/images/gallery/DSCF0170.jpg",
      alt: "도쿄타워 앞에서 손을 잡고 걷는 두 사람",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0178.jpg",
      alt: "횡단보도를 건너며 베일을 들고 가는 신랑과 신부",
      width: 1600,
      height: 1200,
    },
    {
      src: "/images/gallery/DSCF0185.jpg",
      alt: "도쿄타워와 거리를 배경으로 걸어오는 두 사람",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0210.jpg",
      alt: "거리에서 아이스크림을 나눠 먹는 신랑과 신부",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0264.jpg",
      alt: "나무 아래 난간에 기대어 눈을 감은 두 사람",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0267.jpg",
      alt: "꽃다발을 사이에 두고 가까이 있는 신랑과 신부",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0332.jpg",
      alt: "밤 석조 건물 앞에서 가까이 서 있는 정장 차림의 두 사람",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0362.jpg",
      alt: "밤 건물 앞에서 마주 보는 신랑과 신부",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0395.jpg",
      alt: "오래된 문 앞 계단에 앉아 부케를 내려다보는 두 사람",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0428.jpg",
      alt: "밤 석조 건물 앞에서 손을 잡고 서 있는 두 사람",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0661.jpg",
      alt: "돌계단에 앉아 서로를 바라보는 신랑과 신부",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0838.jpg",
      alt: "도쿄역을 배경으로 키스하는 두 사람",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0854.jpg",
      alt: "밤 도쿄역 앞에서 키스하는 신랑과 신부",
      width: 1600,
      height: 1200,
      featured: true,
    },
    {
      src: "/images/gallery/DSCF0922.jpg",
      alt: "도쿄역 앞에서 프로포즈하는 두 사람",
      width: 1200,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF0927.jpg",
      alt: "도쿄역 앞에서 무릎을 꿇고 프로포즈하는 신랑",
      width: 1600,
      height: 1200,
      featured: true,
    },
    {
      src: "/images/gallery/DSCF2019.jpg",
      alt: "공원에서 부케를 들고 앉아 있는 신부와 곁의 신랑",
      width: 1067,
      height: 1600,
    },
    {
      src: "/images/gallery/DSCF2209.jpg",
      alt: "도쿄타워 앞 횡단보도를 건너며 뒤돌아보는 신부",
      width: 1600,
      height: 1067,
    },
    {
      src: "/images/gallery/DSCF2311.jpg",
      alt: "반지를 보이며 웃고 있는 신랑과 신부",
      width: 1600,
      height: 1067,
    },
  ] as GalleryImage[],

  rsvp: {
    enabled: false,
    externalFormUrl: "",
  },

  accounts: {
    enabled: false,
    items: [] as Account[],
  },

  privacy: {
    noIndex: true,
  },
} as const;

export type WeddingContent = typeof wedding;
