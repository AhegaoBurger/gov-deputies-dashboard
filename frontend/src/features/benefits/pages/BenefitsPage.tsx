import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { capitalize } from "@/lib/utils";
import type { Benefit } from "@/features/deputies/types/deputy.types";

interface BenefitsResponse {
  data: Benefit[];
  total: number;
}

export function BenefitsPage() {
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["benefits", offset],
    queryFn: async () => {
      const response = await apiClient.get<BenefitsResponse>("/benefits", {
        params: { limit, offset },
      });
      return response.data;
    },
  });

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Apoios Recebidos</h1>
        <p className="text-muted-foreground">
          Lista de apoios e beneficios declarados pelos deputados
        </p>
      </div>

      <div className="text-sm text-muted-foreground">
        {data?.total || 0} apoios registados
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {data?.data.map((benefit) => (
              <Card key={benefit.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">
                        {benefit.description}
                      </h3>
                      <p className="text-muted-foreground">{benefit.entity}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{benefit.date}</span>
                        {benefit.nature && (
                          <span className="text-muted-foreground">
                            {benefit.nature}
                          </span>
                        )}
                      </div>
                      <Link
                        to="/deputies/$deputyId"
                        params={{ deputyId: benefit.deputyId }}
                        className="text-sm text-primary hover:underline"
                      >
                        {capitalize(benefit.deputyName)}
                      </Link>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {benefit.area && (
                        <Badge variant="secondary">{benefit.area}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {data && offset + limit < data.total && (
            <div className="flex justify-center">
              <Button variant="outline" onClick={handleLoadMore}>
                Carregar mais
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
