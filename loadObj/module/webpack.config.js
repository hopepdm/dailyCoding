const path = require( 'path' );
const webpack = require( 'webpack' );
const extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        vendor: [ 'three', 'jquery' ],
        app: './public/js/main.js'
    },

    output: {
        path: path.join( __dirname, 'public' ),
        filename: 'app.js'
    },
    // resolve: {
    //     extensions: [ '.js', '.css' ],
    //     alias: {
    //         'three1': path.resolve(__dirname,'public/js/three.js'),
    //         'jquery1': path.resolve(__dirname,'public/js/jquery-3.1.1.js')
    //     }
    // },

    module: {
        rules: [ {
                test: /\.(css|scss)$/,
                exclude: /(node_modules)/,
                use: extractTextPlugin.extract( {
                    fallback: 'style-loader',
                    use: [ {
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    } ]
                } )
            }, {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use: [ {
                    loader: 'babel-loader?cacheDirectory=true',
                    options: {
                        presets: [ 'env', 'react' ]
                    }
                } ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [ {
                    loader: 'url-loader',
                    options: {
                        limit: 20480,
                        name: 'image/[name][hash].[ext]'
                    }
                } ]
            },
            {
                test: /\.worker\.js$/,
                use: {
                    loader: 'worker-loader',
                    options: {
                        inline: true
                    }
                }
            },
            {
                test: /\.html$/,
                use: [ 'html-loader' ]
            }

        ]
    },

    plugins: [
        // CommonsChunkPlugin可以让我们在几个模块之间抽取出公共部分内容，并且把他们添加到公共的打包模块中
        // new webpack.optimize.CommonsChunkPlugin( {
        //     name: 'vendor',
        //     filename: 'vendor.js',
        //     minChunks: Infinity // 该模块至少被其他模块调用多少次时，才会被打包到公共模块中，这个数字必须大于等于2，当传入Infinity时会马上生成
        // } ),
        //全局引入模块 ，这样模块就可以直接使用无需引入
        // new webpack.ProvidePlugin( {
        //     $: 'jquery1',
        //     jQuery: 'jquery1',
        //     THREE: 'three1'
        // } ),
        new webpack.optimize.UglifyJsPlugin( {
            compress: {
                warnings: false
            },
            include: ['$','THREE'] //排除关键字
        } ),
        
    ]

};