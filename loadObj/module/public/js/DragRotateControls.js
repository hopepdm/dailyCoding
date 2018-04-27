/**
 * Created by long on 2016/12/9.
 */
THREE.DragRotateControls = function (_camera, _objects, _domElement) {

    var drc = this;
    this.domElement = (_domElement !== undefined) ? _domElement : document;
    this.object = _objects;
    this.camera = _camera.clone();
    this.rotation0 = this.object.rotation.clone();
    this.position0 = this.object.position.clone();
    this.zoom0 = this.camera.zoom;
    console.log(this.zoom0)
    var STATE = {
        NONE: -1,
        ROTATE: 0,
        ZOOM: 1,
        PAN: 2,
        TOUCH_ROTATE: 3,
        TOUCH_ZOOM_PAN: 4
    };
    var _state = STATE.NONE;
    this.enabled = true;

    this.screen = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    };

    //API
    this.noRotate = false;
    this.noZoom = false;
    this.noPan = false;
    this.doubletouch = false;

    var _movePrev = new THREE.Vector3();
    var _moveCurr = new THREE.Vector3();

    var _panStart = new THREE.Vector3();
    var _panEnd = new THREE.Vector3();

    var _touchZoomDistanceStart = 0;
    var _touchZoomDistanceEnd = 0;

    var _zoomStart = [new THREE.Vector2(), new THREE.Vector2()];
    var _zoomEnd = [new THREE.Vector2(), new THREE.Vector2()];
    var _zoomBoolen = false;

    var _wheelDelta = 1;
    var _detailBrowser = 0;
    var _wheelNum = 0;
    var _wheelNint = 0;

    var touchNum = 0;
    var touchPointStart = new THREE.Vector2();
    var touchPointEnd = new THREE.Vector2();
    var iftouchRotate = true;

    var changeEvent = {
        type: 'change'
    };
    var startEvent = {
        type: 'start'
    };
    var endEvent = {
        type: 'end'
    };

    this.domElement.addEventListener('contextmenu', onContextMenu, false); //关闭右键事件

    this.domElement.addEventListener("mousedown", onDocumentMouseDown, false);
    this.domElement.addEventListener('mousewheel', onDocumentMouseWheel, false);
    this.domElement.addEventListener('DOMMouseScroll', onDocumentMouseWheel, false); // firefox

    this.domElement.addEventListener('touchstart', onDocumentTouchStart, false);
    this.domElement.addEventListener('touchmove', onDocumentTouchMove, false);
    this.domElement.addEventListener('touchend', onDocumentTouchEnd, false);

    this.dispose = function () {
        this.domElement.removeEventListener('contextmenu', onContextMenu, false);

        this.domElement.removeEventListener('mousedown', onDocumentMouseDown, false);
        this.domElement.removeEventListener('mousewheel', onDocumentMouseWheel, false);
        this.domElement.removeEventListener('MozMousePixelScroll', onDocumentMouseWheel, false); // firefox

        document.removeEventListener('mousemove', onDocumentMouseMove, false);
        document.removeEventListener('mouseup', onDocumentMouseUp, false);

        this.domElement.removeEventListener('touchstart', onDocumentTouchStart, false);
        this.domElement.removeEventListener('touchend', onDocumentTouchEnd, false);
        this.domElement.removeEventListener('touchmove', onDocumentTouchMove, false);
    };

    this.handleEvent = function (event) {
        if (typeof this[event.type] == 'function') {
            this[event.type](event);
        }
    };

    this.update = function () {

        if (!drc.noRotate) {
            drc.rotateModel();
        }

        if (!drc.noPan) {
            drc.panModel();
        }

        if (!drc.noZoom) {
            drc.zoomModel();
        }

        if (!drc.doubletouch) {
            drc.doubleTouch();
        }
    }
    this.reset = function () {

        this.object.rotation.copy(this.rotation0);
        _camera.zoom = this.zoom0;
        this.object.position.copy(this.position0);
        console.log(this.rotation0);
    }
    this.rotateTo = function (dir) {
        var deg = 0;
        switch (dir) {
            case 'forward':
                deg = 0;
                this.object.rotateY(deg);
                break;
            case 'back':
                deg = Math.PI;
                this.object.rotateY(deg);
                break;
            case 'left':
                deg = Math.PI/2;
                this.object.rotateY(deg);
                break;
            case 'right':
            deg =-Math.PI/2;
            this.object.rotateY(deg);
                break;
            case 'up':
            deg = -Math.PI/2;
            this.object.rotateX(deg);
            break; 
            case 'down':
            deg = Math.PI/2;
            this.object.rotateX(deg);
            break;
            default :
            this.reset();
        }
        
    }
    this.autoRotate = function () {
        this.object.rotateY(0.002*Math.PI);
    }
    this.rotateModel = (function () {

        var rotateObjQuaternion,
            axis = new THREE.Vector3(),
            quaternion = new THREE.Quaternion(),
            delta = new THREE.Vector3(),
            dynamicDampingFactor = 0.2,
            lastAngle,
            angle;

        return function rotateModel() {
            delta.set(_moveCurr.x - _movePrev.x, _moveCurr.y - _movePrev.y, 0);
            angle = delta.length();
            if (angle > 0) {
                axis.crossVectors(projectOnTrackball(_movePrev.x, -_movePrev.y), projectOnTrackball(_moveCurr.x, -_moveCurr.y)).normalize();
                angle *= sigleObj.rotateSpeed * 10;
                iftouchRotate = false;
                lastAngle = angle;
                //console.log(axis);
            }
            if (lastAngle) {
                lastAngle *= Math.sqrt(1.0 - dynamicDampingFactor);
                quaternion.setFromAxisAngle(axis, lastAngle);
                rotateObjQuaternion = _objects.quaternion;
                rotateObjQuaternion.multiplyQuaternions(quaternion, rotateObjQuaternion);
                rotateObjQuaternion.normalize();
                _objects.setRotationFromQuaternion(rotateObjQuaternion);
            }
            _movePrev.copy(_moveCurr);
        }
    }());

    this.panModel = (function () {

        var panDelta = new THREE.Vector3();
        var factor = 0;
        var panBoo = false;
        var x_y = 0;
        var zoomV = [new THREE.Vector2(), new THREE.Vector2()];

        return function panModel() {
            if (_state === STATE.PAN) {
                panDelta = panDelta.subVectors(_panEnd, _panStart);
                if (panDelta.length() != 0) {
                    panDelta.multiplyScalar(sigleObj.moveSpeed * objScele * 0.7);
                    _objects.position.add(panDelta);
                }
                _panEnd.copy(_panStart);
            } else if (_state === STATE.TOUCH_ZOOM_PAN) {
                factor = _touchZoomDistanceEnd / _touchZoomDistanceStart;
                zoomV[0].subVectors(_zoomEnd[0], _zoomStart[0]);
                zoomV[1].subVectors(_zoomEnd[1], _zoomStart[1]);
                x_y = zoomV[0].x * zoomV[1].x + zoomV[0].y * zoomV[1].y;
                if (0.95 < factor && factor < 1.05 && x_y >= 0) {
                    panBoo = true;
                } else {
                    panBoo = false;
                }
                if (panBoo) {
                    panDelta = panDelta.subVectors(_panEnd, _panStart);
                    //panDelta.y *= -1;
                    if (panDelta.length() != 0) {
                        _zoomBoolen = false;
                        panDelta.multiplyScalar(sigleObj.moveSpeed * objScele * 0.5);
                        _objects.position.add(panDelta);
                    }
                }
            }
        }
    }());

    this.zoomModel = (function () {

        var delta = 0;
        var factor = 0;
        //var zoomBoo = false;
        var x_y = 0;
        var fovDiffer = 0;
        var stalls = 0;
        var zoomV = [new THREE.Vector2(), new THREE.Vector2()];

        return function zoomModel() {
            fovDiffer = (sigleObj.maxfov - sigleObj.minfov) / 5;
            stalls = fovDiffer / 30;
            if (_state === STATE.ZOOM) {
                if (_detailBrowser == 1) {

                    delta = _wheelDelta > 0 ? -1 : 1; //-_wheelDelta / 40;// WebKit / Opera / Explorer 9
                } else if (_detailBrowser == 2) {
                    delta = _wheelDelta > 0 ? 1 : -1; //_wheelDelta / 3;// Firefox

                }
                if (_wheelNint < 10) {
                    _wheelNum = delta * stalls * 2 * sigleObj.zoomSpeed;
                } else if (_wheelNint >= 10 && _wheelNint < 30) {
                    _wheelNum = delta * stalls * sigleObj.zoomSpeed;
                } else if (_wheelNint >= 30) {
                    _state = STATE.NONE;
                    _wheelNum = 0;
                    _wheelNint = 0;
                }
                _wheelNint++;
                // console.log(_wheelNum)
                _camera.zoom = Math.max(sigleObj.minfov, Math.min(sigleObj.maxfov, _camera.zoom - _wheelNum));
                // console.log(_camera.zoom)
            } else if (_state === STATE.TOUCH_ZOOM_PAN) {
                factor = _touchZoomDistanceEnd / _touchZoomDistanceStart;
                _touchZoomDistanceStart = _touchZoomDistanceEnd;
                zoomV[0].subVectors(_zoomEnd[0], _zoomStart[0]);
                zoomV[1].subVectors(_zoomEnd[1], _zoomStart[1]);
                x_y = zoomV[0].x * zoomV[1].x + zoomV[0].y * zoomV[1].y;
                if (factor > 1 && x_y < -0.5) {
                    _zoomBoolen = true;
                    delta = -(factor - 1) * 50;
                    _wheelNint = 0;
                    _wheelNum = _wheelNum > 0 ? _wheelNum * -1 : _wheelNum;
                }
                if (factor < 1 && x_y < -0.5) {
                    _zoomBoolen = true;
                    delta = (1 - factor) * 50;
                    _wheelNint = 0;
                    _wheelNum = _wheelNum < 0 ? _wheelNum * -1 : _wheelNum;
                }

                if (_zoomBoolen) {
                    if (_wheelNint < 10) {
                        _wheelNum = delta * stalls * 2 * 2 * sigleObj.zoomSpeed;
                    } else if (_wheelNint >= 10 && _wheelNint < 20) {
                        _wheelNum = delta * stalls * 2 * sigleObj.zoomSpeed;
                    } else if (_wheelNint >= 30) {
                        _wheelNum = 0;
                        _wheelNint = 0;
                        _zoomBoolen = false;
                    }
                    _wheelNint++;
                    _camera.zoom = Math.max(sigleObj.minfov, Math.min(sigleObj.maxfov * 2, _camera.zoom - _wheelNum));
                }
            }
            _camera.updateProjectionMatrix();
        }
    }());

    this.doubleTouch = (function () {

        var touchTimeStart = 0;
        var touchTimeEnd = 0;
        var touchTimeDev = 0;
        var nowTime = 0;
        var touchDelta = new THREE.Vector2();
        var zoomBoo = false;
        var wheelnint = 0;
        var wheelnum = 0;
        var deltas = -3;
        var fovDiffer = 0;
        var stalls = 0;

        return function doubleTouch() {
            if (touchNum == 1) {
                touchNum = 2;
                touchTimeStart = new Date().getTime();
                fovDiffer = (sigleObj.maxfov - sigleObj.minfov) / 5;
                stalls = fovDiffer / 30;
            } else if (touchNum == 3) {
                touchNum = 0;
                touchTimeEnd = new Date().getTime();
                touchTimeDev = touchTimeEnd - touchTimeStart;
                touchDelta = touchDelta.subVectors(touchPointEnd, touchPointStart);
            }
            nowTime = new Date().getTime();
            if (nowTime >= touchTimeStart + 400) {
                touchTimeDev = -1;
                touchNum = 0;
                iftouchRotate = true;
            }

            if (0 < touchTimeDev && touchTimeDev <= 400 && touchDelta.length() <= 50 && iftouchRotate) {
                touchTimeStart = 0;
                touchTimeEnd = 0;

                zoomBoo = true;
                if (_camera.zoom >= sigleObj.maxfov * 2) {
                    deltas = 3;
                } else if (_camera.zoom <= sigleObj.minfov) {
                    deltas = -3;
                }
                touchTimeDev = -1;
            }

            if (zoomBoo) {
                if (wheelnint < 10) {
                    wheelnum = deltas * stalls * sigleObj.zoomSpeed;
                } else if (wheelnint >= 10 && wheelnint < 20) {
                    wheelnum = deltas * stalls * sigleObj.zoomSpeed;
                } else if (wheelnint >= 30) {
                    wheelnum = 0;
                    wheelnint = 0;
                    zoomBoo = false;
                }
                wheelnint++;
                _camera.zoom = Math.max(sigleObj.minfov, Math.min(sigleObj.maxfov * 2, _camera.zoom - wheelnum));
            }
        }
    }());

    function onContextMenu(evt) {
        evt.preventDefault();
    }

    function onDocumentMouseDown(evt) {

        if (drc.enabled === false) return;

        evt.preventDefault();
        evt.stopPropagation();

        if (_state === STATE.NONE) {
            _state = evt.button;
        }
        if (_state === STATE.ROTATE && !drc.noRotate) {
            _moveCurr.copy(getMouseOnCircle(evt.clientX, evt.clientY));
            _movePrev.copy(_moveCurr);
        } else if (_state === STATE.PAN && !drc.noPan) {
            _panStart.copy(getSceneToWorld(evt.pageX, evt.pageY));
            _panEnd.copy(_panStart);
        }

        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mouseup', onDocumentMouseUp, false);

        drc.dispatchEvent(startEvent);
    }

    function onDocumentMouseMove(evt) {

        if (drc.enabled === false) return;

        evt.preventDefault();
        evt.stopPropagation();

        if (_state === STATE.ROTATE && !drc.noRotate) {
            _movePrev.copy(_moveCurr);
            _moveCurr.copy(getMouseOnCircle(evt.clientX, evt.clientY));
        } else if (_state === STATE.PAN && !drc.noPan) {
            _panEnd.copy(_panStart);
            _panStart.copy(getSceneToWorld(evt.pageX, evt.pageY));
        }
    }

    function onDocumentMouseUp(evt) {

        if (drc.enabled === false) return;

        evt.preventDefault();
        evt.stopPropagation();

        _state = STATE.NONE;

        document.removeEventListener('mousemove', onDocumentMouseMove);
        document.removeEventListener('mouseup', onDocumentMouseUp);

        drc.dispatchEvent(endEvent);
    }

    function onDocumentMouseWheel(evt) {

        if (drc.enabled === false) return;

        evt.preventDefault();
        evt.stopPropagation();

        if (evt.wheelDelta) {
            _wheelDelta = evt.wheelDelta;
            // console.log(_wheelDelta)
            _detailBrowser = 1;
        } else if (evt.detail) {
            _wheelDelta = evt.detail;
            // console.log(_wheelDelta)
            _detailBrowser = 2;
        }
        _state = STATE.ZOOM;
        _wheelNint = 0;
        _wheelNum = 0;

        drc.dispatchEvent(startEvent);
        drc.dispatchEvent(endEvent);
    }

    function onDocumentTouchStart(evt) {

        if (drc.enabled === false) return;
        evt.preventDefault();
        evt.stopPropagation();

        switch (evt.touches.length) {
            case 1:
                _state = STATE.TOUCH_ROTATE;
                _moveCurr.copy(getMouseOnCircle(evt.touches[0].pageX, evt.touches[0].pageY));
                _movePrev.copy(_moveCurr);

                touchPointEnd.copy(touchPointStart);
                touchPointStart = new THREE.Vector2(evt.touches[0].pageX, evt.touches[0].pageY);
                //console.log("touchPointEnd  ",touchPointEnd);
                //console.log("touchPointStart  ",touchPointStart);
                break;
            case 2:
                _state = STATE.TOUCH_ZOOM_PAN;
                var dx = evt.touches[0].pageX - evt.touches[1].pageX;
                var dy = evt.touches[0].pageY - evt.touches[1].pageY;
                _touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt(dx * dx + dy * dy);

                var x = (evt.touches[0].pageX + evt.touches[1].pageX) / 2;
                var y = (evt.touches[0].pageY + evt.touches[1].pageY) / 2;
                _panStart.copy(getSceneToWorld(x, y));
                _panEnd.copy(_panStart);

                _zoomStart[0].set(evt.touches[0].pageX, evt.touches[0].pageY);
                _zoomStart[1].set(evt.touches[1].pageX, evt.touches[1].pageY);
                _zoomEnd[0].copy(_zoomStart[0]);
                _zoomEnd[1].copy(_zoomStart[1]);

                break;
        }
        drc.dispatchEvent(startEvent);
    }

    function onDocumentTouchMove(evt) {

        if (drc.enabled === false) return;

        evt.preventDefault();
        evt.stopPropagation();

        switch (evt.touches.length) {
            case 1:
                _movePrev.copy(_moveCurr);
                _moveCurr.copy(getMouseOnCircle(evt.touches[0].pageX, evt.touches[0].pageY));
                break;
            case 2:
                var dx = evt.touches[0].pageX - evt.touches[1].pageX;
                var dy = evt.touches[0].pageY - evt.touches[1].pageY;
                _touchZoomDistanceEnd = Math.sqrt(dx * dx + dy * dy);

                var x = (evt.touches[0].pageX + evt.touches[1].pageX) / 2;
                var y = (evt.touches[0].pageY + evt.touches[1].pageY) / 2;
                _panEnd.copy(_panStart);
                _panStart.copy(getSceneToWorld(x, y));

                _zoomEnd[0].copy(_zoomStart[0]);
                _zoomEnd[1].copy(_zoomStart[1]);
                _zoomStart[0].set(evt.touches[0].pageX, evt.touches[0].pageY);
                _zoomStart[1].set(evt.touches[1].pageX, evt.touches[1].pageY);
                break;
        }
    }


    function onDocumentTouchEnd(evt) {

        if (drc.enabled === false) return;
        switch (event.touches.length) {
            case 0:
                //if(_state === STATE.TOUCH_ROTATE)
                touchNum++;
                _state = STATE.NONE;
                _wheelNint = 0;
                _wheelNum = 0;
                _zoomBoolen = false;
                break;
            case 1:
                _state = STATE.TOUCH_ROTATE;
                _moveCurr.copy(getMouseOnCircle(evt.touches[0].pageX, evt.touches[0].pageY));
                _movePrev.copy(_moveCurr);
                break;
        }
        drc.dispatchEvent(endEvent);
    }

    function projectOnTrackball(dx, dy) {
        var mouse = {
            x: 1,
            y: 1
        };
        mouse.x = (dx / window.innerWidth) * 2 - 1;
        mouse.y = -(dy / window.innerHeight) * 2 + 1;
        var vector = new THREE.Vector3(-mouse.x, -mouse.y, 0.5);
        vector.unproject(camera);
        var v3 = new THREE.Vector3().subVectors(_objects.position, vector);
        return v3;
    }

    function getSceneToWorld(dx, dy) {
        var mouse = {
            x: 1,
            y: 1
        };
        mouse.x = (dx / window.innerWidth) * 2 - 1;
        mouse.y = -(dy / window.innerHeight) * 2 + 1;
        var vector = new THREE.Vector3(-mouse.x, -mouse.y, 0.5);
        vector.unproject(camera);
        return vector;
    }

    this.handleResize = function () {

        if (this.domElement === document) {

            this.screen.left = 0;
            this.screen.top = 0;
            this.screen.width = window.innerWidth;
            this.screen.height = window.innerHeight;

        } else {

            var box = this.domElement.getBoundingClientRect();
            // adjustments come from similar code in the jquery offset() function
            var d = this.domElement.ownerDocument.documentElement;
            this.screen.left = box.left + window.pageXOffset - d.clientLeft;
            this.screen.top = box.top + window.pageYOffset - d.clientTop;
            this.screen.width = box.width;
            this.screen.height = box.height;

        }
    };
    this.handleResize();

    var getMouseOnScreen = (function () {
        var vector = new THREE.Vector3();
        return function getMouseOnScreen(pageX, pageY) {
            vector.set(
                (pageX - drc.screen.left) / drc.screen.width,
                (pageY - drc.screen.top) / drc.screen.height, 0.5
            );
            return vector;
        };
    }());

    var getMouseOnCircle = (function () {
        var vector = new THREE.Vector3();
        return function getMouseOnCircle(pageX, pageY) {
            vector.set(
                ((pageX - drc.screen.width * 0.5 - drc.screen.left) / (drc.screen.width * 0.5)),
                ((drc.screen.height + 2 * (drc.screen.top - pageY)) / drc.screen.width), 0.5 // screen.width intentional
            );
            return vector;
        };
    }());
}

THREE.DragRotateControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.DragRotateControls.prototype.constructor = THREE.DragRotateControls;