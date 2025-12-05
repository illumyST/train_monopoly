# 專案背景

## 目的
互動式台灣鐵道「大富翁」風格的行程規劃／遊戲。使用者可以探索站點、擲骰移動，並查看每個站點的精選旅遊資訊（摘要、景點、餐飲），由 AI 助理生成。資料以快取維持 24 小時新鮮度；目標是輕量、快速的旅遊靈感與休閒玩法。

## 技術棧
- TypeScript 5.8、ES modules
- React 19（函式型元件、Hooks）
- Vite 6（打包與開發伺服器）
- pnpm 9（套件管理）
- 部署：`gh-pages` 至 GitHub Pages
- 圖示：`lucide-react`
- AI：`@google/genai` Gemini 模型（可走代理或直接客戶端）
- 環境變數：VITE_*（`VITE_AI_ENDPOINT`、`VITE_AI_MODEL`、`VITE_AI_API_KEY`／`VITE_GEMINI_API_KEY`）

## 專案慣例

### 程式碼風格
- 使用 TypeScript；前端程式盡量型別嚴謹
- 元件：`components/` 內以 PascalCase（例：`CurrentStation.tsx`）
- Hooks：`hooks/` 內以 `use` 前綴 camelCase（例：`useStationData.ts`）
- 服務：`services/` 模組以小寫或 camelCase（例：`aiClient.ts`）
- 工具：`utils/` 放小而專注的輔助（例：`storage.ts`）
- 檔案：視圖／元件用 `.tsx`，邏輯／型別用 `.ts`
- 匯入：相對路徑；未特別設定時避免深層別名
- 使用者可見文字需先清理與裁切長度

### 架構模式
- UI：React 函式型元件，以 props 驅動渲染
- 狀態：以本地元件狀態與 Hooks 派生資料為主
- 資料：透過 `useStationData` 與 `types.ts` 提供站點資料
- AI 整合：`services/aiClient.ts` 取得／生成站點旅遊資訊
	- 優先呼叫代理 `VITE_AI_ENDPOINT`；失敗則回退到 Google GenAI 直接呼叫
	- 在使用前統一格式並進行文字安全清理
	- 以 localStorage 快取，TTL 24 小時
- 持久化：`utils/storage.ts` 封裝 localStorage 作為快取層
- 設定：以 Vite 的 `import.meta.env` 讀取執行期環境
- 建置／服務：`package.json` 內 Vite scripts

### 測試策略
- 目前：倉庫尚未建立正式測試
- 建議：加入 Vitest + React Testing Library 實作單元／元件測試
- 重點：文字清理工具、AI 輸出正規化、元件 props 行為
- 端對端：頁面穩定後可加 Playwright 煙霧測試（選用）

### Git 流程
- 分支：自 `main` 切出功能分支（如 `feat/llm`）
- 提交：簡潔、現在式、含範圍（scope: subject）
- PR：小而聚焦；必要時連結規格變更
- 發佈：以 `gh-pages` 部署建置成果

## 領域背景
- 台灣鐵路站點與路線；站點物件包含代碼、中文名與可選英文名。
- 遊戲：以擲骰決定移動步數至下一站；時間軸與歷史由 UI 呈現。
- 內容：每站顯示繁體中文（zh-TW）的旅遊摘要、景點與餐飲；避免不可驗證斷言。

## 重要限制
- 安全：過濾敏感與不安全內容（暴力／成人／仇恨等）
- 隱私：不含個資或精確地址
- 長度：摘要約 80–120 字；項目簡述不超過 40 字
- 效能：AI 回應快取 24 小時；清單每類最多 3 筆
- 可用性：缺少 API key 或端點時需優雅回退；AI 返回 null 時 UI 不崩潰

## 外部相依
- Google GenAI（Gemini 模型）透過 `@google/genai`
- 選用代理 `VITE_AI_ENDPOINT` 提供 `/api/ai/station-travel`
- GitHub Pages 作為靜態託管

