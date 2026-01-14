import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";
import { capitalize } from "@/lib/utils";
import type { Shareholding } from "@/features/deputies/types/deputy.types";

interface ShareholdingsResponse {
  data: Shareholding[];
  total: number;
}

export function ShareholdingsPage() {
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["shareholdings", offset],
    queryFn: async () => {
      const response = await apiClient.get<ShareholdingsResponse>(
        "/shareholdings",
        { params: { limit, offset } }
      );
      return response.data;
    },
  });

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Participacoes Societarias
        </h1>
        <p className="text-muted-foreground">
          Participacoes em sociedades declaradas pelos deputados
        </p>
      </div>

      <div className="text-sm text-muted-foreground">
        {data?.total || 0} participacoes registadas
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[100px]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {data?.data.map((shareholding) => (
              <Card key={shareholding.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Building2 className="h-8 w-8 text-muted-foreground shrink-0" />
                    <div className="space-y-2 flex-1">
                      <h3 className="font-semibold">{shareholding.company}</h3>
                      <p className="text-sm text-muted-foreground">
                        Participacao: {shareholding.participation}
                      </p>
                      {shareholding.location && (
                        <p className="text-sm text-muted-foreground">
                          {shareholding.location}
                        </p>
                      )}
                      <Link
                        to="/deputies/$deputyId"
                        params={{ deputyId: shareholding.deputyId }}
                        className="text-sm text-primary hover:underline"
                      >
                        {capitalize(shareholding.deputyName)}
                      </Link>
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
