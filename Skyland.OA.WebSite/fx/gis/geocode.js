//地理编码服务
define(function () {
    return new function () {
        var self = this;
        //协议之间的转换
        this.GCJ102_to_BD09 = function (lat, lng) {
            var x_pi = 3.14159265358979324 * 3000.0 / 180.0,
           x = lng,
           y = lat,
           z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi),
           theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
            lng = z * Math.cos(theta) + 0.0065;
            lat = z * Math.sin(theta) + 0.006;
            return { lat: lat, lng: lng };
        };

        this.BD09_to_GCJ102 = function (lat, lng) {
            var x_pi = 3.14159265358979324 * 3000.0 / 180.0,
            x = lng - 0.0065,
            y = lat - 0.006,
            z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi),
            theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
            lng = z * Math.cos(theta);
            lat = z * Math.sin(theta);
            return { lat: lat, lng: lng };
        };

        //地址转坐标，使用百度服务,结果自己看着解析吧
        this.searchByAddress = function (address, callback) {
            $.ajax({
                url: 'http://api.map.baidu.com/geocoder/v2/',
                dataType: 'jsonp',
                data: {
                    address: address,
                    output: 'json',
                    ak: '2nT1fbMClBbsQm8xHuEGkfIL'    //zjl bd services 100w/天
                },
                success: function (result) {
                    if (result.status == 1) {
                        if (callback) {
                            callback({ success: false, result: [] }); return;
                        }
                    }
                    var location = result.result.location;
                    location = self.BD09_to_GCJ102(location.lat, location.lng);
                    var latlng = [location.lat, location.lng];
                    if (callback) callback({ success: true, result: latlng });
                },
                error: function (code) {
                    if (callback) callback({ success: false, result: [] });
                }
            });
        };

        this.searchByLocation = function (latlng, callback) {
            var str_p = '';
            if (latlng instanceof Array) str_p = latlng[0] + ',' + latlng[1];
            else str_p = latlng.lat + ',' + latlng.lng;
            $.ajax({
                url: 'http://api.map.baidu.com/geocoder/v2/',
                dataType: 'jsonp',
                data: {
                    output: 'json',
                    coordtype: 'wgs84ll',
                    location: str_p,
                    ak: '2nT1fbMClBbsQm8xHuEGkfI' //zjl bd services 100w/天
                },
                success: function (result) {
                    if (result.status !== 0) {
                        if (callback) {
                            callback({ success: false, result: null });
                            return;
                        }
                    }
                    if (callback) callback({ success: true, result: result });
                },
                error: function (code) {
                    if (callback) callback({ success: false, result: null });
                }
            });
        };

    }
});