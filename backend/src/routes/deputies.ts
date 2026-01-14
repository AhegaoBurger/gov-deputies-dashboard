import { Hono } from "hono";
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
} from "../lib/deputies-data.js";

const deputiesRoutes = new Hono();

// Deputies endpoints
deputiesRoutes.get("/deputies", (c) => {
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

deputiesRoutes.get("/deputies/:id", (c) => {
  const id = c.req.param("id");
  const deputy = getDeputyById(id);

  if (!deputy) {
    return c.json({ error: "Deputy not found" }, 404);
  }

  return c.json({ data: deputy });
});

// Filters endpoint
deputiesRoutes.get("/filters", (c) => {
  return c.json(getFilters());
});

// Analytics endpoints
deputiesRoutes.get("/analytics/summary", (c) => {
  return c.json(getAnalyticsSummary());
});

deputiesRoutes.get("/analytics/parties", (c) => {
  return c.json(getPartyBreakdown());
});

deputiesRoutes.get("/analytics/gender", (c) => {
  return c.json(getGenderDistribution());
});

deputiesRoutes.get("/analytics/age", (c) => {
  return c.json(getAgeDistribution());
});

deputiesRoutes.get("/analytics/constituencies", (c) => {
  return c.json(getConstituencyBreakdown());
});

deputiesRoutes.get("/analytics/professions", (c) => {
  const limit = parseInt(c.req.query("limit") || "15");
  return c.json(getProfessionBreakdown(limit));
});

// Positions endpoints
deputiesRoutes.get("/positions", (c) => {
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
deputiesRoutes.get("/benefits", (c) => {
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
deputiesRoutes.get("/shareholdings", (c) => {
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

export { deputiesRoutes };
