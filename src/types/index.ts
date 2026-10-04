export type Role = "customer" | "provider" | "admin";

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "In Progress"
  | "Completed"
  | "Cancelled"
  | "Declined";

export type PaymentStatus =
  | "Unpaid"
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refund Pending"
  | "Refunded";

export type ServiceStatus = "Published" | "Pending" | "Rejected" | "Draft" | "Unpublished";
export type VerificationStatus = "Pending" | "Approved" | "Rejected" | "Needs Info";
export type PricingModel = "fixed" | "starting" | "hourly" | "quote";
export type ServiceMode = "onsite" | "remote" | "either";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: Role;
  status: "Active" | "Suspended";
  city: string;
  area: string;
  createdAt: string;
  bookingsCount?: number;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  serviceCount: number;
  active: boolean;
  order: number;
  subcategories: string[];
}

export interface Provider {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  cover: string;
  profession: string;
  headline: string;
  verified: boolean;
  verificationStatus: VerificationStatus;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  experienceYears: number;
  location: string;
  serviceAreas: string[];
  languages: string[];
  about: string;
  skills: string[];
  joinedAt: string;
  responseTime: string;
  status: "Active" | "Suspended";
  portfolio: string[];
  workingHours: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMin: number;
}

export interface ServiceAddon {
  id: string;
  name: string;
  price: number;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  categoryId: string;
  providerId: string;
  images: string[];
  description: string;
  included: string[];
  excluded: string[];
  process: string[];
  requirements: string;
  cancellationPolicy: string;
  startingPrice: number;
  pricingModel: PricingModel;
  durationMin: number;
  rating: number;
  reviewCount: number;
  location: string;
  mode: ServiceMode;
  status: ServiceStatus;
  verified: boolean;
  packages: ServicePackage[];
  addons: ServiceAddon[];
  createdAt: string;
}

export interface PriceBreakdown {
  subtotal: number;
  addonTotal: number;
  discount: number;
  platformFee: number;
  total: number;
  providerNet: number;
  couponCode?: string;
}

export interface BookingAddress {
  name: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  notes?: string;
}

export interface Booking {
  id: string;
  reference: string;
  serviceId: string;
  providerId: string;
  customerId: string;
  packageId?: string;
  packageName?: string;
  addonIds: string[];
  date: string;
  timeSlot: string;
  address: BookingAddress;
  mode: ServiceMode;
  price: PriceBreakdown;
  paymentMethod: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  cancelReason?: string;
  declineReason?: string;
  reviewLeft?: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  serviceId: string;
  providerId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  text: string;
  date: string;
  status: "published" | "hidden" | "reported";
  reply?: { text: string; date: string };
}

export interface Conversation {
  id: string;
  customerId: string;
  providerId: string;
  bookingId?: string;
  lastMessage: string;
  lastAt: string;
  unreadCustomer: number;
  unreadProvider: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: Role;
  text: string;
  at: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  type:
    | "booking_request"
    | "booking_confirmed"
    | "booking_cancelled"
    | "message"
    | "payment"
    | "review"
    | "verification";
  title: string;
  body: string;
  link: string;
  read: boolean;
  at: string;
}

export interface Transaction {
  id: string;
  reference: string;
  bookingId: string;
  bookingReference: string;
  customerId: string;
  providerId: string;
  gross: number;
  platformFee: number;
  net: number;
  method: string;
  status: PaymentStatus;
  date: string;
}

export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  minAmount: number;
  maxDiscount: number;
  start: string;
  expiry: string;
  usageLimit: number;
  used: number;
  active: boolean;
}

export interface Dispute {
  id: string;
  reference: string;
  bookingId: string;
  customerId: string;
  providerId: string;
  reason: string;
  description: string;
  status: "Open" | "Under Review" | "Awaiting Information" | "Resolved" | "Closed";
  adminNotes: string;
  createdAt: string;
}

export interface PlatformSettings {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  platformFeePercent: number;
  cancellationHours: number;
  reviewEnabled: boolean;
  maintenanceMode: boolean;
}
