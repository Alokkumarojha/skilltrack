'use client';

import { useState } from 'react';
import { deleteSkill } from '../actions';

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

type DeleteSkillDialogProps = {
  skillId: string;
  skillName: string;
};

export default function DeleteSkillDialog({
  skillId,
  skillName,
}: DeleteSkillDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);

    try {
      await deleteSkill(skillId);

      toast.add({
        type: 'success',
        title: 'Skill Deleted',
        description: `"${skillName}" has been deleted.`,
      });

      setOpen(false);
    } catch (error) {
      toast.add({
        type: 'error',
        description:
          error instanceof Error ? error.message : 'Failed to delete skill.',
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
          <DialogTitle>Delete Skill?</DialogTitle>

          <DialogDescription>
            Are you sure you want to delete "{skillName}"? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="button"
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
