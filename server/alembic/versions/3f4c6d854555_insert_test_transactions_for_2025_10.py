"""insert test transactions for 2025-10

Revision ID: 3f4c6d854555
Revises: 14cf51537d72
Create Date: 2025-11-03 13:19:54.762010

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3f4c6d854555'
down_revision: Union[str, Sequence[str], None] = '14cf51537d72'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # 2025年10月のテストデータを挿入
    op.bulk_insert(
        sa.table('transactions',
            sa.column('date', sa.Date),
            sa.column('transaction_type', sa.String),
            sa.column('category_id', sa.Integer),
            sa.column('amount', sa.Numeric),
            sa.column('payment_method_id', sa.Integer),
            sa.column('description', sa.String),
            sa.column('tags', sa.String)
        ),
        [
            # 10月1日
            {
                'date': '2025-10-01',
                'transaction_type': '01',
                'category_id': 3,  # 給与
                'amount': 300000,
                'payment_method_id': None,
                'description': '10月給与',
                'tags': '給与,収入'
            },
            # 10月3日
            {
                'date': '2025-10-03',
                'transaction_type': '02',
                'category_id': 1,  # 食費
                'amount': 3500,
                'payment_method_id': 1,  # 現金
                'description': 'スーパーで買い物',
                'tags': '食費,日用品'
            },
            # 10月5日
            {
                'date': '2025-10-05',
                'transaction_type': '02',
                'category_id': 2,  # 交通費
                'amount': 1200,
                'payment_method_id': 2,  # クレジットカード
                'description': '電車代',
                'tags': '交通費'
            },
            # 10月7日
            {
                'date': '2025-10-07',
                'transaction_type': '02',
                'category_id': 1,  # 食費
                'amount': 5800,
                'payment_method_id': 2,  # クレジットカード
                'description': 'ランチ・ディナー',
                'tags': '食費,外食'
            },
            # 10月10日
            {
                'date': '2025-10-10',
                'transaction_type': '02',
                'category_id': 1,  # 食費
                'amount': 4200,
                'payment_method_id': 1,  # 現金
                'description': 'コンビニ',
                'tags': '食費'
            },
            # 10月12日
            {
                'date': '2025-10-12',
                'transaction_type': '02',
                'category_id': 2,  # 交通費
                'amount': 2400,
                'payment_method_id': 2,  # クレジットカード
                'description': 'タクシー代',
                'tags': '交通費'
            },
            # 10月15日
            {
                'date': '2025-10-15',
                'transaction_type': '02',
                'category_id': 1,  # 食費
                'amount': 8900,
                'payment_method_id': 2,  # クレジットカード
                'description': '週末の外食',
                'tags': '食費,外食'
            },
            # 10月20日
            {
                'date': '2025-10-20',
                'transaction_type': '02',
                'category_id': 1,  # 食費
                'amount': 6500,
                'payment_method_id': 1,  # 現金
                'description': 'スーパーで買い物',
                'tags': '食費,日用品'
            },
            # 10月25日
            {
                'date': '2025-10-25',
                'transaction_type': '01',
                'category_id': 3,  # 給与（副収入など）
                'amount': 50000,
                'payment_method_id': None,
                'description': 'ボーナス',
                'tags': '収入,ボーナス'
            },
            # 10月28日
            {
                'date': '2025-10-28',
                'transaction_type': '02',
                'category_id': 2,  # 交通費
                'amount': 3000,
                'payment_method_id': 2,  # クレジットカード
                'description': 'ガソリン代',
                'tags': '交通費'
            }
        ]
    )


def downgrade() -> None:
    """Downgrade schema."""
    # テストデータを削除
    op.execute("DELETE FROM transactions WHERE date >= '2025-10-01' AND date < '2025-11-01'")
