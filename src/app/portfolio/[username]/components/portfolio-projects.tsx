'use client';
import Link from 'next/link';
import { ExternalLink, FolderGit2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

type PortfolioProjectsProps = {
  projects: {
    id: string;
    title: string;
    description: string | null;
    githubUrl: string | null;
    liveUrl: string | null;
    status: string;
  }[];
};

function getStatusBadgeClass(status: string) {
  const normalized = status.toLowerCase();

  if (normalized.includes('completed') || normalized.includes('live')) {
    return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
  }

  if (normalized.includes('progress') || normalized.includes('in_progress')) {
    return 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400';
  }

  return 'border-border bg-muted text-muted-foreground';
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function PortfolioProjects({
  projects,
}: PortfolioProjectsProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <section className="border-b bg-background py-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured Projects
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              A selection of projects I have built
            </p>
          </div>

          <span className="text-sm font-medium text-muted-foreground">
            {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
          </span>
        </div>

        {/* Projects */}
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-6"
            >
              <div>
                {/* Project Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted text-primary">
                    <FolderGit2 className="h-5 w-5" />
                  </div>

                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(
                      project.status
                    )}`}
                  >
                    {formatStatus(project.status)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-5 text-xl font-bold tracking-tight transition-colors group-hover:text-primary">
                  {project.title}
                </h3>

                {/* Description */}
                {project.description && (
                  <p className="mt-2 line-clamp-4 text-sm leading-7 text-muted-foreground">
                    {project.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              {(project.liveUrl || project.githubUrl) && (
                <div className="mt-6 flex flex-wrap gap-3 border-t pt-4">
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </Link>
                  )}

                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors hover:bg-accent"
                    >
                      <FaGithub className="h-4 w-4" />
                      Source Code
                    </Link>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
