最想做的
1. 顯示每一站在哪個縣市
2. 每一站可新增文字紀錄，匯出 notion


1. 站點紀錄功能
   - 每一站可新增文字紀錄（如遇到的趣事、心得）
   - 支援上傳照片（需考慮檔案大小、格式、資安驗證）
   - 匯出紀錄至 Notion、Google Docs（API 權限、格式轉換）
   - 編輯、刪除紀錄功能
   - 前端資料暫存與同步策略（是否還儲存於 localStorage）

2. 串接 OAuth（Google 登入）
   - 前端導入 Google OAuth 流程
   - 處理登入狀態、登出、token 安全儲存
   - 用戶資料最小化取得（僅 email、名稱）
   - 資安建議：避免將敏感 token 存於 localStorage

3. 後端服務規劃
   - 評估是否需自建 API（如：用戶資料、照片儲存、紀錄同步）
   - 後端技術選型（Node.js/Express、Firebase、Supabase 等）
   - 資料庫設計（紀錄、用戶、照片）
   - API 權限控管、驗證（JWT/OAuth）
   - 檔案上傳安全（型態驗證、大小限制、XSS 避免）

4. UI/UX 優化
   - 動畫與過場效果（如 Framer Motion）
   - 無障礙設計（a11y）
   - 多語系支援

5. 資安與隱私
   - 前端/後端資料驗證與清洗
   - 防止 XSS、CSRF、檔案注入等攻擊
   - 使用 HTTPS、CSP、SRI 等安全標頭
   - 用戶資料隱私政策與同意機制

6. 測試與部署
   - 單元測試、E2E 測試（Vitest、React Testing Library、Cypress）
   - CI/CD 自動化部署（GitHub Actions）
   - 依賴套件安全性檢查（npm audit、Snyk）

7. 其他功能建議
   - 站點地圖視覺化
   - 旅程分享（社群、連結）
   - 進階統計（造訪次數、最愛站點）
   - 顯示每一站在哪個縣市
