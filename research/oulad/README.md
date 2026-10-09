# Open University Learning Analytics Dataset (OULAD) Analysis

## Dataset
- **Source**: https://analyse.kmi.open.ac.uk/open_dataset
- **Citation**: Kuzilek et al. (2017)
- **License**: CC BY 4.0

## Purpose
Study LMS activity, assessment behavior, and learning-engagement features.
Not for concatenation with KRYPTEDU or UCI records.

## Key Tables
- `studentInfo`: Demographics, registration, final result
- `studentVle`: VLE (LMS) interaction logs with timestamps
- `studentAssessment`: Assessment submission data
- `assessments`: Assessment metadata
- `courses`: Module and presentation info
- `vle`: VLE activity types

## Analysis Goals
1. Identify LMS activity patterns that correlate with outcomes
2. Study assessment submission timing and completion rates
3. Explore engagement metrics derivable from VLE logs
4. Compare patterns with KRYPTEDU's `lms_activity` metric

## Context Differences from KRYPTEDU
- UK distance learning vs. Indian campus environment
- Different academic calendar and assessment structure
- Different student demographics and enrollment patterns

## Status
- [ ] Download and inspect tables
- [ ] Compute VLE engagement features
- [ ] Analyze correlation with outcomes
- [ ] Document transferable insights
