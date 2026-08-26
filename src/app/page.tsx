import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import {
  Sparkles,
  ArrowRight,
  Target,
  Code2,
  FolderGit2,
  GraduationCap,
  Briefcase,
  Share2,
  Globe,
  UserCheck,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="flex min-h-[calc(100vh-73px)] flex-col bg-background">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b px-6 py-20 md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[350px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/15 to-primary/5 blur-3xl" />

        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/40 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Your complete developer identity in one link</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Build your skills. <br />
            <span className="bg-gradient-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
              Showcase your journey.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            SkillTrack helps developers track their technical skills, goals,
            projects, and experience—and instantly generate a clean public
            portfolio to share with the world.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {!userId ? (
              <>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className={buttonVariants({
                      size: 'lg',
                      className:
                        'w-full font-semibold sm:w-auto cursor-pointer shadow-md',
                    })}
                  >
                    Create Your Portfolio
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </SignUpButton>

                <SignInButton mode="modal">
                  <button
                    type="button"
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'lg',
                      className:
                        'w-full font-semibold sm:w-auto cursor-pointer',
                    })}
                  >
                    Sign In
                  </button>
                </SignInButton>
              </>
            ) : (
              <Link
                href="/dashboard"
                className={buttonVariants({
                  size: 'lg',
                  className: 'w-full font-semibold sm:w-auto shadow-md',
                })}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 2. What SkillTrack Does (Feature Grid) */}
      <section className="px-6 py-20 bg-muted/20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to track and showcase
            </h2>
            <p className="mt-3 text-muted-foreground">
              Keep your entire professional path structured without messy resume
              updates.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Target}
              title="Goals & Milestones"
              description="Set target learning objectives, set deadlines, and track your progress visually."
            />
            <FeatureCard
              icon={Code2}
              title="Skills Management"
              description="Categorize tech stacks, frameworks, and tools with proficiency ratings."
            />
            <FeatureCard
              icon={FolderGit2}
              title="Projects Showcase"
              description="Link live demos and GitHub repositories with tech tags and detailed breakdowns."
            />
            <FeatureCard
              icon={GraduationCap}
              title="Education"
              description="Document degrees, certifications, and academic background effortlessly."
            />
            <FeatureCard
              icon={Briefcase}
              title="Work Experience"
              description="Highlight past roles, key contributions, and real-world impacts."
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Portfolio Completion Status"
              description="Get real-time feedback on how complete and recruiters-ready your profile is."
            />
          </div>
        </div>
      </section>

      {/* 3. Portfolio Feature Highlight */}
      <section className="border-y px-6 py-20 bg-background">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                <Globe className="h-4 w-4" />
                <span>Public Portfolio Link</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Shareable Portfolio for Recruiters & Peers
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                No need to build a portfolio website from scratch. SkillTrack
                generates a clean, clean-coded, and professional public page for
                you at:
              </p>
              <div className="mt-4 inline-block rounded-lg border bg-muted/50 px-4 py-2 font-mono text-sm font-semibold text-primary">
                skilltrack.com/portfolio/username
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Directly share it on LinkedIn, Twitter, or send it to hiring
                managers.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-xl">
              <div className="flex items-center gap-3 border-b pb-4 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  ST
                </div>
                <div>
                  <div className="font-semibold text-sm">John Doe</div>
                  <div className="text-xs text-muted-foreground">
                    skilltrack.com/portfolio/johndoe
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-16 rounded-full bg-primary/10" />
                  <div className="h-6 w-16 rounded-full bg-primary/10" />
                  <div className="h-6 w-16 rounded-full bg-primary/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="px-6 py-20 bg-muted/10">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-muted-foreground">
            3 simple steps to get your portfolio up and running
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            <StepCard
              step="1"
              icon={UserCheck}
              title="Create Profile"
              description="Sign up in seconds and set up your basic profile details."
            />
            <StepCard
              step="2"
              icon={Code2}
              title="Add Your Data"
              description="Input your skills, projects, learning goals, education, and work experience."
            />
            <StepCard
              step="3"
              icon={Share2}
              title="Share Portfolio"
              description="Get your personal public URL and share your tech portfolio anywhere."
            />
          </div>
        </div>
      </section>

      {/* 5. Call to Action (CTA) */}
      <section className="border-t px-6 py-20 bg-primary/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to track your skills and build your portfolio?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Join now and create your professional dev profile in under 5
            minutes.
          </p>
          <div className="mt-8 flex justify-center">
            {!userId ? (
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className={buttonVariants({
                    size: 'lg',
                    className: 'font-semibold cursor-pointer shadow-lg px-8',
                  })}
                >
                  Build My Portfolio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </SignUpButton>
            ) : (
              <Link
                href="/dashboard"
                className={buttonVariants({
                  size: 'lg',
                  className: 'font-semibold shadow-lg px-8',
                })}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="transition-all hover:border-primary/50 hover:shadow-md">
      <CardHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border bg-background text-primary shadow-xs">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function StepCard({
  step,
  icon: Icon,
  title,
  description,
}: {
  step: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="relative flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-xs">
      <div className="absolute -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-sm">
        {step}
      </div>
      <div className="mt-2 mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
