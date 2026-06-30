import type { FunnelPage, SaveAnswer, Answers } from "./types";
import { EntryPage } from "../components/EntryPage";
import { IntroPage } from "../components/IntroPage";
import { SingleChoicePage } from "../components/SingleChoicePage";
import { MultiChoicePage } from "../components/MultiChoicePage";
import { AgeInputPage } from "../components/AgeInputPage";
import { HeightInputPage } from "../components/HeightInputPage";
import { WeightInputPage } from "../components/WeightInputPage";
import { EmailInputPage } from "../components/EmailInputPage";
import { SummaryPage } from "../components/SummaryPage";
import { PlanGenerationPage } from "../components/PlanGenerationPage";
import { PlanReadyPage } from "../components/PlanReadyPage";
import { PaywallPage } from "../components/PaywallPage";
import { PaymentSuccessPage } from "../components/PaymentSuccessPage";
import { AccountCreatePage } from "../components/AccountCreatePage";
import { LoginPage } from "../components/LoginPage";
import { ProfilePage } from "../components/ProfilePage";
import { PlaceholderPage } from "../components/PlaceholderPage";

export type RendererProps = {
  page: FunnelPage;
  answers: Answers;
  saveAnswer: SaveAnswer;
  onNext: () => void;
};

export function renderPage(props: RendererProps) {
  const { page } = props;
  if (page.pageType === "entry_page") return <EntryPage {...props} />;
  if (page.pageType === "intro_page") return <IntroPage {...props} />;
  if (page.pageType === "single_choice_page") return <SingleChoicePage {...props} />;
  if (page.pageType === "multi_choice_page") return <MultiChoicePage {...props} />;
  if (page.pageType === "age_input_page") return <AgeInputPage {...props} />;
  if (page.pageType === "height_input_page") return <HeightInputPage {...props} />;
  if (page.pageType === "weight_input_page") return <WeightInputPage {...props} />;
  if (page.pageType === "email_capture_page") return <EmailInputPage {...props} />;
  if (page.pageType === "summary_page") return <SummaryPage {...props} />;
  if (page.pageType === "plan_generation_page") return <PlanGenerationPage {...props} />;
  if (page.pageType === "plan_ready_page") return <PlanReadyPage {...props} />;
  if (page.pageType === "paywall_page") return <PaywallPage {...props} />;
  if (page.pageType === "payment_success_page") return <PaymentSuccessPage {...props} />;
  if (page.pageType === "account_create_page") return <AccountCreatePage {...props} />;
  if (page.pageType === "login_page") return <LoginPage {...props} />;
  if (page.pageType === "account_page") return <ProfilePage {...props} />;
  return <PlaceholderPage {...props} />;
}
