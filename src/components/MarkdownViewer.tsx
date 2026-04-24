import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownViewerProps {
  filename: string;
  showToc?: boolean;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export function MarkdownViewer({ filename, showToc = false }: MarkdownViewerProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeHeading, setActiveHeading] = useState<string>("");

  useEffect(() => {
    if (!showToc || content === "") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    // Give React a tick to render
    setTimeout(() => {
      const headingElements = document.querySelectorAll("h2[id]");
      headingElements.forEach((h) => observer.observe(h));
    }, 100);

    return () => observer.disconnect();
  }, [content, showToc]);

  useEffect(() => {
    setLoading(true);
    fetch(`/content/${filename}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Could not find the content file.");
        }
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setError(null);
      })
      .catch((err) => {
        console.error("Error loading markdown:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filename]);

  // Scroll to URL hash anchor after content has rendered
  useEffect(() => {
    if (loading || content === "") return;
    const hash = window.location.hash;
    if (!hash) return;
    // Give React a tick to paint the rendered markdown
    const id = hash.slice(1);
    const tryScroll = (attempts: number) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts > 0) {
        setTimeout(() => tryScroll(attempts - 1), 100);
      }
    };
    setTimeout(() => tryScroll(5), 100);
  }, [loading, content]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 dark:bg-red-900/20 text-center">
        <h3 className="text-lg font-medium text-red-800 dark:text-red-400">Content Unavailable</h3>
        <p className="mt-2 text-red-700 dark:text-red-300">
          We couldn't load this content right now. Please check if {filename} exists.
        </p>
      </div>
    );
  }

  const headings = showToc ? Array.from(content.matchAll(/(?:^|\n)##\s+(.+)/g)).map(m => m[1].trim()) : [];

  const MainContent = (
    <div className="prose prose-slate dark:prose-invert max-w-none 
      prose-headings:font-bold prose-h1:text-4xl prose-h2:text-2xl prose-h2:mt-10 
      prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-500 
      prose-img:rounded-xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: ({node, ...props}) => <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-8" {...props} />,
          h2: ({node, children, ...props}) => {
            const extractText = (val: any): string => {
                if (typeof val === 'string') return val;
                if (Array.isArray(val)) return val.map(extractText).join('');
                if (val && val.props && val.props.children) return extractText(val.props.children);
                return '';
            }
            const textContent = extractText(children);
            const id = slugify(textContent);
            return <h2 id={id} className="text-2xl md:text-3xl font-bold mt-12 mb-6 pb-2 border-b border-slate-200 dark:border-slate-800 scroll-mt-24" {...props}>{children}</h2>;
          },
          h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4" {...props} />,
          p: ({node, ...props}) => <p className="text-base md:text-lg leading-relaxed mb-6 text-slate-700 dark:text-slate-300" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-700 dark:text-slate-300" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-slate-700 dark:text-slate-300" {...props} />,
          li: ({node, ...props}) => <li className="pl-2" {...props} />,
          a: ({node, ...props}) => <a className="font-medium text-blue-600 active:text-blue-500 dark:text-blue-400 transition-colors" {...props} />,
          img: ({node, ...props}) => <img className="rounded-xl my-6 inline-block" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 py-1 italic bg-slate-50 dark:bg-slate-900/50 rounded-r-lg my-6" {...props} />,
          
          table: ({node, ...props}) => (
            <div className="overflow-x-auto my-8 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-left text-sm" {...props} />
            </div>
          ),
          thead: ({node, ...props}) => <thead className="bg-slate-50 dark:bg-slate-800" {...props} />,
          tbody: ({node, ...props}) => <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900" {...props} />,
          tr: ({node, ...props}) => <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" {...props} />,
          th: ({node, ...props}) => <th className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider" {...props} />,
          td: ({node, ...props}) => <td className="px-5 py-4 text-slate-700 dark:text-slate-300" {...props} />,

          code: ({node, className, children, ...props}: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const isMultiLine = String(children).includes('\n')
            if (match || isMultiLine) {
              return (
                <code className="block bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-4 rounded-xl font-mono text-sm overflow-x-auto my-6 border border-slate-200 dark:border-slate-800" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className="bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded-md font-mono text-sm" {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );

  if (!showToc || headings.length === 0) {
    return MainContent;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
      <div className="flex-1 w-full min-w-0">
        {MainContent}
      </div>
      
      <div className="w-full md:w-64 lg:w-72 shrink-0 md:sticky md:top-24">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">On this page</h4>
          <ul className="space-y-3">
            {headings.map((heading, i) => {
              const slug = slugify(heading.replace(/\*\*/g, ''));
              const isActive = activeHeading === slug;
              return (
              <li key={i}>
                <a 
                  href={`#${slug}`} 
                  className={`text-sm block transition-colors ${
                    isActive 
                      ? "font-bold text-blue-600 dark:text-blue-400" 
                      : "font-medium text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                  }`}
                >
                  {heading.replace(/\*\*/g, '')}
                </a>
              </li>
            )})}
          </ul>
        </div>
      </div>
    </div>
  );
}
