import { useQuery } from "@tanstack/react-query";
import { AnalyticsService } from "./analytics.service";

export const analyticsKeys = {
  all: ["analytics"] as const,
  summary: () => [...analyticsKeys.all, "summary"] as const,
  parties: () => [...analyticsKeys.all, "parties"] as const,
  gender: () => [...analyticsKeys.all, "gender"] as const,
  age: () => [...analyticsKeys.all, "age"] as const,
  constituencies: () => [...analyticsKeys.all, "constituencies"] as const,
  professions: () => [...analyticsKeys.all, "professions"] as const,
};

export function useAnalyticsSummary() {
  return useQuery({
    queryKey: analyticsKeys.summary(),
    queryFn: () => AnalyticsService.getSummary(),
    staleTime: 10 * 60 * 1000,
  });
}

export function usePartyBreakdown() {
  return useQuery({
    queryKey: analyticsKeys.parties(),
    queryFn: () => AnalyticsService.getPartyBreakdown(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useGenderDistribution() {
  return useQuery({
    queryKey: analyticsKeys.gender(),
    queryFn: () => AnalyticsService.getGenderDistribution(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useAgeDistribution() {
  return useQuery({
    queryKey: analyticsKeys.age(),
    queryFn: () => AnalyticsService.getAgeDistribution(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useConstituencyBreakdown() {
  return useQuery({
    queryKey: analyticsKeys.constituencies(),
    queryFn: () => AnalyticsService.getConstituencyBreakdown(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useProfessionBreakdown(limit = 15) {
  return useQuery({
    queryKey: [...analyticsKeys.professions(), limit],
    queryFn: () => AnalyticsService.getProfessionBreakdown(limit),
    staleTime: 10 * 60 * 1000,
  });
}
