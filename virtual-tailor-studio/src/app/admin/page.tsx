"use client";

import { useState } from "react";
import {
  Upload,
  Palette,
  Layers,
  Image,
  Crown,
  Package,
  Users,
  Settings,
  BarChart3,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// ============================================================
// ADMIN PANEL
// Full CMS for managing assets, components, categories,
// textures, embroidery patterns, and orders.
// ============================================================

interface NavItem {
  id: string;
  label: string;
  icon: typeof Upload;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "components", label: "Components", icon: Layers, badge: 24 },
  { id: "textures", label: "Textures", icon: Image, badge: 18 },
  { id: "colors", label: "Colors", icon: Palette, badge: 32 },
  { id: "embroidery", label: "Embroidery", icon: Crown, badge: 15 },
  { id: "models", label: "3D Models", icon: Package, badge: 4 },
  { id: "orders", label: "Orders", icon: Package, badge: 7 },
  { id: "users", label: "Users", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

/** Mock stats for dashboard */
const STATS = [
  { label: "Total Designs", value: "1,247", change: "+12%" },
  { label: "Active Users", value: "342", change: "+8%" },
  { label: "Orders This Week", value: "28", change: "+23%" },
  { label: "Assets Uploaded", value: "156", change: "+5%" },
];

/** Mock assets list */
const MOCK_ASSETS = [
  { id: "1", name: "Banarasi Silk Texture", type: "Texture", status: "Active", date: "2024-01-15" },
  { id: "2", name: "Zardozi Pattern A", type: "Embroidery", status: "Active", date: "2024-01-14" },
  { id: "3", name: "Mandarin Collar Model", type: "3D Model", status: "Draft", date: "2024-01-13" },
  { id: "4", name: "Royal Purple Swatch", type: "Color", status: "Active", date: "2024-01-12" },
  { id: "5", name: "V-Neck Blouse", type: "Component", status: "Active", date: "2024-01-11" },
  { id: "6", name: "Chiffon Dupatta", type: "Component", status: "Review", date: "2024-01-10" },
];

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col">
        {/* Brand */}
        <div className="px-6 py-5 border-b border-white/10">
          <h1 className="text-lg font-semibold text-white">VTS Admin</h1>
          <p className="text-xs text-white/40 mt-0.5">Content Management</p>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                  activeNav === item.id
                    ? "bg-violet-600/20 text-violet-300 border border-violet-500/20"
                    : "text-white/60 hover:text-white/90 hover:bg-white/5"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </ScrollArea>

        {/* Upload button */}
        <div className="p-4 border-t border-white/10">
          <Button variant="premium" className="w-full" size="default">
            <Upload className="h-4 w-4" />
            Upload Asset
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white capitalize">
              {activeNav}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </Button>
            <Button variant="default" size="sm">
              <Plus className="h-3.5 w-3.5" />
              New
            </Button>
          </div>
        </header>

        {/* Content area */}
        <ScrollArea className="flex-1 p-6">
          {activeNav === "dashboard" && (
            <div className="space-y-6">
              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-4">
                {STATS.map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="p-5">
                      <p className="text-xs text-white/50 font-medium">
                        {stat.label}
                      </p>
                      <div className="flex items-end gap-2 mt-2">
                        <span className="text-2xl font-bold text-white">
                          {stat.value}
                        </span>
                        <span className="text-xs text-emerald-400 font-medium pb-0.5">
                          {stat.change}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent assets */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {/* Table header */}
                    <div className="grid grid-cols-[1fr_120px_100px_120px_80px] gap-4 px-4 py-2 text-xs font-medium text-white/40 uppercase tracking-wider">
                      <span>Name</span>
                      <span>Type</span>
                      <span>Status</span>
                      <span>Date</span>
                      <span>Actions</span>
                    </div>
                    <Separator />
                    {/* Table rows */}
                    {MOCK_ASSETS.map((asset) => (
                      <div
                        key={asset.id}
                        className="grid grid-cols-[1fr_120px_100px_120px_80px] gap-4 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors items-center"
                      >
                        <span className="text-sm text-white font-medium truncate">
                          {asset.name}
                        </span>
                        <Badge variant="outline" className="w-fit text-[10px]">
                          {asset.type}
                        </Badge>
                        <Badge
                          variant={
                            asset.status === "Active"
                              ? "success"
                              : asset.status === "Draft"
                              ? "secondary"
                              : "default"
                          }
                          className="w-fit text-[10px]"
                        >
                          {asset.status}
                        </Badge>
                        <span className="text-xs text-white/40">
                          {asset.date}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon-sm" aria-label="View">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" aria-label="Edit">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" aria-label="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeNav !== "dashboard" && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-white/40 text-sm">
                  {activeNav.charAt(0).toUpperCase() + activeNav.slice(1)} management
                </p>
                <p className="text-white/25 text-xs mt-1">
                  Content will load from the API
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </main>
    </div>
  );
}
