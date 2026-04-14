// ─── API barrel export ──────────────────────────────────────────────────────
//
// Usage:
//   import { authService, listingsService } from "@/api";
//   const listings = await listingsService.list({ type: "SALE", location: "Lekki" });
//

export { default as api, tokens } from "./client";

export { default as authService } from "./services/auth";
export { default as usersService } from "./services/users";
export { default as agentsService } from "./services/agents";
export { default as listingsService } from "./services/listings";
export { default as leadsService } from "./services/leads";
export { default as viewingsService } from "./services/viewings";
export { default as vendorsService } from "./services/vendors";
export { default as vendorJobsService } from "./services/vendorJobs";
export { default as vendorEarningsService } from "./services/vendorEarnings";
export { default as bookmarksService } from "./services/bookmarks";
export { default as productsService } from "./services/products";
export { default as ordersService } from "./services/orders";
export { default as shortletBookingsService } from "./services/shortletBookings";
export { default as rentalApplicationsService } from "./services/rentalApplications";
export { default as messagesService } from "./services/messages";

export * from "./types";
