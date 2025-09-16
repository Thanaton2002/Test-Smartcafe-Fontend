// filepath: src/constants/api.constants.ts
export const API_BASE_URL = "http://localhost:7777/api" as const;
export const API_TIMEOUT = 10000 as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh"
  },
  MENU: {
    GET_ALL: "/menu",
    GET_BY_ID: (id: number) => `/menu/${id}`,
    CREATE: "/menu",
    UPDATE: (id: number) => `/menu/${id}`,
    DELETE: (id: number) => `/menu/${id}`
  },
  ORDER: {
    GET_ALL: "/order",
    GET_BY_ID: (id: string) => `/order/${id}`,
    CREATE: "/order",
    UPDATE: (id: string) => `/order/${id}`,
    DELETE: (id: string) => `/order/${id}`
  }
} as const;