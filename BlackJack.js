var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var co = co || {}
if(!co.doubleduck) co.doubleduck = {}
co.doubleduck.BaseAssets = $hxClasses["co.doubleduck.BaseAssets"] = function() {
};
co.doubleduck.BaseAssets.__name__ = ["co","doubleduck","BaseAssets"];
co.doubleduck.BaseAssets.loader = function() {
	if(co.doubleduck.BaseAssets._loader == null) {
		co.doubleduck.BaseAssets._loader = new createjs.LoadQueue(true);
		co.doubleduck.BaseAssets._loader.installPlugin(createjs.LoadQueue.SOUND);
		co.doubleduck.BaseAssets._loader.onFileLoad = co.doubleduck.BaseAssets.handleFileLoaded;
		co.doubleduck.BaseAssets._loader.onError = co.doubleduck.BaseAssets.handleLoadError;
		co.doubleduck.BaseAssets._loader.setMaxConnections(10);
	}
	return co.doubleduck.BaseAssets._loader;
}
co.doubleduck.BaseAssets.loadAndCall = function(uri,callbackFunc) {
	co.doubleduck.BaseAssets.loader().loadFile(uri);
	co.doubleduck.BaseAssets._loadCallbacks[uri] = callbackFunc;
}
co.doubleduck.BaseAssets.finishLoading = function(manifest,sounds) {
	if(co.doubleduck.SoundManager.available) {
		var _g1 = 0, _g = sounds.length;
		while(_g1 < _g) {
			var currSound = _g1++;
			manifest.push(sounds[currSound] + co.doubleduck.SoundManager.EXTENSION);
			co.doubleduck.SoundManager.initSound(sounds[currSound]);
		}
	}
	if(co.doubleduck.BaseAssets._useLocalStorage) co.doubleduck.BaseAssets.loadFromLocalStorage(manifest);
	if(manifest.length == 0) {
		if(co.doubleduck.BaseAssets.onLoadAll != null) co.doubleduck.BaseAssets.onLoadAll();
	}
	co.doubleduck.BaseAssets.loader().onProgress = co.doubleduck.BaseAssets.handleProgress;
	co.doubleduck.BaseAssets.loader().onFileLoad = co.doubleduck.BaseAssets.manifestFileLoad;
	co.doubleduck.BaseAssets.loader().loadManifest(manifest);
	co.doubleduck.BaseAssets.loader().load();
}
co.doubleduck.BaseAssets.loadAll = function(manifest,sounds) {
	manifest[manifest.length] = "images/duckling/orientation_error_port.png";
	manifest[manifest.length] = "images/duckling/orientation_error_land.png";
	manifest[manifest.length] = "images/duckling/page_marker.png";
}
co.doubleduck.BaseAssets.audioLoaded = function(event) {
	co.doubleduck.BaseAssets._cacheData[event.item.src] = event;
}
co.doubleduck.BaseAssets.manifestFileLoad = function(event) {
	if(co.doubleduck.BaseAssets._useLocalStorage && event != null) {
		var utils = new ddjsutils();
		try {
			var fileName = event.item.src;
			if(HxOverrides.substr(fileName,fileName.length - 3,null) == "jpg") return;
			co.doubleduck.BasePersistence.setValue(event.item.src,utils.getBase64Image(event.result));
		} catch( err ) {
		}
	}
}
co.doubleduck.BaseAssets.loadFromLocalStorage = function(manifest) {
	var entriesToRemove = new Array();
	var _g1 = 0, _g = manifest.length;
	while(_g1 < _g) {
		var i = _g1++;
		var entry = manifest[i];
		var value = co.doubleduck.BasePersistence.getValue(entry);
		if(value != null) {
			var bmp = new createjs.Bitmap("data:image/png;base64," + value);
			co.doubleduck.BaseAssets._cacheData[entry] = bmp.image;
			entriesToRemove.push(manifest[i]);
		}
	}
	var _g1 = 0, _g = entriesToRemove.length;
	while(_g1 < _g) {
		var j = _g1++;
		HxOverrides.remove(manifest,entriesToRemove[j]);
	}
}
co.doubleduck.BaseAssets.handleProgress = function(event) {
	co.doubleduck.BaseAssets.loaded = event.loaded;
	if(event.loaded == event.total) {
		co.doubleduck.BaseAssets.loader().onProgress = null;
		co.doubleduck.BaseAssets.onLoadAll();
	}
}
co.doubleduck.BaseAssets.handleLoadError = function(event) {
}
co.doubleduck.BaseAssets.handleFileLoaded = function(event) {
	if(event != null) {
		co.doubleduck.BaseAssets._cacheData[event.item.src] = event.result;
		var callbackFunc = Reflect.field(co.doubleduck.BaseAssets._loadCallbacks,event.item.src);
		if(callbackFunc != null) callbackFunc();
	}
}
co.doubleduck.BaseAssets.getAsset = function(uri) {
	var cache = Reflect.field(co.doubleduck.BaseAssets._cacheData,uri);
	if(cache == null) {
		if(co.doubleduck.BaseAssets.loader().getResult(uri) != null) {
			cache = co.doubleduck.BaseAssets.loader().getResult(uri);
			co.doubleduck.BaseAssets._cacheData[uri] = cache;
		}
	}
	return cache;
}
co.doubleduck.BaseAssets.getRawImage = function(uri) {
	var cache = co.doubleduck.BaseAssets.getAsset(uri);
	if(cache == null) {
		var bmp = new createjs.Bitmap(uri);
		co.doubleduck.BaseAssets._cacheData[uri] = bmp.image;
		cache = bmp.image;
		null;
	}
	return cache;
}
co.doubleduck.BaseAssets.getImage = function(uri,mouseEnabled) {
	if(mouseEnabled == null) mouseEnabled = false;
	var result = new createjs.Bitmap(co.doubleduck.BaseAssets.getRawImage(uri));
	result.mouseEnabled = mouseEnabled;
	return result;
}
co.doubleduck.BaseAssets.prototype = {
	__class__: co.doubleduck.BaseAssets
}
co.doubleduck.Assets = $hxClasses["co.doubleduck.Assets"] = function() {
	co.doubleduck.BaseAssets.call(this);
};
co.doubleduck.Assets.__name__ = ["co","doubleduck","Assets"];
co.doubleduck.Assets.loadAll = function() {
	var manifest = new Array();
	var sounds = new Array();
	var _g = 1;
	while(_g < 6) {
		var area = _g++;
		var sound = "sound/ambience/amb" + area;
		sounds.push(sound);
	}
	sounds.push("sound/Menu_music");
	sounds.push("sound/Card");
	sounds.push("sound/Falling_chips_1");
	sounds.push("sound/Falling_chips_2");
	sounds.push("sound/Falling_chips_3");
	sounds.push("sound/button_click");
	sounds.push("sound/draw");
	sounds.push("sound/Lose");
	sounds.push("sound/Slot_spin");
	co.doubleduck.BaseAssets.loadAll(manifest,sounds);
	manifest.push("images/splash/splash.png");
	manifest.push("images/splash/tap2play.png");
	manifest.push("images/general/transition_card_1.png");
	manifest.push("images/general/transition_card_2.png");
	manifest.push("images/general/dropables.png");
	manifest.push("images/menu/bg.png");
	manifest.push("images/menu/btn_arrow_right.png");
	manifest.push("images/menu/btn_audio.png");
	manifest.push("images/menu/btn_gotit.png");
	manifest.push("images/menu/btn_help.png");
	manifest.push("images/menu/btn_spin.png");
	manifest.push("images/menu/btn_spin_off.png");
	manifest.push("images/menu/help.png");
	manifest.push("images/menu/lvls/casino1_on.png");
	var _g = 2;
	while(_g < 6) {
		var i = _g++;
		manifest.push("images/menu/lvls/casino" + i + "_off.png");
		manifest.push("images/menu/lvls/casino" + i + "_on.png");
	}
	manifest.push("images/menu/rep_bar_empty.png");
	manifest.push("images/menu/rep_bar_full.png");
	manifest.push("images/menu/score.png");
	manifest.push("images/menu/dailyspin/bg.png");
	manifest.push("images/menu/dailyspin/slots.png");
	manifest.push("images/menu/dailyspin/window.png");
	manifest.push("images/menu/found_chip/btn_pickitup.png");
	manifest.push("images/menu/found_chip/foundchip_100.png");
	manifest.push("images/menu/found_chip/foundchip_200.png");
	manifest.push("images/menu/found_chip/foundchip_400.png");
	manifest.push("images/menu/found_chip/foundchip_500.png");
	manifest.push("images/session/btn_bet.png");
	manifest.push("images/session/btn_bet_inactive.png");
	manifest.push("images/session/btn_double.png");
	manifest.push("images/session/btn_hit.png");
	manifest.push("images/session/btn_insurance.png");
	manifest.push("images/session/btn_lobby.png");
	manifest.push("images/session/btn_minus.png");
	manifest.push("images/session/btn_plus.png");
	manifest.push("images/session/btn_split.png");
	manifest.push("images/session/btn_stand.png");
	manifest.push("images/session/hud_bottom.png");
	manifest.push("images/session/hud_bet_display.png");
	manifest.push("images/session/chips.png");
	manifest.push("images/session/place_bet.png");
	manifest.push("images/session/rep_bar.png");
	manifest.push("images/session/rep_unlocked.png");
	manifest.push("images/session/score.png");
	manifest.push("images/session/counter.png");
	manifest.push("images/session/no_funds.png");
	manifest.push("images/session/bankrupt_alert.png");
	manifest.push("images/session/btn_back2lobby.png");
	manifest.push("images/session/btn_leave.png");
	manifest.push("images/session/btn_stay.png");
	manifest.push("images/session/exit_alert.png");
	manifest.push("images/session/end_blackjack.png");
	manifest.push("images/session/end_bust.png");
	manifest.push("images/session/end_lose.png");
	manifest.push("images/session/end_push.png");
	manifest.push("images/session/end_strip.png");
	manifest.push("images/session/end_win.png");
	manifest.push("images/session/bgs/bg_1.jpg");
	manifest.push("images/session/bgs/bg_2.jpg");
	manifest.push("images/session/bgs/bg_3.jpg");
	manifest.push("images/session/bgs/bg_4.jpg");
	manifest.push("images/session/bgs/bg_5.jpg");
	manifest.push("images/session/cards/black_big.png");
	manifest.push("images/session/cards/black_small.png");
	manifest.push("images/session/cards/red_big.png");
	manifest.push("images/session/cards/red_small.png");
	manifest.push("images/session/cards/cards.png");
	manifest.push("images/session/cards/card_bg.png");
	manifest.push("images/session/cards/suits.png");
	var _g = 0;
	while(_g < 10) {
		var i = _g++;
		manifest.push("images/general/font/" + i + ".png");
	}
	manifest.push("images/general/font/comma.png");
	manifest.push("images/general/font/dollar.png");
	co.doubleduck.BaseAssets.finishLoading(manifest,sounds);
}
co.doubleduck.Assets.__super__ = co.doubleduck.BaseAssets;
co.doubleduck.Assets.prototype = $extend(co.doubleduck.BaseAssets.prototype,{
	__class__: co.doubleduck.Assets
});
co.doubleduck.BaseGame = $hxClasses["co.doubleduck.BaseGame"] = function(stage) {
	this._waitingToStart = false;
	this._orientError = null;
	this._prevWinSize = new createjs.Rectangle(0,0,1,1);
	if(this._wantLandscape) {
		co.doubleduck.BaseGame.MAX_HEIGHT = 427;
		co.doubleduck.BaseGame.MAX_WIDTH = 915;
	} else {
		co.doubleduck.BaseGame.MAX_HEIGHT = 760;
		co.doubleduck.BaseGame.MAX_WIDTH = 427;
	}
	if(co.doubleduck.BaseGame.DEBUG) co.doubleduck.BasePersistence.clearAll();
	var isGS3Stock = /Android 4.0.4/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && /GT-I9300/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && !/Chrome/.test(navigator.userAgent);
	if(isGS3Stock) {
		var loc = window.location.href;
		if(loc.lastIndexOf("index.html") != -1) loc = HxOverrides.substr(loc,0,loc.lastIndexOf("index.html"));
		loc += "error.html";
		window.location.href=loc;
		return;
	}
	co.doubleduck.Persistence.initGameData();
	co.doubleduck.BaseGame._stage = stage;
	co.doubleduck.BaseGame._stage.onTick = $bind(this,this.handleStageTick);
	co.doubleduck.BaseGame._viewport = new createjs.Rectangle(0,0,1,1);
	co.doubleduck.BaseGame.hammer = new Hammer(js.Lib.document.getElementById("stageCanvas"));
	viewporter.preventPageScroll = true;
	viewporter.change($bind(this,this.handleViewportChanged));
	if(viewporter.ACTIVE) {
		viewporter.preventPageScroll = true;
		viewporter.change($bind(this,this.handleViewportChanged));
		if(this._wantLandscape != viewporter.isLandscape()) {
			if(this._wantLandscape) co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.ORIENT_LAND_URI,$bind(this,this.waitForOrientation)); else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.ORIENT_PORT_URI,$bind(this,this.waitForOrientation));
		} else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
	} else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
};
co.doubleduck.BaseGame.__name__ = ["co","doubleduck","BaseGame"];
co.doubleduck.BaseGame._stage = null;
co.doubleduck.BaseGame.MAX_HEIGHT = null;
co.doubleduck.BaseGame.MAX_WIDTH = null;
co.doubleduck.BaseGame.hammer = null;
co.doubleduck.BaseGame.getViewport = function() {
	return co.doubleduck.BaseGame._viewport;
}
co.doubleduck.BaseGame.getScale = function() {
	return co.doubleduck.BaseGame._scale;
}
co.doubleduck.BaseGame.getStage = function() {
	return co.doubleduck.BaseGame._stage;
}
co.doubleduck.BaseGame.prototype = {
	setScale: function() {
		var fixedVal = co.doubleduck.BaseGame._viewport.width;
		var varVal = co.doubleduck.BaseGame._viewport.height;
		var idealFixed = co.doubleduck.BaseGame.MAX_WIDTH;
		var idealVar = co.doubleduck.BaseGame.MAX_HEIGHT;
		if(this._wantLandscape) {
			fixedVal = co.doubleduck.BaseGame._viewport.height;
			varVal = co.doubleduck.BaseGame._viewport.width;
			idealFixed = co.doubleduck.BaseGame.MAX_HEIGHT;
			idealVar = co.doubleduck.BaseGame.MAX_WIDTH;
		}
		var regScale = varVal / idealVar;
		if(fixedVal >= varVal) co.doubleduck.BaseGame._scale = regScale; else if(idealFixed * regScale < fixedVal) co.doubleduck.BaseGame._scale = fixedVal / idealFixed; else co.doubleduck.BaseGame._scale = regScale;
	}
	,handleViewportChanged: function() {
		if(this._wantLandscape != viewporter.isLandscape()) {
			if(this._orientError == null) {
				var err = co.doubleduck.BaseGame.ORIENT_PORT_URI;
				if(this._wantLandscape) err = co.doubleduck.BaseGame.ORIENT_LAND_URI;
				this._orientError = co.doubleduck.BaseAssets.getImage(err);
				this._orientError.regX = this._orientError.image.width / 2;
				this._orientError.regY = this._orientError.image.height / 2;
				this._orientError.x = co.doubleduck.BaseGame._viewport.height / 2;
				this._orientError.y = co.doubleduck.BaseGame._viewport.width / 2;
				co.doubleduck.BaseGame._stage.addChildAt(this._orientError,co.doubleduck.BaseGame._stage.getNumChildren());
				co.doubleduck.BaseGame._stage.update();
			}
		} else if(this._orientError != null) {
			co.doubleduck.BaseGame._stage.removeChild(this._orientError);
			this._orientError = null;
			if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame._stage.update();
			if(this._waitingToStart) {
				this._waitingToStart = false;
				co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
			}
		}
	}
	,focused: function() {
		co.doubleduck.SoundManager.unmute();
	}
	,blured: function(e) {
		co.doubleduck.SoundManager.mute();
	}
	,handleResize: function(e) {
		var isFirefox = /Firefox/.test(navigator.userAgent);
		var isAndroid = /Android/.test(navigator.userAgent);
		var screenW = js.Lib.window.innerWidth;
		var screenH = js.Lib.window.innerHeight;
		co.doubleduck.BaseGame._stage.canvas.width = screenW;
		co.doubleduck.BaseGame._stage.canvas.height = screenH;
		var shouldResize = this._wantLandscape == viewporter.isLandscape() || !viewporter.ACTIVE;
		if(shouldResize) {
			if(isFirefox) {
				screenH = Math.floor(co.doubleduck.Main.getFFHeight());
				var ffEstimate = Math.ceil((js.Lib.window.screen.height - 110) * (screenW / js.Lib.window.screen.width));
				if(!isAndroid) ffEstimate = Math.ceil((js.Lib.window.screen.height - 30) * (screenW / js.Lib.window.screen.width));
				if(ffEstimate < screenH) screenH = Math.floor(ffEstimate);
			}
			var wrongSize = screenH < screenW;
			if(this._wantLandscape) wrongSize = screenH > screenW;
			if(!viewporter.ACTIVE || !wrongSize) {
				co.doubleduck.BaseGame._viewport.width = screenW;
				co.doubleduck.BaseGame._viewport.height = screenH;
				this.setScale();
			}
			if(this._orientError != null && isFirefox) this.handleViewportChanged();
		} else if(isFirefox) this.handleViewportChanged();
		if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame._stage.update();
	}
	,handleBackToMenu: function() {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.BaseGame._stage.addChildAt(this._menu,0);
		this._menu.onPlayClick = $bind(this,this.handlePlayClick);
	}
	,handleRestart: function(properties) {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this.startSession(properties);
	}
	,handleSessionEnd: function() {
	}
	,handlePlayClick: function(properties) {
		co.doubleduck.BaseGame._stage.removeChild(this._menu);
		this.startSession(properties);
		this._menu.destroy();
		this._menu = null;
	}
	,startSession: function(properties) {
		this._session = new co.doubleduck.Session(properties);
		this._session.onBackToMenu = $bind(this,this.handleBackToMenu);
		this._session.onRestart = $bind(this,this.handleRestart);
		this._session.onSessionEnd = $bind(this,this.handleSessionEnd);
		co.doubleduck.BaseGame._stage.addChild(this._session);
	}
	,showMenu: function() {
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.BaseGame._stage.addChildAt(this._menu,0);
		this._menu.onPlayClick = $bind(this,this.handlePlayClick);
	}
	,alphaFade: function(fadeElement) {
		if(fadeElement != null && js.Boot.__instanceof(fadeElement,createjs.Bitmap)) this._fadedText = fadeElement; else if(this._fadedText == null) return;
		if(this._fadedText.alpha == 0) createjs.Tween.get(this._fadedText).to({ alpha : 1},750).call($bind(this,this.alphaFade)); else if(this._fadedText.alpha == 1) createjs.Tween.get(this._fadedText).to({ alpha : 0},1500).call($bind(this,this.alphaFade));
	}
	,showGameSplash: function() {
	}
	,splashEnded: function() {
		js.Lib.document.body.bgColor = "#000000";
		co.doubleduck.BaseGame._stage.removeChild(this._splash);
		this._splash = null;
		js.Lib.window.onresize = $bind(this,this.handleResize);
		this.handleResize(null);
		this.showGameSplash();
	}
	,handleDoneLoading: function() {
		createjs.Tween.get(this._splash).wait(200).to({ alpha : 0},800).call($bind(this,this.splashEnded));
		co.doubleduck.BaseGame._stage.removeChild(this._loadingBar);
		co.doubleduck.BaseGame._stage.removeChild(this._loadingStroke);
	}
	,updateLoading: function() {
		if(co.doubleduck.BaseAssets.loaded != 1) {
			this._loadingBar.visible = true;
			var percent = co.doubleduck.BaseAssets.loaded;
			var barMask = new createjs.Shape();
			barMask.graphics.beginFill("#00000000");
			barMask.graphics.drawRect(this._loadingBar.x - this._loadingBar.image.width / 2,this._loadingBar.y,this._loadingBar.image.width * percent | 0,this._loadingBar.image.height);
			barMask.graphics.endFill();
			this._loadingBar.mask = barMask;
			co.doubleduck.Utils.waitAndCall(this,10,$bind(this,this.updateLoading));
		}
	}
	,exitFocus: function() {
		var hidden = document.mozHidden;
		if(hidden) co.doubleduck.SoundManager.mute(false); else if(!co.doubleduck.SoundManager.getPersistedMute()) co.doubleduck.SoundManager.unmute(false);
	}
	,showSplash: function() {
		if(viewporter.ACTIVE) js.Lib.document.body.bgColor = "#00A99D"; else js.Lib.document.body.bgColor = "#D94D00";
		this._splash = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOGO_URI);
		this._splash.regX = this._splash.image.width / 2;
		this._splash.x = js.Lib.window.innerWidth / 2;
		if(this._wantLandscape) this._splash.y = 20; else this._splash.y = 90;
		co.doubleduck.BaseGame._stage.addChild(this._splash);
		this._loadingStroke = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOAD_STROKE_URI);
		this._loadingStroke.regX = this._loadingStroke.image.width / 2;
		co.doubleduck.BaseGame._stage.addChildAt(this._loadingStroke,0);
		this._loadingBar = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOAD_FILL_URI);
		this._loadingBar.regX = this._loadingBar.image.width / 2;
		co.doubleduck.BaseGame._stage.addChildAt(this._loadingBar,1);
		this._loadingBar.x = js.Lib.window.innerWidth / 2;
		this._loadingBar.y = this._splash.y + 192;
		this._loadingStroke.x = this._loadingBar.x;
		this._loadingStroke.y = this._loadingBar.y;
		this._loadingBar.visible = false;
		this.updateLoading();
		co.doubleduck.BaseGame._stage.canvas.width = js.Lib.window.innerWidth;
		co.doubleduck.BaseGame._stage.canvas.height = js.Lib.window.innerHeight;
		co.doubleduck.BaseAssets.onLoadAll = $bind(this,this.handleDoneLoading);
		co.doubleduck.Assets.loadAll();
		document.addEventListener('mozvisibilitychange', this.exitFocus);
	}
	,waitForOrientation: function() {
		this._waitingToStart = true;
		if(this._orientError == null) {
			this._orientError = this.getErrorImage();
			this._orientError.regX = this._orientError.image.width / 2;
			this._orientError.regY = this._orientError.image.height / 2;
			this._orientError.x = js.Lib.window.innerWidth / 2;
			this._orientError.y = js.Lib.window.innerHeight / 2;
			co.doubleduck.BaseGame._stage.addChildAt(this._orientError,co.doubleduck.BaseGame._stage.getNumChildren());
		}
	}
	,getErrorImage: function() {
		if(this._wantLandscape) return co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.ORIENT_LAND_URI); else return co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.ORIENT_PORT_URI);
	}
	,loadBarStroke: function() {
		co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOAD_STROKE_URI,$bind(this,this.showSplash));
	}
	,loadBarFill: function() {
		co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOAD_FILL_URI,$bind(this,this.loadBarStroke));
	}
	,handleStageTick: function() {
		if(js.Lib.window.innerWidth != this._prevWinSize.width || js.Lib.window.innerHeight != this._prevWinSize.height) {
			this._prevWinSize.width = js.Lib.window.innerWidth;
			this._prevWinSize.height = js.Lib.window.innerHeight;
			this.handleResize(null);
		}
	}
	,_prevWinSize: null
	,_fadedText: null
	,_loadingStroke: null
	,_loadingBar: null
	,_waitingToStart: null
	,_orientError: null
	,_wantLandscape: null
	,_session: null
	,_menu: null
	,_splash: null
	,__class__: co.doubleduck.BaseGame
}
co.doubleduck.BaseMenu = $hxClasses["co.doubleduck.BaseMenu"] = function() {
	createjs.Container.call(this);
};
co.doubleduck.BaseMenu.__name__ = ["co","doubleduck","BaseMenu"];
co.doubleduck.BaseMenu.__super__ = createjs.Container;
co.doubleduck.BaseMenu.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		this.onPlayClick = null;
	}
	,onPlayClick: null
	,__class__: co.doubleduck.BaseMenu
});
co.doubleduck.BasePersistence = $hxClasses["co.doubleduck.BasePersistence"] = function() { }
co.doubleduck.BasePersistence.__name__ = ["co","doubleduck","BasePersistence"];
co.doubleduck.BasePersistence.localStorageSupported = function() {
	var result = null;
	try {
		localStorage.setItem("test","test");
		localStorage.removeItem("test");
		result = true;
	} catch( e ) {
		result = false;
	}
	return result;
}
co.doubleduck.BasePersistence.getValue = function(key) {
	if(!co.doubleduck.BasePersistence.available) return "0";
	var val = localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.BasePersistence.setValue = function(key,value) {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key] = value;
}
co.doubleduck.BasePersistence.clearAll = function() {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage.clear();
}
co.doubleduck.BasePersistence.initVar = function(initedVar,defaultVal) {
	if(defaultVal == null) defaultVal = "0";
	var value = co.doubleduck.BasePersistence.getValue(initedVar);
	if(value == null) try {
		co.doubleduck.BasePersistence.setValue(initedVar,defaultVal);
	} catch( e ) {
		co.doubleduck.BasePersistence.available = false;
	}
}
co.doubleduck.BasePersistence.getDynamicValue = function(key) {
	if(!co.doubleduck.BasePersistence.available) return { };
	var val = localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.BasePersistence.setDynamicValue = function(key,value) {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key] = value;
}
co.doubleduck.BasePersistence.initDynamicVar = function(initedVar,defaultVal) {
	var value = co.doubleduck.BasePersistence.getDynamicValue(initedVar);
	if(value == null) try {
		co.doubleduck.BasePersistence.setDynamicValue(initedVar,defaultVal);
	} catch( e ) {
		co.doubleduck.BasePersistence.available = false;
	}
}
co.doubleduck.BasePersistence.printAll = function() {
	var ls = localStorage;
	var localStorageLength = ls.length;
	var _g = 0;
	while(_g < localStorageLength) {
		var entry = _g++;
		null;
	}
}
co.doubleduck.BaseSession = $hxClasses["co.doubleduck.BaseSession"] = function() {
	createjs.Container.call(this);
};
co.doubleduck.BaseSession.__name__ = ["co","doubleduck","BaseSession"];
co.doubleduck.BaseSession.__super__ = createjs.Container;
co.doubleduck.BaseSession.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		createjs.Ticker.removeListener(this);
		this.onRestart = null;
		this.onBackToMenu = null;
		this.onSessionEnd = null;
		this.onNextLevel = null;
	}
	,sessionEnded: function() {
		if(this.onSessionEnd != null) {
			createjs.Ticker.setPaused(false);
			this.onSessionEnd();
		}
	}
	,handleReplayClick: function(properties) {
		if(this.onRestart != null) {
			createjs.Ticker.setPaused(false);
			this.onRestart(properties);
		}
	}
	,handleMenuClick: function() {
		if(this.onBackToMenu != null) {
			createjs.Ticker.setPaused(false);
			this.onBackToMenu();
		}
	}
	,_replayBtn: null
	,_menuBtn: null
	,onNextLevel: null
	,onBackToMenu: null
	,onSessionEnd: null
	,onRestart: null
	,__class__: co.doubleduck.BaseSession
});
co.doubleduck.LabeledContainer = $hxClasses["co.doubleduck.LabeledContainer"] = function(bmp) {
	createjs.Container.call(this);
	this._bitmap = bmp;
	if(this._bitmap != null) {
		if(js.Boot.__instanceof(this._bitmap,createjs.Bitmap)) {
			this._bmp = this._bitmap;
			this.image = this._bmp.image;
		} else if(js.Boot.__instanceof(this._bitmap,createjs.BitmapAnimation)) {
			this.anim = this._bitmap;
			this.image = { width : this.anim.spriteSheet._frameWidth, height : this.anim.spriteSheet._frameHeight};
		}
	}
};
co.doubleduck.LabeledContainer.__name__ = ["co","doubleduck","LabeledContainer"];
co.doubleduck.LabeledContainer.__super__ = createjs.Container;
co.doubleduck.LabeledContainer.prototype = $extend(createjs.Container.prototype,{
	getLabel: function() {
		return this._label;
	}
	,addBitmap: function() {
		this.addChild(this._bitmap);
	}
	,addCenteredBitmap: function() {
		this._bitmap.regX = this.image.width / 2;
		this._bitmap.regY = this.image.height / 2;
		this._bitmap.x = this.image.width / 2;
		this._bitmap.y = this.image.height / 2;
		this.addChild(this._bitmap);
	}
	,addBitmapLabel: function(label,fontType,padding,centered) {
		if(centered == null) centered = true;
		if(padding == null) padding = 0;
		if(fontType == null) fontType = "";
		if(this._bitmapText != null) this.removeChild(this._bitmapText);
		var fontHelper = new co.doubleduck.FontHelper(fontType);
		this._bitmapText = fontHelper.getNumber(Std.parseInt(label),1,true,null,padding,centered);
		if(this.image != null) {
			this._bitmapText.x = this.image.width / 2;
			this._bitmapText.y = this.image.height / 2;
		}
		this._label = label;
		this.addChild(this._bitmapText);
	}
	,scaleBitmapFont: function(scale) {
		this._bitmapText.scaleX = this._bitmapText.scaleY = scale;
	}
	,shiftLabel: function(shiftX,shiftY) {
		this._bitmapText.x *= shiftX;
		this._bitmapText.y *= shiftY;
	}
	,setBitmapLabelY: function(ly) {
		this._bitmapText.y = ly;
	}
	,setBitmapLabelX: function(lx) {
		this._bitmapText.x = lx;
	}
	,getBitmapLabelWidth: function() {
		var maxWidth = 0;
		var _g1 = 0, _g = this._bitmapText.getNumChildren();
		while(_g1 < _g) {
			var digit = _g1++;
			var currentDigit = js.Boot.__cast(this._bitmapText.getChildAt(digit) , createjs.Bitmap);
			var endsAt = currentDigit.x + currentDigit.image.width;
			if(endsAt > maxWidth) maxWidth = endsAt;
		}
		return maxWidth;
	}
	,setLabelY: function(ly) {
		this._text.y = ly;
	}
	,setLabelX: function(lx) {
		this._text.x = lx;
	}
	,addLabel: function(label,color) {
		if(color == null) color = "#000000";
		if(this._text != null) this.removeChild(this._text);
		this._label = label;
		this._text = new createjs.Text(label,"bold 22px Arial",color);
		this._text.regY = this._text.getMeasuredHeight() / 2;
		this._text.textAlign = "center";
		if(this._bitmap != null) {
			this._text.x = this._bitmap.x;
			this._text.y = this._bitmap.y;
		}
		this.addChild(this._text);
	}
	,changeText: function(txt) {
	}
	,_bitmapText: null
	,_text: null
	,_bmp: null
	,_bitmap: null
	,_label: null
	,anim: null
	,image: null
	,__class__: co.doubleduck.LabeledContainer
});
co.doubleduck.Button = $hxClasses["co.doubleduck.Button"] = function(bmp,pauseAffected,clickType,clickSound) {
	if(clickType == null) clickType = 2;
	if(pauseAffected == null) pauseAffected = true;
	this._lastClickTime = 0;
	co.doubleduck.LabeledContainer.call(this,bmp);
	if(clickSound == null && co.doubleduck.Button._defaultSound != null) this._clickSound = co.doubleduck.Button._defaultSound; else this._clickSound = clickSound;
	this._bitmap.mouseEnabled = true;
	this._clickType = clickType;
	this._pauseAffected = pauseAffected;
	if(clickType == co.doubleduck.Button.CLICK_TYPE_TOGGLE) {
		var initObject = { };
		var size = this.image.width / 2;
		initObject.images = [this.image];
		initObject.frames = { width : size, height : this.image.height, regX : size / 2, regY : this.image.height / 2};
		this._states = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
		this._states.gotoAndStop(0);
		this.onClick = $bind(this,this.handleToggle);
		this.addChild(this._states);
	} else this.addCenteredBitmap();
	this.onPress = $bind(this,this.handlePress);
};
co.doubleduck.Button.__name__ = ["co","doubleduck","Button"];
co.doubleduck.Button.setDefaultSound = function(sound) {
	co.doubleduck.Button._defaultSound = sound;
}
co.doubleduck.Button.__super__ = co.doubleduck.LabeledContainer;
co.doubleduck.Button.prototype = $extend(co.doubleduck.LabeledContainer.prototype,{
	handleEndPressTint: function() {
		co.doubleduck.Utils.tintBitmap(this._bmp,1,1,1,1);
		if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame.getStage().update();
	}
	,setToggle: function(flag) {
		if(flag) this._states.gotoAndStop(0); else this._states.gotoAndStop(1);
	}
	,handleToggle: function(e) {
		if(this.onToggle == null) return;
		if(this._lastClickPos == null) this._lastClickPos = new createjs.Point(0,0);
		if((this._lastClickPos.x < e.stageX + 1 || this._lastClickPos.x > e.stageX + 1) && (this._lastClickPos.y < e.stageY + 1 || this._lastClickPos.y > e.stageY + 1)) {
			var now = createjs.Ticker.getTime(true);
			if(now < this._lastClickTime + 500) return;
		}
		this._lastClickPos.x = e.stageX;
		this._lastClickPos.y = e.stageY;
		this._lastClickTime = createjs.Ticker.getTime(true);
		this._states.gotoAndStop(1 - this._states.currentFrame);
		this.onToggle();
	}
	,handlePress: function(event) {
		if(createjs.Ticker.getPaused() && this._pauseAffected) return;
		if(this._clickType == co.doubleduck.Button.CLICK_TYPE_HOLD) {
			if(this.onHoldStart != null) {
				this.onHoldStart();
				event.onMouseUp = this.onHoldFinish;
			}
		}
		if(this.onClick != null) {
			if(this._clickSound != null) co.doubleduck.SoundManager.playEffect(this._clickSound);
			switch(this._clickType) {
			case co.doubleduck.Button.CLICK_TYPE_TINT:
				if(this._bmp != null) {
					co.doubleduck.Utils.tintBitmap(this._bmp,0.55,0.55,0.55,1);
					var tween = createjs.Tween.get(this._bmp);
					tween.ignoreGlobalPause = true;
					tween.wait(200).call($bind(this,this.handleEndPressTint));
					if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame.getStage().update();
				}
				break;
			case co.doubleduck.Button.CLICK_TYPE_JUICY:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.25;
				this._bitmap.scaleY = startScaleY * 0.75;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},500,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_SCALE:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.18;
				this._bitmap.scaleY = startScaleY * 1.18;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},200,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_TOGGLE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_NONE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_HOLD:
				throw "Use onHoldStart with CLICK_TYPE_HOLD, not onClick";
				break;
			}
		}
	}
	,setNoSound: function() {
		this._clickSound = null;
	}
	,_lastClickPos: null
	,_lastClickTime: null
	,_clickSound: null
	,_juiceTween: null
	,_clickType: null
	,_pauseAffected: null
	,_states: null
	,onHoldFinish: null
	,onHoldStart: null
	,onToggle: null
	,__class__: co.doubleduck.Button
});
co.doubleduck.Card = $hxClasses["co.doubleduck.Card"] = function(id,location,flipped,playSound) {
	if(playSound == null) playSound = true;
	this._type = id;
	this._playSound = playSound;
	createjs.Container.call(this);
	if(co.doubleduck.Card._backSpritesheet == null) this.initSpritesheets();
	var valueIndex = id.getValue()[1];
	var typeIndex = id.getType()[1];
	var bigSpritesheet = null;
	var smallSpritesheet = null;
	if(id.getType() == co.doubleduck.CardType.DIAMONDS || id.getType() == co.doubleduck.CardType.HEARTS) {
		bigSpritesheet = co.doubleduck.Card._redBigSpritesheet;
		smallSpritesheet = co.doubleduck.Card._redSmallSpritesheet;
	} else {
		bigSpritesheet = co.doubleduck.Card._blackBigSpritesheet;
		smallSpritesheet = co.doubleduck.Card._blackSmallSpritesheet;
		smallSpritesheet = co.doubleduck.Card._blackSmallSpritesheet;
	}
	var cardPaddingVertical = 10;
	var cardPaddingHorizontal = 12;
	var valueTypePadding = 3;
	this._frontContainer = new createjs.Container();
	this._background = co.doubleduck.BaseAssets.getImage("images/session/cards/card_bg.png");
	this._frontContainer.addChild(this._background);
	this._frontContainer.regX = this._background.image.width / 2;
	this._frontContainer.x += this._background.image.width / 2;
	this._topValue = new createjs.BitmapAnimation(smallSpritesheet);
	this._topValue.gotoAndStop("card" + valueIndex);
	this._topValue.x = cardPaddingHorizontal + this._topValue.spriteSheet._frameWidth / 2;
	this._topValue.y = cardPaddingVertical + this._topValue.spriteSheet._frameHeight / 2;
	this._frontContainer.addChild(this._topValue);
	this._topType = new createjs.BitmapAnimation(co.doubleduck.Card._typeSpritesheet);
	this._topType.gotoAndStop("type" + typeIndex);
	this._topType.x = this._topValue.x;
	this._topType.y = valueTypePadding + this._topValue.y + this._topValue.spriteSheet._frameHeight / 2 + this._topType.spriteSheet._frameHeight / 2;
	this._frontContainer.addChild(this._topType);
	this._centerValue = new createjs.BitmapAnimation(bigSpritesheet);
	this._centerValue.gotoAndStop("card" + valueIndex);
	this._centerValue.x = this._background.image.width / 2;
	this._centerValue.y = this._background.image.height / 2;
	this._frontContainer.addChild(this._centerValue);
	this._bottomType = new createjs.BitmapAnimation(co.doubleduck.Card._typeSpritesheet);
	this._bottomType.gotoAndStop("type" + typeIndex);
	this._bottomType.x = this._background.image.width - this._bottomType.spriteSheet._frameWidth / 2 - cardPaddingHorizontal;
	this._bottomType.y = this._background.image.height - this._bottomType.spriteSheet._frameHeight / 2 - cardPaddingVertical;
	this._frontContainer.addChild(this._bottomType);
	this._bottomValue = new createjs.BitmapAnimation(smallSpritesheet);
	this._bottomValue.gotoAndStop("card" + valueIndex);
	this._bottomValue.x = this._bottomType.x;
	this._bottomValue.y = this._bottomType.y - this._bottomType.spriteSheet._frameHeight / 2 - this._bottomValue.spriteSheet._frameWidth / 2 - 10;
	this._frontContainer.addChild(this._bottomValue);
	this.addChild(this._frontContainer);
	this._backGraphics = new createjs.BitmapAnimation(co.doubleduck.Card._backSpritesheet);
	this._backGraphics.gotoAndStop("location" + location);
	this._backGraphics.x += this._backGraphics.spriteSheet._frameWidth / 2;
	this._backGraphics.y += this._backGraphics.spriteSheet._frameHeight / 2;
	this.addChild(this._backGraphics);
	if(flipped) {
		this._backGraphics.visible = true;
		this._frontContainer.visible = false;
	} else {
		this._backGraphics.visible = false;
		this._frontContainer.visible = true;
	}
	this.regX = this._background.image.width / 2;
	this.regY = this._background.image.height / 2;
	this.rotation = 0;
};
co.doubleduck.Card.__name__ = ["co","doubleduck","Card"];
co.doubleduck.Card._backSpritesheet = null;
co.doubleduck.Card._typeSpritesheet = null;
co.doubleduck.Card._redBigSpritesheet = null;
co.doubleduck.Card._redSmallSpritesheet = null;
co.doubleduck.Card._blackBigSpritesheet = null;
co.doubleduck.Card._blackSmallSpritesheet = null;
co.doubleduck.Card.__super__ = createjs.Container;
co.doubleduck.Card.prototype = $extend(createjs.Container.prototype,{
	getGameValue: function() {
		return this._type.getGameValue();
	}
	,getHeight: function() {
		return this._background.image.height;
	}
	,getWidth: function() {
		return this._background.image.width;
	}
	,initTypeSpritesheet: function() {
		var img;
		var initObject;
		img = co.doubleduck.BaseAssets.getRawImage("images/session/cards/suits.png");
		var imgWidth = 21;
		var imgHeight = 20;
		initObject = { };
		initObject.images = [img];
		initObject.frames = { width : imgWidth, height : imgHeight, regX : imgWidth / 2, regY : imgHeight / 2};
		initObject.animations = { };
		var _g1 = 0, _g = Type.allEnums(co.doubleduck.CardType).length;
		while(_g1 < _g) {
			var currValue = _g1++;
			initObject.animations["type" + currValue] = { frames : [currValue], frequency : 1};
		}
		co.doubleduck.Card._typeSpritesheet = new createjs.SpriteSheet(initObject);
	}
	,initRedSmallSpritesheet: function() {
		var img;
		var initObject;
		img = co.doubleduck.BaseAssets.getRawImage("images/session/cards/red_small.png");
		var imgWidth = 15;
		var imgHeight = 30;
		initObject = { };
		initObject.images = [img];
		initObject.frames = { width : imgWidth, height : imgHeight, regX : imgWidth / 2, regY : imgHeight / 2};
		initObject.animations = { };
		var _g1 = 0, _g = Type.allEnums(co.doubleduck.CardValue).length;
		while(_g1 < _g) {
			var currValue = _g1++;
			initObject.animations["card" + currValue] = { frames : [currValue], frequency : 1};
		}
		co.doubleduck.Card._redSmallSpritesheet = new createjs.SpriteSheet(initObject);
	}
	,initBlackSmallSpritesheet: function() {
		var img;
		var initObject;
		img = co.doubleduck.BaseAssets.getRawImage("images/session/cards/black_small.png");
		var imgWidth = 15;
		var imgHeight = 30;
		initObject = { };
		initObject.images = [img];
		initObject.frames = { width : imgWidth, height : imgHeight, regX : imgWidth / 2, regY : imgHeight / 2};
		initObject.animations = { };
		var _g1 = 0, _g = Type.allEnums(co.doubleduck.CardValue).length;
		while(_g1 < _g) {
			var currValue = _g1++;
			initObject.animations["card" + currValue] = { frames : [currValue], frequency : 1};
		}
		co.doubleduck.Card._blackSmallSpritesheet = new createjs.SpriteSheet(initObject);
	}
	,initRedBigSpritesheet: function() {
		var img;
		var initObject;
		img = co.doubleduck.BaseAssets.getRawImage("images/session/cards/red_big.png");
		var imgWidth = 60;
		var imgHeight = 95;
		initObject = { };
		initObject.images = [img];
		initObject.frames = { width : imgWidth, height : imgHeight, regX : imgWidth / 2, regY : imgHeight / 2};
		initObject.animations = { };
		var _g1 = 0, _g = Type.allEnums(co.doubleduck.CardValue).length;
		while(_g1 < _g) {
			var currValue = _g1++;
			initObject.animations["card" + currValue] = { frames : [currValue], frequency : 1};
		}
		co.doubleduck.Card._redBigSpritesheet = new createjs.SpriteSheet(initObject);
	}
	,initBlackBigSpritesheet: function() {
		var img;
		var initObject;
		img = co.doubleduck.BaseAssets.getRawImage("images/session/cards/black_big.png");
		var imgWidth = 60;
		var imgHeight = 95;
		initObject = { };
		initObject.images = [img];
		initObject.frames = { width : imgWidth, height : imgHeight, regX : imgWidth / 2, regY : imgHeight / 2};
		initObject.animations = { };
		var _g1 = 0, _g = Type.allEnums(co.doubleduck.CardValue).length;
		while(_g1 < _g) {
			var currValue = _g1++;
			initObject.animations["card" + currValue] = { frames : [currValue], frequency : 1};
		}
		co.doubleduck.Card._blackBigSpritesheet = new createjs.SpriteSheet(initObject);
	}
	,initBackSpritesheet: function() {
		var img;
		var initObject;
		img = co.doubleduck.BaseAssets.getRawImage("images/session/cards/cards.png");
		var imgWidth = 124;
		var imgHeight = 173;
		initObject = { };
		initObject.images = [img];
		initObject.frames = { width : imgWidth, height : imgHeight, regX : imgWidth / 2, regY : imgHeight / 2};
		initObject.animations = { };
		var _g1 = 0, _g = Type.allEnums(co.doubleduck.CardValue).length;
		while(_g1 < _g) {
			var currValue = _g1++;
			initObject.animations["location" + (currValue + 1 | 0)] = { frames : [currValue], frequency : 1};
		}
		co.doubleduck.Card._backSpritesheet = new createjs.SpriteSheet(initObject);
	}
	,initSpritesheets: function() {
		this.initBackSpritesheet();
		this.initBlackBigSpritesheet();
		this.initRedBigSpritesheet();
		this.initBlackSmallSpritesheet();
		this.initRedSmallSpritesheet();
		this.initTypeSpritesheet();
	}
	,flip: function() {
		this._frontContainer.scaleX = 0;
		this._frontContainer.visible = true;
		var flipDuration = 150;
		createjs.Tween.get(this._backGraphics).to({ scaleX : 0},flipDuration / 2);
		createjs.Tween.get(this._frontContainer).wait(flipDuration / 2 | 0).to({ scaleX : 1},flipDuration / 2);
		if(this._playSound) co.doubleduck.SoundManager.playEffect("sound/Card");
	}
	,_playSound: null
	,_type: null
	,_backGraphics: null
	,_frontContainer: null
	,_bottomType: null
	,_bottomValue: null
	,_centerValue: null
	,_topType: null
	,_topValue: null
	,_background: null
	,__class__: co.doubleduck.Card
});
co.doubleduck.CardDeck = $hxClasses["co.doubleduck.CardDeck"] = function() {
	this.reset();
};
co.doubleduck.CardDeck.__name__ = ["co","doubleduck","CardDeck"];
co.doubleduck.CardDeck.prototype = {
	next: function() {
		return this._cards.pop();
	}
	,reset: function() {
		this._cards = new Array();
		var _g = 0, _g1 = Type.allEnums(co.doubleduck.CardType);
		while(_g < _g1.length) {
			var currType = _g1[_g];
			++_g;
			var _g2 = 0, _g3 = Type.allEnums(co.doubleduck.CardValue);
			while(_g2 < _g3.length) {
				var currValue = _g3[_g2];
				++_g2;
				var cardId = new co.doubleduck.CardId(currValue,currType);
				this._cards.push(cardId);
			}
		}
		co.doubleduck.Utils.shuffleArray(this._cards);
	}
	,_cards: null
	,__class__: co.doubleduck.CardDeck
}
co.doubleduck.CardId = $hxClasses["co.doubleduck.CardId"] = function(val,type) {
	this._value = val;
	this._type = type;
	this._gameValue = 0;
	switch( (val)[1] ) {
	case 0:
		this._gameValue = 11;
		break;
	case 1:
		this._gameValue = 2;
		break;
	case 2:
		this._gameValue = 3;
		break;
	case 3:
		this._gameValue = 4;
		break;
	case 4:
		this._gameValue = 5;
		break;
	case 5:
		this._gameValue = 6;
		break;
	case 6:
		this._gameValue = 7;
		break;
	case 7:
		this._gameValue = 8;
		break;
	case 8:
		this._gameValue = 9;
		break;
	case 9:
		this._gameValue = 10;
		break;
	case 10:
		this._gameValue = 10;
		break;
	case 11:
		this._gameValue = 10;
		break;
	case 12:
		this._gameValue = 10;
		break;
	default:
	}
};
co.doubleduck.CardId.__name__ = ["co","doubleduck","CardId"];
co.doubleduck.CardId.prototype = {
	string: function() {
		return "" + Std.string(this._value) + " of " + Std.string(this._type);
	}
	,getGameValue: function() {
		return this._gameValue;
	}
	,getValue: function() {
		return this._value;
	}
	,getType: function() {
		return this._type;
	}
	,_gameValue: null
	,_type: null
	,_value: null
	,__class__: co.doubleduck.CardId
}
co.doubleduck.CardType = $hxClasses["co.doubleduck.CardType"] = { __ename__ : ["co","doubleduck","CardType"], __constructs__ : ["SPADES","DIAMONDS","CLUBS","HEARTS"] }
co.doubleduck.CardType.SPADES = ["SPADES",0];
co.doubleduck.CardType.SPADES.toString = $estr;
co.doubleduck.CardType.SPADES.__enum__ = co.doubleduck.CardType;
co.doubleduck.CardType.DIAMONDS = ["DIAMONDS",1];
co.doubleduck.CardType.DIAMONDS.toString = $estr;
co.doubleduck.CardType.DIAMONDS.__enum__ = co.doubleduck.CardType;
co.doubleduck.CardType.CLUBS = ["CLUBS",2];
co.doubleduck.CardType.CLUBS.toString = $estr;
co.doubleduck.CardType.CLUBS.__enum__ = co.doubleduck.CardType;
co.doubleduck.CardType.HEARTS = ["HEARTS",3];
co.doubleduck.CardType.HEARTS.toString = $estr;
co.doubleduck.CardType.HEARTS.__enum__ = co.doubleduck.CardType;
co.doubleduck.CardValue = $hxClasses["co.doubleduck.CardValue"] = { __ename__ : ["co","doubleduck","CardValue"], __constructs__ : ["ACE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE","TEN","JACK","QUEEN","KING"] }
co.doubleduck.CardValue.ACE = ["ACE",0];
co.doubleduck.CardValue.ACE.toString = $estr;
co.doubleduck.CardValue.ACE.__enum__ = co.doubleduck.CardValue;
co.doubleduck.CardValue.TWO = ["TWO",1];
co.doubleduck.CardValue.TWO.toString = $estr;
co.doubleduck.CardValue.TWO.__enum__ = co.doubleduck.CardValue;
co.doubleduck.CardValue.THREE = ["THREE",2];
co.doubleduck.CardValue.THREE.toString = $estr;
co.doubleduck.CardValue.THREE.__enum__ = co.doubleduck.CardValue;
co.doubleduck.CardValue.FOUR = ["FOUR",3];
co.doubleduck.CardValue.FOUR.toString = $estr;
co.doubleduck.CardValue.FOUR.__enum__ = co.doubleduck.CardValue;
co.doubleduck.CardValue.FIVE = ["FIVE",4];
co.doubleduck.CardValue.FIVE.toString = $estr;
co.doubleduck.CardValue.FIVE.__enum__ = co.doubleduck.CardValue;
co.doubleduck.CardValue.SIX = ["SIX",5];
co.doubleduck.CardValue.SIX.toString = $estr;
co.doubleduck.CardValue.SIX.__enum__ = co.doubleduck.CardValue;
co.doubleduck.CardValue.SEVEN = ["SEVEN",6];
co.doubleduck.CardValue.SEVEN.toString = $estr;
co.doubleduck.CardValue.SEVEN.__enum__ = co.doubleduck.CardValue;
co.doubleduck.CardValue.EIGHT = ["EIGHT",7];
co.doubleduck.CardValue.EIGHT.toString = $estr;
co.doubleduck.CardValue.EIGHT.__enum__ = co.doubleduck.CardValue;
co.doubleduck.CardValue.NINE = ["NINE",8];
co.doubleduck.CardValue.NINE.toString = $estr;
co.doubleduck.CardValue.NINE.__enum__ = co.doubleduck.CardValue;
co.doubleduck.CardValue.TEN = ["TEN",9];
co.doubleduck.CardValue.TEN.toString = $estr;
co.doubleduck.CardValue.TEN.__enum__ = co.doubleduck.CardValue;
co.doubleduck.CardValue.JACK = ["JACK",10];
co.doubleduck.CardValue.JACK.toString = $estr;
co.doubleduck.CardValue.JACK.__enum__ = co.doubleduck.CardValue;
co.doubleduck.CardValue.QUEEN = ["QUEEN",11];
co.doubleduck.CardValue.QUEEN.toString = $estr;
co.doubleduck.CardValue.QUEEN.__enum__ = co.doubleduck.CardValue;
co.doubleduck.CardValue.KING = ["KING",12];
co.doubleduck.CardValue.KING.toString = $estr;
co.doubleduck.CardValue.KING.__enum__ = co.doubleduck.CardValue;
co.doubleduck.ChipPack = $hxClasses["co.doubleduck.ChipPack"] = function(rightToLeft) {
	if(rightToLeft == null) rightToLeft = true;
	createjs.Container.call(this);
	this.initChipSpritesheet();
	var chip = new createjs.BitmapAnimation(this._chipSpritesheet);
	var frame = this.valueToFrame(co.doubleduck.ChipPack._chipValues[0]);
	chip.gotoAndStop("chip" + frame);
	this._rightToLeft = rightToLeft;
};
co.doubleduck.ChipPack.__name__ = ["co","doubleduck","ChipPack"];
co.doubleduck.ChipPack.__super__ = createjs.Container;
co.doubleduck.ChipPack.prototype = $extend(createjs.Container.prototype,{
	valueToFrame: function(value) {
		var _g1 = 0, _g = co.doubleduck.ChipPack._chipValues.length;
		while(_g1 < _g) {
			var valueIndex = _g1++;
			var currvalue = co.doubleduck.ChipPack._chipValues[valueIndex];
			if(currvalue == value) return valueIndex;
		}
		return 0;
	}
	,initChipSpritesheet: function() {
		var img;
		var initObject;
		img = co.doubleduck.BaseAssets.getRawImage("images/session/chips.png");
		var imgWidth = 47;
		var imgHeight = 47;
		initObject = { };
		initObject.images = [img];
		initObject.frames = { width : imgWidth, height : imgHeight, regX : imgWidth / 2, regY : imgHeight / 2};
		initObject.animations = { };
		var _g = 0;
		while(_g < 7) {
			var currValue = _g++;
			initObject.animations["chip" + (currValue | 0)] = { frames : [currValue], frequency : 1};
		}
		this._chipSpritesheet = new createjs.SpriteSheet(initObject);
	}
	,clear: function() {
		while(this.children.length != 0) {
			var child = this.children.pop();
			createjs.Tween.removeTweens(child);
			this.removeChild(child);
		}
		createjs.Tween.removeTweens(this);
	}
	,restorePosition: function(loc) {
		this.x = loc.x;
		this.y = loc.y;
		this.alpha = 0;
	}
	,toDealer: function() {
		var oldLoc = new createjs.Point(this.x,this.y);
		var local = null;
		var destX = -80 * co.doubleduck.BaseGame.getScale();
		var destY = this.y - 150 * co.doubleduck.BaseGame.getScale();
		createjs.Tween.get(this).to({ x : destX, y : destY},500,createjs.Ease.sineOut).call($bind(this,this.restorePosition),[oldLoc]);
	}
	,toPlayer: function() {
		var oldLoc = new createjs.Point(this.x,this.y);
		var local = null;
		local = this.globalToLocal(co.doubleduck.BaseGame.getViewport().width + 23.5 * co.doubleduck.BaseGame.getScale(),0);
		var destX = co.doubleduck.BaseGame.getViewport().width + 23.5 * co.doubleduck.BaseGame.getScale();
		var destY = this.y + 200 * co.doubleduck.BaseGame.getScale();
		createjs.Tween.get(this).to({ x : destX, y : destY},500,createjs.Ease.sineOut).call($bind(this,this.restorePosition),[oldLoc]);
	}
	,addChip: function(value,delay) {
		var chip = new createjs.BitmapAnimation(this._chipSpritesheet);
		chip.scaleX = chip.scaleY = co.doubleduck.BaseGame.getScale();
		var frame = this.valueToFrame(value);
		chip.gotoAndStop("chip" + frame);
		this.addChild(chip);
		var start = null;
		if(this._rightToLeft) start = this.globalToLocal(co.doubleduck.BaseGame.getViewport().width + chip.spriteSheet._frameWidth / 2 * co.doubleduck.BaseGame.getScale(),0); else start = this.globalToLocal(-chip.spriteSheet._frameWidth / 2 * co.doubleduck.BaseGame.getScale(),0);
		start.y = 100 * co.doubleduck.BaseGame.getScale();
		chip.x = start.x;
		chip.y = start.y;
		var destX = Std.random(80);
		var destY = Std.random(80);
		createjs.Tween.get(chip).wait(delay).to({ x : destX, y : destY},500,createjs.Ease.sineOut);
	}
	,addBet: function(amount) {
		this.alpha = 1;
		var bet = amount;
		var valueIndex = co.doubleduck.ChipPack._chipValues.length - 1;
		while(valueIndex >= 0 && bet > 0) {
			var div = bet / co.doubleduck.ChipPack._chipValues[valueIndex] | 0;
			var multiplier = div;
			var _g = 0;
			while(_g < div) {
				var currChip = _g++;
				if(valueIndex > 0 && Math.random() > 0.9) {
					multiplier -= 1;
					continue;
				}
				var delay = currChip * 40 + valueIndex * 10;
				this.addChip(co.doubleduck.ChipPack._chipValues[valueIndex],delay);
			}
			bet -= multiplier * co.doubleduck.ChipPack._chipValues[valueIndex];
			valueIndex -= 1;
		}
	}
	,_rightToLeft: null
	,_chipSpritesheet: null
	,__class__: co.doubleduck.ChipPack
});
co.doubleduck.DataLoader = $hxClasses["co.doubleduck.DataLoader"] = function() { }
co.doubleduck.DataLoader.__name__ = ["co","doubleduck","DataLoader"];
co.doubleduck.DataLoader.getLevelById = function(id) {
	var levels = co.doubleduck.DataLoader.getAllLevels();
	var _g = 0;
	while(_g < levels.length) {
		var level = levels[_g];
		++_g;
		if((level.id | 0) == id) return level;
	}
	throw "DDuckError: no such level!";
}
co.doubleduck.DataLoader.getCasinosCount = function() {
	return co.doubleduck.DataLoader.getAllCasinos().length;
}
co.doubleduck.DataLoader.getAllLevels = function() {
	return new GameplayDB().getAllLevels();
}
co.doubleduck.DataLoader.getAllCasinos = function() {
	return new GameplayDB().getAllCasinos();
}
co.doubleduck.DataLoader.getCasinoById = function(id) {
	var casinos = co.doubleduck.DataLoader.getAllCasinos();
	var _g = 0;
	while(_g < casinos.length) {
		var casino = casinos[_g];
		++_g;
		if((casino.id | 0) == id) return casino;
	}
	throw "DDuckError: no such casino!";
}
co.doubleduck.Dropper = $hxClasses["co.doubleduck.Dropper"] = function() {
	createjs.Container.call(this);
	this._spawnHeight = co.doubleduck.BaseGame.getViewport().y - 100;
	this._killHeight = co.doubleduck.BaseGame.getViewport().height + 100;
	var img = co.doubleduck.BaseAssets.getRawImage("images/general/dropables.png");
	var initObject = { };
	initObject.images = [img];
	initObject.frames = { width : co.doubleduck.Dropper.DROPLET_SIZE, height : co.doubleduck.Dropper.DROPLET_SIZE, regX : co.doubleduck.Dropper.DROPLET_SIZE / 2, regY : co.doubleduck.Dropper.DROPLET_SIZE / 2};
	initObject.animations = { };
	var _g1 = 0, _g = co.doubleduck.Dropper.DROPLET_COUNT;
	while(_g1 < _g) {
		var i = _g1++;
		initObject.animations[co.doubleduck.Dropper.PREFIX + i] = { frames : i, frequency : 20};
	}
	co.doubleduck.Dropper._sheet = new createjs.SpriteSheet(initObject);
};
co.doubleduck.Dropper.__name__ = ["co","doubleduck","Dropper"];
co.doubleduck.Dropper._sheet = null;
co.doubleduck.Dropper.__super__ = createjs.Container;
co.doubleduck.Dropper.prototype = $extend(createjs.Container.prototype,{
	handleDropletDead: function(e) {
		if(this.getChildIndex(e.target) != -1) this.removeChild(e.target);
	}
	,getRandDroplet: function() {
		var droplet;
		droplet = new createjs.BitmapAnimation(co.doubleduck.Dropper._sheet);
		droplet.scaleX = droplet.scaleY = co.doubleduck.BaseGame.getScale();
		droplet.gotoAndStop(co.doubleduck.Dropper.PREFIX + Std.random(co.doubleduck.Dropper.DROPLET_COUNT));
		return droplet;
	}
	,fireBurst: function(amount,timeInterval) {
		var interTime = Math.floor(timeInterval / amount);
		var _g = 0;
		while(_g < amount) {
			var i = _g++;
			var currDroplet = this.getRandDroplet();
			var distance = Math.random() * 0.5 + 0.25;
			currDroplet.y = this._spawnHeight;
			currDroplet.x = Math.random() * co.doubleduck.BaseGame.getViewport().width;
			currDroplet.scaleX *= 1 - distance;
			currDroplet.scaleY *= 1 - distance;
			createjs.Tween.get(currDroplet).wait(i * interTime).to({ y : this._killHeight},co.doubleduck.Dropper.DROP_TIME * distance).call($bind(this,this.handleDropletDead));
			this.addChild(currDroplet);
		}
	}
	,_killHeight: null
	,_spawnHeight: null
	,_droplets: null
	,__class__: co.doubleduck.Dropper
});
co.doubleduck.FontHelper = $hxClasses["co.doubleduck.FontHelper"] = function(type) {
	this._fontType = type;
};
co.doubleduck.FontHelper.__name__ = ["co","doubleduck","FontHelper"];
co.doubleduck.FontHelper.prototype = {
	getNumber: function(num,scale,forceContainer,dims,padding,centered) {
		if(centered == null) centered = true;
		if(padding == null) padding = 0;
		if(forceContainer == null) forceContainer = false;
		if(scale == null) scale = 1;
		if(num >= 0 && num < 10) {
			var result = new createjs.Container();
			var bmp = this.getDigit(num);
			bmp.scaleX = bmp.scaleY = scale;
			result.addChild(bmp);
			if(centered) {
				result.regX = bmp.image.width / 2;
				result.regY = bmp.image.height / 2;
			}
			if(forceContainer) {
				if(dims != null) {
					dims.width = bmp.image.width;
					dims.height = bmp.image.height;
				}
				return result;
			} else return bmp;
		} else {
			var result = new createjs.Container();
			var numString = "" + num;
			var digits = new Array();
			var totalWidth = 0;
			digits[digits.length] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,0,1)));
			digits[0].scaleX = digits[0].scaleY = scale;
			result.addChild(digits[0]);
			totalWidth += digits[0].image.width * scale;
			if(numString.length == 4 || numString.length == 7) {
				this._lastComma = this.getComma();
				this._lastComma.scaleX = this._lastComma.scaleY = scale;
				this._lastComma.x = digits[0].x + digits[0].image.width + padding;
				result.addChild(this._lastComma);
				totalWidth += this._lastComma.image.width * scale;
			}
			var _g1 = 1, _g = numString.length;
			while(_g1 < _g) {
				var i = _g1++;
				var index = digits.length;
				digits[index] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,i,1)));
				if(numString.length - i == 3 || numString.length - i == 6) digits[index].x = this._lastComma.x + this._lastComma.image.width + padding; else digits[index].x = digits[index - 1].x + digits[index - 1].image.width + padding;
				digits[index].scaleX = digits[index].scaleY = scale;
				result.addChild(digits[index]);
				totalWidth += digits[index].image.width * scale + padding;
				if(numString.length - i == 4 || numString.length - i == 7) {
					this._lastComma = this.getComma();
					this._lastComma.scaleX = this._lastComma.scaleY = scale;
					this._lastComma.x = digits[index].x + digits[index].image.width + padding;
					result.addChild(this._lastComma);
					totalWidth += this._lastComma.image.width * scale + padding;
				}
			}
			if(centered) {
				result.regX = totalWidth / 2;
				result.regY = digits[0].image.height / 2;
			}
			if(dims != null) {
				dims.width = totalWidth;
				dims.height = digits[0].image.height;
			}
			return result;
		}
	}
	,getDigit: function(digit) {
		var digit1 = co.doubleduck.BaseAssets.getImage(this._fontType + digit + ".png");
		return digit1;
	}
	,getComma: function() {
		return co.doubleduck.BaseAssets.getImage(this._fontType + "comma.png");
	}
	,_fontType: null
	,_lastComma: null
	,__class__: co.doubleduck.FontHelper
}
co.doubleduck.Game = $hxClasses["co.doubleduck.Game"] = function(stage) {
	this._wantLandscape = false;
	co.doubleduck.BaseGame.call(this,stage);
};
co.doubleduck.Game.__name__ = ["co","doubleduck","Game"];
co.doubleduck.Game.__super__ = co.doubleduck.BaseGame;
co.doubleduck.Game.prototype = $extend(co.doubleduck.BaseGame.prototype,{
	removeSplash: function() {
		this.showMenu();
		co.doubleduck.BaseGame._stage.removeChild(this._splashBack);
		co.doubleduck.BaseGame._stage.removeChild(this._splashBack);
		co.doubleduck.BaseGame._stage.removeChild(this._cardsLayer);
		co.doubleduck.BaseGame._stage.removeChild(this._splashLogo);
		co.doubleduck.BaseGame._stage.removeChild(this._splashStrip);
		co.doubleduck.BaseGame._stage.removeChild(this._tapToPlay);
		co.doubleduck.BaseGame._stage.removeChild(this._transition);
		createjs.Tween.removeTweens(this._tapToPlay);
	}
	,handlePlayTap: function() {
		this._splashBack.onClick = null;
		this._transition = new co.doubleduck.TransitionAnim(false);
		co.doubleduck.BaseGame._stage.addChild(this._transition);
		this._transition.animate().call($bind(this,this.removeSplash));
	}
	,showTapToPlay: function() {
		this._tapToPlay = co.doubleduck.BaseAssets.getImage("images/splash/tap2play.png");
		this._tapToPlay.scaleX = this._tapToPlay.scaleY = co.doubleduck.BaseGame.getScale();
		this._tapToPlay.regX = this._tapToPlay.image.width / 2;
		this._tapToPlay.regY = this._tapToPlay.image.height / 2;
		this._tapToPlay.x = co.doubleduck.BaseGame.getViewport().width * 0.5;
		this._tapToPlay.y = co.doubleduck.BaseGame.getViewport().height * 0.65;
		this._tapToPlay.alpha = 0;
		co.doubleduck.BaseGame._stage.addChild(this._tapToPlay);
		this.alphaFade(this._tapToPlay);
		this._splashBack.mouseEnabled = true;
		this._splashBack.onClick = $bind(this,this.handlePlayTap);
	}
	,showLogo: function() {
		this._splashStrip = co.doubleduck.BaseAssets.getImage("images/session/end_strip.png");
		this._splashStrip.scaleX = this._splashStrip.scaleY = co.doubleduck.BaseGame.getScale();
		this._splashStrip.regX = this._splashStrip.image.width / 2;
		this._splashStrip.regY = this._splashStrip.image.height / 2;
		this._splashStrip.x = co.doubleduck.BaseGame.getViewport().width * 2;
		this._splashStrip.y = co.doubleduck.BaseGame.getViewport().height * 0.45;
		co.doubleduck.BaseGame._stage.addChild(this._splashStrip);
		createjs.Tween.get(this._splashStrip).to({ x : co.doubleduck.BaseGame.getViewport().width / 2},400,createjs.Ease.circOut);
		this._splashLogo = co.doubleduck.BaseAssets.getImage("images/session/end_blackjack.png");
		this._splashLogo.scaleX = this._splashLogo.scaleY = co.doubleduck.BaseGame.getScale();
		this._splashLogo.regX = this._splashLogo.image.width / 2;
		this._splashLogo.regY = this._splashLogo.image.height / 2;
		this._splashLogo.x = co.doubleduck.BaseGame.getViewport().width * 0.5;
		this._splashLogo.y = this._splashStrip.y;
		this._splashLogo.alpha = 0;
		co.doubleduck.BaseGame._stage.addChild(this._splashLogo);
		createjs.Tween.get(this._splashLogo).wait(450).to({ alpha : 1},800).call($bind(this,this.showTapToPlay));
	}
	,drawCard: function() {
		this._cardsToDraw--;
		if(this._cardsToDraw >= 0) {
			var id;
			if(this._cardsToDraw % 2 == 0) id = new co.doubleduck.CardId(co.doubleduck.CardValue.ACE,co.doubleduck.CardType.HEARTS); else id = new co.doubleduck.CardId(co.doubleduck.CardValue.JACK,co.doubleduck.CardType.SPADES);
			var newCard = new co.doubleduck.Card(id,co.doubleduck.Game.CARDS_BACK,true,false);
			newCard.x = this._packCard.x;
			this._cardsLayer.addChildAt(newCard,this._cardsLayer.getChildIndex(this._packCard));
			this._splashCards[this._cardIndex] = newCard;
			this._cardIndex++;
			createjs.Tween.get(this._packCard).to({ x : this._packCard.x + co.doubleduck.Game.SPREAD_INTERVAL},20 + this._cardsToDraw * 3).call($bind(this,this.drawCard));
		} else {
			var targetPos = this._cardsLayer.globalToLocal(co.doubleduck.BaseGame.getViewport().width * 0.65,co.doubleduck.BaseGame.getViewport().height * 0.3);
			createjs.Tween.get(this._splashCards[7]).to({ x : targetPos.x, y : targetPos.y, rotation : -this._cardsLayer.rotation - 7},500,createjs.Ease.circInOut).call(($_=this._splashCards[7],$bind($_,$_.flip)));
			targetPos = this._cardsLayer.globalToLocal(co.doubleduck.BaseGame.getViewport().width * 0.8,co.doubleduck.BaseGame.getViewport().height * 0.35);
			createjs.Tween.get(this._splashCards[8]).to({ x : targetPos.x, y : targetPos.y, rotation : -this._cardsLayer.rotation + 15},500,createjs.Ease.circInOut).call(($_=this._splashCards[8],$bind($_,$_.flip))).wait(300).call($bind(this,this.showLogo));
		}
	}
	,showGameSplash: function() {
		this._splashBack = co.doubleduck.BaseAssets.getImage("images/splash/splash.png");
		this._splashBack.scaleX = this._splashBack.scaleY = co.doubleduck.BaseGame.getScale();
		this._splashBack.regX = this._splashBack.image.width / 2;
		this._splashBack.regY = this._splashBack.image.height / 2;
		this._splashBack.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._splashBack.y = co.doubleduck.BaseGame.getViewport().height / 2;
		co.doubleduck.BaseGame._stage.addChild(this._splashBack);
		this._cardsLayer = new createjs.Container();
		this._cardsLayer.scaleX = this._cardsLayer.scaleY = co.doubleduck.BaseGame.getScale();
		this._cardsLayer.rotation = 20;
		this._cardsLayer.x = -30 * co.doubleduck.BaseGame.getScale();
		this._cardsLayer.y = co.doubleduck.BaseGame.getViewport().height * 0.55;
		co.doubleduck.BaseGame._stage.addChild(this._cardsLayer);
		this._packCard = new co.doubleduck.Card(new co.doubleduck.CardId(co.doubleduck.CardValue.ACE,co.doubleduck.CardType.CLUBS),co.doubleduck.Game.CARDS_BACK,true,false);
		this._cardsLayer.addChild(this._packCard);
		this._cardsToDraw = 12;
		this._cardIndex = 0;
		this._splashCards = new Array();
		this.drawCard();
	}
	,_cardIndex: null
	,_cardsToDraw: null
	,_transition: null
	,_tapToPlay: null
	,_splashLogo: null
	,_splashStrip: null
	,_cardsLayer: null
	,_packCard: null
	,_splashCards: null
	,_splashBack: null
	,__class__: co.doubleduck.Game
});
co.doubleduck.Hand = $hxClasses["co.doubleduck.Hand"] = function() {
	this._cards = new Array();
};
co.doubleduck.Hand.__name__ = ["co","doubleduck","Hand"];
co.doubleduck.Hand.prototype = {
	removeCard: function(card) {
		HxOverrides.remove(this._cards,card);
	}
	,getCards: function() {
		return this._cards;
	}
	,addCard: function(card) {
		this._cards.push(card);
	}
	,isBlackJack: function() {
		return this.getCardSum() == 21 && this._cards.length == 2;
	}
	,isSoft: function() {
		var sum = 0;
		var num11Aces = 0;
		var _g = 0, _g1 = this._cards;
		while(_g < _g1.length) {
			var currCard = _g1[_g];
			++_g;
			sum += currCard.getGameValue();
			if(currCard.getValue() == co.doubleduck.CardValue.ACE) num11Aces += 1;
		}
		if(sum > 21) {
			var index = this._cards.length - 1;
			while(index >= 0 && sum > 21) {
				var card = this._cards[index];
				if(card.getValue() == co.doubleduck.CardValue.ACE) {
					sum -= 10;
					num11Aces -= 1;
				}
				index -= 1;
			}
		}
		return num11Aces > 0;
	}
	,getCardSum: function() {
		var sum = 0;
		var _g = 0, _g1 = this._cards;
		while(_g < _g1.length) {
			var currCard = _g1[_g];
			++_g;
			sum += currCard.getGameValue();
			if(currCard.getValue() == co.doubleduck.CardValue.ACE) {
			}
		}
		if(sum > 21) {
			var index = this._cards.length - 1;
			while(index >= 0 && sum > 21) {
				var card = this._cards[index];
				if(card.getValue() == co.doubleduck.CardValue.ACE) sum -= 10;
				index -= 1;
			}
		}
		return sum;
	}
	,_cards: null
	,__class__: co.doubleduck.Hand
}
co.doubleduck.Main = $hxClasses["co.doubleduck.Main"] = function() { }
co.doubleduck.Main.__name__ = ["co","doubleduck","Main"];
co.doubleduck.Main._stage = null;
co.doubleduck.Main._game = null;
co.doubleduck.Main._ffHeight = null;
co.doubleduck.Main.main = function() {
	co.doubleduck.Main.testFFHeight();
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
	co.doubleduck.Main._stage = new createjs.Stage(js.Lib.document.getElementById("stageCanvas"));
	co.doubleduck.Main._game = new co.doubleduck.Game(co.doubleduck.Main._stage);
	createjs.Ticker.addListener(co.doubleduck.Main._stage);
	createjs.Touch.enable(co.doubleduck.Main._stage,true,false);
}
co.doubleduck.Main.testFFHeight = function() {
	var isAplicable = /Firefox/.test(navigator.userAgent);
	if(isAplicable && viewporter.ACTIVE) co.doubleduck.Main._ffHeight = js.Lib.window.innerHeight;
}
co.doubleduck.Main.getFFHeight = function() {
	return co.doubleduck.Main._ffHeight;
}
co.doubleduck.Menu = $hxClasses["co.doubleduck.Menu"] = function() {
	this._isSweeping = false;
	co.doubleduck.BaseMenu.call(this);
	co.doubleduck.Button.setDefaultSound("sound/button_click");
	this._casinoArray = new Array();
	this._locksArray = new Array();
	this._background = co.doubleduck.BaseAssets.getImage("images/menu/bg.png");
	this._background.scaleX = this._background.scaleY = co.doubleduck.BaseGame.getScale();
	this._background.regX = this._background.image.width / 2;
	this._background.regY = this._background.image.height / 2;
	this._background.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._background.y = co.doubleduck.BaseGame.getViewport().height / 2;
	var backPosY = this._background.y - this._background.image.height * co.doubleduck.BaseGame.getScale() * 0.5;
	var backRealHeight = this._background.image.height * co.doubleduck.BaseGame.getScale();
	this.addChildAt(this._background,0);
	this._selectRight = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/btn_arrow_right.png"));
	this._selectRight.scaleX = this._selectRight.scaleY = co.doubleduck.BaseGame.getScale();
	this._selectRight.regX = this._selectRight.image.width;
	this._selectRight.regY = this._selectRight.image.height / 2;
	this._selectLeft = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/btn_arrow_right.png"));
	this._selectLeft.scaleX = this._selectLeft.scaleY = co.doubleduck.BaseGame.getScale();
	this._selectLeft.scaleX *= -1;
	this._selectLeft.regX = this._selectLeft.image.width;
	this._selectLeft.regY = this._selectLeft.image.height / 2;
	this._selectRight.x = co.doubleduck.BaseGame.getViewport().width - 10;
	this._selectRight.y = backPosY + backRealHeight * 0.45;
	this._selectLeft.x = 10;
	this._selectLeft.y = this._selectRight.y;
	this._selectRight.onClick = $bind(this,this.handleNextSlot);
	this._selectLeft.onClick = $bind(this,this.handlePrevSlot);
	this._casinoRow = new createjs.Container();
	this._casinoRow.x = co.doubleduck.BaseGame.getViewport().width * 0.5;
	this._casinoRow.y = backPosY + backRealHeight * co.doubleduck.Menu.ROW_POS;
	this.addChild(this._casinoRow);
	this._chosenCasinoId = 0;
	var _g1 = 0, _g = co.doubleduck.DataLoader.getCasinosCount();
	while(_g1 < _g) {
		var i = _g1++;
		this.loadCasinoImage(i);
	}
	var casinoToTarget = this.getLevel() - 1;
	if(co.doubleduck.Session.lastLocationId() != -1) casinoToTarget = co.doubleduck.Session.lastLocationId() - 1;
	this.targetCasino(casinoToTarget,true);
	this.addChild(this._selectLeft);
	this.addChild(this._selectRight);
	this._buttonsLayer = new createjs.Container();
	this._moneyBox = co.doubleduck.BaseAssets.getImage("images/menu/score.png");
	this._moneyBox.regX = this._moneyBox.image.width;
	this._moneyBox.regY = this._moneyBox.image.height;
	this._moneyBox.x = this._moneyBox.image.width;
	this._buttonsLayer.addChild(this._moneyBox);
	this._fontHelper = new co.doubleduck.FontHelper("images/general/font/");
	this.updateMoney();
	if(this.getTodayDate() != co.doubleduck.Persistence.getLastDailySpinDate()) {
		this._dailySpinBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/btn_spin.png"));
		this._dailySpinBtn.onClick = $bind(this,this.handleDailySpin);
	} else this._dailySpinBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/btn_spin_off.png"));
	this._dailySpinBtn.regX = 0;
	this._dailySpinBtn.regY = this._dailySpinBtn.image.height;
	this._dailySpinBtn.x = this._moneyBox.x + co.doubleduck.Menu.BTN_PADDING;
	this._buttonsLayer.addChild(this._dailySpinBtn);
	this._levelStroke = co.doubleduck.BaseAssets.getImage("images/menu/rep_bar_empty.png");
	this._levelStroke.regX = this._levelStroke.image.width;
	this._levelStroke.regY = this._levelStroke.image.height / 2;
	this._levelStroke.x = this._moneyBox.image.width;
	this._levelStroke.y = 30;
	this._buttonsLayer.addChild(this._levelStroke);
	this._levelFill = co.doubleduck.BaseAssets.getImage("images/menu/rep_bar_full.png");
	this._levelFill.regX = this._levelFill.image.width;
	this._levelFill.regY = this._levelFill.image.height / 2;
	this._levelFill.x = this._levelStroke.x;
	this._levelFill.y = this._levelStroke.y;
	this._buttonsLayer.addChild(this._levelFill);
	this._levelMask = new createjs.Shape();
	this._levelMask.graphics.beginFill("#000000");
	this._levelMask.graphics.drawRect(0,0,this._levelFill.image.width,this._levelFill.image.height);
	this._levelMask.graphics.endFill();
	this._levelMask.regX = 0;
	this._levelMask.regY = this._levelFill.image.height / 2;
	var isMaxLevel = this.getLevel() == co.doubleduck.DataLoader.getAllCasinos().length;
	if(isMaxLevel) this._levelMask.scaleX = 1; else {
		var levelProgression = this.getLevelProgression();
		if(levelProgression > 0) this._levelMask.scaleX *= levelProgression; else this._levelFill.visible = false;
	}
	this._levelFill.mask = this._levelMask;
	this._levelMask.x = this._levelFill.x - this._levelFill.image.width;
	this._levelMask.y = this._levelFill.y;
	this._helpBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/btn_help.png"));
	this._helpBtn.regX = 0;
	this._helpBtn.regY = this._helpBtn.image.height / 2;
	this._helpBtn.y = 30;
	this._helpBtn.x = this._dailySpinBtn.x;
	this._helpBtn.onClick = $bind(this,this.showHelpMenu);
	this._buttonsLayer.addChild(this._helpBtn);
	if(co.doubleduck.SoundManager.available) {
		this._muteButton = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/btn_audio.png"),true,co.doubleduck.Button.CLICK_TYPE_TOGGLE);
		this._muteButton.regX = this._muteButton.image.width / 4;
		this._muteButton.regY = 0;
		this._muteButton.x = this._dailySpinBtn.x + this._dailySpinBtn.image.width;
		this._muteButton.y = 30;
		this._muteButton.setToggle(co.doubleduck.SoundManager.isMuted());
		this._muteButton.onToggle = co.doubleduck.SoundManager.toggleMute;
		this._buttonsLayer.addChild(this._muteButton);
	}
	var calcWidth = this._moneyBox.image.width + co.doubleduck.Menu.BTN_PADDING + this._dailySpinBtn.image.width;
	this._buttonsLayer.regX = calcWidth / 2;
	this._buttonsLayer.scaleX = this._buttonsLayer.scaleY = co.doubleduck.BaseGame.getScale();
	this._buttonsLayer.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._buttonsLayer.y = co.doubleduck.BaseGame.getViewport().height * 0.88;
	this.addChild(this._buttonsLayer);
	this._uiOverlay = new createjs.Shape();
	this._uiOverlay.graphics.beginFill("#000000");
	this._uiOverlay.graphics.drawRect(-30,-30,co.doubleduck.BaseGame.getViewport().width + 60,co.doubleduck.BaseGame.getViewport().height + 60);
	this._uiOverlay.graphics.endFill();
	this._uiOverlay.alpha = 0;
	this.addChild(this._uiOverlay);
	this._dropper = new co.doubleduck.Dropper();
	this.addChild(this._dropper);
	this._helpScreen = co.doubleduck.BaseAssets.getImage("images/menu/help.png");
	this._helpScreen.regX = this._helpScreen.image.width / 2;
	this._helpScreen.regY = this._helpScreen.image.height / 2;
	this._helpScreen.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._helpScreen.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this._helpScreen.scaleX = this._helpScreen.scaleY = co.doubleduck.BaseGame.getScale();
	this.addChild(this._helpScreen);
	this._helpScreen.alpha = 0;
	this._helpScreen.visible = false;
	this._closeHelp = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/btn_gotit.png"));
	this._closeHelp.alpha = 0;
	this._closeHelp.regX = this._closeHelp.image.width / 2;
	this._closeHelp.regY = this._closeHelp.image.height / 2;
	this._closeHelp.scaleX = this._closeHelp.scaleY = co.doubleduck.BaseGame.getScale();
	this._closeHelp.x = this._helpScreen.x;
	this._closeHelp.y = this._helpScreen.y + this._helpScreen.image.height * 0.35 * co.doubleduck.BaseGame.getScale();
	this.addChild(this._closeHelp);
	this._transition = new co.doubleduck.TransitionAnim(true);
	this.addChild(this._transition);
	this._transition.animate().call($bind(this,this.removeTransition));
	if(co.doubleduck.Session.isBankrupt()) createjs.Tween.get(this).wait(100).call($bind(this,this.toggleOverlay),[true]).wait(300).call($bind(this,this.showBankrupceyBonus));
	co.doubleduck.BaseGame.hammer.onswipe = $bind(this,this.handleSwipe);
	this._bgMusic = co.doubleduck.SoundManager.playMusic("sound/Menu_music");
};
co.doubleduck.Menu.__name__ = ["co","doubleduck","Menu"];
co.doubleduck.Menu.__super__ = co.doubleduck.BaseMenu;
co.doubleduck.Menu.prototype = $extend(co.doubleduck.BaseMenu.prototype,{
	switchToSession: function() {
		var params = { };
		params.level = this._chosenCasinoId + 1;
		if(this.onPlayClick != null) this.onPlayClick(params);
	}
	,handlePlaySession: function() {
		if(this._uiOverlay.alpha > 0) return;
		if(this._locksArray[this._chosenCasinoId] == false) {
			co.doubleduck.BaseGame.hammer.onswipe = null;
			this._transition.visible = true;
			this._transition.animate().call($bind(this,this.switchToSession));
		}
	}
	,setArrowsVisibility: function() {
		if(this._chosenCasinoId > 0) this._selectLeft.visible = true; else this._selectLeft.visible = false;
		if(this._chosenCasinoId + 1 < co.doubleduck.DataLoader.getCasinosCount()) this._selectRight.visible = true; else this._selectRight.visible = false;
	}
	,handlePrevSlot: function() {
		if(this._chosenCasinoId > 0) this.targetCasino(this._chosenCasinoId - 1);
		this.setArrowsVisibility();
	}
	,handleNextSlot: function() {
		if(this._chosenCasinoId + 1 < co.doubleduck.DataLoader.getCasinosCount()) this.targetCasino(this._chosenCasinoId + 1);
		this.setArrowsVisibility();
	}
	,destroy: function() {
		co.doubleduck.BaseMenu.prototype.destroy.call(this);
		if(this._bgMusic != null) this._bgMusic.stop();
		if(this._isSweeping) this.onTick = null;
	}
	,handleTick: function(elapsed) {
		if(this._casinoRow.x == this._targetPos) {
			this.onTick = null;
			this._isSweeping = false;
			return;
		}
		var delta = co.doubleduck.Menu.SCROLL_EASE * elapsed;
		delta = Math.min(delta,0.2);
		delta *= this._targetPos - this._casinoRow.x;
		this._casinoRow.x += delta;
		if(Math.abs(delta) < 0.1) {
			this._casinoArray[this._chosenCasinoId].onClick = $bind(this,this.handlePlaySession);
			this._casinoRow.x = this._targetPos;
			this.onTick = null;
			this._isSweeping = false;
		}
	}
	,targetCasino: function(id,force) {
		if(force == null) force = false;
		this._casinoArray[this._chosenCasinoId].onClick = null;
		this._chosenCasinoId = id;
		this._targetPos = co.doubleduck.BaseGame.getViewport().width / 2 - this._casinoArray[id].x;
		this.setArrowsVisibility();
		if(force) {
			this._isSweeping = false;
			this._casinoRow.x = this._targetPos;
			this._casinoArray[this._chosenCasinoId].onClick = $bind(this,this.handlePlaySession);
		} else {
			this._isSweeping = true;
			this.onTick = $bind(this,this.handleTick);
		}
	}
	,loadCasinoImage: function(id) {
		var uriImage;
		if(this.getLevel() < id + 1) {
			this._locksArray[id] = true;
			uriImage = "images/menu/lvls/casino" + (id + 1) + "_off.png";
		} else {
			this._locksArray[id] = false;
			uriImage = "images/menu/lvls/casino" + (id + 1) + "_on.png";
		}
		this._casinoArray[id] = co.doubleduck.BaseAssets.getImage(uriImage,true);
		this._casinoArray[id].regX = this._casinoArray[id].image.width / 2;
		this._casinoArray[id].regY = this._casinoArray[id].image.height / 2;
		this._casinoArray[id].scaleX = this._casinoArray[id].scaleY = co.doubleduck.BaseGame.getScale();
		this._casinoArray[id].x = id * co.doubleduck.BaseGame.getViewport().width;
		this._casinoArray[id].y = 0;
		this._casinoRow.addChild(this._casinoArray[id]);
	}
	,handleSwipe: function(event) {
		if(event.direction == "left") this.handleNextSlot(); else if(event.direction == "right") this.handlePrevSlot();
	}
	,getLevel: function() {
		var xp = co.doubleduck.Persistence.getPlayerRep();
		var allLevels = co.doubleduck.DataLoader.getAllLevels();
		var _g1 = 0, _g = allLevels.length;
		while(_g1 < _g) {
			var currLevel = _g1++;
			if((allLevels[currLevel].repToUnlock | 0) > xp) return allLevels[currLevel - 1].id | 0;
		}
		return allLevels[allLevels.length - 1].id | 0;
	}
	,getLevelProgression: function() {
		var currLevel = co.doubleduck.DataLoader.getLevelById(this.getLevel());
		var nextLevel = co.doubleduck.DataLoader.getLevelById(this.getLevel() + 1);
		if(nextLevel == null) return 1;
		var all = (nextLevel.repToUnlock | 0) - (currLevel.repToUnlock | 0);
		var delta = co.doubleduck.Persistence.getPlayerRep() - (currLevel.repToUnlock | 0);
		return delta / all;
	}
	,removeDailySpin: function() {
		if(!co.doubleduck.SoundManager.isMuted()) this._bgMusic.setVolume(1);
		this.removeChild(this._dailySpin);
		this._dailySpin = null;
		this.toggleOverlay(false);
	}
	,handleDoneDailySpin: function(winSum) {
		this.removeChild(this._dropper);
		this.addChildAt(this._dropper,this.getChildIndex(this._dailySpin));
		var burstSize = Math.floor(co.doubleduck.Utils.map(winSum,450,3000,8,50));
		this._dropper.fireBurst(burstSize,700);
		var size = Math.floor(3 * co.doubleduck.Utils.map(winSum,450,3000,0,1)) + 1;
		if(size > 3) size = 3;
		co.doubleduck.SoundManager.playEffect("sound/Falling_chips_" + size);
		createjs.Tween.get(this._dailySpin).wait(1500).to({ y : -co.doubleduck.BaseGame.getViewport().height},800,$bind(this,this.removeEase)).call($bind(this,this.removeDailySpin));
		co.doubleduck.Persistence.setPlayerMoney(co.doubleduck.Persistence.getPlayerMoney() + winSum);
		this.updateMoney();
	}
	,removeEase: function(t) {
		if(t <= 0) return 0; else if(t >= 1) return 1;
		return 1.4 * t * t - 0.4 * t;
	}
	,handleDailySpin: function() {
		co.doubleduck.Persistence.setLastDailySpinDate(this.getTodayDate());
		this._buttonsLayer.removeChild(this._dailySpinBtn);
		this._dailySpinBtn.onClick = null;
		this.toggleOverlay(true);
		this._dailySpinBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/btn_spin_off.png"));
		this._dailySpinBtn.regX = 0;
		this._dailySpinBtn.regY = this._dailySpinBtn.image.height;
		this._dailySpinBtn.x = this._moneyBox.x + co.doubleduck.Menu.BTN_PADDING;
		this._buttonsLayer.addChild(this._dailySpinBtn);
		this._dailySpin = new co.doubleduck.MiniSlot();
		this._dailySpin.scaleX = this._dailySpin.scaleY = co.doubleduck.BaseGame.getScale();
		this._dailySpin.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._dailySpin.y = -co.doubleduck.BaseGame.getViewport().height;
		this._dailySpin.onDoneRoll = $bind(this,this.handleDoneDailySpin);
		this.addChild(this._dailySpin);
		createjs.Tween.get(this._dailySpin).to({ y : co.doubleduck.BaseGame.getViewport().height * 0.2},800,createjs.Ease.sineOut).wait(700).call(($_=this._dailySpin,$bind($_,$_.rollMachine)));
		if(!co.doubleduck.SoundManager.isMuted()) this._bgMusic.setVolume(0.4);
	}
	,getTodayDate: function() {
		var newDate = new Date();
		var dateName = newDate.getDate() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getFullYear();
		return dateName;
	}
	,updateMoney: function() {
		if(this._money != null) {
			this._buttonsLayer.removeChild(this._money);
			this._money = null;
		}
		if(this._dollarSign == null) {
			this._dollarSign = co.doubleduck.BaseAssets.getImage("images/general/font/dollar.png");
			this._dollarSign.regX = this._dollarSign.image.width;
			this._dollarSign.regY = this._dollarSign.image.height / 2;
		}
		var dims = new createjs.Rectangle(0,0,0,0);
		this._money = this._fontHelper.getNumber(co.doubleduck.Persistence.getPlayerMoney(),1,true,dims,2);
		this._money.x = this._moneyBox.x - this._moneyBox.image.width / 2;
		this._money.y = this._moneyBox.y - this._moneyBox.image.height / 2;
		this._buttonsLayer.addChild(this._money);
		this._dollarSign.x = this._money.x - dims.width / 2 - 5;
		this._dollarSign.y = this._money.y;
		this._buttonsLayer.addChild(this._dollarSign);
	}
	,removeBankrupceyPopup: function() {
		this.removeChild(this._getChipBtn);
		this.removeChild(this._foundChipPopup);
		this._getChipBtn = null;
		this._foundChipPopup = null;
	}
	,handlePickUpChip: function() {
		this._getChipBtn.onClick = null;
		createjs.Tween.get(this._getChipBtn).to({ alpha : 0},200);
		createjs.Tween.get(this._foundChipPopup).to({ alpha : 0},400).call($bind(this,this.removeBankrupceyPopup));
		this.toggleOverlay(false);
		this._dropper.fireBurst(5,50);
		co.doubleduck.Persistence.setPlayerMoney(co.doubleduck.Persistence.getPlayerMoney() + this._foundChipAmount);
		this._foundChipAmount = 0;
		this.updateMoney();
	}
	,showBankrupceyBonus: function() {
		var chipValues = [100,200,400,500];
		var foundChip = Std.random(chipValues.length);
		this._foundChipAmount = chipValues[foundChip];
		this._foundChipPopup = co.doubleduck.BaseAssets.getImage("images/menu/found_chip/foundchip_" + chipValues[foundChip] + ".png");
		this._foundChipPopup.scaleX = this._foundChipPopup.scaleY = co.doubleduck.BaseGame.getScale();
		this._foundChipPopup.regX = this._foundChipPopup.image.width / 2;
		this._foundChipPopup.regY = this._foundChipPopup.image.height / 2;
		this._foundChipPopup.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._foundChipPopup.y = co.doubleduck.BaseGame.getViewport().height / 2;
		this._foundChipPopup.alpha = 0;
		this.addChild(this._foundChipPopup);
		createjs.Tween.get(this._foundChipPopup).to({ alpha : 1},400);
		this._getChipBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/found_chip/btn_pickitup.png"));
		this._getChipBtn.scaleX = this._getChipBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this._getChipBtn.regX = this._getChipBtn.image.width / 2;
		this._getChipBtn.regY = this._getChipBtn.image.height;
		this._getChipBtn.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._getChipBtn.y = this._foundChipPopup.y + this._foundChipPopup.image.height * co.doubleduck.BaseGame.getScale() * 0.4;
		this._getChipBtn.alpha = 0;
		this._getChipBtn.onClick = $bind(this,this.handlePickUpChip);
		this.addChild(this._getChipBtn);
		createjs.Tween.get(this._getChipBtn).wait(750).to({ alpha : 1},250);
	}
	,toggleOverlay: function(flag) {
		var targetAlpha = 0;
		if(flag) targetAlpha = 0.65;
		createjs.Tween.removeTweens(this._uiOverlay);
		createjs.Tween.get(this._uiOverlay).to({ alpha : targetAlpha},300);
		if(this._muteButton != null) this._muteButton.mouseEnabled = !flag;
		this._buttonsLayer.mouseEnabled = !flag;
		if(flag) {
			this._helpBtn.onClick = null;
			this._selectRight.visible = this._selectLeft.visible = false;
		} else {
			this._helpBtn.onClick = $bind(this,this.showHelpMenu);
			this.setArrowsVisibility();
		}
	}
	,closeHelp: function() {
		this.toggleOverlay(false);
		createjs.Tween.removeTweens(this._closeHelp);
		createjs.Tween.removeTweens(this._helpScreen);
		createjs.Tween.removeTweens(this._helpBtn);
		createjs.Tween.get(this._helpScreen).to({ alpha : 0},1000,createjs.Ease.sineOut);
		this._closeHelp.alpha = 0;
		this._helpBtn.alpha = 1;
	}
	,showHelpMenu: function() {
		this.toggleOverlay(true);
		createjs.Tween.get(this._helpScreen).to({ alpha : 1},1000,createjs.Ease.sineOut);
		createjs.Tween.get(this._closeHelp).wait(1600).to({ alpha : 1},600,createjs.Ease.sineOut);
		createjs.Tween.get(this._helpBtn).to({ alpha : 0},1000,createjs.Ease.sineOut);
		this._helpScreen.visible = true;
		this._closeHelp.onClick = $bind(this,this.closeHelp);
	}
	,removeTransition: function() {
		this._transition.visible = false;
	}
	,_foundChipAmount: null
	,_getChipBtn: null
	,_foundChipPopup: null
	,_closeHelp: null
	,_helpScreen: null
	,_uiOverlay: null
	,_dropper: null
	,_getCoinsBtn: null
	,_dollarSign: null
	,_money: null
	,_moneyBox: null
	,_fontHelper: null
	,_levelMask: null
	,_levelStroke: null
	,_levelFill: null
	,_casinoRow: null
	,_targetPos: null
	,_isSweeping: null
	,_transition: null
	,_dailySpin: null
	,_buttonsLayer: null
	,_helpBtn: null
	,_dailySpinBtn: null
	,_bgMusic: null
	,_muteButton: null
	,_selectLeft: null
	,_selectRight: null
	,_chosenCasinoId: null
	,_locksArray: null
	,_casinoArray: null
	,_background: null
	,__class__: co.doubleduck.Menu
});
co.doubleduck.MiniSlot = $hxClasses["co.doubleduck.MiniSlot"] = function() {
	createjs.Container.call(this);
	this._back = co.doubleduck.BaseAssets.getImage("images/menu/dailyspin/bg.png");
	this._back.regX = this._back.image.width / 2;
	this.addChild(this._back);
	this._slots = new Array();
	var _g1 = 0, _g = co.doubleduck.MiniSlot.SLOTS_COUNT;
	while(_g1 < _g) {
		var i = _g1++;
		this._slots[i] = new co.doubleduck.MiniSlotWindow();
		this._slots[i].x = (i - 1) * this._slots[i].getWidth() * 1.55;
		this._slots[i].y = this._back.image.height * 0.64;
		this.addChild(this._slots[i]);
	}
};
co.doubleduck.MiniSlot.__name__ = ["co","doubleduck","MiniSlot"];
co.doubleduck.MiniSlot.__super__ = createjs.Container;
co.doubleduck.MiniSlot.prototype = $extend(createjs.Container.prototype,{
	rollMachine: function() {
		co.doubleduck.Utils.waitAndCall(null,1500,co.doubleduck.SoundManager.playEffect,["sound/Slot_spin"]);
		var values = new Array();
		var winSum = 0;
		var tween = createjs.Tween.get(this);
		var _g1 = 0, _g = co.doubleduck.MiniSlot.SLOTS_COUNT;
		while(_g1 < _g) {
			var i = _g1++;
			values[i] = Std.random(co.doubleduck.MiniSlotWindow.ITEMS_COUNT);
			tween = tween.wait(300).call(($_=this._slots[i],$bind($_,$_.startRoll)),[values[i]]);
			winSum += co.doubleduck.MiniSlot.WIN_SUMS[values[i]];
		}
		if(this.onDoneRoll != null) tween = tween.wait(co.doubleduck.MiniSlotWindow.ROLL_TIME).call(this.onDoneRoll,[winSum]);
	}
	,_slots: null
	,_back: null
	,onDoneRoll: null
	,__class__: co.doubleduck.MiniSlot
});
co.doubleduck.MiniSlotWindow = $hxClasses["co.doubleduck.MiniSlotWindow"] = function() {
	createjs.Container.call(this);
	this._window = co.doubleduck.BaseAssets.getImage("images/menu/dailyspin/window.png");
	this._window.regX = this._window.image.width / 2;
	this._window.regY = this._window.image.height / 2;
	this._mask = new createjs.Shape();
	this._mask.graphics.beginFill("#000000");
	var winW = this._window.image.width;
	var winH = this._window.image.height;
	this._mask.graphics.drawRect(winW * 0.02,winH * 0.04,winW * 0.96,winH * 0.92);
	this._mask.graphics.endFill();
	this._mask.regX = this._window.regX;
	this._mask.regY = this._window.regY;
	this._contentLayer = new createjs.Container();
	this._maskedLayer = new createjs.Container();
	this._maskedLayer.mask = this._mask;
	this._maskedLayer.addChild(this._contentLayer);
	this._strips = new Array();
	this._strips[0] = this.generateStrip();
	this._valueStep = -(this._strips[0].image.height / co.doubleduck.MiniSlotWindow.ITEMS_COUNT);
	this._contentLayer.addChild(this._strips[0]);
	this._contentLayer.y = (co.doubleduck.MiniSlotWindow.ITEMS_COUNT * 5 - 3) * this._valueStep;
	var _g = 1;
	while(_g < 5) {
		var i = _g++;
		var strip = this.generateStrip();
		strip.y = this._strips[i - 1].y + strip.image.height - i;
		this._strips[i] = strip;
		this._contentLayer.addChild(strip);
	}
	this.addChild(this._maskedLayer);
	this.addChild(this._window);
};
co.doubleduck.MiniSlotWindow.__name__ = ["co","doubleduck","MiniSlotWindow"];
co.doubleduck.MiniSlotWindow.__super__ = createjs.Container;
co.doubleduck.MiniSlotWindow.prototype = $extend(createjs.Container.prototype,{
	generateStrip: function() {
		var strip = co.doubleduck.BaseAssets.getImage("images/menu/dailyspin/slots.png");
		strip.regX = strip.image.width / 2;
		strip.regY = strip.image.height / co.doubleduck.MiniSlotWindow.ITEMS_COUNT * 0.5;
		return strip;
	}
	,kickstartEase: function(t) {
		if(t <= 0) return 0; else if(t >= 1) return 1;
		return 1.4 * t * t - 0.4 * t;
	}
	,startRoll: function(stopAt) {
		var target = this._valueStep * (stopAt + co.doubleduck.MiniSlotWindow.ITEMS_COUNT);
		createjs.Tween.get(this._contentLayer).to({ y : this._contentLayer.y - this._valueStep * co.doubleduck.MiniSlotWindow.ITEMS_COUNT * 0.4},900,$bind(this,this.kickstartEase)).to({ y : target + this._valueStep * 2},2000).to({ y : target},600,createjs.Ease.sineOut);
	}
	,getWidth: function() {
		return this._window.image.width;
	}
	,_valueStep: null
	,_mask: null
	,_maskedLayer: null
	,_contentLayer: null
	,_strips: null
	,_window: null
	,onDoneWithSlot: null
	,__class__: co.doubleduck.MiniSlotWindow
});
co.doubleduck.Persistence = $hxClasses["co.doubleduck.Persistence"] = function() { }
co.doubleduck.Persistence.__name__ = ["co","doubleduck","Persistence"];
co.doubleduck.Persistence.initGameData = function() {
	co.doubleduck.BasePersistence.GAME_PREFIX = "DDBJ_";
	if(!co.doubleduck.BasePersistence.available) return;
	co.doubleduck.BasePersistence.initVar("reputation");
	co.doubleduck.BasePersistence.initVar("moneyCount","1000");
}
co.doubleduck.Persistence.getPlayerMoney = function() {
	return Std.parseInt(co.doubleduck.BasePersistence.getValue("moneyCount"));
}
co.doubleduck.Persistence.setPlayerMoney = function(amount) {
	co.doubleduck.BasePersistence.setValue("moneyCount","" + amount);
}
co.doubleduck.Persistence.getPlayerRep = function() {
	return Std.parseInt(co.doubleduck.BasePersistence.getValue("reputation"));
}
co.doubleduck.Persistence.setPlayerRep = function(rep) {
	co.doubleduck.BasePersistence.setValue("reputation","" + rep);
}
co.doubleduck.Persistence.getLastDailySpinDate = function() {
	return co.doubleduck.BasePersistence.getValue("lastDailySpin");
}
co.doubleduck.Persistence.setLastDailySpinDate = function(date) {
	co.doubleduck.BasePersistence.setValue("lastDailySpin",date);
}
co.doubleduck.Persistence.__super__ = co.doubleduck.BasePersistence;
co.doubleduck.Persistence.prototype = $extend(co.doubleduck.BasePersistence.prototype,{
	__class__: co.doubleduck.Persistence
});
co.doubleduck.PlayingTable = $hxClasses["co.doubleduck.PlayingTable"] = function() {
	createjs.Container.call(this);
	this.regY = 186.5 * co.doubleduck.BaseGame.getScale();
	this._font = new co.doubleduck.FontHelper("images/general/font");
};
co.doubleduck.PlayingTable.__name__ = ["co","doubleduck","PlayingTable"];
co.doubleduck.PlayingTable.__super__ = createjs.Container;
co.doubleduck.PlayingTable.prototype = $extend(createjs.Container.prototype,{
	playerSplitCards: null
	,destroy: function() {
		if(this._dealerCards != null) {
			var _g = 0, _g1 = this._dealerCards;
			while(_g < _g1.length) {
				var card = _g1[_g];
				++_g;
				createjs.Tween.removeTweens(card);
			}
		}
		if(this._playerCards != null) {
			var _g = 0, _g1 = this._playerCards;
			while(_g < _g1.length) {
				var card = _g1[_g];
				++_g;
				createjs.Tween.removeTweens(card);
			}
		}
		if(this._playerSplitCards != null) {
			var _g = 0, _g1 = this._playerSplitCards;
			while(_g < _g1.length) {
				var card = _g1[_g];
				++_g;
				createjs.Tween.removeTweens(card);
			}
		}
	}
	,get_playerSplitCards: function() {
		return this._playerSplitCards;
	}
	,dealerCards: null
	,get_dealerCards: function() {
		return this._dealerCards;
	}
	,playerCards: null
	,get_playerCards: function() {
		return this._playerCards;
	}
	,addSplitCard: function(id,location,delay) {
		if(delay == null) delay = 0;
		if(this._playerSplitCards == null) this._playerSplitCards = new Array();
		this.playerCardPosX = co.doubleduck.BaseGame.getViewport().width * 0.45;
		this.playerCardPosY = 200 * co.doubleduck.BaseGame.getScale();
		var newCard = new co.doubleduck.Card(id,location,true);
		var cardIndex = this._playerSplitCards.length;
		var cardXAddon = 0;
		var cardAngleAddon = 0;
		if(cardIndex > 0) {
			cardXAddon = co.doubleduck.Utils.map(cardIndex,0,this._playerSplitCards.length - 1,0,co.doubleduck.PlayingTable.CARD_PACK_WIDTH);
			cardAngleAddon = co.doubleduck.Utils.map(cardIndex,0,this._playerSplitCards.length - 1,0,co.doubleduck.PlayingTable.CARD_PACK_ANGLE_VARIATION);
			var _g1 = 1, _g = this._playerSplitCards.length;
			while(_g1 < _g) {
				var oldCardIndex = _g1++;
				var oldcardXAddon = co.doubleduck.Utils.map(oldCardIndex,0,this._playerSplitCards.length,0,co.doubleduck.PlayingTable.CARD_PACK_WIDTH);
				var oldcardAngleAddon = co.doubleduck.Utils.map(oldCardIndex,0,this._playerSplitCards.length,0,co.doubleduck.PlayingTable.CARD_PACK_ANGLE_VARIATION);
				var currCard = this._playerSplitCards[oldCardIndex];
				var oldCardX = this.playerCardPosX + oldcardXAddon + currCard.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
				var oldCardRotation = co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE + oldcardAngleAddon;
				createjs.Tween.get(currCard).wait(delay).wait(100).to({ x : oldCardX, rotation : oldCardRotation},100,createjs.Ease.sineOut);
			}
		}
		newCard.x = co.doubleduck.BaseGame.getViewport().width + newCard.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
		newCard.y = this.playerCardPosY + newCard.getHeight() / 2 * co.doubleduck.BaseGame.getScale();
		newCard.scaleX = newCard.scaleY = co.doubleduck.BaseGame.getScale();
		var rotation = co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE + cardAngleAddon;
		var destX = this.playerCardPosX + cardXAddon + newCard.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
		var destY = this.playerCardPosY - newCard.getHeight() / 2 * co.doubleduck.BaseGame.getScale();
		this.addChild(newCard);
		this._playerSplitCards.push(newCard);
		createjs.Tween.get(newCard).wait(delay).to({ x : destX, rotation : rotation},300,createjs.Ease.sineOut).call($bind(newCard,newCard.flip));
	}
	,clearSplitHand: function() {
		var _g = 0, _g1 = this._playerSplitCards;
		while(_g < _g1.length) {
			var currSplitCard = _g1[_g];
			++_g;
			createjs.Tween.get(currSplitCard).to({ x : this._playerSplitCards[0].x, rotation : 0},200).wait(300).to({ x : co.doubleduck.BaseGame.getViewport().width + this._playerSplitCards[0].getWidth() / 2 * co.doubleduck.BaseGame.getScale()},400);
		}
	}
	,clearMainHand: function() {
		var _g = 0, _g1 = this._playerCards;
		while(_g < _g1.length) {
			var currPlayerCard = _g1[_g];
			++_g;
			createjs.Tween.get(currPlayerCard).to({ x : this._playerCards[0].x, rotation : 0},200).wait(300).to({ x : co.doubleduck.BaseGame.getViewport().width + this._playerCards[0].getWidth() / 2 * co.doubleduck.BaseGame.getScale()},300);
		}
	}
	,addSplitCards: function(newCard,newSplitCard,location) {
		var newSplitCard1 = new co.doubleduck.Card(newSplitCard,location,true);
		newSplitCard1.x = co.doubleduck.BaseGame.getViewport().width + newSplitCard1.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
		newSplitCard1.y = this.playerCardPosY + newSplitCard1.getHeight() / 2 * co.doubleduck.BaseGame.getScale();
		newSplitCard1.scaleX = newSplitCard1.scaleY = co.doubleduck.BaseGame.getScale();
		this._playerSplitCards.push(newSplitCard1);
		createjs.Tween.get(newSplitCard1).to({ x : this._playerSplitCards[0].x + co.doubleduck.PlayingTable.CARD_PACK_WIDTH * co.doubleduck.BaseGame.getScale(), rotation : co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE + co.doubleduck.PlayingTable.CARD_PACK_ANGLE_VARIATION},300).call($bind(newSplitCard1,newSplitCard1.flip));
		this.addChild(newSplitCard1);
		var newCard1 = new co.doubleduck.Card(newCard,location,true);
		newCard1.x = co.doubleduck.BaseGame.getViewport().width + newCard1.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
		newCard1.y = this.playerCardPosY + newCard1.getHeight() / 2 * co.doubleduck.BaseGame.getScale();
		newCard1.scaleX = newCard1.scaleY = co.doubleduck.BaseGame.getScale();
		this._playerCards.push(newCard1);
		createjs.Tween.get(newCard1).to({ x : this._playerCards[0].x + co.doubleduck.PlayingTable.CARD_PACK_WIDTH * co.doubleduck.BaseGame.getScale(), rotation : co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE + co.doubleduck.PlayingTable.CARD_PACK_ANGLE_VARIATION},300).call($bind(newCard1,newCard1.flip)).wait(1000).call($bind(this,this.focusMain));
		this.addChild(newCard1);
	}
	,organizePlayerCards: function() {
		return;
		var playerCardPosX = co.doubleduck.BaseGame.getViewport().width * 0.4;
		var playerCardPosY = 200 * co.doubleduck.BaseGame.getScale();
		var _g1 = 0, _g = this._playerCards.length;
		while(_g1 < _g) {
			var cardIndex = _g1++;
			var cardXAddon = co.doubleduck.Utils.map(cardIndex,0,this._playerCards.length - 1,0,co.doubleduck.PlayingTable.CARD_PACK_WIDTH);
			var cardAngleAddon = co.doubleduck.Utils.map(cardIndex,0,this._playerCards.length - 1,0,co.doubleduck.PlayingTable.CARD_PACK_ANGLE_VARIATION);
			var currCard = this._playerCards[cardIndex];
			currCard.x = playerCardPosX + cardXAddon + currCard.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
			currCard.rotation = co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE + cardAngleAddon;
		}
	}
	,addDealerCard: function(id,location,flipped,delay) {
		if(delay == null) delay = 0;
		if(flipped == null) flipped = false;
		if(location == null) location = 0;
		if(this._dealerCards == null) this._dealerCards = new Array();
		this.dealerCardPosX = co.doubleduck.BaseGame.getViewport().width * 0.05;
		this.dealerCardPosY = 0;
		var newCard = new co.doubleduck.Card(id,location,true);
		var cardIndex = this._dealerCards.length;
		var cardXAddon = 0;
		var cardAngleAddon = 0;
		if(cardIndex > 0) {
			cardXAddon = co.doubleduck.Utils.map(cardIndex,0,this._dealerCards.length - 1,0,co.doubleduck.PlayingTable.CARD_PACK_WIDTH);
			cardAngleAddon = co.doubleduck.Utils.map(cardIndex,0,this._dealerCards.length - 1,0,co.doubleduck.PlayingTable.CARD_PACK_ANGLE_VARIATION);
			var _g1 = 1, _g = this._dealerCards.length;
			while(_g1 < _g) {
				var oldCardIndex = _g1++;
				var oldcardXAddon = co.doubleduck.Utils.map(oldCardIndex,0,this._dealerCards.length,0,co.doubleduck.PlayingTable.CARD_PACK_WIDTH);
				var oldcardAngleAddon = co.doubleduck.Utils.map(oldCardIndex,0,this._dealerCards.length,0,co.doubleduck.PlayingTable.CARD_PACK_ANGLE_VARIATION);
				var currCard = this._dealerCards[oldCardIndex];
				var oldCardX = this.dealerCardPosX + oldcardXAddon + currCard.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
				var oldCardRotation = co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE + oldcardAngleAddon;
				createjs.Tween.get(currCard).wait(delay).wait(100).to({ x : oldCardX, rotation : oldCardRotation},100,createjs.Ease.sineOut);
			}
		}
		newCard.x = co.doubleduck.BaseGame.getViewport().width + newCard.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
		newCard.y = this.dealerCardPosY + newCard.getHeight() / 2 * co.doubleduck.BaseGame.getScale();
		newCard.scaleX = newCard.scaleY = co.doubleduck.BaseGame.getScale();
		var rotation = co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE + cardAngleAddon;
		var destX = this.dealerCardPosX + cardXAddon + newCard.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
		var destY = this.dealerCardPosY - newCard.getHeight() / 2 * co.doubleduck.BaseGame.getScale();
		this.addChild(newCard);
		this._dealerCards.push(newCard);
		if(!flipped) createjs.Tween.get(newCard).wait(delay).to({ x : destX, rotation : rotation},300,createjs.Ease.sineOut).call($bind(newCard,newCard.flip)); else createjs.Tween.get(newCard).wait(delay).to({ x : destX, rotation : rotation},300,createjs.Ease.sineOut);
	}
	,addPlayerCard: function(id,location,flipped,delay) {
		if(delay == null) delay = 0;
		if(flipped == null) flipped = false;
		if(location == null) location = 0;
		if(this._playerCards == null) this._playerCards = new Array();
		this.playerCardPosX = co.doubleduck.BaseGame.getViewport().width * 0.45;
		this.playerCardPosY = 200 * co.doubleduck.BaseGame.getScale();
		var newCard = new co.doubleduck.Card(id,location,true);
		var cardIndex = this._playerCards.length;
		var cardXAddon = 0;
		var cardAngleAddon = 0;
		if(cardIndex > 0) {
			cardXAddon = co.doubleduck.Utils.map(cardIndex,0,this._playerCards.length - 1,0,co.doubleduck.PlayingTable.CARD_PACK_WIDTH);
			cardAngleAddon = co.doubleduck.Utils.map(cardIndex,0,this._playerCards.length - 1,0,co.doubleduck.PlayingTable.CARD_PACK_ANGLE_VARIATION);
			var _g1 = 1, _g = this._playerCards.length;
			while(_g1 < _g) {
				var oldCardIndex = _g1++;
				var oldcardXAddon = co.doubleduck.Utils.map(oldCardIndex,0,this._playerCards.length,0,co.doubleduck.PlayingTable.CARD_PACK_WIDTH);
				var oldcardAngleAddon = co.doubleduck.Utils.map(oldCardIndex,0,this._playerCards.length,0,co.doubleduck.PlayingTable.CARD_PACK_ANGLE_VARIATION);
				var currCard = this._playerCards[oldCardIndex];
				var oldCardX = this.playerCardPosX + oldcardXAddon + currCard.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
				var oldCardRotation = co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE + oldcardAngleAddon;
				createjs.Tween.get(currCard).wait(delay).wait(100).to({ x : oldCardX, rotation : oldCardRotation},100,createjs.Ease.sineOut);
			}
		}
		newCard.x = co.doubleduck.BaseGame.getViewport().width + newCard.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
		newCard.y = this.playerCardPosY + newCard.getHeight() / 2 * co.doubleduck.BaseGame.getScale();
		newCard.scaleX = newCard.scaleY = co.doubleduck.BaseGame.getScale();
		var rotation = co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE + cardAngleAddon;
		var destX = this.playerCardPosX + cardXAddon + newCard.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
		var destY = this.playerCardPosY - newCard.getHeight() / 2 * co.doubleduck.BaseGame.getScale();
		this.addChild(newCard);
		this._playerCards.push(newCard);
		createjs.Tween.get(newCard).wait(delay).to({ x : destX, rotation : rotation},300,createjs.Ease.sineOut).call($bind(newCard,newCard.flip));
	}
	,focusMain: function(hideSplit) {
		if(hideSplit == null) hideSplit = true;
		var _g1 = 0, _g = this._playerCards.length;
		while(_g1 < _g) {
			var cardIndex = _g1++;
			var currCard = this._playerCards[cardIndex];
			var cardXAddon = co.doubleduck.Utils.map(cardIndex,0,this._playerCards.length - 1,0,co.doubleduck.PlayingTable.CARD_PACK_WIDTH);
			var cardAngleAddon = co.doubleduck.Utils.map(cardIndex,0,this._playerCards.length - 1,0,co.doubleduck.PlayingTable.CARD_PACK_ANGLE_VARIATION);
			var destX = this.playerCardPosX + cardXAddon + currCard.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
			var destY = this.playerCardPosY - currCard.getHeight() / 2 * co.doubleduck.BaseGame.getScale();
			var rotation = co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE + cardAngleAddon;
			createjs.Tween.get(currCard).to({ x : destX, rotation : rotation, y : this.playerCardPosY + currCard.getHeight() / 2 * co.doubleduck.BaseGame.getScale()},300,createjs.Ease.sineOut);
		}
		if(hideSplit) createjs.Tween.get(this._playerSplitCards[0]).to({ x : co.doubleduck.BaseGame.getViewport().width * 1.05, rotation : co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE - 55, y : this.playerCardPosY - 40 * co.doubleduck.BaseGame.getScale()},300,createjs.Ease.sineOut);
	}
	,focusSplit: function(mainBusted) {
		if(mainBusted == null) mainBusted = false;
		createjs.Tween.get(this._playerSplitCards[0]).wait(500).to({ x : this.playerCardPosX + this._playerCards[0].getWidth() / 2 * co.doubleduck.BaseGame.getScale(), rotation : co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE, y : this.playerCardPosY + this._playerCards[0].getHeight() / 2 * co.doubleduck.BaseGame.getScale()},300);
		if(!mainBusted) {
			var _g1 = 0, _g = this._playerCards.length;
			while(_g1 < _g) {
				var playerCardIndex = _g1++;
				createjs.Tween.get(this._playerCards[playerCardIndex]).to({ x : co.doubleduck.BaseGame.getViewport().width * 1.05 + 20 * playerCardIndex * co.doubleduck.BaseGame.getScale(), rotation : co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE - 55 + 15 * playerCardIndex, y : this.playerCardPosY - 40 * co.doubleduck.BaseGame.getScale()},300,createjs.Ease.sineOut);
			}
		}
	}
	,addDealerCardOld: function(id,location,flipped,delay) {
		if(delay == null) delay = 0;
		if(flipped == null) flipped = false;
		if(location == null) location = 1;
		if(this._dealerCards == null) this._dealerCards = new Array();
		var dealerCardPosX = co.doubleduck.BaseGame.getViewport().width * 0.05;
		var dealerCardPosY = 0;
		var newCard = new co.doubleduck.Card(id,location,true);
		newCard.x = co.doubleduck.BaseGame.getViewport().width + newCard.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
		newCard.y = dealerCardPosY + newCard.getHeight() / 2 * co.doubleduck.BaseGame.getScale();
		newCard.scaleX = newCard.scaleY = co.doubleduck.BaseGame.getScale();
		var rotation = -3 + 3 * this._dealerCards.length;
		var destX = dealerCardPosX + 30 * co.doubleduck.BaseGame.getScale() * this._dealerCards.length + newCard.getWidth() / 2 * co.doubleduck.BaseGame.getScale();
		var destY = dealerCardPosY - newCard.getHeight() / 2 * co.doubleduck.BaseGame.getScale();
		this.addChild(newCard);
		this._dealerCards.push(newCard);
		var flipFunction = null;
		createjs.Tween.get(newCard).wait(delay).to({ x : destX, rotation : rotation},300,createjs.Ease.sineOut).call($bind(newCard,newCard.flip));
	}
	,clearAll: function() {
		var _g = 0, _g1 = this._playerCards;
		while(_g < _g1.length) {
			var currPlayerCard = _g1[_g];
			++_g;
			this.removeChild(currPlayerCard);
		}
		var _g = 0, _g1 = this._dealerCards;
		while(_g < _g1.length) {
			var currDealerCard = _g1[_g];
			++_g;
			this.removeChild(currDealerCard);
		}
		if(this._playerSplitCards != null) {
			var _g = 0, _g1 = this._playerSplitCards;
			while(_g < _g1.length) {
				var currSplitCard = _g1[_g];
				++_g;
				this.removeChild(currSplitCard);
			}
		}
		this._dealerCards = new Array();
		this._playerCards = new Array();
		this._playerSplitCards = null;
	}
	,clear: function() {
		var _g = 0, _g1 = this._playerCards;
		while(_g < _g1.length) {
			var currPlayerCard = _g1[_g];
			++_g;
			createjs.Tween.get(currPlayerCard).to({ x : this._playerCards[0].x, rotation : 0},200).wait(300).to({ x : co.doubleduck.BaseGame.getViewport().width + this._playerCards[0].getWidth() / 2 * co.doubleduck.BaseGame.getScale()},400);
		}
		if(this._playerSplitCards != null) {
			var _g = 0, _g1 = this._playerSplitCards;
			while(_g < _g1.length) {
				var currSplitCard = _g1[_g];
				++_g;
				createjs.Tween.get(currSplitCard).to({ x : this._playerSplitCards[0].x, rotation : 0},200).wait(300).to({ x : co.doubleduck.BaseGame.getViewport().width + this._playerSplitCards[0].getWidth() / 2 * co.doubleduck.BaseGame.getScale()},400);
			}
		}
		var _g = 0, _g1 = this._dealerCards;
		while(_g < _g1.length) {
			var currDealerCard = _g1[_g];
			++_g;
			createjs.Tween.get(currDealerCard).to({ x : this._dealerCards[0].x, rotation : 0},200).wait(300).to({ x : -this._playerCards[0].getWidth() / 2 * co.doubleduck.BaseGame.getScale()},400).call($bind(this,this.clearAll));
		}
	}
	,splitDone: function() {
		this._playerSplitCards = new Array();
		this._playerSplitCards[0] = this._playerCards[1];
		this._playerCards.splice(1,1);
	}
	,split: function() {
		this.splitDone();
		return;
		createjs.Tween.get(this._playerCards[1]).to({ x : this._playerCards[1].x - 20 * co.doubleduck.BaseGame.getScale(), rotation : co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE},200);
		createjs.Tween.get(this._playerCards[0]).to({ x : this._playerCards[0].x - 190 * co.doubleduck.BaseGame.getScale(), rotation : co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE},200).call($bind(this,this.splitDone));
	}
	,debug: function() {
	}
	,playerCardPosY: null
	,playerCardPosX: null
	,dealerCardPosY: null
	,dealerCardPosX: null
	,_font: null
	,_sumDisplay: null
	,_playerCardCounter: null
	,_dealerCards: null
	,_playerSplitCards: null
	,_playerCards: null
	,__class__: co.doubleduck.PlayingTable
	,__properties__: {get_playerCards:"get_playerCards",get_dealerCards:"get_dealerCards",get_playerSplitCards:"get_playerSplitCards"}
});
co.doubleduck.Session = $hxClasses["co.doubleduck.Session"] = function(properties) {
	co.doubleduck.Session._locationId = properties.level | 0;
	this._ambienceSound = co.doubleduck.SoundManager.playEffect("sound/ambience/amb" + co.doubleduck.Session._locationId);
	this._casinoData = co.doubleduck.DataLoader.getCasinoById(co.doubleduck.Session._locationId);
	this._betMinimum = this._casinoData.betMinimum | 0;
	this._betMaximum = this._casinoData.betMaximum | 0;
	this._betInterval = this._casinoData.betInterval | 0;
	this._mainBetAmount = this._betMinimum;
	this._lastBetAmount = this._mainBetAmount;
	this._gameState = co.doubleduck.GameState.NONE;
	co.doubleduck.BaseSession.call(this);
	this._deck = new co.doubleduck.CardDeck();
	this._table = new co.doubleduck.PlayingTable();
	this._table.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.constructLevel();
	this._mainChipPack = new co.doubleduck.ChipPack();
	this.addChild(this._mainChipPack);
	this._mainChipPack.y = co.doubleduck.BaseGame.getViewport().height * 0.25;
	this._mainChipPack.x = co.doubleduck.BaseGame.getViewport().width * 0.6;
	this.addChild(this._table);
	this._placeBet = co.doubleduck.Utils.getCenteredImage("images/session/place_bet.png",true);
	this._placeBet.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._placeBet.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._placeBet);
	this._bankrupt = co.doubleduck.Utils.getCenteredImage("images/session/bankrupt_alert.png",true);
	this._bankrupt.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._bankrupt.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._bankrupt);
	this._backToLobbyBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/btn_back2lobby.png"),true,3,"sound/button_click");
	this._backToLobbyBtn.scaleX = this._backToLobbyBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._backToLobbyBtn.regX = this._backToLobbyBtn.image.width / 2;
	this._backToLobbyBtn.x = this._bankrupt.x;
	this._backToLobbyBtn.y = this._bankrupt.y + 50 * co.doubleduck.BaseGame.getScale();
	this._backToLobbyBtn.onClick = $bind(this,this.handleLobbyClicked);
	this.addChild(this._backToLobbyBtn);
	this._backToLobbyBtn.visible = false;
	this._placeBet.visible = false;
	this._bankrupt.visible = false;
	this._placeBet.alpha = 0;
	this.checkBankrupcty();
	this.addHud();
	this._transition = new co.doubleduck.TransitionAnim(true);
	this.addChild(this._transition);
	this._transition.animate().call($bind(this,this.animationEnded));
	this._insuranceAmount = 0;
};
co.doubleduck.Session.__name__ = ["co","doubleduck","Session"];
co.doubleduck.Session.isBankrupt = function() {
	var money = co.doubleduck.Persistence.getPlayerMoney();
	return money < (co.doubleduck.DataLoader.getCasinoById(1).betMinimum | 0);
}
co.doubleduck.Session.lastLocationId = function() {
	return co.doubleduck.Session._locationId;
}
co.doubleduck.Session.__super__ = co.doubleduck.BaseSession;
co.doubleduck.Session.prototype = $extend(co.doubleduck.BaseSession.prototype,{
	destroy: function() {
		co.doubleduck.BaseSession.prototype.destroy.call(this);
		createjs.Tween.removeTweens(this._betHud);
		createjs.Tween.removeTweens(this._gameHud);
		this._gameState = co.doubleduck.GameState.NONE;
		if(!co.doubleduck.Utils.isMobileFirefox()) this._ambienceSound.stop();
		this._table.destroy();
	}
	,getLevel: function() {
		var xp = co.doubleduck.Persistence.getPlayerRep();
		var allLevels = co.doubleduck.DataLoader.getAllLevels();
		var _g1 = 0, _g = allLevels.length;
		while(_g1 < _g) {
			var currLevel = _g1++;
			if((allLevels[currLevel].repToUnlock | 0) > xp) return allLevels[currLevel - 1].id | 0;
		}
		return allLevels[allLevels.length - 1].id | 0;
	}
	,getLevelProgression: function() {
		var currLevel = co.doubleduck.DataLoader.getLevelById(this.getLevel());
		var nextLevel = co.doubleduck.DataLoader.getLevelById(this.getLevel() + 1);
		if(nextLevel == null) return 1;
		var all = (nextLevel.repToUnlock | 0) - (currLevel.repToUnlock | 0);
		var delta = co.doubleduck.Persistence.getPlayerRep() - (currLevel.repToUnlock | 0);
		return delta / all;
	}
	,updateRep: function(reset,tween) {
		if(tween == null) tween = true;
		if(reset == null) reset = false;
		if(this.getLevel() == co.doubleduck.DataLoader.getAllCasinos().length) {
			this._reputationBarMask.scaleX = co.doubleduck.BaseGame.getScale();
			return;
		}
		if(reset) this._reputationBarMask.scaleX = 0.01;
		var newScale = this.getLevelProgression() * co.doubleduck.BaseGame.getScale();
		if(newScale == 0) newScale = 0.01;
		if(tween) createjs.Tween.get(this._reputationBarMask).to({ scaleX : newScale},500); else this._reputationBarMask.scaleX = newScale;
	}
	,removeEase: function(t) {
		if(t <= 0) return 0; else if(t >= 1) return 1;
		return 1.6 * t * t - 0.6 * t;
	}
	,showUnlocked: function() {
		var scorePosX = this._scoreBar.x;
		var scorePosY = this._scoreBar.y;
		createjs.Tween.get(this._scoreContainer).to({ y : -this._scoreBar.image.height * 1.5 * co.doubleduck.BaseGame.getScale()},500,$bind(this,this.removeEase)).call($bind(this,this.updateRep),[true]).wait(4700).to({ y : 0},500,createjs.Ease.circOut);
		var repUnlocked = co.doubleduck.BaseAssets.getImage("images/session/rep_unlocked.png");
		repUnlocked.regX = repUnlocked.image.width / 2;
		repUnlocked.regY = repUnlocked.image.height / 2;
		repUnlocked.scaleX = repUnlocked.scaleY = co.doubleduck.BaseGame.getScale();
		repUnlocked.x = this._scoreBar.x - repUnlocked.image.width / 2 * co.doubleduck.BaseGame.getScale();
		repUnlocked.y = 0 - repUnlocked.image.height / 2 * co.doubleduck.BaseGame.getScale();
		this.addChild(repUnlocked);
		var origScale = co.doubleduck.BaseGame.getScale();
		var destScale = origScale * 1.1;
		createjs.Tween.get(repUnlocked).wait(1000).to({ y : scorePosY + repUnlocked.image.height / 2 * co.doubleduck.BaseGame.getScale()},500,createjs.Ease.circOut).wait(3000).to({ y : 0 - repUnlocked.image.height / 2 * co.doubleduck.BaseGame.getScale()},500,$bind(this,this.removeEase)).call($bind(this,this.removeMe),[repUnlocked]);
		createjs.Tween.get(repUnlocked).wait(2200).to({ scaleX : destScale, scaleY : destScale},70,createjs.Ease.sineOut).wait(40).to({ scaleX : origScale, scaleY : origScale},100,createjs.Ease.sineIn).wait(40).to({ scaleX : destScale, scaleY : destScale},70,createjs.Ease.sineOut).wait(40).to({ scaleX : origScale, scaleY : origScale},100,createjs.Ease.sineIn);
	}
	,handleLevelUnlocked: function() {
		this._reputationBarMask.scaleX = co.doubleduck.BaseGame.getScale();
		createjs.Tween.get(this._reputationBarFill).wait(500).to({ alpha : 0},300).wait(100).to({ alpha : 1},50).wait(50).to({ alpha : 0},200).wait(50).to({ alpha : 1},200).wait(500).call($bind(this,this.showUnlocked));
	}
	,addXp: function(amount,startX,startY) {
		var currLevel = this.getLevel();
		var xpPx = 20 * co.doubleduck.BaseGame.getScale();
		var xpText = new createjs.Text("+1 XP","" + xpPx + "px Helvetica, Arial, sans-serif","#2299DD");
		xpText.textAlign = "center";
		xpText.x = startX;
		xpText.y = startY;
		xpText.text = "+" + amount + " Rep";
		this.addChild(xpText);
		createjs.Tween.get(xpText).to({ y : this._scoreBar.y, alpha : 0.2},800).call($bind(this,this.removeMe),[xpText]);
		createjs.Tween.get(xpText).to({ x : this._scoreBar.x - this._scoreBar.image.width / 2 * co.doubleduck.BaseGame.getScale()},800,createjs.Ease.sineOut);
		var playerRep = co.doubleduck.Persistence.getPlayerRep();
		playerRep += amount;
		co.doubleduck.Persistence.setPlayerRep(playerRep);
		var newLevel = this.getLevel();
		if(newLevel > currLevel) this.handleLevelUnlocked(); else this.updateRep();
	}
	,handleBetClick: function() {
		if(co.doubleduck.Persistence.getPlayerMoney() < this._lastBetAmount) this.noFunds(this._betBtn.x - 75 * co.doubleduck.BaseGame.getScale(),this._betBtn.y - this._betBtn.image.height / 2 * co.doubleduck.BaseGame.getScale() - 30 * co.doubleduck.BaseGame.getScale()); else {
			var money = co.doubleduck.Persistence.getPlayerMoney();
			this._mainBetAmount = this._lastBetAmount;
			money -= this._mainBetAmount;
			this.addXp(this._mainBetAmount,this._betBtn.x + this._betBtn.image.width / 2 * co.doubleduck.BaseGame.getScale(),this._betBtn.y - this._betBtn.image.height / 2 * co.doubleduck.BaseGame.getScale());
			this._mainBetAmount = this._lastBetAmount;
			co.doubleduck.Persistence.setPlayerMoney(money);
			this._mainChipPack.addBet(this._mainBetAmount);
			this.updateMoney();
			this.betTransition();
			this._betHud.mouseEnabled = false;
		}
	}
	,burstShoot: function(amount) {
		this.removeChild(this._dropper);
		this.addChildAt(this._dropper,this.getChildIndex(this._currCaption) - 1);
		var size = Math.floor(3 * co.doubleduck.Utils.map(amount,this._betMinimum * 2,this._betMaximum * 2.5,0,1)) + 1;
		if(size > 3) size = 3;
		co.doubleduck.SoundManager.playEffect("sound/Falling_chips_" + size);
		var burstSize = Math.floor(co.doubleduck.Utils.map(amount,this._betMinimum * 2,this._betMaximum * 2,8,50));
		this._dropper.fireBurst(burstSize,500);
	}
	,doBurst: function(amount) {
		co.doubleduck.Utils.waitAndCall(null,500,$bind(this,this.burstShoot),[amount]);
	}
	,handleBlackJack: function() {
		var money = co.doubleduck.Persistence.getPlayerMoney();
		var earned = 0;
		if(this._gameState == co.doubleduck.GameState.DEALER_RESPONSE_SPLIT) {
			earned = Math.ceil(this._splitBetAmount * 2.5);
			money += Math.ceil(this._splitBetAmount * 2.5);
			this._splitChipPack.toPlayer();
			if(this._hand != null) {
				co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.checkMainHand));
				this.removeCounter();
			} else co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.newGame));
		} else if(this._gameState == co.doubleduck.GameState.DEALER_RESPONSE) {
			this._mainChipPack.toPlayer();
			money += Math.ceil(this._mainBetAmount * 2.5);
			earned = Math.ceil(this._mainBetAmount * 2.5);
			co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.newGame));
		}
		co.doubleduck.Persistence.setPlayerMoney(money);
		this.updateMoney();
		this.doBurst(earned);
		this.endCaption("blackjack");
	}
	,splitReady: function() {
		this.showInGameUI();
		this.showHand(false);
	}
	,splitHands: function() {
		this._splitHand = new co.doubleduck.Hand();
		this._splitHand.addCard(this._hand.getCards()[1]);
		this._hand.removeCard(this._hand.getCards()[1]);
		var newCard = this._deck.next();
		this._hand.addCard(newCard);
		this._table.addPlayerCard(newCard,co.doubleduck.Session._locationId);
		this._table.focusMain();
		co.doubleduck.Utils.waitAndCall(this,500,$bind(this,this.splitReady));
	}
	,removeCounter: function() {
		this.removeChild(this._handCounter);
		this._handCounter = null;
		this.removeChild(this._sumDisplay);
	}
	,handleSplitClicked: function() {
		if(this._insuranceBtn != null) {
			this.removeChild(this._insuranceBtn);
			this._insuranceBtn = null;
		}
		this.removeChild(this._splitBtn);
		this.removeCounter();
		this.closeInGameUI();
		this._sumDisplay = null;
		this._table.split();
		this._splitBetAmount = this._mainBetAmount;
		var money = co.doubleduck.Persistence.getPlayerMoney();
		money -= this._mainBetAmount;
		if(money < 0) {
		} else {
			co.doubleduck.Persistence.setPlayerMoney(money);
			this.updateMoney();
			this.addXp(this._mainBetAmount,this._splitBtn.x,this._splitBtn.y);
			co.doubleduck.Utils.waitAndCall(this,500,$bind(this,this.splitHands));
			if(this._splitChipPack == null) {
				this._splitChipPack = new co.doubleduck.ChipPack();
				this.addChild(this._splitChipPack);
				this._splitChipPack.y = co.doubleduck.BaseGame.getViewport().height * 0.25;
				this._splitChipPack.x = co.doubleduck.BaseGame.getViewport().width * 0.6;
			}
			this._splitChipPack.addBet(this._splitBetAmount);
		}
		this._splitBtn = null;
	}
	,showSplitBtn: function() {
		var splitAvail = co.doubleduck.Persistence.getPlayerMoney() >= this._mainBetAmount;
		if(!splitAvail) return;
		this._splitBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/btn_split.png"),true,2,co.doubleduck.Session.BUTTON_SOUND);
		co.doubleduck.Utils.setCenterReg(this._splitBtn);
		this._splitBtn.scaleX = this._splitBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this.addChild(this._splitBtn);
		var global = this._table.localToGlobal(this._table.get_playerCards()[0].x,this._table.get_playerCards()[0].y);
		this._splitBtn.y = global.y + 50 * co.doubleduck.BaseGame.getScale();
		this._splitBtn.x = global.x + co.doubleduck.PlayingTable.CARD_PACK_WIDTH / 2 * co.doubleduck.BaseGame.getScale();
		this._splitBtn.onClick = $bind(this,this.handleSplitClicked);
	}
	,showHand: function(splitHand) {
		if(splitHand == null) splitHand = false;
		this._handCounter = co.doubleduck.Utils.getCenteredImage("images/session/counter.png",true);
		if(splitHand) this._handCounter.x = this._table.get_playerSplitCards()[0].x - this._table.get_playerSplitCards()[0].getWidth() * 0.7 * co.doubleduck.BaseGame.getScale(); else this._handCounter.x = this._table.get_playerCards()[0].x - this._table.get_playerCards()[0].getWidth() * 0.7 * co.doubleduck.BaseGame.getScale();
		var global = null;
		if(splitHand) global = this._table.localToGlobal(this._table.get_playerSplitCards()[0].x,this._table.get_playerSplitCards()[0].y); else global = this._table.localToGlobal(this._table.get_playerCards()[0].x,this._table.get_playerCards()[0].y);
		this._handCounter.y = global.y;
		this._handCounter.alpha = 0;
		createjs.Tween.get(this._handCounter).to({ alpha : 1},300);
		this.addChild(this._handCounter);
		if(splitHand) this.updateSum(true); else this.updateSum();
	}
	,handleInsuranceClicked: function() {
		this.removeChild(this._insuranceBtn);
		this._insuranceAmount = Math.ceil(this._mainBetAmount / 2);
		var money = co.doubleduck.Persistence.getPlayerMoney();
		money -= this._insuranceAmount;
		if(money >= 0) {
			co.doubleduck.Persistence.setPlayerMoney(money);
			this.updateMoney();
			this.addXp(this._insuranceAmount,this._insuranceBtn.x,this._insuranceBtn.y);
			this._insuranceChipPack.addBet(this._insuranceAmount);
		} else this._insuranceAmount = 0;
		this._insuranceBtn = null;
	}
	,showInsurance: function() {
		if(co.doubleduck.Persistence.getPlayerMoney() < this._mainBetAmount / 2) return;
		if(this._insuranceChipPack == null) {
			this._insuranceChipPack = new co.doubleduck.ChipPack(false);
			this.addChild(this._insuranceChipPack);
			this._insuranceChipPack.x = co.doubleduck.BaseGame.getViewport().width * 0.05;
			this._insuranceChipPack.y = this._table.y + 10 * co.doubleduck.BaseGame.getScale();
		}
		this._insuranceBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/btn_insurance.png"),true,2,co.doubleduck.Session.BUTTON_SOUND);
		this.addChild(this._insuranceBtn);
		co.doubleduck.Utils.setCenterReg(this._insuranceBtn);
		this._insuranceBtn.scaleX = this._insuranceBtn.scaleY = co.doubleduck.BaseGame.getScale();
		var global = this._table.localToGlobal(this._table.get_dealerCards()[0].x,this._table.get_dealerCards()[0].y);
		this._insuranceBtn.y = global.y + 50 * co.doubleduck.BaseGame.getScale();
		this._insuranceBtn.x = global.x + co.doubleduck.PlayingTable.CARD_PACK_WIDTH / 2 * co.doubleduck.BaseGame.getScale();
		this._insuranceBtn.onClick = $bind(this,this.handleInsuranceClicked);
	}
	,handleInitialHands: function() {
		if(this._hand.getCardSum() == 21) {
		}
		if(this._hand.getCards()[0].getGameValue() == this._hand.getCards()[1].getGameValue()) this.showSplitBtn();
		if(this._dealersHand.getCards()[0].getValue() == co.doubleduck.CardValue.ACE) this.showInsurance();
		this._gameState = co.doubleduck.GameState.PLAYER_RESPONSE;
		this.showHand();
	}
	,removeMe: function(obj) {
		this.removeChild(obj);
	}
	,endCaption: function(type) {
		var strip = co.doubleduck.Utils.getCenteredImage("images/session/end_strip.png",true);
		strip.x = co.doubleduck.BaseGame.getViewport().width + strip.image.width / 2 * co.doubleduck.BaseGame.getScale();
		strip.y = co.doubleduck.BaseGame.getViewport().height / 2;
		this.addChild(strip);
		createjs.Tween.get(strip).to({ x : co.doubleduck.BaseGame.getViewport().width / 2},300,createjs.Ease.sineOut).wait(2000).to({ x : -strip.image.width / 2 * co.doubleduck.BaseGame.getScale()},300,createjs.Ease.sineIn).call($bind(this,this.removeMe),[strip]);
		var caption = co.doubleduck.Utils.getCenteredImage("images/session/end_" + type + ".png",true);
		caption.x = co.doubleduck.BaseGame.getViewport().width + caption.image.width / 2 * co.doubleduck.BaseGame.getScale();
		caption.y = co.doubleduck.BaseGame.getViewport().height / 2;
		this.addChild(caption);
		caption.scaleX = caption.scaleY = co.doubleduck.BaseGame.getScale() * 0.5;
		var origScale = caption.scaleX;
		var targetScale = co.doubleduck.BaseGame.getScale();
		createjs.Tween.get(caption).to({ x : co.doubleduck.BaseGame.getViewport().width * 0.55},400,createjs.Ease.sineOut).to({ x : co.doubleduck.BaseGame.getViewport().width * 0.45},1500,createjs.Ease.none).to({ x : -caption.image.width / 2 * co.doubleduck.BaseGame.getScale()},300,createjs.Ease.sineOut).call($bind(this,this.removeMe),[caption]);
		createjs.Tween.get(caption).wait(100).to({ scaleX : targetScale, scaleY : targetScale},300,createjs.Ease.sineOut).wait(1500).to({ scaleX : origScale, scaleY : origScale},200,createjs.Ease.sineOut);
		this._currCaption = caption;
	}
	,startGame: function() {
		this._gameState = co.doubleduck.GameState.GAME_STARTED;
		this._hand = new co.doubleduck.Hand();
		this._dealersHand = new co.doubleduck.Hand();
		var playerFirst = this._deck.next();
		this._hand.addCard(playerFirst);
		var dealerFirst = this._deck.next();
		this._dealersHand.addCard(dealerFirst);
		var playerSecond = this._deck.next();
		this._hand.addCard(playerSecond);
		var dealerSecond = this._deck.next();
		this._dealersHand.addCard(dealerSecond);
		this._table.addDealerCard(dealerFirst,co.doubleduck.Session._locationId,null,1300);
		this._table.addPlayerCard(playerFirst,co.doubleduck.Session._locationId,null,1000);
		this._table.addDealerCard(dealerSecond,co.doubleduck.Session._locationId,true,2500);
		this._table.addPlayerCard(playerSecond,co.doubleduck.Session._locationId,false,1800);
		co.doubleduck.Utils.waitAndCall(this,2500,$bind(this,this.handleInitialHands));
	}
	,betTransition: function() {
		this._gameState = co.doubleduck.GameState.PLAYER_BET_TRANSITION;
		this.closeBetUI();
		co.doubleduck.Utils.waitAndCall(this,1500,$bind(this,this.showInGameUI));
		co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.startGame));
	}
	,closeInGameUI: function() {
		this._gameHud.mouseEnabled = false;
		createjs.Tween.get(this._gameHud).to({ y : this._betBtn.image.height * co.doubleduck.BaseGame.getScale()},500,createjs.Ease.sineIn);
	}
	,showInGameUI: function() {
		this._gameHud.mouseEnabled = true;
		createjs.Tween.get(this._gameHud).to({ y : 0},500,createjs.Ease.sineOut);
		var showDouble = co.doubleduck.Persistence.getPlayerMoney() >= this._mainBetAmount;
		this._doubleBtn.mouseEnabled = showDouble;
		if(showDouble) this._doubleBtn.alpha = 1; else this._doubleBtn.alpha = 0.5;
	}
	,closeBetUI: function() {
		if(this._bankrupt != null) this._bankrupt.visible = false;
		this._placeBet.visible = false;
		this._betHud.mouseEnabled = false;
		createjs.Tween.get(this._betHud).to({ y : this._betBtn.image.height * co.doubleduck.BaseGame.getScale()},500,createjs.Ease.sineIn);
	}
	,showBetUI: function() {
		this._betHud.mouseEnabled = true;
		this._placeBet.visible = true;
		this._placeBet.alpha = 0;
		createjs.Tween.get(this._placeBet).wait(500).to({ alpha : 1},500,createjs.Ease.sineOut);
		createjs.Tween.get(this._betHud).to({ y : 0},500,createjs.Ease.sineOut);
		var enoughFunds = co.doubleduck.Persistence.getPlayerMoney() >= this._betMinimum;
		if(enoughFunds) {
			this._betGreyBtn.visible = false;
			this._betBtn.visible = true;
		} else {
			this._betGreyBtn.visible = true;
			this._betBtn.visible = false;
		}
	}
	,newGame: function() {
		this._gameState = co.doubleduck.GameState.NONE;
		this._deck.reset();
		this._table.clear();
		this._hand = new co.doubleduck.Hand();
		this._splitHand = null;
		this._dealersHand = new co.doubleduck.Hand();
		this.checkBankrupcty();
		if(this._handCounter != null) {
			this.removeChild(this._handCounter);
			this._handCounter = null;
		}
		if(this._sumDisplay != null) {
			this.removeChild(this._sumDisplay);
			this._sumDisplay = null;
		}
		if(this._dealerHandCounter != null) {
			this.removeChild(this._dealerHandCounter);
			this._dealerHandCounter = null;
		}
		if(this._dealerSumDisplay != null) {
			this.removeChild(this._dealerSumDisplay);
			this._dealerSumDisplay = null;
		}
		if(this._mainChipPack != null) this._mainChipPack.clear();
		if(this._splitChipPack != null) this._splitChipPack.clear();
		if(this._insuranceChipPack != null) this._insuranceChipPack.clear();
		this._insuranceAmount = 0;
	}
	,temp: function() {
		return co.doubleduck.BaseAssets.getImage("images/temp/kaftor.png");
	}
	,handleBetDecrease: function() {
		this._lastBetAmount = this._lastBetAmount - this._betInterval;
		if(this._lastBetAmount <= this._betMinimum) {
			this._lastBetAmount = this._betMinimum;
			this._decreaseBetBtn.alpha = 0.5;
			this._decreaseBetBtn.mouseEnabled = false;
		} else {
			this._decreaseBetBtn.alpha = 1;
			this._decreaseBetBtn.mouseEnabled = true;
		}
		this._increaseBetBtn.alpha = 1;
		this._increaseBetBtn.mouseEnabled = true;
		this.updateBetDisplay();
	}
	,handleBetIncrease: function() {
		this._lastBetAmount = this._lastBetAmount + this._betInterval;
		if(this._lastBetAmount >= this._betMaximum) {
			this._lastBetAmount = this._betMaximum;
			this._increaseBetBtn.alpha = 0.5;
			this._increaseBetBtn.mouseEnabled = false;
		} else {
			this._increaseBetBtn.alpha = 1;
			this._increaseBetBtn.mouseEnabled = true;
		}
		this._decreaseBetBtn.alpha = 1;
		this._decreaseBetBtn.mouseEnabled = true;
		this.updateBetDisplay();
	}
	,splitHandReady: function() {
		this._gameState = co.doubleduck.GameState.PLAYER_RESPONSE_SPLIT;
		this.showInGameUI();
		this.showHand(true);
	}
	,splitHandFocused: function() {
		co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.splitHandReady));
		var newCard = this._deck.next();
		this._splitHand.addCard(newCard);
		this._table.addSplitCard(newCard,co.doubleduck.Session._locationId);
	}
	,mainHandBust: function() {
		this.removeCounter();
		this._table.clearMainHand();
		this._table.focusSplit(true);
		this._hand = null;
		co.doubleduck.Utils.waitAndCall(this,700,$bind(this,this.splitHandFocused));
	}
	,splitHandBust: function() {
		if(this._hand == null) co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.newGame)); else {
			this._table.clearSplitHand();
			this.removeCounter();
			co.doubleduck.Utils.waitAndCall(null,1000,$bind(this,this.showMainHand));
		}
	}
	,handleBust: function() {
		co.doubleduck.SoundManager.playEffect("sound/Lose");
		this.endCaption("bust");
		this.closeInGameUI();
		if(this._gameState == co.doubleduck.GameState.PLAYER_RESPONSE) {
			this._mainChipPack.toDealer();
			if(this._splitHand == null) co.doubleduck.Utils.waitAndCall(this,1500,$bind(this,this.newGame)); else co.doubleduck.Utils.waitAndCall(this,1500,$bind(this,this.mainHandBust));
		} else if(this._gameState == co.doubleduck.GameState.PLAYER_RESPONSE_SPLIT) {
			this._splitChipPack.toDealer();
			co.doubleduck.Utils.waitAndCall(this,1500,$bind(this,this.splitHandBust));
		}
	}
	,updateDealerSum: function(cards) {
		if(this._dealerSumDisplay != null) this.removeChild(this._dealerSumDisplay);
		this._dealerSumDisplay = this._font.getNumber(this._dealersHand.getCardSum(),1,true,null,2);
		this._dealerSumDisplay.scaleX = this._dealerSumDisplay.scaleY = co.doubleduck.BaseGame.getScale();
		this._dealerSumDisplay.x = this._dealerHandCounter.x + this._dealerHandCounter.image.width * 0.05 * co.doubleduck.BaseGame.getScale();
		this._dealerSumDisplay.y = this._dealerHandCounter.y;
		this.addChild(this._dealerSumDisplay);
	}
	,updateSum: function(splitHand) {
		if(splitHand == null) splitHand = false;
		if(this._sumDisplay != null) this.removeChild(this._sumDisplay);
		if(splitHand) this._sumDisplay = this._font.getNumber(this._splitHand.getCardSum(),1,true,null,2); else this._sumDisplay = this._font.getNumber(this._hand.getCardSum(),1,true,null,2);
		this._sumDisplay.scaleX = this._sumDisplay.scaleY = co.doubleduck.BaseGame.getScale();
		this._sumDisplay.x = this._handCounter.x - this._handCounter.image.width * 0.05 * co.doubleduck.BaseGame.getScale();
		this._sumDisplay.y = this._handCounter.y;
		this.addChild(this._sumDisplay);
	}
	,handleHitResult: function() {
		this._table.organizePlayerCards();
		if(this._gameState == co.doubleduck.GameState.PLAYER_RESPONSE) {
			this.updateSum();
			if(this._hand.getCardSum() > 21) this.handleBust(); else this._gameHud.mouseEnabled = true;
		} else if(this._gameState == co.doubleduck.GameState.PLAYER_RESPONSE_SPLIT) {
			this.updateSum(true);
			if(this._splitHand.getCardSum() > 21) this.handleBust(); else this._gameHud.mouseEnabled = true;
		}
	}
	,handleHitClick: function() {
		if(this._gameState != co.doubleduck.GameState.PLAYER_RESPONSE && this._gameState != co.doubleduck.GameState.PLAYER_RESPONSE_SPLIT) return;
		if(this._splitBtn != null) {
			this.removeChild(this._splitBtn);
			this._splitBtn = null;
		}
		if(this._insuranceBtn != null) {
			this.removeChild(this._insuranceBtn);
			this._insuranceBtn = null;
		}
		var newCard = this._deck.next();
		if(this._gameState == co.doubleduck.GameState.PLAYER_RESPONSE) {
			this._hand.addCard(newCard);
			this._table.addPlayerCard(newCard,co.doubleduck.Session._locationId);
		} else if(this._gameState == co.doubleduck.GameState.PLAYER_RESPONSE_SPLIT) {
			this._splitHand.addCard(newCard);
			this._table.addSplitCard(newCard,co.doubleduck.Session._locationId);
		}
		this._gameHud.mouseEnabled = false;
		co.doubleduck.Utils.waitAndCall(this,700,$bind(this,this.handleHitResult));
	}
	,dealerDraw: function() {
		var newCard = this._deck.next();
		this._dealersHand.addCard(newCard);
		this._table.addDealerCard(newCard,co.doubleduck.Session._locationId);
		co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.dealerLogic));
	}
	,handleVictory: function() {
		var money = co.doubleduck.Persistence.getPlayerMoney();
		var earned = 0;
		if(this._gameState == co.doubleduck.GameState.DEALER_RESPONSE_SPLIT) {
			money += this._splitBetAmount * 2;
			earned = Math.ceil(this._splitBetAmount * 2);
			this._splitChipPack.toPlayer();
			if(this._hand != null) {
				co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.checkMainHand));
				this.removeCounter();
			} else co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.newGame));
		} else if(this._gameState == co.doubleduck.GameState.DEALER_RESPONSE) {
			this._mainChipPack.toPlayer();
			money += this._mainBetAmount * 2;
			earned = Math.ceil(this._mainBetAmount * 2);
			co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.newGame));
		}
		co.doubleduck.Persistence.setPlayerMoney(money);
		this.updateMoney();
		this.doBurst(earned);
		this.endCaption("win");
	}
	,handleDefeat: function() {
		this.endCaption("lose");
		co.doubleduck.SoundManager.playEffect("sound/Lose");
		if(this._gameState == co.doubleduck.GameState.DEALER_RESPONSE_SPLIT) {
			if(this._hand != null) {
				co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.checkMainHand));
				this.removeCounter();
				this._splitChipPack.toDealer();
			} else co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.newGame));
		} else if(this._gameState == co.doubleduck.GameState.DEALER_RESPONSE) {
			this._mainChipPack.toDealer();
			co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.newGame));
		}
	}
	,showMainHand: function() {
		co.doubleduck.Utils.waitAndCall(null,800,$bind(this,this.showHand),[false]);
		this._table.focusMain(false);
		this._gameState = co.doubleduck.GameState.DEALER_RESPONSE;
		if(this._dealerHandCounter == null) co.doubleduck.Utils.waitAndCall(null,1500,$bind(this,this.dealerFlip)); else co.doubleduck.Utils.waitAndCall(null,1500,$bind(this,this.dealerLogic));
	}
	,checkMainHand: function() {
		this._table.clearSplitHand();
		co.doubleduck.Utils.waitAndCall(null,1500,$bind(this,this.showMainHand),[false]);
	}
	,handlePush: function() {
		var money = co.doubleduck.Persistence.getPlayerMoney();
		if(this._gameState == co.doubleduck.GameState.DEALER_RESPONSE_SPLIT) {
			money += this._splitBetAmount;
			this._splitChipPack.toPlayer();
			if(this._hand != null) {
				co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.checkMainHand));
				this.removeCounter();
			} else co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.newGame));
		} else if(this._gameState == co.doubleduck.GameState.DEALER_RESPONSE) {
			this._mainChipPack.toPlayer();
			money += this._mainBetAmount;
			co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.newGame));
		}
		co.doubleduck.Persistence.setPlayerMoney(money);
		this.updateMoney();
		co.doubleduck.SoundManager.playEffect("sound/draw");
		this.endCaption("push");
	}
	,handleInsurance: function(dealerBlackjack) {
		if(dealerBlackjack) {
			var money = co.doubleduck.Persistence.getPlayerMoney();
			money += this._insuranceAmount * 2;
			co.doubleduck.Persistence.setPlayerMoney(money);
			this.updateMoney();
			this._insuranceChipPack.toPlayer();
		} else this._insuranceChipPack.toDealer();
	}
	,dealerLogic: function() {
		var sum = this._dealersHand.getCardSum();
		var handCheck = this._hand;
		if(this._gameState == co.doubleduck.GameState.DEALER_RESPONSE_SPLIT) handCheck = this._splitHand;
		this.updateDealerSum(this._dealersHand.getCards());
		var playerBlackjack = handCheck.getCardSum() == 21 && handCheck.getCards().length == 2;
		var dealerBlackjack = this._dealersHand.getCards().length == 2 && sum == 21;
		if(playerBlackjack && !dealerBlackjack) this.handleBlackJack(); else if(dealerBlackjack && !playerBlackjack) this.handleDefeat(); else if(dealerBlackjack && playerBlackjack) this.handlePush(); else if(sum < 17 || sum == 17 && this._dealersHand.isSoft()) co.doubleduck.Utils.waitAndCall(this,500,$bind(this,this.dealerDraw)); else if(sum > 21) this.handleVictory(); else if(sum > handCheck.getCardSum()) this.handleDefeat(); else if(sum == handCheck.getCardSum()) this.handlePush(); else this.handleVictory();
		if(this._insuranceAmount > 0) this.handleInsurance(dealerBlackjack);
	}
	,dealerFlip: function() {
		this._table.get_dealerCards()[1].flip();
		co.doubleduck.Utils.waitAndCall(this,1000,$bind(this,this.dealerLogic));
		this._dealerHandCounter = co.doubleduck.Utils.getCenteredImage("images/session/counter.png",true);
		this._dealerHandCounter.scaleX *= -1;
		this._dealerHandCounter.x = this._table.get_dealerCards()[this._table.get_dealerCards().length - 1].x + this._table.get_playerCards()[this._table.get_dealerCards().length - 1].getWidth() * 0.65 * co.doubleduck.BaseGame.getScale();
		var dglobal = this._table.localToGlobal(this._table.get_dealerCards()[this._table.get_dealerCards().length - 1].x,this._table.get_dealerCards()[this._table.get_dealerCards().length - 1].y);
		this._dealerHandCounter.y = dglobal.y;
		this._dealerHandCounter.alpha = 0;
		createjs.Tween.get(this._dealerHandCounter).to({ alpha : 1},100);
		this.addChild(this._dealerHandCounter);
		this.updateDealerSum(this._dealersHand.getCards());
	}
	,handleStandClick: function() {
		if(this._splitBtn != null) {
			this.removeChild(this._splitBtn);
			this._splitBtn = null;
		}
		if(this._insuranceBtn != null) {
			this.removeChild(this._insuranceBtn);
			this._insuranceBtn = null;
		}
		if(this._gameState == co.doubleduck.GameState.PLAYER_RESPONSE) {
			if(this._splitHand != null) {
				this._table.focusSplit();
				co.doubleduck.Utils.waitAndCall(this,500,$bind(this,this.splitHandFocused));
				this.removeCounter();
				this.closeInGameUI();
			} else {
				co.doubleduck.Utils.waitAndCall(this,500,$bind(this,this.dealerFlip));
				this._gameState = co.doubleduck.GameState.DEALER_RESPONSE;
				this.closeInGameUI();
			}
		} else if(this._gameState == co.doubleduck.GameState.PLAYER_RESPONSE_SPLIT) {
			this._gameState = co.doubleduck.GameState.DEALER_RESPONSE_SPLIT;
			co.doubleduck.Utils.waitAndCall(this,500,$bind(this,this.dealerFlip));
			this.closeInGameUI();
		}
	}
	,handleDoubleResult: function() {
		if(this._gameState == co.doubleduck.GameState.PLAYER_RESPONSE) {
			this.updateSum();
			if(this._hand.getCardSum() > 21) this.handleBust(); else this.handleStandClick();
		} else if(this._gameState == co.doubleduck.GameState.PLAYER_RESPONSE_SPLIT) {
			this.updateSum(true);
			if(this._splitHand.getCardSum() > 21) this.handleBust(); else this.handleStandClick();
		}
	}
	,handleDoubleClick: function() {
		if(this._gameState != co.doubleduck.GameState.PLAYER_RESPONSE && this._gameState != co.doubleduck.GameState.PLAYER_RESPONSE_SPLIT) return;
		if(this._splitBtn != null) {
			this.removeChild(this._splitBtn);
			this._splitBtn = null;
		}
		if(this._insuranceBtn != null) {
			this.removeChild(this._insuranceBtn);
			this._insuranceBtn = null;
		}
		var money = co.doubleduck.Persistence.getPlayerMoney();
		if(this._gameState == co.doubleduck.GameState.PLAYER_RESPONSE) {
			money -= this._mainBetAmount;
			if(money >= 0) {
				var newCard = this._deck.next();
				this._hand.addCard(newCard);
				this._table.addPlayerCard(newCard,co.doubleduck.Session._locationId);
				this._mainChipPack.addBet(this._mainBetAmount);
				this._mainBetAmount *= 2;
			}
		} else if(this._gameState == co.doubleduck.GameState.PLAYER_RESPONSE_SPLIT) {
			money -= this._splitBetAmount;
			if(money >= 0) {
				var newCard = this._deck.next();
				this._splitHand.addCard(newCard);
				this._table.addSplitCard(newCard,co.doubleduck.Session._locationId);
				this._mainChipPack.addBet(this._splitBetAmount);
				this._splitBetAmount *= 2;
			}
		}
		if(money >= 0) {
			co.doubleduck.Persistence.setPlayerMoney(money);
			this.updateMoney();
			this.addXp(this._mainBetAmount / 2 | 0,this._doubleBtn.x,this._doubleBtn.y);
			this.closeInGameUI();
			co.doubleduck.Utils.waitAndCall(this,700,$bind(this,this.handleDoubleResult));
		} else {
		}
	}
	,handleGreyBet: function() {
		this.noFunds(this._betBtn.x - 75 * co.doubleduck.BaseGame.getScale(),this._betBtn.y - this._betBtn.image.height / 2 * co.doubleduck.BaseGame.getScale() - 30 * co.doubleduck.BaseGame.getScale());
	}
	,constructLevel: function() {
		var buttonSound = co.doubleduck.Session.BUTTON_SOUND;
		var clickType = co.doubleduck.Button.CLICK_TYPE_SCALE;
		var bgNum = co.doubleduck.Session._locationId;
		this._background = co.doubleduck.Utils.getCenteredImage("images/session/bgs/bg_" + bgNum + ".jpg",true);
		this._background.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._background.y = co.doubleduck.BaseGame.getViewport().height / 2;
		this.addChild(this._background);
		this._betHud = new createjs.Container();
		var hudBottom = co.doubleduck.Utils.getCenteredImage("images/session/hud_bottom.png",true);
		hudBottom.y = co.doubleduck.BaseGame.getViewport().height - hudBottom.image.height / 2 * co.doubleduck.BaseGame.getScale();
		hudBottom.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._betHud.addChild(hudBottom);
		this.addChild(this._betHud);
		var pxFix = 3.5 * co.doubleduck.BaseGame.getScale();
		var padding = 7 * co.doubleduck.BaseGame.getScale();
		this._decreaseBetBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/btn_minus.png"),true,clickType,buttonSound);
		this._decreaseBetBtn.regX = 0;
		this._decreaseBetBtn.regY = this._decreaseBetBtn.image.height / 2;
		this._decreaseBetBtn.x = co.doubleduck.BaseGame.getViewport().width * 0.05;
		this._decreaseBetBtn.y = hudBottom.y + pxFix;
		this._decreaseBetBtn.scaleX = this._decreaseBetBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this._decreaseBetBtn.onClick = $bind(this,this.handleBetDecrease);
		this._decreaseBetBtn.mouseEnabled = false;
		this._decreaseBetBtn.alpha = 0.5;
		this._betHud.addChild(this._decreaseBetBtn);
		this._betDisplay = co.doubleduck.BaseAssets.getImage("images/session/hud_bet_display.png");
		this._betDisplay.regY = this._betDisplay.image.height / 2;
		this._betDisplay.x = this._decreaseBetBtn.x + this._decreaseBetBtn.image.width * co.doubleduck.BaseGame.getScale() + padding;
		this._betDisplay.y = this._decreaseBetBtn.y;
		this._betDisplay.scaleX = this._betDisplay.scaleY = co.doubleduck.BaseGame.getScale();
		this._betHud.addChild(this._betDisplay);
		this._font = new co.doubleduck.FontHelper("images/general/font/");
		this.updateBetDisplay();
		this._increaseBetBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/btn_plus.png"),true,clickType,buttonSound);
		this._increaseBetBtn.regX = 0;
		this._increaseBetBtn.regY = this._increaseBetBtn.image.height / 2;
		this._increaseBetBtn.x = this._betDisplay.x + this._betDisplay.image.width * co.doubleduck.BaseGame.getScale() + padding;
		this._increaseBetBtn.y = hudBottom.y + pxFix;
		this._increaseBetBtn.scaleX = this._increaseBetBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this._increaseBetBtn.onClick = $bind(this,this.handleBetIncrease);
		this._betHud.addChild(this._increaseBetBtn);
		var enoughFunds = co.doubleduck.Persistence.getPlayerMoney() >= this._betMinimum;
		this._betBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/btn_bet.png"),true,clickType,buttonSound);
		this._betBtn.regY = this._betBtn.image.height;
		this._betBtn.scaleX = this._betBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this._betBtn.x = this._increaseBetBtn.x + this._increaseBetBtn.image.width * co.doubleduck.BaseGame.getScale() + 14 * co.doubleduck.BaseGame.getScale();
		this._betBtn.y = co.doubleduck.BaseGame.getViewport().height;
		this._betBtn.onClick = $bind(this,this.handleBetClick);
		this._betHud.addChild(this._betBtn);
		this._betHud.y = this._betBtn.image.height * co.doubleduck.BaseGame.getScale();
		this._betGreyBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/btn_bet_inactive.png"),true,clickType,buttonSound);
		this._betGreyBtn.regY = this._betGreyBtn.image.height;
		this._betGreyBtn.scaleX = this._betGreyBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this._betGreyBtn.x = this._increaseBetBtn.x + this._increaseBetBtn.image.width * co.doubleduck.BaseGame.getScale() + 14 * co.doubleduck.BaseGame.getScale();
		this._betGreyBtn.y = co.doubleduck.BaseGame.getViewport().height;
		this._betGreyBtn.onClick = $bind(this,this.handleGreyBet);
		this._betHud.addChild(this._betGreyBtn);
		this._gameHud = new createjs.Container();
		this.addChild(this._gameHud);
		var bottom = co.doubleduck.Utils.getCenteredImage("images/session/hud_bottom.png",true);
		bottom.y = co.doubleduck.BaseGame.getViewport().height - bottom.image.height / 2 * co.doubleduck.BaseGame.getScale();
		bottom.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._gameHud.addChild(bottom);
		this._hitBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/btn_hit.png"),true,clickType,buttonSound);
		this._hitBtn.regY = this._hitBtn.image.height;
		this._hitBtn.regX = this._hitBtn.image.width / 2;
		this._hitBtn.y = co.doubleduck.BaseGame.getViewport().height;
		this._hitBtn.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._hitBtn.onClick = $bind(this,this.handleHitClick);
		this._hitBtn.scaleX = this._hitBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this._gameHud.addChild(this._hitBtn);
		this._gameHud.y = this._hitBtn.image.height * co.doubleduck.BaseGame.getScale();
		this._doubleBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/btn_double.png"),true,clickType,buttonSound);
		co.doubleduck.Utils.setCenterReg(this._doubleBtn);
		this._doubleBtn.y = bottom.y + pxFix;
		this._doubleBtn.x = this._hitBtn.x - this._hitBtn.image.width / 2 * co.doubleduck.BaseGame.getScale() - (this._doubleBtn.image.width / 2 + 5) * co.doubleduck.BaseGame.getScale();
		this._doubleBtn.scaleX = this._doubleBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this._doubleBtn.onClick = $bind(this,this.handleDoubleClick);
		this._gameHud.addChild(this._doubleBtn);
		this._standBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/btn_stand.png"),true,clickType,buttonSound);
		co.doubleduck.Utils.setCenterReg(this._standBtn);
		this._standBtn.y = bottom.y + pxFix;
		this._standBtn.x = this._hitBtn.x + this._hitBtn.image.width / 2 * co.doubleduck.BaseGame.getScale() + (this._standBtn.image.width / 2 + 5) * co.doubleduck.BaseGame.getScale();
		this._standBtn.scaleX = this._standBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this._standBtn.onClick = $bind(this,this.handleStandClick);
		this._gameHud.addChild(this._standBtn);
		this._dropper = new co.doubleduck.Dropper();
		this.addChild(this._dropper);
	}
	,handleStayClicked: function() {
		co.doubleduck.BaseGame.getStage().removeChild(this._stayBtn);
		co.doubleduck.BaseGame.getStage().removeChild(this._leaveBtn);
		co.doubleduck.BaseGame.getStage().removeChild(this._exitAlert);
		this._exitAlert = null;
		this._stayBtn = null;
		this._leaveBtn = null;
		this.mouseEnabled = true;
	}
	,handleLeaveClicked: function() {
		co.doubleduck.BaseGame.getStage().removeChild(this._stayBtn);
		co.doubleduck.BaseGame.getStage().removeChild(this._leaveBtn);
		co.doubleduck.BaseGame.getStage().removeChild(this._exitAlert);
		this._gameState = co.doubleduck.GameState.NONE;
		this.handleLobbyClicked();
	}
	,showExitAlert: function() {
		if(this._exitAlert != null) return;
		this.mouseEnabled = false;
		this._exitAlert = co.doubleduck.Utils.getCenteredImage("images/session/exit_alert.png");
		this._exitAlert.scaleX = this._exitAlert.scaleY = co.doubleduck.BaseGame.getScale();
		this._exitAlert.x = co.doubleduck.BaseGame.getViewport().width / 2;
		this._exitAlert.y = co.doubleduck.BaseGame.getViewport().height / 2;
		co.doubleduck.BaseGame.getStage().addChild(this._exitAlert);
		this._stayBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/btn_stay.png"),true,3,"sound/button_click");
		this._stayBtn.scaleX = this._stayBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this._stayBtn.y = this._exitAlert.y + this._exitAlert.image.height * 0.20 * co.doubleduck.BaseGame.getScale();
		this._stayBtn.onClick = $bind(this,this.handleStayClicked);
		co.doubleduck.BaseGame.getStage().addChild(this._stayBtn);
		this._stayBtn.x = this._exitAlert.x - this._exitAlert.image.width * 0.41 * co.doubleduck.BaseGame.getScale();
		this._leaveBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/btn_leave.png"),true,3,"sound/button_click");
		this._leaveBtn.scaleX = this._leaveBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this._leaveBtn.y = this._stayBtn.y;
		this._leaveBtn.x = this._exitAlert.x + this._exitAlert.image.width * 0.03 * co.doubleduck.BaseGame.getScale();
		co.doubleduck.BaseGame.getStage().addChild(this._leaveBtn);
		this._leaveBtn.onClick = $bind(this,this.handleLeaveClicked);
	}
	,handleLobbyClicked: function() {
		if(this.onBackToMenu != null) {
			if(this._gameState != co.doubleduck.GameState.NONE) {
				this.showExitAlert();
				return;
			}
			this.removeChild(this._transition);
			this.addChild(this._transition);
			this._transition.visible = true;
			this._transition.animate().call(this.onBackToMenu);
			
      // we add the offer when user finished a session
      window.InAppOffer && new window.InAppOffer({'delay': 1500});
		}
	}
	,updateBetDisplay: function() {
		if(this._betAmountDisplay != null) {
			this._betHud.removeChild(this._betAmountDisplay);
			this._betAmountDisplay = null;
		}
		if(this._dollarSign != null) {
			this._betHud.removeChild(this._dollarSign);
			this._dollarSign = null;
		}
		var dims = new createjs.Rectangle(0,0,0,0);
		this._betAmountDisplay = this._font.getNumber(this._lastBetAmount,1,true,dims,2);
		this._betAmountDisplay.scaleX = this._betAmountDisplay.scaleY = co.doubleduck.BaseGame.getScale();
		this._betAmountDisplay.x = this._betDisplay.x + this._betDisplay.image.width / 2 * co.doubleduck.BaseGame.getScale();
		this._betAmountDisplay.y = this._betDisplay.y;
		this._betHud.addChild(this._betAmountDisplay);
		this._dollarSign = co.doubleduck.BaseAssets.getImage("images/general/font/dollar.png");
		this._dollarSign.scaleX = this._dollarSign.scaleY = co.doubleduck.BaseGame.getScale();
		this._dollarSign.regY = this._dollarSign.image.height / 2;
		this._dollarSign.x = this._betAmountDisplay.x - dims.width / 2 * co.doubleduck.BaseGame.getScale();
		this._dollarSign.y = this._betAmountDisplay.y;
		this._dollarSign.x -= (this._dollarSign.image.width / 2 + 2.5) * co.doubleduck.BaseGame.getScale();
		this._betAmountDisplay.x += (this._dollarSign.image.width / 2 + 2.5) * co.doubleduck.BaseGame.getScale();
		this._betHud.addChild(this._dollarSign);
		this._dollarSign.x = this._dollarSign.x | 0;
		this._dollarSign.y = this._dollarSign.y | 0;
	}
	,updateMoney: function() {
		if(this._moneyDisplay != null) {
			this._scoreContainer.removeChild(this._moneyDisplay);
			this._moneyDisplay = null;
		}
		if(this._topDollar != null) {
			this._scoreContainer.removeChild(this._topDollar);
			this._topDollar = null;
		}
		var dims = new createjs.Rectangle(0,0,0,0);
		this._moneyDisplay = this._font.getNumber(co.doubleduck.Persistence.getPlayerMoney(),1,true,dims,2);
		this._moneyDisplay.scaleX = this._moneyDisplay.scaleY = co.doubleduck.BaseGame.getScale();
		this._moneyDisplay.x = this._scoreBar.x - this._scoreBar.image.width / 2 * co.doubleduck.BaseGame.getScale();
		this._moneyDisplay.y = this._scoreBar.y + this._scoreBar.image.height * 0.33 * co.doubleduck.BaseGame.getScale();
		this._scoreContainer.addChild(this._moneyDisplay);
		this._topDollar = co.doubleduck.BaseAssets.getImage("images/general/font/dollar.png");
		this._topDollar.scaleX = this._topDollar.scaleY = co.doubleduck.BaseGame.getScale();
		this._topDollar.regY = this._topDollar.image.height / 2;
		this._topDollar.x = this._moneyDisplay.x - dims.width / 2 * co.doubleduck.BaseGame.getScale();
		this._topDollar.y = this._moneyDisplay.y;
		this._topDollar.x -= (this._topDollar.image.width / 2 + 2.5) * co.doubleduck.BaseGame.getScale();
		this._moneyDisplay.x += (this._topDollar.image.width / 2 + 2.5) * co.doubleduck.BaseGame.getScale();
		this._scoreContainer.addChild(this._topDollar);
	}
	,addHud: function() {
		this._lobbyBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/btn_lobby.png"),true,2,co.doubleduck.Session.BUTTON_SOUND);
		this._lobbyBtn.x = co.doubleduck.BaseGame.getViewport().width * 0.03;
		this._lobbyBtn.y = co.doubleduck.BaseGame.getViewport().height * 0.03;
		this._lobbyBtn.scaleX = this._lobbyBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this.addChild(this._lobbyBtn);
		this._lobbyBtn.onClick = $bind(this,this.handleLobbyClicked);
		this._scoreBar = co.doubleduck.BaseAssets.getImage("images/session/score.png");
		this._scoreBar.scaleX = this._scoreBar.scaleY = co.doubleduck.BaseGame.getScale();
		this._scoreBar.regX = this._scoreBar.image.width;
		this._scoreBar.y = this._lobbyBtn.y;
		this._scoreBar.x = co.doubleduck.BaseGame.getViewport().width * 0.97;
		this._reputationBarFill = co.doubleduck.BaseAssets.getImage("images/session/rep_bar.png");
		this._reputationBarFill.scaleX = this._reputationBarFill.scaleY = co.doubleduck.BaseGame.getScale();
		this._reputationBarFill.regX = this._reputationBarFill.image.width;
		this._reputationBarFill.x = this._scoreBar.x;
		this._reputationBarFill.y = this._scoreBar.y;
		this._reputationBarMask = new createjs.Shape();
		this._reputationBarMask.graphics.beginFill("#000000");
		this._reputationBarMask.alpha = 0.5;
		this._reputationBarMask.graphics.drawRect(0,0,this._reputationBarFill.image.width * 0.95,this._reputationBarFill.image.height);
		this._reputationBarMask.graphics.endFill();
		this._reputationBarMask.scaleX = this._reputationBarMask.scaleY = co.doubleduck.BaseGame.getScale();
		this._reputationBarMask.x = this._reputationBarFill.x - this._reputationBarFill.image.width * 0.95 * co.doubleduck.BaseGame.getScale();
		this._reputationBarMask.y = this._reputationBarFill.y;
		this._reputationBarFill.mask = this._reputationBarMask;
		this._reputationBarMask.scaleX = 0.01;
		this.updateRep(false,false);
		this._scoreContainer = new createjs.Container();
		this._scoreContainer.addChild(this._scoreBar);
		this._scoreContainer.addChild(this._reputationBarFill);
		this.addChild(this._scoreContainer);
		this.updateMoney();
	}
	,animationEnded: function() {
		this._transition.visible = false;
	}
	,noFunds: function(x,y) {
		if(this._notEnoughFunds == null) {
			this._notEnoughFunds = co.doubleduck.Utils.getCenteredImage("images/session/no_funds.png",true);
			this._notEnoughFunds.regY = this._notEnoughFunds.image.height;
			this._notEnoughFunds.alpha = 0;
			this.addChild(this._notEnoughFunds);
		}
		this._notEnoughFunds.x = x;
		this._notEnoughFunds.y = y;
		if(this._notEnoughFunds.alpha != 0) return;
		createjs.Tween.get(this._notEnoughFunds).to({ alpha : 1},500).wait(1500).to({ alpha : 0},500);
	}
	,checkBankrupcty: function() {
		if(co.doubleduck.Session.isBankrupt()) {
			this._bankrupt.visible = true;
			this._placeBet.alpha = 0;
			this._bankrupt.alpha = 0;
			createjs.Tween.get(this._bankrupt).wait(1500).to({ alpha : 1},500,createjs.Ease.sineOut);
			this._backToLobbyBtn.visible = true;
			this._backToLobbyBtn.alpha = 0;
			createjs.Tween.get(this._backToLobbyBtn).wait(2200).to({ alpha : 1},500,createjs.Ease.sineOut);
		} else {
			this._bankrupt.visible = false;
			this._placeBet.visible = true;
			this._placeBet.alpha = 0;
			co.doubleduck.Utils.waitAndCall(null,1000,$bind(this,this.showBetUI));
		}
	}
	,_ambienceSound: null
	,_scoreContainer: null
	,_transition: null
	,_dropper: null
	,_casinoData: null
	,_gameState: null
	,_topDollar: null
	,_moneyDisplay: null
	,_scoreBar: null
	,_lobbyBtn: null
	,_reputationBarMask: null
	,_reputationBarFill: null
	,_currCaption: null
	,_insuranceChipPack: null
	,_splitChipPack: null
	,_mainChipPack: null
	,_dealerSumDisplay: null
	,_dealerHandCounter: null
	,_sumDisplay: null
	,_handCounter: null
	,_insuranceBtn: null
	,_splitBtn: null
	,_backToLobbyBtn: null
	,_bankrupt: null
	,_notEnoughFunds: null
	,_placeBet: null
	,_betGreyBtn: null
	,_betBtn: null
	,_betDisplay: null
	,_betAmountDisplay: null
	,_dollarSign: null
	,_decreaseBetBtn: null
	,_increaseBetBtn: null
	,_betHud: null
	,_stayBtn: null
	,_leaveBtn: null
	,_exitAlert: null
	,_doubleBtn: null
	,_standBtn: null
	,_hitBtn: null
	,_gameHud: null
	,_dealersHand: null
	,_betInterval: null
	,_betMaximum: null
	,_betMinimum: null
	,_insuranceAmount: null
	,_splitBetAmount: null
	,_lastBetAmount: null
	,_mainBetAmount: null
	,_splitHand: null
	,_hand: null
	,_font: null
	,_background: null
	,_table: null
	,_deck: null
	,__class__: co.doubleduck.Session
});
co.doubleduck.GameState = $hxClasses["co.doubleduck.GameState"] = { __ename__ : ["co","doubleduck","GameState"], __constructs__ : ["NONE","PLAYER_BET","PLAYER_BET_TRANSITION","GAME_STARTED","PLAYER_RESPONSE","PLAYER_RESPONSE_SPLIT","DEALER_RESPONSE","DEALER_RESPONSE_SPLIT","GAME_ENDED"] }
co.doubleduck.GameState.NONE = ["NONE",0];
co.doubleduck.GameState.NONE.toString = $estr;
co.doubleduck.GameState.NONE.__enum__ = co.doubleduck.GameState;
co.doubleduck.GameState.PLAYER_BET = ["PLAYER_BET",1];
co.doubleduck.GameState.PLAYER_BET.toString = $estr;
co.doubleduck.GameState.PLAYER_BET.__enum__ = co.doubleduck.GameState;
co.doubleduck.GameState.PLAYER_BET_TRANSITION = ["PLAYER_BET_TRANSITION",2];
co.doubleduck.GameState.PLAYER_BET_TRANSITION.toString = $estr;
co.doubleduck.GameState.PLAYER_BET_TRANSITION.__enum__ = co.doubleduck.GameState;
co.doubleduck.GameState.GAME_STARTED = ["GAME_STARTED",3];
co.doubleduck.GameState.GAME_STARTED.toString = $estr;
co.doubleduck.GameState.GAME_STARTED.__enum__ = co.doubleduck.GameState;
co.doubleduck.GameState.PLAYER_RESPONSE = ["PLAYER_RESPONSE",4];
co.doubleduck.GameState.PLAYER_RESPONSE.toString = $estr;
co.doubleduck.GameState.PLAYER_RESPONSE.__enum__ = co.doubleduck.GameState;
co.doubleduck.GameState.PLAYER_RESPONSE_SPLIT = ["PLAYER_RESPONSE_SPLIT",5];
co.doubleduck.GameState.PLAYER_RESPONSE_SPLIT.toString = $estr;
co.doubleduck.GameState.PLAYER_RESPONSE_SPLIT.__enum__ = co.doubleduck.GameState;
co.doubleduck.GameState.DEALER_RESPONSE = ["DEALER_RESPONSE",6];
co.doubleduck.GameState.DEALER_RESPONSE.toString = $estr;
co.doubleduck.GameState.DEALER_RESPONSE.__enum__ = co.doubleduck.GameState;
co.doubleduck.GameState.DEALER_RESPONSE_SPLIT = ["DEALER_RESPONSE_SPLIT",7];
co.doubleduck.GameState.DEALER_RESPONSE_SPLIT.toString = $estr;
co.doubleduck.GameState.DEALER_RESPONSE_SPLIT.__enum__ = co.doubleduck.GameState;
co.doubleduck.GameState.GAME_ENDED = ["GAME_ENDED",8];
co.doubleduck.GameState.GAME_ENDED.toString = $estr;
co.doubleduck.GameState.GAME_ENDED.__enum__ = co.doubleduck.GameState;
co.doubleduck.SoundType = $hxClasses["co.doubleduck.SoundType"] = { __ename__ : ["co","doubleduck","SoundType"], __constructs__ : ["WEB_AUDIO","AUDIO_FX","AUDIO_NO_OVERLAP","HOWLER","NONE"] }
co.doubleduck.SoundType.WEB_AUDIO = ["WEB_AUDIO",0];
co.doubleduck.SoundType.WEB_AUDIO.toString = $estr;
co.doubleduck.SoundType.WEB_AUDIO.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_FX = ["AUDIO_FX",1];
co.doubleduck.SoundType.AUDIO_FX.toString = $estr;
co.doubleduck.SoundType.AUDIO_FX.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP = ["AUDIO_NO_OVERLAP",2];
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.toString = $estr;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.HOWLER = ["HOWLER",3];
co.doubleduck.SoundType.HOWLER.toString = $estr;
co.doubleduck.SoundType.HOWLER.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.NONE = ["NONE",4];
co.doubleduck.SoundType.NONE.toString = $estr;
co.doubleduck.SoundType.NONE.__enum__ = co.doubleduck.SoundType;
if(!co.doubleduck.audio) co.doubleduck.audio = {}
co.doubleduck.audio.AudioAPI = $hxClasses["co.doubleduck.audio.AudioAPI"] = function() { }
co.doubleduck.audio.AudioAPI.__name__ = ["co","doubleduck","audio","AudioAPI"];
co.doubleduck.audio.AudioAPI.prototype = {
	setVolume: null
	,pause: null
	,stop: null
	,playMusic: null
	,playEffect: null
	,init: null
	,__class__: co.doubleduck.audio.AudioAPI
}
co.doubleduck.audio.WebAudioAPI = $hxClasses["co.doubleduck.audio.WebAudioAPI"] = function(src) {
	this._src = src;
	this.loadAudioFile(this._src);
};
co.doubleduck.audio.WebAudioAPI.__name__ = ["co","doubleduck","audio","WebAudioAPI"];
co.doubleduck.audio.WebAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.WebAudioAPI.context = null;
co.doubleduck.audio.WebAudioAPI.webAudioInit = function() {
	co.doubleduck.audio.WebAudioAPI.context = new webkitAudioContext();
}
co.doubleduck.audio.WebAudioAPI.saveBuffer = function(buffer,name) {
	co.doubleduck.audio.WebAudioAPI._buffers[name] = buffer;
}
co.doubleduck.audio.WebAudioAPI.decodeError = function() {
	null;
}
co.doubleduck.audio.WebAudioAPI.prototype = {
	setVolume: function(volume) {
		if(this._gainNode != null) this._gainNode.gain.value = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._source != null) this._source.noteOff(0);
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playBuffer: function(name,loop) {
		if(loop == null) loop = false;
		if(this._gainNode == null) {
			this._gainNode = co.doubleduck.audio.WebAudioAPI.context.createGainNode();
			this._gainNode.connect(co.doubleduck.audio.WebAudioAPI.context.destination);
		}
		this._buffer = Reflect.getProperty(co.doubleduck.audio.WebAudioAPI._buffers,this._src);
		if(this._buffer == null) return;
		this._source = co.doubleduck.audio.WebAudioAPI.context.createBufferSource();
		this._source.buffer = this._buffer;
		this._source.loop = loop;
		this._source.connect(this._gainNode);
		this._source.noteOn(0);
	}
	,loadAudioFile: function(src) {
		var request = new XMLHttpRequest();
		request.open("get",src,true);
		request.responseType = "arraybuffer";
		request.onload = function() { co.doubleduck.audio.WebAudioAPI.context.decodeAudioData(request.response, function(decodedBuffer) { buffer = decodedBuffer; co.doubleduck.audio.WebAudioAPI.saveBuffer(buffer,src); }, co.doubleduck.audio.WebAudioAPI.decodeError) }
		request.send();
	}
	,init: function() {
	}
	,_source: null
	,_gainNode: null
	,_buffer: null
	,_src: null
	,__class__: co.doubleduck.audio.WebAudioAPI
}
co.doubleduck.SoundManager = $hxClasses["co.doubleduck.SoundManager"] = function() {
};
co.doubleduck.SoundManager.__name__ = ["co","doubleduck","SoundManager"];
co.doubleduck.SoundManager.engineType = null;
co.doubleduck.SoundManager.EXTENSION = null;
co.doubleduck.SoundManager.getPersistedMute = function() {
	var mute = co.doubleduck.BasePersistence.getValue("mute");
	if(mute == "0") {
		mute = "false";
		co.doubleduck.SoundManager.setPersistedMute(false);
	}
	return mute == "true";
}
co.doubleduck.SoundManager.setPersistedMute = function(mute) {
	var val = "true";
	if(!mute) val = "false";
	co.doubleduck.BasePersistence.setValue("mute",val);
}
co.doubleduck.SoundManager.isSoundAvailable = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	var isChrome = /Chrome/.test(navigator.userAgent);
	var isMobile = /Mobile/.test(navigator.userAgent);
	var isAndroid = /Android/.test(navigator.userAgent);
	var isAndroid4 = /Android 4/.test(navigator.userAgent);
	var isSafari = /Safari/.test(navigator.userAgent);
	var agent = navigator.userAgent;
	var reg = new EReg("iPhone OS 6","");
	var isIOS6 = reg.match(agent) && isSafari && isMobile;
	var isIpad = /iPad/.test(navigator.userAgent);
	isIpad = isIpad && /OS 6/.test(navigator.userAgent);
	isIOS6 = isIOS6 || isIpad;
	if(isFirefox) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_FX;
		co.doubleduck.SoundManager.EXTENSION = ".ogg";
		return true;
	}
	if(isChrome && (!isAndroid && !isMobile)) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	if(isIOS6) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	} else if(isAndroid4 && !isChrome) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_NO_OVERLAP;
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.NONE;
	co.doubleduck.BasePersistence.initVar("mute");
	return false;
}
co.doubleduck.SoundManager.mute = function(persisted) {
	if(persisted == null) persisted = true;
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = true;
	var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
	while(_g1 < _g) {
		var currSound = _g1++;
		var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
		if(mySound != null) mySound.setVolume(0);
	}
	if(persisted) co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.unmute = function(persisted) {
	if(persisted == null) persisted = true;
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = false;
	try {
		var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
		while(_g1 < _g) {
			var currSound = _g1++;
			var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
			if(mySound != null) mySound.setVolume(1);
		}
	} catch( e ) {
		null;
	}
	if(persisted) co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.toggleMute = function() {
	if(co.doubleduck.SoundManager._muted) co.doubleduck.SoundManager.unmute(); else co.doubleduck.SoundManager.mute();
}
co.doubleduck.SoundManager.isMuted = function() {
	co.doubleduck.SoundManager._muted = co.doubleduck.SoundManager.getPersistedMute();
	return co.doubleduck.SoundManager._muted;
}
co.doubleduck.SoundManager.getAudioInstance = function(src) {
	if(!co.doubleduck.SoundManager.available) return new co.doubleduck.audio.DummyAudioAPI();
	src += co.doubleduck.SoundManager.EXTENSION;
	var audio = Reflect.getProperty(co.doubleduck.SoundManager._cache,src);
	if(audio == null) {
		switch( (co.doubleduck.SoundManager.engineType)[1] ) {
		case 1:
			audio = new co.doubleduck.audio.AudioFX(src);
			break;
		case 0:
			audio = new co.doubleduck.audio.WebAudioAPI(src);
			break;
		case 2:
			audio = new co.doubleduck.audio.NonOverlappingAudio(src);
			break;
		case 3:
			audio = new co.doubleduck.audio.HowlerAudio(src);
			break;
		case 4:
			return new co.doubleduck.audio.DummyAudioAPI();
		}
		Reflect.setProperty(co.doubleduck.SoundManager._cache,src,audio);
	}
	return audio;
}
co.doubleduck.SoundManager.playEffect = function(src,volume,optional) {
	if(optional == null) optional = false;
	if(volume == null) volume = 1;
	if(optional && co.doubleduck.SoundManager.engineType == co.doubleduck.SoundType.AUDIO_NO_OVERLAP) return new co.doubleduck.audio.DummyAudioAPI();
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playEffect(playVolume);
	return audio;
}
co.doubleduck.SoundManager.playMusic = function(src,volume,loop) {
	if(loop == null) loop = true;
	if(volume == null) volume = 1;
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playMusic(playVolume,loop);
	return audio;
}
co.doubleduck.SoundManager.initSound = function(src) {
	co.doubleduck.SoundManager.getAudioInstance(src);
}
co.doubleduck.SoundManager.prototype = {
	__class__: co.doubleduck.SoundManager
}
co.doubleduck.TransitionAnim = $hxClasses["co.doubleduck.TransitionAnim"] = function(isIn) {
	createjs.Container.call(this);
	this._isInside = isIn;
	this._cardLeft = co.doubleduck.BaseAssets.getImage("images/general/transition_card_1.png");
	this._cardLeft.scaleX = this._cardLeft.scaleY = co.doubleduck.BaseGame.getScale();
	this._cardLeft.regX = this._cardLeft.image.width / 2;
	this._cardLeft.regY = this._cardLeft.image.height / 2;
	this._cardLeft.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this._cardRight = co.doubleduck.BaseAssets.getImage("images/general/transition_card_2.png");
	this._cardRight.scaleX = this._cardRight.scaleY = co.doubleduck.BaseGame.getScale();
	this._cardRight.regX = this._cardRight.image.width / 2;
	this._cardRight.regY = this._cardRight.image.height / 2;
	this._cardRight.y = co.doubleduck.BaseGame.getViewport().height / 2;
	var offset = co.doubleduck.TransitionAnim.OUT_OFFSET;
	var angle = co.doubleduck.TransitionAnim.OUT_ANGLE;
	if(this._isInside) {
		offset = co.doubleduck.TransitionAnim.IN_OFFSET;
		angle = co.doubleduck.TransitionAnim.IN_ANGLE;
	}
	this._cardLeft.x = co.doubleduck.BaseGame.getViewport().width * offset;
	this._cardLeft.rotation = angle;
	this._cardRight.x = co.doubleduck.BaseGame.getViewport().width - co.doubleduck.BaseGame.getViewport().width * offset;
	this._cardRight.rotation = -angle;
	this.addChild(this._cardLeft);
	this.addChild(this._cardRight);
};
co.doubleduck.TransitionAnim.__name__ = ["co","doubleduck","TransitionAnim"];
co.doubleduck.TransitionAnim.__super__ = createjs.Container;
co.doubleduck.TransitionAnim.prototype = $extend(createjs.Container.prototype,{
	animate: function() {
		var targetOffset = co.doubleduck.TransitionAnim.IN_OFFSET;
		var targetAngle = co.doubleduck.TransitionAnim.IN_ANGLE;
		if(this._isInside) {
			targetOffset = co.doubleduck.TransitionAnim.OUT_OFFSET;
			targetAngle = co.doubleduck.TransitionAnim.OUT_ANGLE;
		}
		var tween = null;
		tween = createjs.Tween.get(this._cardLeft).to({ x : co.doubleduck.BaseGame.getViewport().width * targetOffset, rotation : targetAngle},co.doubleduck.TransitionAnim.ANIM_TIME,createjs.Ease.sineInOut);
		createjs.Tween.get(this._cardRight).to({ x : co.doubleduck.BaseGame.getViewport().width - co.doubleduck.BaseGame.getViewport().width * targetOffset, rotation : -targetAngle},co.doubleduck.TransitionAnim.ANIM_TIME,createjs.Ease.sineInOut);
		this._isInside = !this._isInside;
		return tween;
	}
	,_isInside: null
	,_cardLeft: null
	,_cardRight: null
	,__class__: co.doubleduck.TransitionAnim
});
co.doubleduck.Utils = $hxClasses["co.doubleduck.Utils"] = function() { }
co.doubleduck.Utils.__name__ = ["co","doubleduck","Utils"];
co.doubleduck.Utils.dateDeltaInDays = function(day1,day2) {
	var delta = Math.abs(day2.getTime() - day1.getTime());
	return delta / 86400000;
}
co.doubleduck.Utils.getTodayDate = function() {
	var newDate = new Date();
	return HxOverrides.dateStr(newDate);
}
co.doubleduck.Utils.getHour = function() {
	var newDate = new Date();
	return newDate.getHours();
}
co.doubleduck.Utils.rectOverlap = function(r1,r2) {
	var r1TopLeft = new createjs.Point(r1.x,r1.y);
	var r1BottomRight = new createjs.Point(r1.x + r1.width,r1.y + r1.height);
	var r1TopRight = new createjs.Point(r1.x + r1.width,r1.y);
	var r1BottomLeft = new createjs.Point(r1.x,r1.y + r1.height);
	var r2TopLeft = new createjs.Point(r2.x,r2.y);
	var r2BottomRight = new createjs.Point(r2.x + r2.width,r2.y + r2.height);
	var r2TopRight = new createjs.Point(r2.x + r2.width,r2.y);
	var r2BottomLeft = new createjs.Point(r2.x,r2.y + r2.height);
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1BottomLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2BottomLeft)) return true;
	return false;
}
co.doubleduck.Utils.overlap = function(obj1,obj1Width,obj1Height,obj2,obj2Width,obj2Height) {
	var o1TopLeft = new createjs.Point(obj1.x - obj1.regX * co.doubleduck.BaseGame.getScale(),obj1.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1BottomRight = new createjs.Point(o1TopLeft.x - obj1.regX * co.doubleduck.BaseGame.getScale() + obj1Width * co.doubleduck.BaseGame.getScale(),o1TopLeft.y + obj1Height * co.doubleduck.BaseGame.getScale() - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1TopRight = new createjs.Point(o1BottomRight.x - obj1.regX * co.doubleduck.BaseGame.getScale(),o1TopLeft.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1BottomLeft = new createjs.Point(o1TopLeft.x - obj1.regX * co.doubleduck.BaseGame.getScale(),o1BottomRight.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o2TopLeft = new createjs.Point(obj2.x - obj2.regX * co.doubleduck.BaseGame.getScale(),obj2.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2BottomRight = new createjs.Point(o2TopLeft.x + obj2Width * co.doubleduck.BaseGame.getScale() - obj2.regX * co.doubleduck.BaseGame.getScale(),o2TopLeft.y + obj2Height * co.doubleduck.BaseGame.getScale() - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2TopRight = new createjs.Point(o2BottomRight.x - obj2.regX * co.doubleduck.BaseGame.getScale(),o2TopLeft.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2BottomLeft = new createjs.Point(o2TopLeft.x - obj2.regX * co.doubleduck.BaseGame.getScale(),o2BottomRight.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1BottomLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2BottomLeft)) return true;
	return false;
}
co.doubleduck.Utils.rectContainPoint = function(rectTopLeft,rectBottomRight,point) {
	return point.x >= rectTopLeft.x && point.x <= rectBottomRight.x && point.y >= rectTopLeft.y && point.y <= rectBottomRight.y;
}
co.doubleduck.Utils.objectContains = function(dyn,memberName) {
	return Reflect.hasField(dyn,memberName);
}
co.doubleduck.Utils.contains = function(arr,obj) {
	var _g = 0;
	while(_g < arr.length) {
		var element = arr[_g];
		++_g;
		if(element == obj) return true;
	}
	return false;
}
co.doubleduck.Utils.isMobileFirefox = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	return isFirefox && viewporter.ACTIVE;
}
co.doubleduck.Utils.get = function(x,y,tiles,columns) {
	return tiles[columns * y + x];
}
co.doubleduck.Utils.getBitmapLabel = function(label,fontType,padding) {
	if(padding == null) padding = 0;
	if(fontType == null) fontType = "";
	var fontHelper = new co.doubleduck.FontHelper(fontType);
	var bitmapText = fontHelper.getNumber(Std.parseInt(label),1,true,null,padding);
	return bitmapText;
}
co.doubleduck.Utils.concatWithoutDuplicates = function(array,otherArray) {
	var _g = 0;
	while(_g < otherArray.length) {
		var element = otherArray[_g];
		++_g;
		co.doubleduck.Utils.addToArrayWithoutDuplicates(array,element);
	}
	return array;
}
co.doubleduck.Utils.addToArrayWithoutDuplicates = function(array,element) {
	var _g = 0;
	while(_g < array.length) {
		var currElement = array[_g];
		++_g;
		if(currElement == element) return array;
	}
	array.push(element);
	return array;
}
co.doubleduck.Utils.getImageData = function(image) {
	var ctx = co.doubleduck.Utils.getCanvasContext();
	var img = co.doubleduck.BaseAssets.getImage(image);
	ctx.drawImage(img.image,0,0);
	return ctx.getImageData(0,0,img.image.width,img.image.height);
}
co.doubleduck.Utils.getCanvasContext = function() {
	var dom = js.Lib.document.createElement("Canvas");
	var canvas = dom;
	return canvas.getContext("2d");
}
co.doubleduck.Utils.joinArrays = function(a1,a2) {
	var arr = a1.slice();
	var _g = 0;
	while(_g < a2.length) {
		var el = a2[_g];
		++_g;
		arr.push(el);
	}
	return arr;
}
co.doubleduck.Utils.getRandomElement = function(arr) {
	return arr[Std.random(arr.length)];
}
co.doubleduck.Utils.splitArray = function(arr,parts) {
	var arrs = new Array();
	var _g = 0;
	while(_g < parts) {
		var p = _g++;
		arrs.push(new Array());
	}
	var currArr = 0;
	while(arr.length > 0) {
		arrs[currArr].push(arr.pop());
		currArr++;
		currArr %= parts;
	}
	return arrs;
}
co.doubleduck.Utils.map = function(value,aMin,aMax,bMin,bMax) {
	if(bMax == null) bMax = 1;
	if(bMin == null) bMin = 0;
	if(value <= aMin) return bMin;
	if(value >= aMax) return bMax;
	return (value - aMin) * (bMax - bMin) / (aMax - aMin) + bMin;
}
co.doubleduck.Utils.waitAndCall = function(parent,delay,func,args) {
	createjs.Tween.get(parent).wait(delay).call(func,args);
}
co.doubleduck.Utils.tintBitmap = function(src,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier) {
	var colorFilter = new createjs.ColorFilter(redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier);
	src.cache(src.x,src.y,src.image.width,src.image.height);
	src.filters = [colorFilter];
	src.updateCache();
}
co.doubleduck.Utils.containBitmaps = function(bitmapList,spacing,isRow,dims) {
	if(isRow == null) isRow = true;
	if(spacing == null) spacing = 0;
	var totalWidth = 0;
	var totalHeight = 0;
	var result = new createjs.Container();
	var _g1 = 0, _g = bitmapList.length;
	while(_g1 < _g) {
		var currBitmap = _g1++;
		var bmp = bitmapList[currBitmap];
		bmp.regY = bmp.image.height / 2;
		if(currBitmap != 0) {
			if(isRow) {
				bmp.x = bitmapList[currBitmap - 1].x + bitmapList[currBitmap - 1].image.width + spacing;
				if(bmp.image.height > totalHeight) totalHeight = bmp.image.height;
				totalWidth += bmp.image.width + spacing;
			} else {
				bmp.y = bitmapList[currBitmap - 1].y + bitmapList[currBitmap - 1].image.height + spacing;
				if(bmp.image.width > totalWidth) totalWidth = bmp.image.width;
				totalHeight += bmp.image.height + spacing;
			}
		} else {
			totalWidth = bmp.image.width;
			totalHeight = bmp.image.height;
		}
		result.addChild(bmp);
	}
	result.regX = totalWidth / 2;
	result.regY = totalHeight / 2;
	if(dims != null) {
		dims.width = totalWidth;
		dims.height = totalHeight;
	}
	return result;
}
co.doubleduck.Utils.getCenteredImage = function(name,scaleToGame) {
	if(scaleToGame == null) scaleToGame = false;
	var img = co.doubleduck.BaseAssets.getImage(name);
	img.regX = img.image.width / 2;
	img.regY = img.image.height / 2;
	if(scaleToGame) img.scaleX = img.scaleY = co.doubleduck.BaseGame.getScale();
	return img;
}
co.doubleduck.Utils.setCenterReg = function(bmp) {
	bmp.regX = bmp.image.width / 2;
	bmp.regY = bmp.image.height / 2;
}
co.doubleduck.Utils.shuffleArray = function(arr) {
	var tmp, j, i = arr.length;
	while(i > 0) {
		j = Math.random() * i | 0;
		tmp = arr[--i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}
co.doubleduck.audio.AudioFX = $hxClasses["co.doubleduck.audio.AudioFX"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.AudioFX.__name__ = ["co","doubleduck","audio","AudioFX"];
co.doubleduck.audio.AudioFX.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.AudioFX._currentlyPlaying = null;
co.doubleduck.audio.AudioFX.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.setVolume(volume);
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,2);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		this._jsAudio = AudioFX(pathNoExtension, { loop: isLoop, pool: pool });
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.AudioFX
}
co.doubleduck.audio.DummyAudioAPI = $hxClasses["co.doubleduck.audio.DummyAudioAPI"] = function() {
};
co.doubleduck.audio.DummyAudioAPI.__name__ = ["co","doubleduck","audio","DummyAudioAPI"];
co.doubleduck.audio.DummyAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.DummyAudioAPI.prototype = {
	setVolume: function(volume) {
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
	}
	,init: function() {
	}
	,__class__: co.doubleduck.audio.DummyAudioAPI
}
co.doubleduck.audio.HowlerAudio = $hxClasses["co.doubleduck.audio.HowlerAudio"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.HowlerAudio.__name__ = ["co","doubleduck","audio","HowlerAudio"];
co.doubleduck.audio.HowlerAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.HowlerAudio._currentlyPlaying = null;
co.doubleduck.audio.HowlerAudio.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.volume = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,1);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		var myUrls = new Array();
		myUrls.push(this._src + ".mp3");
		myUrls.push(this._src + ".ogg");
		this._jsAudio = new Howl({urls: myUrls, loop: false});
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.HowlerAudio
}
co.doubleduck.audio.NonOverlappingAudio = $hxClasses["co.doubleduck.audio.NonOverlappingAudio"] = function(src) {
	this._src = src;
	this.load();
	this._isMusic = false;
};
co.doubleduck.audio.NonOverlappingAudio.__name__ = ["co","doubleduck","audio","NonOverlappingAudio"];
co.doubleduck.audio.NonOverlappingAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = null;
co.doubleduck.audio.NonOverlappingAudio.prototype = {
	getSrc: function() {
		return this._src;
	}
	,audio: function() {
		return this._audio;
	}
	,setVolume: function(volume) {
		if(this._audio != null) this._audio.volume = volume;
	}
	,pause: function() {
		if(this._audio != null) this._audio.pause();
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._isMusic) co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
		if(this._audio != null) {
			this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
			this._audio.currentTime = 0;
			this._audio.pause();
		}
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._isMusic = true;
		co.doubleduck.audio.NonOverlappingAudio._musicPlaying = true;
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
	}
	,handleEnded: function() {
		this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
		this._audio.currentTime = 0;
	}
	,handleTimeUpdate: function() {
		if(this._audio.currentTime >= this._audio.duration - 0.3) this.stop();
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._musicPlaying) return;
		if(overrideOtherEffects && co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
		co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = this;
	}
	,handleError: function() {
	}
	,handleCanPlay: function() {
	}
	,load: function() {
		this._audio = new Audio();
		this._audio.src = this._src;
		this._audio.initialTime = 0;
		this._audio.addEventListener("canplaythrough",$bind(this,this.handleCanPlay));
		this._audio.addEventListener("onerror",$bind(this,this.handleError));
	}
	,init: function() {
	}
	,_isMusic: null
	,_audio: null
	,_src: null
	,__class__: co.doubleduck.audio.NonOverlappingAudio
}
var haxe = haxe || {}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Public = $hxClasses["haxe.Public"] = function() { }
haxe.Public.__name__ = ["haxe","Public"];
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = $hxClasses["haxe.Stack"] = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.Stack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += Std.string("a C function");
		break;
	case 1:
		var m = $e[2];
		b.b += Std.string("module ");
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b += Std.string(" (");
		}
		b.b += Std.string(file);
		b.b += Std.string(" line ");
		b.b += Std.string(line);
		if(s1 != null) b.b += Std.string(")");
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += Std.string(".");
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += Std.string("local function #");
		b.b += Std.string(n);
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
if(!haxe.unit) haxe.unit = {}
haxe.unit.TestCase = $hxClasses["haxe.unit.TestCase"] = function() {
};
haxe.unit.TestCase.__name__ = ["haxe","unit","TestCase"];
haxe.unit.TestCase.__interfaces__ = [haxe.Public];
haxe.unit.TestCase.prototype = {
	assertEquals: function(expected,actual,c) {
		this.currentTest.done = true;
		if(actual != expected) {
			this.currentTest.success = false;
			this.currentTest.error = "expected '" + Std.string(expected) + "' but was '" + Std.string(actual) + "'";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertFalse: function(b,c) {
		this.currentTest.done = true;
		if(b == true) {
			this.currentTest.success = false;
			this.currentTest.error = "expected false but was true";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertTrue: function(b,c) {
		this.currentTest.done = true;
		if(b == false) {
			this.currentTest.success = false;
			this.currentTest.error = "expected true but was false";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,print: function(v) {
		haxe.unit.TestRunner.print(v);
	}
	,tearDown: function() {
	}
	,setup: function() {
	}
	,currentTest: null
	,__class__: haxe.unit.TestCase
}
haxe.unit.TestResult = $hxClasses["haxe.unit.TestResult"] = function() {
	this.m_tests = new List();
	this.success = true;
};
haxe.unit.TestResult.__name__ = ["haxe","unit","TestResult"];
haxe.unit.TestResult.prototype = {
	toString: function() {
		var buf = new StringBuf();
		var failures = 0;
		var $it0 = this.m_tests.iterator();
		while( $it0.hasNext() ) {
			var test = $it0.next();
			if(test.success == false) {
				buf.b += Std.string("* ");
				buf.b += Std.string(test.classname);
				buf.b += Std.string("::");
				buf.b += Std.string(test.method);
				buf.b += Std.string("()");
				buf.b += Std.string("\n");
				buf.b += Std.string("ERR: ");
				if(test.posInfos != null) {
					buf.b += Std.string(test.posInfos.fileName);
					buf.b += Std.string(":");
					buf.b += Std.string(test.posInfos.lineNumber);
					buf.b += Std.string("(");
					buf.b += Std.string(test.posInfos.className);
					buf.b += Std.string(".");
					buf.b += Std.string(test.posInfos.methodName);
					buf.b += Std.string(") - ");
				}
				buf.b += Std.string(test.error);
				buf.b += Std.string("\n");
				if(test.backtrace != null) {
					buf.b += Std.string(test.backtrace);
					buf.b += Std.string("\n");
				}
				buf.b += Std.string("\n");
				failures++;
			}
		}
		buf.b += Std.string("\n");
		if(failures == 0) buf.b += Std.string("OK "); else buf.b += Std.string("FAILED ");
		buf.b += Std.string(this.m_tests.length);
		buf.b += Std.string(" tests, ");
		buf.b += Std.string(failures);
		buf.b += Std.string(" failed, ");
		buf.b += Std.string(this.m_tests.length - failures);
		buf.b += Std.string(" success");
		buf.b += Std.string("\n");
		return buf.b;
	}
	,add: function(t) {
		this.m_tests.add(t);
		if(!t.success) this.success = false;
	}
	,success: null
	,m_tests: null
	,__class__: haxe.unit.TestResult
}
haxe.unit.TestRunner = $hxClasses["haxe.unit.TestRunner"] = function() {
	this.result = new haxe.unit.TestResult();
	this.cases = new List();
};
haxe.unit.TestRunner.__name__ = ["haxe","unit","TestRunner"];
haxe.unit.TestRunner.print = function(v) {
	var msg = StringTools.htmlEscape(js.Boot.__string_rec(v,"")).split("\n").join("<br/>");
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("haxe:trace element not found"); else d.innerHTML += msg;
}
haxe.unit.TestRunner.customTrace = function(v,p) {
	haxe.unit.TestRunner.print(p.fileName + ":" + p.lineNumber + ": " + Std.string(v) + "\n");
}
haxe.unit.TestRunner.prototype = {
	runCase: function(t) {
		var old = haxe.Log.trace;
		haxe.Log.trace = haxe.unit.TestRunner.customTrace;
		var cl = Type.getClass(t);
		var fields = Type.getInstanceFields(cl);
		haxe.unit.TestRunner.print("Class: " + Type.getClassName(cl) + " ");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var fname = f;
			var field = Reflect.field(t,f);
			if(StringTools.startsWith(fname,"test") && Reflect.isFunction(field)) {
				t.currentTest = new haxe.unit.TestStatus();
				t.currentTest.classname = Type.getClassName(cl);
				t.currentTest.method = fname;
				t.setup();
				try {
					field.apply(t,new Array());
					if(t.currentTest.done) {
						t.currentTest.success = true;
						haxe.unit.TestRunner.print(".");
					} else {
						t.currentTest.success = false;
						t.currentTest.error = "(warning) no assert";
						haxe.unit.TestRunner.print("W");
					}
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,haxe.unit.TestStatus) ) {
						var e = $e0;
						haxe.unit.TestRunner.print("F");
						t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					} else {
					var e = $e0;
					haxe.unit.TestRunner.print("E");
					if(e.message != null) t.currentTest.error = "exception thrown : " + Std.string(e) + " [" + Std.string(e.message) + "]"; else t.currentTest.error = "exception thrown : " + Std.string(e);
					t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					}
				}
				this.result.add(t.currentTest);
				t.tearDown();
			}
		}
		haxe.unit.TestRunner.print("\n");
		haxe.Log.trace = old;
	}
	,run: function() {
		this.result = new haxe.unit.TestResult();
		var $it0 = this.cases.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			this.runCase(c);
		}
		haxe.unit.TestRunner.print(this.result.toString());
		return this.result.success;
	}
	,add: function(c) {
		this.cases.add(c);
	}
	,cases: null
	,result: null
	,__class__: haxe.unit.TestRunner
}
haxe.unit.TestStatus = $hxClasses["haxe.unit.TestStatus"] = function() {
	this.done = false;
	this.success = false;
};
haxe.unit.TestStatus.__name__ = ["haxe","unit","TestStatus"];
haxe.unit.TestStatus.prototype = {
	backtrace: null
	,posInfos: null
	,classname: null
	,method: null
	,error: null
	,success: null
	,done: null
	,__class__: haxe.unit.TestStatus
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
co.doubleduck.BaseAssets.onLoadAll = null;
co.doubleduck.BaseAssets._loader = null;
co.doubleduck.BaseAssets._cacheData = { };
co.doubleduck.BaseAssets._loadCallbacks = { };
co.doubleduck.BaseAssets.loaded = 0;
co.doubleduck.BaseAssets._useLocalStorage = false;
co.doubleduck.BaseGame._viewport = null;
co.doubleduck.BaseGame._scale = 1;
co.doubleduck.BaseGame.DEBUG = false;
co.doubleduck.BaseGame.LOGO_URI = "images/duckling/splash_logo.png";
co.doubleduck.BaseGame.LOAD_STROKE_URI = "images/duckling/loading_stroke.png";
co.doubleduck.BaseGame.LOAD_FILL_URI = "images/duckling/loading_fill.png";
co.doubleduck.BaseGame.ORIENT_PORT_URI = "images/duckling/orientation_error_port.png";
co.doubleduck.BaseGame.ORIENT_LAND_URI = "images/duckling/orientation_error_land.png";
co.doubleduck.BasePersistence.GAME_PREFIX = "DUCK";
co.doubleduck.BasePersistence.available = co.doubleduck.BasePersistence.localStorageSupported();
co.doubleduck.Button.CLICK_TYPE_NONE = 0;
co.doubleduck.Button.CLICK_TYPE_TINT = 1;
co.doubleduck.Button.CLICK_TYPE_JUICY = 2;
co.doubleduck.Button.CLICK_TYPE_SCALE = 3;
co.doubleduck.Button.CLICK_TYPE_TOGGLE = 4;
co.doubleduck.Button.CLICK_TYPE_HOLD = 5;
co.doubleduck.Button._defaultSound = null;
co.doubleduck.ChipPack._chipValues = [25,50,100,200,500,1000,5000];
co.doubleduck.Dropper.PREFIX = "droplet";
co.doubleduck.Dropper.DROPLET_SIZE = 115;
co.doubleduck.Dropper.DROPLET_COUNT = 7;
co.doubleduck.Dropper.DROP_TIME = 1600;
co.doubleduck.Game.CARDS_BACK = 5;
co.doubleduck.Game.SPREAD_INTERVAL = 45;
co.doubleduck.Menu.SCROLL_EASE = 0.008;
co.doubleduck.Menu.ROW_POS = 0.405;
co.doubleduck.Menu.BTN_PADDING = 10;
co.doubleduck.MiniSlot.SLOTS_COUNT = 3;
co.doubleduck.MiniSlot.WIN_SUMS = [150,250,500,600,750,1000];
co.doubleduck.MiniSlotWindow.ITEMS_COUNT = 6;
co.doubleduck.MiniSlotWindow.ROLL_TIME = 3500;
co.doubleduck.PlayingTable.CARD_PACK_WIDTH = 65;
co.doubleduck.PlayingTable.CARD_PACK_START_ANGLE = -5;
co.doubleduck.PlayingTable.CARD_PACK_ANGLE_VARIATION = 10;
co.doubleduck.Session.BUTTON_SOUND = "sound/button_click";
co.doubleduck.Session._locationId = -1;
co.doubleduck.audio.WebAudioAPI._buffers = { };
co.doubleduck.SoundManager._muted = false;
co.doubleduck.SoundManager._cache = { };
co.doubleduck.SoundManager.available = co.doubleduck.SoundManager.isSoundAvailable();
co.doubleduck.TransitionAnim.OUT_OFFSET = -0.8;
co.doubleduck.TransitionAnim.OUT_ANGLE = 0;
co.doubleduck.TransitionAnim.IN_OFFSET = 0.18;
co.doubleduck.TransitionAnim.IN_ANGLE = 15;
co.doubleduck.TransitionAnim.ANIM_TIME = 500;
co.doubleduck.audio.AudioFX._muted = false;
co.doubleduck.audio.HowlerAudio._muted = false;
co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
js.Lib.onerror = null;
co.doubleduck.Main.main();
