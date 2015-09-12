$.iwf.register(new function () {
    var me = this;
    this.options = { key: 'WorkPlanStatistics' };
    this.show = function (module, root) {
        $.Biz.WorkPlanStatistics.show(module, root);
    }
});



$.Biz.WorkPlanStatistics = new function () {
    var self = this;
    var root;
    self.data = null;
    var models = {};
    var categoriesData = [];
    var datas = [];

    //基本信息模
    models.searchDiv = $.Com.FormModel({});

    this.show = function (module, _root) {
        root = _root;
        if (root.children().length != 0) return;
        root.load("models/OA_WorkPlan/WorkPlanStatistics.html", function () {
            models.searchDiv.show(root.find("[data-id='searchDiv']"), { datetime: null, datetime1: null });
            ////查询
            //root.find("[data-id='searchBn']").bind("click", function () {
            //    var where = "1=1 ";
            //    var name = $.trim(root.find("[data-id='name']").val());
            //    if(name!="") where += " and leaver='" + name + "' ";
            //    var startTime = $.trim(root.find("[data-id='beginText']").val());
            //    var endTime = $.trim(root.find("[data-id='endText']").val());
            //    if (startTime != "") where += " and convert(varchar(20),leaveStartTime,23)>='" + startTime + "' ";
            //    if (endTime != "") where += " and convert(varchar(20),leaveEndTime,23)<='" + endTime + "' ";
            //    loadData(where) // 载入数据 
            //});


            //var myDate = new Date();  //获取当前日期
            //var date = myDate.getDate();//当前天数
            //var startTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
            //myDate.setDate(date - 29);
            //var endTime = myDate.getFullYear() + "-" + (myDate.getMonth() + 1) + "-" + myDate.getDate();
            //var where = "convert(varchar(20),leaveStartTime,23)>='" + endTime + "' ";
            //where += "and convert(varchar(20),leaveEndTime,23)<='" + startTime + "' ";
            //loadData(where) // 载入数据 

            loadData();

        });
    }


    // 载入数据
    function loadData() {
        //var par = {
        //    tablename: "V_B_OA_LeaveMain",
        //    showfield: "",
        //    where: where
        //}
        $.fxPost("B_OA_WorkPlanSvc.data?action=GetStatisticsData", {}, function (data) {
            self.data = data.data
            for (var i = 0; i < self.data.Table.length;i++){
                categoriesData.push(self.data.Table[i].date);
            }
            for (var i = 0; i < self.data.Table1.length; i++) {
                datas.push(self.data.Table1[i].id);
            }
            createStatistics();
            //data = eval('(' + data.data + ')')
           // models.gridModel.show(root.find('[data-role="listGrid"]'), data);
        });
    }


    function createStatistics() {
        root.find('[data-role="container"]').highcharts({
            chart: {
                type: 'column',
                margin: [50, 50, 100, 80]
            },
            title: {
                text: '柱状图'
            },
            xAxis: {
                categories:   ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: '尾气排放数量'
                }
            },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Population in 2008: <b>{point.y:.1f} millions</b>',
            },
            series: [{
                name: 'Population',
                data: [34, 21, 20, 20, 19, 19, 19, 18, 18,17, 16, 15],//datas,
                dataLabels: {
                    enabled: true,
                    rotation: -90,
                    color: '#FFFFFF',
                    align: 'right',
                    x: 4,
                    y: 10,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif',
                        textShadow: '0 0 3px black'
                    }
                }
            }]
        });
    }

};





