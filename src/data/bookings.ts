const STORAGE_KEY = "pl_service_bookings";

export interface ServiceBooking {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorAvatar: string;
  category: string;
  jobDescription: string;
  preferredDate: string;
  preferredTime: string;
  negotiationNotes: string;
  total: number;
  status: "pending" | "confirmed" | "completed";
  createdAt: string;
}

export const getBookings = (): ServiceBooking[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

export const addBooking = (booking: ServiceBooking): void => {
  const bookings = getBookings();
  bookings.unshift(booking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};
