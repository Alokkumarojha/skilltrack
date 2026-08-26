'use client ';
import { GraduationCap, School, Calendar, BookOpen } from 'lucide-react';

type PortfolioEducationProps = {
  educations: {
    id: string;
    institution: string;
    degree: string;
    field: string | null;
    description: string | null;
    startDate: Date;
    endDate: Date | null;
    current: boolean;
  }[];
};

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export default function PortfolioEducation({
  educations,
}: PortfolioEducationProps) {
  if (!educations || educations.length === 0) {
    return null;
  }

  return (
    <section className="border-b bg-muted/20 py-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Education
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              My academic background and qualifications
            </p>
          </div>

          <span className="text-sm font-medium text-muted-foreground">
            {educations.length}{' '}
            {educations.length === 1 ? 'Qualification' : 'Qualifications'}
          </span>
        </div>

        {/* Timeline */}
        <div className="relative ml-3 border-l pl-7 sm:ml-4 sm:pl-9">
          <div className="space-y-8">
            {educations.map((education) => {
              const isCurrent = education.current || !education.endDate;

              return (
                <article key={education.id} className="group relative">
                  {/* Timeline Icon */}
                  <div
                    className={`absolute -left-[45px] flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background transition-colors ${
                      isCurrent
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-muted-foreground/30 text-muted-foreground group-hover:border-primary group-hover:text-primary'
                    }`}
                  >
                    <GraduationCap className="h-4 w-4" />
                  </div>

                  {/* Education Card */}
                  <div className="rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        {/* Degree */}
                        <h3 className="text-lg font-bold tracking-tight">
                          {education.degree}
                        </h3>

                        {/* Institution */}
                        <div className="mt-1.5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <School className="h-4 w-4 text-primary" />
                          <span>{education.institution}</span>
                        </div>

                        {/* Field */}
                        {education.field && (
                          <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs font-medium">
                            <BookOpen className="h-3.5 w-3.5 text-primary" />
                            <span>{education.field}</span>
                          </div>
                        )}
                      </div>

                      {/* Date */}
                      <div className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />

                        <span>
                          {formatDate(education.startDate)} –{' '}
                          {isCurrent ? (
                            <span className="font-semibold text-primary">
                              Present
                            </span>
                          ) : (
                            formatDate(education.endDate!)
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Current Education */}
                    {isCurrent && (
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Currently studying
                      </div>
                    )}

                    {/* Description */}
                    {education.description && (
                      <p className="mt-4 border-t pt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                        {education.description}
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
