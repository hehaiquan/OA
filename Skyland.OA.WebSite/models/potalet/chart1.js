//曲线图

$.iwf.register(new function () {
    this.options = { key: 'chart1model' };
    this.show = function (module, root) {

        $divChart = $('<div data-id="lineChartContainer"  style="height:300px;"></div>');
        if (UIMode == "mouse") $divChart.css("width", "100%")
        root.append($divChart[0]);

        $divChart.highcharts({
            title: {
                text: '信访统计',
                x: -20 //center
            },
            subtitle: {
                text: '',
                x: -20
            },
            xAxis: {
                categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月']
            },
            credits: {
                enabled: false
            },
            yAxis: {
                title: {
                    text: '处理情况'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: '%',
                crosshairs: true,
                shared: true
            },
            legend: {
                align: 'center',
                verticalAlign: 'bottom'
            },
            series: [{
                name: '接受信访',
                data: [6, 5, 14, 8, 6, 12, 10, 9]
            }, {
                name: '处理情况',
                data: [5, 2, 3, 5, 5, 5, 5, 5]
            }]
        });
    }
}());


$.iwf.register(new function () {
    this.options = { key: 'chart2model' };
    this.show = function (module, root) {

        $divChart = $('<div data-id="pieChartContainer"  style="height:300px;"></div>');
        // if (UIMode == "mouse") $divChart.css("width", "450px")
        root.append($divChart[0]);

        $divChart.highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: '河涌水质超标率统计'
            },
            //tooltip: {
            //    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            //},
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer'
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                type: 'column',
                name: '合格率',
                data: [
                    ['劣Ⅴ类-1', 45.0],
                    ['劣Ⅴ类-2', 26.8],
                    {
                        name: '劣Ⅴ类-3',
                        y: 52.8,
                        sliced: true,
                        selected: true
                    },
                    ['劣Ⅴ类-4', 68.5],
                    ['劣Ⅴ类-5', 76.2],
                    ['Ⅲ类', 85.7]
                ]
            }]
        });

    }
}());



//机动车尾气  开发者黄欢
$.iwf.register(new function () {
    this.options = { key: 'VehicleGasCheckModel' };
    //var data = {
    //    categories: ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号'],
    //    series:[
    //      {name: '狮山站',      data: [5, 3, 4, 7, 2, 2, 7, 7, 8, 7, 7, 3]},
    //      {name: '大沙田站',   data: [2, 2, 3, 2, 1, 3, 4, 4, 5, 9, 8, 7]},
    //      {name: '琅东站',      data: [3, 4, 4, 2, 5, 0, 0, 0, 0, 0, 0, 0]}, 
    //      {name: '青川站',     data: [3, 4, 4, 2, 5, 0, 0, 0, 0, 0, 0, 0]},
    //      {name: '市环保监测站', data: [3, 4, 4, 2, 5, 0, 0, 0, 0, 0, 0, 0] }
    //    ]
    //}
    this.show = function (module, root) {

        $.fxPost("VehicleGasSvc.data?action=GetVehicleGasData", {}, function (data) {
            data=data.data;
            $divChart = $('<div data-id="pieChartContainer"  style="height:300px;"></div>');
            root.append($divChart[0]);
            $divChart.highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: '机动车尾气统计图'
                },
                xAxis: {
                    categories: data.categories
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '尾气排放数量'
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -70,
                    verticalAlign: 'top',
                    y: 20,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.x + '</b><br/>' +
                            this.series.name + ': ' + this.y + '<br/>' +
                            'Total: ' + this.point.stackTotal;
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                        }
                    }
                },
                series: data.series
            });

        });

    }
}());