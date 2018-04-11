var validateRegExp = {
    decmal:"^([+-]?)\\d*\\.\\d+$", //浮点数
    decmal1:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$", //正浮点数
    decmal2:"^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$", //负浮点数
    decmal3:"^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$", //浮点数
    decmal4:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$", //非负浮点数（正浮点数 + 0）
    decmal5:"^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$", //非正浮点数（负浮点数 + 0）
    intege:"^-?[1-9]\\d*$", //整数
    intege1:"^[1-9]\\d*$", //正整数
    intege2:"^-[1-9]\\d*$", //负整数
    num:"^([+-]?)\\d*\\.?\\d+$", //数字
    num1:"^[1-9]\\d*|0$", //正数（正整数 + 0）
    num2:"^-[1-9]\\d*|0$", //负数（负整数 + 0）
    ascii:"^[\\x00-\\xFF]+$", //仅ACSII字符
    chinese:"^[\\u4e00-\\u9fa5]+$", //仅中文
    color:"^[a-fA-F0-9]{6}$", //颜色
    date:"^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}$", //日期
    email:"^\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", //邮件
    idcard:"^[1-9]([0-9]{14}|[0-9]{17})$", //身份证
    ip4:"^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$", //ip地址
    letter:"^[A-Za-z]+$", //字母
    letter_l:"^[a-z]+$", //小写字母
    letter_u:"^[A-Z]+$", //大写字母
    mobile:"^0?(13|15|18)[0-9]{9}$", //手机
    notempty:"^\\S+$", //非空
    password:"^.*[A-Za-z0-9\\w_-]+.*$", //密码
    fullNumber:"^[0-9]+$", //数字
    picture:"(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$", //图片
    qq:"^[1-9]*[1-9][0-9]*$", //QQ号码
    rar:"(.*)\\.(rar|zip|7zip|tgz)$", //压缩文件
    tel:"^[0-9\-()（）]{7,18}$", //电话号码的函数(包括验证国内区号,国际区号,分机号)
    url:"^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$", //url
    username:"^[A-Za-z0-9_\\-\\u4e00-\\u9fa5]+$", //用户名
    deptname:"^[A-Za-z0-9_()（）\\-\\u4e00-\\u9fa5]+$", //单位名
    zipcode:"^\\d{6}$", //邮编
    realname:"^[A-Za-z\\u4e00-\\u9fa5]+$", // 真实姓名
    companyname:"^[A-Za-z0-9_()（）\\-\\u4e00-\\u9fa5]+$",
    companyaddr:"^[A-Za-z0-9_()（）\\#\\-\\u4e00-\\u9fa5]+$",
    companysite:"^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&#=]*)?$"
};

//主函数
(function ($) {
    $.fn.jdValidate = function (option, callback, def) {
        var ele = this;
        var id = ele.attr("id");
        var type = ele.attr("type");
        var rel = ele.attr("rel");
        var _onFocus = $("#" + id + validateSettings.onFocus.container);
        var _succeed = $("#" + id + validateSettings.succeed.container);
        var _isNull = $("#" + id + validateSettings.isNull.container);
        var _error = $("#" + id + validateSettings.error.container);
        if (def == true) {
            var str = ele.val();
            var tag = ele.attr("sta");
            if (str == "" || str == "-1") {
                validateSettings.isNull.run({
                    prompts:option,
                    element:ele,
                    isNullEle:_isNull,
                    succeedEle:_succeed
                }, option.isNull);
            } else if (tag == 1 || tag == 2) {
                return;
            } else {
                callback({
                    prompts:option,
                    element:ele,
                    value:str,
                    errorEle:_error,
                    succeedEle:_succeed
                });
            }
        } else {
            if (typeof def == "string") {
                ele.val(def);
            }
            if (type == "checkbox" || type == "radio") {
                if (ele.attr("checked") == true) {
                    ele.attr("sta", validateSettings.succeed.state);
                }
            }
            switch (type) {
                case "text":
                case "password":
                    ele.bind("focus", function () {
                        var str = ele.val();
                        if (str == def) {
                            ele.val("");
                        }
                        if (id == "pwd") {
                            $("#pwdstrength").hide();
                        }
                        validateSettings.onFocus.run({
                            prompts:option,
                            element:ele,
                            value:str,
                            onFocusEle:_onFocus,
                            succeedEle:_succeed
                        }, option.onFocus);
                    })
                        .bind("blur", function () {
                            var str = ele.val();
                            if (str == "") {
                                ele.val(def);
                            }
                            if (validateRules.isNull(str)) {
                                validateSettings.isNull.run({
                                    prompts:option,
                                    element:ele,
                                    value:str,
                                    isNullEle:_isNull,
                                    succeedEle:_succeed
                                }, "");
                            } else {
                                callback({
                                    prompts:option,
                                    element:ele,
                                    value:str,
                                    errorEle:_error,
                                    isNullEle:_isNull,
                                    succeedEle:_succeed
                                });
                            }
                        });
                    break;
                default:
                    if (rel && rel == "select") {
                        ele.bind("change", function () {
                            var str = ele.val();
                            callback({
                                prompts:option,
                                element:ele,
                                value:str,
                                errorEle:_error,
                                isNullEle:_isNull,
                                succeedEle:_succeed
                            });
                        })
                    } else {
                        ele.bind("click", function () {
                            callback({
                                prompts:option,
                                element:ele,
                                errorEle:_error,
                                isNullEle:_isNull,
                                succeedEle:_succeed
                            });
                        })
                    }
                    break;
            }
        }
    }
})(jQuery);

//配置
var validateSettings = {
    onFocus:{
        state:null,
        container:"_error",
        style:"focus",
        run:function (option, str) {
            if (!validateRules.checkType(option.element)) {
                option.element.removeClass(validateSettings.INPUT_style2).addClass(validateSettings.INPUT_style1);
            }
            option.onFocusEle.removeClass().addClass(validateSettings.onFocus.style).html(str);
        }
    },
    isNull:{
        state:0,
        container:"_error",
        style:"null",
        run:function (option, str) {
            option.element.attr("sta", 0);
            if (!validateRules.checkType(option.element)) {
                if (str != "") {
                    option.element.removeClass(validateSettings.INPUT_style1).addClass(validateSettings.INPUT_style2);
                } else {
                    option.element.removeClass(validateSettings.INPUT_style2).removeClass(validateSettings.INPUT_style1);
                }
            }
            option.succeedEle.removeClass(validateSettings.succeed.style);
            option.isNullEle.removeClass().addClass(validateSettings.isNull.style).html(str);
        }
    },
    error:{
        state:1,
        container:"_error",
        style:"error",
        run:function (option, str) {
            option.element.attr("sta", 1);
            if (!validateRules.checkType(option.element)) {
                option.element.removeClass(validateSettings.INPUT_style1).addClass(validateSettings.INPUT_style2);
            }
            option.succeedEle.removeClass(validateSettings.succeed.style);
            option.errorEle.removeClass().addClass(validateSettings.error.style).html(str);
        }
    },
    succeed:{
        state:2,
        container:"_succeed",
        style:"succeed",
        run:function (option) {
            option.element.attr("sta", 2);
            option.errorEle.empty();
            if (!validateRules.checkType(option.element)) {
                option.element.removeClass(validateSettings.INPUT_style1).removeClass(validateSettings.INPUT_style2);
            }
            if (option.element.attr("id") == "schoolinput" && $("#schoolid").val() == "") {
                return;
            }
            option.succeedEle.addClass(validateSettings.succeed.style);
        }
    },
    INPUT_style1:"highlight1",
    INPUT_style2:"highlight2"

};

//验证规则
var validateRules = {
    isNull:function (str) {
        return (str == "" || typeof str != "string");
    },
    betweenLength:function (str, _min, _max) {
        return (str.length >= _min && str.length <= _max);
    },
    isUid:function (str) {
        return new RegExp(validateRegExp.username).test(str);
    },
    fullNumberName:function (str) {
        return new RegExp(validateRegExp.fullNumber).test(str);
    },
    isPwd:function (str) {
        return /^.*([\W_a-zA-z0-9-])+.*$/i.test(str);
    },
    isPwd2:function (str1, str2) {
        return (str1 == str2);
    },
    isEmail:function (str) {
        return new RegExp(validateRegExp.email).test(str);
    },
    isTel:function (str) {
        return new RegExp(validateRegExp.tel).test(str);
    },
    isMobile:function (str) {
        return new RegExp(validateRegExp.mobile).test(str);
    },
    checkType:function (element) {
        return (element.attr("type") == "checkbox" || element.attr("type") == "radio" || element.attr("rel") == "select");
    },
    isChinese:function (str) {
        return new RegExp(validateRegExp.chinese).test(str);
    },
    isRealName:function (str) {
        return new RegExp(validateRegExp.realname).test(str);
    },
    isDeptname:function (str) {
        return new RegExp(validateRegExp.deptname).test(str);
    },
    isCompanyname:function (str) {
        return new RegExp(validateRegExp.companyname).test(str);
    },
    isCompanyaddr:function (str) {
        return new RegExp(validateRegExp.companyaddr).test(str);
    },
    isCompanysite:function (str) {
        return new RegExp(validateRegExp.companysite).test(str);
    }
};
//验证文本
var validatePrompt = {
    username:{
        onFocus:"4-20位字符，可由中文、英文、数字及“_”、“-”组成",
        succeed:"",
        isNull:"请输入用户名",
        error:{
            beUsed:"该用户名已被使用，请使用其它用户名注册，如果您是&quot;{1}&quot;，请<a href='https://passport.360buy.com/new/login.aspx' class='flk13'>登录</a>",
            badLength:"用户名长度只能在4-20位字符之间",
            badFormat:"用户名只能由中文、英文、数字及“_”、“-”组成",
            fullNumberName:"用户名不能全为数字"
        }
    },
    pwd:{
        onFocus:"6-16位字符，可由英文、数字及标点符号组成",
        succeed:"",
        isNull:"请输入密码",
        error:{
            badLength:"密码长度只能在6-16位字符之间",
            badFormat:"密码只能由英文、数字及标点符号组成"
        }
    },
    pwd2:{
        onFocus:"请再次输入密码",
        succeed:"",
        isNull:"请输入密码",
        error:{
            badLength:"密码长度只能在6-16位字符之间",
            badFormat2:"两次输入密码不一致",
            badFormat1:"密码只能由英文、数字及标点符号组成"
        }
    },
    mail:{
        onFocus:"请输入常用的邮箱，将用来找回密码、接收订单通知等",
        succeed:"",
        isNull:"请输入邮箱",
        error:{
            beUsed:"该邮箱已被使用，请更换其它邮箱，或使用该邮箱<a href='http://passport.360buy.com/retrievepassword.aspx' class='flk13'>找回密码</a>",
            badFormat:"邮箱格式不正确",
            badLength:"您填写的邮箱过长，邮件地址只能在50个字符以内"
        }
    },
    authcode:{
        onFocus:"请输入图片中的字符，不区分大小写",
        succeed:"",
        isNull:"请输入验证码",
        error:"验证码错误"
    },
    protocol:{
        onFocus:"",
        succeed:"",
        isNull:"请先阅读并同意《京东商城用户协议》",
        error:""
    },
    referrer:{
        onFocus:"如您注册并完成订单，推荐人有机会获得积分",
        succeed:"",
        isNull:"",
        error:""
    },
    schoolinput:{
        onFocus:"您可以用简拼、全拼、中文进行校名模糊查找",
        succeed:"",
        isNull:"请填选学校名称",
        error:"请填选学校名称"
    },
    empty:{
        onFocus:"",
        succeed:"",
        isNull:"",
        error:""
    }
};

var nameold, emailold, authcodeold;
var namestate = false, emailstate = false, authcodestate = false;
//回调函数
var validateFunction = {
    username:function (option) {

        var format = validateRules.isUid(option.value);
        var length = validateRules.betweenLength(option.value.replace(/[^\x00-\xff]/g, "**"), 4, 20);
        if (!length && format) {
            validateSettings.error.run(option, option.prompts.error.badLength);
        }
        else if (!length && !format) {
            validateSettings.error.run(option, option.prompts.error.badFormat);
        }
        else if (length && !format) {
            validateSettings.error.run(option, option.prompts.error.badFormat);
        } else if (validateRules.fullNumberName(option.value)) {
            validateSettings.error.run(option, option.prompts.error.fullNumberName);
        } else {
            if (!namestate || nameold != option.value) {
                if (nameold != option.value) {
                    nameold = option.value;
                    option.errorEle.html("<span style='color:#999'>检验中……</span>");
                    $.getJSON("AjaxService.aspx?action=CheckUnicknme&uid=" + escape(option.value) + "&r=" + Math.random(), function (date) {
                        if (date.success == 0) {
                            validateSettings.succeed.run(option);
                            namestate = true;
                        } else {
                            validateSettings.error.run(option, option.prompts.error.beUsed.replace("{1}", option.value));
                            namestate = false;
                        }
                    })
                }
                else {
                    validateSettings.error.run(option, option.prompts.error.beUsed.replace("{1}", option.value));
                    namestate = false;
                }
            }
            else {
                validateSettings.succeed.run(option);
            }
        }
    },
    pwd:function (option) {
        var str1 = option.value;
        var str2 = $("#pwd2").val();
        var format = validateRules.isPwd(option.value);
        var length = validateRules.betweenLength(option.value, 6, 16);
        $("#pwdstrength").hide();
        if (!length && format) {
            validateSettings.error.run(option, option.prompts.error.badLength);
        }
        else if (!length && !format) {
            validateSettings.error.run(option, option.prompts.error.badFormat);
        }
        else if (length && !format) {
            validateSettings.error.run(option, option.prompts.error.badFormat);
        }
        else {
            validateSettings.succeed.run(option);
            validateFunction.pwdstrength();
        }
        if (str2 == str1) {
            $("#pwd2").focus();
        }
    },
    pwd2:function (option) {
        var str1 = option.value;
        var str2 = $("#pwd").val();
        var length = validateRules.betweenLength(option.value, 6, 16);
        var format2 = validateRules.isPwd2(str1, str2);
        var format1 = validateRules.isPwd(str1);
        if (!length) {
            validateSettings.error.run(option, option.prompts.error.badLength);
        } else {
            if (!format1) {
                validateSettings.error.run(option, option.prompts.error.badFormat1);
            } else {
                if (!format2) {
                    validateSettings.error.run(option, option.prompts.error.badFormat2);
                }
                else {
                    validateSettings.succeed.run(option);
                }
            }
        }
    },
    mail:function (option) {
        var format = validateRules.isEmail(option.value);
        var format2 = validateRules.betweenLength(option.value, 0, 50);
        if (!format) {
            validateSettings.error.run(option, option.prompts.error.badFormat);
        } else {
            if (!format2) {
                validateSettings.error.run(option, option.prompts.error.badLength);
            } else {
                if (!emailstate || emailold != option.value) {
                    if (emailold != option.value) {
                        emailold = option.value;
                        option.errorEle.html("<span style='color:#999'>检验中……</span>");
                        $.getJSON("AjaxService.aspx?action=CheckUemail&str=" + escape(option.value) + "&r=" + Math.random(), function (date) {
                            if (date.success == 0) {
                                validateSettings.succeed.run(option);
                                emailstate = true;
                            } else {
                                validateSettings.error.run(option, option.prompts.error.beUsed);
                                emailstate = false;
                            }
                        })
                    }
                    else {
                        validateSettings.error.run(option, option.prompts.error.beUsed);
                        emailstate = false;
                    }
                }
                else {
                    validateSettings.succeed.run(option);
                }
            }
        }
    },
    referrer:function (option) {
        var bool = validateRules.isNull(option.value);
        if (bool) {
            option.element.val("可不填");
            return;
        } else {
            validateSettings.succeed.run(option);
        }
    },
    schoolinput:function (option) {
        var bool = validateRules.isNull(option.value);
        if (bool) {
            validateSettings.error.run(option, option.prompts.error);
            return;
        } else {
            validateSettings.succeed.run(option);
        }
    },
    authcode:function (option) {
//        if (!authcodestate || authcodeold != option.value) {
//            if (authcodeold != option.value) {
////                authcodeold = option.value;
////                option.errorEle.html("<span style='color:#999'>检验中……</span>");
////                var uuid = $("#JD_Verification1").attr("src").split("&uid=")[1].split("&")[0];
////                $.getJSON("AjaxService.aspx?action=CheckAuthcode&str=" + escape(option.value) + "&r=" + Math.random() + "&uuid=" + uuid, function(date) {
////                    if (date.success == 0) {
////                        validateSettings.succeed.run(option);
////                        authcodestate = true;
////                    } else {
////                        validateSettings.error.run(option, option.prompts.error);
////                        authcodestate = false;
////                    }
////                })
//            }
//            else {
//                validateSettings.error.run(option, option.prompts.error);
//                authcodestate = false;
//            }
//        }
//        else {
//            validateSettings.succeed.run(option);
//        }

        validateSettings.succeed.run(option);
        authcodestate = true;
    },
    protocol:function (option) {
        if (option.element.attr("checked") == true) {
            option.element.attr("sta", validateSettings.succeed.state);
            option.errorEle.html("");
        } else {
            option.element.attr("sta", validateSettings.isNull.state);
            option.succeedEle.removeClass(validateSettings.succeed.style);
        }
    },
    pwdstrength:function () {

        var element = $("#pwdstrength");
        var value = $("#pwd").val();
        if (value.length >= 6 && validateRules.isPwd(value)) {
            $("#pwd_error").empty();
            element.show();

            var pattern_1 = /^.*([\W_])+.*$/i;
            var pattern_2 = /^.*([a-zA-Z])+.*$/i;
            var pattern_3 = /^.*([0-9])+.*$/i;
            var level = 0;

            if (value.length > 10) {
                level++;
            }

            if (pattern_1.test(value)) {
                level++;
            }

            if (pattern_2.test(value)) {
                level++;
            }

            if (pattern_3.test(value)) {
                level++;
            }

            if (level > 3) {
                level = 3;
            }

            switch (level) {
                case 1:
                    element.removeClass().addClass("strengthA");
                    break;
                case 2:
                    element.removeClass().addClass("strengthB");
                    break;
                case 3:
                    element.removeClass().addClass("strengthC");
                    break;
                default:
                    break;
            }
        } else {
            element.hide();
        }
    },
    checkGroup:function (elements) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].checked) {
                return true;
            }
        }
        return false;
    },
    checkSelectGroup:function (elements) {
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].value == -1) {
                return false;
            }
        }
        return true;
    },
    showPassword:function (type) {
        var v1 = $("#pwd").val(), s1 = $("#pwd").attr("sta"), c1 = document.getElementById("pwd").className, t1 = $("#pwd").attr("tabindex");
        var v2 = $("#pwd2").val(), s2 = $("#pwd2").attr("sta"), c2 = document.getElementById("pwd2").className, t2 = $("#pwd2").attr("tabindex");
        var P1 = $("<input type='" + type + "' value='" + v1 + "' sta='" + s1 + "' class='" + c1 + "' id='pwd' name='pwd' tabindex='" + t1 + "'/>");
        $("#pwd").after(P1).remove();
        $("#pwd").bind("keyup",
            function () {
                validateFunction.pwdstrength();
            }).jdValidate(validatePrompt.pwd, validateFunction.pwd)
        var P2 = $("<input type='" + type + "' value='" + v2 + "' sta='" + s2 + "' class='" + c2 + "' id='pwd2' name='pwd2' tabindex='" + t2 + "'/>");
        $("#pwd2").after(P2).remove();
        $("#pwd2").jdValidate(validatePrompt.pwd2, validateFunction.pwd2);
    },
    FORM_submit:function (elements) {
        var bool = true;
        for (var i = 0; i < elements.length; i++) {
            if ($(elements[i]).attr("sta") == 2) {
                bool = true;
            } else {
                bool = false;
                break;
            }
        }
        return bool;
    }
};

