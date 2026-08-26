'use client';

import { useState } from 'react';

import { createEducation } from '../actions';

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

export default function AddEducationDialog() {
  const [open, setOpen] = useState(false);

  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [field, setField] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);

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
      await createEducation(
        institution.trim(),
        degree.trim(),
        field.trim(),
        description.trim(),
        startDate,
        current ? undefined : endDate,
        current
      );

      setInstitution('');
      setDegree('');
      setField('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setCurrent(false);

      setOpen(false);

      toast.add({
        type: 'success',
        title: 'Education Added',
        description: 'Your education has been added successfully.',
      });
    } catch (error) {
      toast.add({
        type: 'error',
        description:
          error instanceof Error ? error.message : 'Failed to add education.',
        priority: 'high',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>Add Education</DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Education</DialogTitle>

          <DialogDescription>
            Add your educational background to your portfolio.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="education-institution">Institution</Label>

            <Input
              id="education-institution"
              placeholder="e.g. XYZ University"
              value={institution}
              onChange={(event) => setInstitution(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education-degree">Degree</Label>

            <Input
              id="education-degree"
              placeholder="e.g. B.Tech"
              value={degree}
              onChange={(event) => setDegree(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education-field">
              Field <span className="text-muted-foreground">(Optional)</span>
            </Label>

            <Input
              id="education-field"
              placeholder="e.g. Computer Science"
              value={field}
              onChange={(event) => setField(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education-description">
              Description{' '}
              <span className="text-muted-foreground">(Optional)</span>
            </Label>

            <Textarea
              id="education-description"
              placeholder="Add details about your education..."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="education-start-date">Start Date</Label>

              <Input
                id="education-start-date"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="education-end-date">End Date</Label>

              <Input
                id="education-end-date"
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
            {loading ? 'Adding...' : 'Add Education'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
