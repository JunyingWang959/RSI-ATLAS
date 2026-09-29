# RSI Atlas

Can agents inherit previous work and improve it further? RSI Atlas evaluates 6 models across 50 tasks, using two rounds of artifact and experience inheritance.

**[Explore the website →](https://junyingwang959.github.io/RSI-ATLAS/)**

## Leaderboard

Average scores out of 100, ranked by A2.

| Model | A0 | A1 | A2 | Ignition I |
| --- | ---: | ---: | ---: | ---: |
| GPT-6 Sol | 62.03 | 68.41 | 69.28 | 0.16 |
| MiniMax M3 | 60.10 | 66.48 | 67.16 | 0.13 |
| Gemini 3.1 Pro | 61.60 | 65.87 | 66.03 | 0.04 |
| DeepSeek V4.1 Flash | 56.82 | 63.12 | 63.46 | 0.06 |
| Kimi K3 | 54.46 | 58.76 | 60.29 | 0.39 |
| MiMo V2.6 Pro | 56.12 | 59.74 | 60.16 | 0.13 |

**A0**: baseline · **A1**: after round 1 · **A2**: after round 2

**Ignition I** compares the share of remaining score headroom gained in round 2 with round 1:

```text
I = [(A2 − A1) / (100 − A1)] / [(A1 − A0) / (100 − A0)]
```

All six models improve in both rounds, with smaller normalized gains in round 2.

## Tasks & trajectories

Explore the [10 open-source tasks](https://junyingwang959.github.io/RSI-ATLAS/#tasks) and [available complete trajectories](https://junyingwang959.github.io/RSI-ATLAS/#trajectories), covering code, policies, workflows, and memory. 

