import { apiClient } from "@/lib/api-client";
import type {
  DeputiesResponse,
  DeputyResponse,
  FiltersResponse,
  DeputyFilters,
  DeputySortField,
} from "../types/deputy.types";

export interface GetDeputiesParams extends DeputyFilters {
  limit?: number;
  offset?: number;
  sort?: DeputySortField;
  ascending?: boolean;
}

export const DeputiesService = {
  async getDeputies(params: GetDeputiesParams = {}): Promise<DeputiesResponse> {
    const response = await apiClient.get<DeputiesResponse>("/deputies", {
      params: {
        search: params.search,
        party: params.party,
        constituency: params.constituency,
        gender: params.gender,
        limit: params.limit || 20,
        offset: params.offset || 0,
        sort: params.sort || "fullName",
        ascending: params.ascending !== false,
      },
    });
    return response.data;
  },

  async getDeputyById(id: string): Promise<DeputyResponse> {
    const response = await apiClient.get<DeputyResponse>(`/deputies/${id}`);
    return response.data;
  },

  async getFilters(): Promise<FiltersResponse> {
    const response = await apiClient.get<FiltersResponse>("/filters");
    return response.data;
  },
};
