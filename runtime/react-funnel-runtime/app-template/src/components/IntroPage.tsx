import type { RendererProps } from "../runtime/rendererRegistry";

export function IntroPage({ page, onNext }: RendererProps) {
  const heroSrc = page.asset?.src;
  return (
    <section className="page-stack centered intro-page">
      <div className="intro-content">
        {heroSrc ? <img className="intro-hero-image" src={heroSrc} alt="" /> : <div className="hero-placeholder" />}
        <h1>{page.title}</h1>
        <p>{page.body || page.subtitle}</p>
      </div>
      <button className="primary-button sticky-button" onClick={onNext}>{page.cta || "Continue"}</button>
    </section>
  );
}
