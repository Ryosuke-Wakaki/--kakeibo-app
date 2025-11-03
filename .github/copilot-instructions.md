# Kakeibo App - AI コーディングエージェント向け指示書

## プロジェクト概要
家計簿（Kakeibo）アプリケーション - 収支管理のためのフルスタックWebアプリ。学習用プロジェクト。

**技術スタック**: FastAPI (Python 3.14) + React (TypeScript) + MySQL 8.0 + Docker

## 前提条件

- 回答は必ず日本語でしてください。
- 何か大きい変更を加える場合、まず何をするのか計画を立てた上で、ユーザーに「このような計画で進めようと思います。」と提案してください。この時、ユーザーから計画の修正を求められた場合は計画を修正して、再提案をしてください。
- 修正は必要最低限にしてください。（例: コードの一部を変更する場合は、その部分だけを修正）
- 分かりやすく簡潔なコメント文を付けるようにしてください。

## アーキテクチャとデータフロー

### モノレポ構造
```
kakeibo-app/
├── client/          # React + Vite フロントエンド (ポート 5173)
├── server/          # FastAPI バックエンド (ポート 8000)
├── docker-compose.yml  # MySQL コンテナ
└── 区分値一覧.md   # マスターデータ参照（カテゴリー、支払い方法、取引種別）
```

### 主要なデータフロー
1. **アプリ起動時**: `MasterDataContext` が `useContext` パターンでカテゴリー/支払い方法を一度だけ取得
2. **月次ビュー**: Calendar コンポーネントが `getTransactionsByMonth` API を呼び出し、SQLAlchemy の `extract('year')`, `extract('month')` でフィルタリング
3. **日付フォーマット変換**: UI では `yyyy/MM/dd`、DB では `yyyy-MM-dd` を使用。必ず `formatDateToDbFormat()` ユーティリティを使う

### 重要なドメインルール
- **取引種別**: `'01'` = 収入 (income), `'02'` = 支出 (expense) - CHAR(2) 固定長
- **コード値**: すべてのマスターデータコードは2桁のゼロ埋め文字列 (`'01'`, `'02'`)
- **金額の型**: DB では `NUMERIC(10, 2)`、TypeScript では `Number()` で変換
- **マスターデータ**: カテゴリー/支払い方法には `is_active` フラグ（論理削除用）と `display_order`（表示順）がある

### 新しいエンドポイントの追加手順
1. `server/app/api/v1/endpoints/` にエンドポイントを作成
2. `server/app/api/v1/router.py` にルーターを登録（tags 付き）
3. **重要**: ルートには必ず末尾スラッシュを付ける（`/categories/`）- 307 リダイレクトを回避
4. `client/src/shared/api/` に対応する API クライアントメソッドを追加

## プロジェクト固有の規約

### フロントエンドアーキテクチャ
- **ビジネスロジックの分離**: 計算処理は `utils/` ファイルに抽出（例: `transactionUtils.ts`）
- **型定義の分割**: `features/*/types/props.ts`（UI props）と `shared/types/models.ts`（API/DB モデル）に分ける
- **Context パターン**: グローバルな状態（マスターデータなど）は React Context を使用、props のバケツリレーはしない

### コード構成パターン
```typescript
// 機能の構造例: client/src/features/home/
home/
├── Home.tsx              # 状態を管理するコンテナコンポーネント
├── components/           # 機能固有のコンポーネント
│   ├── Calendar.tsx
│   └── TransactionFormModal.tsx
├── types/
│   └── props.ts         # UI コンポーネントの props のみ
└── utils/
    ├── transactionUtils.ts      # 純粋なビジネスロジック関数
    └── __tests__/
        └── transactionUtils.test.ts
```

### API 通信
- **ベース URL**: `http://localhost:8000/api/v1`（`ApiClient.ts` にハードコード）
- **CORS**: `main.py` で `http://localhost:5173` を許可するよう設定
- **日付フィルタリング**: 月のフォーマットは `YYYY/MM`（例: `?month=2025/11`）
- **型インポート**: 型のみのインポートには `import type` を使用（`verbatimModuleSyntax` が有効なため）

### テスト方針
- **ユニットテスト**: `utils/` ディレクトリの純粋関数を Jest でテスト
- **モックデータ構造**: DB スキーマに完全に一致させる（`transactionUtils.test.ts` を参照）
- **テスト可能性の目標**: ビジネスロジックを `.tsx` ファイルに書かない

## よくある落とし穴と解決策

### 日付の扱い
❌ **誤り**: フォーマット変換なしで直接日付比較
```typescript
transactions.filter(t => t.date === selectedDate) // フォーマットが異なると失敗
```
✅ **正しい**: ユーティリティ関数を使用
```typescript
const formattedDate = formatDateToDbFormat(selectedDate);
transactions.filter(t => t.date === formattedDate)
```

### カレンダー統合（FullCalendar）
- 月変更時の `datesSet` コールバックでは `info.view.currentStart` を使用（`info.start` ではない）
- 無限ループを防ぐ: API 呼び出し前に月が変更されたかチェック
- イベント色: 残高が正の場合は緑、負の場合は赤（`Calendar.tsx` を参照）

### マスターデータ管理
- コンポーネント内でカテゴリー/支払い方法の ID や名前を**絶対にハードコードしない**
- `useMasterData()` フックを使用して動的に読み込まれたデータにアクセス
- マスターデータ読み込み後にのみフォーム初期値を設定（`length > 0` をチェック）

### バックエンドスキーマ変更
1. `app/models/transaction.py` でモデルを修正
2. `app/schemas/transaction.py` で Pydantic スキーマを更新
3. マイグレーション生成: `alembic revision --autogenerate`
4. 生成されたマイグレーションを適用前に確認
5. `shared/types/models.ts` でフロントエンドの型を更新

## 外部依存関係

### 主要ライブラリ
- **フロントエンド**: FullCalendar（カレンダー UI）、Material-UI（コンポーネント）、React Router（ナビゲーション）
- **バックエンド**: SQLAlchemy（ORM）、Alembic（マイグレーション）、Pydantic（バリデーション）
- **データベース**: MySQL 8.0（Docker 経由）、PyMySQL ドライバー

### 環境設定
- バックエンドの `.env` は `server/` ディレクトリ（DB 認証情報、詳細は `server/README.md`）
- フロントエンドの `.env` は不要（API URL はハードコード）

## 参照ファイル
- **マスターデータ仕様**: `/区分値一覧.md` - すべてのコード値とスキーマの唯一の情報源
