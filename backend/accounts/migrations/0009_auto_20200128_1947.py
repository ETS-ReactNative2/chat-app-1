# Generated by Django 2.1.1 on 2020-01-28 19:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_auto_20200128_1938'),
        ('accounts', '0008_auto_20200128_1938'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='chatrooms',
        ),
        migrations.AddField(
            model_name='user',
            name='chats',
            field=models.ManyToManyField(blank=True, to='main.Chat'),
        ),
    ]
