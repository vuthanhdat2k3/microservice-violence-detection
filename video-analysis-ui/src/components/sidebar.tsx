"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, Upload, Video, BarChart2, Database, Settings, BookOpen, AlertTriangle, Layers } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      icon: Home,
      title: "Trang chủ",
    },
    {
      href: "/upload",
      icon: Upload,
      title: "Tải lên video",
    },
    {
      href: "/detection",
      icon: AlertTriangle,
      title: "Phát hiện bạo lực",
    },
    {
      href: "/person-detection",
      icon: Video,
      title: "Nhận dạng người",
    },
    {
      href: "/training",
      icon: Layers,
      title: "Huấn luyện mô hình",
    },
    {
      href: "/results",
      icon: BarChart2,
      title: "Kết quả phân tích",
    },
    {
      href: "/models",
      icon: Database,
      title: "Quản lý mô hình",
    },
    {
      href: "/documentation",
      icon: BookOpen,
      title: "Tài liệu hướng dẫn",
    },
    {
      href: "/settings",
      icon: Settings,
      title: "Cài đặt",
    },
  ]

  return (
    <div className="hidden md:flex h-screen w-64 flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Video className="h-6 w-6 text-primary" />
          <span>Phân tích Video</span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn("justify-start gap-2", pathname === route.href && "bg-secondary")}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="h-4 w-4" />
                {route.title}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 text-xs text-muted-foreground">
        <p>Phiên bản 1.0.0</p>
      </div>
    </div>
  )
}
