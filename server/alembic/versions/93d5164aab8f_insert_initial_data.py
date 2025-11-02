"""insert initial data

Revision ID: 93d5164aab8f
Revises: 3d78a804bfac
Create Date: 2025-11-02 15:07:28.577929

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '93d5164aab8f'
down_revision: Union[str, Sequence[str], None] = '3d78a804bfac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # カテゴリーの初期データ
    op.bulk_insert(
        sa.table('categories',
            sa.column('code', sa.String),
            sa.column('name', sa.String),
            sa.column('description', sa.String),
            sa.column('display_order', sa.Integer),
            sa.column('is_active', sa.Boolean)
        ),
        [
            {
                'code': '01',
                'name': '食費',
                'description': '食料品、外食など',
                'display_order': 1,
                'is_active': True
            },
            {
                'code': '02',
                'name': '交通費',
                'description': '電車、バス、タクシーなど',
                'display_order': 2,
                'is_active': True
            },
            {
                'code': '03',
                'name': '給与',
                'description': '月給、ボーナスなど',
                'display_order': 3,
                'is_active': True
            }
        ]
    )

    # 支払い方法の初期データ
    op.bulk_insert(
        sa.table('payment_methods',
            sa.column('code', sa.String),
            sa.column('name', sa.String),
            sa.column('description', sa.String),
            sa.column('display_order', sa.Integer),
            sa.column('is_active', sa.Boolean)
        ),
        [
            {
                'code': '01',
                'name': '現金',
                'description': '現金での支払い',
                'display_order': 1,
                'is_active': True
            },
            {
                'code': '02',
                'name': 'クレジットカード',
                'description': 'クレジットカードでの支払い',
                'display_order': 2,
                'is_active': True
            }
        ]
    )


def downgrade() -> None:
    op.execute('DELETE FROM payment_methods')
    op.execute('DELETE FROM categories')
