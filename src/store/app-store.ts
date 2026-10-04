"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppNotification, Booking, BookingStatus, Category, ChatMessage, Conversation,
  Coupon, Dispute, PlatformSettings, Provider, Review, Service, Transaction, DemoUser,
} from "@/types";
import { categories as seedCategories } from "@/data/categories";
import { demoUsers, providers as seedProviders } from "@/data/providers";
import { services as seedServices } from "@/data/services";
import {
  defaultSettings, seedBookings, seedConversations, seedCoupons, seedDisputes,
  seedMessages, seedNotifications, seedReviews, seedTransactions,
} from "@/data/seed";
import { bookingRef, uid } from "@/lib/utils";

interface AppState {
  users: DemoUser[];
  providers: Provider[];
  services: Service[];
  categories: Category[];
  bookings: Booking[];
  reviews: Review[];
  conversations: Conversation[];
  messages: ChatMessage[];
  notifications: AppNotification[];
  transactions: Transaction[];
  coupons: Coupon[];
  disputes: Dispute[];
  settings: PlatformSettings;
  savedServiceIds: string[];
  savedProviderIds: string[];

  toggleSaveService: (id: string) => void;
  toggleSaveProvider: (id: string) => void;
  addBooking: (b: Omit<Booking, "id" | "reference" | "createdAt">) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus, extra?: Partial<Booking>) => void;
  addService: (s: Service) => void;
  updateService: (id: string, patch: Partial<Service>) => void;
  deleteService: (id: string) => void;
  addReview: (r: Omit<Review, "id" | "date" | "status">) => Review;
  replyReview: (id: string, text: string) => void;
  moderateReview: (id: string, status: Review["status"]) => void;
  sendMessage: (conversationId: string, senderId: string, senderRole: "customer" | "provider" | "admin", text: string) => void;
  getOrCreateConversation: (customerId: string, providerId: string, bookingId?: string) => string;
  markConversationRead: (conversationId: string, role: "customer" | "provider") => void;
  notify: (n: Omit<AppNotification, "id" | "at" | "read">) => void;
  markNotifRead: (id: string) => void;
  markAllNotifRead: (userId: string) => void;
  useCoupon: (code: string) => void;
  addCoupon: (c: Coupon) => void;
  toggleCoupon: (code: string) => void;
  updateProvider: (id: string, patch: Partial<Provider>) => void;
  updateUserStatus: (id: string, status: DemoUser["status"]) => void;
  updateDispute: (id: string, patch: Partial<Dispute>) => void;
  updateSettings: (patch: Partial<PlatformSettings>) => void;
  upsertCategory: (c: Category) => void;
  deleteCategory: (id: string) => boolean;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  resetDemo: () => void;
}

const initial = {
  users: demoUsers,
  providers: seedProviders,
  services: seedServices,
  categories: seedCategories,
  bookings: seedBookings,
  reviews: seedReviews,
  conversations: seedConversations,
  messages: seedMessages,
  notifications: seedNotifications,
  transactions: seedTransactions,
  coupons: seedCoupons,
  disputes: seedDisputes,
  settings: defaultSettings,
  savedServiceIds: ["s5", "s2"],
  savedProviderIds: ["p1"],
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...initial,

      toggleSaveService: (id) =>
        set((s) => ({
          savedServiceIds: s.savedServiceIds.includes(id)
            ? s.savedServiceIds.filter((x) => x !== id)
            : [...s.savedServiceIds, id],
        })),
      toggleSaveProvider: (id) =>
        set((s) => ({
          savedProviderIds: s.savedProviderIds.includes(id)
            ? s.savedProviderIds.filter((x) => x !== id)
            : [...s.savedProviderIds, id],
        })),

      addBooking: (b) => {
        const booking: Booking = { ...b, id: uid("b"), reference: bookingRef(), createdAt: new Date().toISOString() };
        set((s) => ({ bookings: [booking, ...s.bookings] }));
        const svc = get().services.find((x) => x.id === booking.serviceId);
        // auto-create transaction record (demo)
        const txn: Transaction = {
          id: uid("t"), reference: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
          bookingId: booking.id, bookingReference: booking.reference,
          customerId: booking.customerId, providerId: booking.providerId,
          gross: booking.price.total, platformFee: booking.price.platformFee, net: booking.price.providerNet,
          method: booking.paymentMethod,
          status: booking.paymentMethod === "Cash on Service" ? "Unpaid" : booking.paymentStatus,
          date: new Date().toISOString(),
        };
        set((s) => ({ transactions: [txn, ...s.transactions] }));
        // notifications
        const providerUser = get().providers.find((p) => p.id === booking.providerId);
        get().notify({
          userId: providerUser?.userId ?? "u-prov-1",
          type: "booking_request",
          title: "New booking request",
          body: `${booking.address.name} requested ${svc?.title ?? "a service"}.`,
          link: "/provider/bookings",
        });
        return booking;
      },

      updateBookingStatus: (id, status, extra) =>
        set((s) => ({
          bookings: s.bookings.map((b) => {
            if (b.id !== id) return b;
            const patch: Partial<Booking> = { bookingStatus: status, ...extra };
            if (status === "Cancelled" || status === "Declined") patch.paymentStatus = b.paymentMethod === "Cash on Service" ? "Unpaid" : b.paymentStatus === "Paid" ? "Refund Pending" : b.paymentStatus;
            return { ...b, ...patch };
          }),
        })),

      addService: (svc) => set((s) => ({ services: [svc, ...s.services] })),
      updateService: (id, patch) =>
        set((s) => ({ services: s.services.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      deleteService: (id) => set((s) => ({ services: s.services.filter((x) => x.id !== id) })),

      addReview: (r) => {
        const review: Review = { ...r, id: uid("r"), date: new Date().toISOString(), status: "published" };
        set((s) => ({
          reviews: [review, ...s.reviews],
          bookings: s.bookings.map((b) => (b.id === r.bookingId ? { ...b, reviewLeft: true } : b)),
        }));
        return review;
      },
      replyReview: (id, text) =>
        set((s) => ({
          reviews: s.reviews.map((r) => (r.id === id ? { ...r, reply: { text, date: new Date().toISOString() } } : r)),
        })),
      moderateReview: (id, status) =>
        set((s) => ({ reviews: s.reviews.map((r) => (r.id === id ? { ...r, status } : r)) })),

      sendMessage: (conversationId, senderId, senderRole, text) => {
        const msg: ChatMessage = { id: uid("m"), conversationId, senderId, senderRole, text, at: new Date().toISOString() };
        set((s) => ({
          messages: [...s.messages, msg],
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c, lastMessage: text, lastAt: msg.at,
                  unreadCustomer: senderRole === "customer" ? c.unreadCustomer : c.unreadCustomer + 1,
                  unreadProvider: senderRole === "provider" ? c.unreadProvider : c.unreadProvider + 1,
                }
              : c
          ),
        }));
      },
      getOrCreateConversation: (customerId, providerId, bookingId) => {
        const existing = get().conversations.find((c) => c.customerId === customerId && c.providerId === providerId);
        if (existing) return existing.id;
        const id = uid("conv");
        const conv: Conversation = { id, customerId, providerId, bookingId, lastMessage: "", lastAt: new Date().toISOString(), unreadCustomer: 0, unreadProvider: 0 };
        set((s) => ({ conversations: [conv, ...s.conversations] }));
        return id;
      },
      markConversationRead: (conversationId, role) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, unreadCustomer: role === "customer" ? 0 : c.unreadCustomer, unreadProvider: role === "provider" ? 0 : c.unreadProvider }
              : c
          ),
        })),

      notify: (n) =>
        set((s) => ({
          notifications: [{ ...n, id: uid("n"), at: new Date().toISOString(), read: false }, ...s.notifications],
        })),
      markNotifRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllNotifRead: (userId) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n)) })),

      useCoupon: (code) =>
        set((s) => ({ coupons: s.coupons.map((c) => (c.code === code ? { ...c, used: c.used + 1 } : c)) })),
      addCoupon: (c) => set((s) => ({ coupons: [c, ...s.coupons] })),
      toggleCoupon: (code) =>
        set((s) => ({ coupons: s.coupons.map((c) => (c.code === code ? { ...c, active: !c.active } : c)) })),

      updateProvider: (id, patch) =>
        set((s) => ({
          providers: s.providers.map((p) =>
            p.id === id ? { ...p, ...patch, verified: patch.verificationStatus ? patch.verificationStatus === "Approved" : p.verified } : p
          ),
        })),
      updateUserStatus: (id, status) =>
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, status } : u)) })),
      updateDispute: (id, patch) =>
        set((s) => ({ disputes: s.disputes.map((d) => (d.id === id ? { ...d, ...patch } : d)) })),
      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      upsertCategory: (c) =>
        set((s) => ({
          categories: s.categories.some((x) => x.id === c.id)
            ? s.categories.map((x) => (x.id === c.id ? c : x))
            : [...s.categories, c],
        })),
      deleteCategory: (id) => {
        const used = get().services.some((sv) => sv.categoryId === id && sv.status === "Published");
        if (used) return false;
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
        return true;
      },
      addTransaction: (t) => set((s) => ({ transactions: [{ ...t, id: uid("t") }, ...s.transactions] })),
      resetDemo: () => set({ ...initial }),
    }),
    { name: "fixora-store-v1", version: 1 }
  )
);

export function serviceProvider(services: Service[], providers: Provider[], serviceId: string) {
  const svc = services.find((s) => s.id === serviceId);
  const prov = providers.find((p) => p.id === svc?.providerId);
  return { svc, prov };
}
