import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type AdminTotalUsersChartProps = {
  newUsers: number;
  totalUsers: number;
};

const totalUsersChartColors = ["#0d6efd", "#198754"];

export function AdminTotalUsersChart({ newUsers, totalUsers }: AdminTotalUsersChartProps) {
  if (totalUsers <= 0) {
    return <p className="analytics-card__chart-empty">No user data</p>;
  }

  const existingUsers = Math.max(totalUsers - newUsers, 0);
  const data = [
    { name: "Existing", value: existingUsers },
    { name: "New today", value: newUsers }
  ].filter((item) => item.value > 0);

  return (
    <div className="analytics-card__chart" aria-label="Total users chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="58%"
            outerRadius="78%"
            paddingAngle={2}
          >
            {data.map((item, index) => (
              <Cell key={item.name} fill={totalUsersChartColors[index % totalUsersChartColors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={28} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
