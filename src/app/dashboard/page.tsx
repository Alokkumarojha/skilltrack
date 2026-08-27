import { auth } from '@clerk/nextjs/server';
import { getOrCreateCurrentUser } from '@/lib/current-user';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import AddSkillDialog from './components/add-skill-dialog';
import EditSkillDialog from './components/edit-skill-dialog';
import DeleteSkillDialog from './components/delete-skill-dialog';
import AddGoalDialog from './components/add-goal-dialog';
import EditGoalDialog from './components/edit-goal-dialog';
import DeleteGoalDialog from './components/delete-goal-dialog';
import AddProjectDialog from './components/add-project-dialog';
import EditProjectDialog from './components/edit-project-dialog';
import DeleteProjectDialog from './components/delete-project-dialog';
import AddExperienceDialog from './components/add-experience-dialog';
import EditExperienceDialog from './components/edit-experience-dialog';
import DeleteExperienceDialog from './components/delete-experience-dialog';
import AddEducationDialog from './components/add-education-dialog';
import EditEducationDialog from './components/edit-education-dialog';
import DeleteEducationDialog from './components/delete-education-dialog';
import PortfolioStatusCard from '@/components/Portfolio-Status-Card';
import RecentActivity from './components/recent-activity';
import LearningProgress from './components/learning-progress';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  await auth.protect();

  const user = await getOrCreateCurrentUser();

  if (!user) {
    return null;
  }

  const portfolioUrl = user.username ? `/portfolio/${user.username}` : null;

  const [skills, goals, projects, experiences, educations] = await Promise.all([
    prisma.skill.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),

    prisma.goal.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),

    prisma.project.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.experience.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        startDate: 'desc',
      },
    }),
    prisma.education.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        startDate: 'desc',
      },
    }),
  ]);

  function formatStatus(status: string) {
    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const profileComplete =
    Boolean(user.name?.trim()) &&
    Boolean(user.username?.trim()) &&
    Boolean(user.headline?.trim()) &&
    Boolean(user.bio?.trim()) &&
    Boolean(user.location?.trim()) &&
    Boolean(user.githubUrl?.trim()) &&
    Boolean(user.linkedinUrl?.trim()) &&
    Boolean(user.resumeUrl?.trim());

  const completionItems = [
    {
      label: 'Profile',
      complete: profileComplete,
    },
    {
      label: 'Skills',
      complete: skills.length > 0,
    },
    {
      label: 'Experience',
      complete: experiences.length > 0,
    },
    {
      label: 'Education',
      complete: educations.length > 0,
    },
    {
      label: 'Projects',
      complete: projects.length > 0,
    },
    {
      label: 'Goals',
      complete: goals.length > 0,
    },
  ];

  const completedItems = completionItems.filter((item) => item.complete).length;

  const portfolioCompletion = Math.round(
    (completedItems / completionItems.length) * 100
  );

  const activities = [
    ...skills.map((skill) => ({
      id: skill.id,
      type: 'skill' as const,
      title: skill.name,
      createdAt: skill.createdAt,
    })),

    ...goals.map((goal) => ({
      id: goal.id,
      type: 'goal' as const,
      title: goal.title,
      createdAt: goal.createdAt,
    })),

    ...projects.map((project) => ({
      id: project.id,
      type: 'project' as const,
      title: project.title,
      createdAt: project.createdAt,
    })),

    ...experiences.map((experience) => ({
      id: experience.id,
      type: 'experience' as const,
      title: `${experience.position} at ${experience.company}`,
      createdAt: experience.createdAt,
    })),

    ...educations.map((education) => ({
      id: education.id,
      type: 'education' as const,
      title: `${education.degree} at ${education.institution}`,
      createdAt: education.createdAt,
    })),
  ];

  return (
    <main className="container mx-auto px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <PortfolioStatusCard
          completionItems={completionItems}
          portfolioCompletion={portfolioCompletion}
          portfolioUrl={portfolioUrl}
        />
        <RecentActivity activities={activities} />
      </div>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">My Skills</h2>

            <p className="text-sm text-muted-foreground">
              Track your current skill level.
            </p>
          </div>

          <AddSkillDialog />
        </div>

        {skills.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-40 items-center justify-center">
              <p className="text-muted-foreground">No skills added yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((skill) => (
              <Card key={skill.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{skill.name}</CardTitle>

                    <span className="text-sm text-muted-foreground">
                      {skill.level}%
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Progress value={skill.level} />

                  <div className="flex justify-end gap-2">
                    <EditSkillDialog skill={skill} />
                    <DeleteSkillDialog
                      skillId={skill.id}
                      skillName={skill.name}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">My Goals</h2>

            <p className="text-sm text-muted-foreground">
              Track your goals and keep making progress.
            </p>
          </div>

          <AddGoalDialog />
        </div>

        {goals.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-40 items-center justify-center">
              <p className="text-muted-foreground">No goals added yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-base">{goal.title}</CardTitle>

                    <span className="text-sm text-muted-foreground">
                      {goal.progress}%
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">
                      {goal.description}
                    </p>
                  )}

                  <Progress value={goal.progress} />

                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">{formatStatus(goal.status)}</Badge>

                    {goal.dueDate && (
                      <span className="text-muted-foreground">
                        Due: {format(goal.dueDate, 'PPP')}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <EditGoalDialog goal={goal} />
                    <DeleteGoalDialog goalId={goal.id} goalTitle={goal.title} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">My Projects</h2>

            <p className="text-sm text-muted-foreground">
              Track your projects and progress.
            </p>
          </div>

          <AddProjectDialog />
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-40 items-center justify-center">
              <p className="text-muted-foreground">No projects added yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <CardTitle className="text-base">{project.title}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {project.description && (
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline"
                      >
                        GitHub
                      </a>
                    )}

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Status:
                    </span>

                    <Badge
                      variant={
                        project.status === 'COMPLETED'
                          ? 'secondary'
                          : project.status === 'IN_PROGRESS'
                            ? 'default'
                            : 'outline'
                      }
                    >
                      {formatStatus(project.status)}
                    </Badge>
                  </div>

                  {/* Edit Project */}
                  <div className="flex justify-end gap-2">
                    <EditProjectDialog project={project} />
                    <DeleteProjectDialog
                      projectId={project.id}
                      projectTitle={project.title}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Experience</h2>

            <p className="text-sm text-muted-foreground">
              Your professional work experience.
            </p>
          </div>

          <AddExperienceDialog />
        </div>

        {experiences.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-40 items-center justify-center">
              <p className="text-muted-foreground">No experience added yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {experiences.map((experience) => (
              <Card key={experience.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {experience.position}
                  </CardTitle>

                  <p className="text-sm text-muted-foreground">
                    {experience.company}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  {experience.description && (
                    <p className="text-sm text-muted-foreground">
                      {experience.description}
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground">
                    {format(experience.startDate, 'MMM yyyy')} —{' '}
                    {experience.current
                      ? 'Present'
                      : experience.endDate
                        ? format(experience.endDate, 'MMM yyyy')
                        : '—'}
                  </p>
                  <div className="flex justify-end gap-2">
                    <EditExperienceDialog experience={experience} />

                    <DeleteExperienceDialog
                      experienceId={experience.id}
                      company={experience.company}
                      position={experience.position}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">My Education</h2>

            <p className="text-sm text-muted-foreground">
              Track your educational background.
            </p>
          </div>

          <AddEducationDialog />
        </div>

        {educations.length === 0 ? (
          <Card>
            <CardContent className="flex min-h-40 items-center justify-center">
              <p className="text-muted-foreground">No education added yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {educations.map((education) => (
              <Card key={education.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {education.degree}
                  </CardTitle>

                  <p className="text-sm text-muted-foreground">
                    {education.institution}
                  </p>
                </CardHeader>

                <CardContent className="space-y-3">
                  {education.field && (
                    <p className="text-sm">{education.field}</p>
                  )}

                  {education.description && (
                    <p className="text-sm text-muted-foreground">
                      {education.description}
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground">
                    {format(education.startDate, 'MMM yyyy')} —{' '}
                    {education.current
                      ? 'Present'
                      : education.endDate
                        ? format(education.endDate, 'MMM yyyy')
                        : '—'}
                  </p>

                  <div className="flex justify-end gap-2">
                    <EditEducationDialog education={education} />

                    <DeleteEducationDialog
                      educationId={education.id}
                      educationTitle={education.degree}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <LearningProgress skills={skills} goals={goals} projects={projects} />
    </main>
  );
}
