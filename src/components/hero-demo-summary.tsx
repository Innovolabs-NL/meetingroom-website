import type { DemoSummary } from "./hero-app-demo-data";

function SummaryTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-1.5 overflow-x-auto rounded-md border border-border/50">
      <table className="w-full min-w-[280px] border-collapse text-[10px] leading-snug">
        <thead>
          <tr className="border-b border-border/50 bg-surface/80">
            {headers.map((header) => (
              <th
                key={header}
                className="px-2 py-1.5 text-left font-semibold text-foreground/90"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-border/30 last:border-0">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-2 py-1.5 align-top text-foreground/85">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function HeroDemoSummary({ summary }: { summary: DemoSummary }) {
  return (
    <article className="space-y-3.5 pb-1">
      <h3 className="text-[12px] font-bold leading-snug text-foreground">{summary.title}</h3>
      {summary.sections.map((section, index) => (
        <section key={index}>
          <h4 className="text-[11px] font-semibold text-foreground/95">{section.heading}</h4>
          {section.body ? (
            <p className="mt-1 leading-relaxed text-foreground/85">{section.body}</p>
          ) : null}
          {section.bullets?.length ? (
            <ul className="mt-1.5 list-disc space-y-1.5 pl-4 leading-relaxed text-foreground/85">
              {section.bullets.map((item, bulletIndex) => (
                <li key={bulletIndex}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.table ? (
            <SummaryTable headers={section.table.headers} rows={section.table.rows} />
          ) : null}
        </section>
      ))}
    </article>
  );
}
