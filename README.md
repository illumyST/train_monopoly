<div align="center">
<img width="100%" alt="Train Monopoly Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Train Monopoly (Vite + React)

火車大富翁前端（Vite 版本）。支援本地開發與 GitHub Pages 部署，並提供站點切片、擲骰與自訂步數、歷史紀錄持久化等功能。

## 技術棧

- Vite + React + TypeScript
- LocalStorage 歷史紀錄
- 動態載入車站資料（`public/data/stations.json`）

## 本地開發

**需求：** Node.js 18+（建議 20+）

```sh
yarn          # 安裝依賴（或 npm install）
yarn dev      # 啟動開發伺服器
yarn build    # 建置產出 dist/
yarn preview  # 預覽建置結果
```

環境變數（選用 Gemini API）：建立 `.env.local`

```env
GEMINI_API_KEY=你的key
```

## 車站資料來源

將完整台鐵站點 JSON 放到：`public/data/stations.json`。
`useStationData` 會載入並保留原始逆時針順序，不重新排序。

## 功能摘要

- 選擇起站 / 終站，切片出路線
- 擲骰（1–6）與自訂步數（任意正整數，如 13、16）
- 越界停在終站（不超出陣列）
- 造訪歷史寫入 LocalStorage（重新整理不消失）
- Timeline 高亮目前站與下一站

## GitHub Pages 部署

### 1. Base Path

`vite.config.ts` 已設定：

```ts
base: "/train_monopoly/";
```

對應網址：`https://illumyST.github.io/train_monopoly/`

### 2. GitHub Actions 自動部署

已新增 `.github/workflows/deploy-pages.yml`：

1. push 到 `main`
2. 安裝依賴並執行 `yarn build`
3. 上傳 dist artifact
4. 部署到 Pages

啟用：Settings → Pages → Source 選 "GitHub Actions"。

首次推送：

```sh
git add .
git commit -m "chore: setup github pages"
git push origin main
```

### 3. 手動部署（選擇性）

yarn add -D gh-pages

```sh
# 安裝 gh-pages
pnpm add -D gh-pages
```

`package.json` scripts 加入：

```jsonc
"predeploy": "pnpm build",
"deploy": "gh-pages -d dist"
```

執行：

```sh
pnpm deploy
```

### 4. 常見問題

```sh
pnpm deploy
```

- 404：`base` 未設或與倉庫名稱不同
- 靜態資源載入錯：使用相對路徑或 `import`，避免硬編碼根 `/`
- API 金鑰：Pages 為靜態；敏感資訊不可放前端

### 5. 驗證部署

完成後瀏覽：`https://illumyST.github.io/train_monopoly/` 應載入正確資源。

## 待辦 / 改進

- 方向模式切換（支援順時針）
- Framer Motion 動畫強化
- Vitest + React Testing Library 測試
- CSV 自動解析更新站點

## 授權

未提供 LICENSE，視為私人開發用途；如需公開授權請新增 LICENSE。
