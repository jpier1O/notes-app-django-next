from django.db.models import Count, Q
from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticated

from .models import Category, Note
from .serializers import CategorySerializer, NoteSerializer


class NoteViewSet(viewsets.ModelViewSet):
    """Full CRUD for notes (data isolation)"""
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Note.objects.filter(user=self.request.user)
        # optional category filter via query param
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset

    def perform_create(self, serializer):
        # assign the authenticated user as note owner
        serializer.save(user=self.request.user)


class CategoryViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """Read-only list of categories with per-user note counts."""
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.annotate(
            note_count=Count('notes', filter=Q(notes__user=self.request.user))
        )
