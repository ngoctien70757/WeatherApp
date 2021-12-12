
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const apiKey = `afb13b55acb11d19b62393ef3d3a9923`;

const wrapper = $('.wrapper');
inputPart = wrapper.querySelector('.input-part');
infoTxt = inputPart.querySelector('.info-txt');
inputField = inputPart.querySelector('input');
locationBtn = inputPart.querySelector('button')
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector('header i')

let api;

inputField.addEventListener('keyup', e =>{
    //if user pressed enter btn and input value is not empty
    if(e.key == 'Enter' && inputField.value != ''){     //bắt sự kiện ấn vào nút empty
        requestApi(inputField.value)
    }
})

 locationBtn.addEventListener('click',()=>{
     if(navigator.geolocation){     //biến này đc https hỗ trợ giúp lấy đc vị trí người dùng
        navigator.geolocation.getCurrentPosition(onSuccess, onError)//nếu getCurrentPositon() thành công thì hàm onSuccess sẽ được gọi 
                                                        // nếu có bất kì lỗi xảy ra khi lấy địa chỉ thì hàm onError sẽ được gọi 
     }else{
         alert('Your browser not support geolocation')
     }
 })

function onSuccess(position){   //Khi thành công sẽ tạo ra 1 object geolocationPosition có chứa thông tin vị trí
    const {latitude, longitude} = position.coords  // lấy ra lat và lon của user từ object coords và gán cho 2 biến 
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`//thêm &units=metric để chuyển sang độ c
    fetchData();
}


function onError(error){        //khi thành công sẽ tạo ra 1 object deolocationPositionError
    infoTxt.innerText = error.message;
    infoTxt.classList.add('error');
 }

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`//thêm &units=metric để chuyển sang độ c
    fetchData();
}

function fetchData(){
    infoTxt.innerText = 'Getting weather detail...';
    infoTxt.classList.add('pending');
    // getting api response and returning it with parsing into js obj and in another
    // then function calling weatherDetails function with passing aip result as an argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info){//info lúc này được truyền vào 1 object từ result
    infoTxt.classList.replace('pending','error');       // thay class
    if(info.cod == '404'){
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }else{
        //lấy các properties cần thiết từ info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];// dùng id này để show hình ảnh theo kiểu thời tiết
        const {feels_like, humidity, temp} = info.main;

        //dùng icon theo id mà api trả về
        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }

        wrapper.querySelector('.temp .numb').innerText = Math.floor(temp);
        wrapper.querySelector('.weather').innerText = description;
        wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
        wrapper.querySelector('.temps .numb-2').innerText = Math.floor(feels_like);
        wrapper.querySelector('.humidity span').innerText = `${humidity}%`;

        infoTxt.classList.remove('pending','error');
        wrapper.classList.add('active');
    }
}

arrowBack.addEventListener('click',()=>{
    wrapper.classList.remove('active');
})