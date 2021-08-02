
// 建立 Leaflet 地圖
var map = L.map('mapid', {
    center: [24.163746998256133, 120.67472847150714],
    zoom: 14
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
}).addTo(map);


// 建立dom
var dist = document.getElementById('city');
var type = document.getElementById('type');
var content = document.getElementById('content');


var xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.epa.gov.tw/api/v1/fac_p_27?limit=1000&api_key=9be7b239-557b-4c10-9775-78cadfc555e9&format=json', true);
xhr.send(null);
xhr.onload = function () {
    var data = JSON.parse(xhr.responseText);
    var toiletdata = data.records;
    

    //將資料放進陣列內 地區
    var distdata = [];
    for (var i = 0; i < toiletdata.length; i++) {
        distdata.push(toiletdata[i].City);
    };
    //將重複的地區去除
    var cityArray = Array.from(new Set(distdata));
    

    var optionStr = "";
    for (var i = 0; i < cityArray.length; i++) {
        optionStr += `<option value="${cityArray[i]}">${cityArray[i]}</option>`
    };
    dist.innerHTML = optionStr;

  
    //新增改變地區監聽器
    dist.addEventListener('change', changOption, false);

    //為執行 clearLayers() 將myGroup拉出來宣告
    var myGroup;
    //改變地區印出內容
    function changOption(e) {


        var selectOp = e.target.value;
        var contentStr = "";
        var tLatitude = [];
        var tLongitude = [];
        var layers = [];


        for (var i = 0; i < toiletdata.length; i++) {

            if (selectOp == toiletdata[i].City) {

                // 若myGroup不為undefined(沒資料時)，使用clearLayers()清除marker
                if (myGroup != undefined) {
                    myGroup.clearLayers();
                }

                contentStr += `
                <div class="card mb-3  border-dark " style="width:100%" >
                 <div class="card-header  rounded-0" style=" font-weight:bold; background-color:#ffd800;"><i class="fas fa-map-marker-alt" style="margin-right:3px;"></i>${toiletdata[i].Name}</div>
                 <div class="card-body ">
                   <h6 class="card-subtitle  text-muted">${toiletdata[i].Type}</h6>
                   <p class="card-text">${toiletdata[i].Address}</p>
                   <p class="card-text2">${toiletdata[i].Latitude}</p>
                   <p class="card-text3">${toiletdata[i].Longitude}</p>
                 </div>
                 </div>
                 `;

                //將經緯度放進新的陣列，用來取選到地區的定位
                tLatitude.push(toiletdata[i].Latitude);
                tLongitude.push(toiletdata[i].Longitude);


                // 增加MARKER到地圖中
                var layer = new L.marker([toiletdata[i].Latitude, toiletdata[i].Longitude]);
                layers.push(layer);
                myGroup = L.layerGroup(layers);
                map.addLayer(myGroup);
                layer.bindPopup(`<h6>${toiletdata[i].Name}</h6><p>${toiletdata[i].Address}</p>`);

            };

            content.innerHTML = contentStr;


        };


        //設定選到地區的中心位置，取陣列中的第一個值
        map.setView(new L.LatLng(tLatitude[0], tLongitude[0]), 15);


        //地圖跳窗
        var cardArr = document.getElementsByClassName('card');

        for (var i = 0; i < cardArr.length; i++) {
            cardArr[i].onclick = function () {
                
                L.popup().setLatLng([this.getElementsByClassName('card-text2')[0].innerText * 1, this.getElementsByClassName('card-text3')[0].innerText * 1]).setContent(this.getElementsByClassName('card-header')[0].innerText).openOn(map);

            }
        };



    };


};