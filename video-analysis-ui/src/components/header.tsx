"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, Bell, User } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useMobile } from "@/hooks/use-mobile"
import Link from "next/link"

export default function Header() {
  const isMobile = useMobile()

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      {isMobile && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel>Điều hướng</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">Trang chủ</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/upload">Tải lên video</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/detection">Phát hiện bạo lực</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/person-detection">Nhận dạng người</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/training">Huấn luyện mô hình</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/results">Kết quả phân tích</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/models">Quản lý mô hình</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/documentation">Tài liệu hướng dẫn</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">Cài đặt</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl">Hệ thống phân tích video</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Thông báo</span>
        </Button>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Tài khoản</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
            <DropdownMenuItem>Cài đặt</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
