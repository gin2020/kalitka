"""add updated_at to support_messages

Revision ID: b268650a08e7
Revises: 80a45592e888
Create Date: 2026-07-10 14:19:28.057282

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b268650a08e7'
down_revision: Union[str, Sequence[str], None] = '80a45592e888'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():

    op.add_column(

        "support_messages",

        sa.Column(

            "updated_at",

            sa.DateTime(timezone=True),

            nullable=False,

            server_default=sa.func.now(),

        ),

    )

def downgrade():
    op.drop_column(
        "support_messages",
        "updated_at",
    )
