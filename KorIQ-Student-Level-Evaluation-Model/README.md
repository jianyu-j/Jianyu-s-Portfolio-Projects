# KorIQ Student Level Evaluation Model

**Status: in progress. Research phase, not a shipped model.**

> Estimating a tennis player's NTRP level from match video, using ball trajectory and player pose instead of a coach's judgement. This is the modelling half of the [KorIQ Tennis Platform](../KorIQ-Tennis-Platform); it is kept as a separate project because the interesting work here is feature design and honest validation, not application code. The intended endpoint is an automated first-pass rating inside the platform, sitting alongside (not replacing) coach evaluations.

---

## The problem

KorIQ's evaluation engine works because a certified coach sits down and scores a student on twenty-odd criteria. That is accurate and it does not scale. A player with no club, no coach, and a phone on a fence post has no way into the system.

So the question is narrow and testable: **given a few minutes of match footage, can a model recover the players' skill tier without a human in the loop?**

NTRP has three practical bands for this purpose:

| Tier | NTRP | What it looks like |
|---|---|---|
| Beginner | 2.0 to 2.5 | Rallies break down quickly, ball placement is incidental, pace is uniform |
| Intermediate | 3.0 to 3.5 | Rallies sustain, some directional intent, inconsistent under pace |
| Advanced | 4.0 to 5.0 | Deliberate pace and spin variation, court coverage, constructed points |

The bet is that these differences show up in the *geometry and rhythm of the ball*, not just in the strokes. A beginner rally and a 4.5 rally trace visibly different shapes.

---

## Pipeline

```
YouTube match footage
  └─ yt-dlp                     acquisition (19 matches, NTRP 2.0 to 5.0)
  └─ ffmpeg                     normalise to 1280x720, 30 fps, letterboxed, trimmed
  └─ TrackNet V3                per-frame ball position + visibility  →  *_ball.csv
  └─ MediaPipe Pose             33 landmarks per player per frame     →  *_pose.csv
  └─ feature extraction         10-second windows, 15 camera-invariant features
  └─ LeaveOneGroupOut CV        window-level and video-level metrics vs. dummy baselines
```

Everything runs on Kaggle with a T4. The notebook is written to be resumable: every stage checks for existing output and skips work already done, and the tracking cells watch the 12-hour session clock and stop cleanly before they get killed. TrackNet inference alone is roughly 15 hours of GPU time across the corpus, so this mattered more than it should have.

**Corpus:** 19 matches, 7 beginner / 6 intermediate / 6 advanced. Mixed-level matches are labelled by the lower-rated player.

---

## The finding so far: the first model learned the camera, not the tennis

This is the part of the project worth reading.

The first feature set (v1, 30 features) used absolute pixel positions, pixel-scale speeds and accelerations, and fixed thresholds. Under a random train/test split it looked fine. Under **leave-one-video-out**, where every fold tests on footage the model has never seen, it collapsed:

| Model (v1 features, 6 videos, hold out one video per fold) | Accuracy | Cohen's kappa |
|---|---|---|
| RandomForest | 0.027 | -0.536 |
| XGBoost | 0.099 | -0.380 |
| LightGBM | 0.088 | -0.400 |

Chance is 0.33 for three classes. These are not "weak" results, they are *worse than guessing*, with strongly negative kappa. Both intermediate videos scored exactly 0.000.

That pattern is diagnostic rather than disappointing. A model that merely overfits lands near chance out of sample. A model that lands reliably *below* chance has learned something real and systematically wrong: each video occupies its own cluster in feature space, driven by camera angle, court colour, zoom level and frame rate, and the held-out video gets mapped to whichever training video is nearest in that space, which usually belongs to a different tier. The features encoded venue identity, and tier was correlated with venue in the training set only.

A random split would never have shown this. It is the reason the evaluation protocol is grouped by video from here on.

### What changed as a result

**Every feature was rebuilt to be camera-invariant.** No absolute coordinates, no pixel-scale magnitudes, no fixed thresholds. Each 10-second window is centred on its own mean and divided by its own spatial standard deviation before anything is computed, so what survives is trajectory *shape* rather than trajectory *position*. The 15 features are all unitless:

| Group | Features |
|---|---|
| Speed shape | coefficient of variation, histogram entropy, lag-1 autocorrelation, IQR ratio |
| Acceleration shape | acceleration CV, mean absolute jerk normalised by mean speed |
| Turning and direction | direction persistence (mean cosine of turn angle), sharp-turn rate, turn-angle entropy, direction entropy, mean absolute turn |
| Spatial shape (PCA) | PC1 variance share, anisotropy, PC balance, PC1 reversal rate |

Glitch handling is adaptive too: steps above the 97th percentile within each window are dropped, rather than filtered against a hard pixel threshold that would mean different things at different zoom levels.

**Court homography was attempted and abandoned on purpose.** Hough-line court detection succeeded on only 2 of 6 videos, and unreliable homography would have introduced a new source of per-video variance. Making the features not need a court frame was the cheaper and more robust fix.

**The evaluation protocol was rebuilt around falsification.** `LeaveOneGroupOut` grouped by video, `DummyClassifier` baselines (stratified and most-frequent) reported alongside every real model, window-level metrics (accuracy, macro-F1, Cohen's kappa) plus video-level aggregation by both majority vote and mean predicted probability, and out-of-fold predictions written to CSV so any claim can be audited. The notebook prints an explicit warning when lift over the best dummy is under 5 percentage points.

A second experiment drops the intermediate tier entirely and tests **beginner versus advanced** as a binary problem. If the features cannot separate the two ends of the ladder, they cannot separate the middle, and there is no point tuning further.

---

## Results (v2 features, 19 videos)

<!-- TODO: fill in from the current run before publishing -->

| Model | Window acc | Kappa | Macro-F1 | Video acc (majority) | Video acc (mean prob) |
|---|---|---|---|---|---|
| Dummy (stratified) | | | | | |
| Dummy (most frequent) | | | | | |
| RandomForest | | | | | |
| XGBoost | | | | | |
| LightGBM | | | | | |

Binary (beginner vs. advanced):

| Model | Window acc | Kappa | F1 | Video acc |
|---|---|---|---|---|
| Dummy (stratified) | | | | |
| RandomForest | | | | |
| XGBoost | | | | |
| LightGBM | | | | |

*This section will be filled in with the current run and will report whatever it reports. If the rebuilt features still do not clear the dummy baselines, that result gets published here as it stands.*

---

## Honest caveats

- **Labels are weak.** NTRP levels come from the video uploader's own description, not from a verified rating. They are self-reported and probably optimistic.
- **Labels are match-level, not player-level.** A single tier is assigned per video, and mixed-level matches take the lower player's rating. The ball trajectory is a joint product of both players, so the model currently cannot attribute skill to an individual. This is the largest structural limitation and it is not solvable by tuning.
- **Pose data is extracted but unused.** MediaPipe landmarks for both players are computed and saved for all videos, and the current feature set draws on ball tracking only. Pose-derived features (preparation time, recovery to centre, split-step timing, stroke mechanics) are the next build, and they are the natural route to per-player attribution.
- **Player separation is naive.** Pose extraction splits the frame into top and bottom halves to separate far and near player. This works for a fixed baseline camera and breaks for anything else.
- **N is small.** 19 videos is not enough to be confident about anything, and leave-one-video-out on 19 groups is a high-variance estimator. Corpus size is the binding constraint.
- **Selection bias in the corpus.** Match footage that gets uploaded to YouTube with a stated NTRP level is not a random sample of tennis at that level.

---

## Repository

```
notebooks/tennis-evaluation.ipynb   Full pipeline, resumable across Kaggle sessions
  Cell 1    Setup, dependency install, TrackNet clone, OOM patch for median-frame sampling
  Cell 2    Video acquisition (yt-dlp), skips anything already downloaded
  Cell 3    Preprocessing to 720p/30fps with per-video trim points
  Cell 4    TrackNet V3 ball tracking, session-clock aware, checkpointed
  Cell 4b   MediaPipe Pose extraction, both players, per-frame CSV
  Cell 5    Tracking validation: trajectory heatmaps and sampled frames with detections drawn
  Cell 6    Court detection attempt and coordinate normalisation
  Cell 7    Camera-invariant feature extraction over 10-second windows
  Cell 8    LeaveOneGroupOut evaluation, dummy baselines, binary experiment, feature importance
  Cell 9    SHAP analysis
results/                            Confusion matrices, feature importances, OOF predictions
features/                           window_features_v2.csv
```

Reproducing it needs a Kaggle notebook with GPU and persistence enabled. TrackNet V3 weights are pulled from the [upstream repo](https://github.com/qaz812345/TrackNetV3). Video files and tracking CSVs are not committed.

---

## What's next

1. **Pose features.** Use the landmarks already sitting in `pose_output/`. This is where per-player signal has to come from.
2. **Rally segmentation.** Current windows are fixed 10-second slices, which cut across rallies and dead time indiscriminately. Segmenting on ball-visibility gaps and computing features per rally is a better unit of analysis.
3. **Corpus expansion.** More matches per tier, and ideally footage with verified ratings rather than self-reported ones.
4. **Per-player attribution.** Split ball trajectory by court half so each player's shots are attributable, then rate players rather than matches.
5. **Integration.** If and only if the model clears its baselines by a margin worth acting on, expose it in the KorIQ platform as a provisional self-rating that a coach evaluation later overrides.

---

## Relationship to the KorIQ platform

[KorIQ Tennis Platform](../KorIQ-Tennis-Platform) is the product: React front end, Supabase Postgres backend, database-side NTRP scoring, row-level security, SQL analytics views. It is a working prototype and its evaluation engine is coach-driven.

This project is the research that would eventually feed it. They are kept apart deliberately. The platform is judged on whether it works; this is judged on whether the claim is true.
