'use server';

import { prisma } from '@/lib/prisma';

import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/current-user';

// Skill CRUD operations
// Create skill
export async function createSkill(name: string, level: number) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error('Skill name is required');
  }

  if (trimmedName.length > 50) {
    throw new Error('Skill name must be 50 characters or less');
  }

  if (!Number.isInteger(level) || level < 0 || level > 100) {
    throw new Error('Skill level must be between 0 and 100');
  }

  const existingSkill = await prisma.skill.findFirst({
    where: {
      userId: user.id,
      name: {
        equals: trimmedName,
        mode: 'insensitive',
      },
    },
  });

  if (existingSkill) {
    throw new Error('You already have this skill');
  }

  const skill = await prisma.skill.create({
    data: {
      name: trimmedName,
      level,
      userId: user.id,
    },
  });

  revalidatePath('/dashboard');

  return skill;
}

//updateSkill

export async function updateSkill(
  skillId: string,
  name: string,
  level: number
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const trimmedName = name.trim();

  if (!trimmedName) {
    throw new Error('Skill name is required');
  }

  if (trimmedName.length > 50) {
    throw new Error('Skill name must be 50 characters or less');
  }

  if (!Number.isInteger(level) || level < 0 || level > 100) {
    throw new Error('Skill level must be between 0 and 100');
  }

  const existingSkill = await prisma.skill.findFirst({
    where: {
      userId: user.id,
      name: {
        equals: trimmedName,
        mode: 'insensitive',
      },
      NOT: {
        id: skillId,
      },
    },
  });

  if (existingSkill) {
    throw new Error('You already have this skill');
  }

  const skill = await prisma.skill.findFirst({
    where: {
      id: skillId,
      userId: user.id,
    },
  });

  if (!skill) {
    throw new Error('Skill not found');
  }

  const updatedSkill = await prisma.skill.update({
    where: {
      id: skillId,
    },
    data: {
      name: trimmedName,
      level,
    },
  });

  revalidatePath('/dashboard');

  return updatedSkill;
}
// Delete skill
export async function deleteSkill(skillId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const skill = await prisma.skill.findFirst({
    where: {
      id: skillId,
      userId: user.id,
    },
  });

  if (!skill) {
    throw new Error('Skill not found');
  }

  await prisma.skill.delete({
    where: {
      id: skillId,
    },
  });

  revalidatePath('/dashboard');

  return { success: true };
}

// goal CRUD operations
// Create Goal
export async function createGoal(
  title: string,
  description: string,
  progress: number,
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED',
  dueDate?: string
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();

  if (!trimmedTitle) {
    throw new Error('Goal title is required');
  }

  if (trimmedTitle.length > 100) {
    throw new Error('Goal title must be 100 characters or less');
  }

  if (trimmedDescription.length > 500) {
    throw new Error('Goal description must be 500 characters or less');
  }

  if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
    throw new Error('Goal progress must be between 0 and 100');
  }

  if (!['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
    throw new Error('Invalid goal status');
  }

  const existingGoal = await prisma.goal.findFirst({
    where: {
      userId: user.id,
      title: {
        equals: trimmedTitle,
        mode: 'insensitive',
      },
    },
  });

  if (existingGoal) {
    throw new Error('You already have this goal');
  }

  const goal = await prisma.goal.create({
    data: {
      title: trimmedTitle,
      description: trimmedDescription || null,
      progress,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: user.id,
    },
  });

  revalidatePath('/dashboard');

  return goal;
}
// Update Goal
export async function updateGoal(
  goalId: string,
  title: string,
  description: string,
  progress: number,
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED',
  dueDate?: string
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();

  if (!trimmedTitle) {
    throw new Error('Goal title is required');
  }

  if (trimmedTitle.length > 100) {
    throw new Error('Goal title must be 100 characters or less');
  }

  if (trimmedDescription.length > 500) {
    throw new Error('Goal description must be 500 characters or less');
  }

  if (!Number.isInteger(progress) || progress < 0 || progress > 100) {
    throw new Error('Goal progress must be between 0 and 100');
  }

  if (!['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
    throw new Error('Invalid goal status');
  }

  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      userId: user.id,
    },
  });

  if (!goal) {
    throw new Error('Goal not found');
  }

  const existingGoal = await prisma.goal.findFirst({
    where: {
      userId: user.id,
      title: {
        equals: trimmedTitle,
        mode: 'insensitive',
      },
      NOT: {
        id: goalId,
      },
    },
  });

  if (existingGoal) {
    throw new Error('You already have this goal');
  }

  const updatedGoal = await prisma.goal.update({
    where: {
      id: goalId,
    },
    data: {
      title: trimmedTitle,
      description: trimmedDescription || null,
      progress,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  revalidatePath('/dashboard');

  return updatedGoal;
}
// Delete Goal
export async function deleteGoal(goalId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
      userId: user.id,
    },
  });

  if (!goal) {
    throw new Error('Goal not found');
  }

  await prisma.goal.delete({
    where: {
      id: goalId,
    },
  });

  revalidatePath('/dashboard');

  return { success: true };
}

// Project CRUD operations
// Create Project
export async function createProject(
  title: string,
  description: string, // Optional
  githubUrl: string, // Optional
  liveUrl: string, // Optional
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();
  const trimmedGithubUrl = githubUrl.trim();
  const trimmedLiveUrl = liveUrl.trim();

  if (!trimmedTitle) {
    throw new Error('Project title is required');
  }

  if (trimmedTitle.length > 100) {
    throw new Error('Project title must be 100 characters or less');
  }

  if (trimmedDescription.length > 500) {
    throw new Error('Project description must be 500 characters or less');
  }

  if (!['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
    throw new Error('Invalid project status');
  }

  const existingProject = await prisma.project.findFirst({
    where: {
      userId: user.id,
      title: {
        equals: trimmedTitle,
        mode: 'insensitive',
      },
    },
  });

  if (existingProject) {
    throw new Error('You already have a project with this title');
  }
  const project = await prisma.project.create({
    data: {
      title: trimmedTitle,
      description: trimmedDescription || null,
      githubUrl: trimmedGithubUrl || null,
      liveUrl: trimmedLiveUrl || null,
      status,
      userId: user.id,
    },
  });

  revalidatePath('/dashboard');

  return project;
}

// Update Project
export async function updateProject(
  projectId: string,
  title: string,
  description: string,
  githubUrl: string,
  liveUrl: string,
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const trimmedTitle = title.trim();
  const trimmedDescription = description.trim();
  const trimmedGithubUrl = githubUrl.trim();
  const trimmedLiveUrl = liveUrl.trim();

  if (!trimmedTitle) {
    throw new Error('Project title is required');
  }

  if (trimmedTitle.length > 100) {
    throw new Error('Project title must be 100 characters or less');
  }

  if (trimmedDescription.length > 500) {
    throw new Error('Project description must be 500 characters or less');
  }

  if (!['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
    throw new Error('Invalid project status');
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  const existingProject = await prisma.project.findFirst({
    where: {
      userId: user.id,
      title: {
        equals: trimmedTitle,
        mode: 'insensitive',
      },
      NOT: {
        id: projectId,
      },
    },
  });

  if (existingProject) {
    throw new Error('You already have a project with this title');
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      title: trimmedTitle,
      description: trimmedDescription || null,
      githubUrl: trimmedGithubUrl || null,
      liveUrl: trimmedLiveUrl || null,
      status,
    },
  });

  revalidatePath('/dashboard');

  return updatedProject;
}

// Delete Goal
export async function deleteProject(projectId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  revalidatePath('/dashboard');

  return { success: true };
}

// Profile Update

export async function updateProfile(
  name: string,
  headline: string,
  bio: string,
  location: string,
  githubUrl: string,
  linkedinUrl: string,
  resumeUrl: string
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const trimmedName = name.trim();
  const trimmedHeadline = headline.trim();
  const trimmedBio = bio.trim();
  const trimmedLocation = location.trim();
  const trimmedGithubUrl = githubUrl.trim();
  const trimmedLinkedinUrl = linkedinUrl.trim();
  const trimmedResumeUrl = resumeUrl.trim();

  if (!trimmedName) {
    throw new Error('Name is required');
  }

  if (trimmedName.length > 100) {
    throw new Error('Name must be 100 characters or less');
  }

  if (trimmedHeadline.length > 150) {
    throw new Error('Headline must be 150 characters or less');
  }

  if (trimmedBio.length > 1000) {
    throw new Error('Bio must be 1000 characters or less');
  }

  if (trimmedLocation.length > 100) {
    throw new Error('Location must be 100 characters or less');
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: trimmedName,
      headline: trimmedHeadline || null,
      bio: trimmedBio || null,
      location: trimmedLocation || null,
      githubUrl: trimmedGithubUrl || null,
      linkedinUrl: trimmedLinkedinUrl || null,
      resumeUrl: trimmedResumeUrl || null,
    },
  });

  revalidatePath('/dashboard');

  return updatedUser;
}

// Experience CRUD operations
// Create Experience
export async function createExperience(
  company: string,
  position: string,
  description: string,
  startDate: string,
  endDate?: string,
  current: boolean = false
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const trimmedCompany = company.trim();
  const trimmedPosition = position.trim();
  const trimmedDescription = description.trim();

  if (!trimmedCompany) {
    throw new Error('Company name is required');
  }

  if (trimmedCompany.length > 100) {
    throw new Error('Company name must be 100 characters or less');
  }

  if (!trimmedPosition) {
    throw new Error('Position is required');
  }

  if (trimmedPosition.length > 100) {
    throw new Error('Position must be 100 characters or less');
  }

  if (trimmedDescription.length > 1000) {
    throw new Error('Description must be 1000 characters or less');
  }

  if (!startDate) {
    throw new Error('Start date is required');
  }

  const parsedStartDate = new Date(startDate);

  if (Number.isNaN(parsedStartDate.getTime())) {
    throw new Error('Invalid start date');
  }

  let parsedEndDate: Date | null = null;

  if (!current && endDate) {
    parsedEndDate = new Date(endDate);

    if (Number.isNaN(parsedEndDate.getTime())) {
      throw new Error('Invalid end date');
    }

    if (parsedEndDate < parsedStartDate) {
      throw new Error('End date cannot be before start date');
    }
  }

  // -------------------------------------------------------------
  // Comprehensive Overlap Check (Handles 'Present' / current: true)
  // -------------------------------------------------------------
  const overlappingExperience = await prisma.experience.findFirst({
    where: {
      userId: user.id,
      OR: [
        // Scenario 1: Agar pehle se koi active 'Present' job hai
        // Aur naya role bhi 'Present' hai YA naye role ka end date active role ke start date ke baad hai
        {
          current: true,
          ...(current
            ? {} // Dono current hain -> Directly clash
            : {
                // Nayi entry bounded hai, toh clash hoga agar parsedEndDate >= existing startDate
                OR: [
                  { startDate: { lte: parsedStartDate } },
                  ...(parsedEndDate
                    ? [{ startDate: { lte: parsedEndDate } }]
                    : []),
                ],
              }),
        },

        // Scenario 2: Nayi entry ka start date kisi existing range ke andar pad raha hai
        {
          startDate: { lte: parsedStartDate },
          endDate: { gte: parsedStartDate },
        },

        // Scenario 3: Nayi entry ka end date kisi existing range ke andar pad raha hai
        ...(parsedEndDate
          ? [
              {
                startDate: { lte: parsedEndDate },
                endDate: { gte: parsedEndDate },
              },
              // Scenario 4: Nayi entry purani poori range ko cover/swallow kar rahi hai
              {
                startDate: { gte: parsedStartDate },
                endDate: { lte: parsedEndDate },
              },
            ]
          : []),

        // Scenario 5: Agar NAYI entry 'Present' hai, toh yeh un sabhi purani entries se clash karegi
        // jinka end date naye start date ke baad ya barabar hai
        ...(current
          ? [
              {
                endDate: { gte: parsedStartDate },
              },
            ]
          : []),
      ],
    },
  });

  if (overlappingExperience) {
    throw new Error(
      'An experience entry already overlaps with this time period or another current role exists.'
    );
  }

  const experience = await prisma.experience.create({
    data: {
      company: trimmedCompany,
      position: trimmedPosition,
      description: trimmedDescription || null,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      current,
      userId: user.id,
    },
  });

  revalidatePath('/dashboard');

  return experience;
}

// Update Experience

export async function updateExperience(
  experienceId: string,
  company: string,
  position: string,
  description: string,
  startDate: string,
  endDate?: string,
  current: boolean = false
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const trimmedCompany = company.trim();
  const trimmedPosition = position.trim();
  const trimmedDescription = description.trim();

  if (!trimmedCompany) {
    throw new Error('Company name is required');
  }

  if (trimmedCompany.length > 100) {
    throw new Error('Company name must be 100 characters or less');
  }

  if (!trimmedPosition) {
    throw new Error('Position is required');
  }

  if (trimmedPosition.length > 100) {
    throw new Error('Position must be 100 characters or less');
  }

  if (trimmedDescription.length > 1000) {
    throw new Error('Description must be 1000 characters or less');
  }

  if (!startDate) {
    throw new Error('Start date is required');
  }

  const parsedStartDate = new Date(startDate);

  if (Number.isNaN(parsedStartDate.getTime())) {
    throw new Error('Invalid start date');
  }

  let parsedEndDate: Date | null = null;

  if (!current && endDate) {
    parsedEndDate = new Date(endDate);

    if (Number.isNaN(parsedEndDate.getTime())) {
      throw new Error('Invalid end date');
    }

    if (parsedEndDate < parsedStartDate) {
      throw new Error('End date cannot be before start date');
    }
  }

  const experience = await prisma.experience.findFirst({
    where: {
      id: experienceId,
      userId: user.id,
    },
  });

  if (!experience) {
    throw new Error('Experience not found');
  }

  const updatedExperience = await prisma.experience.update({
    where: {
      id: experienceId,
    },
    data: {
      company: trimmedCompany,
      position: trimmedPosition,
      description: trimmedDescription || null,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      current,
    },
  });

  revalidatePath('/dashboard');

  return updatedExperience;
}

//Delete Experience

export async function deleteExperience(experienceId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const experience = await prisma.experience.findFirst({
    where: {
      id: experienceId,
      userId: user.id,
    },
  });

  if (!experience) {
    throw new Error('Experience not found');
  }

  await prisma.experience.delete({
    where: {
      id: experienceId,
    },
  });

  revalidatePath('/dashboard');

  return { success: true };
}

// Education CRUD operations

// Create Education
export async function createEducation(
  institution: string,
  degree: string,
  field: string,
  description: string,
  startDate: string,
  endDate?: string,
  current: boolean = false
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const trimmedInstitution = institution.trim();
  const trimmedDegree = degree.trim();
  const trimmedField = field.trim();
  const trimmedDescription = description.trim();

  if (!trimmedInstitution) {
    throw new Error('Institution name is required');
  }

  if (trimmedInstitution.length > 150) {
    throw new Error('Institution name must be 150 characters or less');
  }

  if (!trimmedDegree) {
    throw new Error('Degree is required');
  }

  if (trimmedDegree.length > 100) {
    throw new Error('Degree must be 100 characters or less');
  }

  if (trimmedField.length > 100) {
    throw new Error('Field must be 100 characters or less');
  }

  if (trimmedDescription.length > 1000) {
    throw new Error('Description must be 1000 characters or less');
  }

  if (!startDate) {
    throw new Error('Start date is required');
  }

  const parsedStartDate = new Date(startDate);

  if (Number.isNaN(parsedStartDate.getTime())) {
    throw new Error('Invalid start date');
  }

  if (!current && !endDate) {
    throw new Error('End date is required when education is not current');
  }

  let parsedEndDate: Date | null = null;

  if (!current && endDate) {
    parsedEndDate = new Date(endDate);

    if (Number.isNaN(parsedEndDate.getTime())) {
      throw new Error('Invalid end date');
    }

    if (parsedEndDate < parsedStartDate) {
      throw new Error('End date cannot be before start date');
    }
  }

  const education = await prisma.education.create({
    data: {
      institution: trimmedInstitution,
      degree: trimmedDegree,
      field: trimmedField || null,
      description: trimmedDescription || null,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      current,
      userId: user.id,
    },
  });

  revalidatePath('/dashboard');

  return education;
}

// Update Education

// Update Education
export async function updateEducation(
  educationId: string,
  institution: string,
  degree: string,
  field: string,
  description: string,
  startDate: string,
  endDate?: string,
  current: boolean = false
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const trimmedInstitution = institution.trim();
  const trimmedDegree = degree.trim();
  const trimmedField = field.trim();
  const trimmedDescription = description.trim();

  if (!trimmedInstitution) {
    throw new Error('Institution name is required');
  }

  if (trimmedInstitution.length > 150) {
    throw new Error('Institution name must be 150 characters or less');
  }

  if (!trimmedDegree) {
    throw new Error('Degree is required');
  }

  if (trimmedDegree.length > 100) {
    throw new Error('Degree must be 100 characters or less');
  }

  if (trimmedField.length > 100) {
    throw new Error('Field must be 100 characters or less');
  }

  if (trimmedDescription.length > 1000) {
    throw new Error('Description must be 1000 characters or less');
  }

  if (!startDate) {
    throw new Error('Start date is required');
  }

  const parsedStartDate = new Date(startDate);

  if (Number.isNaN(parsedStartDate.getTime())) {
    throw new Error('Invalid start date');
  }

  if (!current && !endDate) {
    throw new Error('End date is required when education is not current');
  }

  let parsedEndDate: Date | null = null;

  if (!current && endDate) {
    parsedEndDate = new Date(endDate);

    if (Number.isNaN(parsedEndDate.getTime())) {
      throw new Error('Invalid end date');
    }

    if (parsedEndDate < parsedStartDate) {
      throw new Error('End date cannot be before start date');
    }
  }

  const education = await prisma.education.findFirst({
    where: {
      id: educationId,
      userId: user.id,
    },
  });

  if (!education) {
    throw new Error('Education not found');
  }

  const updatedEducation = await prisma.education.update({
    where: {
      id: educationId,
    },
    data: {
      institution: trimmedInstitution,
      degree: trimmedDegree,
      field: trimmedField || null,
      description: trimmedDescription || null,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      current,
    },
  });

  revalidatePath('/dashboard');

  return updatedEducation;
}

// Delete Education
export async function deleteEducation(educationId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const education = await prisma.education.findFirst({
    where: {
      id: educationId,
      userId: user.id,
    },
  });

  if (!education) {
    throw new Error('Education not found');
  }

  await prisma.education.delete({
    where: {
      id: educationId,
    },
  });

  revalidatePath('/dashboard');

  return { success: true };
}

// Update Profile
export async function updatePortfolioProfile(
  name: string,
  username: string,
  headline: string,
  bio: string,
  location: string,
  githubUrl: string,
  linkedinUrl: string,
  resumeUrl: string
) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const trimmedName = name.trim();
  const trimmedUsername = username.trim().toLowerCase();
  const trimmedHeadline = headline.trim();
  const trimmedBio = bio.trim();
  const trimmedLocation = location.trim();
  const trimmedGithubUrl = githubUrl.trim();
  const trimmedLinkedinUrl = linkedinUrl.trim();
  const trimmedResumeUrl = resumeUrl.trim();

  if (!trimmedName) {
    throw new Error('Name is required');
  }

  if (!trimmedUsername) {
    throw new Error('Username is required');
  }

  if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
    throw new Error('Username must be between 3 and 30 characters');
  }

  if (!/^[a-z0-9_]+$/.test(trimmedUsername)) {
    throw new Error(
      'Username can only contain lowercase letters, numbers, and underscores'
    );
  }

  if (trimmedHeadline.length > 150) {
    throw new Error('Headline must be 150 characters or less');
  }

  if (trimmedBio.length > 1000) {
    throw new Error('Bio must be 1000 characters or less');
  }

  if (trimmedLocation.length > 100) {
    throw new Error('Location must be 100 characters or less');
  }

  if (trimmedGithubUrl.length > 300) {
    throw new Error('GitHub URL is too long');
  }

  if (trimmedLinkedinUrl.length > 300) {
    throw new Error('LinkedIn URL is too long');
  }

  if (trimmedResumeUrl.length > 300) {
    throw new Error('Resume URL is too long');
  }

  function validateOptionalUrl(value: string, fieldName: string) {
    if (!value) {
      return;
    }

    try {
      const url = new URL(value);

      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error();
      }
    } catch {
      throw new Error(`${fieldName} must be a valid URL`);
    }
  }

  validateOptionalUrl(trimmedGithubUrl, 'GitHub URL');
  validateOptionalUrl(trimmedLinkedinUrl, 'LinkedIn URL');
  validateOptionalUrl(trimmedResumeUrl, 'Resume URL');

  const existingUser = await prisma.user.findFirst({
    where: {
      username: trimmedUsername,
      NOT: {
        id: user.id,
      },
    },
  });

  if (existingUser) {
    throw new Error('Username is already taken');
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: trimmedName,
      username: trimmedUsername,
      headline: trimmedHeadline || null,
      bio: trimmedBio || null,
      location: trimmedLocation || null,
      githubUrl: trimmedGithubUrl || null,
      linkedinUrl: trimmedLinkedinUrl || null,
      resumeUrl: trimmedResumeUrl || null,
    },
  });

  revalidatePath('/dashboard');
  revalidatePath(`/portfolio/${trimmedUsername}`);

  return updatedUser;
}

// Update Portfolio Visibility
export async function updatePortfolioVisibility(isPublic: boolean) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isPortfolioPublic: isPublic,
    },
  });

  revalidatePath('/dashboard');

  if (updatedUser.username) {
    revalidatePath(`/portfolio/${updatedUser.username}`);
  }

  return updatedUser;
}
