'use client ';
import { Briefcase, Building2, Calendar } from 'lucide-react';

type PortfolioExperiencesProps = {
  experiences: {
    id: string;
    company: string;
    position: string;
    startDate: Date;
    endDate: Date | null;
    current: boolean;
    description: string | null;
  }[];
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export default function PortfolioExperiences({
  experiences,
}: PortfolioExperiencesProps) {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <section className="border-b bg-background py-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Work Experience
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              My professional experience and career journey
            </p>
          </div>

          <span className="text-sm font-medium text-muted-foreground">
            {experiences.length} {experiences.length === 1 ? 'Role' : 'Roles'}
          </span>
        </div>

        {/* Timeline */}
        <div className="relative ml-3 border-l pl-7 sm:ml-4 sm:pl-9">
          <div className="space-y-8">
            {experiences.map((experience) => {
              const isCurrent = experience.current || !experience.endDate;

              return (
                <article key={experience.id} className="group relative">
                  {/* Timeline Icon */}
                  <div
                    className={`absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background transition-colors ${
                      isCurrent
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30 text-muted-foreground group-hover:border-primary group-hover:text-primary'
                    }`}
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                  </div>

                  {/* Experience Card */}
                  <div className="rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        {/* Position */}
                        <h3 className="text-lg font-bold tracking-tight">
                          {experience.position}
                        </h3>

                        {/* Company */}
                        <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <Building2 className="h-4 w-4 text-primary" />
                          <span>{experience.company}</span>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="inline-flex w-fit items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />

                        <span>
                          {formatDate(experience.startDate)} –{' '}
                          {isCurrent ? (
                            <span className="font-semibold text-primary">
                              Present
                            </span>
                          ) : (
                            formatDate(experience.endDate!)
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Current Role Indicator */}
                    {isCurrent && (
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Currently working here
                      </div>
                    )}

                    {/* Description */}
                    {experience.description && (
                      <p className="mt-4 border-t pt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                        {experience.description}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
