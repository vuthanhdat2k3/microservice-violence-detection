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
import { Upload, Link, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState("")
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState("")

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

  const simulateUpload = () => {
    setUploading(true)
    setProgress(0)
    setError("")

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleFileUpload = () => {
    if (!file) {
      setError("Vui lòng chọn một file video để tải lên")
      return
    }

    // Kiểm tra định dạng file
    const validTypes = ["video/mp4", "video/avi", "video/mov", "video/quicktime"]
    if (!validTypes.includes(file.type)) {
      setError("Định dạng file không hỗ trợ. Vui lòng sử dụng MP4, AVI hoặc MOV")
      return
    }

    simulateUpload()
  }

  const handleUrlUpload = () => {
    if (!url) {
      setError("Vui lòng nhập URL video")
      return
    }

    // Kiểm tra URL đơn giản
    if (!url.startsWith("http")) {
      setError("URL không hợp lệ")
      return
    }

    simulateUpload()
  }

  const resetForm = () => {
    setFile(null)
    setUrl("")
    setUploading(false)
    setProgress(0)
    setUploadComplete(false)
    setError("")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Tải lên video</h1>
        <p className="text-muted-foreground">Tải lên video để phân tích và phát hiện hành vi bạo lực.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadComplete && (
        <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Thành công</AlertTitle>
          <AlertDescription>Video đã được tải lên thành công và đang được xử lý.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">Tải lên từ máy tính</TabsTrigger>
          <TabsTrigger value="url">Tải lên từ URL</TabsTrigger>
        </TabsList>
        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>Tải lên file video</CardTitle>
              <CardDescription>Chọn file video từ máy tính của bạn để tải lên hệ thống.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="video-file">File video</Label>
                <Input
                  id="video-file"
                  type="file"
                  accept="video/mp4,video/avi,video/mov,video/quicktime"
                  onChange={handleFileChange}
                  disabled={uploading || uploadComplete}
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

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Đang tải lên...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm} disabled={uploading}>
                Đặt lại
              </Button>
              <Button onClick={handleFileUpload} disabled={!file || uploading || uploadComplete}>
                <Upload className="mr-2 h-4 w-4" />
                Tải lên
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="url">
          <Card>
            <CardHeader>
              <CardTitle>Tải lên từ URL</CardTitle>
              <CardDescription>Nhập URL của video để tải lên và phân tích.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="gri w-full items-center gap-1.5">
                <Label htmlFor="video-url">URL video</Label>
                <Input
                  id="video-url"
                  type="url"
                  placeholder="https://example.com/video.mp4"
                  value={url}
                  onChange={handleUrlChange}
                  disabled={uploading || uploadComplete}
                />
                <p className="text-xs text-muted-foreground">
                  Nhập URL trực tiếp đến file video. URL phải có thể truy cập công khai.
                </p>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Đang tải xuống...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm} disabled={uploading}>
                Đặt lại
              </Button>
              <Button onClick={handleUrlUpload} disabled={!url || uploading || uploadComplete}>
                <Link className="mr-2 h-4 w-4" />
                Tải xuống
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {uploadComplete && (
        <Card>
          <CardHeader>
            <CardTitle>Xử lý video</CardTitle>
            <CardDescription>Video của bạn đã được tải lên thành công và đang được xử lý.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Trạng thái:</span>
              <span className="text-amber-500 font-medium">Đang xử lý</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">ID xử lý:</span>
              <span className="font-mono text-sm">
                PROC-{Math.random().toString(36).substring(2, 10).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Thời gian ước tính:</span>
              <span>1-2 phút</span>
            </div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Lưu ý</AlertTitle>
              <AlertDescription>
                Thời gian xử lý phụ thuộc vào độ dài và độ phức tạp của video. Bạn sẽ nhận được thông báo khi quá trình
                hoàn tất.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/results">Xem kết quả phân tích</a>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
