import type { AppNotification, Booking, ChatMessage, Conversation, Coupon, Dispute, PlatformSettings, Review, Transaction } from "@/types";

export const seedBookings: Booking[] = [
  {
    id: "b1", reference: "FX-20260901-A1B2", serviceId: "s1", providerId: "p1", customerId: "u-cust-1",
    packageId: "s1-pk1", packageName: "Basic Service (1 unit)", addonIds: [],
    date: "2026-10-05", timeSlot: "10:00 AM",
    address: { name: "Joy Ahmed", phone: "+880 1712-345678", city: "Dhaka", area: "Dhanmondi", street: "House 12, Road 5", notes: "Call on arrival" },
    mode: "onsite",
    price: { subtotal: 800, addonTotal: 0, discount: 0, platformFee: 80, total: 880, providerNet: 800 },
    paymentMethod: "bKash", bookingStatus: "Confirmed", paymentStatus: "Paid",
    createdAt: "2026-09-20T10:00:00Z",
  },
  {
    id: "b2", reference: "FX-20260910-C3D4", serviceId: "s2", providerId: "p2", customerId: "u-cust-1",
    packageId: "s2-pk1", packageName: "2BHK Deep Clean", addonIds: ["s2-a1"],
    date: "2026-09-28", timeSlot: "09:00 AM",
    address: { name: "Joy Ahmed", phone: "+880 1712-345678", city: "Dhaka", area: "Dhanmondi", street: "House 12, Road 5" },
    mode: "onsite",
    price: { subtotal: 2500, addonTotal: 1200, discount: 370, platformFee: 333, total: 3663, providerNet: 3330, couponCode: "WELCOME10" },
    paymentMethod: "Nagad", bookingStatus: "Completed", paymentStatus: "Paid",
    createdAt: "2026-09-10T10:00:00Z", reviewLeft: true,
  },
  {
    id: "b3", reference: "FX-20260915-E5F6", serviceId: "s3", providerId: "p3", customerId: "u-cust-2",
    packageId: "s3-pk1", packageName: "General Repair Visit", addonIds: [],
    date: "2026-10-02", timeSlot: "02:00 PM",
    address: { name: "Nusrat Jahan", phone: "+880 1813-222111", city: "Dhaka", area: "Gulshan", street: "House 8, Road 11" },
    mode: "onsite",
    price: { subtotal: 500, addonTotal: 0, discount: 0, platformFee: 50, total: 550, providerNet: 500 },
    paymentMethod: "Cash on Service", bookingStatus: "Pending", paymentStatus: "Unpaid",
    createdAt: "2026-09-25T10:00:00Z",
  },
  {
    id: "b4", reference: "FX-20260820-G7H8", serviceId: "s5", providerId: "p5", customerId: "u-cust-1",
    packageId: "s5-pk1", packageName: "Portrait Mini (2 hrs)", addonIds: [],
    date: "2026-08-25", timeSlot: "04:00 PM",
    address: { name: "Joy Ahmed", phone: "+880 1712-345678", city: "Dhaka", area: "Banani", street: "Banani DOHS field" },
    mode: "onsite",
    price: { subtotal: 3000, addonTotal: 0, discount: 0, platformFee: 300, total: 3300, providerNet: 3000 },
    paymentMethod: "Card", bookingStatus: "Completed", paymentStatus: "Paid",
    createdAt: "2026-08-15T10:00:00Z",
  },
  {
    id: "b5", reference: "FX-20260922-I9J0", serviceId: "s6", providerId: "p6", customerId: "u-cust-2",
    packageId: "s6-pk1", packageName: "Landing Page", addonIds: [],
    date: "2026-10-10", timeSlot: "11:00 AM",
    address: { name: "Nusrat Jahan", phone: "+880 1813-222111", city: "Dhaka", area: "Gulshan", street: "Remote — video call" },
    mode: "remote",
    price: { subtotal: 5000, addonTotal: 0, discount: 0, platformFee: 500, total: 5500, providerNet: 5000 },
    paymentMethod: "Rocket", bookingStatus: "In Progress", paymentStatus: "Paid",
    createdAt: "2026-09-22T10:00:00Z",
  },
];

export const seedReviews: Review[] = [
  { id: "r1", bookingId: "b2", serviceId: "s2", providerId: "p2", customerId: "u-cust-1", customerName: "Joy Ahmed", customerAvatar: "https://i.pravatar.cc/150?img=12", rating: 5, text: "Demo review: crew arrived on time and the kitchen looks brand new. Checklist-based work was reassuring.", date: "2026-09-29T10:00:00Z", status: "published", reply: { text: "Thank you Joy! Glad you liked the work.", date: "2026-09-29T14:00:00Z" } },
  { id: "r2", bookingId: "b4", serviceId: "s5", providerId: "p5", customerId: "u-cust-1", customerName: "Joy Ahmed", customerAvatar: "https://i.pravatar.cc/150?img=12", rating: 5, text: "Demo review: beautiful portraits, quick previews. Highly recommended.", date: "2026-08-27T10:00:00Z", status: "published" },
  { id: "r3", bookingId: "bx", serviceId: "s1", providerId: "p1", customerId: "u-cust-2", customerName: "Nusrat Jahan", customerAvatar: "https://i.pravatar.cc/150?img=47", rating: 4, text: "Demo review: good servicing, slight delay but cooling is much better now.", date: "2026-09-05T10:00:00Z", status: "published" },
  { id: "r4", bookingId: "by", serviceId: "s4", providerId: "p4", customerId: "u-cust-2", customerName: "Nusrat Jahan", customerAvatar: "https://i.pravatar.cc/150?img=47", rating: 2, text: "Demo review (reported): technician left without testing one switch.", date: "2026-09-06T10:00:00Z", status: "reported" },
];

export const seedConversations: Conversation[] = [
  { id: "conv1", customerId: "u-cust-1", providerId: "p1", bookingId: "b1", lastMessage: "Yes, 10 AM works. Please bring ladder for outdoor unit.", lastAt: "2026-09-26T09:30:00Z", unreadCustomer: 0, unreadProvider: 1 },
  { id: "conv2", customerId: "u-cust-1", providerId: "p2", bookingId: "b2", lastMessage: "Thank you! Gallery looks great.", lastAt: "2026-09-29T15:00:00Z", unreadCustomer: 0, unreadProvider: 0 },
];

export const seedMessages: ChatMessage[] = [
  { id: "m1", conversationId: "conv1", senderId: "u-cust-1", senderRole: "customer", text: "Hello, is Sunday 10 AM available for AC servicing in Dhanmondi?", at: "2026-09-26T08:00:00Z" },
  { id: "m2", conversationId: "conv1", senderId: "u-prov-1", senderRole: "provider", text: "Hello Joy! Yes, Sunday 10 AM is open. 1 unit — Basic or Master service?", at: "2026-09-26T08:20:00Z" },
  { id: "m3", conversationId: "conv1", senderId: "u-cust-1", senderRole: "customer", text: "Basic is fine. Please bring ladder for outdoor unit.", at: "2026-09-26T09:30:00Z" },
  { id: "m4", conversationId: "conv2", senderId: "u-prov-2", senderRole: "provider", text: "Hi! Your deep-clean checklist is confirmed for 9 AM.", at: "2026-09-27T10:00:00Z" },
  { id: "m5", conversationId: "conv2", senderId: "u-cust-1", senderRole: "customer", text: "Thank you! Gallery looks great.", at: "2026-09-29T15:00:00Z" },
];

export const seedNotifications: AppNotification[] = [
  { id: "n1", userId: "u-cust-1", type: "booking_confirmed", title: "Booking confirmed", body: "AC Repair & Servicing on Oct 5, 10:00 AM is confirmed.", link: "/customer/bookings/b1", read: false, at: "2026-09-21T10:00:00Z" },
  { id: "n2", userId: "u-cust-1", type: "message", title: "New message from Rahim Uddin", body: "Yes, Sunday 10 AM is open…", link: "/customer/messages", read: false, at: "2026-09-26T08:20:00Z" },
  { id: "n3", userId: "u-prov-1", type: "booking_request", title: "New booking request", body: "Joy Ahmed requested AC Repair & Servicing.", link: "/provider/bookings", read: false, at: "2026-09-20T10:00:00Z" },
  { id: "n4", userId: "u-admin-1", type: "verification", title: "Verification pending", body: "Farhana Akter submitted documents for review.", link: "/admin/providers/verification", read: false, at: "2026-09-05T10:00:00Z" },
];

export const seedTransactions: Transaction[] = [
  { id: "t1", reference: "TXN-1001", bookingId: "b1", bookingReference: "FX-20260901-A1B2", customerId: "u-cust-1", providerId: "p1", gross: 880, platformFee: 80, net: 800, method: "bKash", status: "Paid", date: "2026-09-20T10:00:00Z" },
  { id: "t2", reference: "TXN-1002", bookingId: "b2", bookingReference: "FX-20260910-C3D4", customerId: "u-cust-1", providerId: "p2", gross: 3663, platformFee: 333, net: 3330, method: "Nagad", status: "Paid", date: "2026-09-10T10:00:00Z" },
  { id: "t3", reference: "TXN-1003", bookingId: "b5", bookingReference: "FX-20260922-I9J0", customerId: "u-cust-2", providerId: "p6", gross: 5500, platformFee: 500, net: 5000, method: "Rocket", status: "Paid", date: "2026-09-22T10:00:00Z" },
];

export const seedCoupons: Coupon[] = [
  { code: "WELCOME10", type: "percent", value: 10, minAmount: 1000, maxDiscount: 500, start: "2025-01-01T00:00:00Z", expiry: "2027-12-31T00:00:00Z", usageLimit: 1000, used: 132, active: true },
  { code: "FLAT200", type: "flat", value: 200, minAmount: 1500, maxDiscount: 200, start: "2025-01-01T00:00:00Z", expiry: "2027-06-30T00:00:00Z", usageLimit: 500, used: 88, active: true },
  { code: "EID15", type: "percent", value: 15, minAmount: 2000, maxDiscount: 800, start: "2026-01-01T00:00:00Z", expiry: "2026-06-30T00:00:00Z", usageLimit: 300, used: 300, active: false },
];

export const seedDisputes: Dispute[] = [
  { id: "d1", reference: "DSP-2001", bookingId: "b2", customerId: "u-cust-1", providerId: "p2", reason: "Incomplete service", description: "Demo dispute: customer says balcony glass was skipped; provider says it was out of scope.", status: "Open", adminNotes: "", createdAt: "2026-09-29T16:00:00Z" },
];

export const defaultSettings: PlatformSettings = {
  siteName: "Fixora",
  supportEmail: "support@fixora.com.bd",
  supportPhone: "+880 9611-000000",
  currency: "BDT (৳)",
  platformFeePercent: 10,
  cancellationHours: 12,
  reviewEnabled: true,
  maintenanceMode: false,
};

export const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
export const dhakaAreas = ["Dhanmondi", "Gulshan", "Banani", "Mirpur", "Uttara", "Mohakhali", "Mohammadpur", "Wari", "Jatrabari", "Tejgaon", "Lalmatia"];
export const bdCities = ["Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Rangpur", "Mymensingh"];
export const paymentMethods = ["bKash", "Nagad", "Rocket", "Card", "Cash on Service"];
