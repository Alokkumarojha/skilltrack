'use client';

import { useState } from 'react';
import { updateProfile } from '../actions';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';

type EditProfileDialogProps = {
  user: {
    id: string;
    name: string | null;
    email: string;
    headline: string | null;
    bio: string | null;
    location: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    resumeUrl: string | null;
  };
};

export default function EditProfileDialog({ user }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState(user.name || '');
  const [headline, setHeadline] = useState(user.headline || '');
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  const [githubUrl, setGithubUrl] = useState(user.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(user.linkedinUrl || '');
  const [resumeUrl, setResumeUrl] = useState(user.resumeUrl || '');

  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      toast.add({
        type: 'error',
        description: 'Name is required',
        priority: 'high',
      });
      return;
    }

    setLoading(true);

    try {
      await updateProfile(
        name.trim(),
        headline.trim(),
        bio.trim(),
        location.trim(),
        githubUrl.trim(),
        linkedinUrl.trim(),
        resumeUrl.trim()
      );

      toast.add({
        type: 'success',
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });

      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Edit Profile
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information for your portfolio.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`profile-name-${user.id}`}>Name</Label>

            <Input
              id={`profile-name-${user.id}`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`profile-headline-${user.id}`}>Headline</Label>

            <Input
              id={`profile-headline-${user.id}`}
              placeholder="Frontend Developer"
              value={headline}
              onChange={(event) => setHeadline(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`profile-bio-${user.id}`}>Bio</Label>

            <Textarea
              id={`profile-bio-${user.id}`}
              placeholder="Tell something about yourself..."
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`profile-location-${user.id}`}>Location</Label>

            <Input
              id={`profile-location-${user.id}`}
              placeholder="Siwan, Bihar"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`profile-github-${user.id}`}>GitHub URL</Label>

            <Input
              id={`profile-github-${user.id}`}
              placeholder="https://github.com/..."
              value={githubUrl}
              onChange={(event) => setGithubUrl(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`profile-linkedin-${user.id}`}>LinkedIn URL</Label>

            <Input
              id={`profile-linkedin-${user.id}`}
              placeholder="https://linkedin.com/in/..."
              value={linkedinUrl}
              onChange={(event) => setLinkedinUrl(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`profile-resume-${user.id}`}>Resume URL</Label>

            <Input
              id={`profile-resume-${user.id}`}
              placeholder="https://..."
              value={resumeUrl}
              onChange={(event) => setResumeUrl(event.target.value)}
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
