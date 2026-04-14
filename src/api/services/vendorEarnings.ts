import api from "../client";
import type {
  EarningStatus,
  Paginated,
  VendorEarning,
  VendorEarningSummary,
} from "../types";

const vendorEarningsService = {
  async list(params?: { status?: EarningStatus; page?: number; limit?: number }): Promise<Paginated<VendorEarning>> {
    const { data } = await api.get<Paginated<VendorEarning>>("/vendor-earnings", { params });
    return data;
  },

  async getSummary(): Promise<VendorEarningSummary> {
    const { data } = await api.get<VendorEarningSummary>("/vendor-earnings/summary");
    return data;
  },
};

export default vendorEarningsService;
