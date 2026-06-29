import { AttemptsWalletWidget } from "@/widgets/attempts-wallet-widget";
import { LotteryWidget } from "@/widgets/lottery-widget";
import { WidgetHeader } from "@/widgets/widget-header";

import "./lottery-page.scss";

export function LotteryPage() {
  return (
    <main className="lottery-page">
      <WidgetHeader siteUrl="/google.com" />
      <AttemptsWalletWidget />

      <section className="lottery-page__body">
        <LotteryWidget />
      </section>
    </main>
  );
}
// export function LotteryPage() {
//   return (
//     <section className="page__body">
//       <LotteryWidget />
//     </section>
//   );
// }
