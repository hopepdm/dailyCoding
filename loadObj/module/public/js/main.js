/**
 * Created by Hope_pdm / Huang xianglong
 * 本代码适用于单器物展示，可以自定义背景和load界面及控制界面
 * 
 */

var container, camera, scene, renderer, android, dragRotateControls, aspect, file;

var sigleObj, autoRotate = false;

var isOuter = true,
    hw;

var utilityStats = {
    version: '1.0.1',
    openLoding: true, //开启加载界面
    openMenu: false, //开启控制界面
};

/**
 * 检测是否是移动端
 * 
 * @returns 
 */
function isMobile() {
    return ( navigator.userAgent.match( /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i ) );
}


/**
 * 解析obj模型文件路径，返回一个对象，包含该模型的路径，后缀，文件名等
 * 
 * @param {any} obj 
 * @returns 
 */
function pathParser( obj ) {
    var modelpath = obj.objurl;
    var arrs = modelpath.split( "." );
    var ext = arrs[ 1 ];
    var s = arrs[ 0 ].lastIndexOf( '/' );
    var basePath = arrs[ 0 ].substring( 0, s + 1 );
    var modelName = arrs[ 0 ].substring( s + 1 );

    return {
        modelpath: modelpath,
        ext: ext,
        basePath: basePath,
        modelName: modelName
    };
}

/**
 * 根据文件名判断文物类型
 * 洞窟、配殿、器物
 *  
 */
function checkType( obj ) {
    var fileName = obj.fileName.split( '' );
    console.log( fileName );
    fileName.splice( 0, 1 );
    if ( fileName.join( '' ) >= 43 ) {
        isOuter = false;
    } else {
        isOuter = true;
    }
}

/**
 * 主函数，生成场景
 * 
 * @param {any} obj 
 */
function initScene( obj ) {
    file = pathParser( obj );
    // checkType( obj ); //通过检测文件名判断相机位置，里/外
    sigleObj = obj;
    var modelpath = file.modelpath;
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, sigleObj.near, sigleObj.far );
    // camera = new THREE.OrthographicCamera( window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 10, 1000);
   
    scene = new THREE.Scene();

    scene.add(camera);

    var manager = new THREE.LoadingManager();
    // manager.onLoad = function() {
    //   $("#loaderdiv").hide();
    // };

    //异步回调进程函数，表示加载进程及后续操作
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            if ( utilityStats.openLoding ) {
                $( ".loading" ).show();
            }
            var percentComplete = xhr.loaded / xhr.total * 100;

            var num = 0.01 * percentComplete;

            $( "#num" ).css( "left", num * 200 - 21 );
            $( "#num" ).html( Math.round( percentComplete, 2 ) + "%" );
            $( "#left" ).css( "left", ( num - 1 ) * 200 );
            if ( Math.round( percentComplete, 2 ) == 100 ) {
                if ( utilityStats.openMenu ) {
                    $( '.autoplay' ).show();
                    $( '.tool' ).show();
                }

                if ( utilityStats.openLoding ) {
                    $( ".loading" ).hide();
                }
            }
        }
    };

    //添加光照
    addLight();


    universalLoader( sigleObj.objurl, sigleObj.fileName, function ( object ) {
        if ( sigleObj.modelRotation ) {
            object.rotation.x = sigleObj.modelRotation.x;
            object.rotation.y = sigleObj.modelRotation.y;
            object.rotation.z = sigleObj.modelRotation.z;
        }
        if ( sigleObj.modelPosition ) {
            object.position.x = sigleObj.modelPosition.x;
            object.position.y = sigleObj.modelPosition.y;
            object.position.z = sigleObj.modelPosition.z;
        }
        if ( sigleObj.fileName == 'caiguan' || sigleObj.fileName == 'cizhen' || sigleObj.fileName == 'falangbei' ) {
            object.children[ 0 ].material.materials.forEach( function ( ele ) {
                ele.specular.setHex( 0x101010 );
                ele.shininess = 60;
            } );
        }
        // object.castShadow = true;
        // object.receiveShadow = true;
        // for ( var k in object.children ) {
        //     object.children[ k ].castShadow = true;
        //     object.children[ k ].receiveShadow = true;
        // }
        // object.position.set( 0, 0, 0 );
        scene.add( object );

        //设置器物颜色
        android = object;

        android.traverse( function ( ele ) {
            
            if ( ele instanceof THREE.Mesh ) {
                if ( ele.material.type == 'MultiMaterial' ) {
                    ele.material.materials.map( function ( obj, index ) {
                        obj.flatShading = 0;
                        obj.needUpdate = true;
                        obj.specular = 0x101010;
                        obj.shininess = 40;
                    } );
                } else {
                    ele.material.flatShading = 0;
                    ele.material.needUpdate = true;
                    ele.material.specular = 0x101010;
                    ele.material.shininess = 40;
                }

            }
        } );

        // var colorMaterial = 0xe3c5ac;
        // if ( android.children.length != 0 && android.children[ 0 ].material.hasOwnProperty( 'color' ) ) {
        //   android.children.forEach( function ( ele ) {
        //     ele.material.color.setHex( colorMaterial );
        //   } );
        // }

        adjustSceneParam();
        dragRotateControls = new THREE.OrbitControls( camera, renderer.domElement );
        if ( isOuter ) {
            dragRotateControls.enableZoom = true;
            dragRotateControls.enablePan = true;
            dragRotateControls.minDistance = hw / 1.5;
            dragRotateControls.maxDistance = 3 * hw;
        } else {
            dragRotateControls.enableZoom = false; //禁止缩放
            dragRotateControls.enablePan = false;
            dragRotateControls.minPolarAngle = Math.PI / 4; // 俯视角
            dragRotateControls.maxPolarAngle = Math.PI; // 仰视角

        }

        if ( utilityStats.openMenu && autoRotate == true ) {
            dragRotateControls.autoRatate = true; //禁止自动旋转
        } else {
            dragRotateControls.autoRatate = false; //禁止自动旋转
        }
    }, onProgress );
    
    // renderer
    renderer = new THREE.WebGLRenderer( {
        antialias: true,
        logarithmicDepthBuffer: true, //使用深度缓冲，避免z-fighting
        alpha: true
    } );
    renderer.setClearColor( 0xd8ebef, 0.0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true; // 启用阴影选项

    container = document.createElement( 'div' );
    document.body.appendChild( container );
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    animate();
}


/**
 * 常用模型加载器封装
 * @argument urls string 模型路径
 * @argument onLoad function 模型处理函数
 */
function universalLoader( urls, fileName, onLoad, onProgress, onError ) {
    if ( typeof ( urls ) === 'string' ) {
        var url = urls;
        var path = urls.split( '/' );
        path.pop();
        path = path.join( '/' );
        console.log( path );

        //load per type
        if ( ( urls.split('.')[1] ).match( /\obj$/i ) ) {
            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.setPath( path + '/' );
            mtlLoader.load( fileName + '.mtl', function ( materials ) {
                materials.preload();

                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials( materials );
                objLoader.setPath( path + '/' );
                objLoader.load( fileName + '.obj', function ( object ) {
                    onLoad( object );
                }, onProgress, onError );
            } );
        } else if ( ( urls.split('.')[1] ).match( /\js$/i ) ) {
            var JSONloader = new THREE.JSONLoader();
            JSONloader.load( url, function ( geometry, materials ) {
                var material;
                if ( materials.length > 1 ) {
                    material = new THREE.MeshFaceMaterial( materials );
                } else {
                    material = materials[ 0 ];
                }
                var mesh = new THREE.Mesh( geometry, material );
                onLoad( mesh );
            }, onProgress, onError );
        } else if ( ( urls.split('.')[1] ).match( /\FBX$/i ) ) {
            console.log('load FBXfile');
            var FBXLoader = new THREE.FBXLoader();
            FBXLoader.load(urls, function( object ) {
                onLoad( object );
            });
        }

    } else {
        console.log( '路径错误' );
    }

}

/**
 * 重置窗口
 * 
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

/**
 * 通过包围盒子判断模型的长宽高，自适应设置相机位置
 * 
 */
function adjustSceneParam() {

    var size = new THREE.Box3().setFromObject( android ).getSize( new THREE.Vector3() );
    
    var width = size.x;

    hw = Math.max( size.x, size.y, size.z );

    if ( isOuter ) {
        camera.position.set( 0, 0.5 * hw, 1.75 * hw );
    } else {
        camera.position.set( 0, 0, 0.1 );
    }


}

function addLight() {
    //根据尺寸调整灯光位置
    var intensity;
    var ambientIntensity = 1.5;
    if ( isOuter ) {
        intensity = 0.2;
    } else {
        intensity = 0.9;
    }
    var colorlight = 0xffffff;
    var dirLight1 = new THREE.DirectionalLight( colorlight, intensity * 9 );
    dirLight1.position.set( 2, 2, 2 ); //上1
    dirLight1.castShadow = true;
    // dirLight1.shadow.camera.near = 0.001;
    // dirLight1.shadow.camera.far = 100000;
    // dirLight1.shadow.camera.visible = true;            

    camera.add( dirLight1 );

    // var dirLight2 = new THREE.DirectionalLight( colorlight, intensity );
    // dirLight2.position.set( 0, -2, 0 ); //下
    // scene.add( dirLight2 );

    // var dirLight3 = new THREE.DirectionalLight( colorlight, intensity ); //3
    // dirLight3.position.set( 2, 0, 0 );
    // scene.add( dirLight3 );

    // var dirLight4 = new THREE.DirectionalLight( colorlight, intensity ); //4
    // dirLight4.position.set( -2, 0, 0 );
    // scene.add( dirLight4 );

    // var dirLight5 = new THREE.DirectionalLight( colorlight, intensity ); //下1
    // dirLight5.position.set( 0, 0, 2 );
    // scene.add( dirLight5 );

    // var dirLight6 = new THREE.DirectionalLight( colorlight, intensity ); //2
    // dirLight6.position.set( 0, 0, -2 );
    // scene.add( dirLight6 );

    // if ( sigleObj.ambient ) {
    //     var ambient = new THREE.AmbientLight( colorlight, ambientIntensity );
    //     scene.add( ambient );
    // }
}

function animate() {

    requestAnimationFrame( animate );

    if ( android ) {
        dragRotateControls.update();
    }

    renderer.render( scene, camera );
}

// function render() {
//     renderer.render( scene, camera );
// }

var $lis = $( '.tool li' );
var $ul = $( '.tool ul' );
$( '.tool .switch' ).click( function ( event ) {
    event.preventDefault();
    event.stopPropagation();

    if ( $( this ).hasClass( 'close' ) ) {
        $( this ).removeClass( 'close' ).addClass( 'open' );
        $ul.show();
        $lis.each( function ( index, item ) {
            $( item ).animate( {
                bottom: ( index + 1 ) * 25 + index * 28 + 'px',
                opacity: 1
            }, 300, 'swing', function () {
                $( item ).animate( {
                    bottom: ( index + 1 ) * 20 + index * 28 + 'px'
                }, 200 );
            } );
        } );
    } else if ( $( this ).hasClass( 'open' ) ) {
        $( this ).removeClass( 'open' ).addClass( 'close' );
        $lis.each( function ( index, item ) {
            $( item ).animate( {
                bottom: '0px',
                opacity: 0
            }, 200, function () {
                $ul.hide();
            } );
        } );
    }

} );
$( '.tool .switch' ).on( 'touchstart', function ( event ) {
    event.preventDefault();
    event.stopPropagation();

    if ( $( this ).hasClass( 'close' ) ) {
        $( this ).removeClass( 'close' ).addClass( 'open' );
        $ul.show();
        $lis.each( function ( index, item ) {
            $( item ).animate( {
                bottom: ( index + 1 ) * 25 + index * 28 + 'px',
                opacity: 1
            }, 300, 'swing', function () {
                $( item ).animate( {
                    bottom: ( index + 1 ) * 20 + index * 28 + 'px'
                }, 200 );
            } );
        } );
    } else if ( $( this ).hasClass( 'open' ) ) {
        $( this ).removeClass( 'open' ).addClass( 'close' );
        $lis.each( function ( index, item ) {
            $( item ).animate( {
                bottom: '0px',
                opacity: 0
            }, 200, function () {
                $ul.hide();
            } );
        } );
    }

} );
$ul.on( 'click', function ( event ) {
    event.preventDefault();
    event.stopPropagation();
    dragRotateControls.reset();
    var name = $( event.target ).attr( 'name' );
    dragRotateControls.rotateTo( name );

    console.log( $( event.target ).attr( 'name' ) );
} );
$ul.on( 'touchstart', function ( event ) {
    event.preventDefault();
    event.stopPropagation();
    dragRotateControls.reset();
    var name = $( event.target ).attr( 'name' );
    dragRotateControls.rotateTo( name );

    console.log( $( event.target ).attr( 'name' ) );
} );
$( '#autoplay' ).on( 'click', function ( event ) {
    event.preventDefault();
    event.stopPropagation();
    if ( $( this ).hasClass( 'stop' ) ) {
        $( this ).removeClass( 'stop' ).addClass( 'play' );
        autoRotate = true;
    } else {
        $( this ).removeClass( 'play' ).addClass( 'stop' );
        autoRotate = false;
    }

} );
$( '#autoplay' ).on( 'touchstart', function ( event ) {
    event.preventDefault();
    event.stopPropagation();
    if ( $( this ).hasClass( 'stop' ) ) {
        $( this ).removeClass( 'stop' ).addClass( 'play' );
        autoRotate = true;
    } else {
        $( this ).removeClass( 'play' ).addClass( 'stop' );
        autoRotate = false;
    }

} );
//reset event
$( '.tool' )[ 0 ].addEventListener( 'mousemove', function ( event ) {
    event.preventDefault();
    event.stopPropagation();
} );
$( '.tool' )[ 0 ].addEventListener( 'touchmove', function ( event ) {
    event.preventDefault();
    event.stopPropagation();
} );
$( '#autoplay' )[ 0 ].addEventListener( 'mousemove', function ( event ) {
    event.preventDefault();
    event.stopPropagation();
} );
$( '#autoplay' )[ 0 ].addEventListener( 'touchmove', function ( event ) {
    event.preventDefault();
    event.stopPropagation();
} );
