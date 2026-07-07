import api from "../client";
import type {
  CreateOfferPayload,
  Offer,
  OfferStatus,
  Paginated,
  PropertyPurchase,
  PurchaseStepState,
} from "../types";

const offersService = {
  /** Buyer submits an offer on a listing. */
  create(payload: CreateOfferPayload): Promise<Offer> {
    return api.post<Offer>("/offers", payload).then((r) => r.data);
  },

  /** Buyer's own offers. */
  listMine(status?: OfferStatus): Promise<Paginated<Offer>> {
    return api
      .get<Paginated<Offer>>("/offers/me", { params: status ? { status } : {} })
      .then((r) => r.data);
  },

  /** Offers received by the signed-in agent. */
  listReceived(status?: OfferStatus): Promise<Paginated<Offer>> {
    return api
      .get<Paginated<Offer>>("/offers/received", { params: status ? { status } : {} })
      .then((r) => r.data);
  },

  getById(id: string): Promise<Offer> {
    return api.get<Offer>(`/offers/${id}`).then((r) => r.data);
  },

  counter(id: string, amountNaira: number, note?: string): Promise<Offer> {
    return api
      .post<Offer>(`/offers/${id}/counter`, { amountNaira, note })
      .then((r) => r.data);
  },

  accept(id: string): Promise<Offer> {
    return api.post<Offer>(`/offers/${id}/accept`, {}).then((r) => r.data);
  },

  decline(id: string): Promise<Offer> {
    return api.post<Offer>(`/offers/${id}/decline`, {}).then((r) => r.data);
  },

  withdraw(id: string): Promise<Offer> {
    return api.post<Offer>(`/offers/${id}/withdraw`, {}).then((r) => r.data);
  },

  // ─── Purchases (post-acceptance progress) ────────────────────────────────

  listPurchases(): Promise<PropertyPurchase[]> {
    return api.get<PropertyPurchase[]>("/offers/purchases").then((r) => r.data);
  },

  getPurchase(id: string): Promise<PropertyPurchase> {
    return api.get<PropertyPurchase>(`/offers/purchases/${id}`).then((r) => r.data);
  },

  /** Agent advances a purchase step (mark done / active / add detail or ETA). */
  updatePurchaseStep(
    purchaseId: string,
    stepId: string,
    payload: { state?: PurchaseStepState; detail?: string; eta?: string },
  ): Promise<PropertyPurchase> {
    return api
      .patch<PropertyPurchase>(
        `/offers/purchases/${purchaseId}/steps/${stepId}`,
        payload,
      )
      .then((r) => r.data);
  },
};

export default offersService;
