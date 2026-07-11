"""add support attachments and status

Revision ID: 9c8b2f4a1d2e
Revises: 4dd00f0e6986
Create Date: 2026-07-11 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9c8b2f4a1d2e"
down_revision: Union[str, Sequence[str], None] = "4dd00f0e6986"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "support_messages",
        sa.Column(
            "message_type",
            sa.String(length=16),
            nullable=False,
            server_default="text",
        ),
    )
    op.add_column(
        "support_messages",
        sa.Column(
            "image_path",
            sa.String(length=512),
            nullable=True,
        ),
    )
    op.add_column(
        "support_messages",
        sa.Column(
            "status",
            sa.String(length=16),
            nullable=False,
            server_default="sent",
        ),
    )


def downgrade() -> None:
    op.drop_column("support_messages", "status")
    op.drop_column("support_messages", "image_path")
    op.drop_column("support_messages", "message_type")
