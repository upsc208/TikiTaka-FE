## 🎟️ TikiTaka

##### Ticket Management System v0.0.2

## 목차
- [프로젝트 소개](👨‍🏫-프로젝트-소개)
- [개발기간 및 작업 관리](⏲️-개발기간-및-작업-관리)
- [개발 환경](⚙️-개발-환경)
- [프로젝트 주요 기능](⭐-프로젝트-주요-기능)
- [프로젝트 구조](🔨-프로젝트-구조)
- [아키텍쳐](🔧-프로젝트-아키텍쳐)
- [프로젝트 회고](📝-프로젝트-회고)
- [팀원 소개](🧑‍🤝‍🧑-팀원-소개)

## 👨‍🏫 프로젝트 소개
- [프로젝트 개요](https://nova-sheep-66e.notion.site/174c54f24ef58020a5ece8827063e5af)

## ⏲️ 개발기간 및 작업 관리
#### 개발 기간

- 전체 개발 기간 : 2025-01-20 ~ 
- UI 구현 : 2025-01-20 ~ 2025-02-05
- 기능 구현 : 2025-02-05 ~ 2025-02-07
- QA 및 테스트 : 2025-02-07 ~ 2025-02-19

#### 작업 관리

- GitHub Issues와 Jira를 사용하여 진행 상황을 공유했습니다.
- 데일리스크럼을 통해 작업 순서와 방향성, 컴포넌트 관리, 프로젝트에 대한 고민을 나누었습니다.
- Discord를 통해 Github PR 코드리뷰 및 승인 요청과 머지 완료 여부를 공유했습니다.

## ⚙️ 개발 환경

### Frontend Stack
- React 18
- typescript 5.7.3
- tailwindcss 3.4.17
- zustand 5.0.3
- TanStack Query v5
- axios 1.7.9
- npm 10.9.1
- ESLint 8.57.1
- Prettier 3.4.2

### Node.js 버전
- Node.js 버전: v20.12.0

### 패키지 매니저
- 사용된 패키지 매니저: npm

## 환경 변수

프로젝트 실행을 위해 다음 환경 변수를 설정해야 합니다:

1. `.env` 파일을 프로젝트 루트 디렉토리에 생성하고 아래와 같이 설정합니다:

```env
MODE=development
PORT=3000
REACT_APP_BASE_URL=https://tikitaka.kr

#### 작업 관리 툴

- 버전 및 이슈관리 : Jira, Github Issues
- 협업 툴 : Discord, Notion, Jira
- 서비스 배포 환경 : https://www.tikitaka.kr
- 디자인 : [Figma](https://www.figma.com/file/fAisC2pEKzxTOzet9CfqML/README(oh-my-code)?node-id=39%3A1814)
- [코드 컨벤션](https://www.notion.so/Code-Convention-181c54f24ef5802ebc2bc1e416439384)
- [기술 선정 배경](https://nova-sheep-66e.notion.site/ff35997f14984273b7ada28eb04ca520?pvs=73)


## ⭐ 프로젝트 주요 기능

- **담당자 티켓 대시보드** : 담당자는 티켓을 상태별, 담당자별, 카테고리별, 유형별로 대시보드에서 조회 가능
![image](https://github.com/user-attachments/assets/309da5da-54e4-4380-aba8-fad40cde61af)
<br/>

- **담당자 티켓 관리** : 담당자는 본인 티켓을 관리 가능
![image](https://github.com/user-attachments/assets/c00d05eb-f094-49dc-bbc7-f8f4af8e1ebf)
<br/>

- **담당자 통계 관리** : 담당자는 일별 / 월별로 티켓 통계 조회 가능
![image](https://github.com/user-attachments/assets/28aefd53-155b-4398-9718-ec7b44dd0773)
<br/>

- **사용자 티켓 대시보드** : 사용자는 본인이 생성한 티켓을 상태별, 담당자별, 카테고리별, 유형별로 대시보드에서 조회 가능
![image](https://github.com/user-attachments/assets/bcb5d399-8276-4fcc-b379-d7e8835e6950)
<br/>

- **티켓 생성** : 사용자는 본인이 작성한 템플릿을 불러와 티켓을 생성 가능
![image](https://github.com/user-attachments/assets/d11b8e02-a41f-4d2c-bb33-0bbfd7ebd77b)
<br/>

- **관리자 계정 관리** : 관리자는 계정 등록 신청을 승인/거절 가능하고 등록된 유저 목록 조회 가능
![image](https://github.com/user-attachments/assets/ea670cca-9f5d-4137-8934-01bf3190e565)
<br/>

- **관리자 카테고리 관리** : 관리자는 카테고리를 생성/수정/삭제 가능하고 카테고리별 요청 양식을 생성/수정/삭제 가능
![image](https://github.com/user-attachments/assets/8eedb150-3776-475e-b362-e44c2f1a75a8)
<br/>

- **관리자 문의/요청 관리** : 관리자는 사용자들의 문의 및 요청 사항에 답변을 등록하고 관리 가능
![image](https://github.com/user-attachments/assets/23e4ccb2-1159-4275-902b-b8371a040a88)
<br/>




## 🔧 프로젝트 아키텍쳐 
<img width="926" alt="아키텍처" src="https://github.com/user-attachments/assets/f2fbfcc3-fe2c-4340-b45b-2571c5f3e634" />

## 📝 프로젝트 회고 
- [프로젝트 회고록](https://www.notion.so/19ec54f24ef580aebdc2e9662d03c436)
- 
## 👥 팀원 소개

|                                        Backend / PM                                        |                                        Backend / PL                                        |                                   Backend / Infrastructure                                   |                                      Backend                                      |                                      Backend                                      |
|:------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------:|:------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------:|
| <img src="https://avatars.githubusercontent.com/u/127392025?v=4" width=200px alt="임호준"/> | <img src="https://avatars.githubusercontent.com/u/76063864?v=4" width=200px alt="이동석"/> | <img src="https://avatars.githubusercontent.com/u/162435572?v=4" width=200px alt="장해준"/> | <img src="https://avatars.githubusercontent.com/u/104374987?v=4" width=200px alt="김기훈"/> | <img src="https://avatars.githubusercontent.com/u/144196895?v=4" width=200px alt="강민재"/> |
|           [@Hojun-IM](https://github.com/Hojun-IM)           |           [@DaveLee-b](https://github.com/DaveLee-b)           |           [@HaejunJang](https://github.com/HaejunJang)           |           [@upsc208](https://github.com/upsc208)           |           [@Kangai1](https://github.com/Kangai1)           |
|                                       임호준 (PM)                                        |                                        이동석 (PL)                                         |                                     장해준 (인프라)                                      |                                      김기훈                                      |                                      강민재                                      |

|                                       Frontend / PL                                       |                                   Frontend / 디자인                                    |                                      Frontend                                      |
|:----------------------------------------------------------------------------------------:|:-----------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------:|
| <img src="https://avatars.githubusercontent.com/u/115445005?v=4" width=200px alt="김규리"/> | <img src="https://avatars.githubusercontent.com/u/120254101?v=4" width=200px alt="곽서연"/> | <img src="https://avatars.githubusercontent.com/u/91466601?v=4" width=200px alt="김낙도"/> |
|           [@lamiiiii](https://github.com/lamiiiii)           |           [@yeonilil](https://github.com/yeonilil)           |           [@NAKDO](https://github.com/NAKDO)           |
|                                       김규리 (PL)                                       |                                       곽서연 (디자인)                                        |                                      김낙도                                      |
