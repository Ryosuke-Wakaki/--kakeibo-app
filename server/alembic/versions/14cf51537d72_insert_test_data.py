"""insert test data

Revision ID: 14cf51537d72
Revises: 4fe7fb9b8fe0
Create Date: 2025-11-02 15:25:13.915632

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '14cf51537d72'
down_revision: Union[str, Sequence[str], None] = '4fe7fb9b8fe0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
