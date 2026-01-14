export interface AnalyticsSummary {
  totalDeputies: number;
  totalParties: number;
  totalConstituencies: number;
  averageAge: number;
  genderRatio: {
    male: number;
    female: number;
    malePercent: number;
    femalePercent: number;
  };
  averagePositionsPerDeputy: number;
  deputiesWithBenefits: number;
  deputiesWithShareholdings: number;
  totalPositions: number;
  totalBenefits: number;
  totalShareholdings: number;
}

export interface PartyBreakdown {
  party: string;
  count: number;
  percentage: number;
}

export interface GenderDistribution {
  overall: {
    gender: string;
    label: string;
    count: number;
    percentage: number;
  }[];
  byParty: {
    party: string;
    male: number;
    female: number;
    total: number;
    femalePercent: number;
  }[];
}

export interface AgeDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface ConstituencyBreakdown {
  constituency: string;
  count: number;
  parties: { party: string; count: number }[];
}

export interface ProfessionBreakdown {
  profession: string;
  count: number;
  percentage: number;
}
