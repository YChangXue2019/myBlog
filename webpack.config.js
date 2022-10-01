const HtmlWebpackPlugin=require('html-webpack-plugin');
const {resolve}=require("path");
 module.exports={
    entry:'./src/main.js',
    output:{
        path:resolve(__dirname,'dist'),
        filename:'bundle.js'
    },
    devtool:'source-map',
    plugins:[
        new HtmlWebpackPlugin({
            template:resolve(__dirname,'index.html')
        })
    ],
    devServer:{
        contentBase:'./dist',
        open:true,
    }
 }