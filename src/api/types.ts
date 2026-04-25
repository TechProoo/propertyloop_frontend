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

export type JobStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "PAID";

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
  createdAt: string;
  buyerProfile?: BuyerProfile | null;
  agentProfile?: AgentProfile | null;
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
  licenseNumber: string;
  businessAddress: string;
  yearsExperience: number;
  specialty: string[];
  website?: string | null;
  rating: number;
  listingsCount: number;
  soldRentedCount: number;
  verified: boolean;
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
  createdAt: string;
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
  listing?: { id: string; title: string; coverImage: string; location: string };
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
  completedAt?: string | null;
  confirmedAt?: string | null;
  disputeReason?: string | null;
  disputedAt?: string | null;
  createdAt: string;
  vendor?: VendorPublic | null;
}

// ─── Vendor Earnings ────────────────────────────────────────────────────────

export interface VendorEarning {
  id: string;
  vendorUserId: string;
  jobId: string;
  jobTitle: string;
  clientName: string;
  amount: number;
  status: EarningStatus;
  paidAt?: string | null;
  createdAt: string;
}

export interface VendorEarningSummary {
  total: number;
  paid: number;
  pending: number;
  processing: number;
  thisMonth: number;
  thisYear: number;
  count: number;
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
  createdAt: string;
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
  refreshToken: string;
  sessionId: string;
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
