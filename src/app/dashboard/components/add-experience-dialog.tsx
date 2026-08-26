'use client';

import { useState } from 'react';
import { createExperience } from '@/app/dashboard/actions';

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

export default function AddExperienceDialog() {
  const [open, setOpen] = useState(false);

  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!company.trim()) {
      toast.add({
        type: 'error',
        description: 'Company name is required',
        priority: 'high',
      });
      return;
    }

    if (!position.trim()) {
      toast.add({
        type: 'error',
        description: 'Position is required',
        priority: 'high',
      });
      return;
    }

    if (!startDate) {
      toast.add({
        type: 'error',
        description: 'Start date is required',
        priority: 'high',
      });
      return;
    }

    setLoading(true);

    try {
      await createExperience(
        company.trim(),
        position.trim(),
        description.trim(),
        startDate,
        current ? undefined : endDate || undefined,
        current
      );

      setCompany('');
      setPosition('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setCurrent(false);

      setOpen(false);

      toast.add({
        type: 'success',
        title: 'Experience Added',
        description: 'Your experience has been added successfully.',
      });
    } catch (error) {
      toast.add({
        type: 'error',
        description:
          error instanceof Error ? error.message : 'Failed to add experience.',
        priority: 'high',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>+ Add Experience</DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Experience</DialogTitle>
          <DialogDescription>
            Add your professional work experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="experience-company">Company</Label>

            <Input
              id="experience-company"
              placeholder="Company name"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience-position">Position</Label>

            <Input
              id="experience-position"
              placeholder="Frontend Developer"
              value={position}
              onChange={(event) => setPosition(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience-description">Description</Label>

            <Textarea
              id="experience-description"
              placeholder="Describe your responsibilities and achievements..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="experience-start-date">Start Date</Label>

              <Input
                id="experience-start-date"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience-end-date">End Date</Label>

              <Input
                id="experience-end-date"
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                disabled={loading || current}
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={current}
              onChange={(event) => {
                setCurrent(event.target.checked);

                if (event.target.checked) {
                  setEndDate('');
                }
              }}
              disabled={loading}
            />
            I currently work here
          </label>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Adding...' : 'Add Experience'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
