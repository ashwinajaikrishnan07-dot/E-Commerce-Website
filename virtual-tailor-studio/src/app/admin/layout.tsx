import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | Virtual Tailor Studio",
  description: "Content management system for managing assets, components, and orders.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {children}
    </div>
  );
}
