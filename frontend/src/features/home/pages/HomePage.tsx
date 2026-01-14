import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnalyticsSummary, usePartyBreakdown } from "@/features/analytics/api/analytics.queries";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { getPartyColor } from "@/lib/utils";
import { Users, BarChart3, Briefcase, Gift, Building2, ArrowRight } from "lucide-react";

export function HomePage() {
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary();
  const { data: parties, isLoading: partiesLoading } = usePartyBreakdown();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Deputados Portugal
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Dashboard para visualizacao e analise dos dados de interesse dos
          deputados da Assembleia da Republica
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deputados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{summary?.totalDeputies}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partidos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{summary?.totalParties}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cargos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{summary?.totalPositions}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Apoios</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{summary?.totalBenefits}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sociedades</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{summary?.totalShareholdings}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gender & Party Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Representacao por Genero</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-[200px]" />
            ) : (
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">
                    {summary?.genderRatio.malePercent}%
                  </div>
                  <div className="text-sm text-muted-foreground">Masculino</div>
                  <div className="text-lg font-semibold">
                    {summary?.genderRatio.male}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-500">
                    {summary?.genderRatio.femalePercent}%
                  </div>
                  <div className="text-sm text-muted-foreground">Feminino</div>
                  <div className="text-lg font-semibold">
                    {summary?.genderRatio.female}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuicao por Partido</CardTitle>
          </CardHeader>
          <CardContent>
            {partiesLoading ? (
              <Skeleton className="h-[200px]" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={parties}
                    dataKey="count"
                    nameKey="party"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                  >
                    {parties?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getPartyColor(entry.party)}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value} deputados`,
                      name,
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/deputies">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 pt-6">
              <Users className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">Deputados</h3>
                <p className="text-sm text-muted-foreground">
                  Pesquisar e filtrar deputados
                </p>
              </div>
              <ArrowRight className="h-4 w-4" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/analytics">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 pt-6">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">Estatisticas</h3>
                <p className="text-sm text-muted-foreground">
                  Graficos e analises
                </p>
              </div>
              <ArrowRight className="h-4 w-4" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/positions">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 pt-6">
              <Briefcase className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">Cargos</h3>
                <p className="text-sm text-muted-foreground">
                  Funcoes e atividades
                </p>
              </div>
              <ArrowRight className="h-4 w-4" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/shareholdings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="flex items-center gap-4 pt-6">
              <Building2 className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <h3 className="font-semibold">Sociedades</h3>
                <p className="text-sm text-muted-foreground">
                  Participacoes empresariais
                </p>
              </div>
              <ArrowRight className="h-4 w-4" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Additional Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3 text-center">
            <div>
              <div className="text-2xl font-bold">
                {summary?.averagePositionsPerDeputy || "-"}
              </div>
              <div className="text-sm text-muted-foreground">
                Cargos por deputado (media)
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {summary?.deputiesWithBenefits || "-"}
              </div>
              <div className="text-sm text-muted-foreground">
                Deputados com apoios registados
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {summary?.deputiesWithShareholdings || "-"}
              </div>
              <div className="text-sm text-muted-foreground">
                Deputados com sociedades
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
