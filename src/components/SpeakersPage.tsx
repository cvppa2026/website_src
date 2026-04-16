import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Speaker {
  name: string;
  image: string;
  bio: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SpeakersPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/content/speaker.json")
      .then((res) => res.json())
      .then((data: Speaker[]) => setSpeakers(shuffle(data)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-10">
        Keynote Speakers
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {speakers.map((speaker) => (
          <div
            key={speaker.name}
            className="flex flex-col items-center gap-5 p-6 rounded-2xl
              bg-slate-50 dark:bg-slate-900/50
              border border-slate-200 dark:border-slate-800
              hover:shadow-lg dark:hover:shadow-slate-900 transition-shadow duration-300"
          >
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-[250px] h-[250px] rounded-full object-cover ring-4 ring-slate-200 dark:ring-slate-700"
            />

            <div className="w-full">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 text-center">
                {speaker.name}
              </h2>
              <div className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a
                        className="font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-0" {...props} />
                    ),
                  }}
                >
                  {speaker.bio}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
