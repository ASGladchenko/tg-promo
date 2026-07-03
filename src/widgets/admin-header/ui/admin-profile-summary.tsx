import "./admin-profile-summary.scss";

type AdminProfileSummaryProps = {
  name: string | null;
  role: string | null;
};

export function AdminProfileSummary({ name, role }: AdminProfileSummaryProps) {
  return (
    <span className="admin-profile-summary">
      {name && <span className="admin-profile-summary__name">{name}</span>}
      {role && <span className="admin-profile-summary__role">{role}</span>}
    </span>
  );
}
