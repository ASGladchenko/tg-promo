const ADMIN_ROUTE_PERMISSIONS = ["admin.access", "manager.access"];

export function canAccessAdminRoutes(permissions: string[] | undefined): boolean {
  return permissions?.some((permission) => ADMIN_ROUTE_PERMISSIONS.includes(permission)) ?? false;
}
