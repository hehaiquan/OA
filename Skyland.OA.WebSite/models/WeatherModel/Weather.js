function Weather() {
    var me = this;
    this.options = { key: 'Weather' };

    this.show = function (module, root) {
        if (root.children().length == 0) {
            $.PackResult("Weather.data", {}, function (data) {
                var obj = new Object();
                obj.temp = data.temperature;
                obj.tempF = data.humidity;
                obj.weather = data.todayWeather;
                var src = "";
                //天气图例获取 gd.ziyou.com/spots.getWeather/id-485
                if (obj.weather.indexOf("阴") != -1) src = "yin_0.png";
                if (obj.weather.indexOf("晴") != -1) src = "qing_0.png";
                if (obj.weather == "晴转多云") src = "qing_0.png";
                if (obj.weather.indexOf("雨") != -1) src = "dayu_0.png";
                if (obj.weather == "多云") src = "duoyun_1.png";
                if (obj.weather.indexOf("雷") != -1) src = "leizhenyu_0.png";

                var url = "models/WeatherModel/images/";
                src =  url+src;
                obj.src = src;
                var iframe = $('<iframe></iframe>');
                iframe.hide();
                iframe.attr("src", "models/WeatherModel/Weather.html");
                root.append(iframe);
                iframe.load(function () {
                    var dom = $(this).contents().find('body').tmpl(obj);
                    root.append(dom);
                    iframe.remove();
                });
            });

        }
    }

} $.iwf.register(new Weather());