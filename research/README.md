# KRYPTEDU Research Directory

This directory contains reproducible research benchmarks. 
All experiments use external datasets and are kept strictly separate from the production KRYPTEDU application data.

## Datasets

### UCI Predict Students' Dropout and Academic Success
- **Source**: https://archive.ics.uci.edu/dataset/697/predict+students+dropout+and+academic+success
- **License**: CC BY 4.0
- **Purpose**: Benchmark for academic risk prediction models
- **Target**: 3-class (Dropout / Enrolled / Graduate)
- **Features**: 36 features including demographics, academic, socioeconomic
- **Samples**: 4,424 students from a Portuguese HEI

### Open University Learning Analytics Dataset (OULAD)
- **Source**: https://analyse.kmi.open.ac.uk/open_dataset
- **License**: CC BY 4.0  
- **Purpose**: Study LMS activity and engagement patterns
- **Notes**: UK distance learning context — different from KRYPTEDU's campus environment
- **Cannot be concatenated** with UCI or KRYPTEDU records

### Student Placement Prediction
- **Source**: https://github.com/manishbheenchar/Student-Placement-Prediction
- **Status**: ⚠️ UNVERIFIED — repository page appears empty
- **Action**: Do NOT use until dataset, labels, quality, and license are inspected

## Principles

1. **No target leakage**: Use only features available at prediction time
2. **No cross-dataset identity**: Dataset identifiers do not provide verified cross-dataset identity
3. **No training on synthetic data**: Do not train models on KRYPTEDU's 36 synthetic students
4. **Report executed results**: Do not claim accuracy without actual evaluation
5. **Separate real from synthetic**: Label all synthetic/demo data as such
