# MODU (모두)

어려운 공모주 정보를 쉽게 풀어주는 초보 투자자를 위한 공모주 분석 및 기록 앱입니다.

---

## 주요 기능

- **공모주 상세 정보** - 핵심지표 신호등, 세부 정보, 재무 데이터 그래프, 기업 분석 확인
- **청약 이력** - 과거 및 현재 청약 내역 추가/수정/삭제 및 완료 처리
- **투자 성향 테스트** - 투자 성향 분석 및 결과 확인

---

## 기술 스택

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logoColor=white)
![EAS Build](https://img.shields.io/badge/EAS_Build-000020?style=for-the-badge&logo=expo&logoColor=white)

---

## 폴더 구조

```
gongmodufe/
├── app/                        # Expo Router 기반 라우팅
│   ├── _components/            # 앱 전역 공통 컴포넌트
│   │   └── TabBarIcon/         # 탭 바 아이콘
│   ├── (auth)/                 # 인증 관련 화면 (로그인, 회원가입)
│   ├── (tabs)/                 # 하단 탭 네비게이터
│   │   ├── favorites/          # 관심 공모주
│   │   ├── history/            # 청약 이력
│   │   ├── home/               # 홈
│   │   ├── mypage/             # 마이페이지
│   │   │   └── investment-retest/  # 투자 성향 재검사
│   │   └── schedule/           # 청약 일정
│   ├── ipo/                    # 공모주 상세
│   │   └── [id].tsx            # 동적 라우트
│   ├── _layout.tsx             # 루트 레이아웃
│   ├── modal.tsx               # 공통 모달
│   └── onboarding.tsx          # 온보딩
├── assets/
│   └── images/                 # 이미지 및 SVG 에셋
├── lib/
│   ├── api/                    # API 호출 함수
│   ├── axios.ts                # Axios 인스턴스 및 인터셉터
│   ├── investmentResultStore.ts # 투자 성향 결과 상태
│   ├── personalImage.ts        # 페르소나 이미지 매핑
│   ├── queryClient.ts          # TanStack Query 클라이언트
│   ├── queryKeys.ts            # 쿼리 키 관리
│   └── tokenStore.ts           # 액세스 토큰 관리
├── styles/                     # 디자인 토큰 (colors, spacing, typography)
└── types/                      # 공통 타입 정의
```
