/* ─── Vendor Dashboard Types & Placeholder Data ─── */
/* Data will be fetched from /api/vendor-jobs, /api/vendor-earnings, /api/vendors/me/stats */

export type JobStatus =
  | "pending"
  | "accepted"
  | "in-progress"
  | "completed"
  | "paid";

export interface VendorJob {
  id: string;
  title: string;
  client: string;
  clientAvatar: string;
  clientPhone: string;
  address: string;
  category: string;
  status: JobStatus;
  amount: number;
  date: string;
  description: string;
}

export interface VendorEarning {
  id: string;
  jobTitle: string;
  client: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "processing";
}

export interface VendorReview {
  id: string;
  client: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  jobTitle: string;
}

export interface VendorConversation {
  id: string;
  name: string;
  avatar: string;
  role: "Homeowner" | "Tenant";
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: { sender: "them" | "you"; text: string; time: string }[];
}

// Placeholder data — replaced by API calls once the dashboard is wired
export const vendorStats: { value: string; label: string; change: string; color: string; bg: string }[] = [];
export const vendorJobs: VendorJob[] = [];
export const vendorEarnings: VendorEarning[] = [];
export const vendorReviews: VendorReview[] = [];
export const vendorConversations: VendorConversation[] = [];
export const vendorActivity: { text: string; time: string; type: string }[] = [];
