import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Types for raw data
interface RawDeputyData {
  cadId: string;
  cadNomeCompleto: string;
  cadProfissao?: string;
  cadSexo: "M" | "F";
  cadDtNascimento?: string;
  cadHabilitacoes?: {
    pt_ar_wsgode_objectos_DadosHabilitacoes:
      | HabilitacoesData
      | HabilitacoesData[];
  };
  cadDeputadoLegis?: {
    pt_ar_wsgode_objectos_DadosDeputadoLegis: LegislaturaData[];
  };
  basicInfo: {
    depNomeParlamentar: string;
    depCPDes: string;
    depCPId: string;
    depId: string;
    legDes: string;
    depGP?: {
      pt_ar_wsgode_objectos_DadosSituacaoGP: {
        gpSigla: string;
        gpDtInicio: string;
        gpDtFim?: string;
      };
    };
    depSituacao?: {
      pt_ar_wsgode_objectos_DadosSituacaoDeputado: {
        sioDes: string;
        sioDtInicio: string;
      };
    };
    depCargo?: {
      pt_ar_wsgode_objectos_DadosCargoDeputado: {
        carDes: string;
        carDtInicio: string;
      };
    };
  };
  activitiesCounts: {
    ActiveCargos: number;
    AllCargos: number;
    Other: number;
  };
  RegistoInteresses?: {
    GenCargosMenosTresAnos?: {
      GenCargo?: CargoData | CargoData[];
    };
    GenCargosMaisTresAnos?: {
      GenCargo?: CargoData | CargoData[];
    };
    GenApoios?: {
      GenApoio?: ApoioData | ApoioData[];
    };
    GenSociedade?: {
      GenSoc?: SociedadeData | SociedadeData[];
    };
  };
  cadActividadeOrgaos?: {
    actividadeCom?: {
      pt_ar_wsgode_objectos_DadosOrgaos: OrgaoData | OrgaoData[];
    };
  };
}

interface HabilitacoesData {
  habDes: string;
  habEstado: string;
  habTipoId: string;
}

interface LegislaturaData {
  legDes: string;
  gpSigla: string;
  gpDes: string;
  ceDes: string;
  parSigla?: string;
  parDes?: string;
}

interface CargoData {
  CargoFuncaoAtividade: string;
  Entidade: string;
  LocalSede?: string;
  Natureza?: string;
  DataInicio: string;
  DataTermo: string | null;
  Remunerada: string;
  IdCadastroGODE: string;
}

interface ApoioData {
  Apoio: string;
  Data: string;
  Entidade: string;
  NaturezaArea?: string;
  NaturezaBeneficio?: string;
  IdCadastroGODE: string;
}

interface SociedadeData {
  Sociedade: string;
  Participacao: string;
  Local?: string;
  IdCadastroGODE: string;
}

interface OrgaoData {
  orgDes: string;
  orgSigla: string;
  legDes: string;
  timDes: string;
  tiaDes?: string;
}

// Transformed types
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

// Cached data
let deputiesCache: Deputy[] | null = null;
let activitiesCache: Activity[] | null = null;

interface Activity {
  id: string;
  type: string;
  deputyId: string;
  deputyName: string;
  data: Record<string, unknown>;
}

function calculateAge(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function toArray<T>(data: T | T[] | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
}

function transformDeputy(raw: RawDeputyData, index: number): Deputy {
  const birthDate = raw.cadDtNascimento || null;

  // Extract education
  const habData = raw.cadHabilitacoes?.pt_ar_wsgode_objectos_DadosHabilitacoes;
  const education: Education[] = toArray(habData).map((h) => ({
    degree: h.habDes,
    status: h.habEstado,
    typeId: h.habTipoId,
  }));

  // Extract legislature history
  const legisData = toArray(
    raw.cadDeputadoLegis?.pt_ar_wsgode_objectos_DadosDeputadoLegis
  );
  const legislatureHistory: LegislatureEntry[] = legisData.map((l) => ({
    legislature: l.legDes,
    party: l.gpSigla,
    partyFullName: l.gpDes,
    constituency: l.ceDes,
    coalition: l.parSigla,
  }));

  // Extract positions
  const cargosMenos = toArray(
    raw.RegistoInteresses?.GenCargosMenosTresAnos?.GenCargo
  );
  const cargosMais = toArray(
    raw.RegistoInteresses?.GenCargosMaisTresAnos?.GenCargo
  );
  const allCargos = [...cargosMenos, ...cargosMais];

  const positions: Position[] = allCargos.map((c, i) => ({
    id: `${raw.cadId}-pos-${i}`,
    title: c.CargoFuncaoAtividade,
    entity: c.Entidade,
    location: c.LocalSede || "",
    nature: c.Natureza || "",
    startDate: c.DataInicio,
    endDate: c.DataTermo,
    isRemunerated: c.Remunerada === "48",
    isActive: !c.DataTermo,
    deputyId: raw.cadId,
    deputyName: raw.cadNomeCompleto,
  }));

  // Extract benefits
  const apoiosData = toArray(raw.RegistoInteresses?.GenApoios?.GenApoio);
  const benefits: Benefit[] = apoiosData.map((a, i) => ({
    id: `${raw.cadId}-ben-${i}`,
    description: a.Apoio,
    date: a.Data,
    entity: a.Entidade,
    area: a.NaturezaArea || "",
    nature: a.NaturezaBeneficio || "",
    deputyId: raw.cadId,
    deputyName: raw.cadNomeCompleto,
  }));

  // Extract shareholdings
  const socData = toArray(raw.RegistoInteresses?.GenSociedade?.GenSoc);
  const shareholdings: Shareholding[] = socData.map((s, i) => ({
    id: `${raw.cadId}-share-${i}`,
    company: s.Sociedade,
    participation: s.Participacao,
    location: s.Local || "",
    deputyId: raw.cadId,
    deputyName: raw.cadNomeCompleto,
  }));

  // Extract committees
  const orgData = raw.cadActividadeOrgaos?.actividadeCom
    ?.pt_ar_wsgode_objectos_DadosOrgaos;
  const committees: Committee[] = toArray(orgData).map((o) => ({
    name: o.orgDes,
    abbreviation: o.orgSigla,
    legislature: o.legDes,
    membershipType: o.timDes,
    role: o.tiaDes,
  }));

  // Get party from basicInfo
  const party =
    raw.basicInfo.depGP?.pt_ar_wsgode_objectos_DadosSituacaoGP?.gpSigla ||
    legislatureHistory[0]?.party ||
    "Ind";

  // Get current position
  const currentPosition =
    raw.basicInfo.depCargo?.pt_ar_wsgode_objectos_DadosCargoDeputado?.carDes ||
    null;

  // Get status
  const status =
    raw.basicInfo.depSituacao?.pt_ar_wsgode_objectos_DadosSituacaoDeputado
      ?.sioDes || "Efetivo";

  return {
    id: raw.cadId,
    fullName: raw.cadNomeCompleto,
    parliamentaryName: raw.basicInfo.depNomeParlamentar,
    profession: raw.cadProfissao || "Não especificado",
    gender: raw.cadSexo,
    birthDate,
    age: calculateAge(birthDate),
    constituency: raw.basicInfo.depCPDes,
    constituencyId: raw.basicInfo.depCPId,
    party,
    currentLegislature: raw.basicInfo.legDes,
    status,
    currentPosition,
    education,
    legislatureHistory,
    positions,
    benefits,
    shareholdings,
    committees,
    activeCargos: raw.activitiesCounts.ActiveCargos,
    allCargos: raw.activitiesCounts.AllCargos,
  };
}

function loadDeputies(): Deputy[] {
  if (deputiesCache) return deputiesCache;

  const dataPath = join(__dirname, "../../../data/portuguese_gov.json");
  const rawData = JSON.parse(readFileSync(dataPath, "utf-8")) as RawDeputyData[];

  // Load activities for shareholdings
  const activities = loadActivities();
  const shareholdingsByDeputy: Record<string, Shareholding[]> = {};

  activities
    .filter((a) => a.type === "GenSociedade")
    .forEach((a, index) => {
      const deputyId = a.deputyId;
      if (!shareholdingsByDeputy[deputyId]) {
        shareholdingsByDeputy[deputyId] = [];
      }
      shareholdingsByDeputy[deputyId].push({
        id: `share-${index}`,
        company: (a.data.Sociedade as string) || "",
        participation: (a.data.Participacao as string) || "",
        location: (a.data.LocalSede as string) || "",
        deputyId,
        deputyName: a.deputyName,
      });
    });

  deputiesCache = rawData.map((raw, index) => {
    const deputy = transformDeputy(raw, index);
    // Add shareholdings from activities file
    deputy.shareholdings = shareholdingsByDeputy[raw.cadId] || [];
    return deputy;
  });

  return deputiesCache;
}

function loadActivities(): Activity[] {
  if (activitiesCache) return activitiesCache;

  const dataPath = join(__dirname, "../../../data/portuguese_gov_2.json");
  const rawData = JSON.parse(readFileSync(dataPath, "utf-8")) as Record<
    string,
    unknown
  >[];

  activitiesCache = rawData.map((item, index) => ({
    id: `act-${index}`,
    type: (item.activityType as string) || "unknown",
    deputyId: String(item.IdCadastroGODE || ""),
    deputyName: (item.NomeIdentificacao as string) || "",
    data: item,
  }));

  return activitiesCache;
}

// API functions
export function getDeputies(options: {
  search?: string;
  party?: string;
  constituency?: string;
  gender?: "M" | "F";
  limit?: number;
  offset?: number;
  sort?: string;
  ascending?: boolean;
}): { data: DeputyListItem[]; total: number } {
  let deputies = loadDeputies();

  // Filter
  if (options.search) {
    const searchLower = options.search.toLowerCase();
    deputies = deputies.filter(
      (d) =>
        d.fullName.toLowerCase().includes(searchLower) ||
        d.parliamentaryName.toLowerCase().includes(searchLower)
    );
  }

  if (options.party) {
    deputies = deputies.filter((d) => d.party === options.party);
  }

  if (options.constituency) {
    deputies = deputies.filter((d) => d.constituency === options.constituency);
  }

  if (options.gender) {
    deputies = deputies.filter((d) => d.gender === options.gender);
  }

  const total = deputies.length;

  // Sort
  const sortField = options.sort || "fullName";
  const ascending = options.ascending !== false;

  deputies.sort((a, b) => {
    let aVal: string | number | null;
    let bVal: string | number | null;

    switch (sortField) {
      case "age":
        aVal = a.age;
        bVal = b.age;
        break;
      case "party":
        aVal = a.party;
        bVal = b.party;
        break;
      case "constituency":
        aVal = a.constituency;
        bVal = b.constituency;
        break;
      case "activeCargos":
        aVal = a.activeCargos;
        bVal = b.activeCargos;
        break;
      default:
        aVal = a.fullName;
        bVal = b.fullName;
    }

    if (aVal === null) return 1;
    if (bVal === null) return -1;

    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return ascending ? comparison : -comparison;
  });

  // Paginate
  const offset = options.offset || 0;
  const limit = options.limit || 20;
  const paginated = deputies.slice(offset, offset + limit);

  // Map to list items
  const data: DeputyListItem[] = paginated.map((d) => ({
    id: d.id,
    fullName: d.fullName,
    parliamentaryName: d.parliamentaryName,
    party: d.party,
    constituency: d.constituency,
    gender: d.gender,
    age: d.age,
    profession: d.profession,
    currentPosition: d.currentPosition,
    activeCargos: d.activeCargos,
    totalBenefits: d.benefits.length,
    totalShareholdings: d.shareholdings.length,
  }));

  return { data, total };
}

export function getDeputyById(id: string): Deputy | undefined {
  const deputies = loadDeputies();
  return deputies.find((d) => d.id === id);
}

export function getFilters(): {
  parties: string[];
  constituencies: string[];
  legislatures: string[];
} {
  const deputies = loadDeputies();

  const parties = [...new Set(deputies.map((d) => d.party))].sort();
  const constituencies = [...new Set(deputies.map((d) => d.constituency))].sort();
  const legislatures = [
    ...new Set(deputies.flatMap((d) => d.legislatureHistory.map((l) => l.legislature))),
  ].sort((a, b) => {
    // Sort legislatures in order (V, VI, VII, ..., XV)
    const romanToNum: Record<string, number> = {
      I: 1,
      II: 2,
      III: 3,
      IV: 4,
      V: 5,
      VI: 6,
      VII: 7,
      VIII: 8,
      IX: 9,
      X: 10,
      XI: 11,
      XII: 12,
      XIII: 13,
      XIV: 14,
      XV: 15,
    };
    return (romanToNum[a] || 0) - (romanToNum[b] || 0);
  });

  return { parties, constituencies, legislatures };
}

export function getAnalyticsSummary() {
  const deputies = loadDeputies();

  const maleCount = deputies.filter((d) => d.gender === "M").length;
  const femaleCount = deputies.filter((d) => d.gender === "F").length;
  const ages = deputies.map((d) => d.age).filter((a): a is number => a !== null);
  const avgAge = ages.length > 0 ? ages.reduce((a, b) => a + b, 0) / ages.length : 0;

  const totalPositions = deputies.reduce((sum, d) => sum + d.positions.length, 0);
  const deputiesWithBenefits = deputies.filter((d) => d.benefits.length > 0).length;
  const deputiesWithShareholdings = deputies.filter((d) => d.shareholdings.length > 0).length;

  return {
    totalDeputies: deputies.length,
    totalParties: new Set(deputies.map((d) => d.party)).size,
    totalConstituencies: new Set(deputies.map((d) => d.constituency)).size,
    averageAge: Math.round(avgAge * 10) / 10,
    genderRatio: {
      male: maleCount,
      female: femaleCount,
      malePercent: Math.round((maleCount / deputies.length) * 1000) / 10,
      femalePercent: Math.round((femaleCount / deputies.length) * 1000) / 10,
    },
    averagePositionsPerDeputy: Math.round((totalPositions / deputies.length) * 10) / 10,
    deputiesWithBenefits,
    deputiesWithShareholdings,
    totalPositions,
    totalBenefits: deputies.reduce((sum, d) => sum + d.benefits.length, 0),
    totalShareholdings: deputies.reduce((sum, d) => sum + d.shareholdings.length, 0),
  };
}

export function getPartyBreakdown() {
  const deputies = loadDeputies();
  const partyCount: Record<string, number> = {};

  deputies.forEach((d) => {
    partyCount[d.party] = (partyCount[d.party] || 0) + 1;
  });

  const total = deputies.length;

  return Object.entries(partyCount)
    .map(([party, count]) => ({
      party,
      count,
      percentage: Math.round((count / total) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getGenderDistribution() {
  const deputies = loadDeputies();

  const maleCount = deputies.filter((d) => d.gender === "M").length;
  const femaleCount = deputies.filter((d) => d.gender === "F").length;
  const total = deputies.length;

  // Get by party
  const partyGender: Record<string, { M: number; F: number }> = {};
  deputies.forEach((d) => {
    if (!partyGender[d.party]) {
      partyGender[d.party] = { M: 0, F: 0 };
    }
    partyGender[d.party][d.gender]++;
  });

  return {
    overall: [
      { gender: "M", label: "Masculino", count: maleCount, percentage: Math.round((maleCount / total) * 1000) / 10 },
      { gender: "F", label: "Feminino", count: femaleCount, percentage: Math.round((femaleCount / total) * 1000) / 10 },
    ],
    byParty: Object.entries(partyGender).map(([party, counts]) => ({
      party,
      male: counts.M,
      female: counts.F,
      total: counts.M + counts.F,
      femalePercent: Math.round((counts.F / (counts.M + counts.F)) * 1000) / 10,
    })),
  };
}

export function getAgeDistribution() {
  const deputies = loadDeputies();
  const ranges: Record<string, number> = {
    "< 30": 0,
    "30-39": 0,
    "40-49": 0,
    "50-59": 0,
    "60-69": 0,
    "70+": 0,
  };

  deputies.forEach((d) => {
    if (d.age === null) return;
    if (d.age < 30) ranges["< 30"]++;
    else if (d.age < 40) ranges["30-39"]++;
    else if (d.age < 50) ranges["40-49"]++;
    else if (d.age < 60) ranges["50-59"]++;
    else if (d.age < 70) ranges["60-69"]++;
    else ranges["70+"]++;
  });

  const total = deputies.filter((d) => d.age !== null).length;

  return Object.entries(ranges).map(([range, count]) => ({
    range,
    count,
    percentage: Math.round((count / total) * 1000) / 10,
  }));
}

export function getConstituencyBreakdown() {
  const deputies = loadDeputies();
  const constituencyData: Record<string, { count: number; parties: Record<string, number> }> = {};

  deputies.forEach((d) => {
    if (!constituencyData[d.constituency]) {
      constituencyData[d.constituency] = { count: 0, parties: {} };
    }
    constituencyData[d.constituency].count++;
    constituencyData[d.constituency].parties[d.party] =
      (constituencyData[d.constituency].parties[d.party] || 0) + 1;
  });

  return Object.entries(constituencyData)
    .map(([constituency, data]) => ({
      constituency,
      count: data.count,
      parties: Object.entries(data.parties)
        .map(([party, count]) => ({ party, count }))
        .sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.count - a.count);
}

export function getProfessionBreakdown(limit = 15) {
  const deputies = loadDeputies();
  const professionCount: Record<string, number> = {};

  deputies.forEach((d) => {
    const prof = d.profession || "Não especificado";
    professionCount[prof] = (professionCount[prof] || 0) + 1;
  });

  const total = deputies.length;

  return Object.entries(professionCount)
    .map(([profession, count]) => ({
      profession,
      count,
      percentage: Math.round((count / total) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getAllPositions(options: {
  deputyId?: string;
  active?: boolean;
  nature?: string;
  limit?: number;
  offset?: number;
}): { data: Position[]; total: number } {
  const deputies = loadDeputies();
  let positions = deputies.flatMap((d) => d.positions);

  if (options.deputyId) {
    positions = positions.filter((p) => p.deputyId === options.deputyId);
  }

  if (options.active !== undefined) {
    positions = positions.filter((p) => p.isActive === options.active);
  }

  if (options.nature) {
    positions = positions.filter((p) => p.nature === options.nature);
  }

  const total = positions.length;

  const offset = options.offset || 0;
  const limit = options.limit || 50;

  return {
    data: positions.slice(offset, offset + limit),
    total,
  };
}

export function getAllBenefits(options: {
  deputyId?: string;
  area?: string;
  limit?: number;
  offset?: number;
}): { data: Benefit[]; total: number } {
  const deputies = loadDeputies();
  let benefits = deputies.flatMap((d) => d.benefits);

  if (options.deputyId) {
    benefits = benefits.filter((b) => b.deputyId === options.deputyId);
  }

  if (options.area) {
    benefits = benefits.filter((b) => b.area === options.area);
  }

  const total = benefits.length;

  const offset = options.offset || 0;
  const limit = options.limit || 50;

  return {
    data: benefits.slice(offset, offset + limit),
    total,
  };
}

export function getAllShareholdings(options: {
  deputyId?: string;
  limit?: number;
  offset?: number;
}): { data: Shareholding[]; total: number } {
  const deputies = loadDeputies();
  let shareholdings = deputies.flatMap((d) => d.shareholdings);

  if (options.deputyId) {
    shareholdings = shareholdings.filter((s) => s.deputyId === options.deputyId);
  }

  const total = shareholdings.length;

  const offset = options.offset || 0;
  const limit = options.limit || 50;

  return {
    data: shareholdings.slice(offset, offset + limit),
    total,
  };
}
