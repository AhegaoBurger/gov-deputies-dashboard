import { useState, useMemo } from "react";
import { useInfiniteDeputies } from "../api/deputies.queries";
import { DeputyCard } from "../components/DeputyCard";
import { DeputyFilters } from "../components/DeputyFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { DeputyFilters as Filters, DeputySortField } from "../types/deputy.types";

export function DeputiesPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [sort, setSort] = useState<DeputySortField>("fullName");

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteDeputies({
      ...filters,
      sort,
      limit: 20,
    });

  const deputies = useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const total = data?.pages[0]?.total || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deputados</h1>
        <p className="text-muted-foreground">
          Lista de deputados da Assembleia da Republica
        </p>
      </div>

      <DeputyFilters
        filters={filters}
        onFiltersChange={setFilters}
        sort={sort}
        onSortChange={setSort}
      />

      <div className="text-sm text-muted-foreground">
        {total} deputado{total !== 1 ? "s" : ""} encontrado{total !== 1 ? "s" : ""}
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[220px]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deputies.map((deputy) => (
              <DeputyCard key={deputy.id} deputy={deputy} />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "A carregar..." : "Carregar mais"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
