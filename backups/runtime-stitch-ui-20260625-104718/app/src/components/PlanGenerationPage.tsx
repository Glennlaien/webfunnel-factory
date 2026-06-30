import { Check, LoaderCircle, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { RendererProps } from "../runtime/rendererRegistry";
import { trackEvent } from "../runtime/analytics";

const defaultSteps = [
  "Analyzing",
  "Personalizing",
  "Finalizing"
];

const progressStages = [
  { label: "Analyzing", target: 34, duration: 1050, pause: 460 },
  { label: "Personalizing", target: 72, duration: 1300, pause: 560 },
  { label: "Finalizing", target: 96, duration: 1200, pause: 900 },
  { label: "Finalizing", target: 97, duration: 760, pause: 420 },
  { label: "Finalizing", target: 98, duration: 820, pause: 460 },
  { label: "Finalizing", target: 99, duration: 920, pause: 520 },
  { label: "Ready", target: 100, duration: 880, pause: 0 }
];

const testimonials = [
  {
    title: "I knew exactly where to start",
    name: "Marcus",
    body: "The plan gave me a clear baseline and made home training feel structured instead of random."
  },
  {
    title: "Good pace for getting stronger",
    name: "Daniel",
    body: "It pushed me without making the first week feel impossible. That made it easier to keep showing up."
  },
  {
    title: "No equipment, no excuses",
    name: "Ethan",
    body: "I liked having simple bodyweight sessions I could do at home and still feel like I was progressing."
  }
];

const defaultGenerationPrompts = [
  { id: "strength_baseline", question: "Should we start from your current strength level?", yesLabel: "Yes", noLabel: "No", askAtProgress: 28 },
  { id: "focus_priority", question: "Should we prioritize the muscle groups you selected?", yesLabel: "Yes", noLabel: "No", askAtProgress: 56 },
  { id: "home_training_fit", question: "Should the plan stay practical for home training?", yesLabel: "Yes", noLabel: "No", askAtProgress: 82 }
];

export function PlanGenerationPage({ page, saveAnswer, onNext }: RendererProps) {
  const steps = Array.isArray(page.progressSteps) && page.progressSteps.length ? page.progressSteps as string[] : defaultSteps;
  const proofItems = useMemo(() => {
    const source = Array.isArray(page.generationTestimonials) && page.generationTestimonials.length ? page.generationTestimonials : testimonials;
    return source.map((item) => ({
      title: typeof item.title === "string" ? item.title : "Clear and easy to follow",
      name: typeof item.name === "string" ? item.name : "Member",
      body: typeof item.body === "string" ? item.body : typeof item.text === "string" ? item.text : "The plan felt practical and easy to keep using."
    }));
  }, [page.generationTestimonials]);
  const prompts = useMemo(() => {
    const source = Array.isArray(page.generationPrompts) && page.generationPrompts.length ? page.generationPrompts : defaultGenerationPrompts;
    return source
      .map((item, index) => ({
        id: item.id || `generation_followup_${index + 1}`,
        question: item.question,
        yesLabel: item.yesLabel || "Yes",
        noLabel: item.noLabel || "No",
        askAtProgress: typeof item.askAtProgress === "number" ? item.askAtProgress : [28, 56, 82][index] || 82
      }))
      .slice(0, 4)
      .sort((a, b) => a.askAtProgress - b.askAtProgress);
  }, [page.generationPrompts]);
  const [progress, setProgress] = useState(6);
  const [stageIndex, setStageIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [activePromptIndex, setActivePromptIndex] = useState<number | null>(null);
  const [answeredPromptIds, setAnsweredPromptIds] = useState<string[]>([]);
  const [promptAnswers, setPromptAnswers] = useState<Record<string, boolean>>({});
  const resolverRef = useRef<(() => void) | null>(null);
  const startedAtRef = useRef<number>(0);
  const completedRef = useRef(false);
  const statusText = progress >= 100 ? "Ready" : progressStages[stageIndex]?.label || steps[0];
  const testimonial = proofItems[testimonialIndex % proofItems.length];
  const activePrompt = activePromptIndex === null ? null : prompts[activePromptIndex];

  useEffect(() => {
    startedAtRef.current = performance.now();
    trackEvent("Plan Generation Started", page);
    let cancelled = false;
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));
    const animate = (from: number, to: number, duration: number) => new Promise<void>((resolve) => {
      const start = performance.now();
      const frame = (now: number) => {
        if (cancelled) {
          resolve();
          return;
        }
        const t = Math.min(1, (now - start) / duration);
        setProgress(from + (to - from) * easeOut(t));
        if (t < 1) window.requestAnimationFrame(frame);
        else resolve();
      };
      window.requestAnimationFrame(frame);
    });

    void (async () => {
      let from = 6;
      for (let index = 0; index < progressStages.length; index += 1) {
        const stage = progressStages[index];
        setStageIndex(Math.min(index, steps.length - 1));
        const duePrompts = prompts
          .map((prompt, promptIndex) => ({ prompt, promptIndex }))
          .filter(({ prompt }) => prompt.askAtProgress > from && prompt.askAtProgress <= stage.target);
        for (const { prompt, promptIndex } of duePrompts) {
          await animate(from, prompt.askAtProgress, Math.max(420, stage.duration * ((prompt.askAtProgress - from) / Math.max(1, stage.target - from))));
          from = prompt.askAtProgress;
          if (cancelled) return;
          setActivePromptIndex(promptIndex);
          await new Promise<void>((resolve) => {
            resolverRef.current = resolve;
          });
          if (cancelled) return;
        }
        await animate(from, stage.target, stage.duration);
        from = stage.target;
        if (stage.pause) await wait(stage.pause);
        if (cancelled) return;
      }
    })();

    return () => {
      cancelled = true;
      resolverRef.current?.();
      resolverRef.current = null;
    };
  }, [prompts, steps.length]);

  useEffect(() => {
    if (progress < 100 || completedRef.current) return;
    completedRef.current = true;
    trackEvent("Plan Generation Completed", page, {
      duration_ms: Math.round(performance.now() - startedAtRef.current),
      followup_count: answeredPromptIds.length
    });
  }, [answeredPromptIds.length, page, progress]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestimonialIndex((index) => index + 1);
    }, 5200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100 && page.autoAdvance) {
      const timer = window.setTimeout(onNext, 650);
      return () => window.clearTimeout(timer);
    }
  }, [progress, page.autoAdvance, onNext]);

  const answerPrompt = (value: boolean) => {
    if (!activePrompt) return;
    const nextAnswers = { ...promptAnswers, [activePrompt.id]: value };
    setPromptAnswers(nextAnswers);
    setAnsweredPromptIds((ids) => ids.includes(activePrompt.id) ? ids : [...ids, activePrompt.id]);
    void saveAnswer("planGenerationFollowups", nextAnswers);
    trackEvent("OB Answer Submitted", page, {
      data_key: activePrompt.id,
      answer_value: value,
      answer_count: 1,
      page_type: page.pageType
    });
    setActivePromptIndex(null);
    const resolve = resolverRef.current;
    resolverRef.current = null;
    resolve?.();
  };

  return (
    <section className="page-stack plan-generation-page simple-plan-generation-page">
      <div className="simple-generation-content">
        <h1>{page.title}</h1>
        <div className="simple-generation-meter" style={{ "--progress": progress } as CSSProperties}>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="simple-generation-status under-meter-status" aria-live="polite">
          {progress < 100 && !activePrompt ? <LoaderCircle size={18} /> : null}
          <strong>{statusText}</strong>
        </div>
        <div className="generation-followup-area" aria-live="polite">
          <p className="generation-followup-placeholder">Checking the last details for your plan...</p>
        </div>
        <div className="generation-social-proof">
          <h2>People are choosing personalized plans</h2>
          <p>Short routines. Clear steps. Built for home.</p>
          <div className="generation-testimonial" key={testimonial.name}>
            <div className="generation-stars" aria-label="5 star review">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <div className="generation-testimonial-head">
              <strong>{testimonial.title}</strong>
              <span>{testimonial.name}</span>
            </div>
            <p>{testimonial.body}</p>
          </div>
        </div>
      </div>
      {activePrompt ? (
        <div className="generation-followup-overlay" role="dialog" aria-modal="true" aria-labelledby="generation-followup-title">
          <article className="generation-followup-card">
            <p className="generation-followup-kicker">One quick thing before we finish</p>
            <h2 id="generation-followup-title">{activePrompt.question}</h2>
            <div className="generation-followup-actions">
              <button type="button" onClick={() => answerPrompt(true)}>
                <Check size={18} />
                {activePrompt.yesLabel}
              </button>
              <button type="button" onClick={() => answerPrompt(false)}>
                <X size={18} />
                {activePrompt.noLabel}
              </button>
            </div>
          </article>
        </div>
      ) : null}
      <button className="primary-button sticky-button" disabled={progress < 100} onClick={onNext}>{page.cta || "View my plan"}</button>
    </section>
  );
}

