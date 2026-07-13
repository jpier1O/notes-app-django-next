from django.db import migrations


def seed_categories(apps, schema_editor):
    Category = apps.get_model('notes', 'Category')
    categories = [
        {'name': 'Random Thoughts', 'color': '#EF9C66'},
        {'name': 'Personal', 'color': '#78ABA8'},
        {'name': 'School', 'color': '#FCDC94'},
        {'name': 'Drama', 'color': '#C8CFA0'},
    ]
    for cat in categories:
        Category.objects.get_or_create(name=cat['name'], defaults={'color': cat['color']})


def reverse_seed(apps, schema_editor):
    Category = apps.get_model('notes', 'Category')
    Category.objects.filter(name__in=['Random Thoughts', 'Personal', 'School', 'Drama']).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_categories, reverse_seed),
    ]
