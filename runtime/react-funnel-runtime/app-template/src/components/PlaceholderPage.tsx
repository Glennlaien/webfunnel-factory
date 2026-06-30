import type { RendererProps } from "../runtime/rendererRegistry";

export function PlaceholderPage({ page, onNext }: RendererProps) {
  return (
    <section className="page-stack centered">
      <h1>{page.title}</h1>
      <p>{page.subtitle || "This capability is listed in docs/runtime-page-capabilities.md and reserved for the next runtime milestone."}</p>
      <button className="primary-button" onClick={onNext}>{page.cta || "Continue"}</button>
    </section>
  );
}
