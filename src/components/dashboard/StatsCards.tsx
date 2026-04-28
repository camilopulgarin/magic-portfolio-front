"use client";

import { cn } from "@/lib/utils";

function Briefcase(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function UserCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21a8 8 0 0 0-16 0" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

function Star(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: "briefcase" | "eye" | "userCheck" | "star";
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const icons = {
  briefcase: Briefcase,
  eye: Eye,
  userCheck: UserCheck,
  star: Star,
};

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  const Icon = icons[icon];

  return (
    <div
      className={cn(
        "p-6 rounded-xl bg-card border border-border transition-all duration-300 hover:border-primary/30",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              trend.isPositive
                ? "text-green-400 bg-green-400/10"
                : "text-red-400 bg-red-400/10"
            )}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{title}</p>
      </div>
    </div>
  );
}

interface StatsCardsProps {
  className?: string;
}

const stats = [
  { title: "Total Portafolios", value: 12, icon: "briefcase" as const, trend: { value: 8, isPositive: true } },
  { title: "Total Vistas", value: "2.4K", icon: "eye" as const, trend: { value: 24, isPositive: true } },
  { title: "Perfil Completo", value: "78%", icon: "userCheck" as const, trend: { value: 12, isPositive: true } },
  { title: "Destacados", value: 3, icon: "star" as const },
];

export function StatsCards({ className }: StatsCardsProps) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}