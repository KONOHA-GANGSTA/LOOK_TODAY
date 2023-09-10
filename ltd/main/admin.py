from django.contrib import admin
from .models import Head,Trousers, Body, Shoes, Аccessories, Image
# Register your models here.                    Аccessories

class HeadAdmin(admin.ModelAdmin):
    list_display = ['name', 'kind','owner']

admin.site.register(Head, HeadAdmin)

class TrousersAdmin(admin.ModelAdmin):
    list_display = ['name', 'kind','owner']

admin.site.register(Trousers, TrousersAdmin)

class BodyAdmin(admin.ModelAdmin):
    list_display = ['name', 'kind','owner']

admin.site.register(Body, BodyAdmin)

class ShoesAdmin(admin.ModelAdmin):
    list_display = ['name', 'kind','owner']

admin.site.register(Shoes, ShoesAdmin)

class AccessoriesAdmin(admin.ModelAdmin):
    list_display = ['name', 'kind','owner']

admin.site.register(Аccessories, AccessoriesAdmin)

class ImageAdmin(admin.ModelAdmin):
    list_display = ['name', 'planned_at','owner']

admin.site.register(Image, ImageAdmin)



