'use client';

import { useState } from 'react';
import { createGoal } from '../actions';

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

export default function AddGoalDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [progress, setProgress] = useState('0');
  const [status, setStatus] = useState<
    'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  >('NOT_STARTED');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numericProgress = Number(progress);

    if (!title.trim()) {
      toast.add({
        type: 'error',
        description: 'Goal title is required',
        priority: 'high',
      });
      return;
    }

    if (numericProgress < 0 || numericProgress > 100) {
      toast.add({
        type: 'error',
        description: 'Progress must be between 0 and 100',
        priority: 'high',
      });
      return;
    }

    setLoading(true);

    try {
      await createGoal(
        title.trim(),
        description.trim(),
        numericProgress,
        status,
        dueDate || undefined
      );

      toast.add({
        type: 'success',
        title: 'Goal Added',
        description: `The goal "${title.trim()}" has been added.`,
      });

      setTitle('');
      setDescription('');
      setProgress('0');
      setStatus('NOT_STARTED');
      setDueDate('');
      setOpen(false);
    } catch (error) {
      toast.add({
        type: 'error',
        description:
          error instanceof Error ? error.message : 'Failed to add goal.',
        priority: 'high',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>+ Add Goal</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Goal</DialogTitle>

          <DialogDescription>
            Add a goal and track your progress.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="goal-title">Goal Title</Label>

            <Input
              id="goal-title"
              placeholder="e.g. Learn TypeScript"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-description">Description</Label>

            <Textarea
              id="goal-description"
              placeholder="Describe what you want to achieve..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-progress">Progress ({progress}%)</Label>

            <Input
              id="goal-progress"
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={(event) => setProgress(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-status">Status</Label>

            <select
              id="goal-status"
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
              className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-due-date">Due Date</Label>

            <Input
              id="goal-due-date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              disabled={loading}
            />
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
              {loading ? 'Adding...' : 'Add Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
