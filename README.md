# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

# HCMUTE-DSC

## Hướng dẫn triển khai với Docker

### Yêu cầu

- Docker và Docker Compose cài đặt trên máy chủ
- Domain đã trỏ về IP của máy chủ (dsc.fit.hcmute.edu.vn)
- Port 80 và 443 mở trên firewall

### Chuẩn bị

1. Chỉnh sửa thông tin email trong file Dockerfile và docker-compose.yml:
   - Thay `your-email@example.com` bằng email thực của bạn

### Triển khai

1. Build và khởi chạy các container:
   ```bash
   docker-compose up -d
   ```

2. Kiểm tra trạng thái các container:
   ```bash
   docker-compose ps
   ```

3. Xem logs của các container:
   ```bash
   docker-compose logs -f
   ```

### Cấu trúc

- **app**: Container chính chứa ứng dụng frontend đã được build
- **nginx-proxy**: Proxy ngược tự động cấu hình dựa trên các container có biến môi trường VIRTUAL_HOST
- **acme-companion**: Tự động tạo và gia hạn chứng chỉ SSL bằng Let's Encrypt

### Thông tin khác

- Backend API: https://apidsc.andyanh.id.vn
- Frontend: https://dsc.fit.hcmute.edu.vn

### Xử lý sự cố

- Kiểm tra logs:
  ```bash
  docker-compose logs -f app
  docker-compose logs -f nginx-proxy
  docker-compose logs -f acme-companion
  ```

- Khởi động lại các container:
  ```bash
  docker-compose restart
  ```

- Xây dựng lại khi có cập nhật:
  ```bash
  docker-compose build --no-cache
  docker-compose up -d
  ```
