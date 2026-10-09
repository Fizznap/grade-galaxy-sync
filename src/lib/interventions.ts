import { type Scored, type Risk } from './scoring';

export type InterventionSuggestion = {
  issue: string;
  indicator: string;
  indicatorValue: number;
  threshold: number;
  action: string;
  why: string;
  followUp: string;
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  requiresFacultyReview: true;
};

export function generateSuggestions(s: Scored): InterventionSuggestion[] {
  const suggestions: InterventionSuggestion[] = [];

  // Attendance
  if (s.attendance < 60) {
    suggestions.push({
      issue: "Critical attendance deficit",
      indicator: "attendance",
      indicatorValue: s.attendance,
      threshold: 60,
      action: "Schedule immediate faculty meeting to discuss attendance barriers",
      why: "Attendance below 60% correlates with academic failure risk and triggers High academic risk classification",
      followUp: "Monitor weekly attendance for 4 weeks; review again if <75%",
      priority: 'High',
      category: "Attendance",
      requiresFacultyReview: true
    });
  } else if (s.attendance < 75 && s.attendance >= 60) {
    suggestions.push({
      issue: "Attendance below institutional threshold",
      indicator: "attendance",
      indicatorValue: s.attendance,
      threshold: 75,
      action: "Faculty follow-up to identify attendance barriers",
      why: "Students below 75% attendance often face compounding academic difficulties",
      followUp: "Track attendance bi-weekly; escalate if decline continues",
      priority: 'Medium',
      category: "Attendance",
      requiresFacultyReview: true
    });
  }

  // Academic - CGPA
  const cgpa = Number(s.cgpa);
  if (cgpa < 5) {
    suggestions.push({
      issue: "CGPA critically below passing threshold",
      indicator: "cgpa",
      indicatorValue: cgpa,
      threshold: 5,
      action: "Assign dedicated academic mentor for remedial support",
      why: "CGPA below 5.0 indicates severe academic difficulty requiring structured intervention",
      followUp: "Weekly mentoring sessions; reassess at mid-semester",
      priority: 'High',
      category: "Academic",
      requiresFacultyReview: true
    });
  } else if (cgpa < 6 && cgpa >= 5) {
    suggestions.push({
      issue: "Below-average academic performance",
      indicator: "cgpa",
      indicatorValue: cgpa,
      threshold: 6,
      action: "Enroll in peer tutoring or remedial coaching program",
      why: "Students with CGPA 5-6 benefit from targeted academic support before falling further",
      followUp: "Monthly CGPA tracking; check improvement at next semester",
      priority: 'Medium',
      category: "Academic",
      requiresFacultyReview: true
    });
  }

  // Academic - Backlogs
  if (s.backlogs >= 2) {
    suggestions.push({
      issue: "Multiple active backlogs",
      indicator: "backlogs",
      indicatorValue: s.backlogs,
      threshold: 2,
      action: "Create structured backlog clearance plan with faculty advisor",
      why: "2+ backlogs triggers High academic risk and compounds semester difficulty",
      followUp: "Track backlog exam results; adjust plan after each attempt",
      priority: 'High',
      category: "Academic",
      requiresFacultyReview: true
    });
  } else if (s.backlogs === 1) {
    suggestions.push({
      issue: "Active backlog requiring attention",
      indicator: "backlogs",
      indicatorValue: s.backlogs,
      threshold: 1,
      action: "Schedule faculty discussion on backlog clearance timeline",
      why: "Early intervention on a single backlog prevents escalation",
      followUp: "Monitor next backlog exam result",
      priority: 'Medium',
      category: "Academic",
      requiresFacultyReview: true
    });
  }

  // LMS
  if (s.lms_activity < 45) {
    suggestions.push({
      issue: "Low LMS engagement",
      indicator: "lms_activity",
      indicatorValue: s.lms_activity,
      threshold: 45,
      action: "Verify LMS access and assign structured online learning activities",
      why: "Low LMS activity (below 45) suggests disengagement from course materials",
      followUp: "Review LMS usage logs monthly",
      priority: 'Medium',
      category: "Academic", // Instructions map this to Academic? "category: 'Academic'" in prompt
      requiresFacultyReview: true
    });
  }

  // Placement Readiness
  if (s.placement_readiness < 45) {
    suggestions.push({
      issue: "Low placement readiness",
      indicator: "placement_readiness",
      indicatorValue: s.placement_readiness,
      threshold: 45,
      action: "Enroll in placement preparation program covering aptitude and professional skills",
      why: "Readiness below 45 triggers High placement risk; early preparation improves outcomes",
      followUp: "Reassess readiness score after program completion",
      priority: 'High',
      category: "Placement",
      requiresFacultyReview: true
    });
  }

  // Skills
  if (s.skills_score < 40) {
    suggestions.push({
      issue: "Significant skill gaps identified",
      indicator: "skills_score",
      indicatorValue: s.skills_score,
      threshold: 40,
      action: "Assign coding/technical practice with mentorship",
      why: "Skills below 40 indicate gaps that require dedicated practice to address",
      followUp: "Monthly skill assessment; track progress on specific competencies",
      priority: 'High',
      category: "Skills",
      requiresFacultyReview: true
    });
  }

  // Feedback
  if (s.feedback_score < 40) {
    suggestions.push({
      issue: "Low faculty/mock interview feedback",
      indicator: "feedback_score",
      indicatorValue: s.feedback_score,
      threshold: 40,
      action: "Schedule mock interview sessions with industry mentors",
      why: "Low feedback scores suggest presentation or communication gaps addressable through practice",
      followUp: "Schedule follow-up mock interviews; compare scores",
      priority: 'Medium',
      category: "Placement",
      requiresFacultyReview: true
    });
  }

  // Engagement
  if (s.engagement < 40) {
    suggestions.push({
      issue: "Low campus engagement",
      indicator: "engagement",
      indicatorValue: s.engagement,
      threshold: 40,
      action: "Encourage participation in clubs, events, or hackathons aligned with student interests",
      why: "Campus engagement below 40 may indicate social isolation or lack of awareness of opportunities",
      followUp: "Check engagement metrics next semester",
      priority: 'Low',
      category: "Engagement",
      requiresFacultyReview: true
    });
  }

  return suggestions;
}
