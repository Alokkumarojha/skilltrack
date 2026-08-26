import { notFound } from 'next/navigation';

import { prisma } from '@/lib/prisma';

import PortfolioHero from './components/portfolio-hero';
import PortfolioSkills from './components/portfolio-skills';
import PortfolioExperiences from './components/portfolio-experiences';
import PortfolioEducation from './components/portfolio-education';
import PortfolioProjects from './components/portfolio-projects';
import PortfolioGoals from './components/portfolio-goals';

type PortfolioPageProps = {
  params: Promise<{
    username: string;
  }>;
};

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: {
      username: username.toLowerCase(),
    },
    select: {
      id: true,
      name: true,
      username: true,
      headline: true,
      bio: true,
      location: true,
      githubUrl: true,
      linkedinUrl: true,
      resumeUrl: true,
      imageUrl: true,

      skills: {
        select: {
          id: true,
          name: true,
          level: true,
        },
      },
      experiences: {
        select: {
          id: true,
          company: true,
          position: true,
          startDate: true,
          endDate: true,
          current: true,
          description: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      },
      educations: {
        select: {
          id: true,
          institution: true,
          degree: true,
          field: true,
          description: true,
          startDate: true,
          endDate: true,
          current: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      },
      projects: {
        select: {
          id: true,
          title: true,
          description: true,
          githubUrl: true,
          liveUrl: true,
          status: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      goals: {
        where: {
          status: 'IN_PROGRESS',
        },
        select: {
          id: true,
          title: true,
          description: true,
          progress: true,
          status: true,
          dueDate: true,
        },
        orderBy: {
          dueDate: 'asc',
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <main>
      <PortfolioHero user={user} />

      <PortfolioSkills skills={user.skills} />

      <PortfolioExperiences experiences={user.experiences} />

      <PortfolioEducation educations={user.educations} />

      <PortfolioProjects projects={user.projects} />

      <PortfolioGoals goals={user.goals} />
    </main>
  );
}
