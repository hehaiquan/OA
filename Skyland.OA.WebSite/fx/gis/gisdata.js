//从数据库获取gis数据
define(function () {
    return new function () {
        var self = this;

        this.ComSerUrl = "gis.data";

        //获取GeojsonFeature数据
        this.GeojsonFeature = {
            /*
            *获取点Point数据
            *参数说明：
            *options-参数可选项（TableName:表名；LatFieldName：纬度坐标坐标字段名称；LngFieldName：经度坐标字段名称；PropertiesFields:指定的字段（默认全部返回，如果IsExceptFields为true，则为排除的字段，其他字段信息都返回，且字段名为大写形式返回）；IsExceptFields:是否排除指定的字段）；Where:过滤条件（默认全部获取）
            *isAsync-是否异步（默认false）；
            *callback-回调函数（参数：成功返回geoson格式数据，否则返回false）
            *返回值：成功返回geoson格式数据，否则返回false
            */
            GetPoint: function (options, isAsync, callback) {
                var defaultOpts = { TableName: null, LatFieldName: "Y", LngFieldName: "X", PropertiesFields: null, IsExceptFields: false, Where: null };
                var opts = $.extend(defaultOpts, options);
                isAsync = isAsync == null ? false : isAsync;//默认非异步
                var retVal = false;
                $.ajax({
                    type: "post", url: self.ComSerUrl + "?action=GetGisPoint", data: { queryInfo: JSON.stringify(opts) }, async: isAsync, success: function (res) {
                        var data = eval('(' + res + ')');
                        if (data != null && data.success != null && data.success == false) {
                            alert(data.msg);
                        }
                        else {
                            retVal = data;
                        }
                        if (typeof callback == "function") {
                            callback(retVal);
                        }
                    }
                });
                return retVal;
            },
            /*
            *获取线LineString数据
            *参数说明：
            *options-参数可选项（TableName：表名；PropertiesFields：指定的字段（默认全部返回，如果IsExceptFields为true，则为排除的字段，其他字段信息都返回，且字段名为大写形式返回）；IsExceptFields：是否排除指定的字段；；PointsFieldName-坐标点字段名称；CustomConvertFun-自定义转换函数(返回值格式：[[-87.359296, 35.00118],[-85.606675, 34.984749]])；Where:过滤条件（默认全部获取））；
            *isAsync-是否异步（默认false）；
            *callback-回调函数（参数：成功返回geoson格式数据，否则返回false）
            *返回值：成功返回geoson格式数据，否则返回false
            */
            GetLineString: function (options, isAsync, callback) {
                var defaultOpts = { TableName: null, PropertiesFields: null, IsExceptFields: false, PointsFieldName: null, CustomConvertFun: null, IsExceptFields: false };
                var opts = $.extend(defaultOpts, options);
                isAsync = isAsync == null ? false : isAsync;//默认非异步
                if (opts.PointsFieldName == null) {
                    alert("请提供线点坐标字段名【PointsFieldName】！");
                    return false;
                }

                opts.PropertiesFields = self.GisSer.Utility.ArrayToUpperCase(opts.PropertiesFields); opts.PointsFieldName = opts.PointsFieldName.toUpperCase();
                //无论什么情况下，都要返回PointsFieldName字段
                var isGetAllField = (opts.PropertiesFields == null || opts.PropertiesFields.length < 1);//是否获取所有字段
                if (!isGetAllField) {
                    var isPointFieldInPropertiesFields = $.inArray(opts.PointsFieldName, opts.PropertiesFields) > -1;//点字段是否在指定字段里
                    if (opts.IsExceptFields && isPointFieldInPropertiesFields) {//排除字段
                        opts.PropertiesFields.pop(opts.PointsFieldName);
                    } else if (!opts.IsExceptFields && !isPointFieldInPropertiesFields && opts.PropertiesFields != null) {//指定字段
                        opts.PropertiesFields.push(opts.PointsFieldName);
                    }
                }

                var retVal = false;
                //gis记录转换为Geojson格式数据
                function _getGeojson(gisRecords) {
                    var FeaCol = [];
                    for (var i = 0; i < gisRecords.length; i++) {
                        var curRecord = gisRecords[i];
                        var feature = {
                            "type": "Feature",
                            "properties": null,
                            "geometry": {
                                "type": "LineString",
                                "coordinates": []
                            }
                        }

                        //获取字段属性
                        var properties = {};
                        for (var item in curRecord) {
                            properties[item] = curRecord[item];
                        }
                        if (!isGetAllField) {
                            if ((opts.IsExceptFields && isPointFieldInPropertiesFields) || (!opts.IsExceptFields && !isPointFieldInPropertiesFields)) {//去除点属性
                                delete properties[opts.PointsFieldName];
                            }
                        }

                        //点字段转换为坐标点数组
                        //var coordinates = [];
                        var latlngCol = [];
                        var points = curRecord[opts.PointsFieldName.toUpperCase()]
                        if (typeof opts.CustomConvertFun == "function") {//自定义转换
                            latlngCol = opts.CustomConvertFun(points);
                        } else {//默认转换
                            var pointCol = [];
                            pointCol = points.split(' ');
                            for (var j = 0; j < pointCol.length; j++) {
                                var ll = pointCol[j].split(',');
                                latlngCol.push([Number(ll[0]), (ll[1])]);
                            }
                        }

                        feature.properties = properties;
                        feature.geometry.coordinates = latlngCol;

                        FeaCol.push(feature);
                    }
                    return FeaCol;
                };

                var gisRecords = self.GetGisRecord(opts, isAsync, function (data) {
                    if (data !== false) {
                        retVal = _getGeojson(data);
                    }
                    if (typeof callback == "function") {
                        callback(retVal);
                    }
                });

                return retVal;
            },
            /*
            *获取面Polygon数据
            *参数说明：
            *options-参数可选项（TableName：表名；PropertiesFields：指定的字段（默认全部返回，如果IsExceptFields为true，则为排除的字段，其他字段信息都返回，且字段名为大写形式返回）；IsExceptFields：是否排除指定的字段；PointsFieldName-坐标点字段名称；CustomConvertFun-自定义转换函数(返回值格式：[[-87.359296, 35.00118],[-85.606675, 34.984749]])；Where:过滤条件（默认全部获取））；
            *isAsync-是否异步（默认false）；
            *callback-回调函数（参数：成功返回geoson格式数据，否则返回false）
            *返回值：成功返回geoson格式数据，否则返回false
            */
            GetPolygon: function (options, isAsync, callback) {
                var defaultOpts = { TableName: null, PropertiesFields: null, IsExceptFields: false, PointsFieldName: null, CustomConvertFun: null };
                var opts = $.extend(defaultOpts, options);
                isAsync = isAsync == null ? false : isAsync;//默认非异步
                if (opts.PointsFieldName == null) {
                    alert("请提供面坐标字段名【PointsFieldName】！");
                    return false;
                }

                opts.PropertiesFields = self.GisSer.Utility.ArrayToUpperCase(opts.PropertiesFields); opts.PointsFieldName = opts.PointsFieldName.toUpperCase();
                //无论什么情况下，都要返回PointsFieldName字段
                var isGetAllField = (opts.PropertiesFields == null || opts.PropertiesFields.length < 1);//是否获取所有字段
                if (!isGetAllField) {
                    var isPointFieldInPropertiesFields = $.inArray(opts.PointsFieldName, opts.PropertiesFields) > -1;//点字段是否在指定字段里
                    if (opts.IsExceptFields && isPointFieldInPropertiesFields) {//排除字段
                        opts.PropertiesFields.pop(opts.PointsFieldName);
                    } else if (!opts.IsExceptFields && !isPointFieldInPropertiesFields && opts.PropertiesFields != null) {//指定字段
                        opts.PropertiesFields.push(opts.PointsFieldName);
                    }
                }

                var retVal = false;
                //gis记录转换为Geojson格式数据
                function _getGeojson(gisRecords) {

                    var FeaCol = {
                        "type": "FeatureCollection", "features": []
                    };
                    for (var i = 0; i < gisRecords.length; i++) {
                        var curRecord = gisRecords[i];

                        var feature = {
                            "type": "Feature",// "id": "01",
                            "properties": null,//{ "name": "Alabama", "density": 94.65 },
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": []//node format:[[-87.359296, 35.00118],[-85.606675, 34.984749]]
                            }
                        };
                        //获取字段属性
                        var properties = {};
                        for (var item in curRecord) {
                            properties[item] = curRecord[item];
                        }
                        if (!isGetAllField) {
                            if ((opts.IsExceptFields && isPointFieldInPropertiesFields) || (!opts.IsExceptFields && !isPointFieldInPropertiesFields)) {//去除点属性
                                delete properties[opts.PointsFieldName];
                            }
                        }

                        //点字段转换为坐标点数组
                        //var coordinates = [];
                        var latlngCol = [];
                        var points = curRecord[opts.PointsFieldName.toUpperCase()]
                        if (typeof opts.CustomConvertFun == "function") {//自定义转换
                            latlngCol = opts.CustomConvertFun(points);
                        } else {//默认转换
                            var pointCol = [];
                            pointCol = points.split(' ');
                            for (var j = 0; j < pointCol.length; j++) {
                                var ll = pointCol[j].split(',');
                                latlngCol.push([Number(ll[0]), (ll[1])]);
                            }
                        }
                        //coordinates.push(latlngCol);

                        feature.properties = properties;
                        feature.geometry.coordinates.push(latlngCol);

                        FeaCol.features.push(feature);
                    }

                    return FeaCol;
                }

                var gisRecords = self.GisSer.GetGisRecord(opts, isAsync, function (data) {
                    if (data !== false) {
                        retVal = _getGeojson(data);
                    }
                    if (typeof callback == "function") {
                        callback(retVal);
                    }
                });

                return retVal;
            }
        };
        /*
        *获取GIS记录
        *参数说明：
        *options-参数可选项（TableName：表名；PropertiesFields：指定的字段（默认全部返回，如果IsExceptFields为true，则为排除的字段，其他字段信息都返回，且字段名为大写形式返回）；IsExceptFields：是否排除指定的字段；Where:过滤条件（默认全部获取））；
        *isAsync-是否异步（默认false）；
        *callback-回调函数（参数：成功返回gis记录数组，否则返回false）
        *返回值：成功返回gis记录数组，否则返回false
        */
        this.GetGisRecord = function (options, isAsync, callback) {
            var defaultOpts = { TableName: null, PropertiesFields: null, IsExceptFields: false, Where: null };
            var opts = $.extend(defaultOpts, options);
            isAsync = isAsync == null ? false : isAsync;//默认非异步
            var retVal = false;
            $.ajax({
                type: "post", url: self.ComSerUrl + "?action=GetGisRecord", data: { queryInfo: JSON.stringify(opts) }, async: isAsync, success: function (res) {
                    var data = eval('(' + res + ')');
                    if (data != null && data.success != null && data.success == false) {
                        alert(data.msg);
                    }
                    else {
                        retVal = data;
                    }
                    if (typeof callback == "function") {
                        callback(retVal);
                    }
                }
            });
            return retVal;
        };

        //一些通用功能函数
        this.Utility = {
            //字符串数组转换为大写形式
            ArrayToUpperCase: function (array) {
                if (array == null || array.length == 0)
                    return array;
                for (var i = 0; i < array.length; i++)
                    array[i] = array[i].toUpperCase();
                return array;
            },
            //获取url参数
            GetQueryString: function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]); return null;
            }
        }
    }
});