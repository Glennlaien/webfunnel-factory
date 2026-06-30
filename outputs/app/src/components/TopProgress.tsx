import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import type { FunnelPage } from "../runtime/types";
import { routeTo } from "../runtime/navigation";

const PAYWALL_COUNTDOWN_KEY = "web2app.paywallDiscountEndsAt";
const PAYWALL_COUNTDOWN_MS = 10 * 60 * 1000;

function getPaywallCountdownEnd() {
  const existing = Number(sessionStorage.getItem(PAYWALL_COUNTDOWN_KEY));
  if (Number.isFinite(existing) && existing > Date.now()) return existing;
  const next = Date.now() + PAYWALL_COUNTDOWN_MS;
  sessionStorage.setItem(PAYWALL_COUNTDOWN_KEY, String(next));
  return next;
}

function formatCountdown(ms: number) {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.ceil(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function PaywallCountdown() {
  const [endsAt] = useState(getPaywallCountdownEnd);
  const [remainingMs, setRemainingMs] = useState(() => Math.max(0, endsAt - Date.now()));

  useEffect(() => {
    let notified = false;
    const tick = () => {
      const nextRemaining = Math.max(0, endsAt - Date.now());
      setRemainingMs(nextRemaining);
      if (!notified && nextRemaining <= 0) {
        notified = true;
        window.dispatchEvent(new CustomEvent("paywall:discount-expired"));
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [endsAt]);

  return (
    <div className="paywall-countdown">
      <div>
        <span>Discount reserved for</span>
        <strong>{formatCountdown(remainingMs)}</strong>
      </div>
      <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("paywall:scroll-to-nearest-plan"))}>Get my plan</button>
    </div>
  );
}

type SectionSegment = {
  id: string;
  label: string;
  pages: FunnelPage[];
};

function isObProgressPage(page: FunnelPage) {
  return page.progress?.scope === "ob_questions" && page.progress?.countsTowardTotal !== false;
}

function sectionKey(page: FunnelPage) {
  return page.sectionId || page.sectionLabel || page.phase || "onboarding";
}

function buildSections(pages: FunnelPage[]) {
  const sections: SectionSegment[] = [];
  for (const item of pages.filter(isObProgressPage)) {
    const id = sectionKey(item);
    let section = sections.find((candidate) => candidate.id === id);
    if (!section) {
      section = {
        id,
        label: item.sectionLabel || item.phase || "Onboarding",
        pages: []
      };
      sections.push(section);
    }
    section.pages.push(item);
  }
  return sections;
}

function segmentFill(section: SectionSegment, page: FunnelPage, activeIndex: number, sectionIndex: number) {
  if (sectionIndex < activeIndex) return 100;
  if (sectionIndex > activeIndex) return 0;
  const currentIndex = Math.max(0, section.pages.findIndex((item) => item.id === page.id));
  return Math.max(12, ((currentIndex + 1) / Math.max(1, section.pages.length)) * 100);
}

function SectionProgress({ page, pages }: { page: FunnelPage; pages: FunnelPage[] }) {
  const sections = buildSections(pages);
  const activeIndex = Math.max(0, sections.findIndex((section) => section.id === sectionKey(page)));
  const activeSection = sections[activeIndex];
  if (!activeSection) return null;
  return (
    <>
      <strong>{activeSection.label}</strong>
      <div className="section-progress" aria-label="Onboarding section progress">
        {sections.map((section, index) => (
          <span className={index <= activeIndex ? "active" : ""} key={section.id}>
            <i style={{ width: `${segmentFill(section, page, activeIndex, index)}%` }} />
          </span>
        ))}
      </div>
    </>
  );
}

export function TopProgress({ page, pages }: { page: FunnelPage; pages: FunnelPage[] }) {
  const progress = page.progress;
  const progressStep = progress?.step;
  const progressTotal = progress?.total;
  if (page.pageType === "entry_page") return null;
  if (page.id === "age_group" && page.variant === "image_grid") return null;
  if (page.pageType === "login_page") {
    return (
      <button className="auth-back-button" aria-label="Back to home" onClick={() => routeTo("entry")}>
          <ArrowLeft size={22} />
      </button>
    );
  }
  if (page.pageType === "account_create_page") {
    return <div className="simple-top-rule" aria-hidden="true" />;
  }
  if (page.pageType === "paywall_page") {
    return (
      <header className="topbar paywall-topbar">
        <PaywallCountdown />
      </header>
    );
  }
  return (
    <header className={progress?.scope === "ob_questions" ? "topbar ob-topbar" : "topbar"}>
      <button className="icon-button" aria-label="Back" onClick={() => window.history.back()}>
        <ArrowLeft size={22} />
      </button>
      <div className="topbar-center">
        {progress?.scope === "ob_questions" ? <SectionProgress page={page} pages={pages} /> : <strong>{page.sectionLabel || page.title}</strong>}
      </div>
      <div className="progress-count" aria-hidden="true">{progress?.showStepCount && progressStep && progressTotal ? `${progressStep}/${progressTotal}` : ""}</div>
    </header>
  );
}

