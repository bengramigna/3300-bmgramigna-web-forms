import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { useGetSurveyResults, getGetSurveyResultsQueryKey } from "@workspace/api-client-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Results() {
  const { data, isLoading, isError } = useGetSurveyResults({
    query: {
      queryKey: getGetSurveyResultsQueryKey()
    }
  });

  const chartColor = "hsl(173 80% 40%)"; // Secondary teal color
  const gridColor = "hsl(214 32% 91%)"; // Muted border

  return (
    <Layout>
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-accent">Survey Results</h1>
            <p className="text-muted-foreground mt-1">Aggregated data from all students</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/">
              Home
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-80 w-full rounded-xl" />
              <Skeleton className="h-80 w-full rounded-xl" />
              <Skeleton className="h-80 w-full rounded-xl" />
              <Skeleton className="h-80 w-full rounded-xl" />
            </div>
          </div>
        ) : isError || !data ? (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Results</CardTitle>
              <CardDescription>Could not fetch survey data. Please try again later.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Total Responses */}
            <Card className="shadow-sm border-muted bg-primary/5">
              <CardContent className="flex flex-col items-center justify-center p-8">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Total Responses</p>
                <div className="text-6xl font-bold text-primary">{data.total_responses}</div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GPA Distribution */}
              <Card className="shadow-sm border-muted">
                <CardHeader>
                  <CardTitle className="text-lg">GPA Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.gpa_distribution} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                      <Bar dataKey="count" fill={chartColor} radius={[4, 4, 0, 0]}>
                        <LabelList dataKey="count" position="top" style={{ fill: 'var(--color-foreground)', fontSize: 12 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top States */}
              <Card className="shadow-sm border-muted">
                <CardHeader>
                  <CardTitle className="text-lg">Top States Represented</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.top_states} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="state" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={80} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                      <Bar dataKey="count" fill={chartColor} radius={[0, 4, 4, 0]} barSize={20}>
                        <LabelList dataKey="percentage" position="right" formatter={(v: number) => `${v}%`} style={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Most Popular Sports */}
              <Card className="shadow-sm border-muted">
                <CardHeader>
                  <CardTitle className="text-lg">Most Popular Sports</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.sports_counts} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="sport" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={90} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                      <Bar dataKey="count" fill={chartColor} radius={[0, 4, 4, 0]} barSize={20}>
                        <LabelList dataKey="count" position="right" style={{ fill: 'var(--color-foreground)', fontSize: 12 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Favorite Restaurants */}
              <Card className="shadow-sm border-muted">
                <CardHeader>
                  <CardTitle className="text-lg">Favorite Restaurants</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.restaurant_counts} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={gridColor} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="restaurant" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} width={90} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)' }} />
                      <Bar dataKey="count" fill={chartColor} radius={[0, 4, 4, 0]} barSize={20}>
                        <LabelList dataKey="count" position="right" style={{ fill: 'var(--color-foreground)', fontSize: 12 }} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
