import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type AdminActiveUsersChartProps = {
  dau: number;
  mau: number;
  wau: number;
};

export function AdminActiveUsersChart({ dau, mau, wau }: AdminActiveUsersChartProps) {
  const data = [
    { name: "DAU", value: dau, fill: "#0d6efd" },
    { name: "WAU", value: wau, fill: "#198754" },
    { name: "MAU", value: mau, fill: "#ffc107" }
  ];

  if (data.every((item) => item.value <= 0)) {
    return <p className="analytics-card__chart-empty">No active users yet</p>;
  }

  return (
    <div className="analytics-card__chart" aria-label="Active users chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={34}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((item) => (
              <Cell key={item.name} fill={item.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
