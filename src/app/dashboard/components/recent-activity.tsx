'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  FolderKanban,
  Target,
  Activity,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ActivityType = 'skill' | 'goal' | 'project' | 'experience' | 'education';

type ActivityItem = {
  id: string;
  type: ActivityType;
  title: string;
  createdAt: Date | string;
};

type RecentActivityProps = {
  activities: ActivityItem[];
};

const activityConfig: Record<
  ActivityType,
  {
    icon: typeof Award;
    label: string;
    actionText: string;
    badgeStyle: string;
    iconBg: string;
  }
> = {
  skill: {
    icon: Award,
    label: 'Skill',
    actionText: 'Added skill',
    badgeStyle:
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    iconBg: 'text-amber-500 bg-amber-500/10',
  },
  goal: {
    icon: Target,
    label: 'Goal',
    actionText: 'Set new goal',
    badgeStyle:
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    iconBg: 'text-emerald-500 bg-emerald-500/10',
  },
  project: {
    icon: FolderKanban,
    label: 'Project',
    actionText: 'Created project',
    badgeStyle:
      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    iconBg: 'text-blue-500 bg-blue-500/10',
  },
  experience: {
    icon: BriefcaseBusiness,
    label: 'Experience',
    actionText: 'Added experience',
    badgeStyle:
      'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    iconBg: 'text-purple-500 bg-purple-500/10',
  },
  education: {
    icon: BookOpen,
    label: 'Education',
    actionText: 'Updated education',
    badgeStyle:
      'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    iconBg: 'text-indigo-500 bg-indigo-500/10',
  },
};

export default function RecentActivity({ activities }: RecentActivityProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sortedActivities = [...activities]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 8);

  return (
    <section className="mt-8">
      <Card className="border-border/60 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="pb-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold tracking-tight">
                  Recent Activity
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your latest updates across SkillTrack dashboard
                </p>
              </div>
            </div>

            {sortedActivities.length > 0 && (
              <Badge
                variant="outline"
                className="hidden sm:inline-flex gap-1 text-xs font-normal"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                Live Feed
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {sortedActivities.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-border/60 p-6 text-center bg-muted/20">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground/60 mb-3">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                No recent activity
              </p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Start building your profile by adding a skill, setting a goal,
                or showcasing a project.
              </p>
            </div>
          ) : (
            <div className="relative pl-3 sm:pl-4 space-y-6 before:absolute before:left-[19px] sm:before:left-[23px] before:top-3 before:bottom-3 before:w-[2px] before:bg-border/60">
              {sortedActivities.map((activity) => {
                const config =
                  activityConfig[activity.type] || activityConfig.skill;
                const Icon = config.icon;

                return (
                  <div
                    key={`${activity.type}-${activity.id}`}
                    className="group relative flex items-start gap-3.5 sm:gap-4 rounded-xl p-2.5 transition-all duration-200 hover:bg-muted/40 hover:translate-x-0.5"
                  >
                    {/* Icon Circle connected with line */}
                    <div
                      className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-background ring-4 ring-background shadow-xs transition-transform group-hover:scale-105 ${config.iconBg}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Activity Content */}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {activity.title}
                        </p>

                        <span className="shrink-0 text-[11px] font-medium text-muted-foreground">
                          {isMounted
                            ? formatDistanceToNowStrict(
                                new Date(activity.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )
                            : ''}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-normal">
                          {config.actionText}
                        </span>
                        <span className="text-muted-foreground/40">•</span>
                        <Badge
                          variant="secondary"
                          className={`h-5 text-[10px] px-2 font-medium border ${config.badgeStyle}`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
