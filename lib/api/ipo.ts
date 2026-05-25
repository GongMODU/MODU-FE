import apiClient from "@/lib/axios";
import type { IpoHomeFilter, IpoHomeItem } from "@/types/ipo";

export const getIpoHome = (filter: IpoHomeFilter = "SUBSCRIPTION") =>
  apiClient.get<IpoHomeItem[]>("/api/ipo/home", { params: { filter } });
