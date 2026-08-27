import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';

import { prisma } from '@/lib/prisma';
import PortfolioPdf from '@/app/portfolio/[username]/components/portfolio-pdf';

type RouteContext = {
  params: Promise<{
    username: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
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
      location: true,
      githubUrl: true,
      linkedinUrl: true,
      resumeUrl: true,

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
    },
  });

  if (!user) {
    return new NextResponse('Portfolio not found', {
      status: 404,
    });
  }

  const pdfBuffer = await renderToBuffer(<PortfolioPdf user={user} />);

  return new NextResponse(pdfBuffer as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${user.username}-portfolio.pdf"`,
    },
  });
}
