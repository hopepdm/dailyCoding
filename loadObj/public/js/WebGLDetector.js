//winxp 只支持到ie8
//ie 9只支持win7 以上
//ie 10 支持win7以上
//ie 11 支持win7以上
var WebGLDetector =  {
        _platform: function () {
            var platform = {};
            // var userAgent = navigator.userAgent;
            var info = navigator.userAgent;
            platform.isXP = info.indexOf('NT 5.1') > 0 || info.indexOf('NT 5.2') > 0 ? true : false;
            platform.isVista = info.indexOf('NT 6.0') > 0 ? true : false;
            platform.isWin7 = info.indexOf('NT 6.1') > 0 ? true : false;
            platform.isWin8 = info.indexOf('NT 6.2') > 0 ? true : false;
            platform.isWin81 = info.indexOf('NT 6.3') > 0 ? true : false;
            platform.isWin10 = info.indexOf('NT 10.0') > 0 ? true : false;

            return platform;

        },
        _browser: function (ver) {
            var isIE = function (ver) {
                if (ver === 10) return document.all && document.addEventListener && window.atob;
                var b = document.createElement('b')
                b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
                return b.getElementsByTagName('i').length === 1
            }
            return isIE(ver);
        },
        _try: function () {
            var reason = {
                pc: false,
                browser: {
                    platform: '',
                    version: ''
                }
            }
            var canvas = document.createElement('canvas');
            if (!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))) {
                if (window.WebGLRenderingContext) {
                    reason.pc = true;
                    return {
                        webgl:false,
                        message:reason
                    }
                }
                var platform = this._platform();
                if (platform.isXP || platform.isVista) {
                    // reason.browser.state = false;
                    reason.browser.platform = 'XP_OR_VISTA';
                    return {
                        webgl:false,
                        message:reason
                    }
                } else {
                    if (this._browser(9)) {
                        reason.browser.platform = 'NOT_XP_OR_VISTA';
                        // reason.browser.state = false;
                        reason.browser.version = 'IE9';
                        return {
                            webgl:false,
                            message:reason
                        }
                    }
                    if (this._browser(10)) {
                        reason.browser.platform = 'NOT_XP_OR_VISTA';
                        // reason.browser.state = false;
                        reason.browser.version = 'IE10';
                        return {
                            webgl:false,
                            message:reason
                        }
                    }

                }
            } else {
                return {
                    webgl: true,
                    meaasge: null
                }
            }



        },
        detecte: function () {
            return this._try();
        }
    
}