import { apiClient } from "@/lib/api-client";
import type {
  AnalyticsSummary,
  PartyBreakdown,
  GenderDistribution,
  AgeDistribution,
  ConstituencyBreakdown,
  ProfessionBreakdown,
} from "../types/analytics.types";

export const AnalyticsService = {
  async getSummary(): Promise<AnalyticsSummary> {
    const response = await apiClient.get<AnalyticsSummary>("/analytics/summary");
    return response.data;
  },

  async getPartyBreakdown(): Promise<PartyBreakdown[]> {
    const response = await apiClient.get<PartyBreakdown[]>("/analytics/parties");
    return response.data;
  },

  async getGenderDistribution(): Promise<GenderDistribution> {
    const response = await apiClient.get<GenderDistribution>("/analytics/gender");
    return response.data;
  },

  async getAgeDistribution(): Promise<AgeDistribution[]> {
    const response = await apiClient.get<AgeDistribution[]>("/analytics/age");
    return response.data;
  },

  async getConstituencyBreakdown(): Promise<ConstituencyBreakdown[]> {
    const response = await apiClient.get<ConstituencyBreakdown[]>(
      "/analytics/constituencies"
    );
    return response.data;
  },

  async getProfessionBreakdown(limit = 15): Promise<ProfessionBreakdown[]> {
    const response = await apiClient.get<ProfessionBreakdown[]>(
      "/analytics/professions",
      { params: { limit } }
    );
    return response.data;
  },
};
