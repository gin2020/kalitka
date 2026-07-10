"""add telegram message id

Revision ID: 4dd00f0e6986
Revises: b268650a08e7
Create Date: 2026-07-10 17:02:00.335412

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4dd00f0e6986'
down_revision: Union[str, Sequence[str], None] = 'b268650a08e7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.add_column(

        "support_messages",

        sa.Column(

            "telegram_message_id",

            sa.BigInteger(),

            nullable=True,

        ),

    )

def downgrade() -> None:

    op.drop_column(

        "support_messages",

        "telegram_message_id",

    )
