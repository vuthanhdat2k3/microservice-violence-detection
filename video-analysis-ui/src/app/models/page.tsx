"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Download, MoreHorizontal, Trash2, Edit, Eye, Search, AlertTriangle, Users } from "lucide-react"

export default function ModelsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Sample model data
  const models = [
    {
      id: "model-abc123",
      name: "Violence Detector v1",
      type: "VIOLENCE_DETECTION",
      accuracy: 0.87,
      createdAt: "2023-10-15T14:30:00Z",
      size: 45.2,
      status: "active",
    },
    {
      id: "model-def456",
      name: "Person Detector v2",
      type: "PERSON_DETECTION",
      accuracy: 0.92,
      createdAt: "2023-10-10T09:15:00Z",
      size: 78.5,
      status: "active",
    },
    {
      id: "model-ghi789",
      name: "Violence Detector v2",
      type: "VIOLENCE_DETECTION",
      accuracy: 0.91,
      createdAt: "2023-10-20T16:45:00Z",
      size: 52.8,
      status: "active",
    },
    {
      id: "model-jkl012",
      name: "Person Detector v1",
      type: "PERSON_DETECTION",
      accuracy: 0.85,
      createdAt: "2023-09-28T11:20:00Z",
      size: 65.3,
      status: "inactive",
    },
    {
      id: "model-mno345",
      name: "Violence Detector Beta",
      type: "VIOLENCE_DETECTION",
      accuracy: 0.79,
      createdAt: "2023-09-15T10:00:00Z",
      size: 38.7,
      status: "inactive",
    },
  ]

  // Filter models based on search term
  const filteredModels = models.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý mô hình</h1>
        <p className="text-muted-foreground">Quản lý các mô hình đã huấn luyện trong hệ thống.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm mô hình..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button asChild>
          <a href="/training">Huấn luyện mô hình mới</a>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách mô hình</CardTitle>
          <CardDescription>Tất cả các mô hình đã được huấn luyện trong hệ thống.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên mô hình</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead className="text-center">Độ chính xác</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-center">Kích thước</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModels.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Không tìm thấy mô hình nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredModels.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>
                      {model.type === "VIOLENCE_DETECTION" ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Phát hiện bạo lực</span>
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                          <Users className="h-3 w-3" />
                          <span>Nhận dạng người</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{(model.accuracy * 100).toFixed(1)}%</TableCell>
                    <TableCell>{formatDate(model.createdAt)}</TableCell>
                    <TableCell className="text-center">{model.size} MB</TableCell>
                    <TableCell className="text-center">
                      {model.status === "active" ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        >
                          Đang hoạt động
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800"
                        >
                          Không hoạt động
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Mở menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Xem chi tiết</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Tải xuống</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Chỉnh sửa</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Xóa</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số mô hình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{models.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mô hình đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{models.filter((m) => m.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mô hình phát hiện bạo lực</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{models.filter((m) => m.type === "VIOLENCE_DETECTION").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mô hình nhận dạng người</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{models.filter((m) => m.type === "PERSON_DETECTION").length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
