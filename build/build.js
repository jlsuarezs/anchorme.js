const path = require("path");
const rollup = require('rollup');
const srcPath = path.join(process.cwd(),"src","index.js");
const distDir = path.join(process.cwd(),"dist") + "/";
const fs = require("fs");
const uglifyjs = require("uglify-js");
const babel = require("rollup-plugin-babel");

require("./watcher/index.js");

var count = 0;

function build(){
	rollup.rollup({
		entry: srcPath,
		plugins:[
			babel({exclude: 'node_modules/**'}),
	    ]
	}).then((bundle) => {
		
		// Universal
		var umd = bundle.generate({
			format:"umd",
			moduleName:"anchorme"
		});
		fs.writeFileSync(distDir+"anchorme.js",umd.code);

		var minified = uglifyjs.minify(umd.code,{fromString:true}).code;
		fs.writeFileSync(distDir+"anchorme.min.js",minified);
		count++;
		console.log("files rebuilt for the",count,"time");
	}).catch((err)=>{
		console.log(err);
		process.exit(1);
	});
}

build();
new fs._watcher(path.dirname(srcPath)).watch(build);