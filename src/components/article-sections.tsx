export function ArticleSections({
  sections,
}: {
  sections: { title: string; body: string }[];
}) {
  return (
    <div className="mt-12 space-y-12">
      {sections.map((s, i) => (
        <section key={i} className="scroll-mt-28">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{s.title}</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted">{s.body}</p>
        </section>
      ))}
    </div>
  );
}
