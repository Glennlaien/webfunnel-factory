import type { RendererProps } from "../runtime/rendererRegistry";
import { routeTo } from "../runtime/navigation";
import { clearRuntimeSession } from "../runtime/storage";
import { resetAnalytics, trackEvent } from "../runtime/analytics";

function textValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function EntryPage({ page, onNext }: RendererProps) {
  const heroSrc = page.asset?.src;
  const brandName = textValue(page.productName, textValue(page.appName, textValue(page.brandName, "Personalized Plan")));
  const headline = textValue(page.title, textValue(page.subtitle, textValue(page.body, "Build your personalized plan")));
  const subtitle = textValue(page.subtitle);
  const supporting = subtitle && subtitle !== headline ? subtitle : "";
  const start = () => {
    resetAnalytics();
    clearRuntimeSession();
    trackEvent("OB Started", page, { entry_variant: page.variant || "default" });
    onNext();
  };

  return (
    <section className="entry-page">
      {heroSrc ? <img className="entry-hero-image" src={heroSrc} alt="" /> : <div className="entry-hero-fallback" />}
      <div className="entry-scrim" />
      <div className="entry-top">
        <strong>{brandName}</strong>
        <button type="button" onClick={() => routeTo("login")}>Log in</button>
      </div>
      <div className="entry-content">
        <h1>{headline}</h1>
        {supporting ? <p>{supporting}</p> : null}
        <button className="entry-start-button" onClick={start}>{page.cta || "Get started"}</button>
      </div>
    </section>
  );
}

