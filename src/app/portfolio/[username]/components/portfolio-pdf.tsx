import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';

type PortfolioPdfProps = {
  user: {
    name: string | null;
    username: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    resumeUrl: string | null;
    skills: {
      id: string;
      name: string;
      level: number;
    }[];
    experiences: {
      id: string;
      company: string;
      position: string;
      startDate: Date;
      endDate: Date | null;
      current: boolean;
      description: string | null;
    }[];
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
    projects: {
      id: string;
      title: string;
      description: string | null;
      githubUrl: string | null;
      liveUrl: string | null;
      status: string;
    }[];
  };
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: '#334155', // Slate-700
    lineHeight: 1.45,
  },

  // Header Section
  // Header Section
  header: {
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'column', // Ensures strictly top-to-bottom layout
  },

  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a', // Slate-900
    lineHeight: 1.25, // Prevents text overlap with below lines
    marginBottom: 6, // Clear space below long names like Shivaay prakash ojha
    letterSpacing: -0.3,
  },

  headline: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 1.35,
    marginTop: 2, // Extra buffer space from name
    marginBottom: 10,
    fontFamily: 'Helvetica',
  },

  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
    fontSize: 8.5,
    color: '#64748b',
  },

  bulletSeparator: {
    color: '#cbd5e1',
    fontSize: 8,
  },

  link: {
    fontSize: 8.5,
    color: '#2563eb',
    textDecoration: 'none',
  },

  // Section Global
  section: {
    marginBottom: 16,
  },

  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 4,
  },

  sectionAccentBar: {
    width: 3,
    height: 12,
    backgroundColor: '#3b82f6',
    marginRight: 6,
    borderRadius: 1,
  },

  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  bio: {
    color: '#334155',
    fontSize: 9.5,
    lineHeight: 1.5,
  },

  // Skill Badges / Grid Layout
  skillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  skillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 2,
  },

  skillName: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1e293b',
  },

  skillLevelBadge: {
    fontSize: 7.5,
    color: '#64748b',
    marginLeft: 4,
  },

  // Generic Item Styling (Experience, Education, Projects)
  item: {
    marginBottom: 12,
  },

  itemHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },

  itemTitle: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    flex: 1,
  },

  itemSubtitle: {
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#475569',
    marginBottom: 3,
  },

  date: {
    fontSize: 8.5,
    color: '#64748b',
    textAlign: 'right',
  },

  description: {
    fontSize: 9,
    color: '#475569',
    marginTop: 2,
    lineHeight: 1.4,
  },

  projectLinks: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },

  statusBadge: {
    fontSize: 8,
    color: '#059669',
    backgroundColor: '#ecfdf5',
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginBottom: 3,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
    fontSize: 7.5,
    color: '#94a3b8',
  },
});

function formatDate(date: Date) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  } catch {
    return '';
  }
}

function formatStatus(status: string) {
  return status
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function PortfolioPdf({ user }: PortfolioPdfProps) {
  return (
    <Document
      title={`${user.name || 'Portfolio'} - Resume`}
      author={user.name || 'SkillTrack'}
      subject="Professional Portfolio PDF"
    >
      <Page size="A4" style={styles.page}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{user.name || 'Your Name'}</Text>

          {user.headline && (
            <Text style={styles.headline}>{user.headline}</Text>
          )}

          <View style={styles.contactRow}>
            {user.location && (
              <>
                <Text>{user.location}</Text>
                {(user.githubUrl || user.linkedinUrl || user.resumeUrl) && (
                  <Text style={styles.bulletSeparator}>•</Text>
                )}
              </>
            )}

            {user.githubUrl && (
              <>
                <Link src={user.githubUrl} style={styles.link}>
                  GitHub
                </Link>
                {(user.linkedinUrl || user.resumeUrl) && (
                  <Text style={styles.bulletSeparator}>•</Text>
                )}
              </>
            )}

            {user.linkedinUrl && (
              <>
                <Link src={user.linkedinUrl} style={styles.link}>
                  LinkedIn
                </Link>
                {user.resumeUrl && (
                  <Text style={styles.bulletSeparator}>•</Text>
                )}
              </>
            )}

            {user.resumeUrl && (
              <Link src={user.resumeUrl} style={styles.link}>
                Portfolio Link
              </Link>
            )}
          </View>
        </View>

        {/* About / Summary Section */}
        {user.bio && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionAccentBar} />
              <Text style={styles.sectionTitle}>About Me</Text>
            </View>
            <Text style={styles.bio}>{user.bio}</Text>
          </View>
        )}

        {/* Skills Section - Modern Badge Pills */}
        {user.skills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionAccentBar} />
              <Text style={styles.sectionTitle}>Skills & Competencies</Text>
            </View>

            <View style={styles.skillGrid}>
              {user.skills.map((skill) => (
                <View key={skill.id} style={styles.skillPill}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <Text style={styles.skillLevelBadge}>• {skill.level}%</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Work Experience Section */}
        {user.experiences.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionAccentBar} />
              <Text style={styles.sectionTitle}>Professional Experience</Text>
            </View>

            {user.experiences.map((experience) => (
              <View key={experience.id} style={styles.item}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{experience.position}</Text>
                  <Text style={styles.date}>
                    {formatDate(experience.startDate)} —{' '}
                    {experience.current
                      ? 'Present'
                      : experience.endDate
                        ? formatDate(experience.endDate)
                        : '—'}
                  </Text>
                </View>

                <Text style={styles.itemSubtitle}>{experience.company}</Text>

                {experience.description && (
                  <Text style={styles.description}>
                    {experience.description}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects Section */}
        {user.projects.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionAccentBar} />
              <Text style={styles.sectionTitle}>Featured Projects</Text>
            </View>

            {user.projects.map((project) => (
              <View key={project.id} style={styles.item}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>{project.title}</Text>
                  <Text style={styles.statusBadge}>
                    {formatStatus(project.status)}
                  </Text>
                </View>

                {project.description && (
                  <Text style={styles.description}>{project.description}</Text>
                )}

                <View style={styles.projectLinks}>
                  {project.githubUrl && (
                    <Link src={project.githubUrl} style={styles.link}>
                      Source Code →
                    </Link>
                  )}

                  {project.liveUrl && (
                    <Link src={project.liveUrl} style={styles.link}>
                      Live Preview →
                    </Link>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Education Section */}
        {user.educations.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionAccentBar} />
              <Text style={styles.sectionTitle}>Education</Text>
            </View>

            {user.educations.map((education) => (
              <View key={education.id} style={styles.item}>
                <View style={styles.itemHeaderRow}>
                  <Text style={styles.itemTitle}>
                    {education.degree}
                    {education.field ? ` in ${education.field}` : ''}
                  </Text>
                  <Text style={styles.date}>
                    {formatDate(education.startDate)} —{' '}
                    {education.current
                      ? 'Present'
                      : education.endDate
                        ? formatDate(education.endDate)
                        : '—'}
                  </Text>
                </View>

                <Text style={styles.itemSubtitle}>{education.institution}</Text>

                {education.description && (
                  <Text style={styles.description}>
                    {education.description}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Dynamic PDF Footer */}
        <View style={styles.footer} fixed>
          <Text>Generated via SkillTrack Portfolio</Text>
          <Text
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
