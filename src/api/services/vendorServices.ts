import api from "../client";
import type {
  CreateVendorServicePayload,
  SuccessResponse,
  VendorService,
} from "../types";

function unwrap(data: unknown): VendorService[] {
  return Array.isArray(data) ? data : ((data as any)?.items ?? []);
}

const vendorServicesService = {
  /** The signed-in vendor's own bookable services (active + archived). */
  async list(): Promise<VendorService[]> {
    const { data } = await api.get("/vendors/me/services");
    return unwrap(data);
  },

  async create(payload: CreateVendorServicePayload): Promise<VendorService> {
    const { data } = await api.post<VendorService>("/vendors/me/services", payload);
    return data;
  },

  async update(
    id: string,
    payload: Partial<CreateVendorServicePayload> & { active?: boolean },
  ): Promise<VendorService> {
    const { data } = await api.patch<VendorService>(
      `/vendors/me/services/${id}`,
      payload,
    );
    return data;
  },

  async remove(id: string): Promise<SuccessResponse> {
    const { data } = await api.delete<SuccessResponse>(`/vendors/me/services/${id}`);
    return data;
  },
};

export default vendorServicesService;
