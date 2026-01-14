import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PartyBadge } from "./PartyBadge";
import { MapPin, Briefcase, User } from "lucide-react";
import type { DeputyListItem } from "../types/deputy.types";
import { capitalize } from "@/lib/utils";

interface DeputyCardProps {
  deputy: DeputyListItem;
}

export function DeputyCard({ deputy }: DeputyCardProps) {
  return (
    <Link to="/deputies/$deputyId" params={{ deputyId: deputy.id }}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg leading-tight">
                {capitalize(deputy.parliamentaryName)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {capitalize(deputy.fullName)}
              </p>
            </div>
            <PartyBadge party={deputy.party} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{capitalize(deputy.constituency)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" />
            <span>{deputy.profession || "Nao especificado"}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>
              {deputy.gender === "M" ? "Masculino" : "Feminino"}
              {deputy.age && `, ${deputy.age} anos`}
            </span>
          </div>

          <div className="flex gap-2 mt-3 flex-wrap">
            {deputy.activeCargos > 0 && (
              <Badge variant="secondary">
                {deputy.activeCargos} cargo{deputy.activeCargos > 1 ? "s" : ""} ativo
                {deputy.activeCargos > 1 ? "s" : ""}
              </Badge>
            )}
            {deputy.totalBenefits > 0 && (
              <Badge variant="outline">
                {deputy.totalBenefits} apoio{deputy.totalBenefits > 1 ? "s" : ""}
              </Badge>
            )}
            {deputy.totalShareholdings > 0 && (
              <Badge variant="outline">
                {deputy.totalShareholdings} sociedade
                {deputy.totalShareholdings > 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {deputy.currentPosition && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-sm font-medium text-primary">
                {deputy.currentPosition}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
