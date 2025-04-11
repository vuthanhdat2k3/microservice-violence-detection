import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Upload, Video, AlertTriangle, Users, Database, Clock, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
        <p className="text-muted-foreground">Tổng quan về hệ thống phân tích video và phát hiện hành vi bạo lực.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Video đã xử lý</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+5 trong 24 giờ qua</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phát hiện bạo lực</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+2 trong 24 giờ qua</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Người được phát hiện</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">842</div>
            <p className="text-xs text-muted-foreground">+18 trong 24 giờ qua</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mô hình đã huấn luyện</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+1 trong tuần qua</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Phân tích theo thời gian</CardTitle>
            <CardDescription>Số lượng video được xử lý và phát hiện bạo lực theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <BarChart className="h-16 w-16 text-muted-foreground" />
              <p className="ml-2 text-muted-foreground">Biểu đồ phân tích theo thời gian</p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Video mới được tải lên</p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="inline h-3 w-3 mr-1" /> 5 phút trước
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-red-500/10 p-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Phát hiện hành vi bạo lực</p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="inline h-3 w-3 mr-1" /> 15 phút trước
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-500/10 p-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Huấn luyện mô hình hoàn tất</p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="inline h-3 w-3 mr-1" /> 2 giờ trước
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Video className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Phân tích video hoàn tất</p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="inline h-3 w-3 mr-1" /> 3 giờ trước
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Tabs defaultValue="quick-actions">
          <TabsList>
            <TabsTrigger value="quick-actions">Thao tác nhanh</TabsTrigger>
            <TabsTrigger value="system-status">Trạng thái hệ thống</TabsTrigger>
          </TabsList>
          <TabsContent value="quick-actions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Tải lên video</CardTitle>
                  <CardDescription>Tải lên video để phân tích và phát hiện</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/upload">
                      <Upload className="mr-2 h-4 w-4" />
                      Tải lên ngay
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Phát hiện bạo lực</CardTitle>
                  <CardDescription>Phát hiện hành vi bạo lực trong video</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/detection">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Phát hiện ngay
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Huấn luyện mô hình</CardTitle>
                  <CardDescription>Huấn luyện mô hình mới cho hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/training">
                      <Database className="mr-2 h-4 w-4" />
                      Huấn luyện ngay
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="system-status">
            <Card>
              <CardHeader>
                <CardTitle>Trạng thái hệ thống</CardTitle>
                <CardDescription>Tình trạng hoạt động của các dịch vụ trong hệ thống</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      <span className="font-medium">API Gateway</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Hoạt động</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      <span className="font-medium">Eureka Server</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Hoạt động</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      <span className="font-medium">Training Service</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Hoạt động</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      <span className="font-medium">Detection Service</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Hoạt động</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                      <span className="font-medium">Python API</span>
                    </div>
                    <span className="text-sm text-muted-foreground">Hoạt động</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
