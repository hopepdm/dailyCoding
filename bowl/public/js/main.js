var container, camera, scene, renderer, android, dragRotateControls, aspect, sigleObj, autoRotate = !1,
    isOuter = !0,
    hw, utilityStats = {
        version: "1.0.1",
        openLoding: !0,
        openMenu: !1
    };

function isMobile() {
    return navigator.userAgent.match( /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i )
}

function pathParser( a ) {
    a = a.objurl;
    var b = a.split( "." ),
        c = b[ 1 ],
        d = b[ 0 ].lastIndexOf( "/" ),
        e = b[ 0 ].substring( 0, d + 1 ),
        b = b[ 0 ].substring( d + 1 );
    return {
        modelpath: a,
        ext: c,
        basePath: e,
        modelName: b
    }
}

function checkType( a ) {
    a = a.fileName.split( "" );
    console.log( a );
    a.splice( 0, 1 );
    isOuter = 43 <= a.join( "" ) ? !1 : !0
}

function initScene( a ) {
    file = pathParser( a );
    sigleObj = a;
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, sigleObj.near, sigleObj.far );
    scene = new THREE.Scene();
    scene.background = new THREE.CubeTextureLoader().setPath( 'public/cube/' ).load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
    scene.add( camera );
    universalLoader( sigleObj.objurl, sigleObj.fileName, function ( a ) {
        android = a;
        a.traverse( function ( a ) {
            a instanceof THREE.Mesh && ( "MultiMaterial" == a.material.type ? a.material.materials.map( function ( a, b ) {
                a.color.setHex( sigleObj.diffuseColor );
                a.specular.setHex( sigleObj.specularColor );
                a.opacity = sigleObj.opacity;
                a.envMap = scene.background;
                a.shininess = sigleObj.shininess;
                a.wireframe = sigleObj.wireframeState;
                a.flatShading = !1;
                a.needUpdate = !0;
                sigleObj.wireframeState ? ( a.emissive.setHex( 15658734 ), a.wireframe = !0 ) : ( a.emissive.setHex( 0 ), a.wireframe = !1 )
            } ) : a.material instanceof Array ? a.material.map( function ( a, b ) {
                a.color.setHex( sigleObj.diffuseColor );
                a.specular.setHex( sigleObj.specularColor );
                a.opacity = sigleObj.opacity;
                a.shininess = sigleObj.shininess;
                a.envMap = scene.background;
                a.wireframe = sigleObj.wireframeState;
                a.flatShading = !1;
                a.needUpdate = !0;
                sigleObj.wireframeState ?
                    ( a.emissive.setHex( 15658734 ), a.wireframe = !0 ) : ( a.emissive.setHex( 0 ), a.wireframe = !1 )
            } ) : ( a.material.color.setHex( sigleObj.diffuseColor ), a.material.specular.setHex( sigleObj.specularColor ), a.material.envMap = scene.background, a.material.opacity = sigleObj.opacity, a.material.shininess = sigleObj.shininess, a.material.wireframe = sigleObj.wireframeState, a.material.flatShading = !1, a.material.needUpdate = !0, sigleObj.wireframeState ? ( a.material.emissive.setHex( 15658734 ), a.material.wireframe = !0 ) : ( a.material.emissive.setHex( 0 ), a.material.wireframe = !1 ) ) )
        } );
        scene.add( android );
        adjustSceneParam();
        dragRotateControls = new THREE.OrbitControls( camera, renderer.domElement, android );
        dragRotateControls.enablePan = !1;
        dragRotateControls.zoomSpeed = sigleObj.zoomSpeed;
        dragRotateControls.rotateSpeed = sigleObj.rotateSpeed;
        onWindowResize()
    }, function ( a ) {
        if ( a.lengthComputable ) {
            utilityStats.openLoding && $( ".loading" ).show();
            a = a.loaded / a.total * 100;
            var b = .01 * a;
            $( "#num" ).css( "left", 200 * b - 21 );
            $( "#num" ).html( Math.round( a, 2 ) + "%" );
            $( "#left" ).css( "left", 200 * ( b - 1 ) );
            100 == Math.round( a,
                2 ) && ( utilityStats.openMenu && ( $( ".autoplay" ).show(), $( ".tool" ).show() ), utilityStats.openLoding && $( ".loading" ).hide() )
        }
    } );
    renderer = new THREE.WebGLRenderer( {
        antialias: !0,
        logarithmicDepthBuffer: !0,
        alpha: !0
    } );
    renderer.setClearColor( {
        "\u7ea2\u7682": 5198677,
        "\u78a7\u7389\u77f3": 5674391,
        "\u7389\u77f3\u84dd": 5273731
    }[ sigleObj.background ], 1 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container = document.createElement( "div" );
    document.body.appendChild( container );
    container.appendChild( renderer.domElement );
    window.addEventListener( "resize", onWindowResize, !1 );
    animate()
}

function universalLoader( a, b, c, d, e ) {
    if ( "string" === typeof a ) {
        var f = a.split( "/" );
        f.pop();
        f = f.join( "/" );
        a.split( "." )[ 1 ].match( /\obj$/i ) ? ( a = new THREE.MTLLoader, a.setPath( f + "/" ), a.load( b + ".mtl", function ( a ) {
            a.preload();
            var g = new THREE.OBJLoader;
            g.setMaterials( a );
            g.setPath( f + "/" );
            g.load( b + ".obj", function ( a ) {
                c( a )
            }, d, e )
        } ) ) : a.split( "." )[ 1 ].match( /\js$/i ) ? ( new THREE.JSONLoader ).load( a, function ( a, b ) {
            b = 1 < b.length ? new THREE.MeshFaceMaterial( b ) : b[ 0 ];
            a = new THREE.Mesh( a, b );
            c( a )
        }, d, e ) : ( a.split( "." )[ 1 ].match( /\FBX$/i ) ||
            a.split( "." )[ 1 ].match( /\fbx$/i ) ) && ( new THREE.FBXLoader ).load( a, function ( a ) {
            c( a )
        }, d, e )
    } else console.log( "\u8def\u5f84\u9519\u8bef" )
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight )
}

function adjustSceneParam() {
    var a = ( new THREE.Box3 ).setFromObject( android ).getSize( new THREE.Vector3 );
    hw = Math.max( a.x, a.y, a.z );
    android.scale.set( 100 / hw, 100 / hw, 100 / hw );
    hw = 100;
    isOuter ? 0 == sigleObj.modelPosition.x ? camera.position.set( 0, 0.5 * hw, 1.75 * hw ) : camera.position.set( sigleObj.modelPosition.x, sigleObj.modelPosition.y, sigleObj.modelPosition.z ) : camera.position.set( 0, 0, .1 );
    var tween = new TWEEN.Tween(camera.position.set(0, 10.0 * hw, 35.0 * hw)).to({x:0, y:hw / 2.0, z:1.75 * hw}, 1500).start();
    sigleObj.ambient && ( ambientLight = new THREE.AmbientLight( 16777215 ), scene.add( ambientLight ) );
    lightColor = sigleObj.lightSet.color;
    lightIntensity =
        sigleObj.lightSet.intensity;
    light1 = new THREE.DirectionalLight( lightColor, lightIntensity );
    light1.position.set( hw, hw, hw );
    light1.target = android;
    camera.add( light1 )
}

function animate() {
    requestAnimationFrame( animate );
    dragRotateControls && ( dragRotateControls.update(), autoRotate && dragRotateControls.autoRotate1() );
    TWEEN.update();
    renderer.render( scene, camera )
}
var $lis = $( ".tool li" ),
    $ul = $( ".tool ul" );
$( ".tool .switch" ).click( function ( a ) {
    a.preventDefault();
    a.stopPropagation();
    $( this ).hasClass( "close" ) ? ( $( this ).removeClass( "close" ).addClass( "open" ), $ul.show(), $lis.each( function ( a, c ) {
        $( c ).animate( {
            bottom: 25 * ( a + 1 ) + 28 * a + "px",
            opacity: 1
        }, 300, "swing", function () {
            $( c ).animate( {
                bottom: 20 * ( a + 1 ) + 28 * a + "px"
            }, 200 )
        } )
    } ) ) : $( this ).hasClass( "open" ) && ( $( this ).removeClass( "open" ).addClass( "close" ), $lis.each( function ( a, c ) {
        $( c ).animate( {
            bottom: "0px",
            opacity: 0
        }, 200, function () {
            $ul.hide()
        } )
    } ) )
} );
$( ".tool .switch" ).on( "touchstart", function ( a ) {
    a.preventDefault();
    a.stopPropagation();
    $( this ).hasClass( "close" ) ? ( $( this ).removeClass( "close" ).addClass( "open" ), $ul.show(), $lis.each( function ( a, c ) {
        $( c ).animate( {
            bottom: 25 * ( a + 1 ) + 28 * a + "px",
            opacity: 1
        }, 300, "swing", function () {
            $( c ).animate( {
                bottom: 20 * ( a + 1 ) + 28 * a + "px"
            }, 200 )
        } )
    } ) ) : $( this ).hasClass( "open" ) && ( $( this ).removeClass( "open" ).addClass( "close" ), $lis.each( function ( a, c ) {
        $( c ).animate( {
            bottom: "0px",
            opacity: 0
        }, 200, function () {
            $ul.hide()
        } )
    } ) )
} );
$ul.on( "click", function ( a ) {
    a.preventDefault();
    a.stopPropagation();
    dragRotateControls.reset();
    a = $( a.target ).attr( "name" );
    dragRotateControls.rotateTo( a )
} );
$ul.on( "touchstart", function ( a ) {
    a.preventDefault();
    a.stopPropagation();
    dragRotateControls.reset();
    a = $( a.target ).attr( "name" );
    dragRotateControls.rotateTo( a )
} );
$( "#autoplay" ).on( "click", function ( a ) {
    a.preventDefault();
    a.stopPropagation();
    $( this ).hasClass( "stop" ) ? ( $( this ).removeClass( "stop" ).addClass( "play" ), autoRotate = !0 ) : ( $( this ).removeClass( "play" ).addClass( "stop" ), autoRotate = !1 )
} );
$( "#autoplay" ).on( "touchstart", function ( a ) {
    a.preventDefault();
    a.stopPropagation();
    $( this ).hasClass( "stop" ) ? ( $( this ).removeClass( "stop" ).addClass( "play" ), autoRotate = !0 ) : ( $( this ).removeClass( "play" ).addClass( "stop" ), autoRotate = !1 )
} );
$( ".tool" )[ 0 ].addEventListener( "mousemove", function ( a ) {
    a.preventDefault();
    a.stopPropagation()
} );
$( ".tool" )[ 0 ].addEventListener( "touchmove", function ( a ) {
    a.preventDefault();
    a.stopPropagation()
} );
$( "#autoplay" )[ 0 ].addEventListener( "mousemove", function ( a ) {
    a.preventDefault();
    a.stopPropagation()
} );
$( "#autoplay" )[ 0 ].addEventListener( "touchmove", function ( a ) {
    a.preventDefault();
    a.stopPropagation()
} );