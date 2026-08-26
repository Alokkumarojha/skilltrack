import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function getOrCreateCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error('Clerk user does not have an email address');
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null;

  const user = await prisma.user.upsert({
    where: {
      clerkId: userId,
    },
    update: {
      email,
    },
    create: {
      clerkId: userId,
      name,
      email,
    },
  });

  return user;
}

// This function is used to get the current user of authenticated existing user for the CRUD actions.

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  return user;
}
