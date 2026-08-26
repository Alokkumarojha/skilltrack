'use client';

import { useState } from 'react';
import { updateSkill } from '@/app/dashboard/actions';

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

type EditSkillDialogProps = {
  skill: {
    id: string;
    name: string;
    level: number;
  };
};

export default function EditSkillDialog({ skill }: EditSkillDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(skill.name);
  const [level, setLevel] = useState(String(skill.level));
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      toast.add({
        type: 'error',
        description: 'Skill name is required',
        priority: 'high',
      });
      return;
    }

    const numericLevel = Number(level);

    if (
      !Number.isInteger(numericLevel) ||
      numericLevel < 0 ||
      numericLevel > 100
    ) {
      toast.add({
        type: 'error',
        description: 'Skill level must be between 0 and 100',
        priority: 'high',
      });
      return;
    }

    setLoading(true);

    try {
      await updateSkill(skill.id, name.trim(), numericLevel);

      toast.add({
        type: 'success',
        title: 'Skill Updated',
        description: `The skill "${name.trim()}" has been updated.`,
      });

      setOpen(false);
    } catch (error) {
      toast.add({
        type: 'error',
        description:
          error instanceof Error ? error.message : 'Failed to update skill.',
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
          <DialogTitle>Edit Skill</DialogTitle>

          <DialogDescription>
            Update your skill name and current proficiency level.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`edit-skill-name-${skill.id}`}>Skill Name</Label>

            <Input
              id={`edit-skill-name-${skill.id}`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-skill-level-${skill.id}`}>
              Skill Level ({level}%)
            </Label>

            <Input
              id={`edit-skill-level-${skill.id}`}
              type="number"
              min="0"
              max="100"
              value={level}
              onChange={(event) => setLevel(event.target.value)}
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

            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Updating...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
