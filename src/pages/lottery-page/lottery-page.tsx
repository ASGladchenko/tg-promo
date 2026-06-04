import { useQuery } from "@tanstack/react-query";
import { getApiUrl } from "@/shared/api";
import LotteryWidget from "@/widgets/lottery-widget";

export default function LotteryPage() {
  const { data: apiData = "loading...", error: apiError } = useQuery({
    queryKey: ["health", "db"],
    queryFn: async ({ signal }) => {
      const response = await fetch(getApiUrl("health/db"), { signal });
      return response.text();
    },
  });

  return (
    <section className="page__body">
      <span style={{ color: "red", display: "block", fontSize: 32 }}>
        {apiError ? "backend error" : apiData}
      </span>
      <LotteryWidget />
    </section>
  );
}
