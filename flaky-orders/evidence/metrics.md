# flaky-orders — observed failure rate

Captured 2026-10-05T19:15:46Z from 15 consecutive runs of `npm test`
on the same commit, same machine, same node version (no code changes between runs).

| Outcome | Runs | Rate |
| --- | --- | --- |
| PASS | 3 | 20% |
| FAIL | 12 | 80% |

## Which assertion fails

Across the failing runs, the failing assertion varies between:
- `exactly the available stock may be accepted` (accepted != 8)
- `stock must reach exactly zero` (final stock > 0)
- `the excess orders must be rejected` (rejected != 4)

## Run-by-run

- run 1: FAIL
- run 2: FAIL
- run 3: PASS
- run 4: FAIL
- run 5: FAIL
- run 6: FAIL
- run 7: PASS
- run 8: FAIL
- run 9: FAIL
- run 10: FAIL
- run 11: FAIL
- run 12: PASS
- run 13: FAIL
- run 14: FAIL
- run 15: FAIL
