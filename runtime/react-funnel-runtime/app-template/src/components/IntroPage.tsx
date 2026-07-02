import type { RendererProps } from "../runtime/rendererRegistry";

export function IntroPage({ page, onNext }: RendererProps) {
  const heroSrc = page.asset?.src;
  const variant = typeof page.variant === "string" ? page.variant : "image_top";
  return (
    <section className={`page-stack centered intro-page intro-variant-${variant}`}>
      <div className="intro-content">
        {heroSrc ? <img className="intro-hero-image" src={heroSrc} alt="" /> : <div className="hero-placeholder" />}
        <div className="intro-copy">
          {variant === "proof_panel" ? <span className="intro-kicker">Personalized insight</span> : null}
          <h1>{page.title}</h1>
          <p>{page.body || page.subtitle}</p>
        </div>
      </div>
      <button className="primary-button sticky-button" onClick={onNext}>{page.cta || "Continue"}</button>
    </section>
  );
}
