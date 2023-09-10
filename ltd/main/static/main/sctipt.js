
function getCurrentUser(){
 return fetch('/current_user/')
    .then(response => response.json())
}

let current_image = {
  accessories: [],
  bodies: [],
  heads: [],
  name: null,
  picture: null,
  planned_at: null,
  shoes: [],
  trousers: []
}


//document.getElementById("name").innerHTML = json.username;

function getCurrentUserObjects(){
  return fetch('/get_user_objects/')
      .then(response => response.json())
  }

  function getCurrentUserImages(){
    return fetch('/get_user_images/')
        .then(response => response.json())
    }
  
    const allModelsPromise = Promise.all([
      getCurrentUser(),
      getCurrentUserObjects(),
      getCurrentUserImages()
    ]);

    function insertImage(element,url){
      let img = document.createElement("img");
      img.src = ((getCurrentUrl()!="")? "../":"") + url.slice(6);
      element.appendChild(img)
    }

function countSlash(str){
  let result = 0;
  for(let i;i<str.length;++i)
    if(str[i]='/') ++result;
  return result
}

function upToDir(num){
  let result = ""
  for(let i = 0;i<num;++i)
    result = result + "/.."
  return result
}

  allModelsPromise
    .then((arr) => {
      document.getElementById("name").innerHTML = arr[0].username ;
      let images = arr[2];
      let clothes = arr[1];
      localStorage.setItem("images",JSON.stringify(images))
      localStorage.setItem("clothes",JSON.stringify(clothes))
      
      switch(getCurrentUrl()){
        
        case '':{
      imageNum = Math.floor(Math.random() * (images.length));
      insertImage(document.querySelector(".main_image_photo"),images[imageNum].picture)
      let acceptable = ['heads','bodies','trousers','shoes','accessories']
      let my_set = []
      let done = []
      let currentDiv
      for (let key of Object.keys(images[imageNum]))
        if(acceptable.indexOf(key) != -1 && images[imageNum][key]) my_set.push(key);
      for(let element of my_set){
        for(let el of images[imageNum][element])
          for(let obj of clothes[element]){
            if(obj.name == el){
              if(element == 'accessories')
                currentDiv = document.querySelector('.main_accessories_photo')
              else
                currentDiv = document.querySelector('.main_clothes_photo')
            if(done.indexOf(element) == -1){
              createDiv(currentDiv,'clothes_item',element,obj.picture)
              console.log(obj.picture)
              done.push(element)
            }
            else
              insertImage(document.getElementById(element),obj.picture)
            }
          }
        }
        break;
      }
      case 'fitting/':{
        let addButtons = [
          [document.getElementById('addHead'),'heads'],
          [document.getElementById('addBody'),'bodies'],
          [document.getElementById('addTrousers'),'trousers'],
          [document.getElementById('addShoes'),'shoes'],
          [document.getElementById('addAccessories'),'accessories']
        ]
        addButtons.forEach(el=>el[0].addEventListener("click",()=>popupMenue(el[0],getList(el[0],el[1],arr[1]))))
        document.getElementById("fitButton").addEventListener("click",()=>{
          document.getElementById("fitDate").value = "";
          document.getElementById("fitTime").value = "";
        })

        document.getElementById('create-object-button').addEventListener('click', function(event){
          event.preventDefault();
          addButtons.forEach(el=>{
            current_image[el[1]] = Array.from(el[0].parentNode.parentNode.parentNode.querySelectorAll(".fitTitle")).map(e=>e.innerText)
          })
          current_image.name = document.getElementById('fitTitle').value;
          current_image.planned_at = document.getElementById("fitDate").value+" "+document.getElementById("fitTime").value
          current_image.picture = document.getElementById("fitPhoto").files[0];

          var xhr = new XMLHttpRequest();
          xhr.open('GET', 'csrf_token/');
          xhr.onload = function() {
            if (xhr.status === 200) {
                var csrftoken = xhr.responseText;
            var formData = new FormData();
          for(let el of Object.keys(current_image)){
            formData.append(el,current_image[el])
          }
            var request = new XMLHttpRequest();
                request.open('POST', 'create-image/');
                // request.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + formData._boundary);
                request.setRequestHeader('X-CSRFToken', JSON.parse(csrftoken)['csrf_token']);
                request.onload = function(){
                    if (request.status === 200) {
                        console.log('Object created successfully');
                        window.location.assign('/images/');
                        
                    } else {
                        console.log('Object creation failed');
                    }
                  }
                  request.send(formData);
            }
        };
        xhr.send(); 
        })
        
        break;
      }
      case "images/":{
        let allImages = [];
        for(el of images){
          allImages.push(CreateImageEl(el))
          document.querySelector(".list").appendChild(allImages[allImages.length-1])
        }
        
        document.getElementById("clTitle").oninput = ()=>{
          document.querySelector(".list").innerHTML = "";
          for(el of filterIm(allImages))
            document.querySelector(".list").appendChild(el)

        }

        break;
      }
      default:{
        let allElements = [];
        let clothesType = getCurrentUrl().slice(0,-1);
        let list = document.querySelector(".list")
        for(let el of clothes[clothesType]){
          allElements.push(createClothesElement(el))
          list.appendChild(allElements[allElements.length-1])
        }
        document.querySelector(".clothesAddButton").addEventListener("click",()=>addCreateMenue(clothesType))
        for(let filtField of Array.from(document.querySelectorAll("input")))
          filtField.oninput = ()=>{
            document.querySelector(".list").innerHTML="";
            for(let el of filter(allElements))
              document.querySelector(".list").appendChild(el)
          }
        break;
      }
    }       
    })
    
    const tempElem = document.querySelector(".temperature")
    const cityElem = document.querySelector(".city")
    const weatherElem = document.querySelector(".weather")
    const iconElem = document.querySelector('.icon')
    
    const API_KEY = "1c88ecea857a6aecc19ee21a80b2d5a3"
    const city_id = "524894"
    
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?id=${city_id}&appid=${API_KEY}`
    
    async function getWeather() {
      const api_url = await fetch(weather_url)
      const data = await api_url.json()
    
      tempElem.textContent = Math.round(data.main.temp - 273) + "°C"
      cityElem.textContent = data.name
      weatherElem.textContent = data.weather[0].main
      iconElem.innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" width="80" height="80"/>`
    }
    
    getWeather()






function createDiv(parent,baseClass,id = null,imgUrl = null){
  let block = document.createElement("DIV")
  block.classList.add(baseClass)
  if(imgUrl)
    insertImage(block,imgUrl)
  if(id)
    block.id = id;
  parent.appendChild(block)
}

function getCurrentUrl(){
  let result = window.location.href.slice(7)
  return result.slice(result.indexOf('/')+1)
}

function popupMenue(parent,list){
  if(list.length == 0) return
  let headerTitle = parent.parentNode.parentNode.parentNode.parentNode.childNodes[1].innerText;
  let category;
  switch(headerTitle){
    case "Голова":{
      category = "heads";
      break;
    }
    case "Торс":{
      category = "bodies";
      break;
    }
    case "Штаны":{
      category = "trousers";
      break;
    }
    case "Ботинки":{
      category = "shoes";
      break;
    }
    case "Аксессуары":{
      category = "accessories";
      break;
    }
  }
  let menue = document.createElement("DIV");
  menue.classList.add("menue")
  for(let el of list){
    let newEl = document.createElement("DIV");
    newEl.innerText = el;
    newEl.classList.add("menueItem")
    menue.appendChild(newEl);
    newEl.addEventListener("click",()=>{
      let clothes = JSON.parse(localStorage.getItem('clothes'));
      for(let el of Object.keys(clothes))
        for(let item of clothes[el])
          if((newEl.innerText == item.name) & (el == category))
            parent.parentNode.parentNode.parentNode.appendChild(createFittingElement(item));
      menue.remove()});
  }
  let rect = parent.getBoundingClientRect();
  menue.style.left =  rect.left + "px";
  menue.style.top = rect.top + window.pageYOffset + "px";
  document.body.appendChild(menue);
}

function getList(element,kind,clothes){
  let ocup =  Array.from(element.parentNode.parentNode.parentNode.querySelectorAll(".fitTitle")).map(el=>el.innerText)
  let all = clothes[kind].map(el=>el.name);
  let availible = [];
  for(let el of all)
    if(ocup.indexOf(el) == -1)
      availible.push(el);
  return availible
}

function createFittingElement(obj){
  let fe = document.createElement("DIV")
  fe.classList.add("fitEl")
  let fi = document.createElement("DIV")
  fi.classList.add("fittingImage")
  insertImage(fi,obj.picture)
  let title = document.createElement("DIV")
  title.innerText = obj.name;
  title.classList.add("fitTitle")
  fe.appendChild(fi);
  fe.appendChild(title);
  fe.addEventListener("click",()=>{
    fe.remove();
  })
  return fe
}

function createClothesElement(object){
  let newEl = document.createElement("DIV");
  newEl.classList.add("clothesElement")
  let clIm = document.createElement("DIV")
  clIm.classList.add("clothesImage")
  insertImage(clIm,object.picture)
  let clInf = document.createElement("DIV")
  clInf.classList.add("clothesInfo")
  newEl.appendChild(clIm)
  newEl.appendChild(clInf)
  let header = document.createElement("DIV");
  header.classList.add("clothesTitle");
  header.innerText = object.name;
  clInf.appendChild(header);
  let clothesTable = document.createElement("DIV")
  clothesTable.classList.add("clothesTable");
  clInf.appendChild(clothesTable);
  let fields = ['season','kind'];
  for(let el of fields){
    let field = document.createElement("DIV");
    let value = document.createElement("DIV");
    field.innerText = (el == 'season')? 'Сезон:':'Тип:';
    value.innerText = object[el];
    clothesTable.appendChild(field);
    clothesTable.appendChild(value);
  }
  return newEl
}

function addCreateMenue(type){
    let overlay = document.createElement("DIV");
    overlay.style.position = "absolute";
    overlay.style.height = "100%";
    overlay.style.width = "100%";
    overlay.style.top = window.scrollY + "px";
    overlay.style.zIndex = "1";
    overlay.style.backgroundColor = "black";
    overlay.style.opacity = "0.5";
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden"

    let addMenu = document.createElement("DIV");
    addMenu.classList.add('clothesAddMenue');
    addMenu.style.top = window.scrollY+80+"px"
    document.body.appendChild(addMenu);
    let addMenueOverlay = document.createElement("DIV")
    addMenueOverlay.classList.add("addMenueOverlay");
    addMenu.appendChild(addMenueOverlay);
    
    let params = [
      ["nickName","Название","text"],
      ["season","Сезон","text"],
      ["kind","Тип","text"],
      ["picture","Картинка","file"],
    ]
    function createFields(params){
      let main = document.createElement("DIV")
      main.classList.add("idfk");
        let header = document.createElement("DIV")
        header.classList.add("idfk_header")
        header.innerText = params[1]
        main.appendChild(header);
        let inp = document.createElement("input");
        inp.type = params[2];
        inp.placeholder = params[1];
        inp.id = params[0];
        main.appendChild(inp)
      return main
    }

    for(el of params)
      addMenueOverlay.appendChild(createFields(el));
    
    let btn = document.createElement("DIV")
    btn.classList.add("clothesCreateButton")
    btn.innerText = "Добавить"
    addMenu.appendChild(btn)

    function leaveMenue(){
      overlay.remove();
      addMenu.remove();
      document.body.style.overflow = "";
    }

    btn.addEventListener("click",()=>{
      var xhr = new XMLHttpRequest();
          xhr.open('GET', '../fitting/csrf_token/');
          xhr.onload = function() {
            if (xhr.status === 200) {
                var csrftoken = xhr.responseText;
                var formData = new FormData();
                formData.append("model",getCurrentUrl().slice(0,-1))
                formData.append("name",document.getElementById("nickName").value)
                formData.append("season",document.getElementById("season").value)
                formData.append("kind",document.getElementById("kind").value)
                formData.append("picture",document.getElementById("picture").files[0])
                var request = new XMLHttpRequest();
                request.open('POST', '../create-model/');
                request.setRequestHeader('X-CSRFToken', JSON.parse(csrftoken)['csrf_token']);
                request.onload = function(){
                  if (request.status === 200) {
                      console.log('Object created successfully');
                      leaveMenue()
                      window.location.assign('/');
                      
                  } else {
                      console.log('Object creation failed');
                  }
                }
                request.send(formData)
            }
        };
        xhr.send(); 
    })

    overlay.addEventListener("click",()=>leaveMenue())
}

function filter(items){
    let inputs = [
      document.getElementById("clTitle"),
      document.getElementById("clSeason"),
      document.getElementById("clKind"),
    ]
    return items.filter((i)=>
      (i.querySelector(".clothesTitle").innerText.toLowerCase().indexOf(inputs[0].value.toLowerCase())!=-1)&
      (i.querySelector(".clothesTable").childNodes[1].innerText.toLowerCase().indexOf(inputs[1].value.toLowerCase())!=-1)&
      (i.querySelector(".clothesTable").childNodes[3].innerText.toLowerCase().indexOf(inputs[2].value.toLowerCase())!=-1)
    )
}

function CreateImageEl(obj){
  let main = document.createElement("DIV");
  main.classList.add("imMain")
  let header = document.createElement("DIV");
  header.classList.add("imHeader");
  let imT = document.createElement("DIV");
  let imD = document.createElement("DIV");
  imT.innerText = obj.name;
  imD.innerText = (obj.planned_at)? (new Date(obj.planned_at).getDate()+"/"+(new Date(obj.planned_at).getMonth()+1)+"/"+new Date(obj.planned_at).getFullYear() ): "";
  console.log(obj)
  header.appendChild(imT);
  header.appendChild(imD);
  main.appendChild(header);
  let imageInfo = document.createElement("DIV");
  imageInfo.classList.add("imInfo")
  let img = document.createElement("DIV");
  img.classList.add("imImage")
  insertImage(img,obj.picture)
  let button = document.createElement("DIV");
  button.classList.add("imButton")
  let imField = ["heads","bodies","trousers","shoes","accessories"]
  for (el of Object.keys(obj)){
    if(imField.indexOf(el)!=-1){
      if (obj[el].length)
      button.appendChild(createItList(el,obj[el]))
    }
  }
  imageInfo.appendChild(img)
  imageInfo.appendChild(button);
  main.appendChild(imageInfo)
  return main;
}

function createItList(kind,arr){
  let kindName
  switch(kind){
    case "heads":{
      kindName = "Голова"
      break
    }
    case "bodies":{
      kindName = "Торс"
      break
    }
    case "trousers":{
      kindName = "Брюки"
      break
    }
    case "shoes":{
      kindName = "Ботинки"
      break
    }
    case "accessories":{
      kindName = "Аксессуары"
      break
    }
  }

  let main = document.createElement("DIV");
  main.classList.add("imInfoFields")
  let fieldName = document.createElement("DIV");
  fieldName.innerText = kindName+":";
  fieldName.classList.add("kindName");
  let clList = document.createElement("DIV");
  clList.classList.add("imInfoList")
  clList.innerText = arr.join(", ")
  main.appendChild(fieldName);
  main.appendChild(clList);
  return main
}

function filterIm(items){
  let inputs = document.getElementById("clTitle")

  return items.filter((i)=>
    (i.querySelector(".imHeader").childNodes[0].innerText.toLowerCase().indexOf(inputs.value.toLowerCase())!=-1))
}