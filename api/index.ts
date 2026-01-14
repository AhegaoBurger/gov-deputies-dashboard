import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import {
  getDeputies,
  getDeputyById,
  getFilters,
  getAnalyticsSummary,
  getPartyBreakdown,
  getGenderDistribution,
  getAgeDistribution,
  getConstituencyBreakdown,
  getProfessionBreakdown,
  getAllPositions,
  getAllBenefits,
  getAllShareholdings,
} from "./lib/deputies-data.js";

const app = new Hono().basePath("/api");

// CORS middleware
app.use(
  "*",
  cors({
    origin: (origin) => origin || "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Deputies endpoints
app.get("/deputies", (c) => {
  const search = c.req.query("search");
  const party = c.req.query("party");
  const constituency = c.req.query("constituency");
  const gender = c.req.query("gender") as "M" | "F" | undefined;
  const limit = parseInt(c.req.query("limit") || "20");
  const offset = parseInt(c.req.query("offset") || "0");
  const sort = c.req.query("sort");
  const ascending = c.req.query("ascending") !== "false";

  const result = getDeputies({
    search,
    party,
    constituency,
    gender,
    limit,
    offset,
    sort,
    ascending,
  });

  return c.json(result);
});

app.get("/deputies/:id", (c) => {
  const id = c.req.param("id");
  const deputy = getDeputyById(id);

  if (!deputy) {
    return c.json({ error: "Deputy not found" }, 404);
  }

  return c.json({ data: deputy });
});

// Filters endpoint
app.get("/filters", (c) => {
  return c.json(getFilters());
});

// Analytics endpoints
app.get("/analytics/summary", (c) => {
  return c.json(getAnalyticsSummary());
});

app.get("/analytics/parties", (c) => {
  return c.json(getPartyBreakdown());
});

app.get("/analytics/gender", (c) => {
  return c.json(getGenderDistribution());
});

app.get("/analytics/age", (c) => {
  return c.json(getAgeDistribution());
});

app.get("/analytics/constituencies", (c) => {
  return c.json(getConstituencyBreakdown());
});

app.get("/analytics/professions", (c) => {
  const limit = parseInt(c.req.query("limit") || "15");
  return c.json(getProfessionBreakdown(limit));
});

// Positions endpoints
app.get("/positions", (c) => {
  const deputyId = c.req.query("deputyId");
  const active = c.req.query("active");
  const nature = c.req.query("nature");
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = parseInt(c.req.query("offset") || "0");

  const result = getAllPositions({
    deputyId,
    active: active === undefined ? undefined : active === "true",
    nature,
    limit,
    offset,
  });

  return c.json(result);
});

// Benefits endpoints
app.get("/benefits", (c) => {
  const deputyId = c.req.query("deputyId");
  const area = c.req.query("area");
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = parseInt(c.req.query("offset") || "0");

  const result = getAllBenefits({
    deputyId,
    area,
    limit,
    offset,
  });

  return c.json(result);
});

// Shareholdings endpoints
app.get("/shareholdings", (c) => {
  const deputyId = c.req.query("deputyId");
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = parseInt(c.req.query("offset") || "0");

  const result = getAllShareholdings({
    deputyId,
    limit,
    offset,
  });

  return c.json(result);
});

// Export for Vercel
export default handle(app);
