FROM nginx:alpine

# Nginx의 기본 HTML 디렉토리 정의
WORKDIR /usr/share/nginx/html

# public 폴더의 내용을 컨테이너의 /usr/share/nginx/html로 복사
COPY public/ .

# 포트 80 열기
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]