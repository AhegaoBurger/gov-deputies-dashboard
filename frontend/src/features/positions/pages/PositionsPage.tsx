import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { apiClient } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, capitalize } from "@/lib/utils";
import type { Position } from "@/features/deputies/types/deputy.types";

interface PositionsResponse {
  data: Position[];
  total: number;
}

export function PositionsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ["positions", activeFilter, offset],
    queryFn: async () => {
      const params: Record<string, string | number> = { limit, offset };
      if (activeFilter !== "all") {
        params.active = activeFilter;
      }
      const response = await apiClient.get<PositionsResponse>("/positions", {
        params,
      });
      return response.data;
    },
  });

  const handleLoadMore = () => {
    setOffset((prev) => prev + limit);
  };

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    setOffset(0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cargos e Funcoes</h1>
        <p className="text-muted-foreground">
          Lista de cargos e funcoes declaradas pelos deputados
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Select value={activeFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Ativos</SelectItem>
            <SelectItem value="false">Terminados</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-sm text-muted-foreground">
          {data?.total || 0} cargos encontrados
        </span>
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
            {data?.data.map((position) => (
              <Card key={position.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{position.title}</h3>
                      <p className="text-muted-foreground">{position.entity}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>
                          {formatDate(position.startDate)} -{" "}
                          {position.endDate
                            ? formatDate(position.endDate)
                            : "Presente"}
                        </span>
                        {position.location && (
                          <span className="text-muted-foreground">
                            {position.location}
                          </span>
                        )}
                      </div>
                      <Link
                        to="/deputies/$deputyId"
                        params={{ deputyId: position.deputyId }}
                        className="text-sm text-primary hover:underline"
                      >
                        {capitalize(position.deputyName)}
                      </Link>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {position.isActive && <Badge>Ativo</Badge>}
                      <Badge
                        variant={position.isRemunerated ? "default" : "outline"}
                      >
                        {position.isRemunerated ? "Remunerado" : "Nao remunerado"}
                      </Badge>
                      {position.nature && (
                        <Badge variant="secondary">{position.nature}</Badge>
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
