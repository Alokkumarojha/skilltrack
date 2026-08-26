'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  AtSign,
  MapPin,
  FileText,
  FileDown,
  Loader2,
  Save,
  Link2,
  ExternalLink,
  LayoutDashboard,
} from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

import { updatePortfolioProfile } from '@/app/dashboard/actions';
import { toast } from '@/components/ui/toast';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ProfileFormProps = {
  user: {
    name: string | null;
    username: string | null;
    headline: string | null;
    bio: string | null;
    location: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    resumeUrl: string | null;
    email: string;
  };
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name ?? '');
  const [username, setUsername] = useState(user.username ?? '');
  const [headline, setHeadline] = useState(user.headline ?? '');
  const [bio, setBio] = useState(user.bio ?? '');
  const [location, setLocation] = useState(user.location ?? '');
  const [githubUrl, setGithubUrl] = useState(user.githubUrl ?? '');
  const [linkedinUrl, setLinkedinUrl] = useState(user.linkedinUrl ?? '');
  const [resumeUrl, setResumeUrl] = useState(user.resumeUrl ?? '');

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      await updatePortfolioProfile(
        name,
        username,
        headline,
        bio,
        location,
        githubUrl,
        linkedinUrl,
        resumeUrl
      );

      toast.add({
        type: 'success',
        title: 'Profile Updated',
        description: 'Your profile details have been saved.',
      });

      router.refresh();
    } catch (error) {
      toast.add({
        type: 'error',
        description:
          error instanceof Error ? error.message : 'Failed to update profile.',
        priority: 'high',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-card p-4 shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Edit Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your public profile information and social links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            }
          />

          {username ? (
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={
                <Link
                  href={`/portfolio/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Portfolio
                </Link>
              }
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              }
            />
          )}
        </div>
      </div>
      {/* Basic Personal Information Section */}
      <Card className="border shadow-xs">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <CardTitle className="text-lg font-bold">Personal Details</CardTitle>
          <CardDescription>
            This information will be displayed at the top of your public
            portfolio.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-9"
                />
              </div>
            </div>

            {/* Username & URL Preview */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Username
              </Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="johndoe"
                  className="pl-9 font-mono text-xs"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Public Link:</span>
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary">
                  /portfolio/{username || 'username'}
                </code>
              </div>
            </div>
          </div>

          {/* Professional Headline */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="headline"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Professional Headline
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {headline.length}/150
              </span>
            </div>
            <Input
              id="headline"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Full Stack Developer & Open Source Contributor"
              maxLength={150}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label
              htmlFor="location"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="San Francisco, CA"
                maxLength={100}
                className="pl-9"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="bio"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                About Bio
              </Label>
              <span className="text-[11px] text-muted-foreground">
                {bio.length}/1000
              </span>
            </div>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write a short pitch or intro about your journey, skills, and interests..."
              rows={5}
              maxLength={1000}
              className="resize-y"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social & External Links Section */}
      <Card className="border shadow-xs">
        <CardHeader className="border-b bg-muted/20 pb-4">
          <div className="flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            <CardTitle className="text-lg font-bold">
              Social Links & Resume
            </CardTitle>
          </div>
          <CardDescription>
            Connect your profiles to make it easy for recruiters to reach you.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 pt-6">
          {/* GitHub */}
          <div className="space-y-2">
            <Label
              htmlFor="githubUrl"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              GitHub Profile
            </Label>
            <div className="relative">
              <FaGithub className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
              <Input
                id="githubUrl"
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                maxLength={300}
                className="pl-9 font-mono text-xs"
              />
            </div>
          </div>

          {/* LinkedIn */}
          <div className="space-y-2">
            <Label
              htmlFor="linkedinUrl"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              LinkedIn Profile
            </Label>
            <div className="relative">
              <FaLinkedin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
              <Input
                id="linkedinUrl"
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                maxLength={300}
                className="pl-9 font-mono text-xs"
              />
            </div>
          </div>

          {/* Resume Link */}
          <div className="space-y-2">
            <Label
              htmlFor="resumeUrl"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Resume Link (PDF / Drive)
            </Label>
            <div className="relative">
              <FileDown className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/70" />
              <Input
                id="resumeUrl"
                type="url"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                placeholder="https://drive.google.com/your-resume.pdf"
                maxLength={300}
                className="pl-9 font-mono text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating / Sticky Save Actions */}
      <div className="flex items-center justify-end gap-3 rounded-xl border bg-card/80 p-4 shadow-xs backdrop-blur-md">
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="min-w-[140px] font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
