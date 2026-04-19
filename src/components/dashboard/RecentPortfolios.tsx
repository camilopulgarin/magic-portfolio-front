"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

function MoreVertical(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function Edit(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
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

function Trash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

interface Portfolio {
  id: string;
  name: string;
  template: string;
  views: number;
  status: "published" | "draft";
  lastEdited: string;
}

const portfolios: Portfolio[] = [
  { id: "1", name: "My Portfolio", template: "Modern Dark", views: 1234, status: "published", lastEdited: "2 hours ago" },
  { id: "2", name: "Creative CV", template: "Creative", views: 856, status: "published", lastEdited: "1 day ago" },
  { id: "3", name: "Tech Resume", template: "Minimalist", views: 0, status: "draft", lastEdited: "3 days ago" },
  { id: "4", name: "Design Portfolio", template: "Glassmorphism", views: 2341, status: "published", lastEdited: "1 week ago" },
];

interface RecentPortfoliosProps {
  className?: string;
}

export function RecentPortfolios({ className }: RecentPortfoliosProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div className={cn("rounded-xl bg-card border border-border overflow-hidden", className)}>
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Recent Portfolios</h2>
        <Link
          href="/dashboard/portfolios/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Create New
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Template</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Views</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Edited</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {portfolios.map((portfolio) => (
              <tr key={portfolio.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4">
                  <span className="font-medium text-foreground">{portfolio.name}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-muted-foreground">{portfolio.template}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-foreground">{portfolio.views.toLocaleString()}</span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      portfolio.status === "published"
                        ? "bg-green-400/10 text-green-400"
                        : "bg-yellow-400/10 text-yellow-400"
                    )}
                  >
                    {portfolio.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-muted-foreground">{portfolio.lastEdited}</span>
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() => setOpenMenu(openMenu === portfolio.id ? null : portfolio.id)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>

                    {openMenu === portfolio.id && (
                      <div className="absolute right-0 top-full mt-1 w-36 rounded-lg bg-card border border-border shadow-lg overflow-hidden z-10">
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors">
                          <Trash className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}