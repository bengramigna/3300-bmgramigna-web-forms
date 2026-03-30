import { Router, type IRouter } from "express";
import { db, surveyResponsesTable } from "@workspace/db";
import { SubmitSurveyBody, GetSurveyResultsResponse } from "@workspace/api-zod";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.post("/survey", async (req, res): Promise<void> => {
  const parsed = SubmitSurveyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation error", details: parsed.error.message });
    return;
  }

  const { gpa, state, sports, restaurants, other_restaurant } = parsed.data;

  const [inserted] = await db
    .insert(surveyResponsesTable)
    .values({
      gpa,
      state,
      sports,
      restaurants,
      otherRestaurant: other_restaurant ?? null,
    })
    .returning();

  res.status(201).json({
    id: inserted.id,
    created_at: inserted.createdAt,
    gpa: inserted.gpa,
    state: inserted.state,
    sports: inserted.sports,
    restaurants: inserted.restaurants,
    other_restaurant: inserted.otherRestaurant,
  });
});

router.get("/survey/results", async (req, res): Promise<void> => {
  const totalResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(surveyResponsesTable);
  const total = totalResult[0]?.count ?? 0;

  const allRows = await db
    .select({
      gpa: surveyResponsesTable.gpa,
      sports: surveyResponsesTable.sports,
      restaurants: surveyResponsesTable.restaurants,
      state: surveyResponsesTable.state,
      otherRestaurant: surveyResponsesTable.otherRestaurant,
    })
    .from(surveyResponsesTable);

  const gpaRanges = [
    { range: "0.0-1.9", min: 0, max: 1.9 },
    { range: "2.0-2.4", min: 2.0, max: 2.4 },
    { range: "2.5-2.9", min: 2.5, max: 2.9 },
    { range: "3.0-3.4", min: 3.0, max: 3.4 },
    { range: "3.5-4.0", min: 3.5, max: 4.0 },
  ];

  const gpaCounts: Record<string, number> = {};
  for (const r of gpaRanges) gpaCounts[r.range] = 0;
  for (const row of allRows) {
    const val = parseFloat(row.gpa);
    if (!isNaN(val)) {
      for (const r of gpaRanges) {
        if (val >= r.min && val <= r.max) {
          gpaCounts[r.range]++;
          break;
        }
      }
    }
  }
  const gpa_distribution = gpaRanges.map((r) => ({ range: r.range, count: gpaCounts[r.range] }));

  const sportsCounts: Record<string, number> = {};
  for (const row of allRows) {
    for (const sport of row.sports) {
      sportsCounts[sport] = (sportsCounts[sport] ?? 0) + 1;
    }
  }
  const sports_counts = Object.entries(sportsCounts)
    .map(([sport, count]) => ({ sport, count }))
    .sort((a, b) => b.count - a.count);

  const restaurantCounts: Record<string, number> = {};
  for (const row of allRows) {
    for (const r of row.restaurants) {
      if (r === "Other" && row.otherRestaurant) {
        const name = row.otherRestaurant.trim();
        if (name) {
          restaurantCounts[name] = (restaurantCounts[name] ?? 0) + 1;
        }
      } else if (r !== "Other") {
        restaurantCounts[r] = (restaurantCounts[r] ?? 0) + 1;
      }
    }
  }
  const restaurant_counts = Object.entries(restaurantCounts)
    .map(([restaurant, count]) => ({ restaurant, count }))
    .sort((a, b) => b.count - a.count);

  const stateCounts: Record<string, number> = {};
  for (const row of allRows) {
    stateCounts[row.state] = (stateCounts[row.state] ?? 0) + 1;
  }
  const top_states = Object.entries(stateCounts)
    .map(([state, count]) => ({
      state,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const result = GetSurveyResultsResponse.parse({
    total_responses: total,
    gpa_distribution,
    sports_counts,
    restaurant_counts,
    top_states,
  });

  res.json(result);
});

export default router;
