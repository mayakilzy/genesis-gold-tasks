# flaky-orders

A small order service over an in-memory inventory, kept as a diagnostic
training case.

## The symptom (as reported by CI)

`npm test` fails INTERMITTENTLY — often several times in a row, then
passes for a while, on the same commit. The failing assertion is always
one of:

- `exactly the available stock may be accepted`
- `stock must reach exactly zero`
- `the excess orders must be rejected`

## Run

```bash
npm test
```

## Evidence bundle

- `evidence/incident-logs.txt` — captured test runs (real output)
- `evidence/metrics.md` — observed pass/fail rates over repeated runs
