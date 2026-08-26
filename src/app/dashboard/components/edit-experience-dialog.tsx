'use client';

import { useState } from 'react';
import { updateExperience } from '../actions';

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

type EditExperienceDialogProps = {
  experience: {
    id: string;
    company: string;
    position: string;
    description: string | null;
    startDate: Date;
    endDate: Date | null;
    current: boolean;
  };
};

export default function EditExperienceDialog({
  experience,
}: EditExperienceDialogProps) {
  const [open, setOpen] = useState(false);

  const [company, setCompany] = useState(experience.company);
  const [position, setPosition] = useState(experience.position);
  const [description, setDescription] = useState(experience.description || '');

  const [startDate, setStartDate] = useState(
    experience.startDate.toISOString().split('T')[0]
  );

  const [endDate, setEndDate] = useState(
    experience.endDate ? experience.endDate.toISOString().split('T')[0] : ''
  );

  const [current, setCurrent] = useState(experience.current);
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
      await updateExperience(
        experience.id,
        company.trim(),
        position.trim(),
        description.trim(),
        startDate,
        current ? undefined : endDate || undefined,
        current
      );

      toast.add({
        type: 'success',
        title: 'Experience Updated',
        description: 'Your experience has been updated successfully.',
      });

      setOpen(false);
    } catch (error) {
      toast.add({
        type: 'error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update experience.',
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

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Experience</DialogTitle>
          <DialogDescription>
            Update your professional experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor={`edit-experience-company-${experience.id}`}>
              Company
            </label>

            <input
              id={`edit-experience-company-${experience.id}`}
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              disabled={loading}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor={`edit-experience-position-${experience.id}`}>
              Position
            </label>

            <input
              id={`edit-experience-position-${experience.id}`}
              value={position}
              onChange={(event) => setPosition(event.target.value)}
              disabled={loading}
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor={`edit-experience-description-${experience.id}`}>
              Description
            </label>

            <textarea
              id={`edit-experience-description-${experience.id}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={loading}
              className="min-h-24 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={`edit-experience-start-${experience.id}`}>
                Start Date
              </label>

              <input
                id={`edit-experience-start-${experience.id}`}
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                disabled={loading}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`edit-experience-end-${experience.id}`}>
                End Date
              </label>

              <input
                id={`edit-experience-end-${experience.id}`}
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                disabled={loading || current}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={current}
              onChange={(event) => {
                const checked = event.target.checked;

                setCurrent(checked);

                if (checked) {
                  setEndDate('');
                }
              }}
              disabled={loading}
            />
            I currently work here
          </label>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Updating...' : 'Update Experience'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
