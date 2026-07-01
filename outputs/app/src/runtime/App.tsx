import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { clearRuntimeSession, readAnswers, storage } from "./storage";
import { templateConfig } from "./templateConfig";
import { createSaveAnswer } from "./answerStore";
import { isClosedSessionPage, nextPage, routeFromUrl, routeTo } from "./navigation";
import { initAnalytics, resetAnalytics, trackEvent } from "./analytics";
import { TopProgress } from "../components/TopProgress";
import { renderPage } from "./rendererRegistry";

const fixedCtaPageTypes = new Set([
  "intro_page",
  "multi_choice_page",
  "age_input_page",
  "height_input_page",
  "weight_input_page",
  "email_capture_page",
  "summary_page",
  "plan_generation_page",
  "plan_ready_page"
]);

export function App() {
  const pages = templateConfig.pages;
  const [route, setRoute] = useState(routeFromUrl(pages[0]?.id));
  const [answers, setAnswers] = useState(readAnswers());
  const saveAnswer = useMemo(() => createSaveAnswer(setAnswers), []);
  const page = pages.find((item) => item.id === route) || pages[0];
  const visualClass = typeof page.visual?.pageClass === "string" ? page.visual.pageClass : "";
  const skinVars = (page.visual?.skinVars && typeof page.visual.skinVars === "object" ? page.visual.skinVars : {}) as CSSProperties;
  const pageIdClass = "page-id-" + page.id.replace(/[^a-zA-Z0-9_-]/g, "-");
  const lastViewedRef = useRef("");

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const syncRoute = () => setRoute(routeFromUrl(pages[0]?.id));
    window.addEventListener("popstate", syncRoute);
    window.addEventListener("routechange", syncRoute);
    return () => {
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("routechange", syncRoute);
    };
  }, [pages]);

  useEffect(() => {
    if (!page || lastViewedRef.current === page.id) return;
    lastViewedRef.current = page.id;
    if (page.progress?.scope === "ob_questions") {
      trackEvent("OB Step Viewed", page, { page_type: page.pageType });
    } else if (page.pageType === "summary_page") {
      trackEvent("Summary Viewed", page);
    } else if (page.pageType === "plan_ready_page") {
      trackEvent("Plan Ready Viewed", page);
    } else if (page.pageType === "payment_success_page") {
      trackEvent("Purchase Completed", page);
    }
  }, [page]);

  const goNext = () => {
    routeTo(nextPage(pages, page.id).id);
  };

  const startNewPlan = () => {
    resetAnalytics();
    clearRuntimeSession();
    setAnswers({});
    routeTo(pages[0].id);
  };

  return (
    <div className={`app-shell shell-page-${page.pageType} ${pageIdClass} ${visualClass} ${page.id === "entry" ? "shell-entry" : ""}`}>
      <TopProgress page={page} pages={pages} />
      <div className="desktop-layout">
        <main key={page.id} style={skinVars} className={`screen-main page-type-${page.pageType} ${pageIdClass} ${visualClass} ${page.progress?.scope === "ob_questions" ? "is-ob-transition" : ""} ${fixedCtaPageTypes.has(page.pageType) ? "has-fixed-cta" : ""} ${page.id === "entry" ? "page-id-entry" : ""}`}>
          {renderPage({ page, answers, saveAnswer, onNext: goNext })}
        </main>
      </div>
      {isClosedSessionPage(page) ? (
        <button className="new-plan-link" onClick={startNewPlan}>
          Start a new plan
        </button>
      ) : null}
    </div>
  );
}
