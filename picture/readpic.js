var path = require( 'path' );
var fs = require( 'fs' );
var buf = new Buffer( 1024 * 1024 );
console.log( '准备打开已存在的文件！' );

fs.open( 'test2.jpg', 'r+', function ( err, fd ) {
    //fd 文件描述符
    if ( err ) {
        return console.error( err );
    }
    console.log( 'open file success!' );
    console.log( 'begin to read file:' );
    // fs.read(fd, buf, 0, buf.length, 0, function(err, bytes) {
    //     if(err) {
    //         console.err(err);
    //     }
    //     console.log(bytes + ' 字节被读取');

    //     //仅输出读取字节
    //     if(bytes > 0) {
    //         //从缓冲区返回字节
    //         console.log(buf.slice(0,bytes));
    //     }
    //     fs.close(fd, function(err) {
    //         if(err) {
    //             console.err(err);
    //         }
    //         console.log('close success');
    //     });
    // });

    // 截取文件

    fs.read( fd, buf, 0, buf.length, 0, function ( err, bytes ) {
        if ( err ) {
            console.log( err );
        }

        console.log(bytes + ' 字节被读取');
        // 仅输出读取的字节
        if ( bytes > 0 ) {
            console.log( buf.slice( 0, bytes ) );
            fs.writeFileSync( 'test22-1.jpg', buf.slice( 0, bytes ), function ( err ) {
                if ( err ) {
                    return console.log( err );
                }
            } );
        }

        // 关闭文件
        fs.close( fd, function ( err ) {
            if ( err ) {
                console.log( err );
            }
            console.log( "文件关闭成功！" );
        } );
    } );
} );