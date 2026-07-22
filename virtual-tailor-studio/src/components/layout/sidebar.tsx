"use client";

import {
  Shirt,
  Palette,
  Layers,
  Scissors,
  Crown,
  Star,
  ShoppingBag,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";

// ============================================================
// SIDEBAR
// Left navigation rail with icon-based shortcuts
// for quick access to design categories and features.
// ============================================================

interface NavItem {
  id: string;
  icon: typeof Shirt;
  label: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "garment", icon: Shirt, label: "Garment Type" },
  { id: "design", icon: Layers, label: "Designs" },
  { id: "fabric", icon: Scissors, label: "Fabrics" },
  { id: "colors", icon: Palette, label: "Colors" },
  { id: "embroidery", icon: Crown, label: "Embroidery" },
];

const BOTTOM_ITEMS: NavItem[] = [
  { id: "favorites", icon: Star, label: "Favorites" },
  { id: "history", icon: History, label: "History" },
  { id: "order", icon: ShoppingBag, label: "Place Order" },
];

export function Sidebar() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const openCustomizationPanel = useUIStore((s) => s.openCustomizationPanel);

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    openCustomizationPanel();
  };

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-16 z-30 hidden lg:flex flex-col items-center py-4 gap-1">
      {/* Glass background */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-r border-white/10" />

      {/* Main navigation */}
      <nav className="relative flex flex-col items-center gap-1 flex-1">
        {NAV_ITEMS.map((item) => (
          <Tooltip key={item.id} content={item.label} side="right">
            <Button
              variant={activeTab === item.id ? "default" : "ghost"}
              size="icon"
              onClick={() => handleItemClick(item.id)}
              aria-label={item.label}
              className={cn(
                "relative",
                activeTab === item.id && "shadow-md shadow-violet-500/20"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
            </Button>
          </Tooltip>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="relative flex flex-col items-center gap-1">
        <Separator className="w-8 mb-2" />
        {BOTTOM_ITEMS.map((item) => (
          <Tooltip key={item.id} content={item.label} side="right">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleItemClick(item.id)}
              aria-label={item.label}
            >
              <item.icon className="h-4.5 w-4.5" />
            </Button>
          </Tooltip>
        ))}
      </div>
    </aside>
  );
}
