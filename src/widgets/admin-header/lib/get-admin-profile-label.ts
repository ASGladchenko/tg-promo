import { type Me } from "@/entities/me";

type AdminProfileLabel = {
  initials: string | null;
  name: string | null;
  role: string | null;
};

function getInitials(me?: Me): string | null {
  const nameInitials = [me?.name, me?.surname]
    .filter(Boolean)
    .map((part) => part?.trim().charAt(0))
    .join("");

  if (nameInitials.length > 0) {
    return nameInitials.slice(0, 2).toUpperCase();
  }

  const accountInitials = (me?.login ?? me?.email)?.trim().slice(0, 2).toUpperCase();

  return accountInitials || null;
}

function getName(me?: Me): string | null {
  const fullName = [me?.name, me?.surname].filter(Boolean).join(" ").trim();

  return fullName || me?.login || me?.email || null;
}

function getRole(me?: Me): string | null {
  const role = me?.roles[0];

  if (!role) {
    return null;
  }

  return role
    .split(/[-_.\s]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function getAdminProfileLabel(me?: Me): AdminProfileLabel {
  return {
    initials: getInitials(me),
    name: getName(me),
    role: getRole(me)
  };
}
