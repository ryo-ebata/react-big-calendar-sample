# Googleカレンダー連携アプリ

React + TypeScript + Ant Designで構築されたGoogleカレンダー連携アプリです。

## 機能

- ✅ 週表示メインのカレンダービュー（月・日表示も対応）
- ✅ Googleカレンダーとの連携（OAuth認証）
- ✅ 予定の表示・作成・編集・削除（CRUD操作）
- ✅ ドラッグ&ドロップでの予定移動・リサイズ
- ✅ 時間範囲選択での新規予定作成
- ✅ 予定詳細情報の管理（タイトル、場所、時間、説明、参加者）
- ✅ 日本語ローカライゼーション
- ✅ レスポンシブデザイン

## セットアップ

### 1. Google Cloud Console設定

1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成または既存のプロジェクトを選択
3. Google Calendar APIを有効化
4. 認証情報を作成（OAuth 2.0クライアントID）
5. 承認済みのJavaScriptオリジンに `http://localhost:5173` を追加

### 2. 環境変数設定

`.env.example`を`.env`にコピーして、Google APIの認証情報を設定：

```bash
cp .env.example .env
```

`.env`ファイルを編集：

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_API_KEY=your_google_api_key_here
VITE_GOOGLE_DISCOVERY_DOC=https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest
VITE_GOOGLE_SCOPES=https://www.googleapis.com/auth/calendar
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. 開発サーバー起動

```bash
npm run dev
```

## 使用技術

- **フロントエンド**: React 18 + TypeScript
- **UIライブラリ**: Ant Design
- **カレンダーライブラリ**: react-big-calendar
- **日付ライブラリ**: dayjs + moment
- **スタイリング**: Tailwind CSS
- **ビルドツール**: Vite
- **Google API**: Google Calendar API v3

## プロジェクト構造

```
src/
├── components/          # UIコンポーネント
│   ├── CalendarHeader.tsx   # ヘッダーコンポーネント
│   ├── CalendarView.tsx     # メインカレンダービュー
│   └── EventModal.tsx       # イベント編集モーダル
├── hooks/              # カスタムフック
│   └── useGoogleCalendar.ts # Google Calendar API連携
├── types/              # 型定義
│   └── calendar.ts         # カレンダー関連の型
├── App.tsx             # メインアプリケーション
├── main.tsx           # エントリーポイント
└── index.css          # グローバルスタイル
```

## 主な機能の使い方

### 1. Googleアカウント連携
- 右上の「Googleでサインイン」ボタンをクリック
- Googleアカウントでログインし、カレンダーアクセスを許可

### 2. 予定の表示
- サインイン後、自動的にGoogleカレンダーの予定が表示されます
- 週・月・日表示を切り替え可能

### 3. 新規予定作成
- カレンダー上の空いている時間をクリック・ドラッグして選択
- 表示されるモーダルで予定詳細を入力

### 4. 予定の編集・削除
- 既存の予定をクリックして編集モーダルを開く
- 詳細を編集または削除が可能

### 5. 予定の移動・リサイズ
- 予定をドラッグして別の時間に移動
- 予定の端をドラッグして時間を調整

## 注意事項

- Google Calendar APIの利用には認証が必要です
- 本番環境では適切なドメインを承認済みオリジンに追加してください
- APIクォータ制限にご注意ください