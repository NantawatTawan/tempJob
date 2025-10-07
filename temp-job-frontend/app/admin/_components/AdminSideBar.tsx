"use client";
import { cn } from "@/lib/utils";
import { Building, MessageSquare, Brush, Database } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminSideBar = () => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "ระบบจัดการบัญชีบริษัท",
      href: "/admin/company-management",
      icon: Building,
    },
    {
      name: "ระบบจัดการ Ads",
      href: "/admin/ads-management",
      icon: MessageSquare,
    },
    {
      name: "ระบบจัดการธีม",
      href: "/admin/theme-management",
      icon: Brush,
    },
    {
      name: "ระบบจัดการข้อมูลหลัก",
      href: "/admin/master-data-management",
      icon: Database,
    },
  ];

  return (
    <div
      id="sidebar"
      className="w-64 bg-green-50 border-r border-green-100 py-6"
    >
      <div className="px-6 mb-8">
        <span className="text-2xl font-bold text-green-600">TempJob Admin</span>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-6 py-3 text-gray-600 hover:bg-green-100",
                pathname === item.href && "text-green-900 bg-green-100"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSideBar;
