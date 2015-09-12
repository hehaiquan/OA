
var appConfig = {
    appName: "广西壮族自治区环境监测中心站",
    isDebug: true, //是否加密url
    beMultiModel: true,//是否显示多窗口，针对移动设备，同时显示一个model
    cacheServie: "common.data?action=getDictCache",
    htmlfile: "config/UIHtml/indexpc.html",
    mapCenter: [22.816313, 108.370368],  //地图中心点，南宁
    messageService: "message.data?action=",  //if node, then:"fx/msg/"  用来适配不同的服务端，包括.net 和nodejs
    messageInterval: 150000,  //消息轮询间隔
    //netService: "",
    nodeService: ":1337/web/",
    iwfServiceTemp: null,
    themes: {
        PCLayout: [
            {
                id: "default", TempFile: 'config/UIHtml/default.html', Name: "默认", img: "resources/theme/default.png",
                CssFile: "v3/css/bootstrap.css", descript: "默认主题，适用于各种分辨率", maxWidth: 2560, minWidth: 1024, uiMode: "mouse"
            },
             {
                 id: "default0", TempFile: 'config/UIHtml/indexpc.html', Name: "南宁", img: "resources/theme/default.png",
                 CssFile: "v3/css/bootstrap.css", descript: "默认主题，适用于各种分辨率", maxWidth: 2560, minWidth: 1024, uiMode: "mouse"
             },
             {
                 id: "pc01", TempFile: 'config/UIHtml/preview.html', Name: "预览版", img: "resources/theme/default.png",
                 CssFile: "v3/css/bootstrap.css", descript: "用于实验性的主题，适用于各种分辨率", maxWidth: 2560, minWidth: 1024, uiMode: "mouse"
             },
                       {
                           id: "pcmenu", TempFile: 'config/UIHtml/startMenu.html', Name: "开始菜单", img: "resources/theme/default.png",
                           CssFile: "v3/css/bootstrap3.css", descript: "具有开始菜单，适用于各种分辨率", maxWidth: 2560, minWidth: 1024, uiConfig: "UIHtml/UIConfigMenu.json", uiMode: "mouse"
                       },
             {
                 id: "u03", TempFile: 'config/UIHtml/indexpcNoTab.html', Name: "非分页界面", img: "resources/theme/default.png",
                 CssFile: "v3/css/bootstrap4.css", descript: "适用于无新建tab页，适用于各种分辨率", maxWidth: 2560, minWidth: 1024, uiMode: "mouse"
             },
             {
                 id: "u03", TempFile: 'config/UIHtml/indexpad.html', Name: "平板布局", img: "resources/theme/default.png", uiConfig: "UIConfigPad.json", portalConfig: "UIHtml/PortalConfigPad.json",
                 CssFile: "v3/css/bootstrap3.css", descript: "平板布局，适用于中等大小分辨率，支持横屏和竖屏",
                 maxWidth: 1280, minWidth: 800, uiMode: "touch"
             },
             {
                 id: "gw", TempFile: 'config/UIHtml/indexpcgw.html', Name: "长城风格", img: "resources/theme/default.png",
                 CssFile: "v3/css/Yeti.css", descript: "传统布局模式，适合传统小型PC显示器", maxWidth: 1280, minWidth: 800, uiMode: "mouse"
             },
                                   {
                                       id: "phone01", TempFile: 'config/UIHtml/indexmini.html', Name: "新的手机主题", ID: "resources/theme/default.png",
                                       CssFile: "v3/css/bootstrap.css", descript: "适合手机，适用于小型分辨率，更流畅", maxWidth: 1024, minWidth: 300, uiMode: "touch",
                                       portalConfig: "UIHtml/PortalConfigMini.json"
                                   },
                           {
                               id: "phone02", TempFile: 'config/UIHtml/indexmini2.html', Name: "新的手机主题2", ID: "resources/theme/default.png",
                               CssFile: "v3/css/bootflat.css", descript: "适合手机，适用于小型分辨率，更流畅", maxWidth: 1024, minWidth: 300, uiMode: "touch",
                               portalConfig: "UIHtml/PortalConfigMini.json"
                           },
             {
                 id: "phone", TempFile: 'config/UIHtml/indexphone.html', Name: "蓝色主题", ID: "resources/theme/default.png",
                 CssFile: "v3/css/bootstrap.css", descript: "适合手机，适用于小型分辨率", maxWidth: 1024, minWidth: 300, uiMode: "touch",
                 uiConfig: "UIHtml/PhoneUIConfig.json", portalConfig: "PortalConfig.json"
             }
        ]

    },
    models: {},

    userMenu: [
    { url: 'usermodule.fx/com/org/ui:{title:"页面排版管理"}', text: '页面排版管理' },
    { url: 'usermodule.fx/com/org/pwd:{title:"修改密码"}', text: '修改密码' },
    //{ url: 'usermodule.userlog:{title:"查看日志"}', text: '查看日志' },
    { url: 'usermodule.fx/com/org/theme:{title:"界面样式"}', text: '界面样式' },
    //{ url: 'usermodule.fx/com/portal/setting:{title:"门户个人设置"}', text: '门户个人设置' },
    //{ handler: $.iwf.setPortalConfig, text: '门户个人设置' },
    { url: 'new.fx/com/wf/offline:{title:"准备离线"}', text: '离线应用' }
    ],
    //GIS模块的顺序调整
    gisModelConfig: {
        wsAir: { path: 'epb/GIS/airNew', title: '空气自动监测', hidden: true, closable: true },
        wsDispatch: { path: 'epb/GIS/cmdDispatch', title: "指挥调度", iconCls: 'fa fa-flag-o' },
        //wsGauss: { path: 'epb/GIS/gauss', title: '高斯扩散模型' },
        wsGps: { path: 'epb/GIS/gps', title: "GPS监控", hidden: true, closable: true },
        wsHjzl: { path: 'epb/GIS/hjzl', title: "环境质量", iconCls: 'fa fa-tint' },
        wsJdc: { path: 'epb/GIS/jdc', title: "机动车尾气监控", hidden: true, closable: true },
        wsMxfx: { path: 'epb/GIS/mxfx', title: "模型分析", hidden: true, closable: true },
        wsWater: { path: 'epb/GIS/water', title: "水环境自动监测", hidden: true, closable: true },
        wsWry: { path: 'epb/GIS/wry', title: "污染源管理", iconCls: 'fa fa-fire' },
        wsYujing: { path: 'epb/GIS/yujing', title: "预警网络", iconCls: 'fa fa-tachometer' },
        wsZxjk: { path: 'epb/GIS/zxjk', title: "污染源在线监控", hidden: true, closable: true },
    },
    doingCaseConfig: [
                   //首先按以下配置排序，再显示，未配置的业务，按流程及步骤
                   //{ text: '报建拟文', FlowID: 'W000018', ActID: 'A020', url: 'usermanage:{title:"用户管理"}', always: true },  //always标示一直出现在待办箱，不论有没有对应的业务
                   //{ text: '收文(办理件)', FlowID: 'W000067', url: '' },
                   //{ text: '收文(传阅)', FlowID: 'W000066', url: '' },
                   { text: '收文', id: 'shouwen', FlowID: "W000099", url: '' },
                   { text: '发文', id: 'fawen', FlowID: "W000098", url: '' },
                   { text: '内部事项', id: 'innerSend', FlowID: "W000100", url: '' },
                   {
                       text: '通知公告', id: 'noticePublic', FlowID: "W000089", url: ''
                   },
                   {
                       text: '请假申请', id: 'leave', FlowID: "W000079", url: ''
                   },
                   {
                       text: '出差申请', id: 'travel', FlowID: "W000080", url: ''
                   },
                   {
                       text: '会议申请', id: 'travel', FlowID: "W000071", url: ''
                   },
                   {
                       text: '车辆申请', id: 'travel', FlowID: "W000070", url: ''
                   }
    ],
    //离线服务
    offlineService: [
                    {
                        Url: "IWorkUserManage.data?action=FindAllUser",
                        Params: {}
                    },
                    {
                        Url: "engine.data?action=getstartmodelkey",
                        Params: {}
                    }
    ],
    //离线界面配置
    offlineUINav: [
                {
                    module: 'casemodule',
                    text: '我的业务',
                    closable: true,
                    iconCls: 'fa fa-home',
                    children: [
                            { key: 'doingcase', url: 'casemodule.doingcase:{}', text: '待办箱', iconCls: 'fa fa-download-alt' }
                    ]
                }
    ],
    newCaseMenu: [
        {
            "id": "oa",
            "text": "综合办公",
            "type": "group",
            "css": "list-group-item  treeview-bar",
            "unselectable": true,
            "children": [
                {
                    "id": "W000070",
                    "text": "车辆申请",
                    "css": "treeview-item btn btn-default",
                    "iconCls": "fa fa-share-square-o fa-lg"
                },
                {
                    "id": "W000071",
                    "text": "会议申请",
                    "css": "treeview-item btn btn-default",
                    "iconCls": "fa fa-share-square-o fa-lg"
                },
                {
                    "id": "W000079",
                    "text": "请假申请",
                    "css": "treeview-item btn btn-default",
                    "iconCls": "fa fa-share-square-o fa-lg"
                },
                {
                    "id": "W000080",
                    "text": "出差申请",
                    "css": "treeview-item btn btn-default",
                    "iconCls": "fa fa-share-square-o fa-lg"
                }
            ]
        }
        ,

         {
             "id": "oa",
             "text": "公文办公",
             "type": "group",
             "css": "list-group-item  treeview-bar",
             "unselectable": true,
             "children": [
                 {
                     "id": "W000098",
                     "text": "发文",
                     "css": "treeview-item btn btn-default",
                     "iconCls": "fa fa-share-square-o fa-lg"
                 },
                 {
                     "id": "W000099",
                     "text": "来文",
                     "css": "treeview-item btn btn-default",
                     "iconCls": "fa fa-share-square-o fa-lg"
                 },
                 {
                     "id": "W000100",
                     "text": "内部事项",
                     "css": "treeview-item btn btn-default",
                     "iconCls": "fa fa-share-square-o fa-lg"
                 },
                 {
                     "id": "W000089",
                     "text": "通知公告发布",
                     "css": "treeview-item btn btn-default",
                     "iconCls": "fa fa-share-square-o fa-lg"
                 }
             ]
         }
    ]
};


var ieAppVersion = 10;

if (navigator.appName == "Microsoft Internet Explorer") {
    if (navigator.appVersion.split(";")[1].replace(/[ ]/g, "") == "MSIE6.0") {
        ieAppVersion = 6;
    } else if (navigator.appVersion.match(/7./i) == "7.") {
        ieAppVersion = 7;
    }
    else if (navigator.appVersion.match(/8./i) == "8.") {
        ieAppVersion = 8;
    }
    else if (navigator.appVersion.match(/9./i) == "9.") {
        ieAppVersion = 9;
    }
}

