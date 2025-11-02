# 家計簿アプリケーション バックエンド

このプロジェクトは家計簿アプリケーションのバックエンドAPIサーバーです。FastAPI、SQLAlchemy、MySQLを使用して実装されています。

## 技術スタック

- Python 3.14
- FastAPI (Web フレームワーク)
- SQLAlchemy (ORM)
- MySQL (データベース)
- Alembic (マイグレーション)

## プロジェクト構造

```
server/
├── alembic/                    # DBマイグレーション
├── app/
│   ├── api/                    # APIエンドポイント
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── transaction.py  # 収支のエンドポイント
│   │   │   └── router.py
│   ├── core/                   # 設定やユーティリティ
│   │   ├── config.py          
│   │   └── database.py        
│   ├── models/                 # SQLAlchemyモデル
│   │   └── transaction.py
│   └── schemas/               # Pydanticモデル
│       └── transaction.py
├── tests/                     # テストコード
├── .env                       # 環境変数
└── requirements.txt           # 依存関係
```

## セットアップ手順

### 1. 環境構築

※ もしMicrosoft Visual C++ 14.0以上が必要というエラーが出た場合は、[Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)をインストールしてください。または、mysqlclientの代わりにpymysqlを使用することもできます。

```powershell
# 仮想環境の作成
python -m venv venv

# PowerShellの実行ポリシーを変更（初回のみ必要）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 仮想環境の有効化
.\venv\Scripts\Activate.ps1

# 依存パッケージのインストール
pip install -r requirements.txt
```

※ PowerShellの実行ポリシーの変更が必要な場合があります。詳細は[Microsoft公式ドキュメント](https://learn.microsoft.com/ja-jp/powershell/module/microsoft.powershell.core/about/about_execution_policies)を参照してください。

### 2. データベースのセットアップ（Dockerを使用）

```powershell
# MySQLコンテナの起動
docker compose up -d

# コンテナの状態確認
docker compose ps

# ログの確認
docker compose logs db
```

データベースには以下の認証情報でアクセスできます（MySQL Workbenchを使用）：
- ホスト: localhost
- ポート: 3306
- データベース: kakeibo_db
- ユーザー: user
- パスワード: pass

### 3. 環境変数の設定

`.env`ファイルを作成し、以下の内容を設定：

```env
DATABASE_URL=mysql://user:password@localhost:3306/kakeibo_db
```

※ user、password、localhost は環境に合わせて変更してください。

### 4. マイグレーション

#### 基本的な使い方

データベースの変更は以下の3ステップで行います：

1. モデル（`app/models/`内のファイル）を編集する
2. 変更を検知してマイグレーションファイルを作成：
```powershell
alembic revision --autogenerate -m "変更の説明"
```
3. 変更をデータベースに適用：
```powershell
alembic upgrade head
```

これはGitでいう「ファイルを編集 → commit → push」の流れに似ています。

#### 初回セットアップ

初めてプロジェクトを clone した後は、以下のコマンドを実行してデータベースを最新の状態にします：

```powershell
alembic upgrade head

## マイグレーションの管理

Alembicを使用してデータベースのスキーマ変更を管理します。

### マイグレーションの作成

モデル（`app/models/`内のファイル）を変更した後、以下のコマンドで新しいマイグレーションを作成します：

```powershell
# マイグレーションファイルを自動生成
alembic revision --autogenerate -m "変更の説明"
```

- `-m` オプションの後には、変更内容を簡潔に説明する文字列を入力します
- 生成されたマイグレーションファイルは `alembic/versions/` ディレクトリに保存されます

### マイグレーションの確認と適用

1. 生成されたマイグレーションファイルを確認：
   - `alembic/versions/` ディレクトリ内の最新の `.py` ファイルを開く
   - `upgrade()` 関数：変更を適用する際の処理
   - `downgrade()` 関数：変更を巻き戻す際の処理

2. マイグレーションの適用：
```powershell
# 最新バージョンまで適用
alembic upgrade head

# 1つ前のバージョンに戻す
alembic downgrade -1
```

### マイグレーションの履歴確認

```powershell
# 現在のリビジョンを確認
alembic current

# マイグレーション履歴を表示
alembic history --verbose
```

### トラブルシューティング

1. マイグレーションが失敗する場合：
   - エラーメッセージを確認
   - マイグレーションファイルの内容を確認
   - データベースの現在の状態を確認

2. 自動生成されたマイグレーションが期待通りでない場合：
   - モデルの変更が正しく検出されているか確認
   - 必要に応じてマイグレーションファイルを手動で編集

### 注意事項

- 本番環境でマイグレーションを適用する前に、必ずテスト環境で動作確認をしてください
- データベースのバックアップを取ることを推奨します
- 大きな変更は複数の小さなマイグレーションに分割することを検討してください
alembic init alembic

# マイグレーションファイルの作成
alembic revision --autogenerate -m "Initial migration"

# マイグレーションの実行
alembic upgrade head
```

### 5. サーバーの起動

```powershell
uvicorn main:app --reload
```

サーバーが起動したら、[http://localhost:8000/docs](http://localhost:8000/docs) でSwagger UIドキュメントを確認できます。

## 利用可能なAPI エンドポイント

### 取引（Transaction）

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/api/v1/transactions/` | 取引一覧の取得 |
| POST | `/api/v1/transactions/` | 新規取引の作成 |
| GET | `/api/v1/transactions/{transaction_id}` | 特定の取引の取得 |

## テスト

```powershell
pytest
```

## 開発ガイドライン

1. コードの変更を行う際は、必ずテストを作成してください。
2. APIのバージョニングを意識し、変更が互換性を破壊する場合は新しいバージョンを作成してください。
3. 環境変数は必ず`.env`ファイルで管理し、機密情報はリポジトリにコミットしないでください。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。