import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      resumeUrl: true,
    },
  });

  if (!user) {
    return new NextResponse('Portfolio not found', {
      status: 404,
    });
  }

  if (!user.resumeUrl) {
    return new NextResponse('Resume not available', {
      status: 404,
    });
  }

  const response = await fetch(user.resumeUrl);

  if (!response.ok) {
    return new NextResponse('Failed to load resume', {
      status: 502,
    });
  }

  const pdf = await response.arrayBuffer();

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${username}-resume.pdf"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
