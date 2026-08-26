'use client';

import { useState } from 'react';
import { updateGoal } from '@/app/dashboard/actions';

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

type EditGoalDialogProps = {
  goal: {
    id: string;
    title: string;
    description: string | null;
    progress: number;
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
    dueDate: Date | null;
  };
};

export default function EditGoalDialog({ goal }: EditGoalDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description || '');
  const [progress, setProgress] = useState(String(goal.progress));
  const [status, setStatus] = useState(goal.status);
  const [dueDate, setDueDate] = useState(
    goal.dueDate ? goal.dueDate.toISOString().split('T')[0] : ''
  );
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

    if (
      !Number.isInteger(numericProgress) ||
      numericProgress < 0 ||
      numericProgress > 100
    ) {
      toast.add({
        type: 'error',
        description: 'Goal progress must be between 0 and 100',
        priority: 'high',
      });
      return;
    }

    setLoading(true);

    try {
      await updateGoal(
        goal.id,
        title.trim(),
        description.trim(),
        numericProgress,
        status,
        dueDate || undefined
      );

      toast.add({
        type: 'success',
        title: 'Goal Updated',
        description: `The goal "${title.trim()}" has been updated.`,
      });

      setOpen(false);
    } catch (error) {
      toast.add({
        type: 'error',
        description:
          error instanceof Error ? error.message : 'Failed to update goal.',
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
          <DialogTitle>Edit Goal</DialogTitle>

          <DialogDescription>Update your goal details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`edit-goal-title-${goal.id}`}>Goal Title</Label>

            <Input
              id={`edit-goal-title-${goal.id}`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-goal-description-${goal.id}`}>
              Description
            </Label>

            <Textarea
              id={`edit-goal-description-${goal.id}`}
              placeholder="Describe your goal..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-goal-progress-${goal.id}`}>
              Goal Progress
            </Label>

            <Input
              id={`edit-goal-progress-${goal.id}`}
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={(event) => setProgress(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-goal-status-${goal.id}`}>Status</Label>

            <select
              id={`edit-goal-status-${goal.id}`}
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
          <div className="space-y-2">
            <Label htmlFor={`edit-goal-due-date-${goal.id}`}>Due Date</Label>

            <Input
              id={`edit-goal-due-date-${goal.id}`}
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
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
