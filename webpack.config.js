const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlagin = require('html-webpack-plugin')

module.exports = (env) => {
    return {
        mode: env.mode ?? "development",
        entry: path.resolve(__dirname,'src','index.js'),
        output: {
            path:path.resolve(__dirname,'build'), 
            filename:'[name].[contenthash].js',
            clean:true,
        },
        module:{
            rules:[
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                      MiniCssExtractPlugin.loader,
                      "css-loader",
                      "sass-loader",
                    ],
                },
            ]
        },
        devServer:{
            port:env.port ?? 5000,
            open:true
        },
        plugins:[
            new HtmlWebpackPlagin({
                template:path.resolve(__dirname,'public','index.html')
            }),
            new webpack.ProgressPlugin(),
            new MiniCssExtractPlugin({
                filename:'css/[name].[contenthash:8].css',
                chunkFilename:'css/[name].[contenthash:8].css'
            }),
        ],
        devtool: 'source-map'
    }
}