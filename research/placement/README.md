# Placement Prediction Assessment

## Status: DATASET UNVERIFIED

The referenced repository requires verification:
- **Source**: https://github.com/manishbheenchar/Student-Placement-Prediction
- **Current state**: Repository page appears empty (as of inspection)

## Action Items
- [ ] Verify repository contents and dataset availability
- [ ] Inspect target labels and data quality
- [ ] Check license compatibility
- [ ] Only proceed with model training after verification

## Current Approach (KRYPTEDU)
Until suitable labelled placement data is available, KRYPTEDU uses a transparent
readiness assessment based on actual indicators:

| Indicator | Weight in Placement Index | Threshold |
|---|---|---|
| Placement Readiness | 50% | < 45 → High risk |
| Skills Score | 30% | < 40 → Skill gaps |
| Feedback Score | 20% | < 40 → Interview prep needed |

This is a **rules-based assessment**, not a trained predictive model.
It should not be presented as ML-based prediction.
