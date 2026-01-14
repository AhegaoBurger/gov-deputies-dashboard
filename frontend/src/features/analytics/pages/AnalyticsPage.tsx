import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnalyticsSummary,
  usePartyBreakdown,
  useGenderDistribution,
  useAgeDistribution,
  useConstituencyBreakdown,
  useProfessionBreakdown,
} from "../api/analytics.queries";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getPartyColor } from "@/lib/utils";
import { Users, Building2, Briefcase, Calendar } from "lucide-react";

export function AnalyticsPage() {
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary();
  const { data: parties, isLoading: partiesLoading } = usePartyBreakdown();
  const { data: gender, isLoading: genderLoading } = useGenderDistribution();
  const { data: age, isLoading: ageLoading } = useAgeDistribution();
  const { data: constituencies, isLoading: constituenciesLoading } =
    useConstituencyBreakdown();
  const { data: professions, isLoading: professionsLoading } =
    useProfessionBreakdown(10);

  const GENDER_COLORS = ["#3b82f6", "#ec4899"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estatisticas</h1>
        <p className="text-muted-foreground">
          Analise dos dados dos deputados da Assembleia da Republica
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deputados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
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
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{summary?.totalParties}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Idade Media</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{summary?.averageAge} anos</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cargos</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <div className="text-2xl font-bold">{summary?.totalPositions}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Party Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuicao por Partido</CardTitle>
          </CardHeader>
          <CardContent>
            {partiesLoading ? (
              <Skeleton className="h-[300px]" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={parties} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="party" type="category" width={50} />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value} deputados`,
                      "Total",
                    ]}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {parties?.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getPartyColor(entry.party)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuicao por Genero</CardTitle>
          </CardHeader>
          <CardContent>
            {genderLoading ? (
              <Skeleton className="h-[300px]" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={gender?.overall}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ label, percentage }) =>
                      `${label}: ${percentage}%`
                    }
                  >
                    {gender?.overall.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Age Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribuicao por Idade</CardTitle>
          </CardHeader>
          <CardContent>
            {ageLoading ? (
              <Skeleton className="h-[300px]" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={age}>
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value} deputados`, "Total"]}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Professions */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Profissoes</CardTitle>
          </CardHeader>
          <CardContent>
            {professionsLoading ? (
              <Skeleton className="h-[300px]" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={professions} layout="vertical">
                  <XAxis type="number" />
                  <YAxis
                    dataKey="profession"
                    type="category"
                    width={120}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value} deputados`, "Total"]}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Constituencies */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Deputados por Circulo Eleitoral</CardTitle>
          </CardHeader>
          <CardContent>
            {constituenciesLoading ? (
              <Skeleton className="h-[300px]" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={constituencies}>
                  <XAxis
                    dataKey="constituency"
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [`${value} deputados`, "Total"]}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
