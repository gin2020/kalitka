"""change traffic columns to bigint

Revision ID: 262bb5ea80c0
Revises: 0b7bb1de7b63
Create Date: 2026-07-10 12:17:15.479791
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "262bb5ea80c0"
down_revision: Union[str, Sequence[str], None] = "0b7bb1de7b63"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.alter_column(
        "subscriptions",
        "traffic_limit",
        existing_type=sa.Integer(),
        type_=sa.BigInteger(),
        existing_nullable=False,
    )

    op.alter_column(
        "subscriptions",
        "traffic_used",
        existing_type=sa.Integer(),
        type_=sa.BigInteger(),
        existing_nullable=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.alter_column(
        "subscriptions",
        "traffic_limit",
        existing_type=sa.BigInteger(),
        type_=sa.Integer(),
        existing_nullable=False,
    )

    op.alter_column(
        "subscriptions",
        "traffic_used",
        existing_type=sa.BigInteger(),
        type_=sa.Integer(),
        existing_nullable=False,
    )
