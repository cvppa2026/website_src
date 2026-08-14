import React from "react";
import { FileText, Download, Video, Paperclip, Database, ExternalLink } from "lucide-react";
import { AuthorTooltip, type Author } from "./AuthorTooltip";

export interface Paper {
  id: number;
  title: string;
  authors: Author[];
  affiliations?: string[];
  pdfUrl?: string;
  pdf?: string;
  videoUrl?: string;
  video?: string;
  supplementaryUrl?: string;
  supplementary?: string;
  datasetUrl?: string;
  dataset?: string;
}

interface PaperSectionProps {
  id: string;
  title: string;
  description?: string;
  papers: Paper[];
}

function formatAssetUrl(url?: string): string | undefined {
  if (!url) return undefined;
  let trimmed = url.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("public/")) {
    trimmed = trimmed.slice("public/".length);
  }
  if (!trimmed.startsWith("/")) {
    trimmed = "/" + trimmed;
  }
  return trimmed;
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
        {papers.map((paper) => {
          const pdfDownloadUrl = formatAssetUrl(paper.pdfUrl || paper.pdf);
          const supplementaryDownloadUrl = formatAssetUrl(paper.supplementaryUrl || paper.supplementary);
          const videoLinkUrl = formatAssetUrl(paper.videoUrl || paper.video);
          const datasetLinkUrl = formatAssetUrl(paper.datasetUrl || paper.dataset);

          return (
            <div
              key={paper.id}
              className="p-5 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-md bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    Paper ID: #{paper.id}
                  </span>

                  <div className="flex flex-wrap items-center gap-2">
                    {pdfDownloadUrl && (
                      <a
                        href={pdfDownloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 transition-all duration-200 shadow-sm hover:shadow group shrink-0"
                        title="Download PDF"
                        aria-label={`Download PDF for paper ${paper.id}`}
                      >
                        <FileText className="w-3.5 h-3.5 text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform" />
                        <span>PDF</span>
                        <Download className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}

                    {supplementaryDownloadUrl && (
                      <a
                        href={supplementaryDownloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 transition-all duration-200 shadow-sm hover:shadow group shrink-0"
                        title="Download Supplementary Material"
                        aria-label={`Download Supplementary Material for paper ${paper.id}`}
                      >
                        <Paperclip className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span>Supplementary</span>
                        <Download className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}

                    {videoLinkUrl && (
                      <a
                        href={videoLinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/50 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 transition-all duration-200 shadow-sm hover:shadow group shrink-0"
                        title="Watch Video"
                        aria-label={`Watch Video for paper ${paper.id}`}
                      >
                        <Video className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform" />
                        <span>Video</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}

                    {datasetLinkUrl && (
                      <a
                        href={datasetLinkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 transition-all duration-200 shadow-sm hover:shadow group shrink-0"
                        title="Access Dataset"
                        aria-label={`Access Dataset for paper ${paper.id}`}
                      >
                        <Database className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
                        <span>Dataset</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </div>
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
          );
        })}
      </div>
    </section>
  );
}


