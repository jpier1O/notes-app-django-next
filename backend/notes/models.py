from django.db import models
from django.conf import settings


class Category(models.Model):
    """Color-coded category for organizing notes."""
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=7)  # Hex color e.g. "#F5A882"

    class Meta:
        verbose_name_plural = "categories"
        ordering = ['id']

    def __str__(self):
        return self.name


class Note(models.Model):
    """A user's note with title, body, and category."""
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    title = models.CharField(max_length=100, blank=True, default='')
    body = models.TextField(max_length=5000, blank=True, default='')
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_DEFAULT,
        default=1,
        related_name='notes'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.title or f"Note {self.id}"
