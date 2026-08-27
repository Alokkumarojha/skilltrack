'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import {
  Sparkles,
  LayoutDashboard,
  User,
  Globe,
  ArrowRight,
  Code2,
  UserRound,
} from 'lucide-react';

import { ModeToggle } from '@/components/mode-toggle';
import { buttonVariants } from '@/components/ui/button';

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  // Check karein ki user abhi Profile page par hai ya Dashboard par
  const isProfilePage = pathname.startsWith('/dashboard/profile');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
            <Code2 className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
            SkillTrack
          </span>
        </Link>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Theme Switcher Button */}
          <ModeToggle />

          {/* Signed Out View */}
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'sm',
                  className: 'font-medium cursor-pointer',
                })}
              >
                Sign In
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button
                type="button"
                className={buttonVariants({
                  size: 'sm',
                  className: 'font-semibold cursor-pointer shadow-sm gap-1.5',
                })}
              >
                Get Started
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </SignUpButton>
          </Show>

          {/* Signed In View */}
          <Show when="signed-in">
            {/* Dynamic Quick Link: Profile page par Dashboard button, baaki jagah Profile Settings button */}
            {isProfilePage ? (
              <Link
                href="/dashboard"
                className={buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                  className: 'hidden sm:inline-flex font-medium gap-1.5',
                })}
              >
                <LayoutDashboard className="h-4 w-4" />
                Back to Dashboard
              </Link>
            ) : (
              <Link
                href="/dashboard/profile"
                className={buttonVariants({
                  variant: 'outline',
                  size: 'sm',
                  className: 'hidden sm:inline-flex font-medium gap-1.5',
                })}
              >
                <UserRound className="h-4 w-4" />
                Back to Profile
              </Link>
            )}

            {/* Clerk User Button with Dynamic Theme Integration */}
            <div className="flex items-center pl-1 border-l">
              <UserButton
                appearance={{
                  theme: resolvedTheme === 'dark' ? dark : undefined,
                  elements: {
                    avatarBox:
                      'h-9 w-9 ring-2 ring-primary/20 hover:ring-primary transition-all',
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="Dashboard"
                    href="/dashboard"
                    labelIcon={<LayoutDashboard className="h-4 w-4" />}
                  />

                  <UserButton.Link
                    label="Profile Settings"
                    href="/dashboard/profile"
                    labelIcon={<User className="h-4 w-4" />}
                  />

                  <UserButton.Action label="manageAccount" />
                  <UserButton.Action label="signOut" />
                </UserButton.MenuItems>
              </UserButton>
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
}
