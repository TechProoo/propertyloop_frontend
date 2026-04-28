import type Shepherd from "shepherd.js";

export type TourRole = "buyer" | "agent" | "vendor";

type StepInput = {
  id: string;
  title: string;
  body: string;
  attachTo?: { element: string; on: Shepherd.Step.PopperPlacement };
  /** Wait for selector to appear before showing this step */
  waitFor?: string;
  /** Run an action before the step shows (e.g. expand a tab) */
  beforeShow?: () => void;
};

const buyerSteps: StepInput[] = [
  {
    id: "welcome",
    title: "Welcome to PropertyLoop 🎉",
    body:
      "<p>Quick tour of your dashboard so you know where everything lives.</p><p>You can <strong>skip</strong> at any time and re-open it later from your settings.</p>",
  },
  {
    id: "overview",
    title: "Your Overview",
    body:
      "<p>This is your home. See bookmarked properties, recent activity, and shortcuts at a glance.</p>",
    attachTo: { element: '[data-tour="nav-overview"]', on: "right" },
  },
  {
    id: "saved",
    title: "Saved properties",
    body:
      "<p>Every property you bookmark from Buy, Rent or Shortlets shows up here so you can come back to it.</p>",
    attachTo: { element: '[data-tour="nav-saved"]', on: "right" },
  },
  {
    id: "vendors",
    title: "Service vendors",
    body:
      "<p>Need a plumber, electrician, cleaner or builder? Browse vetted vendors and book one in a few taps.</p>",
    attachTo: { element: '[data-tour="nav-vendors"]', on: "right" },
  },
  {
    id: "messages",
    title: "Conversations",
    body:
      "<p>Every chat you start with an agent or vendor lives here. New unread messages are counted on the icon.</p>",
    attachTo: { element: '[data-tour="nav-messages"]', on: "right" },
  },
  {
    id: "viewings",
    title: "Your viewings",
    body:
      "<p>When you request a viewing on a property, track its status (pending, confirmed, completed) right here.</p>",
    attachTo: { element: '[data-tour="nav-viewings"]', on: "right" },
  },
  {
    id: "logbook",
    title: "Property Logbook",
    body:
      "<p>Every repair, service or maintenance you commission gets a permanent record — building trust if you ever sell or rent.</p>",
    attachTo: { element: '[data-tour="nav-logbook"]', on: "right" },
  },
  {
    id: "done",
    title: "You're all set",
    body:
      "<p>Start by browsing properties or finding a vendor. If you need help, drop us a line at <strong>support@propertyloop.ng</strong>.</p>",
  },
];

const agentSteps: StepInput[] = [
  {
    id: "welcome",
    title: "Welcome, agent 🏡",
    body:
      "<p>A quick tour of your agent dashboard. You can dismiss this any time.</p>",
  },
  {
    id: "overview",
    title: "Your Overview",
    body:
      "<p>Headline numbers — active listings, pending review, recent leads, and revenue snapshots.</p>",
    attachTo: { element: '[data-tour="nav-overview"]', on: "right" },
  },
  {
    id: "listings",
    title: "Your listings",
    body:
      "<p>Add, edit, pause, or mark listings as sold/rented. Use the wrench icon on a card to add a maintenance record to its logbook.</p>",
    attachTo: { element: '[data-tour="nav-listings"]', on: "right" },
  },
  {
    id: "add-listing",
    title: "Add a property",
    body:
      "<p>This shortcut takes you straight to the new-listing form. Photos, video, features and Certificate of Occupancy can all be uploaded.</p>",
    attachTo: { element: '[data-tour="add-listing"]', on: "bottom" },
  },
  {
    id: "viewings",
    title: "Viewing requests",
    body:
      "<p>Buyers who request a viewing show up here. Confirm the slot, mark it complete, or chat with them in one tap.</p>",
    attachTo: { element: '[data-tour="nav-viewings"]', on: "right" },
  },
  {
    id: "messages",
    title: "Messages",
    body:
      "<p>All your buyer conversations. Unread counts appear on the badge.</p>",
    attachTo: { element: '[data-tour="nav-messages"]', on: "right" },
  },
  {
    id: "analytics",
    title: "Analytics",
    body:
      "<p>Track listing views, lead sources, and conversion. Use it to know what's working.</p>",
    attachTo: { element: '[data-tour="nav-analytics"]', on: "right" },
  },
  {
    id: "settings",
    title: "Profile & Settings",
    body:
      "<p>Update your photo, agency, license number and bio so buyers know who they're dealing with.</p>",
    attachTo: { element: '[data-tour="nav-settings"]', on: "right" },
  },
  {
    id: "done",
    title: "You're ready",
    body:
      "<p>List your first property to get going. Verified agents get a green badge on their listings.</p>",
  },
];

const vendorSteps: StepInput[] = [
  {
    id: "welcome",
    title: "Welcome, vendor 🛠️",
    body:
      "<p>Quick walkthrough of your vendor dashboard. You can dismiss this any time.</p>",
  },
  {
    id: "overview",
    title: "Your Overview",
    body:
      "<p>Snapshot of jobs, ratings, and earnings.</p>",
    attachTo: { element: '[data-tour="nav-overview"]', on: "right" },
  },
  {
    id: "jobs",
    title: "Job requests",
    body:
      "<p>Incoming bookings from buyers land here. Accept, decline, or mark complete in one tap. Photos and videos the buyer attaches show up on the card.</p>",
    attachTo: { element: '[data-tour="nav-jobs"]', on: "right" },
  },
  {
    id: "messages",
    title: "Messages",
    body:
      "<p>Negotiate scope and price with buyers in chat before confirming a booking.</p>",
    attachTo: { element: '[data-tour="nav-messages"]', on: "right" },
  },
  {
    id: "reviews",
    title: "Reviews",
    body:
      "<p>See what clients are saying. Higher ratings get more visibility on the home page's Service Loop.</p>",
    attachTo: { element: '[data-tour="nav-reviews"]', on: "right" },
  },
  {
    id: "settings",
    title: "Your profile",
    body:
      "<p>Set your service category, area, banner image and bio. The more complete it is, the more bookings you'll get.</p>",
    attachTo: { element: '[data-tour="nav-settings"]', on: "right" },
  },
  {
    id: "done",
    title: "You're set",
    body:
      "<p>Make sure your profile is complete and your banner is uploaded — that's the first thing buyers see.</p>",
  },
];

export const stepsByRole: Record<TourRole, StepInput[]> = {
  buyer: buyerSteps,
  agent: agentSteps,
  vendor: vendorSteps,
};
