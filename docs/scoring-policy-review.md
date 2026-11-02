# Shared Mini-Game Scoring Policy

## Design goals

1. A wrong answer must never receive positive runtime leaderboard points.
2. A fully correct answer receives the full reward assigned to that mini-game and difficulty.
3. Only games whose core mechanic is estimating a numeric count may award partial credit.
4. Every score is calculated by the shared scoring policy; mini-game services must not maintain their own point tables or formulas.
5. Chaos penalties are explicit modifiers, not ordinary answer rewards, and are the only negative answer-award deltas allowed through the post-modifier scoring boundary.

## Numeric counting / estimation rule

The approved numeric-estimation games are **Count The Beat** and **Memory Count**.

| Result | Required answer difference | Reward |
|---|---:|---:|
| Exact | 0 | 100% of the question points |
| Close estimate | exactly 1 count away (±1) | 25% of the question points |
| Incorrect estimate | more than 1 count away | 0 |
| Invalid or missing numeric value | not a finite integer | 0 |

The tolerance is an absolute one-count margin, not a percentage. These rounds use count targets roughly in the 7–22 range. Being off by one is a genuine near miss; being off by two can represent a materially larger error, especially on the smaller targets. Widening the margin to ±2 would make too many options/answers partially successful and reduce the value of an exact count. The same one-count rule is used at every difficulty so the meaning of “close” stays predictable; difficulty is represented by the task itself, not by quietly changing what counts as close.

The quarter-credit ratio makes exact answers clearly dominant while still acknowledging a near miss. For example:

| Game | Difficulty | Exact | ±1 | Difference greater than 1 |
|---|---|---:|---:|---:|
| Count The Beat | Easy | 120 | 30 | 0 |
| Count The Beat | Medium | 180 | 45 | 0 |
| Count The Beat | Hard | 240 | 60 | 0 |
| Memory Count | Easy | 60 | 15 | 0 |
| Memory Count | Medium | 120 | 30 | 0 |
| Memory Count | Hard | 180 | 45 | 0 |

Memory Count is currently QA-only, but follows the same policy before any future release. Its generated choices include the exact value and a one-count-near option so the partial-credit rule can be tested and played intentionally.

**Shape Count does not use partial credit.** Despite “count” in its title, its answer mechanic is selecting which shape is most frequent, not estimating a numeric total. It remains an exact-choice game. Lucky Cup also remains exact-only because selecting the wrong cup is not a numeric estimate.

## Exact-choice games

Food Origin, Shape Count, Maze Gates, Before & After, Guess Logo, True or Fake, Lucky Cup, and Couple or Siblings award full points only for the correct choice. A wrong choice receives zero base runtime points. No submitted answer produces no answer award.

Food Origin retains its existing hint rule: a correct answer after using the hint earns 50% of the normal points; a wrong answer still earns zero.

## Hangman special case

Hangman is an action/word game rather than a single-answer multiple-choice round, so its point calculation also lives in the shared scoring module:

- Correct letter: 25 points.
- Incorrect letter: 0 points.
- Correct full-word guess: difficulty bonus (Easy 150, Medium 220, Hard 320).
- Incorrect full-word guess: 0 points.

A player who has already earned points for correct letters keeps those earned points if a later guess is wrong. A wrong guess itself never adds points.

## Existing full-answer point values retained

These values were moved into one central table without changing their previous amounts. This work standardizes and hardens scoring behavior rather than silently rebalancing the Tour:

| Mini-game | Easy | Medium | Hard |
|---|---:|---:|---:|
| Food Origin | 60 | 120 | 180 |
| Shape Count | 50 | 100 | 150 |
| Maze Gates | 90 | 140 | 200 |
| Before & After | 60 | 120 | 180 |
| Guess Logo | 60 | 110 | 160 |
| Count The Beat | 120 | 180 | 240 |
| Lucky Cup | 120 | 180 | 240 |
| True or Fake | 50 | 100 | 150 |
| Memory Count (QA-only) | 60 | 120 | 180 |
| Couple or Siblings (QA-only) | 70 | 120 | 180 |

A future balance pass may choose to align the point values between games, but that should be a separate, deliberate design decision.

## Shared enforcement flow

1. The active mini-game service creates answer awards using the shared scoring helpers.
2. `GameStore` validates the base awards against the active mini-game ID. Partial credit is accepted only for Count The Beat or Memory Count; its cap is recalculated from the central base-points table, not trusted from a service-provided value.
3. Chaos modifiers are applied. Risk Round's -30 penalty applies only to fully incorrect answers; numeric near misses retain their quarter credit. Skipped questions do not receive an answer award and are not treated as wrong answers.
4. `GameStore` validates again. It permits a negative answer award only when it exactly matches the active Chaos event's configured wrong-answer penalty (currently Risk Round's -30); a mini-game service cannot introduce its own negative points or an arbitrary deduction.
5. Runtime player scores are updated. The Tour ledger records the actual score delta after answer awards and global modifiers, and tracks exact, partial, and incorrect responses separately.

## Runtime score versus progression rewards

Runtime score is the score shown on round and Tour leaderboards. Official-player XP and coins are a separate progression system. Existing participation XP/coins may still be awarded for submitting an answer even when it is wrong; these rewards do not increase runtime leaderboard points. Correct answers receive the configured difficulty-based XP/coin rewards. This distinction is intentional and should remain visible in future maintenance work.

## Regression coverage

`scoring-policy.test.ts` covers:

- central point values for every registered mini-game;
- exact, ±1, and more-than-one count outcomes in both numeric games;
- actual service award creation for both Count The Beat and Memory Count;
- the Memory Count exact and near option generation;
- rejection of decimal, `NaN`, and infinite estimates;
- strict zero-point behavior in choice games;
- central rejection of partial credit in non-numeric games;
- protection against inflated service-provided `maxPoints`;
- rejection of negative service awards before Chaos;
- preservation of Risk Round's explicit -30 penalty after Chaos;
- separation of partial answers from exact and incorrect Tour counters.
