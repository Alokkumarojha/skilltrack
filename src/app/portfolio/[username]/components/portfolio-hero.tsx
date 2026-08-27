'use client';
import Image from 'next/image';
import Link from 'next/link';
import { FileText, MapPin, Download, Copy, Share2, Check } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useState } from 'react';
import { toast } from '@/components/ui/toast';

type PortfolioHeroProps = {
  user: {
    name: string | null;
    username: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    resumeUrl: string | null;
    imageUrl: string | null;
  };
};

export default function PortfolioHero({ user }: PortfolioHeroProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      toast.add({
        type: 'success',
        title: 'Link Copied',
        description: 'Your portfolio link has been copied.',
      });

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.add({
        type: 'error',
        title: 'Copy Failed',
        description: 'Could not copy the portfolio link.',
      });
    }
  }

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user.name ?? 'Portfolio'} | SkillTrack`,
          text: user.headline ?? 'Check out my professional portfolio.',
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);

        toast.add({
          type: 'success',
          title: 'Link Copied',
          description: 'Your portfolio link has been copied.',
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      toast.add({
        type: 'error',
        title: 'Share Failed',
        description: 'Could not share the portfolio link.',
      });
    }
  }
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-background/90 to-muted/30 py-16 sm:py-24">
      {/* Subtle Ambient Glow Effect */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-10">
          {/* Avatar Container with Gradient Glow Border */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary/50 to-primary/20 opacity-75 blur transition duration-300 group-hover:opacity-100" />

            <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-background bg-muted shadow-xl sm:h-36 sm:w-36">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.name ?? 'Profile photo'}
                  fill
                  sizes="(max-width: 640px) 128px, 144px"
                  priority
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-4xl font-bold text-primary">
                  {user.name?.charAt(0).toUpperCase() ?? '?'}
                </div>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                  {user.name}
                </h1>

                {user.location && (
                  <span className="inline-flex items-center gap-1 rounded-full border bg-background/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground backdrop-blur">
                    <MapPin className="h-3 w-3 text-primary" />
                    {user.location}
                  </span>
                )}
              </div>

              {user.username && (
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  @{user.username}
                </p>
              )}
            </div>

            {user.headline && (
              <p className="text-lg font-medium text-foreground/90 sm:text-xl leading-snug">
                {user.headline}
              </p>
            )}

            {user.bio && (
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {user.bio}
              </p>
            )}

            {/* Action Buttons & Social Links */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              {/* View Resume */}
              {user.resumeUrl && (
                <Link
                  href={`/portfolio/${user.username}/resume`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 active:scale-95 cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  <span>View Resume</span>
                </Link>
              )}

              {/* Generate Portfolio PDF */}
              {user.username && (
                <Link
                  href={`/portfolio/${user.username}/pdf`}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Generate PDF</span>
                </Link>
              )}

              {/* Copy & Share Actions */}
              {user.username && (
                <>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex min-w-[125px] shrink-0 items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Copied!
                        </span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </>
              )}

              {/* Social Profiles */}
              {user.githubUrl && (
                <Link
                  href={user.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 cursor-pointer"
                >
                  <FaGithub className="h-4 w-4" />
                  <span>GitHub</span>
                </Link>
              )}

              {user.linkedinUrl && (
                <Link
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 cursor-pointer"
                >
                  <FaLinkedin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>LinkedIn</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
