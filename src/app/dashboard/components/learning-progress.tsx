import {
  CheckCircle2,
  Circle,
  Flame,
  Goal,
  BookOpen,
  FolderKanban,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type Skill = {
  id: string;
  name: string;
  level: number;
};

type Goal = {
  id: string;
  title: string;
  progress: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
};

type Project = {
  id: string;
  title: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
};

type LearningProgressProps = {
  skills: Skill[];
  goals: Goal[];
  projects: Project[];
};

export default function LearningProgress({
  skills,
  goals,
  projects,
}: LearningProgressProps) {
  /*
   * -----------------------------
   * Skills Progress
   * -----------------------------
   */

  const skillsProgress =
    skills.length > 0
      ? Math.round(
          skills.reduce((total, skill) => total + skill.level, 0) /
            skills.length
        )
      : null;

  /*
   * -----------------------------
   * Goals Progress
   * -----------------------------
   */

  const goalsProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce((total, goal) => total + goal.progress, 0) / goals.length
        )
      : null;

  /*
   * -----------------------------
   * Projects Progress
   * -----------------------------
   *
   * NOT_STARTED = 0%
   * IN_PROGRESS = 50%
   * COMPLETED = 100%
   */

  const projectProgressValues = projects.map((project) => {
    if (project.status === 'COMPLETED') {
      return 100;
    }

    if (project.status === 'IN_PROGRESS') {
      return 50;
    }

    return 0;
  });

  const projectsProgress =
    projects.length > 0
      ? Math.round(
          projectProgressValues.reduce(
            (total: number, value: number) => total + value,
            0
          ) / projects.length
        )
      : null;

  /*
   * -----------------------------
   * Overall Progress
   * -----------------------------
   *
   * Only categories that contain
   * data are included in the average.
   */

  const progressValues = [
    skillsProgress,
    goalsProgress,
    projectsProgress,
  ].filter((value): value is number => value !== null);

  const overallProgress =
    progressValues.length > 0
      ? Math.round(
          progressValues.reduce((total, value) => total + value, 0) /
            progressValues.length
        )
      : 0;

  /*
   * -----------------------------
   * Goal Statistics
   * -----------------------------
   */

  const activeGoals = goals.filter(
    (goal) => goal.status !== 'COMPLETED'
  ).length;

  const completedGoals = goals.filter(
    (goal) => goal.status === 'COMPLETED'
  ).length;

  /*
   * -----------------------------
   * Project Statistics
   * -----------------------------
   */

  const completedProjects = projects.filter(
    (project) => project.status === 'COMPLETED'
  ).length;

  return (
    <Card className="mt-6 overflow-hidden border bg-gradient-to-br from-card via-card/95 to-primary/5 shadow-sm transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">
              Learning Progress
            </CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              See how your skills, goals, and projects are progressing.
            </p>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="font-mono text-3xl font-black tracking-tight text-primary">
              {overallProgress}%
            </span>

            <span className="text-xs font-medium text-muted-foreground">
              overall
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Overall Progress</span>

            <span className="font-semibold text-primary">
              {overallProgress}%
            </span>
          </div>

          <Progress value={overallProgress} className="h-2.5 bg-muted/80" />
        </div>

        {/* Category Progress */}
        <div className="grid gap-3 md:grid-cols-3">
          {/* Skills */}
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-4 w-4" />
                </div>

                <span className="text-sm font-semibold">Skills</span>
              </div>

              <span className="text-sm font-bold">
                {skillsProgress !== null ? `${skillsProgress}%` : '—'}
              </span>
            </div>

            <Progress value={skillsProgress ?? 0} className="mt-3 h-1.5" />

            <p className="mt-2 text-xs text-muted-foreground">
              {skills.length === 0
                ? 'No skills added yet'
                : `${skills.length} ${
                    skills.length === 1 ? 'skill' : 'skills'
                  } tracked`}
            </p>
          </div>

          {/* Goals */}
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Goal className="h-4 w-4" />
                </div>

                <span className="text-sm font-semibold">Goals</span>
              </div>

              <span className="text-sm font-bold">
                {goalsProgress !== null ? `${goalsProgress}%` : '—'}
              </span>
            </div>

            <Progress value={goalsProgress ?? 0} className="mt-3 h-1.5" />

            <p className="mt-2 text-xs text-muted-foreground">
              {goals.length === 0
                ? 'No goals added yet'
                : `${goals.length} ${
                    goals.length === 1 ? 'goal' : 'goals'
                  } tracked`}
            </p>
          </div>

          {/* Projects */}
          <div className="rounded-xl border bg-muted/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FolderKanban className="h-4 w-4" />
                </div>

                <span className="text-sm font-semibold">Projects</span>
              </div>

              <span className="text-sm font-bold">
                {projectsProgress !== null ? `${projectsProgress}%` : '—'}
              </span>
            </div>

            <Progress value={projectsProgress ?? 0} className="mt-3 h-1.5" />

            <p className="mt-2 text-xs text-muted-foreground">
              {projects.length === 0
                ? 'No projects added yet'
                : `${projects.length} ${
                    projects.length === 1 ? 'project' : 'projects'
                  } tracked`}
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-3 sm:grid-cols-3">
          {/* Active Goals */}
          <div className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
              <Flame className="h-4 w-4" />
            </div>

            <div>
              <p className="text-xl font-bold">{activeGoals}</p>
              <p className="text-xs text-muted-foreground">Active Goals</p>
            </div>
          </div>

          {/* Completed Goals */}
          <div className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              {completedGoals > 0 ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </div>

            <div>
              <p className="text-xl font-bold">{completedGoals}</p>
              <p className="text-xs text-muted-foreground">Completed Goals</p>
            </div>
          </div>

          {/* Completed Projects */}
          <div className="flex items-center gap-3 rounded-xl border bg-muted/20 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              {completedProjects > 0 ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
            </div>

            <div>
              <p className="text-xl font-bold">{completedProjects}</p>
              <p className="text-xs text-muted-foreground">
                Completed Projects
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
