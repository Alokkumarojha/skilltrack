import { getCurrentUser } from '@/lib/current-user';
import { UserCog, Sparkles } from 'lucide-react';
import ProfileForm from './components/profile-form';

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      {/* Header Section with Badge & Gradient */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-card via-card to-accent/10 p-6 shadow-xs backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Public Identity
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              Profile Settings
            </h1>

            <p className="text-sm font-medium text-muted-foreground sm:text-base">
              Manage the information displayed on your public portfolio.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border bg-background/80 text-primary shadow-xs backdrop-blur-md">
            <UserCog className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Main Profile Form Wrapper */}
      <div className="rounded-2xl border bg-card p-6 shadow-xs sm:p-8">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
