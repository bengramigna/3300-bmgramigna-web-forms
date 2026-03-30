import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function Home() {
  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="w-full max-w-lg shadow-lg border-muted">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round" className="text-primary">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-accent">Student Free Time Survey</CardTitle>
            <CardDescription className="text-base mt-3 text-foreground/80">
              Welcome, undergraduate business students. This short survey helps us understand how you spend your free time. Your responses are anonymous and will be aggregated with your peers.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center pb-10">
            <Button asChild size="lg" className="w-full sm:w-auto text-base px-8">
              <Link href="/survey">
                Take the Survey
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto text-base px-8 text-secondary-foreground hover:bg-secondary/90">
              <Link href="/results">
                View Results
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
