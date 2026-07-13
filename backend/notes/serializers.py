from rest_framework import serializers

from .models import Category, Note


class CategorySerializer(serializers.ModelSerializer):
    """Serializes category with dynamic note_count (annotated in view)."""
    note_count = serializers.IntegerField(read_only=True, default=0)

    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'note_count']


class NoteSerializer(serializers.ModelSerializer):
    """
    Note serializer with nested category on read, category_id on write.
    Supports partial updates (PATCH) for auto-save functionality.
    """
    category = CategorySerializer(read_only=True)
    # Accept category_id for create/update, maps to category FK
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False
    )

    class Meta:
        model = Note
        fields = ['id', 'title', 'body', 'category', 'category_id', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
