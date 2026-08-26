'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Copy,
  Check,
  Globe2,
  Sparkles,
} from 'lucide-react';

type CompletionItem = {
  label: string;
  complete: boolean;
};

type PortfolioStatusCardProps = {
  completionItems: CompletionItem[];
  portfolioCompletion: number;
  portfolioUrl?: string | null;
};

export default function PortfolioStatusCard({
  completionItems,
  portfolioCompletion,
  portfolioUrl,
}: PortfolioStatusCardProps) {
  const [copied, setCopied] = useState(false);
  const isComplete = portfolioCompletion === 100;

  const handleCopy = async () => {
    if (!portfolioUrl) return;
    await navigator.clipboard.writeText(portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="relative mt-6 overflow-hidden border bg-gradient-to-br from-card via-card/95 to-accent/10 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md">
      {/* Background Glow */}
      <div
        className={`absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-50 pointer-events-none ${
          isComplete ? 'bg-emerald-500/20' : 'bg-primary/15'
        }`}
      />

      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold tracking-tight">
                {isComplete
                  ? '🎉 Your portfolio is ready!'
                  : 'Complete your portfolio'}
              </CardTitle>
              {isComplete && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="h-3 w-3" /> Live
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              {isComplete
                ? 'Your public portfolio is ready to share with recruiters.'
                : 'Complete the sections below to build your public portfolio.'}
            </p>
          </div>

          <div className="flex items-baseline gap-1 self-start sm:self-auto">
            <span className="font-mono text-3xl font-black tracking-tight text-primary">
              {portfolioCompletion}%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress
            value={portfolioCompletion}
            className="h-2.5 w-full bg-muted/80"
          />
        </div>

        {/* Completion Items Grid */}
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {completionItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center justify-between rounded-lg border p-3 text-xs font-medium transition-all ${
                item.complete
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-foreground'
                  : 'border-border/60 bg-muted/20 text-muted-foreground'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.complete ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground/50" />
                )}
                <span className="font-medium">{item.label}</span>
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                {item.complete ? 'Done' : 'Pending'}
              </span>
            </div>
          ))}
        </div>

        {/* Public Portfolio Link & Actions */}
        {portfolioUrl && (
          <div className="flex flex-col gap-3 rounded-xl border bg-muted/30 p-4 backdrop-blur-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted/50 text-primary">
                <Globe2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Your public portfolio
                </p>
                <p className="truncate font-mono text-xs font-semibold text-foreground">
                  {portfolioUrl}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs transition-all hover:bg-primary/90"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                View Portfolio
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
