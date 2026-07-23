import { MineSession } from "@/features/play-mine-session";

import "./mine-page.scss";

export function MinePage() {
  return (
    <section className="mine-page__body">
      <MineSession />
    </section>
  );
}
