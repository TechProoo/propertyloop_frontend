import api from "../client";

export type AdPlacement =
  | "SPLASH"
  | "HOME_BANNER"
  | "HOME_FEED"
  | "SEARCH_INLINE";

export type AdStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "ACTIVE"
  | "PAUSED"
  | "REJECTED"
  | "EXPIRED";

/** Shape the app renders in a slot (no advertiser money/contact details). */
export interface PublicAd {
  id: string;
  brandName: string;
  imageUrl: string;
  headline: string;
  body?: string | null;
  ctaLabel: string;
  ctaUrl: string;
  placement: AdPlacement;
}

/** What a brand sees about its own ad. */
export interface MyAd extends PublicAd {
  status: AdStatus;
  startAt: string;
  endAt: string;
  weeks: number;
  amountNaira: number;
  paidAt?: string | null;
  impressions: number;
  clicks: number;
  adminNote?: string | null;
  createdAt: string;
}

export interface CreateAdPayload {
  brandName: string;
  contactEmail: string;
  contactPhone?: string;
  imageUrl: string;
  headline: string;
  body?: string;
  ctaLabel?: string;
  ctaUrl: string;
  placement: AdPlacement;
  startAt: string; // ISO
  weeks: number;
}

const adsService = {
  // ── Serving + tracking (public) ──
  serve(placement: AdPlacement): Promise<PublicAd[]> {
    return api
      .get<PublicAd[]>("/ads/serve", { params: { placement } })
      .then((r) => r.data);
  },
  /** Fire-and-forget beacons — never surface failures to the UI. */
  impression(id: string): void {
    void api.post(`/ads/${id}/impression`).catch(() => {});
  },
  click(id: string): void {
    void api.post(`/ads/${id}/click`).catch(() => {});
  },

  // ── Self-serve (authenticated brand) ──
  pricing(): Promise<{ currency: string; weeklyRates: Record<AdPlacement, number> }> {
    return api.get("/ads/pricing").then((r) => r.data);
  },
  create(payload: CreateAdPayload): Promise<MyAd> {
    return api.post<MyAd>("/ads", payload).then((r) => r.data);
  },
  listMine(): Promise<MyAd[]> {
    return api.get<MyAd[]>("/ads/mine").then((r) => r.data);
  },
  pay(id: string): Promise<{ paymentUrl: string; reference: string }> {
    return api.post(`/ads/${id}/pay`, {}).then((r) => r.data);
  },
  verify(id: string): Promise<MyAd> {
    return api.get<MyAd>(`/ads/${id}/verify`).then((r) => r.data);
  },
  async uploadImage(file: File): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post<{ url: string }>("/upload/ad-image", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.url;
  },
};

export default adsService;
