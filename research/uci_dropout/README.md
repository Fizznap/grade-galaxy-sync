# UCI Dropout Prediction Benchmark

## Dataset
- **Name**: Predict Students' Dropout and Academic Success
- **Source**: https://archive.ics.uci.edu/dataset/697
- **Citation**: Realinho et al. (2022)
- **License**: CC BY 4.0

## Target
- 3-class: `Dropout`, `Enrolled`, `Graduate`
- Prediction horizon: Early identification (using enrollment and 1st-semester data)

## Features (36)
See `feature_definitions.md` for complete list.

### Leakage Risk
Features like "Curricular units 2nd sem (approved)" represent 2nd-semester outcomes.
For early prediction, restrict to:
- Enrollment-time features (demographics, application, socioeconomic)
- 1st-semester features only

## Methodology
1. Train/test split: 80/20 stratified
2. Baseline: Logistic Regression (class-balanced)
3. Comparison: Random Forest or Gradient Boosting
4. Metrics: Macro F1, per-class precision/recall, balanced accuracy
5. Calibration: Reliability diagram for probability estimates

## Status
- [ ] Download and inspect dataset
- [ ] Define feature sets (enrollment-only vs. 1st-semester)
- [ ] Train baseline model
- [ ] Train tree-based model
- [ ] Evaluate and report
- [ ] Assess calibration
