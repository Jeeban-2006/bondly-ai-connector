export type HealthStatus = 'thriving' | 'healthy' | 'needs_attention' | 'at_risk';

export interface HealthScoreResult {
  score: number;
  status: HealthStatus;
  trend: 'up' | 'down' | 'flat';
}

/**
 * Calculates the relationship health score (0-100) and trend.
 */
export function calculateHealthScore(
  lastContactedDate: string | null,
  importanceLevel: number = 3, // 1 to 5
  totalInteractions: number = 0,
  previousScore: number | null = null
): HealthScoreResult {
  let score = 50; // Base baseline

  if (lastContactedDate) {
    const daysSince = Math.max(0, Math.floor((Date.now() - new Date(lastContactedDate).getTime()) / (1000 * 60 * 60 * 24)));
    
    // Higher importance = decays faster when neglected, but starts higher
    const decayFactor = (importanceLevel / 3) * 1.5; 
    score -= daysSince * decayFactor;

    // Bonus for recent interactions
    if (daysSince <= 3) score += 25;
    else if (daysSince <= 7) score += 15;
    else if (daysSince <= 14) score += 5;
  } else {
    // Never contacted is inherently lower
    score -= 20;
  }

  // Bonus for total history (long-term investment)
  score += Math.min(totalInteractions * 2, 25);

  // Bonus for importance level (inherent baseline shift)
  score += importanceLevel * 4;

  // Clamp between 0 and 100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Determine categorical status
  let status: HealthStatus = 'at_risk';
  if (score >= 90) status = 'thriving';
  else if (score >= 70) status = 'healthy';
  else if (score >= 40) status = 'needs_attention';

  // Determine trend relative to previous score
  let trend: 'up' | 'down' | 'flat' = 'flat';
  if (previousScore !== null) {
    if (score > previousScore + 2) trend = 'up';
    else if (score < previousScore - 2) trend = 'down';
  }

  return { score, status, trend };
}
