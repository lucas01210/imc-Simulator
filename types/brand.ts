export type BrandTypeId = "beauty" | "tea" | "auto";

export type BrandCategory = "beauty" | "tea" | "auto";

export type BrandDefinition = {
  id: BrandTypeId;
  name: string;
  tagline: string;
  category: BrandCategory;

  // Starting resources / baseline health
  startingBudget: number;

  // Execution alignment inside your org (used as a proxy for consistency)
  startingTeamwork: number;
  // Used as a proxy baseline for stakeholder trust & relationship health
  startingAwareness: number;
  startingTrust: number;
  startingSentiment: number;
  startingSales: number;
  startingLongTermAsset: number;
};

