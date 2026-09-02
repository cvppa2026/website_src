import { useState, useEffect } from "react";
import { MarkdownViewer } from "./MarkdownViewer";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

interface Speaker {
  name: string;
  image: string;
  bio: string;
  talkTitle?: string;
  talkAbstract?: string;
}

export function ProgrammePage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  useEffect(() => {
    fetch("/content/speaker.json")
      .then((res) => res.json())
      .then((data: Speaker[]) => {
        // Order: Susie Robinson first, then Fumio Okura
        const sorted = [...data].sort((a, b) => {
          if (a.name.includes("Susie")) return -1;
          if (b.name.includes("Susie")) return 1;
          return 0;
        });
        setSpeakers(sorted);
      });
  }, []);

  return (
    <div className="flex flex-col gap-12 animate-fadeIn">
      <MarkdownViewer filename="programme.md" />
      
      <div className="prose prose-slate dark:prose-invert max-w-none -mt-8">
        <h2 id="keynote-talks" className="text-2xl md:text-3xl font-bold mt-12 mb-6 pb-2 border-b border-slate-200 dark:border-slate-800 scroll-mt-24">
          Keynote Talks
        </h2>
        
        <div className="space-y-12">
          {speakers.map((speaker, index) => (
            <div key={speaker.name} className="border-l-4 border-blue-500 pl-6 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-r-lg">
              <h3 className="text-xl md:text-2xl font-bold mt-0 mb-2">
                Keynote {index + 1}: {speaker.name}
              </h3>
              
              {speaker.talkTitle && (
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2">
                  {speaker.talkTitle}
                </p>
              )}
              
              {speaker.talkAbstract && (
                <div>
                  <p className="font-bold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-4 mb-2">Abstract:</p>
                  <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                    <ReactMarkdown remarkPlugins={[remarkBreaks]}>{speaker.talkAbstract}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
