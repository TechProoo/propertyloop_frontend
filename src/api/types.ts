// ─── Shared API response types ──────────────────────────────────────────────

/** Standard paginated response from any list endpoint */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/** Standard success response */
export interface SuccessResponse {
  success: boolean;
}

// ─── Enums (mirror the backend Prisma enums) ────────────────────────────────

export type Role = "BUYER" | "AGENT" | "VENDOR";

export type ListingType = "SALE" | "RENT" | "SHORTLET";
export type ListingStatus =
  | "PENDING_REVIEW"
  | "ACTIVE"
  | "PAUSED"
  | "SOLD"
  | "RENTED"
  | "ARCHIVED";

export type DocumentType =
  | "C_OF_O"
  | "SURVEY_PLAN"
  | "BUILDING_PERMIT"
  | "RECEIPT";

export type BookmarkType = "PROPERTY" | "SERVICE" | "PRODUCT";

// The API projects two extra client-facing states on top of the DB enum:
// PAID serializes as CONFIRMED, and escrowStatus DISPUTED overrides to DISPUTED.
export type JobStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CONFIRMED"
  | "PAID"
  | "DISPUTED";

export type EscrowStatus =
  | "NONE"
  | "LOCKED"
  | "RELEASED"
  | "DISPUTED"
  | "REFUNDED";

export type EarningStatus = "PAID" | "PENDING" | "PROCESSING";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "VIEWING_SCHEDULED"
  | "NEGOTIATING"
  | "CONVERTED"
  | "LOST";

export type LeadSource =
  | "LISTING_PAGE"
  | "AGENT_PROFILE"
  | "PHONE"
  | "EMAIL"
  | "REFERRAL"
  | "OTHER";

export type ViewingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type ShortletBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED";

export type RentalApplicationStatus =
  | "PENDING"
  | "DEPOSIT_PAID"
  | "AGREEMENT_SIGNED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export type OrderPaymentMethod = "CARD" | "TRANSFER" | "WALLET";

// ─── Core entities ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string | null;
  location?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  emailVerifiedAt?: string | null;
  referralCode?: string | null;
  createdAt: string;
  buyerProfile?: BuyerProfile | null;
  agentProfile?: AgentProfile | null;
  agentAccessUntil?: string | null;
  vendorProfile?: VendorProfile | null;
  settings?: UserSettings | null;
}

export interface BuyerProfile {
  id: string;
  userId: string;
  preferredLocations?: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
}

export interface AgentProfile {
  id: string;
  userId: string;
  agencyName: string;
  licenseNumber: string | null;
  businessAddress: string;
  yearsExperience: number;
  specialty: string[];
  website?: string | null;
  rating: number;
  listingsCount: number;
  soldRentedCount: number;
  verified: boolean;
  subscriptionTier?: "FREE" | "FOUNDING" | "STANDARD" | "PRO" | "MONTHLY" | null;
  subscriptionStatus?: "ACTIVE" | "LAPSED" | "CANCELLED" | null;
  subscriptionRenewsAt?: string | null;
}

export interface VendorProfile {
  id: string;
  userId: string;
  serviceCategory: string;
  yearsExperience: string;
  serviceArea: string;
  priceLabel?: string | null;
  priceNum?: number | null;
  bannerImage?: string | null;
  portfolioImages: string[];
  availableForHire: boolean;
  rating: number;
  jobsCount: number;
  verified: boolean;
}

export interface VendorBankAccount {
  id: string;
  vendorUserId: string;
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  paystackRecipientCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bank {
  id: number;
  name: string;
  code: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  notifEmail: boolean;
  notifSms: boolean;
  notifMessages: boolean;
  notifPriceAlerts: boolean;
  notifMarketing: boolean;
  profileVisible: boolean;
  shareActivity: boolean;
  language: string;
  currency: string;
  twoFactorEnabled: boolean;
}

// ─── Public directory shapes (returned by /agents, /vendors list endpoints) ─

export interface AgentPublic {
  id: string;
  name: string;
  avatarUrl?: string | null;
  location?: string | null;
  phone?: string | null;
  email: string;
  bio?: string | null;
  agency: string | null;
  yearsExperience: number;
  specialty: string[];
  website?: string | null;
  rating: number;
  listingsCount: number;
  soldRentedCount: number;
  verified: boolean;
  createdAt: string;
}

export interface VendorPublic {
  id: string;
  name: string;
  avatarUrl?: string | null;
  location?: string | null;
  phone?: string | null;
  email: string;
  bio?: string | null;
  website?: string | null;
  category: string | null;
  serviceArea?: string | null;
  yearsExperience?: string | null;
  priceLabel?: string | null;
  priceNum?: number | null;
  bannerImage?: string | null;
  portfolioImages: string[];
  availableForHire: boolean;
  rating: number;
  jobsCount: number;
  verified: boolean;
  createdAt: string;
}

// ─── Listings ───────────────────────────────────────────────────────────────

export interface Listing {
  id: string;
  slug: string;
  title: string;
  type: ListingType;
  propertyType: string;
  priceNaira: number;
  priceLabel: string;
  period?: string | null;
  address: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  yearBuilt: string;
  description: string;
  features: string[];
  coverImage: string;
  images: string[];
  virtualTourUrl?: string | null;
  videoUrl?: string | null;
  rating: number;
  verified: boolean;
  status: ListingStatus;
  viewsCount: number;
  featured?: boolean;
  openToOffers?: boolean;
  /** HOUSE is PropertyLoop's own stock; AGENT_OWN is an agent's listing. */
  ownership?: "HOUSE" | "AGENT_OWN";
  createdAt: string;
  updatedAt?: string;
  documents?: ListingDocument[];
  agent?: AgentPublic | null;
}

export interface ListingDocument {
  id: string;
  listingId: string;
  name: string;
  type: DocumentType;
  url?: string | null;
  verified: boolean;
  date: string;
}

// ─── Products ───────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  name: string;
  supplier: string;
  category: string;
  description: string;
  priceNaira: number;
  priceLabel: string;
  unit: string;
  minOrder: string;
  location: string;
  phone: string;
  coverImage: string;
  images: string[];
  specs: { label: string; value: string }[];
  rating: number;
  reviewsCount: number;
  verified: boolean;
  inStock: boolean;
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  notes?: string | null;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
  payMethod: OrderPaymentMethod;
  placedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  name: string;
  supplier: string;
  image: string;
  priceLabel: string;
  unit: string;
  unitPrice: number;
  quantity: number;
}

// ─── Bookmarks ──────────────────────────────────────────────────────────────

export interface Bookmark {
  id: string;
  userId: string;
  type: BookmarkType;
  listingId?: string | null;
  productId?: string | null;
  vendorUserId?: string | null;
  createdAt: string;
}

// ─── Leads ──────────────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  agentId: string;
  listingId: string;
  buyerUserId?: string | null;
  name: string;
  email?: string | null;
  phone: string;
  message?: string | null;
  status: LeadStatus;
  source: LeadSource;
  notes?: string | null;
  contactedAt?: string | null;
  createdAt: string;
  listing?: { id: string; title: string; coverImage: string; location: string; slug?: string };
}

// ─── Viewings ───────────────────────────────────────────────────────────────

export interface Viewing {
  id: string;
  agentId: string;
  listingId: string;
  buyerUserId?: string | null;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  scheduledFor: string;
  status: ViewingStatus;
  notes?: string | null;
  createdAt: string;
  listing?: { id: string; title: string; coverImage: string; location: string; slug?: string };
  agent?: { id: string; name: string; phone?: string | null; avatarUrl?: string | null };
}

// ─── Vendor Jobs (bookings + escrow) ────────────────────────────────────────

export interface VendorJob {
  id: string;
  vendorUserId: string;
  buyerUserId?: string | null;
  title: string;
  description: string;
  address: string;
  category: string;
  status: JobStatus;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  scheduledFor?: string | null;
  amount: number;
  vendorFee: number;
  platformFee: number;
  escrowAmount: number;
  escrowId?: string | null;
  escrowStatus: EscrowStatus;
  paymentMethod?: string | null;
  completionNotes?: string | null;
  completionProofImages: string[];
  attachments?: string[];
  completedAt?: string | null;
  confirmedAt?: string | null;
  disputeReason?: string | null;
  disputedAt?: string | null;
  createdAt: string;
  vendor?: VendorPublic | null;
}

// ─── Vendor Earnings ────────────────────────────────────────────────────────

/**
 * Which half of a job's fee a row represents. The vendor fee is paid out in
 * two parts: DEPOSIT lands when they start work, FINAL when the buyer confirms.
 * Jobs predating the split payout carry a single FINAL row worth the whole fee.
 */
export type EarningKind = "DEPOSIT" | "FINAL";

export interface VendorEarning {
  id: string;
  vendorUserId: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  amount: number;
  kind: EarningKind;
  status: EarningStatus;
  paidAt?: string | null;
  createdAt: string;
}

export interface VendorEarningSummary {
  total: number;
  paid: number;
  pending: number;
  processing: number;
  /** Released from escrow, sitting in the vendor's wallet, withdrawable. */
  available: number;
  thisMonth: number;
  thisYear: number;
  count: number;
}

export interface WithdrawResult {
  success: boolean;
  amount: number;
  count: number;
  bankName: string;
  accountNumber: string;
}

// ─── Job Disputes ───────────────────────────────────────────────────────────

export type DisputeAuthorRole = "CUSTOMER" | "VENDOR" | "SYSTEM" | "ADMIN";

export interface DisputeMessage {
  id: string;
  role: DisputeAuthorRole;
  author: string;
  body: string;
  attachments: string[];
  createdAt: string;
}

export interface JobDispute {
  jobId: string;
  jobRef: string;
  status: string;
  reason?: string | null;
  disputedAt?: string | null;
  responseDeadline?: string | null;
  amountHeldNaira: number;
  amountTotalNaira: number;
  service?: string | null;
  title?: string | null;
  address?: string | null;
  scheduledFor?: string | null;
  completedAt?: string | null;
  customer: { name?: string | null; avatar?: string | null };
  vendor?: { id: string; name: string; avatar?: string | null } | null;
  thread: DisputeMessage[];
}

// ─── Vendor / Agent Reviews ─────────────────────────────────────────────────

export interface AgentReview {
  id: string;
  agentUserId: string;
  reviewerUserId?: string | null;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface VendorReview {
  id: string;
  vendorUserId: string;
  jobId?: string | null;
  clientName: string;
  clientAvatar?: string | null;
  rating: number;
  comment: string;
  jobTitle: string;
  /** Vendor's public reply, if they've responded. */
  reply?: string | null;
  createdAt: string;
}

// ─── Vendor Services (bookable menu) ────────────────────────────────────────

export type VendorServicePriceMode = "FIXED" | "FROM";

export interface VendorService {
  id: string;
  name: string;
  description: string;
  priceNaira: number;
  priceMode: VendorServicePriceMode | string;
  priceLabel: string;
  duration?: string | null;
  active: boolean;
  archived: boolean;
  displayOrder: number;
}

export interface CreateVendorServicePayload {
  name: string;
  description: string;
  priceNaira: number;
  priceMode?: VendorServicePriceMode;
  duration?: string;
  displayOrder?: number;
}

// ─── Vendor Availability ────────────────────────────────────────────────────

export interface AvailabilityDay {
  day: string;
  on: boolean;
  hours: string;
}

export interface VendorBlackout {
  id: string;
  date: string; // YYYY-MM-DD
  reason?: string | null;
}

export interface VendorAvailability {
  acceptingBookings: boolean;
  maxJobsPerDay: number;
  responseCommitment: string;
  schedule: AvailabilityDay[];
  blackouts: VendorBlackout[];
  updatedAt: string;
}

// ─── Offers & Purchases ────────────────────────────────────────────────────

export type OfferStatus =
  | "PENDING"
  | "COUNTERED"
  | "ACCEPTED"
  | "DECLINED"
  | "WITHDRAWN"
  | "EXPIRED";

export type OfferActor = "BUYER" | "AGENT";
export type OfferFinancing = "CASH" | "OWN_FINANCING";
export type PurchaseStepState = "DONE" | "ACTIVE" | "TODO";
export type PurchaseStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface OfferListingRef {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  location: string;
  address: string;
  priceNaira: number;
  priceLabel: string;
  type: string;
}

export interface OfferParty {
  id: string;
  name: string;
  avatarUrl?: string | null;
  phone?: string | null;
}

export interface OfferEvent {
  id: string;
  type: string;
  actor: OfferActor;
  amountNaira: number | null;
  amountLabel: string | null;
  note?: string | null;
  createdAt: string;
}

export interface PurchaseStep {
  id: string;
  order: number;
  key: string;
  title: string;
  detail: string;
  state: PurchaseStepState;
  eta?: string | null;
  completedAt?: string | null;
}

export interface PropertyPurchase {
  id: string;
  offerId: string;
  listingId: string;
  buyerId: string;
  agentId: string;
  status: PurchaseStatus;
  agreedAmountNaira: number;
  agreedAmountLabel: string;
  createdAt: string;
  updatedAt: string;
  listing?: OfferListingRef;
  buyer?: OfferParty;
  agent?: OfferParty;
  steps?: PurchaseStep[];
}

export interface Offer {
  id: string;
  status: OfferStatus;
  listingId: string;
  buyerId: string;
  agentId: string;
  amountNaira: number;
  amountLabel: string;
  currentAmountNaira: number;
  currentAmountLabel: string;
  financing: OfferFinancing;
  note?: string | null;
  closeDate?: string | null;
  subjectToInspection: boolean;
  lastActor: OfferActor;
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
  listing?: OfferListingRef;
  buyer?: OfferParty;
  agent?: OfferParty;
  events?: OfferEvent[];
  purchase?: PropertyPurchase;
}

export interface CreateOfferPayload {
  listingId: string;
  amountNaira: number;
  financing?: OfferFinancing;
  note?: string;
  closeDate?: string;
  subjectToInspection?: boolean;
}

// ─── Shortlet Bookings ─────────────────────────────────────────────────────

export interface ShortletBooking {
  id: string;
  listingId: string;
  buyerUserId?: string | null;
  guestName: string;
  guestPhone: string;
  guestEmail?: string | null;
  guests: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  paymentMethod?: string | null;
  escrowId?: string | null;
  escrowStatus: EscrowStatus;
  status: ShortletBookingStatus;
  createdAt: string;
  listing?: Partial<Listing>;
}

// ─── Rental Applications ────────────────────────────────────────────────────

export interface RentalApplication {
  id: string;
  listingId: string;
  buyerUserId?: string | null;
  applicantName: string;
  applicantPhone: string;
  applicantEmail?: string | null;
  deposit: number;
  agencyFee: number;
  legalFee: number;
  serviceFee: number;
  total: number;
  leaseDuration: string;
  startDate: string;
  paymentMethod?: string | null;
  escrowId?: string | null;
  escrowStatus: EscrowStatus;
  status: RentalApplicationStatus;
  signedAt?: string | null;
  createdAt: string;
  listing?: Partial<Listing>;
}

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export interface AgentStats {
  profile: {
    rating: number;
    listingsCount: number;
    soldRentedCount: number;
    verified: boolean;
    yearsExperience: number;
  };
  listings: {
    total: number;
    active: number;
    pendingReview: number;
    totalViews: number;
  };
  leads: {
    total: number;
    new: number;
    converted: number;
    conversionRate: number;
  };
  viewings: {
    total: number;
    upcoming: number;
  };
}

export interface VendorStats {
  profile: {
    rating: number;
    jobsCount: number;
    verified: boolean;
    availableForHire: boolean;
  };
  jobs: {
    pending: number;
    active: number;
    completed: number;
    total: number;
  };
  earnings: {
    total: number;
    paid: number;
    pending: number;
    thisMonth: number;
  };
  reviews: {
    total: number;
    averageRating: number;
    fiveStarPct: number;
  };
}

// ─── Auth payloads ──────────────────────────────────────────────────────────

export interface AuthResponse {
  user: User;
  accessToken: string;
  sessionId: string;
  // refreshToken is intentionally absent - backend ships it as an HttpOnly
  // cookie (pl_refresh_token) on /api/auth, not in the JSON body.
}

export interface Session {
  id: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  deviceLabel?: string | null;
  lastSeenAt: string;
  expiresAt: string;
  createdAt: string;
}
