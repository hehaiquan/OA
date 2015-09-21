//created by zhoushining
function ValidateHelper() {
    var self = this;

    // 验证每个控件是否为空
    self.checkcontrollers = function (Form) {
        for (var i = 0; i < Form.length; i++) {
            if (Form.elements[i].value == "") {
                alert(Form.elements[i].title + "不能为空！");
                Form.elements[i].focus();
                return;
            }
        }
    }

    // 验证空值
    self.isEmptyOrNull = function (value) {
        var str = $.trim(value);
        if (str == ""|| str == null) {
            return true;
        } else {
            return false;
        }
    }

    // 验证Email
    self.checkemail = function (emailstr) {
        var str = emailstr;
        var Expression = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }

    // 验证电话号码
    self.checkphonenumber = function (phonenumberstr) {
        var str = phonenumberstr;
        var Expression = /(\d{3}-)?\d{8}|(\d{4}-)(\d{7})/;
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }

    // 验证真实姓名
    self.checkrealname = function (realnamestr) {
        var str = realnamestr;
        var Expression = /[^\uE00-\u9FA5]/;
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }

    // 验证身份证号
    self.checkidcardnumber = function (idcardnumberstr) {
        var str = idcardnumberstr;
        var Expression = /^\d{17}[\d|X]|^\d{15}$/;
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }

    // 验证用户名
    self.checkusername = function (usernamestr) {
        var str = usernamestr;
        var Expression = /^(\w){3,10}$/;
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }

    // 验证密码
    self.checkpassword = function (passwordstr) {
        var str = passwordstr;
        var Expression = /^[A-Za-z]{1}([A-Za-z0-9]|[._]){5,19}$/;
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }



    //判断是否为日期格式
    self.checkDate = function (str) {


        //var Expression = /^(\d{4})([/])(\d{2})([/])(\d{2})$/;//日期格式yyyy-MM-dd格式：
        var objExp = /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/;
        //var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }

        //var patrn = /^(\d{4})([/])(\d{2})([/])(\d{2})$/;
        //if (patrn.exec(str)) return true 
        //return false

    }

    //匹配非负整数（正整数 + 0）
    self.checkPositiveInteger_0 = function (str) {
        var Expression = /^\d+$/; //匹配非负整数（正整数 + 0）
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }

    //判断是否为正整数
    self.checkPositiveInteger = function (str) {
        var Expression = /^[0-9]*[1-9][0-9]*$/;//正整数 
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }

    //正浮点数
    self.checkPositiveFloat = function (str) {
        var Expression = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;//正浮点数
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }


    //负浮点数
    self.checkNegativeFloat = function (str) {
        var Expression = /^-([1-9]d*.d*|0.d*[1-9]d*)$/;//负浮点数
        //^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }

    //匹配非负浮点数（正浮点数 + 0）
    self.checkPositiveFloat_0 = function (str) {
        var Expression = /^\d+(\.\d+)?$/;//匹配非负浮点数（正浮点数 + 0）      
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }

    //匹配非正浮点数（负浮点数 + 0）
    self.checkNegativeFloat_0 = function (str) {
        var Expression = /^(-([1-9]d*.d*|0.d*[1-9]d*))|0?.0+|0$/;//匹配非正浮点数（负浮点数 + 0）

        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }

    //匹配浮点数
    self.checkFloat = function (str) {
        var Expression = /^-?([1-9]d*.d*|0.d*[1-9]d*|0?.0+|0)$/;//匹配浮点数  ^(-?\d+)(\.\d+)?$
        var objExp = new RegExp(Expression);
        if (objExp.test(str) == true) {
            return true;
        } else {
            return false;
        }
    }

    //匹配正数(不包含0)
    self.checkPositive = function (str) {

        if (self.checkPositiveInteger(str) || self.checkPositiveFloat(str)) {
            return true;
        } else {
            return false;
        }
    }

    //匹配正数(包含0)
    self.checkPositive_0 = function (str) {

        if (self.checkPositiveInteger(str) || self.checkPositiveFloat(str) || str == '0') {
            return true;
        } else {
            return false;
        }
    }
    

}

var Validate = new ValidateHelper();