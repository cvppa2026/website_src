export interface Author {
  name: string;
  affiliation_index?: number | number[];
}

interface AuthorTooltipProps {
  author: Author;
  affiliations?: string[];
}

export function AuthorTooltip({ author, affiliations = [] }: AuthorTooltipProps) {
  const getAffiliations = (): string[] => {
    if (author.affiliation_index === undefined || author.affiliation_index === null) {
      return ["Affiliation unknown"];
    }

    if (typeof author.affiliation_index === "number") {
      const aff = affiliations[author.affiliation_index];
      return aff ? [aff] : ["Affiliation unknown"];
    }

    if (Array.isArray(author.affiliation_index)) {
      const list = author.affiliation_index
        .map((idx) => affiliations[idx])
        .filter(Boolean);
      return list.length > 0 ? list : ["Affiliation unknown"];
    }

    return ["Affiliation unknown"];
  };

  const affList = getAffiliations();

  return (
    <span className="relative inline-block group cursor-help">
      <span className="font-medium text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:underline underline-offset-4 decoration-dotted decoration-slate-400 transition-colors">
        {author.name}
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 w-max max-w-xs md:max-w-sm">
        <span className="block bg-slate-900 dark:bg-slate-800 text-slate-100 text-xs rounded-lg py-2 px-3 shadow-xl border border-slate-700 whitespace-normal leading-relaxed text-left">
          {affList.length > 1 ? (
            <ul className="space-y-1">
              {affList.map((aff, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-blue-400 shrink-0">•</span>
                  <span>{aff}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span>{affList[0]}</span>
          )}
        </span>
        <span className="block w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 mx-auto -mt-1 border-r border-b border-slate-700"></span>
      </span>
    </span>
  );
}
