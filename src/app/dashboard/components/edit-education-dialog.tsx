'use client';

import { useState } from 'react';

import { updateEducation } from '@/app/dashboard/actions';

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

type Education = {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  description: string | null;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
};

interface EditEducationDialogProps {
  education: Education;
}

export default function EditEducationDialog({
  education,
}: EditEducationDialogProps) {
  const [open, setOpen] = useState(false);

  const [institution, setInstitution] = useState(education.institution);
  const [degree, setDegree] = useState(education.degree);
  const [field, setField] = useState(education.field ?? '');
  const [description, setDescription] = useState(education.description ?? '');

  const [startDate, setStartDate] = useState(
    education.startDate.toISOString().split('T')[0]
  );

  const [endDate, setEndDate] = useState(
    education.endDate ? education.endDate.toISOString().split('T')[0] : ''
  );

  const [current, setCurrent] = useState(education.current);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!institution.trim()) {
      toast.add({
        type: 'error',
        description: 'Institution name is required',
        priority: 'high',
      });
      return;
    }

    if (!degree.trim()) {
      toast.add({
        type: 'error',
        description: 'Degree is required',
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

    if (!current && !endDate) {
      toast.add({
        type: 'error',
        description: 'End date is required',
        priority: 'high',
      });
      return;
    }

    setLoading(true);

    try {
      await updateEducation(
        education.id,
        institution.trim(),
        degree.trim(),
        field.trim(),
        description.trim(),
        startDate,
        current ? undefined : endDate,
        current
      );

      setOpen(false);

      toast.add({
        type: 'success',
        title: 'Education Updated',
        description: 'Your education has been updated successfully.',
      });
    } catch (error) {
      toast.add({
        type: 'error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update education.',
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
          <DialogTitle>Edit Education</DialogTitle>

          <DialogDescription>
            Update your educational background.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`edit-education-institution-${education.id}`}>
              Institution
            </Label>

            <Input
              id={`edit-education-institution-${education.id}`}
              value={institution}
              onChange={(event) => setInstitution(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-education-degree-${education.id}`}>
              Degree
            </Label>

            <Input
              id={`edit-education-degree-${education.id}`}
              value={degree}
              onChange={(event) => setDegree(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-education-field-${education.id}`}>
              Field <span className="text-muted-foreground">(Optional)</span>
            </Label>

            <Input
              id={`edit-education-field-${education.id}`}
              value={field}
              onChange={(event) => setField(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-education-description-${education.id}`}>
              Description{' '}
              <span className="text-muted-foreground">(Optional)</span>
            </Label>

            <Textarea
              id={`edit-education-description-${education.id}`}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`edit-education-start-${education.id}`}>
                Start Date
              </Label>

              <Input
                id={`edit-education-start-${education.id}`}
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`edit-education-end-${education.id}`}>
                End Date
              </Label>

              <Input
                id={`edit-education-end-${education.id}`}
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
                const checked = event.target.checked;

                setCurrent(checked);

                if (checked) {
                  setEndDate('');
                }
              }}
              disabled={loading}
            />
            I am currently studying here
          </label>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Updating...' : 'Update Education'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
