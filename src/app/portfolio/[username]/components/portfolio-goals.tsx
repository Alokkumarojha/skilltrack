import { Target, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';

type PortfolioGoalsProps = {
  goals: {
    id: string;
    title: string;
    description: string | null;
    progress: number;
    status: string;
    dueDate: Date | null;
  }[];
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getStatusBadgeClass(status: string, progress: number) {
  const normalized = status.toLowerCase();

  if (normalized.includes('completed') || progress >= 100) {
    return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  }

  if (normalized.includes('in_progress') || normalized.includes('active')) {
    return 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400';
  }

  return 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400';
}

export default function PortfolioGoals({ goals }: PortfolioGoalsProps) {
  if (!goals || goals.length === 0) {
    return null;
  }

  return (
    <section className="border-b bg-muted/20 py-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Goals & Focus
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              What I am currently working towards
            </p>
          </div>

          <span className="text-sm font-medium text-muted-foreground">
            {goals.length} {goals.length === 1 ? 'Goal' : 'Goals'}
          </span>
        </div>

        {/* Goals Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {goals.map((goal) => {
            const isCompleted =
              goal.progress >= 100 || goal.status.toLowerCase() === 'completed';

            return (
              <article
                key={goal.id}
                className="rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-6"
              >
                {/* Title + Status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                        isCompleted
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500'
                          : 'bg-muted text-primary'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Target className="h-5 w-5" />
                      )}
                    </div>

                    <h3 className="text-lg font-bold tracking-tight">
                      {goal.title}
                    </h3>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(
                      goal.status,
                      goal.progress
                    )}`}
                  >
                    {formatStatus(goal.status)}
                  </span>
                </div>

                {/* Description */}
                {goal.description && (
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {goal.description}
                  </p>
                )}

                {/* Progress */}
                <div className="mt-6 border-t pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5" />
                      Progress
                    </span>

                    <span className="text-sm font-semibold">
                      {goal.progress}%
                    </span>
                  </div>

                  <div
                    className="h-2 w-full overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-valuenow={goal.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${goal.title} progress`}
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-primary'
                      }`}
                      style={{
                        width: `${Math.min(Math.max(goal.progress, 0), 100)}%`,
                      }}
                    />
                  </div>

                  {/* Due Date */}
                  {goal.dueDate && (
                    <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />

                      <span>Target: {formatDate(goal.dueDate)}</span>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
