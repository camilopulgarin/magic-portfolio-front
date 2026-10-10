'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

function Briefcase(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

interface EmptyPortfoliosStateProps {
  className?: string;
}

export function EmptyPortfoliosState({ className }: EmptyPortfoliosStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 rounded-xl bg-card border border-border',
        className
      )}
    >
      <div className="p-4 rounded-full bg-primary/10 mb-6">
        <Briefcase className="w-12 h-12 text-primary" />
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        No tienes portafolios aún
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Crea tu primer portafolio para empezar a mostrar tu trabajo al mundo.
        Elige una plantilla y personalízalo a tu gusto.
      </p>

      <Link
        href="/dashboard/portfolios/new"
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground font-bold text-base shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
      >
        <Plus className="w-5 h-5" />
        Crear mi primer portafolio
      </Link>
    </div>
  );
}
