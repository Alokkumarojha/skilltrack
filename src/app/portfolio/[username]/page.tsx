import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
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

export async function generateMetadata({
  params,
}: PortfolioPageProps): Promise<Metadata> {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: {
      username: username.toLowerCase(),
    },
    select: {
      name: true,
      username: true,
      headline: true,
      bio: true,
      imageUrl: true,
    },
  });

  if (!user) {
    return {
      title: 'Portfolio Not Found | SkillTrack',
      description: 'The requested portfolio could not be found.',
    };
  }

  const displayName = user.name || user.username || 'Portfolio';

  const description =
    user.bio ||
    user.headline ||
    `View ${displayName}'s professional portfolio on SkillTrack.`;

  return {
    title: `${displayName} | SkillTrack`,
    description,

    openGraph: {
      title: `${displayName} | SkillTrack`,
      description,
      type: 'profile',
      ...(user.imageUrl
        ? {
            images: [
              {
                url: user.imageUrl,
                width: 1200,
                height: 630,
                alt: `${displayName}'s profile`,
              },
            ],
          }
        : {}),
    },

    twitter: {
      card: user.imageUrl ? 'summary_large_image' : 'summary',
      title: `${displayName} | SkillTrack`,
      description,
      ...(user.imageUrl
        ? {
            images: [user.imageUrl],
          }
        : {}),
    },
  };
}

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
      isPortfolioPublic: true,
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

  if (!user.isPortfolioPublic) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <span className="text-2xl">🔒</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            Portfolio is Private
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This portfolio is currently private and cannot be viewed publicly.
          </p>
        </div>
      </main>
    );
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
