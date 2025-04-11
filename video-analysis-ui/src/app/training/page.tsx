"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Database, CheckCircle2 } from "lucide-react"

export default function TrainingPage() {
  const [modelName, setModelName] = useState("")
  const [modelType, setModelType] = useState("VIOLENCE_DETECTION")
  const [datasetFile, setDatasetFile] = useState<File | null>(null)
  const [datasetPath, setDatasetPath] = useState("")
  const [epochs, setEpochs] = useState(50)
  const [learningRate, setLearningRate] = useState(0.001)
  const [training, setTraining] = useState(false)
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<any>(null)

  const handleDatasetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDatasetFile(e.target.files[0])
      setError("")
    }
  }

  const simulateTraining = () => {
    setTraining(true)
    setProgress(0)
    setError("")
    setComplete(false)
    setResult(null)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTraining(false)
          setComplete(true)

          // Simulate training result
          setResult({
            modelId: `model-${Math.random().toString(36).substring(2, 10)}`,
            accuracy: 0.75 + Math.random() * 0.2,
            trainingTime: Math.floor(300 + Math.random() * 600),
            epochs: epochs,
          })

          return 100
        }
        return prev + 100 / (epochs / 2) // Simulate progress based on epochs
      })
    }, 500)
  }

  const handleTrainFromFile = () => {
    if (!modelName) {
      setError("Vui lòng nhập tên mô hình")
      return
    }

    if (!datasetFile) {
      setError("Vui lòng chọn file dataset")
      return
    }

    simulateTraining()
  }

  const handleTrainFromPath = () => {
    if (!modelName) {
      setError("Vui lòng nhập tên mô hình")
      return
    }

    if (!datasetPath) {
      setError("Vui lòng nhập đường dẫn đến dataset")
      return
    }

    simulateTraining()
  }

  const resetForm = () => {
    setModelName("")
    setModelType("VIOLENCE_DETECTION")
    setDatasetFile(null)
    setDatasetPath("")
    setEpochs(50)
    setLearningRate(0.001)
    setTraining(false)
    setProgress(0)
    setComplete(false)
    setError("")
    setResult(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Huấn luyện mô hình</h1>
        <p className="text-muted-foreground">
          Huấn luyện mô hình mới để phát hiện hành vi bạo lực hoặc nhận dạng người.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="file">Từ file dataset</TabsTrigger>
          <TabsTrigger value="path">Từ đường dẫn</TabsTrigger>
        </TabsList>
        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>Huấn luyện từ file dataset</CardTitle>
              <CardDescription>Tải lên file dataset để huấn luyện mô hình mới.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="model-name">Tên mô hình</Label>
                <Input
                  id="model-name"
                  placeholder="violence-detector-v1"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  disabled={training || complete}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="model-type">Loại mô hình</Label>
                <Select value={modelType} onValueChange={setModelType} disabled={training || complete}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại mô hình" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIOLENCE_DETECTION">Phát hiện bạo lực</SelectItem>
                    <SelectItem value="PERSON_DETECTION">Nhận dạng người</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="dataset-file">File dataset</Label>
                <Input
                  id="dataset-file"
                  type="file"
                  accept=".zip,.tar.gz"
                  onChange={handleDatasetFileChange}
                  disabled={training || complete}
                />
                <p className="text-xs text-muted-foreground">Hỗ trợ định dạng: ZIP, TAR.GZ. Kích thước tối đa: 1GB</p>
              </div>

              {datasetFile && (
                <div className="rounded-md bg-muted p-3">
                  <div className="text-sm font-medium">{datasetFile.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {(datasetFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Số epochs ({epochs})</Label>
                  </div>
                  <Slider
                    value={[epochs]}
                    min={10}
                    max={100}
                    step={5}
                    onValueChange={(value) => setEpochs(value[0])}
                    disabled={training || complete}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Learning rate ({learningRate})</Label>
                  </div>
                  <Slider
                    value={[learningRate * 1000]}
                    min={0.1}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => setLearningRate(value[0] / 1000)}
                    disabled={training || complete}
                  />
                </div>
              </div>

              {training && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>
                      Đang huấn luyện... Epoch {Math.ceil((progress / 100) * epochs)}/{epochs}
                    </span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm} disabled={training}>
                Đặt lại
              </Button>
              <Button onClick={handleTrainFromFile} disabled={!modelName || !datasetFile || training || complete}>
                <Database className="mr-2 h-4 w-4" />
                Bắt đầu huấn luyện
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="path">
          <Card>
            <CardHeader>
              <CardTitle>Huấn luyện từ đường dẫn</CardTitle>
              <CardDescription>Sử dụng dataset có sẵn trên server để huấn luyện mô hình mới.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="model-name-path">Tên mô hình</Label>
                <Input
                  id="model-name-path"
                  placeholder="violence-detector-v1"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  disabled={training || complete}
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="model-type-path">Loại mô hình</Label>
                <Select value={modelType} onValueChange={setModelType} disabled={training || complete}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại mô hình" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIOLENCE_DETECTION">Phát hiện bạo lực</SelectItem>
                    <SelectItem value="PERSON_DETECTION">Nhận dạng người</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="dataset-path">Đường dẫn dataset</Label>
                <Input
                  id="dataset-path"
                  placeholder="/path/to/dataset"
                  value={datasetPath}
                  onChange={(e) => setDatasetPath(e.target.value)}
                  disabled={training || complete}
                />
                <p className="text-xs text-muted-foreground">Nhập đường dẫn đến thư mục dataset trên server.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Số epochs ({epochs})</Label>
                  </div>
                  <Slider
                    value={[epochs]}
                    min={10}
                    max={100}
                    step={5}
                    onValueChange={(value) => setEpochs(value[0])}
                    disabled={training || complete}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Learning rate ({learningRate})</Label>
                  </div>
                  <Slider
                    value={[learningRate * 1000]}
                    min={0.1}
                    max={10}
                    step={0.1}
                    onValueChange={(value) => setLearningRate(value[0] / 1000)}
                    disabled={training || complete}
                  />
                </div>
              </div>

              {training && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>
                      Đang huấn luyện... Epoch {Math.ceil((progress / 100) * epochs)}/{epochs}
                    </span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm} disabled={training}>
                Đặt lại
              </Button>
              <Button onClick={handleTrainFromPath} disabled={!modelName || !datasetPath || training || complete}>
                <Database className="mr-2 h-4 w-4" />
                Bắt đầu huấn luyện
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {complete && result && (
        <Card>
          <CardHeader className="bg-green-50 dark:bg-green-900/20">
            <CardTitle className="text-green-700 dark:text-green-300">Huấn luyện hoàn tất</CardTitle>
            <CardDescription>Mô hình đã được huấn luyện thành công và sẵn sàng sử dụng.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex justify-between items-center">
              <span className="font-medium">ID mô hình:</span>
              <span className="font-mono text-sm">{result.modelId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Tên mô hình:</span>
              <span>{modelName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Loại mô hình:</span>
              <span>{modelType === "VIOLENCE_DETECTION" ? "Phát hiện bạo lực" : "Nhận dạng người"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Độ chính xác:</span>
              <span className="font-medium">{(result.accuracy * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Thời gian huấn luyện:</span>
              <span>{result.trainingTime} giây</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Số epochs:</span>
              <span>{result.epochs}</span>
            </div>

            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div className="h-2 rounded-full bg-green-500" style={{ width: `${result.accuracy * 100}%` }}></div>
            </div>

            <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Thành công</AlertTitle>
              <AlertDescription>
                Mô hình đã được huấn luyện thành công và sẵn sàng sử dụng cho việc phát hiện.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={resetForm}>
              Huấn luyện mô hình khác
            </Button>
            <Button asChild>
              <a href="/models">Quản lý mô hình</a>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
