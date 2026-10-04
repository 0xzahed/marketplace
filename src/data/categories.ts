import type { Category } from "@/types";

export const categories: Category[] = [
  { id: "c1", slug: "home-repair", name: "Home Repair", icon: "wrench", description: "Repairs, renovations and general handyman work.", serviceCount: 24, active: true, order: 1, subcategories: ["Carpentry", "Painting", "Appliance Repair"] },
  { id: "c2", slug: "cleaning", name: "Cleaning", icon: "sparkles", description: "Home & office deep cleaning, regular upkeep.", serviceCount: 18, active: true, order: 2, subcategories: ["Deep Cleaning", "Sofa & Carpet", "Office Cleaning"] },
  { id: "c3", slug: "electrical", name: "Electrical", icon: "zap", description: "Wiring, installation, troubleshooting.", serviceCount: 15, active: true, order: 3, subcategories: ["Wiring", "Lighting", "IPS & Solar"] },
  { id: "c4", slug: "plumbing", name: "Plumbing", icon: "droplets", description: "Leaks, fittings, water lines & sanitary.", serviceCount: 14, active: true, order: 4, subcategories: ["Leak Repair", "Sanitary", "Water Pump"] },
  { id: "c5", slug: "ac-repair", name: "AC Repair", icon: "snowflake", description: "AC service, repair, installation.", serviceCount: 12, active: true, order: 5, subcategories: ["AC Service", "AC Repair", "AC Installation"] },
  { id: "c6", slug: "moving", name: "Moving Services", icon: "truck", description: "Home shifting, office moving, transport.", serviceCount: 9, active: true, order: 6, subcategories: ["Home Shifting", "Office Moving"] },
  { id: "c7", slug: "beauty", name: "Beauty & Wellness", icon: "heart", description: "Salon at home, wellness & care.", serviceCount: 16, active: true, order: 7, subcategories: ["Hair & Makeup", "Spa", "Bridal"] },
  { id: "c8", slug: "photography", name: "Photography", icon: "camera", description: "Events, portraits, commercial shoots.", serviceCount: 11, active: true, order: 8, subcategories: ["Wedding", "Portrait", "Product"] },
  { id: "c9", slug: "design", name: "Design & Creative", icon: "palette", description: "Graphic design, branding, interiors.", serviceCount: 13, active: true, order: 9, subcategories: ["Logo & Branding", "Interior", "UI Design"] },
  { id: "c10", slug: "it", name: "IT & Technology", icon: "laptop", description: "Web, software, device & network support.", serviceCount: 21, active: true, order: 10, subcategories: ["Web Development", "Device Repair", "Networking"] },
  { id: "c11", slug: "education", name: "Education & Tutoring", icon: "book", description: "Tutors, test prep, skill coaching.", serviceCount: 17, active: true, order: 11, subcategories: ["Academic", "Language", "Music"] },
  { id: "c12", slug: "business", name: "Business Services", icon: "briefcase", description: "Consulting, legal, accounting help.", serviceCount: 10, active: true, order: 12, subcategories: ["Accounting", "Legal", "Marketing"] },
];

export const categoryIconMap: Record<string, string> = {
  "home-repair": "wrench",
  cleaning: "sparkles",
  electrical: "zap",
  plumbing: "droplets",
  "ac-repair": "snowflake",
  moving: "truck",
  beauty: "heart",
  photography: "camera",
  design: "palette",
  it: "laptop",
  education: "book",
  business: "briefcase",
};
