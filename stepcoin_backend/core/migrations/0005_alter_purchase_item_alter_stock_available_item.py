# Generated by Django 4.2.3 on 2023-07-21 03:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0004_alter_purchase_item_alter_stock_available_item"),
    ]

    operations = [
        migrations.AlterField(
            model_name="purchase",
            name="item",
            field=models.CharField(
                choices=[
                    ("Mango", "Mango"),
                    ("Banana", "Banana"),
                    ("Apple", "Apple"),
                    ("Orange", "Orange"),
                ],
                max_length=10,
            ),
        ),
        migrations.AlterField(
            model_name="stock",
            name="available_item",
            field=models.CharField(
                choices=[
                    ("Mango", "Mango"),
                    ("Banana", "Banana"),
                    ("Apple", "Apple"),
                    ("Orange", "Orange"),
                ],
                max_length=10,
            ),
        ),
    ]
