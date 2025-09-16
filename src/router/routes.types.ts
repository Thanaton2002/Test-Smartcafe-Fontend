// filepath: src/router/routes.types.ts
export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  protected?: boolean;
  roles?: string[];
}

export interface RouteGroup {
  prefix?: string;
  routes: RouteConfig[];
  guard?: React.ComponentType<{ children: React.ReactNode }>;
}