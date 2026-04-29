import api from "../client";

export interface CreateValuationPayload {
  address: string;
  propertyType?: string;
  beds?: number;
  baths?: number;
  estimatedValue?: string;
  fullName: string;
  phone: string;
  email: string;
}

const valuationsService = {
  async submit(payload: CreateValuationPayload): Promise<{ success: boolean }> {
    const { data } = await api.post<{ success: boolean }>(
      "/valuations",
      payload,
    );
    return data;
  },
};

export default valuationsService;
