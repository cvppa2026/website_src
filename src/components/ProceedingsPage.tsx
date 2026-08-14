import { useState, useEffect } from "react";
import { PaperSection, type Paper } from "./PaperSection";

const fullPaperFiles = import.meta.glob<Record<string, unknown>>("../../public/content/full_papers/*.json", {
  eager: true,
});

const fullPaperPdfs = import.meta.glob<string>("../../public/content/full_papers/*.pdf", {
  eager: true,
  query: "?url",
  import: "default",
});

const extendedAbstractFiles = import.meta.glob<Record<string, unknown>>(
  "../../public/content/extended_abstracts/*.json",
  { eager: true }
);

const extendedAbstractPdfs = import.meta.glob<string>(
  "../../public/content/extended_abstracts/*.pdf",
  { eager: true, query: "?url", import: "default" }
);

function parsePapersFromGlob(
  globResult: Record<string, unknown>,
  pdfGlobResult: Record<string, string> = {}
): Paper[] {
  return Object.entries(globResult)
    .map(([path, mod]) => {
      const filename = path.split("/").pop() || "";
      const id = parseInt(filename.replace(".json", ""), 10);
      const data = ((mod as { default?: Record<string, unknown> }).default || mod) as Record<string, unknown>;
      const pdfKey = path.replace(/\.json$/, ".pdf");
      const pdfUrl = data.pdf || pdfGlobResult[pdfKey] || undefined;

      return {
        id,
        title: typeof data.title === "string" ? data.title : "",
        authors: Array.isArray(data.authors) ? data.authors : [],
        affiliations: Array.isArray(data.affiliations) ? data.affiliations : [],
        pdfUrl: typeof pdfUrl === "string" ? pdfUrl : undefined,
        videoUrl: typeof data.video === "string" ? data.video : (typeof data.videoUrl === "string" ? (data.videoUrl as string) : undefined),
        supplementaryUrl: typeof data.supplementary === "string" ? data.supplementary : (typeof data.supplementaryUrl === "string" ? (data.supplementaryUrl as string) : undefined),
        datasetUrl: typeof data.dataset === "string" ? data.dataset : (typeof data.datasetUrl === "string" ? (data.datasetUrl as string) : undefined),
        abstract: typeof data.abstract === "string" ? data.abstract : undefined,
      };
    })
    .sort((a, b) => a.id - b.id);
}

const fullPapers = parsePapersFromGlob(fullPaperFiles, fullPaperPdfs);
const extendedAbstracts = parsePapersFromGlob(extendedAbstractFiles, extendedAbstractPdfs);

const sections = [
  { id: "full-papers", title: "Full Papers" },
  { id: "extended-abstracts", title: "Extended Abstracts" },
];

export function ProceedingsPage() {
  const [activeSection, setActiveSection] = useState<string>("full-papers");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Handle direct hash navigation on load
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-slate-900 dark:text-slate-100">
        Proceedings
      </h1>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        <div className="flex-1 w-full min-w-0">
          <PaperSection
            id="full-papers"
            title="Full Papers"
            description="Peer-reviewed full research papers accepted for CVPPA 2026."
            papers={fullPapers}
          />

          <PaperSection
            id="extended-abstracts"
            title="Extended Abstracts"
            description="Extended abstracts highlighting ongoing research and preliminary findings."
            papers={extendedAbstracts}
          />
        </div>

        {/* Side menu */}
        <div className="w-full md:w-64 lg:w-72 shrink-0 md:sticky md:top-24">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
              On this page
            </h4>
            <ul className="space-y-3">
              {sections.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <li key={sec.id}>
                    <a
                      href={`#${sec.id}`}
                      className={`text-sm block transition-colors ${isActive
                          ? "font-bold text-blue-600 dark:text-blue-400"
                          : "font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                        }`}
                    >
                      {sec.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
