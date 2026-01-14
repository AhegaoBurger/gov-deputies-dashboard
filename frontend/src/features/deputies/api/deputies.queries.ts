import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { DeputiesService, type GetDeputiesParams } from "./deputies.service";

export const deputyKeys = {
  all: ["deputies"] as const,
  lists: () => [...deputyKeys.all, "list"] as const,
  list: (params: GetDeputiesParams) => [...deputyKeys.lists(), params] as const,
  details: () => [...deputyKeys.all, "detail"] as const,
  detail: (id: string) => [...deputyKeys.details(), id] as const,
  filters: () => [...deputyKeys.all, "filters"] as const,
};

export function useDeputies(params: GetDeputiesParams = {}) {
  return useQuery({
    queryKey: deputyKeys.list(params),
    queryFn: () => DeputiesService.getDeputies(params),
  });
}

export function useInfiniteDeputies(
  params: Omit<GetDeputiesParams, "offset"> = {}
) {
  const limit = params.limit || 20;

  return useInfiniteQuery({
    queryKey: deputyKeys.list({ ...params, offset: 0 }),
    queryFn: ({ pageParam = 0 }) =>
      DeputiesService.getDeputies({ ...params, offset: pageParam, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce(
        (acc, page) => acc + page.data.length,
        0
      );
      if (loadedCount >= lastPage.total) {
        return undefined;
      }
      return loadedCount;
    },
  });
}

export function useDeputy(id: string) {
  return useQuery({
    queryKey: deputyKeys.detail(id),
    queryFn: () => DeputiesService.getDeputyById(id),
    enabled: !!id,
  });
}

export function useFilters() {
  return useQuery({
    queryKey: deputyKeys.filters(),
    queryFn: () => DeputiesService.getFilters(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
