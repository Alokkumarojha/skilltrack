'use client';

import { useState } from 'react';
import { createSkill } from '../actions';

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

export default function AddSkillDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('50');
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
      await createSkill(name.trim(), numericLevel);

      toast.add({
        title: 'Skill Added',
        description: `The skill "${name.trim()}" has been added.`,
      });

      setName('');
      setLevel('50');
      setOpen(false);
    } catch (error) {
      toast.add({
        type: 'error',
        description:
          error instanceof Error ? error.message : 'Failed to add skill.',
        priority: 'high',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>+ Add Skill</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Skill</DialogTitle>

          <DialogDescription>
            Add a skill and set your current proficiency level.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="skill-name">Skill Name</Label>

            <Input
              id="skill-name"
              placeholder="e.g. React"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill-level">Skill Level ({level}%)</Label>

            <Input
              id="skill-level"
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
              {loading ? 'Adding...' : 'Add Skill'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
