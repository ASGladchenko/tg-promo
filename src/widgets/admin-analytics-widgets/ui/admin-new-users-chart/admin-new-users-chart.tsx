import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type AdminNewUsersChartProps = {
  newFromReferralUsers: number;
  newUsers: number;
};

export function AdminNewUsersChart({ newFromReferralUsers, newUsers }: AdminNewUsersChartProps) {
  if (newUsers <= 0) {
    return <p className="analytics-card__chart-empty">No new users in this period</p>;
  }

  const data = [
    {
      name: "New users",
      Direct: Math.max(newUsers - newFromReferralUsers, 0),
      Referral: newFromReferralUsers
    }
  ];

  return (
    <div className="analytics-card__chart" aria-label="New users chart">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={42}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend verticalAlign="bottom" height={28} />
          <Bar dataKey="Direct" stackId="users" fill="#0d6efd" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Referral" stackId="users" fill="#198754" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
