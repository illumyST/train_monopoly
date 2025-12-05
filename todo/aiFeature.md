# Feature Spec: 站點旅遊卡片（擲骰後顯示站點簡介＋景點／美食選項）

## 背景與目標
- 玩家擲骰抵達新站點後，顯示「站點旅遊卡片」，提供：
  - 簡短介紹（歷史、特色）
  - 精選景點與美食店家選項（可點擊查看更多或收藏）
- 內容來源以 LLM 摘要與建議為主，避免過長、不當內容與未核實引用。

## 使用者流程（UX）
1. 玩家擲骰，移動至新站（現有 finalizeRoll 流程結束後）。
2. 在 CurrentStation 區塊下方顯示「站點旅遊卡片」：
   - 區塊 A：站名、2–3 句站點簡介（歷史、特色）。
   - 區塊 B：精選項目兩欄 Tab 或 Segmented control：
     - 景點（POI）：最多 3 個；名稱、一句話描述、距離或交通提示（若可用）。
     - 美食店家：最多 3 個；店名、招牌菜簡述、營業時間提示（若可用）。
   - 狀態：Loading skeleton、成功、失敗（可重試）。
3. 卡片提供操作：
   - 重新整理（重新請求，節流限制）。
   - 收藏（localStorage 保存，含景點或店家項目）。
   - 查看更多（可選，導向外部搜尋或後續擴充頁）。
4. 首次顯示後，內容緩存於 localStorage（routeId+stationCode 作為 key）。

## 範圍與不在範圍
- 在範圍：旅遊卡片 UI、前端 AI 客戶端、快取、重試、錯誤提示、最小審柵（提示詞包含安全要求）。
- 不在範圍：圖片生成、外部資料庫寫入、後端部署（先用前端 proxy 設計，後續可接入後端）。

## 技術設計
- 觸發點：App.tsx 的 finalizeRoll 或當 currentIndex 變更且 GameStatus === PLAYING。
- 組件：components/StationTravelCard.tsx（新檔）
- 服務：services/aiClient.ts（新檔，統一呼叫 LLM API）
- 快取：localStorage key: `ai.station.travel:<routeId>:<stationCode>`
- 型別：
  - StationTravelInfo {
    stationCode: string;
    stationName: string;
    summary: string; // 歷史、特色 80–120 字
    pois: Array<{ id: string; name: string; blurb: string; distanceHint?: string; source?: string }>;
    foods: Array<{ id: string; name: string; blurb: string; hoursHint?: string; source?: string }>;
    updatedAt: number;
    model: string;
  }
- 提示詞（Prompt）策略：
  - 系統指示：中立、簡短、事實為主；摘要 80–120 字；分別輸出最多 3 個景點與 3 個美食店家，皆以一句話描述，避免精確地址與敏感內容。
  - 上下文：站名、路線、縣市（若有）、語言：繁體中文；若資訊不足以生成可信內容，以「暫無資料」項目回退。
  - 輸出格式：JSON（summary, pois[], foods[]）。
- 節流與重試：
  - 每站首次請求後 24 小時內命中快取不再請求。
  - 重試最多 2 次（退避 500ms/1500ms）。
- 內容審柵：
  - 長度上限（summary <= 160字，blurb <= 40字），敏感詞剔除，空結果 fallback。
  - 不含精確地址／個資；若偵測不當或違規內容，顯示失敗狀態與重試。

## API 與金鑰
- 暫定使用後端 proxy 路由 /api/ai/station-travel（若尚未有後端，先用環境變數與前端 fetch 模擬）。
- 金鑰不直接置於前端；若暫時前端直呼，必加速率限制並在開發模式使用。
- env：
  - VITE_AI_ENDPOINT
  - VITE_AI_MODEL（預設：gemini-1.5-flash 或 gpt-4o-mini 類）
  - VITE_AI_API_KEY（開發用，勿提交版本控制）

## UI 規格
- StationTravelCard 版型：
  - Header：站名（中文 / 英文名若可用）＋ 收藏按鈕。
  - Body：
    - Summary：2–3 行文字，含歷史與特色。
    - Segments：
      - 景點（Icon: landmark）：最多 3 條 item（name + blurb + distanceHint）。
      - 美食（Icon: utensils）：最多 3 條 item（name + blurb + hoursHint）。
    - 「查看更多」連結（可選）。
  - Footer：模型名、更新時間、重新整理按鈕。
- Loading：骨架（summary 2 行 + list 3 條）。
- Error：簡短錯誤訊息＋重試按鈕。
- 可存取性：按鈕具 aria-label；Tab/Segment 支援鍵盤操作；卡片元素語意化。

## 錯誤處理
- 網路錯誤、API 429：顯示「暫時無法取得內容」，提供重試。
- 內容空白或低品質：回退為「暫無資料」，保留重試。
- 超時：10s 逾時，取消請求並顯示錯誤。

## 遙測與紀錄
- console.info：請求開始/結束、快取命中、重試次數。
- 可選：埋點（卡片顯示、收藏、查看更多）。

## 安全與合規
- 不顯示精確地址、私人資訊與可識別個人資料。
- 避免生成仇恨、暴力、成人內容；若檢測到，顯示安全提示並不展示。
- 內容為模型生成，加入免責聲明。

## 測試案例（驗收標準）
- 抵達新站顯示 Loading，成功後呈現 summary、景點與美食清單。
- 連續抵達同站時命中快取，不重呼 API。
- API 返回錯誤時顯示錯誤狀態並可重試。
- 重試按鈕在 429/超時後有效。
- 收藏後能在後續會話中讀取（localStorage）。
- 內容長度、條數符合規範，未出現不當詞與精確地址。
- 當無站名或資料不足時顯示「暫無資料」。

## 實作任務拆解
1. 建立 services/aiClient.ts：封裝 fetch、提示詞、節流與重試；解析 JSON 輸出（summary/pois/foods）。
2. 建立 components/StationTravelCard.tsx：UI、狀態管理（loading/error/data）、Segment 切換、收藏。
3. 在 App.tsx 或 CurrentStation.tsx 引入卡片，傳入站點資料（stationCode, stationName, routeId）。
4. 新增 localStorage 快取工具（utils/storage.ts），含收藏清單結構；key 前綴 `ai.station.travel.*`。
5. 新增環境變數讀取與開發預設；加上最小速率限制與逾時處理。
6. 單元測試：aiClient 快取/重試/審柵；StationTravelCard 三態呈現與收藏互動。
7. 文件與免責說明：卡片 footer 與 README 增補。

## 後續延伸
- 圖片或地標生成（需後端代理）。
- 多語系切換與使用者語言自動判斷。
- 離線預載熱門站點旅遊資訊；與外部開放資料（交通、觀光）整合。
