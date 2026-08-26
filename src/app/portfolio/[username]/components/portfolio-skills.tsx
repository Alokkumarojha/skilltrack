type PortfolioSkillsProps = {
  skills: {
    id: string;
    name: string;
    level: number;
  }[];
};

export default function PortfolioSkills({ skills }: PortfolioSkillsProps) {
  if (skills.length === 0) {
    return null;
  }

  const getLevelLabel = (level: number) => {
    if (level >= 85) return 'Expert';
    if (level >= 70) return 'Advanced';
    if (level >= 50) return 'Intermediate';
    return 'Proficient';
  };

  return (
    <section className="border-b bg-muted/20 py-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header with badge count */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Skills & Expertise
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Technologies and tools I work with daily
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {skills.length} Mastered
          </span>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => {
            const levelLabel = getLevelLabel(skill.level);
            return (
              <div
                key={skill.id}
                className="group relative overflow-hidden rounded-xl border bg-background p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {skill.name}
                  </span>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {levelLabel}
                  </span>
                </div>

                {/* Micro Progress Indicator */}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
