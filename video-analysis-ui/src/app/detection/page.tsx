"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, CheckCircle2, Camera } from "lucide-react"

export default function DetectionPage() {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState("")
  const [model, setModel] = useState("default-violence-model")
  const [threshold, setThreshold] = useState(70)
  const [saveResults, setSaveResults] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError("")
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    setError("")
  }

  const simulateProcessing = () => {
    setProcessing(true)
    setProgress(0)
    setError("")
    setComplete(false)
    setResult(null)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setProcessing(false)
          setComplete(true)

          // Simulate detection result
          const isFight = Math.random() > 0.5
          setResult({
            fight: isFight,
            percentage: isFight ? 85 + Math.random() * 15 : 10 + Math.random() * 40,
            processingTime: Math.floor(1000 + Math.random() * 4000),
          })

          return 100
        }
        return prev + 5
      })
    }, 300)
  }

  const handleFileDetection = () => {
    if (!file) {
      setError("Vui lòng chọn một file video để phân tích")
      return
    }

    // Kiểm tra định dạng file
    const validTypes = ["video/mp4", "video/avi", "video/mov", "video/quicktime"]
    if (!validTypes.includes(file.type)) {
      setError("Định dạng file không hỗ trợ. Vui lòng sử dụng MP4, AVI hoặc MOV")
      return
    }

    simulateProcessing()
  }

  const handleUrlDetection = () => {
    if (!url) {
      setError("Vui lòng nhập URL video")
      return
    }

    // Kiểm tra URL đơn giản
    if (!url.startsWith("http")) {
      setError("URL không hợp lệ")
      return
    }

    simulateProcessing()
  }

  const handleCameraDetection = () => {
    setError("Tính năng phát hiện từ camera đang được phát triển")
  }

  const resetForm = () => {
    setFile(null)
    setUrl("")
    setProcessing(false)
    setProgress(0)
    setComplete(false)
    setError("")
    setResult(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Phát hiện bạo lực</h1>
        <p className="text-muted-foreground">Phát hiện hành vi bạo lực trong video bằng mô hình AI.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="file">Từ máy tính</TabsTrigger>
          <TabsTrigger value="url">Từ URL</TabsTrigger>
          <TabsTrigger value="camera">Từ camera</TabsTrigger>
        </TabsList>
        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>Phát hiện từ file video</CardTitle>
              <CardDescription>Tải lên file video để phát hiện hành vi bạo lực.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="video-file">File video</Label>
                <Input
                  id="video-file"
                  type="file"
                  accept="video/mp4,video/avi,video/mov,video/quicktime"
                  onChange={handleFileChange}
                  disabled={processing || complete}
                />
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ định dạng: MP4, AVI, MOV. Kích thước tối đa: 500MB
                </p>
              </div>

              {file && (
                <div className="rounded-md bg-muted p-3">
                  <div className="text-sm font-medium">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Mô hình phát hiện</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mô hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default-violence-model">Mô hình mặc định</SelectItem>
                      <SelectItem value="violence-detector-v1">Violence Detector v1</SelectItem>
                      <SelectItem value="violence-detector-v2">Violence Detector v2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Ngưỡng phát hiện ({threshold}%)</Label>
                  </div>
                  <Slider
                    value={[threshold]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setThreshold(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Điều chỉnh ngưỡng phát hiện để thay đổi độ nhạy của mô hình.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="save-results" checked={saveResults} onCheckedChange={setSaveResults} />
                  <Label htmlFor="save-results">Lưu kết quả phân tích</Label>
                </div>
              </div>

              {processing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Đang phân tích...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm} disabled={processing}>
                Đặt lại
              </Button>
              <Button onClick={handleFileDetection} disabled={!file || processing || complete}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Phát hiện bạo lực
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>Phát hiện từ URL</CardTitle>
              <CardDescription>Nhập URL của video để phát hiện hành vi bạo lực.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="video-url">URL video</Label>
                <Input
                  id="video-url"
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={url}
                  onChange={handleUrlChange}
                  disabled={processing || complete}
                />
                <p className="text-xs text-muted-foreground">
                  Nhập URL trực tiếp đến file video. URL phải có thể truy cập công khai.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Mô hình phát hiện</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mô hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default-violence-model">Mô hình mặc định</SelectItem>
                      <SelectItem value="violence-detector-v1">Violence Detector v1</SelectItem>
                      <SelectItem value="violence-detector-v2">Violence Detector v2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Ngưỡng phát hiện ({threshold}%)</Label>
                  </div>
                  <Slider
                    value={[threshold]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setThreshold(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Điều chỉnh ngưỡng phát hiện để thay đổi độ nhạy của mô hình.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="save-results-url" checked={saveResults} onCheckedChange={setSaveResults} />
                  <Label htmlFor="save-results-url">Lưu kết quả phân tích</Label>
                </div>
              </div>

              {processing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Đang phân tích...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm} disabled={processing}>
                Đặt lại
              </Button>
              <Button onClick={handleUrlDetection} disabled={!url || processing || complete}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Phát hiện bạo lực
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="camera">
          <Card>
            <CardHeader>
              <CardTitle>Phát hiện từ camera</CardTitle>
              <CardDescription>Sử dụng camera để phát hiện hành vi bạo lực theo thời gian thực.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                <Camera className="h-12 w-12 text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Camera chưa được kích hoạt</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Mô hình phát hiện</Label>
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn mô hình" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default-violence-model">Mô hình mặc định</SelectItem>
                      <SelectItem value="violence-detector-v1">Violence Detector v1</SelectItem>
                      <SelectItem value="violence-detector-v2">Violence Detector v2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Ngưỡng phát hiện ({threshold}%)</Label>
                  </div>
                  <Slider
                    value={[threshold]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setThreshold(value[0])}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="save-results-camera" checked={saveResults} onCheckedChange={setSaveResults} />
                  <Label htmlFor="save-results-camera">Lưu kết quả phát hiện</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCameraDetection} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Bắt đầu phát hiện
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {complete && result && (
        <Card className={result.fight ? "border-red-500" : "border-green-500"}>
          <CardHeader className={result.fight ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/20"}>
            <CardTitle
              className={result.fight ? "text-red-700 dark:text-red-300" : "text-green-700 dark:text-green-300"}
            >
              Kết quả phát hiện
            </CardTitle>
            <CardDescription>Kết quả phân tích video để phát hiện hành vi bạo lực</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex justify-between items-center">
              <span className="font-medium">Phát hiện bạo lực:</span>
              <span
                className={`font-bold ${result.fight ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
              >
                {result.fight ? "CÓ" : "KHÔNG"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Độ tin cậy:</span>
              <span className="font-medium">{result.percentage.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Thời gian xử lý:</span>
              <span>{result.processingTime} ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Mô hình sử dụng:</span>
              <span>{model}</span>
            </div>

            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full ${result.fight ? "bg-red-500" : "bg-green-500"}`}
                style={{ width: `${result.percentage}%` }}
              ></div>
            </div>

            {result.fight && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Cảnh báo</AlertTitle>
                <AlertDescription>
                  Đã phát hiện hành vi bạo lực trong video với độ tin cậy cao. Vui lòng xem xét nội dung này cẩn thận.
                </AlertDescription>
              </Alert>
            )}

            {!result.fight && (
              <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>An toàn</AlertTitle>
                <AlertDescription>Không phát hiện hành vi bạo lực trong video này.</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetForm}>
              Phân tích video khác
            </Button>
            <Button asChild>
              <a href="/results">Xem chi tiết</a>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
