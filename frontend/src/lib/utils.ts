import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Party colors for consistent styling
export const PARTY_COLORS: Record<string, string> = {
  PS: "#FF69B4",
  PSD: "#FF8C00",
  CH: "#1E3A8A",
  IL: "#00CED1",
  BE: "#DC143C",
  PCP: "#FF0000",
  "PCP-PEV": "#FF0000",
  PAN: "#228B22",
  L: "#90EE90",
  Ind: "#808080",
  CDS: "#0066CC",
  "CDS-PP": "#0066CC",
};

export const PARTY_FULL_NAMES: Record<string, string> = {
  PS: "Partido Socialista",
  PSD: "Partido Social Democrata",
  CH: "Chega",
  IL: "Iniciativa Liberal",
  BE: "Bloco de Esquerda",
  PCP: "Partido Comunista Portugues",
  "PCP-PEV": "CDU - Coligacao Democratica Unitaria",
  PAN: "Pessoas-Animais-Natureza",
  L: "Livre",
  Ind: "Independente",
  CDS: "CDS - Partido Popular",
  "CDS-PP": "CDS - Partido Popular",
};

export function getPartyColor(party: string): string {
  return PARTY_COLORS[party] || PARTY_COLORS["Ind"];
}

export function getPartyFullName(party: string): string {
  return PARTY_FULL_NAMES[party] || party;
}
