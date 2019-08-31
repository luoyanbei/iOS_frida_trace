

var logContentArray = new Array();

var singlePrefix = "|----"




// generic trace
function trace(pattern)
{
	var type = (pattern.indexOf(" ") === -1) ? "module" : "objc";
	var res = new ApiResolver(type);
	var matches = res.enumerateMatchesSync(pattern);
	var targets = uniqBy(matches, JSON.stringify);

	targets.forEach(function(target) {
		if (type === "objc")
			traceObjC(target.address, target.name);
		else if (type === "module")
			traceModule(target.address, target.name);
	});
}


// remove duplicates from array
function uniqBy(array, key) 
{
	var seen = {};
	return array.filter(function(item) {
		var k = key(item);
		return seen.hasOwnProperty(k) ? false : (seen[k] = true);
	});

}

// 获取打印前缀
function gainLogPrefix_Module(theArray,status)
{
	var lastIndex = theArray.length - 1;

	if (lastIndex<0)
	{
		return singlePrefix;
	}
	
	var tmpLogContent = theArray[lastIndex];

	// console.log("最后一条打印：\n"+tmpLogContent);
	var count = tmpLogContent.split('|---').length-1

	// var count = (tmpLogContent.split(singlePrefix)).length;

	// console.log("有"+count.toString()+"个");

	var cIndex = tmpLogContent.indexOf("entered--");

	if ( cIndex == -1)//不是"entered--" 标记
	{
		var cIndex2 = status.indexOf("exiting--");
		var cIndex2_1 = status.indexOf("entered--");

		var cIndex3 = tmpLogContent.indexOf("exiting--");

		if (cIndex3 == -1)
		{
			if(cIndex2_1 == -1)
			{
				//平级
				var resultStr = gainPrefixForCount(count);//tmpLogContent.slice(0,cIndex);//replace(/entered--/, "");
				// console.log("("+tmpLogContent+")前缀是：("+resultStr+")");
				return resultStr;
			}
			else
			{
				//加
				var resultStr = gainPrefixForCount(count+1);//singlePrefix + tmpLogContent.slice(0,cIndex);//replace(/entered--/, "");
				// console.log("("+tmpLogContent+")前缀是：("+resultStr+")");
				return resultStr;
			}

			
		}
		else
		{
			if (cIndex2 == -1)
			{
				//平级
				var resultStr = gainPrefixForCount(count);//tmpLogContent.slice(0,cIndex);//replace(/entered--/, "");
				// console.log("("+tmpLogContent+")前缀是：("+resultStr+")");
				return resultStr;
			}
			else
			{
				//缩进
				var resultStr = gainPrefixForCount(count-1);
				return resultStr;
			}
		}

		
	}
	else
	{

		if (status.indexOf("entered--")==-1)//被搜索str，不是 entered-- 标记
		{
			//不是 entered-- 标记
			//与上一条输出 平级
			var resultStr = gainPrefixForCount(count);//tmpLogContent.slice(0,cIndex);//replace(/entered--/, "");
			// console.log("("+tmpLogContent+")前缀是：("+resultStr+")");
			return resultStr;
		}
		else
		{
			//是 entered-- 标记
			//在上个方法的内部
			var resultStr = gainPrefixForCount(count+1);//singlePrefix + tmpLogContent.slice(0,cIndex);//replace(/entered--/, "");
			// console.log("("+tmpLogContent+")前缀是：("+resultStr+")");
			return resultStr;
		}
		
	}
	


	return "";

}


function gainPrefixForCount(count)
{
	var result = singlePrefix;

	for (var i=0; i<count-1; i++)
	{
		result = result + singlePrefix;
	}

	return result;
}


// trace ObjC methods
function traceObjC(impl, name)
{
	console.log("Tracing " + name);

	Interceptor.attach(impl, {

		onEnter: function(args) {

			// debug only the intended calls
			this.flag = 0;
			// if (ObjC.Object(args[2]).toString() === "1234567890abcdef1234567890abcdef12345678")
				this.flag = 1;

			if (this.flag) {
				// console.warn("\n*** entered " + name);
				var logContent_1 = "entered--"+name;
				var prefixStr = gainLogPrefix_Module(logContentArray,"entered--");

				// console.log("前缀是：("+prefixStr+")\n");
				logContentArray.push(prefixStr + logContent_1);

				console.warn(prefixStr + logContent_1);

				// print full backtrace
				// console.log("\nBacktrace:\n" + Thread.backtrace(this.context, Backtracer.ACCURATE)
				//		.map(DebugSymbol.fromAddress).join("\n"));

				// print caller
				// console.log(prefixStr+"Caller: " + DebugSymbol.fromAddress(this.returnAddress));

				// print args
				if (name.indexOf(":") !== -1) {

					var par = name.split(":");
					par[0] = par[0].split(" ")[1];
					for (var i = 0; i < par.length - 1; i++)
					{
						printArg(prefixStr + par[i] + ": ", args[i + 2]);
					}

				}
			}

		},

		onLeave: function(retval) {

			if (this.flag) {

				// print retval
				var prefixStr = gainLogPrefix_Module(logContentArray,"exiting--");

				printArg(prefixStr+"retval: ", retval);


				var logContent_2 = "exiting--"+name;
				logContentArray.push(prefixStr + logContent_2);
				console.warn(prefixStr + logContent_2);

			}
		}

	});
}

// trace Module functions
function traceModule(impl, name)
{
	console.log("Tracing " + name);

	Interceptor.attach(impl, {

		onEnter: function(args) {

			// debug only the intended calls
			this.flag = 0;
			// var filename = Memory.readCString(ptr(args[0]));
			// if (filename.indexOf("Bundle") === -1 && filename.indexOf("Cache") === -1) // exclusion list
			// if (filename.indexOf("my.interesting.file") !== -1) // inclusion list
				this.flag = 1;



			if (this.flag) {
				console.warn("\n*** entered " + name);

				// print backtrace
				console.log("\nBacktrace:\n" + Thread.backtrace(this.context, Backtracer.ACCURATE)
						.map(DebugSymbol.fromAddress).join("\n"));
			}
		},

		onLeave: function(retval) {

			if (this.flag) {
				// print retval
				printArg("\nretval: ", retval);
				console.warn("\n*** exiting " + name);
			}
		}

	});
}

// print helper
function printArg(desc, arg)
{

	try {

		// 当 arg 是 基本数据类型(布尔和数字)导致ObjC.Object(arg)崩溃，
		//然而不会触发catch捕获异常，因此注释;如有能解决的方式，跪求告知
		//console.log(desc + ObjC.Object(arg));
		//logContentArray.push(desc + ObjC.Object(arg));			
		
		console.log(desc + arg);
		logContentArray.push(desc + arg.toString());//这样不会崩溃


	}
	catch(err) {

		logContentArray.push(desc + arg.toString());
	}
}





// usage examples
if (ObjC.available) {

	//微信公众号:逆向APP
	trace("*[ViewController *]");
	
} 
else {
 	send("error: Objective-C Runtime is not available!");
}

//	

// 使用说明：
// 

// frida -U -f cn.hahaha.TestFrida --no-pause -l js文件路径




