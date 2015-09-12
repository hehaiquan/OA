define(function () {
    return new function () {

        var IWorkFlow = {

            Rectangle: function (px, py, w, h) {

                var mw = w / 2;
                var mh = h / 2;
                this.x = px;
                this.y = py;
                var sx = px - w / 2;
                var sy = py - h / 2;

                this.move = function (px, py) {
                    this.x = px;
                    this.y = py;
                    sx = px - w / 2;
                    sy = py - h / 2;
                };

                this.lineTo = function (cxt, offset, start) {
                    if (start) cxt.moveTo(this.x - 0.5 + offset.x, this.y - 0.5 + offset.y);
                    else cxt.lineTo(this.x - 0.5 + offset.x, this.y - 0.5 + offset.y);
                };

                this.check = function (px, py) {
                    if (px > sx && px < (sx + w) && py > sy && py < (sy + h)) return true;
                    else return false;
                };

                var offX = 0;
                this.setIndex = function (index) {
                    offX = index * w;
                };

                this.drowImage = function (cxt, img, offset) {
                    if (offX > -1) cxt.drawImage(img, offX, 0, w, h, sx + offset.x, sy + offset.y, w, h);
                };
            },

            ActionItem: function (engine, type) {

                this.config = {
                    ID: engine.getID("A"),
                    Name: "新节点",
                    Text: '',
                    Limit: 0,
                    Type: (type) ? type : 'COMM',
                    Location: { x: 0, y: 0 },
                    Resources: []
                };

                var keyIndex = { START: 0, COMM: 1, LINK: 4, SUB: 5, COO: 7, AUTO: 4, SPLIT: 2, JOIN: 3, END: 6 };

                var bgIndex = 0;
                //var iconIndex = keyIndex[this.config.Type];
                var unit = 48, pUnit = 6, hu = 24;
                var rect = new IWorkFlow.Rectangle(0, 0, unit, unit);
                var points = [
                    new IWorkFlow.Rectangle(0, 0, pUnit, pUnit),
                    new IWorkFlow.Rectangle(0, 0, pUnit, pUnit),
                    new IWorkFlow.Rectangle(0, 0, pUnit, pUnit),
                    new IWorkFlow.Rectangle(0, 0, pUnit, pUnit),
                    new IWorkFlow.Rectangle(0, 0, pUnit, pUnit),
                    new IWorkFlow.Rectangle(0, 0, pUnit, pUnit),
                    new IWorkFlow.Rectangle(0, 0, pUnit, pUnit),
                    new IWorkFlow.Rectangle(0, 0, pUnit, pUnit)
                ];


                function movePoint(x, y) {
                    points[0].move(x, y - hu);
                    points[1].move(x + hu, y - hu);
                    points[2].move(x + hu, y);
                    points[3].move(x + hu, y + hu);
                    points[4].move(x, y + hu);
                    points[5].move(x - hu, y + hu);
                    points[6].move(x - hu, y);
                    points[7].move(x - hu, y - hu);
                };

                this.getPosition = function () {
                    return { x: rect.x, y: rect.y };
                };

                this.checkPoint = function (point) {
                    for (var i = 0; i < 8; i++) {
                        if (points[i] == point) return i;
                    }
                    return -1;
                };

                this.getPoint = function (x, y, index) {
                    if (index > -1) return points[index];
                    for (var i = 0; i < 8; i++) {
                        if (Math.abs(points[i].x - x) < 10 && Math.abs(points[i].y - y) < 10) {
                            return points[i];
                        }
                    }
                };

                this.load = function (ins) {
                    this.config = ins;
                    rect.move(ins.Location.x, ins.Location.y);
                    //iconIndex = keyIndex[this.config.Type];
                    movePoint(ins.Location.x, ins.Location.y);
                    showPoint(ins.Location.x, ins.Location.x, -1);
                };

                this.getJson = function () {
                    this.config.Location.x = rect.x;
                    this.config.Location.y = rect.y;
                    return this.config;
                };

                var isSelect, isDown;
                this.mouseDown = function (x, y) {
                    isDown = true;
                    //新节点
                    if (rect.x == 0 && rect.y == 0) {
                        rect.move(x, y);
                        movePoint(x, y);
                        showPoint(x, y, -1);
                        isSelect = true;
                    } else {
                        isSelect = rect.check(x, y);
                    }
                    return isSelect;
                };

                this.mouseUp = function (x, y) {
                    isDown = false;
                    return true;
                };

                function showPoint(x, y, index) {
                    for (var i = 0; i < 8; i++) {
                        points[i].setIndex(index);
                        if (index > -1 && Math.abs(points[i].x - x) < 10 && Math.abs(points[i].y - y) < 10) {
                            points[i].setIndex(2);
                        }
                    }
                };

                this.mouseMove = function (x, y, isPoint) {
                    if (isDown && isSelect) {
                        rect.move(x, y);
                        movePoint(x, y);
                    }
                    if (rect.check(x, y)) {
                        bgIndex = 1;
                        if (isPoint) showPoint(x, y, 1);
                    } else {
                        bgIndex = 0;
                        showPoint(x, y, -1);
                    }
                };

                var delRec = new IWorkFlow.Rectangle(0, 0, 12, 12);
                delRec.setIndex(5);
                var editRec = new IWorkFlow.Rectangle(0, 0, 12, 12);
                editRec.setIndex(6);

                this.menuClick = function (ex, ey) {
                    if (editRec.check(ex, ey)) return "edit";
                    if (delRec.check(ex, ey)) return "delete";
                };

                this.drowMenu = function (cxt, offset) {
                    editRec.move(rect.x - 18, rect.y - 30);
                    editRec.drowImage(cxt, engine.lineBgImg, offset);
                    delRec.move(rect.x - 6, rect.y - 30);
                    delRec.drowImage(cxt, engine.lineBgImg, offset);
                };

                this.drow = function (cxt, offset) {

                    if (isSelect || this.config.Text) rect.setIndex(2);
                    else rect.setIndex(bgIndex);
                    rect.drowImage(cxt, engine.actionBgImg, offset);

                    rect.setIndex(keyIndex[this.config.Type]);
                    rect.drowImage(cxt, engine.iconImg, offset);
                    for (var i = 0; i < 8; i++) {
                        points[i].drowImage(cxt, engine.pointBgImg, offset);
                    }
                    var text = this.config.Name;
                    if (this.config.Text) {
                        var text = this.config.Name + ' [' + this.config.Text + ']';
                        cxt.fillStyle = 'red';
                        cxt.fillText(text, rect.x - cxt.measureText(text).width / 2 + offset.x, rect.y + 38 + offset.y);
                        cxt.fillStyle = 'black';
                    } else {
                        cxt.fillText(text, rect.x - cxt.measureText(text).width / 2 + offset.x, rect.y + 38 + offset.y);
                    }
                }
            },

            LineItem: function (engine) {

                this.config = {
                    ID: engine.getID("T"),
                    Text: '',
                    From: { ID: '', Index: '' },
                    To: { ID: '', Index: '' },
                    Location: { x: 0, y: 0 },
                    Relation: []
                };

                var unit = 6;
                var startPoint, minPoint, endPoint, curPoint;
                var lineColor = ["#666666", "#0EB21E", "#FF0000"];
                var index = 0, isSelect;

                this.load = function (ins) {
                    this.config = ins;
                    startPoint = engine.getActPoint(0, 0, ins.From.ID, ins.From.Index);
                    endPoint = engine.getActPoint(0, 0, ins.To.ID, ins.To.Index);
                    minPoint = new IWorkFlow.Rectangle(ins.Location.x, ins.Location.y, 12, 12);
                };

                this.getJson = function () {
                    this.config.Location.x = minPoint.x;
                    this.config.Location.y = minPoint.y;
                    this.config.From = engine.getConnectInfo(startPoint);
                    this.config.To = engine.getConnectInfo(endPoint);
                    if (this.config.From && this.config.To) {
                        return this.config;
                    } else {
                        return null;
                    }
                };

                var isAddPoint;
                this.addPoint = function (x, y) {
                    isAddPoint = true;
                    if (!startPoint) {
                        var tp = engine.getActPoint(x, y);
                        startPoint = (tp) ? tp : new IWorkFlow.Rectangle(x, y, unit, unit);
                        this.config.From = engine.getConnectInfo(startPoint);

                        minPoint = new IWorkFlow.Rectangle(x, y, 12, 12);
                        endPoint = new IWorkFlow.Rectangle(x, y, unit, unit);
                        curPoint = endPoint;
                        return false;
                    } else {
                        var tp = engine.getActPoint(x, y);
                        if (tp) endPoint = tp;
                        this.config.To = engine.getConnectInfo(endPoint);

                        curPoint = null;
                        isAddPoint = false;
                        return true;
                    }
                };

                this.mouseDown = function (x, y) {
                    isSelect = true;
                    if (startPoint.check(x, y)) {
                        curPoint = startPoint;
                    } else if (minPoint.check(x, y)) {
                        curPoint = minPoint;
                    } else if (endPoint.check(x, y)) {
                        curPoint = endPoint;
                    } else {
                        index = 0;
                        isSelect = false;
                    }
                    return isSelect;
                };

                this.mouseUp = function (x, y) {
                    if (!isAddPoint) curPoint = null;
                    return false;
                };

                this.mouseMove = function (x, y) {
                    if (isAddPoint) {
                        curPoint.move(x, y);
                        minPoint.move((x + startPoint.x) / 2, (y + startPoint.y) / 2);
                    } else if (curPoint) {
                        index = 2;
                        var tempX = x, tempY = y;
                        if (curPoint == minPoint) {

                            if (Math.abs(startPoint.x - x) < 10)
                                tempX = startPoint.x;
                            else if (endPoint && Math.abs(endPoint.x - x) < 10)
                                tempX = endPoint.x;

                            if (Math.abs(startPoint.y - y) < 10)
                                tempY = startPoint.y;
                            else if (endPoint && Math.abs(endPoint.y - y) < 10)
                                tempY = endPoint.y;
                        }
                        curPoint.move(tempX, tempY);
                    } else if (startPoint.check(x, y) || minPoint.check(x, y) || endPoint.check(x, y)) {
                        index = 1;
                    } else {
                        index = 0;
                    }
                };

                function getMinIndex(mp, ep) {
                    if (!ep || (ep.x == mp.x && ep.y == mp.y)) return 4;
                    else if (ep.y == mp.y) return (ep.x > mp.x) ? 0 : 2;
                    else if (ep.x == mp.x) return (ep.y > mp.y) ? 1 : 3;
                    else {
                        var index = (ep.x - mp.x) / (ep.y - mp.y);
                        if (index >= 1 || index <= -1) return (ep.x > mp.x) ? 0 : 2;
                        else if (index > -1 && index < 1) return (ep.y > mp.y) ? 1 : 3;
                    }
                };

                var delRec = new IWorkFlow.Rectangle(0, 0, 12, 12);
                delRec.setIndex(5);
                var editRec = new IWorkFlow.Rectangle(0, 0, 12, 12);
                editRec.setIndex(6);

                this.menuClick = function (ex, ey) {
                    if (editRec.check(ex, ey)) return "edit";
                    if (delRec.check(ex, ey)) return "delete";
                };

                this.drowMenu = function (cxt, offset) {
                    editRec.move(minPoint.x, minPoint.y - 12);
                    editRec.drowImage(cxt, engine.lineBgImg, offset);
                    delRec.move(minPoint.x + 12, minPoint.y - 12);
                    delRec.drowImage(cxt, engine.lineBgImg, offset);
                };

                var regex = /\[[^\[]+\]/ig;
                this.drow = function (cxt, offset) {
                    var tIndex = (isSelect || this.config.Text) ? 2 : index;
                    cxt.strokeStyle = lineColor[tIndex];
                    cxt.beginPath();
                    startPoint.lineTo(cxt, offset, true);
                    minPoint.lineTo(cxt, offset);
                    if (endPoint) endPoint.lineTo(cxt, offset);
                    cxt.stroke();

                    startPoint.setIndex(tIndex);
                    startPoint.drowImage(cxt, engine.pointBgImg, offset);

                    minPoint.setIndex(getMinIndex(minPoint, endPoint));
                    minPoint.drowImage(cxt, engine.lineBgImg, offset);

                    if (endPoint) {
                        endPoint.setIndex(tIndex);
                        endPoint.drowImage(cxt, engine.pointBgImg, offset);
                    }

                    if (this.config.Text) {
                        var arr = this.config.Text.match(regex);
                        if (arr) {
                            var x = minPoint.x - cxt.measureText(arr[0]).width / 2;
                            for (var i = 0; i < arr.length; i++) {
                                cxt.fillText(arr[i], x + offset.x, minPoint.y - 10 - i * 16 + offset.y);
                            }
                        }
                    }
                }
            }
        };


        IWorkFlow.WorkFlowDesign = function (el, config) {

            var This = this;
            var command, actType = "COMM";
            var items = new Array();
            var curItem, tempItem;

            var defConfig = {
                ID: "W999999", Name: "新流程",
                FlowType: 'FLOW', Limit: 0,
                Forms: [], Resources: [],
                Roles: [], Activities: [], Transitions: []
            };

            this.config;

            loadIndex = 0;
            function imgOnload() {
                loadIndex++;
                if (loadIndex == 4) {
                    This.draw();
                    if (config.callback) config.callback();
                }
            };
            var path = "images";
            if (config.path) path = config.path;
            this.actionBgImg = new Image();
            this.actionBgImg.src = path + "/iconbg.png";
            this.actionBgImg.onload = imgOnload;

            this.iconImg = new Image();
            this.iconImg.src = path + "/icon.png";
            this.iconImg.onload = imgOnload;

            this.pointBgImg = new Image();
            this.pointBgImg.src = path + "/point.png";
            this.pointBgImg.onload = imgOnload;

            this.lineBgImg = new Image();
            this.lineBgImg.src = path + "/linebg.png";
            this.lineBgImg.onload = imgOnload;

            var canvas = (typeof (el) == "string") ? document.getElementById(el) : el;
            var cxt = canvas.getContext("2d");
            cxt.font = "12px Calibri";
            cxt.lineWidth = 1;

            this.getID = function (symbol) {
                var re = new RegExp(symbol + "0*([1-9].*)", "ig");
                var sb = symbol + "000";
                for (var i = 0; i < items.length; i++) {
                    if (items[i].config.ID.substr(0, 1) == symbol && items[i].config.ID > sb) {
                        sb = items[i].config.ID;
                    }
                }
                var values = re.exec(sb);
                if (values) sb = parseInt(values[1]) + 1;
                else sb = 1;
                var t = symbol;
                if (sb > 9 && sb < 100) t += "0";
                else if (sb < 10) t += "00";
                return t + sb;
            };

            this.getActPoint = function (x, y, actid, index) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].getPoint) {
                        if (actid) {
                            if (items[i].config.ID == actid) {
                                return items[i].getPoint(0, 0, index);
                            }
                        } else {
                            var tp = items[i].getPoint(x, y);
                            if (tp) return tp;
                        }
                    }
                }
            };

            this.getActByID = function (id) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].config.ID == id) {
                        return items[i];
                    }
                }
            };

            this.getConnectInfo = function (point) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].checkPoint) {
                        var t = items[i].checkPoint(point);
                        if (t > -1) {
                            return { ID: items[i].config.ID, Index: t };
                        }
                    }
                }
            };

            this.load = function (ins) {
                pointInfo.offx = 0;
                pointInfo.offy = 0;
                this.config = (ins) ? ins : defConfig;
                items.splice(0, items.length);
                for (var i = 0; i < this.config.Activities.length; i++) {
                    var tp = new IWorkFlow.ActionItem(This);
                    tp.load(this.config.Activities[i]);
                    items.push(tp);
                }
                for (var i = 0; i < this.config.Transitions.length; i++) {
                    var temp = this.config.Transitions[i];
                    var line = new IWorkFlow.LineItem(This);
                    line.load(this.config.Transitions[i]);
                    items.push(line);
                }
            };

            this.getModel = function () {
                this.config.Activities.splice(0, this.config.Activities.length);
                this.config.Transitions.splice(0, this.config.Transitions.length);
                for (var i = 0; i < items.length; i++) {
                    var t = items[i].getJson();
                    if (t && t.Type) {
                        this.config.Activities.push(t);
                    } else if (t && t.From && t.To) {
                        this.config.Transitions.push(t);
                    }
                }
                return this.config;
            };

            //addact,addline,move,runtime,delete
            this.setCommand = function (key, type) {
                curItem = null;
                command = key;
                if (type) actType = type;
            };

            //设置业务办理过程
            this.setProcess = function (process) {
                for (var i = 0; i < items.length; i++) {
                    var config = items[i].config;
                    config.Text = '';
                    if (config.From && config.To) {
                        for (var k = 0; k < process.trans.length; k++) {
                            var t = process.trans[k];
                            if (t.From == config.From.ID && t.To == config.To.ID) {
                                config.Text += "[" + t.Text + "]";
                            }
                        }
                    } else {
                        for (var j = 0; j < process.acts.length; j++) {
                            if (process.acts[j].ID == config.ID) {
                                config.Text = process.acts[j].Text;
                                break;
                            }
                        }
                    }
                }
            };

            this.mouseDowm = function (e) {
                pointInfo.ox = e.offsetX || e.layerX, pointInfo.oy = e.offsetY || e.layerY;
                var ex = pointInfo.ox - pointInfo.offx, ey = pointInfo.oy - pointInfo.offy;
                switch (command) {
                    case "addact":
                        curItem = new IWorkFlow.ActionItem(This, actType);
                        curItem.mouseDown(ex, ey);
                        items.push(curItem);
                        command = "move";
                        break;
                    case "addline":
                        if (!curItem) {
                            curItem = new IWorkFlow.LineItem(This);
                            items.push(curItem);
                        }
                        if (curItem.addPoint(ex, ey)) {
                            command = "move";
                        }
                        break;
                    case "move":
                        if (curItem && curItem.menuClick) {
                            var key = curItem.menuClick(ex, ey);
                            if (key == 'edit') {
                                This.dbclick();
                                break;
                            } else if (key == 'delete') {
                                for (var i = 0; i < items.length; i++) {
                                    if (items[i] == curItem) {
                                        items.splice(i, 1);
                                        curItem == null;
                                        break;
                                    }
                                }
                            }
                        }
                        curItem = null;
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].mouseDown(ex, ey)) {
                                curItem = items[i];
                            }
                        }
                        break;
                    case "runtime":
                        curItem = null;
                        for (var i = 0; i < items.length; i++) {
                            if (items[i].mouseDown(ex, ey)) {
                                curItem = items[i];
                            }
                        }
                        break;
                    case "delete":
                        curItem = null;
                        for (var i = items.length - 1; i > -1; i--) {
                            if (items[i].mouseDown(ex, ey)) {
                                items.splice(i, 1);
                            }
                        }
                        command = "move";
                        break;
                }
                pointInfo.button = (e.buttons > 0) ? e.buttons : e.button;
                This.draw();
            };

            var pointInfo = { button: 0, offx: 0, offy: 0, x: 0, y: 0, ox: 0, oy: 0 };

            this.mouseUp = function (e) {
                pointInfo.x = e.offsetX || e.layerX, pointInfo.y = e.offsetY || e.layerY;
                var ex = pointInfo.x - pointInfo.offx, ey = pointInfo.y - pointInfo.offy;
                for (var i = 0; i < items.length; i++) {
                    items[i].mouseUp(ex, ey)
                }
                pointInfo.button = 0;
                This.draw();
            };

            this.mouseMove = function (e) {

                pointInfo.x = e.offsetX || e.layerX, pointInfo.y = e.offsetY || e.layerY;
                var ex = pointInfo.x - pointInfo.offx, ey = pointInfo.y - pointInfo.offy;
                var tx = ex, ty = ey;

                for (var i = 0; i < items.length; i++) {
                    if (items[i] != curItem) {
                        items[i].mouseMove(ex, ey, (command == "addline"));
                        if (curItem && curItem.getPosition) {
                            if (items[i].getPosition) {
                                var temp = items[i].getPosition();
                                if (Math.abs(tx - temp.x) < 10) tx = temp.x;
                                if (Math.abs(ty - temp.y) < 10) ty = temp.y;
                            }
                        }
                    }
                }
                if (curItem && command != "runtime") {
                    curItem.mouseMove(tx, ty, (command == "addline"));
                }

                //移动整个图
                if ((!curItem || command == 'runtime') && pointInfo.button == 2) {
                    pointInfo.offx += pointInfo.x - pointInfo.ox, pointInfo.offy += pointInfo.y - pointInfo.oy;
                    pointInfo.ox = pointInfo.x, pointInfo.oy = pointInfo.y;
                }

                This.draw();
            };

            this.dbclick = function (e) {
                if (config.dbclick) {
                    if (curItem) config.dbclick(curItem);
                    else config.dbclick(This);
                }
            };

            this.draw = function () {
                cxt.clearRect(0, 0, canvas.width, canvas.height);
                for (var i = 0; i < items.length; i++) {
                    //if(items[i] != curItem) 
                    items[i].drow(cxt, { x: pointInfo.offx, y: pointInfo.offy });
                }
                //if(curItem) curItem.drow(cxt);
                if (this.config) {
                    cxt.fillText("[ " + this.config.ID + " ] " + this.config.Name, 5, 15);
                }
                if (curItem && curItem.drowMenu && command != 'runtime') {
                    curItem.drowMenu(cxt, { x: pointInfo.offx, y: pointInfo.offy });
                }
            };

            canvas.addEventListener("mousedown", this.mouseDowm);
            canvas.addEventListener("mouseup", this.mouseUp);
            canvas.addEventListener("mousemove", this.mouseMove);
            canvas.addEventListener("dblclick", this.dbclick);
        };



        $.Com.addStyle("fx/sys/workflowmodel.css");

        var me = this;
        this.options = { key: 'workflowdesign' };
        var leftpanel, design;

        var wfConfig = {
            path: "fx/sys/images",
            //双击
            dbclick: function (it) {
                if (it == design) {
                } else if (it.config.ID.indexOf("T") == 0) {
                    showTransLineInfo(it.config);
                } else if (it.config.ID.indexOf("A") == 0) {

                    var params = { "flowid": design.config.ID, "actid": it.config.ID };
                    $.fxPost("engine.data?action=getrecActsUsers", params, function (lstActmodel) {

                        var GrepArr = $.grep(lstActmodel, function (a) { return a.ID == it.config.ID; });
                        if (GrepArr.length == 0) { alert("该步骤并未连线保存过,请连线保存后再试"); return; }
                        showActivityInfo(it.config);
                    }, function (err) {
                        alert("未正确拿到所有步骤,请确认步骤都连线保存过 : " + err.msg);
                    });
                }
            }
        }

        function showTransLineInfo(config) {
            alert("此功能停用");
            return;
            //设置发送树
            //design
            //debugger;
            function setSender(root) {
                var sendRoles = design.getActByID(config.From.ID);
                var sendStr = '';
                if (!sendRoles.config.Roles) sendRoles.config.Roles = [];
                $.each(sendRoles.config.Roles, function (i, role) {
                    if (sendStr) sendStr += ",";
                    sendStr += role.ID;
                });
                $.getJSON("org.data?action=queryroles&ttt=" + Math.random(), { condition: "RID in " + sendStr }, function (json) {
                    var data = [];
                    $.each(json.roles, function (i, item) {
                        data.push({ id: item.RID, name: item.RoleName, open: true });
                    });
                    $.each(json.users, function (i, item) {
                        data.push({ id: item.UserID, pid: item.RID, name: item.CnName });
                    });
                    $.fn.zTree.init(root, {
                        data: {
                            simpleData: { enable: true, idKey: "id", pIdKey: "pid" }
                        },
                        callback: {
                            onClick: function (event, id, node) {
                                if (node.level == 1) {
                                    receTreeConfig.addNode(node.id, node.name);
                                }
                            }
                        }
                    }, data);
                });

            }

            var receTreeConfig = {
                data: {
                    simpleData: { enable: true, idKey: "id", pIdKey: "pid" }
                },
                callback: {
                    onClick: function (event, id, node) {
                        if (node.level == 0) receTreeConfig.parent = node;
                        else receTreeConfig.parent = null;
                    }
                },
                addNode: function (id, text) {
                    if (receTreeConfig.parent) {
                        var oNode = receTreeConfig.view.getNodeByParam("id", id + "-c");
                        if (oNode) {
                            receTreeConfig.view.moveNode(receTreeConfig.parent, oNode, "inner");
                        } else {
                            var newNode = { name: text, id: id + "-c" };
                            receTreeConfig.view.addNodes(receTreeConfig.parent, newNode);
                        }
                    }
                },
                save: function () {
                    var nodes = receTreeConfig.view.getNodes();
                    config.Relation.splice(0, config.Relation.length);
                    $.each(nodes, function (i, parent) {
                        var rece = { ID: parent.id, Name: parent.name, FromUser: [] };
                        if (parent.children) {
                            $.each(parent.children, function (j, item) {
                                rece.FromUser.push({ ID: item.id.substr(0, item.id.length - 2), Name: item.name });
                            });
                            config.Relation.push(rece);
                        }
                    });
                }
            }

            //设置接收树
            function setRecever(root) {

                function checkUser(arr, id) {
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].id == id) return true;
                    }
                    return false;
                }
                var receRoles = design.getActByID(config.To.ID);
                var receStr = '';
                if (!receRoles.config.Roles) receRoles.config.Roles = [];
                $.each(receRoles.config.Roles, function (i, role) {
                    if (receStr) receStr += ",";
                    receStr += role.ID;
                });
                $.getJSON("org.data?action=queryroles&ttt=" + Math.random(), { condition: "RID in " + receStr }, function (json) {
                    var data = [];
                    $.each(json.users, function (i, item) {
                        if (!checkUser(data, item.UserID)) {
                            data.push({ id: item.UserID, name: item.CnName, open: true });
                        }
                    });
                    $.each(config.Relation, function (i, parent) {
                        $.each(parent.FromUser, function (j, item) {
                            if (!checkUser(data, item.ID + "-c")) {
                                data.push({ id: item.ID + "-c", name: item.Name, pid: parent.ID });
                            }
                        });
                    });
                    receTreeConfig.view = $.fn.zTree.init(root, receTreeConfig, data);
                });
            }

            var win = $('body').iwfWindow({
                title: '默认发送定义',
                width: 800, height: 650,
                button: [{
                    text: '确定', handler: function (data) {
                        receTreeConfig.save();
                        win.close();
                    }
                }, {
                    text: '取消', handler: function () { win.close(); }
                }]
            });
            win.load("fx/sys/tranlineinfo.html", function () {
                setRecever($(this).find("#recevertree"));
                setSender($(this).find("#sendertree"));
            });

        }

        function showActivityInfo(config) {

            function initForm(root) {
                var tree, tab;
                tab = root.find("[data-id='activity-tab-info-content']")
                if (tab.length > 0) {
                    if (config.ID) root.find("[field=节点编号]").text(config.ID);
                    if (config.Type) root.find("[field=节点类型]").text(config.Type);
                    if (config.Name) root.find("[field=节占名称]").val(config.Name);
                    if (config.Key) root.find("[field=节占Key]").val(config.Key);

                    if (config.Limit != undefined) root.find("[field=节占时限]").val(config.Limit);
                    if (config.MultWorkType) root.find("[field=协同类型]").val(config.MultWorkType);
                    if (config.Description) root.find("[field=描述]").val(config.Description);
                }

                tab = root.find("[data-id='activity-tab-toolbar-content']")
                if (tab.length > 0) {
                    if (config.ToolActSetting == undefined) config.ToolActSetting = new Object();//没有就New一个
                    if (config.ToolActSetting) {
                        if (config.ToolActSetting.IsDisplayAttachBtn)
                            root.find("[name=附件上传按钮][value=" + config.ToolActSetting.IsDisplayAttachBtn + "]").attr("checked", "checked");
                        if (config.ToolActSetting.IsDisplayRemarkBox)
                            root.find("[name=评阅意见框][value=" + config.ToolActSetting.IsDisplayRemarkBox + "]").attr("checked", "checked");
                        if (config.ToolActSetting.IsDisplayEndBtn)
                            root.find("[name=办结按钮][value=" + config.ToolActSetting.IsDisplayEndBtn + "]").attr("checked", "checked");
                        if (config.ToolActSetting.IsDisplayBackBtn)
                            root.find("[name=回退按钮][value=" + config.ToolActSetting.IsDisplayBackBtn + "]").attr("checked", "checked");
                        if (config.ToolActSetting.IsDisplaySendBtn)
                            root.find("[name=发送按钮][value=" + config.ToolActSetting.IsDisplaySendBtn + "]").attr("checked", "checked");
                        if (config.ToolActSetting.IsDisplayRemarkList)
                            root.find("[name=审阅意见列表][value=" + config.ToolActSetting.IsDisplayRemarkList + "]").attr("checked", "checked");
                    }
                    var btn = tab.find("[iwftype = editFormReadOnly]");

                    btn.click(function () {
                        if (!config.ToolActSetting.FormReadOnlySetting) config.ToolActSetting.FormReadOnlySetting = new Object();

                        //彭博Demo已经个人合理化封装,觉得合适可随时移入$.iwf.JsonDesign中给予共用
                        function JsonDesign(JsonObj, OKCallback) {
                            $.iwf.getModel("$.iwf.MaxJsonEditor", function (model) {
                                var JsonWin = $('body').iwfWindow({
                                    button: [
                                        {
                                            text: '确定', handler: function (data) {
                                                if (OKCallback) { OKCallback(model.GetThisJson()) };
                                                JsonWin.close();
                                            }
                                        },
                                        { text: '取消', handler: function () { JsonWin.close(); } }]
                                });

                                model.show(null, Jsonroot,
                                    {
                                        "JsonText": JSON.stringify(JsonObj)
                                    });
                            });
                        }

                        JsonDesign(config.ToolActSetting.FormReadOnlySetting, function (json) {
                            config.ToolActSetting.FormReadOnlySetting = eval("(" + json + ")");
                        });

                    });
                }

                tab = root.find("[data-id='activity-tab-form-content']")
                var formtree = tab.children("ul.ztree");
                if (tab.length > 0) {
                    var formSource = [];
                    //构造树的过程
                    $.each(design.config.Forms, function (index, form) {
                        var temp = { id: form.ID, name: form.Name };
                        formSource.push(temp);
                    });
                    formtree.frametree({
                        treesource: formSource,
                        EndCheckChangeEvent: function (event, ui) {
                            var arr = formtree.frametree("GetAllCheckNodes");
                            config.Forms = new Array();
                            $.each(arr, function (index, node) {
                                config.Forms.push({ ID: node.id, Name: node.name });
                            });
                        }
                    });
                    if (config.Forms) formtree.frametree("SetEndLICheckBox", config.Forms.PickByField("ID"));

                }

                tab = root.find("[data-id='activity-tab-role-content']")
                var roletree = tab.children("ul.ztree");
                if (tab.length > 0) {
                    var roleSource = [];
                    //构造树的过程
                    $.each(design.config.Roles, function (index, role) {
                        var temp = { id: role.ID, name: role.Name };
                        roleSource.push(temp);
                    });

                    roletree.frametree({
                        treesource: roleSource,
                        EndCheckChangeEvent: function (event, ui) {
                            var arr = roletree.frametree("GetAllCheckNodes");
                            config.Roles = new Array();
                            $.each(arr, function (index, node) {
                                config.Roles.push({ ID: node.id, Name: node.name });
                            });
                        }
                    });

                    if (config.Roles) roletree.frametree("SetEndLICheckBox", config.Roles.PickByField("ID"));


                }

                //tab = root.find("[data-id='activity-tab-flow-content']")
                //var  flowtree = tab.children("ul.ztree");
                //if (tab.length > 0) {

                var tree_permit = root.find("[data-id=canSendtree]");
                var tree_default = root.find("[data-id=defaultSendtree]");
                var tree_Source = [];
                var tree_ParentSource = [];

                //发送权限
                if (config.PermitSendActs == undefined) config.PermitSendActs = new Array();
                //构造树数据源的过程
                design.getModel();// WorkflowAll_Acts,
                $.each(design.getModel().Activities, function (index, ent) {
                    var obj = new Object();
                    obj["id"] = ent.ID;
                    obj["name"] = ent.Name;
                    tree_Source.push(obj);
                });

                tree_ParentSource.push({ "id": "all", "name": "所有步骤", children: tree_Source });

                tree_permit.frametree({
                    treesource: tree_ParentSource,
                    EndCheckChangeEvent: function (event, ui) {
                        var arr = tree_permit.frametree("GetAllCheckNodes");
                        config.PermitSendActs = new Array();
                        $.each(arr, function (index, node) {
                            config.PermitSendActs.push({ ID: node.id, Name: node.name });
                        });
                    }
                });
                tree_permit.frametree("SetEndLICheckBox", config.PermitSendActs.PickByField("ID"));
                //默认发送
                tree_default.frametree({
                    treesource: tree_ParentSource,
                    onlycheckone: true,
                    EndCheckChangeEvent: function (event, ui) {
                        var arr_default = tree_default.frametree("GetAllCheckNodes");
                        if (arr_default.length == 0) delete config.DefaultAct;
                        else {
                            config.DefaultAct = new Object();
                            config.DefaultAct["ID"] = arr_default[0].id;
                            config.DefaultAct["Name"] = arr_default[0].name;
                        }
                    }
                });
                if (config.DefaultAct) tree_default.frametree("SetEndLICheckBox", [config.DefaultAct["ID"]]);

                //}

                tab = root.find("[data-id='activity-tab-defaltReceive-content']")
                var defaltReceivetree = tab.children("ul.ztree");
                if (tab.length > 0) {
                    if (!config.Roles || config.Roles.length == 0) config.Roles = [];
                    var params = { lstID: JSON.stringify(config.Roles.PickByField("ID")) };
                    $.fxPost("engine.data?action=GetReceiversTreeByRole", params, function (obj) {
                        obj.push(
                           {
                               id: "cjr",
                               name: "系统角色",
                               IcoClass: "",
                               IsOpen: true,
                               IsParent: false,
                               check: false,
                               children: [{
                                   IcoClass: "",
                                   IsOpen: true,
                                   IsParent: false,
                                   check: false,
                                   id: "startStraff", name: "业务发起人"
                               }, {
                                   IcoClass: "",
                                   IsOpen: true,
                                   IsParent: false,
                                   check: false,
                                   id: "preStraff", name: "上一步骤提交人"
                               }]
                           }
                            );
                        defaltReceivetree.frametree({
                            treesource: obj,
                            EndCheckChangeEvent: function (event, ui) {
                                var arr = defaltReceivetree.frametree("GetAllCheckNodes");
                                if (arr.length == 0) delete config.DefaltReceivePerson;
                                else {
                                    config.DefaltReceivePerson = new Array();
                                    $.each(arr, function (index, node) {
                                        config.DefaltReceivePerson.push({ ID: node.id, Name: node.name });
                                    });
                                }
                            }
                        });
                        if (config.DefaltReceivePerson && config.DefaltReceivePerson.length > 0) {
                            var arr = new Array();
                            for (var i = 0; i < config.DefaltReceivePerson.length; i++) {
                                var ent = config.DefaltReceivePerson[i];
                                var value = ent["ID"] || ent["id"];//一切都是为了兼容旧数据
                                arr.push(value);
                            }
                            defaltReceivetree.frametree("SetEndLICheckBox", arr);
                        }
                    });

                }

            }


            var win = $('body').iwfWindow({
                title: '节点管理',
                width: 800, height: 1050,
                button: [{
                    text: '确定', handler: function (data) {
                        //
                        config.ID = win.content().find("[field=节点编号]").text();
                        config.Type = win.content().find("[field=节点类型]").text();
                        config.Name = win.content().find("[field=节占名称]").val();
                        config.Key = win.content().find("[field=节占Key]").val();
                        config.Limit = win.content().find("[field=节占时限]").val();
                        config.MultWorkType = win.content().find("[field=协同类型]").val();
                        config.Description = win.content().find("[field=描述]").val();
                        //
                        if (!config.ToolActSetting) config.ToolActSetting = new Object();
                        config.ToolActSetting.IsDisplayAttachBtn = win.content().find("[name=附件上传按钮]:checked").val();
                        config.ToolActSetting.IsDisplayRemarkBox = win.content().find("[name=评阅意见框]:checked").val();
                        config.ToolActSetting.IsDisplayEndBtn = win.content().find("[name=办结按钮]:checked").val();
                        config.ToolActSetting.IsDisplayBackBtn = win.content().find("[name=回退按钮]:checked").val();
                        config.ToolActSetting.IsDisplaySendBtn = win.content().find("[name=发送按钮]:checked").val();
                        config.ToolActSetting.IsDisplayRemarkList = win.content().find("[name=审阅意见列表]:checked").val();
                        //
                        if (!config.Roles || config.Roles.length == 0) {
                            $.Com.confirm("未选中任何角色,将找到不到接收人,是否确认关闭", function () {
                                win.close();
                            });
                        } else
                            win.close();
                    }
                }, {
                    text: '取消', handler: function () { win.close(); }
                }]
            });
            win.load("fx/sys/wfActivityModel.html", function () {
                //$(this).iwfTab({ tabchange: tabChange });
                initForm(win.content());
            });
        }

        function loadModelUI(flowid, actid) {
            $.fxPost("engine.data?action=getmodel", { flowid: flowid }, function (data) {
                design.load(data);
                if (!data) {
                    design.config.ID = item.id;
                    design.config.Name = item.text;
                }
                design.draw();

                if (actid) {
                    var lst = design.getModel().Activities;
                    var ActModel = lst.Find(function (ent) {
                        return ent.ID == actid;
                    });
                    showActivityInfo(ActModel);
                }

                leftpanel.find("a").removeClass("active");
                leftpanel.find("[data-id=" + flowid + "]").addClass("active");

            });
        }



        function loadWorkFlowTree() {

            var leftVM = {
                itemclick: function (item) {
                    //debugger;
                    //当点击列表中某个流程时候触发
                    //彭博修改整个函数,加入发送权限
                    //loadModelUI(item.id);
                    var hash = $.iwf.gethash();
                    //if (hash.model != "workflowdesign") return;
                    $.iwf.onmodulechange(hash.module + '.fx/sys/wfdesign:{title:"工作流管理", flowid:"' + item.id + '"}');
                }
            }
            me.ROOT.empty();
            var content = me.ROOT.splitContent({ module: { model: "wfdesign" } });

            leftpanel = content.leftPanel();
            $('<a class="btn btn-success" href="javascript:void(0)" style="margin: 10px 20px;"><i class="fa fa-file"/> 新建业务模型</a>').appendTo(leftpanel).bind("click", addNew);
            leftpanel.append('<div class="divider"></div>');

            InitCanvas(content.rightPanel());

            $.fxPost("engine.data?action=QueryAllModel", {}, function (data) {
                //把所有已有流程全部列出来
                leftVM.data = data;
                leftpanel.listView2(leftVM);
            });
        }

        function deleteFlow() {
            if (design.config && confirm("你决定删除[ " + design.config.Name + " ]吗？")) {
                $.post("engine.data?action=delmodel", { wids: design.config.ID }, function (json) {
                    leftpanel.find(".list-group").remove();
                    loadWorkFlowTree();
                });
            }
        }

        var toolData = [
           { title: '保存流程', text: '保存', iconCls: 'fa fa-save', handler: saveFlow, css: 'btn-info' },
           { title: '删除流程', text: '删除', handler: deleteFlow },
           { type: 'split' },
           {
               type: 'group', children:
                   [
                       { title: '开始节点', text: '开始', iconCls: 'workflowmodel-start workflowmodel-toolbar-item', command: 'addact', key: 'START' },
                       { title: '通用节点', text: '通用', iconCls: 'workflowmodel-comm workflowmodel-toolbar-item', command: 'addact', key: 'COMM' },
                       { title: '分流节点', text: '分流', iconCls: 'workflowmodel-split workflowmodel-toolbar-item', command: 'addact', key: 'SPLIT' },
                       { title: '合流节点', text: '合流', iconCls: 'workflowmodel-join workflowmodel-toolbar-item', command: 'addact', key: 'JOIN' },
                       { title: '结束节点', text: '结束', iconCls: 'workflowmodel-end workflowmodel-toolbar-item', command: 'addact', key: 'END' },
                       { title: '协同节点', text: '协同', iconCls: 'workflowmodel-coo workflowmodel-toolbar-item', command: 'addact', key: 'COO' },
                       { title: '子节点', text: '子节点', iconCls: 'workflowmodel-sub workflowmodel-toolbar-item', command: 'addact', key: 'SUB' },
                       { title: '连接弧线', text: '连接弧', iconCls: 'fa fa-link', command: 'addline' }
                       //,{ title: '删除节点', text: '删除实体', iconCls: 'fa fa-trash', command: 'delete' }
                   ]
           },
           //{ title: '选择', type: 'rect', command: 'move' },
           //{ type: 'split' },
           { title: '流程属性设置', text: '属性', iconCls: 'fa fa-wrench', float: 'right', handler: showFlowConfigWin }
           //,{ title: '流程角色绑定', text: '角色', iconCls: 'fa fa-group', float: 'right', handler: showFlowRole },
           //{ title: '流程表单绑定', text: '表单', iconCls: 'fa fa-list-alt', float: 'right', handler: showFlowForms }
        ];

        function saveFlow() {
            //这里是流程保存处
            //debugger;
            var wfmodel = design.getModel();


            //确保limit有值
            if (!wfmodel.Limit) wfmodel.Limit = 0;
            for (var i = 0; i < wfmodel.Activities.length; i++) {
                if (!wfmodel.Activities[i].Limit) wfmodel.Activities[i].Limit = 0;
            }
            var params = {
                action: 'savemodel',
                flowid: wfmodel.ID,
                name: wfmodel.Name,
                type: wfmodel.FlowType,
                content: JSON.stringify(wfmodel)
            };



            $.post("engine.data?action=savemodel", params, function (js) {
                var json = JSON.parse(js);
                alert(json.msg);
                //重新加载树
                loadModelUI(wfmodel.ID);
                //loadWorkFlowTree();
            });
        }

        //function showFlowRole() {
        //    var tree = "";
        //    var win = $('body').iwfWindow({
        //        title: '流程角色管理',
        //        width: 400, height: 650,
        //        append: '<ul action="flowallforms"></ul>',
        //        button: [{
        //            text: '确定', handler: function (data) {
        //                var arr = tree.frametree("GetAllCheckNodes");
        //                design.config.Roles = new Array();
        //                $.each(arr, function (i, node) {
        //                    design.config.Roles.push({ ID: node.id, Name: node.name });
        //                });
        //                win.close();
        //            }
        //        }, {
        //            text: '取消', handler: function () { win.close(); }
        //        }]
        //    });
        //    tree = win.dialogdom.find('[action=flowallforms]');
        //    $.getJSON("org.data?action=queryroles&ttt=" + Math.random(), function (json) {
        //        var treeData = [];
        //        $.each(json.roles, function (i, item) {
        //            var temp = { id: item.RID, name: item.RoleName };
        //            for (var j = 0; j < design.config.Roles.length; j++) {
        //                if (design.config.Roles[j].ID == temp.id) {
        //                    temp.check = true;
        //                    break;
        //                }
        //            }
        //            treeData.push(temp);
        //        });
        //        tree.frametree({ treesource: treeData });
        //    });
        //}
        //function showFlowForms() {
        //    var tree = "";
        //    var win = $('body').iwfWindow({
        //        title: '流程表单管理',
        //        width: 500, height: 650,
        //        append: '<div style="height:500px;overflow:auto;"><ul action="flowallforms"></ul><div>',
        //        button: [{
        //            text: '确定', handler: function (data) {
        //                var arr = tree.frametree("GetAllCheckNodes");
        //                design.config.Forms = new Array();
        //                $.each(arr, function (index, node) {
        //                    design.config.Forms.push({ ID: node.id, Name: node.name });
        //                });
        //                win.close();
        //            }
        //        }, {
        //            text: '取消', handler: function () { win.close(); }
        //        }]
        //    });
        //    tree = win.dialogdom.find('[action=flowallforms]');
        //    $.post("engine.data?action=getforms", function (res) {
        //        var data = new Object();
        //        try {
        //            json = eval("(" + res + ")");
        //        } catch (e) {
        //            alert("getforms失败");
        //        }
        //        function BuildTreeData(list) {
        //            var arr = new Array();
        //            $.each(list, function (index, item) {
        //                var flag = Exists(list, "FID", item["PFID"]);//判断有无父辈
        //                if (!flag) {//根节点
        //                    var obj = new Object();
        //                    obj["id"] = item["FID"];
        //                    obj["name"] = item["FName"];
        //                    obj["children"] = new Array();
        //                    var IsHasChild = Exists(list, "PFID", item["FID"]);//判断有无子集
        //                    if (IsHasChild) {
        //                        var childrenArr = FindAll(list, "PFID", item["FID"]);
        //                        obj["children"] = BuildTreeData(childrenArr);
        //                    }
        //                    arr.push(obj);
        //                }
        //            });
        //            return arr;
        //        }
        //        var TreeDataSource = BuildTreeData(json);
        //        tree.frametree({ treesource: TreeDataSource });
        //        tree.frametree("SetEndLICheckBox", design.config.Forms.PickByField("ID"), true);
        //    });
        //}

        //工作流流程配置
        function showFlowConfigWin() {

            var flowKm = {

                flowID: ko.observable(design.config.ID),
                flowName: ko.observable(design.config.Name),
                flowLimit: ko.observable(design.config.Limit),
                flowRemark: ko.observable(design.config.Description),
                flowIsCreated: ko.observable(design.config.Isdisplayinlist),
                save: function () {
                    design.config.Name = flowKm.flowName();
                    design.config.Limit = flowKm.flowLimit();
                    design.config.Description = flowKm.flowRemark();
                    design.config.Isdisplayinlist = flowKm.flowIsCreated();
                }
            }

            var treeRoles, treeForms;

            var win = $('body').iwfWindow({
                title: '流程定义',
                width: 900, height: 750,
                button: [{
                    text: '确定', handler: function (data) {
                        var arr = treeRoles.frametree("GetAllCheckNodes");
                        design.config.Roles = new Array();
                        $.each(arr, function (i, node) {
                            design.config.Roles.push({ ID: node.id, Name: node.name });
                        });

                        var arr = treeForms.frametree("GetAllCheckNodes");
                        design.config.Forms = new Array();
                        $.each(arr, function (index, node) {
                            design.config.Forms.push({ ID: node.id, Name: node.name });
                        });

                        flowKm.save();
                        win.close();
                    }
                }, {
                    text: '取消', handler: function () { win.close(); }
                }]
            });

            win.load('fx/sys/wfFlowinfo.html', function () {
                ko.applyBindings(flowKm, win.content().find("[data-id='flow-tab-info-content']")[0]);

                $.fxPost("engine.data?action=getforms", function (json) {
                    var data = new Object();
                    treeForms = win.content().find("[data-id='flow-tab-form-content']").children("ul");

                    function BuildTreeData(list) {
                        var arr = new Array();
                        $.each(list, function (index, item) {
                            var flag = Exists(list, "FID", item["PFID"]);//判断有无父辈
                            if (!flag) {//根节点
                                var obj = new Object();
                                obj["id"] = item["FID"];
                                obj["name"] = item["FName"];
                                obj["children"] = new Array();
                                var IsHasChild = Exists(list, "PFID", item["FID"]);//判断有无子集
                                if (IsHasChild) {
                                    var childrenArr = FindAll(list, "PFID", item["FID"]);
                                    obj["children"] = BuildTreeData(childrenArr);
                                }
                                arr.push(obj);
                            }
                        });
                        return arr;
                    }
                    var TreeDataSource = BuildTreeData(json);
                    treeForms.frametree({ treesource: TreeDataSource });
                    treeForms.frametree("SetEndLICheckBox", design.config.Forms.PickByField("ID"), true);
                });


                $.fxPost("org.data?action=queryroles", function (json) {
                    json.roles.sort(function (a, b) { return a.RoleName.localeCompare(b.RoleName);})//按拼音排序
                    treeRoles = win.content().find("[data-id='flow-tab-role-content']").children("ul");
                    var treeData = [];
                    $.each(json.roles, function (i, item) {
                        var temp = { id: item.RID, name: item.RoleName };
                        for (var j = 0; j < design.config.Roles.length; j++) {
                            if (design.config.Roles[j].ID == temp.id) {
                                temp.check = true;
                                break;
                            }
                        }
                        treeData.push(temp);
                    });
                    treeRoles.frametree({ treesource: treeData });
                });
            });
        }

        function buttonClick(sender, data) {
            if (data.command) design.setCommand(data.command, data.key);
        }

        function addNew() {
            $.Com.prompt(function (data) {
                var params = { name: data, type: "FLOW" };
                $.post("engine.data?action=newmodel", params, function (json) {
                    leftpanel.find(".list-group").remove();
                    loadWorkFlowTree();
                });

            }, '输入新的流程名称')
            //var win = $('body').iwfWindow({
            //    title: '添加新的流程',
            //    width: 350,
            //    height: 230,
            //    append: '<div style="margin:0px 30px;">流程名称<p/><input style="width:250px" type="text" class="form-control"/></div>',
            //    button: [{
            //        text: '确定', css: 'btn btn-primary', handler: function (data) {
            //            var name = win.content().find("input").val();
            //            var params = { name: name, type: "FLOW" };
            //            $.post("engine.data?action=newmodel", params, function (json) {
            //                leftpanel.find(".list-group").remove();
            //                loadWorkFlowTree();
            //                win.close();
            //            });
            //        }
            //    }, {
            //        text: '取消', handler: function () { win.close(); }
            //    }]
            //});
        }

        function InitCanvas(root) {
            //var root = me.wfCanvas;
            //if (root == undefined) {
            //    alert("不能正确初始化画板");
            //    return;
            //}

            var tool = root.append('<div class="workflowmodel-toolbar" style="padding:5px; min-width:900px;"></div>').children().last().iwfToolbar({ data: toolData, itemclick: buttonClick });
            var canvaswidth = root.width();
            var canvas = root.append('<canvas style="background-color: #F4F8FB;" width="' + canvaswidth + '" height="' + (root.height() - 52) + '" id="myworkflowcontent"></canvas>').children().last();


            design = new IWorkFlow.WorkFlowDesign(canvas[0], wfConfig);//wfConfig里面有双击事件是关键
            design.setCommand("move");

            //debugger;
            design.load();//第一次是默认用一个新流程装到设计器中,其实什么都没干可以说
            design.draw();
        }


        function Create(params) {

            loadWorkFlowTree();

            if (params.flowid) loadModelUI(params.flowid, params.actid);
        }

        this.ROOT = "";
        this.MODULE = "";

        //一些基础
        function FindAll(Arr, Field, id) {
            var all = new Array();
            if (!Arr) return all;
            for (var i = 0; i < Arr.length; i++) {
                if (Arr[i][Field] == id) all.push(Arr[i]);
            }
            return all;
        }
        function Exists(Arr, Field, id) {
            if (!Arr) return false;
            for (var i = 0; i < Arr.length; i++) {
                if (Arr[i][Field] == id) return true;
            }
            return false;
        }


        this.show = function (module, root) {
            var json = module.params.replace(/"/g, "'");
            var wfcase = eval('({' + json + '})');
            if (root.children().length == 0) {
                this.ROOT = root;
                this.MODULE = module;
                Create(wfcase);
            } else {

                loadModelUI(wfcase.flowid, wfcase.actid);
            }
        }
    }
});
