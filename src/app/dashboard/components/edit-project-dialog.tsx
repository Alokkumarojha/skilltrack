'use client';

import { useState } from 'react';

import { updateProject } from '@/app/dashboard/actions';

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
import { toast } from '@/components/ui/toast';
import { Textarea } from '@/components/ui/textarea';

type EditProjectDialogProps = {
  project: {
    id: string;
    title: string;
    description: string | null;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    githubUrl: string | null;
    liveUrl: string | null;
  };
};

export default function EditProjectDialog({ project }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description || '');
  const [status, setStatus] = useState(project.status);
  const [githubUrl, setGithubUrl] = useState(project.githubUrl || '');
  const [liveUrl, setLiveUrl] = useState(project.liveUrl || '');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      toast.add({
        type: 'error',
        description: 'Project title is required',
        priority: 'high',
      });
      return;
    }

    setLoading(true);

    try {
      await updateProject(
        project.id,
        title.trim(),
        description.trim(),
        githubUrl.trim(),
        liveUrl.trim(),
        status
      );

      toast.add({
        type: 'success',
        title: 'Project Updated',
        description: `The project "${title.trim()}" has been updated.`,
      });

      setOpen(false);
    } catch (error) {
      toast.add({
        type: 'error',
        description:
          error instanceof Error ? error.message : 'Failed to update project.',
        priority: 'high',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>
          <DialogDescription>Update your project details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`edit-project-title-${project.id}`}>
              Project Title
            </Label>

            <Input
              id={`edit-project-title-${project.id}`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-project-description-${project.id}`}>
              Description
            </Label>

            <Textarea
              id={`edit-project-description-${project.id}`}
              placeholder="Describe your Project..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`edit-project-githubUrl-${project.id}`}>
              Github URL
            </Label>

            <Input
              id={`edit-project-githubUrl-${project.id}`}
              value={githubUrl}
              onChange={(event) => setGithubUrl(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-project-liveUrl-${project.id}`}>
              Live URL
            </Label>

            <Input
              id={`edit-project-liveUrl-${project.id}`}
              value={liveUrl}
              onChange={(event) => setLiveUrl(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-project-status-${project.id}`}>Status</Label>

            <select
              id={`edit-project-status-${project.id}`}
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as
                    | 'NOT_STARTED'
                    | 'IN_PROGRESS'
                    | 'COMPLETED'
                )
              }
              disabled={loading}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
