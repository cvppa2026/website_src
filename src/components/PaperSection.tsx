import React from "react";
import { AuthorTooltip, type Author } from "./AuthorTooltip";

export interface Paper {
  id: number;
  title: string;
  authors: Author[];
  affiliations?: string[];
}

interface PaperSectionProps {
  id: string;
  title: string;
  description?: string;
  papers: Paper[];
}

export function PaperSection({ id, title, description, papers }: PaperSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <h2 className="text-2xl md:text-3xl font-bold pb-2 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-between">
        <span>{title}</span>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700">
          {papers.length} {papers.length === 1 ? "Paper" : "Papers"}
        </span>
      </h2>

      {description && (
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm md:text-base">
          {description}
        </p>
      )}

      <div className="mt-6 space-y-4">
        {papers.map((paper) => (
          <div
            key={paper.id}
            className="p-5 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  Paper ID: #{paper.id}
                </span>
              </div>

              <div className="text-slate-700 dark:text-slate-300 text-sm md:text-base flex flex-wrap items-center gap-x-1.5 gap-y-1">
                {paper.authors.map((author, index) => (
                  <React.Fragment key={index}>
                    <AuthorTooltip author={author} affiliations={paper.affiliations} />
                    {index < paper.authors.length - 1 && (
                      <span className="text-slate-400 dark:text-slate-600">,</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {paper.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
