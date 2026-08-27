'use client';

import { useState } from 'react';
import { Globe2, LockKeyhole, Loader2 } from 'lucide-react';

import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/toast';
import { updatePortfolioVisibility } from '@/app/dashboard/actions';

type PortfolioVisibilityProps = {
  isPublic: boolean;
};

export default function PortfolioVisibility({
  isPublic,
}: PortfolioVisibilityProps) {
  const [publicStatus, setPublicStatus] = useState(isPublic);
  const [loading, setLoading] = useState(false);

  async function handleVisibilityChange(checked: boolean) {
    setLoading(true);

    try {
      await updatePortfolioVisibility(checked);

      setPublicStatus(checked);

      toast.add({
        type: 'success',
        title: checked ? 'Portfolio is now public' : 'Portfolio is now private',
        description: checked
          ? 'Anyone with your portfolio link can view it.'
          : 'Your public portfolio is now hidden.',
      });
    } catch (error) {
      toast.add({
        type: 'error',
        title: 'Something went wrong',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update portfolio visibility.',
        priority: 'high',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-xs sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-primary/10 text-primary">
            {publicStatus ? (
              <Globe2 className="h-5 w-5" />
            ) : (
              <LockKeyhole className="h-5 w-5" />
            )}
          </div>

          <div>
            <h2 className="font-bold tracking-tight">Portfolio Visibility</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {publicStatus
                ? 'Your portfolio is publicly visible.'
                : 'Your portfolio is currently private.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}

          <span className="text-sm font-medium">
            {publicStatus ? 'Public' : 'Private'}
          </span>

          <Switch
            checked={publicStatus}
            onCheckedChange={handleVisibilityChange}
            disabled={loading}
            aria-label="Toggle portfolio visibility"
          />
        </div>
      </div>
    </div>
  );
}
