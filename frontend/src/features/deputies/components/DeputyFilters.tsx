import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useFilters } from "../api/deputies.queries";
import type { DeputyFilters as Filters, DeputySortField } from "../types/deputy.types";

interface DeputyFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  sort: DeputySortField;
  onSortChange: (sort: DeputySortField) => void;
}

export function DeputyFilters({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
}: DeputyFiltersProps) {
  const { data: filterOptions } = useFilters();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value || undefined });
  };

  const handlePartyChange = (value: string) => {
    onFiltersChange({
      ...filters,
      party: value === "all" ? undefined : value,
    });
  };

  const handleConstituencyChange = (value: string) => {
    onFiltersChange({
      ...filters,
      constituency: value === "all" ? undefined : value,
    });
  };

  const handleGenderChange = (value: string) => {
    onFiltersChange({
      ...filters,
      gender: value === "all" ? undefined : (value as "M" | "F"),
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.search || filters.party || filters.constituency || filters.gender;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar deputado..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>

        <Select value={filters.party || "all"} onValueChange={handlePartyChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Partido" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os partidos</SelectItem>
            {filterOptions?.parties.map((party) => (
              <SelectItem key={party} value={party}>
                {party}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.constituency || "all"}
          onValueChange={handleConstituencyChange}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Circulo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os circulos</SelectItem>
            {filterOptions?.constituencies.map((constituency) => (
              <SelectItem key={constituency} value={constituency}>
                {constituency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.gender || "all"} onValueChange={handleGenderChange}>
          <SelectTrigger className="w-full md:w-[140px]">
            <SelectValue placeholder="Genero" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="M">Masculino</SelectItem>
            <SelectItem value="F">Feminino</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => onSortChange(v as DeputySortField)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fullName">Nome</SelectItem>
            <SelectItem value="party">Partido</SelectItem>
            <SelectItem value="constituency">Circulo</SelectItem>
            <SelectItem value="age">Idade</SelectItem>
            <SelectItem value="activeCargos">Cargos ativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
