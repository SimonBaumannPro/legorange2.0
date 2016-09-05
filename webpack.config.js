const path = require('path');
const process = require('process');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const config = {
	entry: {
		vendor: [
				 'imports?exports=>false&module=>false!jquery',
				 'font-awesome',
				 'touchswipe',
				 'mouse',
				 'widgets',
				 'draggable',
				 'hammer',
				 'touch-punch',
				 'foundation',
				 'imports?this=>window!jq-mobile',
				 'jq-mobile-css',
				 'imports?exports=>false&module=>false!webcom'
		],
		script: ['./src/script.js']
	},
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, './dist'),
		publicPath: process.env.PUBLIC_PATH || '/'
	},
	resolve: {
    	root: __dirname,
        alias: {
        	jquery: 'jquery/dist/jquery.min.js',
        	'mouse' : 'jquery-ui/ui/widgets/mouse.js',
        	'webcom': 'webcom/webcom.js',
        	'hammer' : 'hammerjs/hammer.min.js',
			'font-awesome': 'font-awesome/css/font-awesome.min.css',
			'touchswipe' : 'jquery-touchswipe/jquery.touchSwipe.min.js',
			'jq-mobile' : 'jquery-mobile/dist/jquery.mobile.min.js',
			'jq-mobile-css' : 'jquery-mobile/dist/jquery.mobile.min.css',
			'widgets' : 'jquery-ui/ui/widget.js',
        	'draggable' : 'jquery-ui/ui/widgets/draggable.js',
        	'touch-punch' : 'jquery-ui-touch-punch/jquery.ui.touch-punch.min.js',
			'foundation' : 'foundation-sites/dist/foundation.min.js',
        },
        extensions: ["", ".webpack.js", ".web.js", ".js", ".css", ".min.css", ".scss"],
        modulesDirectories: ["node_modules"]
    },
	module: {
		loaders: [
			{ test: /\.png$/, loader: 'url-loader?mimetype=image/png'},
			{
        		test: /\.scss$/,
        		loaders: ["style", "css", "sass"]
      		},
			{ 
			  	test: /\.(eot|gif|woff|woff2|ttf|svg|)(\?\S*)?$/,
			  	loader: 'url?limit=100000&name=[name].[ext]'
			}	
		],
		noParse: [	
			/jquery\.min\.js$/,
			/webcom\.js$/
		]
	},
	sassLoader: {
    	includePaths: [path.resolve(__dirname, "node_modules/foundation-sites/scss"),
    				   path.resolve(__dirname, "node_modules/motion-ui")]
  	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
			inject: 'body'
		}),
		new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
		new webpack.DefinePlugin({
			__WEBCOM_SERVER__: JSON.stringify(process.env.WS_SERVER || 'https://webcom.orange.com'),
			__NAMESPACE__: JSON.stringify(process.env.NAMESPACE || 'legorange')
		})
	],
	progress: true,
	target: 'web'
};

if (process.env.NODE_ENV !== 'production') {
	config.entry.vendor = config.entry.vendor.concat([
		'./hotReload',
		'webpack/hot/dev-server'
	]);
	config.module.loaders = config.module.loaders.concat([
		{ test: /\.less$/, loader: 'style-loader!css-loader?sourceMap!less-loader?sourceMap'},
		{ test: /\.css$/,  loader: 'style-loader!css-loader?sourceMap' },
	]);
	config.devtool = 'eval-cheap-module-source-map';
	config.debug = true;
} else {
	config.plugins = config.plugins.concat([
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}),
		new ExtractTextPlugin('[name].css')
	]);
	config.module.loaders = config.module.loaders.concat([
		{ test: /\.less/, loader: ExtractTextPlugin.extract(
			'style',
			'css-loader?sourceMap&minimize!less-loader?sourceMap'
		)},
		{ test: /\.css/, loader: ExtractTextPlugin.extract(
			'style',
			'css-loader?sourceMap&minimize!less-loader?sourceMap'
		)} 
	]);
	config.devtool = 'source-map';
	config.debug = false;
}

module.exports = config;

