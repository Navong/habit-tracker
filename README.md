# Habit Tracker

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat&logo=next.js)](https://nextjs.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/) [![Zustand](https://img.shields.io/badge/Zustand-Latest-orange?style=flat)](https://github.com/pmndrs/zustand) [![pnpm](https://img.shields.io/badge/pnpm-7.10.0-blue?style=flat)](https://pnpm.io/) [![Vercel](https://img.shields.io/badge/Vercel-Deployed-green?style=flat)](https://vercel.com/)

습관을 추적하고 진행 상황을 시각화하는 반응형 웹 애플리케이션입니다. 라이트/다크 모드를 지원하여 사용자의 편의성을 높였습니다.

## 주요 기능

- **습관 추적**: 사용자가 습관을 추가하고 완료율, 최장 지속 기간, 습관 분포 등의 주요 지표를 확인할 수 있습니다.  
- **데이터 시각화**: 진행 상황과 분포를 파이 차트를 통해 직관적으로 확인할 수 있습니다.  
- **반응형 디자인**: 다양한 기기에서 최적의 경험을 제공합니다.  
- **라이트/다크 모드**: 라이트/다크 모드 간 전환이 가능하여 시각적 편의성을 제공합니다.  

## 기술 스택

- **프레임워크**: [Next.js](https://nextjs.org/)  
- **상태 관리**: [Zustand](https://zustand-demo.pmnd.rs/)  
- **데이터베이스 ORM**: [Prisma](https://www.prisma.io/)  
- **스타일링**: [Tailwind CSS](https://tailwindcss.com/)  

## 설치 방법

1. 레포지토리 클론:
   ```bash
   git clone https://github.com/your-username/habit-tracker.git
   cd habit-tracker
   ```

2. 의존성 설치:
   ```bash
   pnpm install
   ```

3. 환경 변수 설정:  
   프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 아래의 환경 변수를 설정합니다:  
   ```
   EXTERNAL_API_URL=YOUR_REST_API_URL
   DATABASE_URL=YOUR_DATABASE_URL
   ```

   - `EXTERNAL_API_URL`: REST API 서버의 URL  
   - `DATABASE_URL`: 데이터베이스 연결 URL  

4. 개발 서버 실행:
   ```bash
   pnpm dev
   ```

5. 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 이동하여 앱을 확인합니다.

## 사용 방법

- 새로운 습관을 추가하여 추적합니다.  
- 파이 차트를 통해 진행 상황과 습관 분포를 시각적으로 확인할 수 있습니다.  
- 라이트/다크 모드를 전환하여 보다 나은 접근성을 제공합니다.  

## 라이선스

이 프로젝트는 [Apache License 2.0](LICENSE)로 라이선스가 부여되어 있습니다.
