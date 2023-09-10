"""
URL configuration for ltd project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from main.views import register, user_login, UserSerializer, UserViewSet,current_user,get_user_objects, get_user_images, mainPage,fitting, create_image, csrf_token,wardrobe,heads,createModel,bodies,trousers,shoes,accessories,images

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', register, name = 'registration'),
    path('login/', user_login, name = 'login'),
    path('current_user/', current_user, name='current_user'),
    path('get_user_objects/', get_user_objects, name='current_user_objects'),
    path('get_user_images/', get_user_images, name='get_user_images'),
    path('',mainPage, name = 'main'),
    path('fitting/',fitting, name = 'fitting'),
    path('fitting/create-image/',create_image, name = 'createImage'),
    path('fitting/csrf_token/',csrf_token, name = 'getFittingToken'),
    path('wardrobe/',wardrobe, name = 'wardrobe'),
    path('heads/',heads, name = 'heads'),
    path('create-model/',createModel, name = 'createModel'),
    path('bodies/',bodies, name = 'bodies'),
    path('trousers/',trousers, name = 'trousers'),
    path('shoes/',shoes, name = 'shoes'),
    path('accessories/',accessories, name = 'accessories'),
    path('images/',images, name = 'images'),
]

