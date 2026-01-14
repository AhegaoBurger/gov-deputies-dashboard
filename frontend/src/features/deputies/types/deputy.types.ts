export interface Deputy {
  id: string;
  fullName: string;
  parliamentaryName: string;
  profession: string;
  gender: "M" | "F";
  birthDate: string | null;
  age: number | null;
  constituency: string;
  constituencyId: string;
  party: string;
  currentLegislature: string;
  status: string;
  currentPosition: string | null;
  education: Education[];
  legislatureHistory: LegislatureEntry[];
  positions: Position[];
  benefits: Benefit[];
  shareholdings: Shareholding[];
  committees: Committee[];
  activeCargos: number;
  allCargos: number;
}

export interface Education {
  degree: string;
  status: string;
  typeId: string;
}

export interface LegislatureEntry {
  legislature: string;
  party: string;
  partyFullName: string;
  constituency: string;
  coalition?: string;
}

export interface Position {
  id: string;
  title: string;
  entity: string;
  location: string;
  nature: string;
  startDate: string;
  endDate: string | null;
  isRemunerated: boolean;
  isActive: boolean;
  deputyId: string;
  deputyName: string;
}

export interface Benefit {
  id: string;
  description: string;
  date: string;
  entity: string;
  area: string;
  nature: string;
  deputyId: string;
  deputyName: string;
}

export interface Shareholding {
  id: string;
  company: string;
  participation: string;
  location: string;
  deputyId: string;
  deputyName: string;
}

export interface Committee {
  name: string;
  abbreviation: string;
  legislature: string;
  membershipType: string;
  role?: string;
}

export interface DeputyListItem {
  id: string;
  fullName: string;
  parliamentaryName: string;
  party: string;
  constituency: string;
  gender: "M" | "F";
  age: number | null;
  profession: string;
  currentPosition: string | null;
  activeCargos: number;
  totalBenefits: number;
  totalShareholdings: number;
}

export interface DeputiesResponse {
  data: DeputyListItem[];
  total: number;
}

export interface DeputyResponse {
  data: Deputy;
}

export interface FiltersResponse {
  parties: string[];
  constituencies: string[];
  legislatures: string[];
}

export interface DeputyFilters {
  search?: string;
  party?: string;
  constituency?: string;
  gender?: "M" | "F";
}

export type DeputySortField = "fullName" | "party" | "constituency" | "age" | "activeCargos";
