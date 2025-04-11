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
import { MoreHorizontal, Trash2, Eye, Search, AlertTriangle, Video, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"

export default function ResultsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [date, setDate] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  // Sample results data
  const results = [
    {
      id: "result-abc123",
      videoName: "surveillance-cam-1.mp4",
      detectionType: "VIOLENCE_DETECTION",
      hasFight: true,
      confidence: 0.92,
      timestamp: "2023-10-25T14:30:00Z",
      duration: 45,
      modelId: "model-ghi789",
    },
    {
      id: "result-def456",
      videoName: "street-footage-2.mp4",
      detectionType: "PERSON_DETECTION",
      personCount: 8,
      confidence: 0.88,
      timestamp: "2023-10-24T09:15:00Z",
      duration: 120,
      modelId: "model-def456",
    },
    {
      id: "result-ghi789",
      videoName: "school-yard-3.mp4",
      detectionType: "VIOLENCE_DETECTION",
      hasFight: false,
      confidence: 0.95,
      timestamp: "2023-10-23T16:45:00Z",
      duration: 60,
      modelId: "model-ghi789",
    },
    {
      id: "result-jkl012",
      videoName: "mall-entrance-4.mp4",
      detectionType: "PERSON_DETECTION",
      personCount: 15,
      confidence: 0.91,
      timestamp: "2023-10-22T11:20:00Z",
      duration: 180,
      modelId: "model-def456",
    },
    {
      id: "result-mno345",
      videoName: "parking-lot-5.mp4",
      detectionType: "VIOLENCE_DETECTION",
      hasFight: true,
      confidence: 0.87,
      timestamp: "2023-10-21T10:00:00Z",
      duration: 90,
      modelId: "model-abc123",
    },
  ]

  // Filter results based on search term and filter type
  const filteredResults = results.filter((result) => {
    // Search filter
    const matchesSearch =
      result.videoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.id.toLowerCase().includes(searchTerm.toLowerCase())

    // Type filter
    const matchesType =
      filterType === "all" ||
      (filterType === "violence" && result.detectionType === "VIOLENCE_DETECTION") ||
      (filterType === "person" && result.detectionType === "PERSON_DETECTION") ||
      (filterType === "fight" && result.detectionType === "VIOLENCE_DETECTION" && result.hasFight)

    // Date filter
    let matchesDate = true
    if (date.from || date.to) {
      const resultDate = new Date(result.timestamp)
      if (date.from && resultDate < date.from) {
        matchesDate = false
      }
      if (date.to) {
        // Add one day to include the end date
        const endDate = new Date(date.to)
        endDate.setDate(endDate.getDate() + 1)
        if (resultDate > endDate) {
          matchesDate = false
        }
      }
    }

    return matchesSearch && matchesType && matchesDate
  })

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

  // Format duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Kết quả phân tích</h1>
        <p className="text-muted-foreground">Xem và quản lý kết quả phân tích video.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-auto md:flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm kết quả..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Loại phát hiện" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="violence">Phát hiện bạo lực</SelectItem>
              <SelectItem value="person">Nhận dạng người</SelectItem>
              <SelectItem value="fight">Có bạo lực</SelectItem>
            </SelectContent>
          </Select>

          <DateRangePicker date={date} setDate={setDate} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách kết quả phân tích</CardTitle>
          <CardDescription>Tất cả các kết quả phân tích video trong hệ thống.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Video</TableHead>
                <TableHead>Loại phát hiện</TableHead>
                <TableHead className="text-center">Kết quả</TableHead>
                <TableHead className="text-center">Độ tin cậy</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead className="text-center">Thời lượng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Không tìm thấy kết quả nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <span>{result.videoName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {result.detectionType === "VIOLENCE_DETECTION" ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Phát hiện bạo lực</span>
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                          <span>Nhận dạng người</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {result.detectionType === "VIOLENCE_DETECTION" ? (
                        result.hasFight ? (
                          <Badge
                            variant="destructive"
                            className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400"
                          >
                            Có bạo lực
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
                            Không có bạo lực
                          </Badge>
                        )
                      ) : (
                        <span>{result.personCount} người</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{(result.confidence * 100).toFixed(1)}%</TableCell>
                    <TableCell>{formatDate(result.timestamp)}</TableCell>
                    <TableCell className="text-center">{formatDuration(result.duration)}</TableCell>
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
                            <span>Tải xuống báo cáo</span>
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
            <CardTitle className="text-sm font-medium">Tổng số kết quả</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phát hiện bạo lực</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.filter((r) => r.detectionType === "VIOLENCE_DETECTION").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Có hành vi bạo lực</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.filter((r) => r.detectionType === "VIOLENCE_DETECTION" && r.hasFight).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhận dạng người</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.filter((r) => r.detectionType === "PERSON_DETECTION").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
