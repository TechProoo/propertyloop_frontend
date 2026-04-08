/* ─── Vendor Dashboard Mock Data ─── */

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

/* ─── Stats ─── */

export const vendorStats = [
  {
    value: "8",
    label: "Active Jobs",
    change: "+3 this week",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    value: "₦1.2M",
    label: "Total Earnings",
    change: "+24% vs last month",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    value: "4.9",
    label: "Rating",
    change: "Based on 87 reviews",
    color: "text-[#F5A623]",
    bg: "bg-[#FFF8ED]",
  },
  {
    value: "342",
    label: "Profile Views",
    change: "+15% this month",
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

/* ─── Jobs ─── */

export const vendorJobs: VendorJob[] = [
  {
    id: "vj-1",
    title: "Kitchen Sink Repair",
    client: "Tayo Ogunleye",
    clientAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    clientPhone: "2348012345678",
    address: "12 Admiralty Way, Lekki Phase 1",
    category: "Plumbing",
    status: "pending",
    amount: 25000,
    date: "Apr 3, 2026",
    description:
      "Kitchen sink is leaking from the pipe underneath. Needs immediate attention.",
  },
  {
    id: "vj-2",
    title: "Bathroom Pipe Replacement",
    client: "Sandra Eze",
    clientAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    clientPhone: "2348023456789",
    address: "5 Bourdillon Road, Ikoyi",
    category: "Plumbing",
    status: "pending",
    amount: 45000,
    date: "Apr 5, 2026",
    description:
      "Old galvanised pipes in the master bathroom need replacing with PVC.",
  },
  {
    id: "vj-3",
    title: "Water Heater Installation",
    client: "Ibrahim Sanni",
    clientAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    clientPhone: "2348034567890",
    address: "8 Adeola Odeku, Victoria Island",
    category: "Plumbing",
    status: "accepted",
    amount: 65000,
    date: "Apr 2, 2026",
    description:
      "Install a new Ariston 50L water heater in the guest bathroom.",
  },
  {
    id: "vj-4",
    title: "Drainage System Fix",
    client: "Amaka Obi",
    clientAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    clientPhone: "2348045678901",
    address: "21 Alexander Road, Ikoyi",
    category: "Plumbing",
    status: "in-progress",
    amount: 80000,
    date: "Mar 30, 2026",
    description:
      "Blocked external drainage causing water backup. Clear and repair the drainage system.",
  },
  {
    id: "vj-5",
    title: "Toilet Cistern Repair",
    client: "Kemi Adeyemi",
    clientAvatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&crop=face",
    clientPhone: "2348056789012",
    address: "15 Awolowo Road, Ikoyi",
    category: "Plumbing",
    status: "in-progress",
    amount: 18000,
    date: "Mar 28, 2026",
    description:
      "Toilet keeps running. Cistern valve likely needs replacement.",
  },
  {
    id: "vj-6",
    title: "Full Bathroom Plumbing",
    client: "Chukwudi Eze",
    clientAvatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
    clientPhone: "2348067890123",
    address: "4 Ozumba Mbadiwe, VI",
    category: "Plumbing",
    status: "completed",
    amount: 150000,
    date: "Mar 22, 2026",
    description:
      "Complete plumbing installation for new ensuite bathroom including shower, basin, and WC.",
  },
  {
    id: "vj-7",
    title: "Kitchen Tap Replacement",
    client: "Ngozi Amadi",
    clientAvatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&crop=face",
    clientPhone: "2348078901234",
    address: "9 Glover Road, Ikoyi",
    category: "Plumbing",
    status: "completed",
    amount: 22000,
    date: "Mar 18, 2026",
    description: "Replace old kitchen mixer tap with a new chrome model.",
  },
  {
    id: "vj-8",
    title: "Water Pump Servicing",
    client: "Yemi Ogundimu",
    clientAvatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
    clientPhone: "2348089012345",
    address: "33 Raymond Njoku, Ikoyi",
    category: "Plumbing",
    status: "paid",
    amount: 35000,
    date: "Mar 10, 2026",
    description:
      "Service and repair the booster pump. Replace pressure switch if needed.",
  },
];

/* ─── Earnings ─── */

export const vendorEarnings: VendorEarning[] = [
  {
    id: "ve-1",
    jobTitle: "Full Bathroom Plumbing",
    client: "Chukwudi Eze",
    amount: 150000,
    date: "Mar 25, 2026",
    status: "pending",
  },
  {
    id: "ve-2",
    jobTitle: "Kitchen Tap Replacement",
    client: "Ngozi Amadi",
    amount: 22000,
    date: "Mar 20, 2026",
    status: "processing",
  },
  {
    id: "ve-3",
    jobTitle: "Water Pump Servicing",
    client: "Yemi Ogundimu",
    amount: 35000,
    date: "Mar 12, 2026",
    status: "paid",
  },
  {
    id: "ve-4",
    jobTitle: "Shower Head Installation",
    client: "Tunde Bakare",
    amount: 15000,
    date: "Mar 5, 2026",
    status: "paid",
  },
  {
    id: "ve-5",
    jobTitle: "Pipe Leak Repair",
    client: "Folake Martins",
    amount: 28000,
    date: "Feb 28, 2026",
    status: "paid",
  },
  {
    id: "ve-6",
    jobTitle: "Water Tank Installation",
    client: "Obinna Eze",
    amount: 95000,
    date: "Feb 20, 2026",
    status: "paid",
  },
  {
    id: "ve-7",
    jobTitle: "Drainage Clearance",
    client: "Sade Williams",
    amount: 40000,
    date: "Feb 14, 2026",
    status: "paid",
  },
  {
    id: "ve-8",
    jobTitle: "Bathroom Renovation Plumbing",
    client: "Emeka Okafor",
    amount: 180000,
    date: "Feb 5, 2026",
    status: "paid",
  },
];

/* ─── Reviews ─── */

export const vendorReviews: VendorReview[] = [
  {
    id: "vr-1",
    client: "Chukwudi Eze",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    date: "Mar 24, 2026",
    comment:
      "Excellent work on the bathroom plumbing. Very professional, arrived on time, and left the place spotless. Highly recommend!",
    jobTitle: "Full Bathroom Plumbing",
  },
  {
    id: "vr-2",
    client: "Ngozi Amadi",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    date: "Mar 19, 2026",
    comment:
      "Quick and efficient tap replacement. The new mixer tap works perfectly. Fair pricing too.",
    jobTitle: "Kitchen Tap Replacement",
  },
  {
    id: "vr-3",
    client: "Yemi Ogundimu",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&crop=face",
    rating: 4,
    date: "Mar 11, 2026",
    comment:
      "Good job on the pump servicing. Had to come back the next day to adjust the pressure switch, but everything works well now.",
    jobTitle: "Water Pump Servicing",
  },
  {
    id: "vr-4",
    client: "Folake Martins",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    date: "Feb 27, 2026",
    comment:
      "Responded within 2 hours of my emergency call. Fixed the leak quickly and explained what caused it. Will definitely use again.",
    jobTitle: "Pipe Leak Repair",
  },
  {
    id: "vr-5",
    client: "Obinna Eze",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    date: "Feb 19, 2026",
    comment:
      "Installed a 2,000L overhead tank with all the plumbing connections. Clean work, no leaks. Very satisfied.",
    jobTitle: "Water Tank Installation",
  },
  {
    id: "vr-6",
    client: "Sade Williams",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    rating: 4,
    date: "Feb 13, 2026",
    comment:
      "Cleared a badly blocked drain that two other plumbers couldn't fix. Took a while but got the job done properly.",
    jobTitle: "Drainage Clearance",
  },
];

/* ─── Conversations ─── */

export const vendorConversations: VendorConversation[] = [
  {
    id: "vc-1",
    name: "Tayo Ogunleye",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    role: "Homeowner",
    phone: "2348012345678",
    lastMessage: "When can you come take a look at the sink?",
    time: "10 min ago",
    unread: 2,
    messages: [
      {
        sender: "them",
        text: "Hi, I have a leaking kitchen sink. Are you available this week?",
        time: "Today, 9:00 AM",
      },
      {
        sender: "you",
        text: "Hello Tayo! Yes, I can come by tomorrow morning. Can you send a photo of the leak?",
        time: "Today, 9:15 AM",
      },
      {
        sender: "them",
        text: "Sure, it's dripping from the pipe underneath the sink.",
        time: "Today, 9:30 AM",
      },
      {
        sender: "them",
        text: "When can you come take a look at the sink?",
        time: "10 min ago",
      },
    ],
  },
  {
    id: "vc-2",
    name: "Sandra Eze",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    role: "Homeowner",
    phone: "2348023456789",
    lastMessage: "How much will the pipe replacement cost?",
    time: "1 hour ago",
    unread: 1,
    messages: [
      {
        sender: "them",
        text: "Good morning! I need my old bathroom pipes replaced.",
        time: "Today, 8:00 AM",
      },
      {
        sender: "you",
        text: "I can do PVC replacement for the master bathroom. I'll need to assess the job first.",
        time: "Today, 8:30 AM",
      },
      {
        sender: "them",
        text: "How much will the pipe replacement cost?",
        time: "1 hour ago",
      },
    ],
  },
  {
    id: "vc-3",
    name: "Ibrahim Sanni",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    role: "Tenant",
    phone: "2348034567890",
    lastMessage: "Great, I've approved the escrow. See you tomorrow!",
    time: "Yesterday",
    unread: 0,
    messages: [
      {
        sender: "them",
        text: "I need a water heater installed in the guest bathroom.",
        time: "Mon, 10:00 AM",
      },
      {
        sender: "you",
        text: "I can install the Ariston 50L. ₦65,000 including materials and labour.",
        time: "Mon, 11:00 AM",
      },
      {
        sender: "them",
        text: "That works. Let me set up the escrow payment.",
        time: "Mon, 2:00 PM",
      },
      {
        sender: "you",
        text: "Perfect. I'll be there tomorrow at 9 AM.",
        time: "Mon, 3:00 PM",
      },
      {
        sender: "them",
        text: "Great, I've approved the escrow. See you tomorrow!",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "vc-4",
    name: "Amaka Obi",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    role: "Homeowner",
    phone: "2348045678901",
    lastMessage: "Thanks for the update. When will you finish?",
    time: "2 days ago",
    unread: 0,
    messages: [
      {
        sender: "them",
        text: "The drainage is still backing up after the rain. Can you fix it?",
        time: "Sat, 8:00 AM",
      },
      {
        sender: "you",
        text: "I'll need to bring my drain camera to inspect it first. I can come Monday.",
        time: "Sat, 9:30 AM",
      },
      {
        sender: "them",
        text: "Thanks for the update. When will you finish?",
        time: "2 days ago",
      },
    ],
  },
];

/* ─── Activity ─── */

export const vendorActivity = [
  {
    text: "New job request from Tayo Ogunleye — Kitchen Sink Repair",
    time: "10 min ago",
    type: "request" as const,
  },
  {
    text: "Payment of ₦35,000 received for Water Pump Servicing",
    time: "2h ago",
    type: "payment" as const,
  },
  {
    text: "New 5-star review from Chukwudi Eze",
    time: "Yesterday",
    type: "review" as const,
  },
  {
    text: "Job completed — Kitchen Tap Replacement for Ngozi Amadi",
    time: "2 days ago",
    type: "completed" as const,
  },
  {
    text: "Escrow funded for Water Heater Installation — ₦65,000",
    time: "3 days ago",
    type: "payment" as const,
  },
];
