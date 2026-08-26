'use client';

import { useState } from 'react';

import { deleteEducation } from '@/app/dashboard/actions';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

interface DeleteEducationDialogProps {
  educationId: string;
  educationTitle: string;
}

export default function DeleteEducationDialog({
  educationId,
  educationTitle,
}: DeleteEducationDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);

    try {
      await deleteEducation(educationId);

      setOpen(false);

      toast.add({
        type: 'success',
        title: 'Education Deleted',
        description: `"${educationTitle}" has been deleted successfully.`,
      });
    } catch (error) {
      toast.add({
        type: 'error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to delete education.',
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
          <DialogTitle>Delete Education?</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium">{educationTitle}</span>? This action
            cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
