'use client';

import { useState } from 'react';

import { deleteExperience } from '../actions';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

type DeleteExperienceDialogProps = {
  experienceId: string;
  company: string;
  position: string;
};

export default function DeleteExperienceDialog({
  experienceId,
  company,
  position,
}: DeleteExperienceDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);

    try {
      await deleteExperience(experienceId);

      toast.add({
        type: 'success',
        title: 'Experience Deleted',
        description: `${position} at ${company} has been deleted.`,
      });

      setOpen(false);
    } catch (error) {
      toast.add({
        type: 'error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to delete experience.',
        priority: 'high',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="sm" />}>
        Delete
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Experience?</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete your experience as{' '}
            <strong>{position}</strong> at <strong>{company}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
