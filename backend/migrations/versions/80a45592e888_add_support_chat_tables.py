"""add support chat tables

Revision ID: 80a45592e888
Revises: 262bb5ea80c0
Create Date: 2026-07-10 13:04:38.522137

"""
from typing import Sequence, Union

from alembic import op

import sqlalchemy as sa

from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.

revision: str = "80a45592e888"

down_revision: Union[str, Sequence[str], None] = "262bb5ea80c0"

branch_labels = None

depends_on = None

def upgrade() -> None:

    op.create_table(

        "support_conversations",

        sa.Column(

            "id",

            postgresql.UUID(as_uuid=True),

            nullable=False,

        ),

        sa.Column(

            "subscription_id",

            postgresql.UUID(as_uuid=True),

            nullable=False,

        ),

        sa.Column(

            "status",

            sa.String(length=32),

            nullable=False,

            server_default="open",

        ),

        sa.Column(

            "created_at",

            sa.DateTime(timezone=True),

            nullable=False,

        ),

        sa.Column(

            "updated_at",

            sa.DateTime(timezone=True),

            nullable=False,

        ),

        sa.ForeignKeyConstraint(

            ["subscription_id"],

            ["subscriptions.id"],

            ondelete="CASCADE",

        ),

        sa.PrimaryKeyConstraint("id"),

        sa.UniqueConstraint(

            "subscription_id",

            name="uq_support_conversation_subscription",

        ),

    )

    op.create_table(

        "support_messages",

        sa.Column(

            "id",

            postgresql.UUID(as_uuid=True),

            nullable=False,

        ),

        sa.Column(

            "conversation_id",

            postgresql.UUID(as_uuid=True),

            nullable=False,

        ),

        sa.Column(

            "sender",

            sa.String(length=16),

            nullable=False,

        ),

        sa.Column(

            "text",

            sa.Text(),

            nullable=False,

        ),

        sa.Column(

            "created_at",

            sa.DateTime(timezone=True),

            nullable=False,

        ),

        sa.ForeignKeyConstraint(

            ["conversation_id"],

            ["support_conversations.id"],

            ondelete="CASCADE",

        ),

        sa.PrimaryKeyConstraint("id"),

    )

    op.create_index(

        "ix_support_messages_conversation",

        "support_messages",

        ["conversation_id"],

    )

def downgrade() -> None:

    op.drop_index(

        "ix_support_messages_conversation",

        table_name="support_messages",

    )

    op.drop_table("support_messages")

    op.drop_table("support_conversations")
