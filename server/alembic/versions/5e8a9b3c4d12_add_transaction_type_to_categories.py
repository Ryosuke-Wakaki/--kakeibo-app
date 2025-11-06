"""add transaction_type to categories

Revision ID: 5e8a9b3c4d12
Revises: 4fe7fb9b8fe0
Create Date: 2025-11-06 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5e8a9b3c4d12'
down_revision: Union[str, Sequence[str], None] = '3f4c6d854555'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # カラムが既に存在するか確認してから追加
    from sqlalchemy import inspect
    from alembic import context
    
    conn = context.get_bind()
    inspector = inspect(conn)
    columns = [col['name'] for col in inspector.get_columns('categories')]
    
    if 'transaction_type' not in columns:
        # カテゴリーテーブルにtransaction_typeカラムを追加
        op.add_column('categories', sa.Column('transaction_type', sa.CHAR(length=2), nullable=True))
        
        # 既存データを更新（食費と交通費は支出、給与は収入）
        op.execute("UPDATE categories SET transaction_type = '02' WHERE name IN ('食費', '交通費')")
        op.execute("UPDATE categories SET transaction_type = '01' WHERE name = '給与'")
        
        # MySQLではカラムのNULL制約変更時に型を指定する必要がある
        op.execute("ALTER TABLE categories MODIFY COLUMN transaction_type CHAR(2) NOT NULL")
    else:
        # 既に存在する場合は既存データを更新するだけ
        op.execute("UPDATE categories SET transaction_type = '02' WHERE name IN ('食費', '交通費') AND (transaction_type IS NULL OR transaction_type = '')")
        op.execute("UPDATE categories SET transaction_type = '01' WHERE name = '給与' AND (transaction_type IS NULL OR transaction_type = '')")


def downgrade() -> None:
    """Downgrade schema."""
    # カラムを削除
    op.drop_column('categories', 'transaction_type')
