# Sử dụng image Python nhẹ
FROM python:3.9-slim

# Tạo thư mục làm việc
WORKDIR /app

# Cài các thư viện hệ thống cần thiết cho OpenCV (không dùng GUI)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Sao chép và cài dependencies Python
COPY requirements.txt .

# Thay opencv-python bằng opencv-python-headless nếu cần
RUN sed -i 's/opencv-python/opencv-python-headless/' requirements.txt

RUN pip install --no-cache-dir -r requirements.txt \
 && pip install "protobuf<4,>=3.20.0"

# Sao chép toàn bộ mã nguồn
COPY . .

# Tạo thư mục cần thiết
RUN mkdir -p uploads models

# Mở cổng 5000
EXPOSE 5000

# Lệnh chạy chính
CMD ["python", "main.py"]
