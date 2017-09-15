var webpack = require('webpack');
var config = require('./webpack.config.js');

var compiler = webpack(config);
compiler.run(function (err, stats) {
	console.log("build complete", stats.toString()); // по завершению, выводим всю статистику
});
