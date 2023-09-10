from django.shortcuts import render, redirect
from .forms import RegistrationForm
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import login
from django.contrib.auth.models import User
from rest_framework import serializers, viewsets
from django.http import JsonResponse,HttpResponseRedirect, HttpResponseBadRequest
from .models import Head, Trousers, Body, Shoes, Аccessories, Image
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token
from django.core.files.uploadedfile import InMemoryUploadedFile
from formtools.wizard.views import SessionWizardView
from django.http import QueryDict

def current_user(request):
    user = request.user
    user_json = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
    }
    return JsonResponse(user_json)

def get_user_objects(request):
    user = request.user
    heads = Head.objects.filter(owner=user)
    trousers = Trousers.objects.filter(owner=user)
    bodies = Body.objects.filter(owner=user)
    shoes = Shoes.objects.filter(owner=user)
    accessories = Аccessories.objects.filter(owner=user)
    
    heads_list = [{'name': head.name, 'season': head.season, 'kind': head.kind, 'picture': head.picture.url} for head in heads]
    trousers_list = [{'name': trouser.name, 'season': trouser.season, 'kind': trouser.kind, 'picture': trouser.picture.url} for trouser in trousers]
    bodies_list = [{'name': body.name, 'season': body.season, 'kind': body.kind, 'picture': body.picture.url} for body in bodies]
    shoes_list = [{'name': shoe.name, 'season': shoe.season, 'kind': shoe.kind, 'picture': shoe.picture.url} for shoe in shoes]
    accessories_list = [{'name': accessory.name, 'season': accessory.season, 'kind': accessory.kind, 'picture': accessory.picture.url} for accessory in accessories]
    
    context = {
        'heads': heads_list,
        'trousers': trousers_list,
        'bodies': bodies_list,
        'shoes': shoes_list,
        'accessories': accessories_list,
    }
    return JsonResponse(context, safe=False)

def get_user_images(request):
    user = request.user
    images = Image.objects.filter(owner=user)
    images_dict = []
    for image in images:
        head_names = [head.name for head in image.head.all()]
        trouser_names = [trouser.name for trouser in image.trousers.all()]
        body_names = [body.name for body in image.body.all()]
        shoe_names = [shoe.name for shoe in image.shoes.all()]
        accessory_names = [accessory.name for accessory in image.accessories.all()]
        images_dict.append({
            'name': image.name,
            'added_at': image.added_at,
            'planned_at': image.planned_at,
            'heads': head_names,
            'bodies': body_names,
            'trousers': trouser_names,
            'shoes': shoe_names,
            'accessories': accessory_names,
            'picture' : image.picture.url,
        })
    return JsonResponse(images_dict, safe=False)




# Create your views here.

def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            return redirect('/login/')
    else:
        form = RegistrationForm()
    return render(request, 'register.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request=request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('/')
    else:
        form = AuthenticationForm()
    return render(request, 'login.html', {'form': form})

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ClothesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Head
        fields = ('id', 'name', 'season', 'kind','picture')

def mainPage(request):
    context = {
        'title': 'Главная страница', 
    }
    return render(request, 'main.html', context = context)

@ensure_csrf_cookie
def fitting(request):
    context = {
        'title': 'Примерочная', 
    }
    return render(request, 'fitting.html', context = context)

    

def create_image(request):
    if request.method == 'POST':
        form_data = request.POST
        image_data = {}
        image_data['owner'] = request.user
        image_data['name'] = form_data.get('name', '')
        if form_data.get('planned_at', '') !=' ':
            image_data['planned_at'] = form_data.get('planned_at', '')
        image_data['picture'] = request.FILES.get('picture', None)
        image = Image.objects.create(**image_data)
  
        head_names = form_data.getlist('heads')
        head_names = head_names[0].split(",")
        image.head.set(Head.objects.filter(name__in=head_names, owner=request.user))
        body_names = form_data.getlist('bodies')
        body_names = body_names[0].split(",")
        image.body.set(Body.objects.filter(name__in=body_names, owner=request.user))
        trousers_names = form_data.getlist('trousers')
        trousers_names = trousers_names[0].split(",")
        image.trousers.set(Trousers.objects.filter(name__in=trousers_names, owner=request.user))
        shoes_names = form_data.getlist('shoes')
        shoes_names = shoes_names[0].split(",")
        image.shoes.set(Shoes.objects.filter(name__in=shoes_names, owner=request.user))
        accessories_names = form_data.getlist('accessories')
        accessories_names = accessories_names[0].split(",")
        image.accessories.set(Аccessories.objects.filter(name__in=accessories_names, owner=request.user))

        return redirect(reverse('main'))
    else:
        return HttpResponseBadRequest('Invalid request method')




@csrf_exempt
@ensure_csrf_cookie
def csrf_token(request):
    return JsonResponse({'csrf_token': get_token(request)})

def wardrobe(request):
    context = {
        'title': 'Шкаф', 
    }
    return render(request, 'wardrobe.html', context = context)

def heads(request):
    context = {
        'title': 'На голову', 
    }
    return render(request, 'heads.html', context = context)

def createModel(request):
    if request.method == 'POST':
        form_data = request.POST
        model = form_data.get('model','')
        obj = {}
        obj['owner'] = request.user
        obj['name'] = form_data.get('name', '')
        obj['season'] = form_data.get('name', 'Любой')
        obj['kind'] = form_data.get('kind', '')
        obj['picture'] = request.FILES.get('picture',None)

        if model == 'heads':
            newObject = Head(**obj)
            newObject.save()
        if model == 'bodies':
            newObject = Body(**obj)
            newObject.save()
        if model == 'trousers':
            newObject = Trousers(**obj)
            newObject.save()
        if model == 'shoes':
            newObject = Shoes(**obj)
            newObject.save()
        if model == 'accessories':
            newObject = Аccessories(**obj)
            newObject.save()

        return redirect(reverse('main'))
    else:
        return HttpResponseBadRequest('Invalid request method')

def bodies(request):
    context = {
        'title': 'Торс'
    }
    return render(request, 'heads.html', context = context)

def trousers(request):
    context = {
        'title': 'Брюки'
    }
    return render(request, 'heads.html', context = context)

def shoes(request):
    context = {
        'title': 'Ботинки'
    }
    return render(request, 'heads.html', context = context)

def accessories(request):
    context = {
        'title': 'Аксессуары'
    }
    return render(request, 'heads.html', context = context)

def images(request):
    context = {
        'title': 'Образы'
    }
    return render(request, 'images.html', context = context)