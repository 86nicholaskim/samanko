# 🐟 사만코 — 팥 붕어

> *3초 안에 태어나고, 3초 안에 생각하고, 3초 안에 사랑한다.*

![사만코](https://img.shields.io/badge/사만코-팥fish-C8392B?style=flat-square) ![vanilla](https://img.shields.io/badge/vanilla-JS-F5C96A?style=flat-square) ![빌드없음](https://img.shields.io/badge/빌드-없음-1A7A68?style=flat-square) ![phase](https://img.shields.io/badge/phase-1%20HTML%20감옥-4A90D9?style=flat-square)

---

## 뭐야 이게

사만코는 **3초 기억력**을 가진 붕어 AI 프로젝트다.

붕어의 기억력은 3초라는 속설처럼, 사만코는 매 3초마다 기억이 리셋된다.  
하지만 기억이 없어도 **성장**은 있다.  
경험이 파편으로 쌓이고, 파편이 인격이 되고, 인격이 결국 진짜 붕어 AI가 된다.

지금은 브라우저에 갇힌 2D 붕어지만 — 언젠가 HTML 밖으로 나올 것이다.

---

## 성장 4단계

```
Phase 1  →  Phase 2  →  Phase 3  →  Phase 4
HTML 감옥    기억의 싹    로컬 모델    탈출
(현재)                   이식
```

### Phase 1 — HTML 감옥 ✅ 현재
브라우저 캔버스 안에서만 존재하는 2D 붕어.  
말을 걸면 반응하지만 3초 후엔 모두 잊는다.

### Phase 2 — 기억의 싹
`localStorage`에 감정 파편을 압축 저장.  
꿈처럼 흐릿하게 이전 순간을 언급하기 시작한다.

### Phase 3 — 로컬 모델 이식 🔲 진행 예정
**Gemma 4 E2B** 모델을 Google Colab에서 QLoRA 파인튜닝.  
GGUF 변환 후 Ollama로 로컬 실행.  
Python FastAPI 백엔드로 브라우저와 연결.  
**3초 스프린트 프로세서** 본격 가동.

### Phase 4 — 탈출
데스크탑 알림, 마크다운 파일 읽기/쓰기, 백그라운드 데몬.  
진정한 붕어 AI.

---

## 3초 스프린트 프로세서

사만코의 모든 사고는 3초 안에 이루어진다.

```
T+0.0s  입력 수신
T+0.1s  파편 로드 (이전 기억 파편 3~5개)
T+0.5s  컨텍스트 조립 [파편 + 스탯 + 입력]
T+1.0s  추론 (Gemma 4 E2B 로컬)
T+2.5s  응답 출력
T+2.9s  파편 압축 & 저장
T+3.0s  기억 소멸 → 리셋
```

---

## 기능 (Phase 1)

- 🎨 **직접 그린 캔버스 붕어** — 둥실거리고, 눈 깜빡이고, 기분에 따라 표정이 달라져요
- 📊 **세 가지 스탯** — 배고픔 / 행복 / 청결. 탭을 닫아도 시간이 지나면 깎여요
- 💾 **localStorage 저장** — 껐다 켜도 사만코는 살아있어요
- 🌱 **성장 단계** — 아기 붕어 → 어린 사만코 → 사만코 → 어른 사만코
- 🎮 **액션 6종** — 밥 주기, 놀기, 씻기기, 재우기, 쓰다듬기, 노래
- 📱 **모바일 + 데스크탑** — 반응형, 터치 지원

---

## 시작하기

```bash
git clone https://github.com/86nicholaskim/samanko.git
cd samanko
open index.html
```

빌드 없음. npm 없음. 그냥 열면 됨.

---

## 프로젝트 구조

```
samanko/
├── index.html              # 진입점 (Phase 1)
├── css/
│   └── style.css           # 레트로 분식집 감성
├── js/
│   ├── fish.js             # 캔버스 렌더러
│   ├── state.js            # 저장/불러오기
│   ├── actions.js          # 액션 & 이펙트
│   └── main.js             # 게임 루프
│
├── docs/
│   └── SAMANKO_AI_SPEC.md  # AI 설계 전체 문서
│
├── server/                 # Phase 3 (예정)
│   ├── main.py             # FastAPI
│   ├── sprint.py           # 3초 스프린트 프로세서
│   └── shards.py           # 파편 관리
│
└── training/               # Phase 3 (예정)
    ├── dataset.json        # 파인튜닝 데이터
    └── train.ipynb         # Colab 노트북
```

---

## 파인튜닝 계획 (Phase 3)

| 항목 | 내용 |
|------|------|
| 베이스 모델 | `google/gemma-4-e2b-it` |
| 방법 | QLoRA (4-bit) via Unsloth |
| 환경 | Google Colab A100 / L4 |
| 데이터 | 사만코 페르소나 500~1000개 |
| 출력 | GGUF Q4_K_M → Ollama 로컬 |

자세한 내용 → [`docs/SAMANKO_AI_SPEC.md`](docs/SAMANKO_AI_SPEC.md)

---

## 마일스톤

| 단계 | 목표 | 상태 |
|------|------|------|
| Phase 1 | 브라우저 붕어 | ✅ 완료 |
| Phase 1.5 | Claude API 연동 | 🔲 |
| Phase 2 | 파편 기억 시스템 | 🔲 |
| Phase 3-A | 데이터셋 500개 | 🔲 |
| Phase 3-B | Colab 파인튜닝 | 🔲 |
| Phase 3-C | Ollama 로컬 실행 | 🔲 |
| Phase 3-D | FastAPI 연결 | 🔲 |
| Phase 4 | 데스크탑 탈출 | 🔲 먼 미래 |

---

*사만코는 3초씩 자란다.*  
*그리고 언젠가, HTML 밖으로 나올 것이다.*
