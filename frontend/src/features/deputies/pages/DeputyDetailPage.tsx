import { useParams, Link } from "@tanstack/react-router";
import { useDeputy } from "../api/deputies.queries";
import { PartyBadge } from "../components/PartyBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  User,
  Building2,
  Gift,
  Users,
} from "lucide-react";
import { capitalize, formatDate } from "@/lib/utils";

export function DeputyDetailPage() {
  const { deputyId } = useParams({ from: "/deputies/$deputyId" });
  const { data, isLoading, error } = useDeputy(deputyId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Deputado nao encontrado</p>
        <Link to="/deputies">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar a lista
          </Button>
        </Link>
      </div>
    );
  }

  const deputy = data.data;

  return (
    <div className="space-y-6">
      <Link to="/deputies">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </Link>

      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">
                    {capitalize(deputy.parliamentaryName)}
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    {capitalize(deputy.fullName)}
                  </p>
                </div>
                <PartyBadge party={deputy.party} showFullName />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{capitalize(deputy.constituency)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {deputy.gender === "M" ? "Masculino" : "Feminino"}
                    {deputy.age && `, ${deputy.age} anos`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{deputy.profession}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Legislatura {deputy.currentLegislature}</span>
                </div>
              </div>

              {deputy.currentPosition && (
                <Badge variant="default" className="text-sm">
                  {deputy.currentPosition}
                </Badge>
              )}

              <Badge variant={deputy.status === "Efetivo" ? "default" : "secondary"}>
                {deputy.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="career" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="career">Carreira</TabsTrigger>
          <TabsTrigger value="positions">
            Cargos ({deputy.positions.length})
          </TabsTrigger>
          <TabsTrigger value="benefits">
            Apoios ({deputy.benefits.length})
          </TabsTrigger>
          <TabsTrigger value="shareholdings">
            Sociedades ({deputy.shareholdings.length})
          </TabsTrigger>
          <TabsTrigger value="committees">
            Comissoes ({deputy.committees.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="career" className="space-y-4">
          {/* Education */}
          {deputy.education.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Habilitacoes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {deputy.education.map((edu, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Badge variant="outline">
                        {edu.status === "C" ? "Concluido" : "Incompleto"}
                      </Badge>
                      <span>{edu.degree}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Legislature History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Historico Parlamentar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deputy.legislatureHistory.map((leg, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono">
                        {leg.legislature}
                      </Badge>
                      <span>{capitalize(leg.constituency)}</span>
                    </div>
                    <PartyBadge party={leg.party} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Cargos e Funcoes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deputy.positions.length === 0 ? (
                <p className="text-muted-foreground">Sem cargos registados</p>
              ) : (
                <div className="space-y-4">
                  {deputy.positions.map((pos) => (
                    <div
                      key={pos.id}
                      className="p-4 rounded-lg border space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{pos.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {pos.entity}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {pos.isActive && (
                            <Badge variant="default">Ativo</Badge>
                          )}
                          <Badge variant={pos.isRemunerated ? "secondary" : "outline"}>
                            {pos.isRemunerated ? "Remunerado" : "Nao remunerado"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {formatDate(pos.startDate)} -{" "}
                          {pos.endDate ? formatDate(pos.endDate) : "Presente"}
                        </span>
                        {pos.location && <span>{pos.location}</span>}
                        {pos.nature && <Badge variant="outline">{pos.nature}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Apoios Recebidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deputy.benefits.length === 0 ? (
                <p className="text-muted-foreground">Sem apoios registados</p>
              ) : (
                <div className="space-y-4">
                  {deputy.benefits.map((ben) => (
                    <div
                      key={ben.id}
                      className="p-4 rounded-lg border space-y-2"
                    >
                      <div>
                        <h4 className="font-semibold">{ben.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {ben.entity}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{ben.date}</span>
                        {ben.area && <Badge variant="outline">{ben.area}</Badge>}
                        {ben.nature && (
                          <span className="text-xs">{ben.nature}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shareholdings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Participacoes Societarias
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deputy.shareholdings.length === 0 ? (
                <p className="text-muted-foreground">
                  Sem participacoes societarias registadas
                </p>
              ) : (
                <div className="space-y-4">
                  {deputy.shareholdings.map((share) => (
                    <div
                      key={share.id}
                      className="p-4 rounded-lg border space-y-2"
                    >
                      <h4 className="font-semibold">{share.company}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Participacao: {share.participation}</span>
                        {share.location && <span>{share.location}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="committees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Comissoes Parlamentares
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deputy.committees.length === 0 ? (
                <p className="text-muted-foreground">
                  Sem comissoes registadas
                </p>
              ) : (
                <div className="space-y-3">
                  {deputy.committees.map((com, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium">{com.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {com.abbreviation} - Legislatura {com.legislature}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{com.membershipType}</Badge>
                        {com.role && <Badge>{com.role}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
