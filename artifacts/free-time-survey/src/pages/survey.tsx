import { useState, useEffect } from "react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitSurvey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

const SPORTS_OPTIONS = [
  "Baseball", "Football", "Soccer", "Basketball", "Hockey", "Cheer", "Softwall", "Track and Field", "Cross Country", "Golf", "Dance", "Gymnastics", "Esports", "None"
];

const RESTAURANT_OPTIONS = [
  "Mickey's", "Chop House", "Joseph's", "Mesa", "St. Burch", "Other"
];

const surveySchema = z.object({
  gpa: z.string().min(1, "GPA is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 4.0;
  }, "GPA must be a number between 0.00 and 4.00"),
  state: z.string().min(1, "Please select a state"),
  sports: z.array(z.string()).min(1, "Please select at least one option"),
  restaurants: z.array(z.string()).min(1, "Please select at least one option"),
  other_restaurant: z.string().optional()
}).refine((data) => {
  if (data.restaurants.includes("Other") && (!data.other_restaurant || data.other_restaurant.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Please specify the other restaurant",
  path: ["other_restaurant"]
});

type SurveyFormValues = z.infer<typeof surveySchema>;

export default function Survey() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<SurveyFormValues | null>(null);

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      gpa: "",
      state: "",
      sports: [],
      restaurants: [],
      other_restaurant: ""
    }
  });

  const submitMutation = useSubmitSurvey();

  const watchRestaurants = form.watch("restaurants");
  const isOtherRestaurantSelected = watchRestaurants?.includes("Other");

  useEffect(() => {
    if (isOtherRestaurantSelected) {
      setTimeout(() => {
        document.getElementById("other_restaurant")?.focus();
      }, 50);
    }
  }, [isOtherRestaurantSelected]);

  const onSubmit = (data: SurveyFormValues) => {
    submitMutation.mutate({ data }, {
      onSuccess: () => {
        setSubmittedData(data);
        setIsSuccess(true);
      }
    });
  };

  const handleReset = () => {
    form.reset();
    setIsSuccess(false);
    setSubmittedData(null);
  };

  if (isSuccess && submittedData) {
    return (
      <Layout>
        <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 max-w-2xl mx-auto w-full">
          <Card className="w-full shadow-lg border-muted">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className="text-green-600">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <CardTitle className="text-2xl font-bold text-accent">Thank You!</CardTitle>
              <CardDescription className="text-base mt-2">
                Your response has been recorded successfully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-6 space-y-4 text-sm">
                <h3 className="font-semibold text-accent border-b pb-2">Response Summary</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-muted-foreground font-medium">GPA</div>
                  <div className="col-span-2 font-medium">{submittedData.gpa}</div>
                  
                  <div className="text-muted-foreground font-medium">State</div>
                  <div className="col-span-2 font-medium">{submittedData.state}</div>
                  
                  <div className="text-muted-foreground font-medium">Sports</div>
                  <div className="col-span-2 font-medium">{submittedData.sports.join(", ")}</div>
                  
                  <div className="text-muted-foreground font-medium">Restaurants</div>
                  <div className="col-span-2 font-medium">
                    {submittedData.restaurants.map(r => r === "Other" ? `Other (${submittedData.other_restaurant})` : r).join(", ")}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                Submit Another Response
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/results">
                  View Results
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-accent">Survey</h1>
            <p className="text-muted-foreground mt-1">Please answer all questions below.</p>
          </div>
          <Link href="/results" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            View Results →
          </Link>
        </div>

        <Card className="shadow-sm border-muted">
          <CardContent className="pt-6">
            {submitMutation.isError && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Submission Failed</AlertTitle>
                <AlertDescription>
                  There was a problem submitting your survey. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Q1: GPA */}
                <FormField
                  control={form.control}
                  name="gpa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">1. High School GPA</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 3.00" autoFocus {...field} className="max-w-xs" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Q2: State */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">2. What state are you from?</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="max-w-xs">
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {US_STATES.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Q3: Sports */}
                <FormField
                  control={form.control}
                  name="sports"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">3. What sports did you play in high school?</FormLabel>
                        <FormDescription>Select all that apply.</FormDescription>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {SPORTS_OPTIONS.map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="sports"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer text-sm">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Q4: Restaurants */}
                <FormField
                  control={form.control}
                  name="restaurants"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">4. What is your favorite Iowa City restaurant?</FormLabel>
                        <FormDescription>Select all that apply.</FormDescription>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {RESTAURANT_OPTIONS.map((item) => (
                          <FormField
                            key={item}
                            control={form.control}
                            name="restaurants"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item}
                                  className="flex flex-row items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(item)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, item])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== item
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer text-sm">
                                    {item}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isOtherRestaurantSelected && (
                  <div className="pl-7 animate-in slide-in-from-top-2 fade-in duration-200">
                    <FormField
                      control={form.control}
                      name="other_restaurant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm">Please specify the restaurant</FormLabel>
                          <FormControl>
                            <Input id="other_restaurant" placeholder="Restaurant name" {...field} className="max-w-xs" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="pt-6 border-t border-border">
                  <Button type="submit" size="lg" className="w-full sm:w-auto px-8" disabled={submitMutation.isPending}>
                    {submitMutation.isPending ? "Submitting..." : "Submit Survey"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
