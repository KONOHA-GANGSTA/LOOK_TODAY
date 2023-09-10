from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User

class Head(models.Model):
    name = models.CharField(max_length=150, db_index=True, verbose_name='Название')
    season = models.CharField(max_length=150, verbose_name='Сезон')
    kind = models.CharField(max_length=150, verbose_name='Тип')
    picture = models.ImageField(upload_to='main/static/clothes/heads/%Y/%m/%d', blank=True, verbose_name='Фото')
    added_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ('added_at',)
        verbose_name = 'На голову'
        verbose_name_plural = 'На голову'

    def __str__(self):
        return self.name

class Trousers(models.Model):
    name = models.CharField(max_length=150, db_index=True, verbose_name='Название')
    season = models.CharField(max_length=150, verbose_name='Сезон')
    kind = models.CharField(max_length=150, verbose_name='Тип')
    picture = models.ImageField(upload_to='main/static/clothes/trousers/%Y/%m/%d', blank=True, verbose_name='Фото')
    added_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ('added_at',)
        verbose_name = 'Штаны'
        verbose_name_plural = 'Штаны'

    def __str__(self):
        return self.name

class Body(models.Model):
    name = models.CharField(max_length=150, db_index=True, verbose_name='Название')
    season = models.CharField(max_length=150, verbose_name='Сезон')
    kind = models.CharField(max_length=150, verbose_name='Тип')
    picture = models.ImageField(upload_to='main/static/clothes/bodies/%Y/%m/%d', blank=True, verbose_name='Фото')
    added_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ('added_at',)
        verbose_name = 'Торс'
        verbose_name_plural = 'Торс'

    def __str__(self):
        return self.name

class Shoes(models.Model):
    name = models.CharField(max_length=150, db_index=True, verbose_name='Название')
    season = models.CharField(max_length=150, verbose_name='Сезон')
    kind = models.CharField(max_length=150, verbose_name='Тип')
    picture = models.ImageField(upload_to='main/static/clothes/shoes/%Y/%m/%d', blank=True, verbose_name='Фото')
    added_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ('added_at',)
        verbose_name = 'Ботинки'
        verbose_name_plural = 'Ботинки'

    def __str__(self):
        return self.name

class Аccessories(models.Model):
    name = models.CharField(max_length=150, db_index=True, verbose_name='Название')
    season = models.CharField(max_length=150, verbose_name='Сезон')
    kind = models.CharField(max_length=150, verbose_name='Тип')
    picture = models.ImageField(upload_to='main/static/clothes/accessories/%Y/%m/%d', blank=True, verbose_name='Фото')
    added_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ('added_at',)
        verbose_name = 'Аксессуар'
        verbose_name_plural = 'Аксессуары'

    def __str__(self):
        return self.name

class Image(models.Model):
    name = models.CharField(max_length=150, db_index=True, verbose_name='Название')
    added_at = models.DateTimeField(auto_now_add=True)
    planned_at = models.DateTimeField(editable = True,null = True, blank = True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    picture = models.ImageField(upload_to='main/static/clothes/images/%Y/%m/%d', blank=True, verbose_name='Фото')

    head = models.ManyToManyField(Head,blank = True)
    trousers = models.ManyToManyField(Trousers,blank = True)
    body = models.ManyToManyField(Body,blank = True)
    shoes = models.ManyToManyField(Shoes,blank = True)
    accessories = models.ManyToManyField(Аccessories,blank = True)

    class Meta:
        ordering = ('added_at',)
        verbose_name = 'Образ'
        verbose_name_plural = 'Образы'

    def __str__(self):
        return self.name
