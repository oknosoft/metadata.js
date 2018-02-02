/*!
 metadata.js v0.12.231, built:2017-06-26 &copy; Evgeniy Malyarov http://www.oknosoft.ru 2014-2017
 metadata.js may be freely distributed under the MIT. To obtain _Oknosoft Commercial license_, contact info@oknosoft.ru
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.$p = factory();
  }
}(this, function() {


;"use strict";



Object.defineProperties(Object.prototype, {

	__define: {
		value: function( key, descriptor ) {
			if( descriptor ) {
				Object.defineProperty( this, key, descriptor );
			} else {
				Object.defineProperties( this, key );
			}
			return this;
		}
	},

	_extend: {
		value: function( Parent ) {
			var F = function() { };
			F.prototype = Parent.prototype;
			this.prototype = new F();
			this.prototype.constructor = this;
			this.__define("superclass", {
				value: Parent.prototype,
				enumerable: false
			});
		}
	},

	_mixin: {
		value: function(src, include, exclude ) {
			var tobj = {}, i, f; 
			if(include && include.length){
				for(i = 0; i<include.length; i++){
					f = include[i];
					if(exclude && exclude.indexOf(f)!=-1){
            continue;
          }
					if((typeof tobj[f] == "undefined") || (tobj[f] != src[f]))
						this[f] = src[f];
				}
			}else{
				for(f in src){
					if(exclude && exclude.indexOf(f)!=-1)
						continue;
					if((typeof tobj[f] == "undefined") || (tobj[f] != src[f]))
						this[f] = src[f];
				}
			}
			return this;
		}
	},

	_clone: {
		value: function(exclude, str_date) {
			if(!this || "object" !== typeof this)
				return this;
			var p, v, c = "function" === typeof this.pop ? [] : {};
			for(p in this){
        if(exclude && exclude.indexOf(p)!=-1){
          continue;
        }
				if (this.hasOwnProperty(p)){
					v = this[p];
					if(v){
						if("function" === typeof v || v instanceof DataObj || v instanceof DataManager){
              c[p] = v;
            }
						else if("object" === typeof v){
              if(v instanceof Date){
                c[p] = str_date ? v.toJSON() : v;
              }
              else{
                c[p] = v._clone(exclude, str_date);
              }
            }
						else{
              c[p] = v;
            }
					}
					else{
            c[p] = v;
          }
				}
			}
			return c;
		}
	}
});

Date.prototype.toJSON = function () {
  return $p.moment(this).format($p.moment._masks.iso);
}

if(!Number.prototype.round)
	Number.prototype.round = function(places) {
		var multiplier = Math.pow(10, places);
		return (Math.round(this * multiplier) / multiplier);
	};

if(!Number.prototype.pad)
	Number.prototype.pad = function(size) {
		var s = String(this);
		while (s.length < (size || 2)) {s = "0" + s;}
		return s;
	};

if(!Object.observe && !Object.unobserve && !Object.getNotifier){
	Object.prototype.__define({

		observe: {
			value: function(target, observer) {
				if(!target){
					return;
				}
				if(!target._observers){
					target.__define({
						_observers: {
							value: [],
							enumerable: false
						},
						_notis: {
							value: [],
							enumerable: false
						}
					});
				}
				target._observers.push(observer);
			},
			enumerable: false
		},

		unobserve: {
			value: function(target, observer) {
				if(target && target._observers){

					if(!observer){
						target._observers.length = 0;
					}

					for(var i=0; i<target._observers.length; i++){
						if(target._observers[i]===observer){
							target._observers.splice(i, 1);
							break;
						}
					}
				}
			},
			enumerable: false
		},

		getNotifier: {
			value: function(target) {
				var timer;
				return {
					notify: function (noti) {

						if(!target._observers || !noti)
							return;

						if(!noti.object)
							noti.object = target;

						target._notis.push(noti);
						noti = null;

						if(timer){
							clearTimeout(timer);
						}

						timer = setTimeout(function () {
							if(target._notis.length){
								target._observers.forEach(function (observer) {
									observer(target._notis);
								});
								target._notis.length = 0;
							}
							timer = false;

						}, 4);
					}
				}
			},
			enumerable: false
		}

	});
}


var $p = new MetaEngine();


function MetaEngine() {

	this.__define({

		version: {
			value: "0.12.231",
			writable: false
		},

		toString: {
			value: function(){
				return "Oknosoft data engine. v:" + this.version;
			},
			writable: false
		},

		utils: {
			value: new Utils()
		},

		injected_data: {
			value: {},
			writable: false
		},

		ajax: {
			value: new Ajax(),
			writable: false
		},

		msg: {
			value: new Messages(),
			writable: false
		},

		wsql: {
			value: new WSQL(),
			writable: false
		},

		eve: {
			value: new AppEvents(),
			writable: false
		},

		aes: {
			value: new Aes("metadata.js"),
			writable: false
		},

		moment: {
			get: function () { return this.utils.moment; }
		},

		_patch: {
			value: function (obj, patch) {
				for(var area in patch){

					if(typeof patch[area] == "object"){
						if(obj[area] && typeof obj[area] == "object")
							$p._patch(obj[area], patch[area]);
						else
							obj[area] = patch[area];
					}else
						obj[area] = patch[area];
				}
				return obj;
			}
		},

		_find: {
			value: function(a, val, columns){
				var o, i, finded;
				if(typeof val != "object"){
					for(i in a){ 
						o = a[i];
						for(var j in o){
							if(typeof o[j] !== "function" && $p.utils.is_equal(o[j], val))
								return o;
						}
					}
				}else{
					for(i in a){ 
						o = a[i];
						finded = true;
						for(var j in val){
							if(typeof o[j] !== "function" && !$p.utils.is_equal(o[j], val[j])){
								finded = false;
								break;
							}
						}
						if(finded)
							return o;
					}
				}
			}
		},

		_selection: {
			value: function (o, selection) {

				var ok = true, j, sel, is_obj;

				if(selection){
					if(typeof selection == "function")
						ok = selection.call(this, o);

					else{
						for(j in selection){

							sel = selection[j];
							is_obj = sel && typeof(sel) === "object";

							if(j.substr(0, 1) == "_")
								continue;

							else if(typeof sel == "function"){
								ok = sel.call(this, o, j);
								if(!ok)
									break;

							}else if(j == "or" && Array.isArray(sel)){
								ok = sel.some(function (element) {
									var key = Object.keys(element)[0];
									if(element[key].hasOwnProperty("like"))
										return typeof o[key] == "string" && o[key].toLowerCase().indexOf(element[key].like.toLowerCase())!=-1;
									else
										return $p.utils.is_equal(o[key], element[key]);
								});
								if(!ok)
									break;

							}else if(is_obj && sel.hasOwnProperty("like")){
								if(!o[j] || o[j].toLowerCase().indexOf(sel.like.toLowerCase())==-1){
									ok = false;
									break;
								}

							}else if(is_obj && sel.hasOwnProperty("not")){
								if($p.utils.is_equal(o[j], sel.not)){
									ok = false;
									break;
								}

							}else if(is_obj && sel.hasOwnProperty("in")){
								ok = sel.in.some(function(element) {
									return $p.utils.is_equal(element, o[j]);
								});
								if(!ok)
									break;

							}else if(is_obj && sel.hasOwnProperty("lt")){
								ok = o[j] < sel.lt;
								if(!ok)
									break;

							}else if(is_obj && sel.hasOwnProperty("gt")){
								ok = o[j] > sel.gt;
								if(!ok)
									break;

							}else if(is_obj && sel.hasOwnProperty("between")){
								var tmp = o[j];
								if(typeof tmp != "number")
									tmp = $p.utils.fix_date(o[j]);
								ok = (tmp >= sel.between[0]) && (tmp <= sel.between[1]);
								if(!ok)
									break;

							}else if(!$p.utils.is_equal(o[j], sel)){
								ok = false;
								break;
							}
						}
					}
				}

				return ok;
			}
		},

		_find_rows: {
			value: function(arr, selection, callback){

				var o, res = [], top, count = 0;

				if(selection){
					if(selection._top){
						top = selection._top;
						delete selection._top;
					}else
						top = 1000;
				}

				for(var i in arr){
					o = arr[i];

					if($p._selection.call(this, o, selection)){
						if(callback){
							if(callback.call(this, o) === false)
								break;
						}else
							res.push(o);

						if(top) {
							count++;
							if (count >= top)
								break;
						}
					}

				}
				return res;
			}
		},

		on: {
			value: function (name, fn) {
				if(typeof name == "object"){
					for(var n in name){
						if(!name[n]._evnts)
							name[n]._evnts = [];
						name[n]._evnts.push(this.eve.attachEvent(n, name[n]));
					}
				}else
					return this.eve.attachEvent(name, fn);
			}
		},

		off: {
			value: function (id) {
			  if(arguments.length == 2){
          id = arguments[1];
        }
				if(typeof id == "function" && id._evnts){
					id._evnts.forEach(function (id) {
						$p.eve.detachEvent(id);
					});
				}
				else if(!id){
          $p.eve.detachAllEvents();
        }
				else{
          $p.eve.detachEvent(id);
        }
			}
		},

		record_log: {
			value: function (err) {
				$p.ireg && $p.ireg.log && $p.ireg.log.record(err);
			}
		},

		md: {
			value: new Meta()
		},

		enm: {
			value: new (
					function Enumerations(){
					this.toString = function(){return $p.msg.meta_enn_mgr};
				})
		},

		cat: {
			value: 	new (
					function Catalogs(){
					this.toString = function(){return $p.msg.meta_cat_mgr};
				}
			)
		},

		doc: {
			value: 	new (
					function Documents(){
					this.toString = function(){return $p.msg.meta_doc_mgr};
				})
		},

		ireg: {
			value: 	new (
					function InfoRegs(){
					this.toString = function(){return $p.msg.meta_ireg_mgr};
				})
		},

		areg: {
			value: 	new (
					function AccumRegs(){
					this.toString = function(){return $p.msg.meta_areg_mgr};
				})
		},

		accreg: {
			value: 	new (
					function AccountsRegs(){
					this.toString = function(){return $p.msg.meta_accreg_mgr};
				})
		},

		dp: {
			value: 	new (
					function DataProcessors(){
					this.toString = function(){return $p.msg.meta_dp_mgr};
				})
		},

		rep: {
			value: new (
					function Reports(){
					this.toString = function(){return $p.msg.meta_reports_mgr};
				})
		},

		cacc: {
			value: 	new (

					function ChartsOfAccounts(){
					this.toString = function(){return $p.msg.meta_cacc_mgr};
				})
		},

		cch: {
			value: new (

					function ChartsOfCharacteristics(){
					this.toString = function(){return $p.msg.meta_cch_mgr};
				})
		},

		tsk: {
			value: 	new (

					function Tasks(){
					this.toString = function(){return $p.msg.meta_task_mgr};
				})
		},

		bp: {
			value: 	new (

					function BusinessProcesses(){
					this.toString = function(){return $p.msg.meta_bp_mgr};
				})
		},

		DataManager: {
			value: DataManager
		},

		RefDataManager: {
			value: RefDataManager
		},

		DataProcessorsManager: {
			value: DataProcessorsManager
		},

		EnumManager: {
			value: EnumManager
		},

		RegisterManager: {
			value: RegisterManager
		},

		InfoRegManager: {
			value: InfoRegManager
		},

		LogManager: {
			value: LogManager
		},

		MetaObjManager: {
			value: MetaObjManager
		},

		MetaFieldManager: {
			value: MetaFieldManager
		},

		SchemeSettingsManager: {
			value: SchemeSettingsManager
		},

		AccumRegManager: {
			value: AccumRegManager
		},

		CatManager: {
			value: CatManager
		},

		ChartOfCharacteristicManager: {
			value: ChartOfCharacteristicManager
		},

		ChartOfAccountManager: {
			value: ChartOfAccountManager
		},

		DocManager: {
			value: DocManager
		},

		TaskManager: {
			value: TaskManager
		},

		BusinessProcessManager: {
			value: BusinessProcessManager
		},

		DataObj: {
			value: DataObj
		},

		CatObj: {
			value: CatObj
		},

		DocObj: {
			value: DocObj
		},

		DataProcessorObj: {
			value: DataProcessorObj
		},

		TaskObj: {
			value: TaskObj
		},

		BusinessProcessObj: {
			value: BusinessProcessObj
		},

		EnumObj: {
			value: EnumObj
		},

		RegisterRow: {
			value: RegisterRow
		},

		TabularSection: {
			value: TabularSection
		},

		TabularSectionRow: {
			value: TabularSectionRow
		}

	});

}

function Utils() {

	this.moment = typeof moment == "function" ? moment : require('moment');
	this.moment._masks = {
		date:       "DD.MM.YY",
		date_time:  "DD.MM.YYYY HH:mm",
		ldt:        "DD MMMM YYYY, HH:mm",
		iso:        "YYYY-MM-DDTHH:mm:ss"
	};


	this.fix_date = function(str, strict){

		if(str instanceof Date)
			return str;
		else{
			var m = this.moment(str, ["DD-MM-YYYY", "DD-MM-YYYY HH:mm", "DD-MM-YYYY HH:mm:ss", "DD-MM-YY HH:mm", "YYYYDDMMHHmmss", this.moment.ISO_8601]);
			return m.isValid() ? m.toDate() : (strict ? this.blank.date : str);
		}
	};

	this.fix_guid = function(ref, generate){

		if(ref && typeof ref == "string"){

		} else if(ref instanceof DataObj)
			return ref.ref;

		else if(ref && typeof ref == "object"){
			if(ref.presentation){
				if(ref.ref)
					return ref.ref;
				else if(ref.name)
					return ref.name;
			}
			else
				ref = (typeof ref.ref == "object" && ref.ref.hasOwnProperty("ref")) ?  ref.ref.ref : ref.ref;
		}

		if(this.is_guid(ref) || generate === false)
			return ref;

		else if(generate)
			return this.generate_guid();

		else
			return this.blank.guid;
	};

	this.fix_number = function(str, strict){
		var v = parseFloat(str);
		if(!isNaN(v))
			return v;
		else if(strict)
			return 0;
		else
			return str;
	};

	this.fix_boolean = function(str){
		if(typeof str === "string")
			return !(!str || str.toLowerCase() == "false");
		else
			return !!str;
	};

	this.blank = {
		date: this.fix_date("0001-01-01T00:00:00"),
		guid: "00000000-0000-0000-0000-000000000000",
		by_type: function(mtype){
			var v;
			if(mtype.is_ref)
				v = this.guid;
			else if(mtype.date_part)
				v = this.date;
			else if(mtype["digits"])
				v = 0;
			else if(mtype.types && mtype.types[0]=="boolean")
				v = false;
			else
				v = "";
			return v;
		}
	};

	this.fetch_type = function(str, mtype){
		if (mtype.is_ref){
			return this.fix_guid(str);
		}
		if (mtype.date_part){
			return this.fix_date(str, true)
		}
		if (mtype["digits"]){
			return this.fix_number(str, true)
		}
		if (mtype.types && mtype.types[0] == "boolean"){
			return this.fix_boolean(str)
		}
		return str;
	};

	this.date_add_day = function(date, days, reset_time){
		var newDt = new Date(date);
		newDt.setDate(date.getDate() + days);
		if(reset_time)
			newDt.setHours(0,-newDt.getTimezoneOffset(),0,0);
		return newDt;
	}

	this.generate_guid = function(){
		var d = new Date().getTime();
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
	};

	this.is_guid = function(v){
		if(typeof v !== "string" || v.length < 36)
			return false;
		else if(v.length > 36)
			v = v.substr(0, 36);
		return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(v)
	};

	this.is_empty_guid = function (v) {
		return !v || v === this.blank.guid;
	};

	this.is_data_obj = function(v){
		return v && v instanceof DataObj;
	};

	this.is_data_mgr = function(v){
		return v && v instanceof DataManager;
	};

	this.is_equal = function(v1, v2){

		if(v1 == v2)
			return true;
		else if(typeof v1 === typeof v2)
			return false;

		return (this.fix_guid(v1, false) == this.fix_guid(v2, false));
	};

	this.blob_as_text = function (blob, type) {

		return new Promise(function(resolve, reject){
			var reader = new FileReader();
			reader.onload = function(event){
				resolve(reader.result);
			};
			reader.onerror = function(err){
				reject(err);
			};
			switch (type) {
        case "array" :
          reader.readAsArrayBuffer(blob);
          break;
        case "data_url":
          reader.readAsDataURL(blob);
          break;
        default:
          reader.readAsText(blob);
      }
		});

	};

}

function Ajax() {


	function _call(method, url, post_data, auth, before_send) {

		return new Promise(function(resolve, reject) {

			if(typeof window == "undefined" && auth && auth.request){

				auth.request({
						url: encodeURI(url),
						headers : {
							"Authorization": auth.auth
						}
					},
					function (error, response, body) {
						if(error)
							reject(error);

						else if(response.statusCode != 200)
							reject({
								message: response.statusMessage,
								description: body,
								status: response.statusCode
							});

						else
							resolve({response: body});
					}
				);

			}else {

				var req = new XMLHttpRequest();

				if(window.dhx4 && window.dhx4.isIE)
					url = encodeURI(url);

				if(auth){
					var username, password;
					if(typeof auth == "object" && auth.username && auth.hasOwnProperty("password")){
						username = auth.username;
						password = auth.password;

					}else{
						if($p.ajax.username && $p.ajax.authorized){
							username = $p.ajax.username;
							password = $p.aes.Ctr.decrypt($p.ajax.password);

						}else{
							username = $p.wsql.get_user_param("user_name");
							password = $p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd"));

							if(!username && $p.job_prm && $p.job_prm.guest_name){
								username = $p.job_prm.guest_name;
								password = $p.aes.Ctr.decrypt($p.job_prm.guest_pwd);
							}
						}
					}
					req.open(method, url, true, username, password);
					req.withCredentials = true;
					req.setRequestHeader("Authorization", "Basic " +
						btoa(unescape(encodeURIComponent(username + ":" + password))));
				}else
					req.open(method, url, true);

				if(before_send)
					before_send.call(this, req);

				if (method != "GET") {
					if(!this.hide_headers && !auth.hide_headers){
						req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
						req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					}
				} else {
					post_data = null;
				}

				req.onload = function() {
					if (req.status == 200 && (req.response instanceof Blob || req.response.substr(0,9)!=="<!DOCTYPE")) {
						if(req.responseURL == undefined)
							req.responseURL = url;
						resolve(req);
					}
					else {
						if(req.response)
							reject({
								message: req.statusText,
								description: req.response,
								status: req.status
							});
						else
							reject(Error(req.statusText));
					}
				};

				req.onerror = function() {
					reject(Error("Network Error"));
				};

				req.send(post_data);
			}

		});

	}

	this.username = "";

	this.password = "";

	this.root = true;

	this.authorized = false;

	this.get = function(url) {
		return _call.call(this, "GET", url);
	};

	this.post = function(url, postData) {
		if (arguments.length == 1) {
			postData = "";
		} else if (arguments.length == 2 && (typeof(postData) == "function")) {
			onLoad = postData;
			postData = "";
		} else {
			postData = String(postData);
		}
		return _call.call(this, "POST", url, postData);
	};

	this.get_ex = function(url, auth, beforeSend){
		return _call.call(this, "GET", url, null, auth, beforeSend);

	};

	this.post_ex = function(url, postData, auth, beforeSend){
		return _call.call(this, "POST", url, postData, auth, beforeSend);
	};

	this.put_ex = function(url, postData, auth, beforeSend){
		return _call.call(this, "PUT", url, postData, auth, beforeSend);
	};

	this.patch_ex = function(url, postData, auth, beforeSend){
		return _call.call(this, "PATCH", url, postData, auth, beforeSend);
	};

	this.delete_ex = function(url, auth, beforeSend){
		return _call.call(this, "DELETE", url, null, auth, beforeSend);

	};

	this.get_and_show_blob = function(url, post_data, method){

		var params = "menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes",
			wnd_print;

		function show_blob(req){
			url = window.URL.createObjectURL(req.response);
			wnd_print = window.open(url, "wnd_print", params);
			wnd_print.onload = function(e) {
				window.URL.revokeObjectURL(url);
			};
			return wnd_print;
		}

    if(url instanceof Blob){
      Promise.resolve(show_blob({response: url}));
    }
    else if(!method || (typeof method == "string" && method.toLowerCase().indexOf("post")!=-1))
      return this.post_ex(url,
        typeof post_data == "object" ? JSON.stringify(post_data) : post_data,
        true,
        function(xhr){
          xhr.responseType = "blob";
        })
        .then(show_blob);
    else{
      return this.get_ex(url, true, function(xhr){
        xhr.responseType = "blob";
      })
        .then(show_blob);
    }
	};

	this.get_and_save_blob = function(url, post_data, file_name){

		return this.post_ex(url,
			typeof post_data == "object" ? JSON.stringify(post_data) : post_data, true, function(xhr){
				xhr.responseType = "blob";
			})
			.then(function(req){
				saveAs(req.response, file_name);
			});
	};

	this.default_attr = function (attr, url) {
		if(!attr.url)
			attr.url = url;
		if(!attr.username)
			attr.username = this.username;
		if(!attr.password)
			attr.password = this.password;
		attr.hide_headers = true;

		if($p.job_prm["1c"]){
			attr.auth = $p.job_prm["1c"].auth;
			attr.request = $p.job_prm["1c"].request;
		}
	}

}





function WSQL(){

	var wsql = this,
		ls,
		user_params = {};

	this.__define({

		js_time_diff: {
			value: -(new Date("0001-01-01")).valueOf()
		},

		time_diff: {
			get: function () {
				var diff = this.get_user_param("time_diff", "number");
				return (!diff || isNaN(diff) || diff < 62135571600000 || diff > 62135622000000) ? this.js_time_diff : diff;
			}
		},

		set_user_param: {
			value: function(prm_name, prm_value){

				if(typeof prm_value == "object"){
					user_params[prm_name] = prm_value;
					prm_value = JSON.stringify(prm_value);
				}
				else if(prm_value === false || prm_value === "false"){
					user_params[prm_name] = false;
					prm_value = "";
				}
				else{
					user_params[prm_name] = prm_value;
				}

				ls.setItem($p.job_prm.local_storage_prefix+prm_name, prm_value);

			}
		},

		get_user_param: {
			value: function(prm_name, type){

				if(!user_params.hasOwnProperty(prm_name) && ls){
					user_params[prm_name] = this.fetch_type(ls.getItem($p.job_prm.local_storage_prefix+prm_name), type);
				}

				return user_params[prm_name];
			}
		},

		promise: {
			value: function(sql, params) {
				return new Promise(function(resolve, reject){
					wsql.alasql(sql, params || [], function(data, err) {
						if(err) {
							reject(err);
						} else {
							resolve(data);
						}
					});
				});
			}
		},

		save_options: {
			value: function(prefix, options){
				return wsql.set_user_param(prefix + "_" + options.name, options);
			}
		},

		restore_options: {
			value: function(prefix, options){
				var options_saved = wsql.get_user_param(prefix + "_" + options.name, "object");
				for(var i in options_saved){
					if(typeof options_saved[i] != "object")
						options[i] = options_saved[i];
					else{
						if(!options[i])
							options[i] = {};
						for(var j in options_saved[i])
							options[i][j] = options_saved[i][j];
					}
				}
				return options;
			}
		},

		fetch_type: {
			value: 	function(prm, type){
				if(type == "object"){
					try{
						prm = JSON.parse(prm);
					}catch(e){
						prm = {};
					}
					return prm;
				}else if(type == "number")
					return $p.utils.fix_number(prm, true);
				else if(type == "date")
					return $p.utils.fix_date(prm, true);
				else if(type == "boolean")
					return $p.utils.fix_boolean(prm);
				else
					return prm;
			}
		},

		alasql: {
			value: typeof alasql != "undefined" ? alasql : require("alasql")
		},

		init_params: {

			value: function(){

				if(!$p.job_prm.local_storage_prefix && !$p.job_prm.create_tables)
					return Promise.resolve();

				if(typeof localStorage === "undefined"){

          ls = {
            setItem: function (name, value) {
            },
            getItem: function (name) {
            }
          };
				}
				else{
          ls = localStorage;
        }

				var nesessery_params = [
					{p: "user_name",      v: "", t:"string"},
					{p: "user_pwd",       v: "", t:"string"},
					{p: "browser_uid",		v: $p.utils.generate_guid(), t:"string"},
					{p: "zone",           v: $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1, t: $p.job_prm.zone_is_string ? "string" : "number"},
					{p: "enable_save_pwd",v: $p.job_prm.enable_save_pwd,	t:"boolean"},
          {p: "couch_direct",   v: $p.job_prm.hasOwnProperty("couch_direct") ? $p.job_prm.couch_direct : true,	t:"boolean"},
					{p: "couch_path",		  v: $p.job_prm.couch_path,	t:"string"},
          {p: "rest_path",		  v: "", t:"string"},
					{p: "skin",		        v: "dhx_web", t:"string"},
				],	zone;

				if($p.job_prm.additional_params)
					nesessery_params = nesessery_params.concat($p.job_prm.additional_params);

				if(!ls.getItem($p.job_prm.local_storage_prefix+"zone"))
					zone = $p.job_prm.hasOwnProperty("zone") ? $p.job_prm.zone : 1;
				if($p.job_prm.url_prm.hasOwnProperty("zone"))
					zone = $p.job_prm.zone_is_string ? $p.job_prm.url_prm.zone : $p.utils.fix_number($p.job_prm.url_prm.zone, true);
				if(zone !== undefined)
					wsql.set_user_param("zone", zone);

				nesessery_params.forEach(function(o){
					if((o.t == "boolean" ? wsql.get_user_param(o.p) : wsql.get_user_param(o.p, o.t)) == undefined ||
						(!wsql.get_user_param(o.p, o.t) && (o.p.indexOf("url") != -1)))
						wsql.set_user_param(o.p, $p.job_prm.hasOwnProperty(o.p) ? $p.job_prm[o.p] : o.v);
				});

				var pouch_prm = {
					path: wsql.get_user_param("couch_path", "string") || $p.job_prm.couch_path || "",
					zone: wsql.get_user_param("zone", "number"),
					prefix: $p.job_prm.local_storage_prefix,
					suffix: wsql.get_user_param("couch_suffix", "string") || "",
					direct: wsql.get_user_param("couch_direct", "boolean"),
					user_node: $p.job_prm.user_node,
					noreplicate: $p.job_prm.noreplicate
				};
				if(pouch_prm.path){

					wsql.__define("pouch", { value: new Pouch()	});
					wsql.pouch.init(pouch_prm);
				}

				if(this.create_tables){
					this.alasq(this.create_tables, []);
					this.create_tables = "";
				}


			}
		},

		drop_tables: {
			value: function(callback){
				var cstep = 0, tmames = [];

				function ccallback(){
					cstep--;
					if(cstep<=0)
						setTimeout(callback, 10);
					else
						iteration();
				}

				function iteration(){
					var tname = tmames[cstep-1]["tableid"];
					if(tname.substr(0, 1) == "_")
						ccallback();
					else
						wsql.alasql("drop table IF EXISTS " + tname, [], ccallback);
				}

				function tmames_finded(data){
					tmames = data;
					if(cstep = data.length)
						iteration();
					else
						ccallback();
				}

				wsql.alasql("SHOW TABLES", [], tmames_finded);
			}
		}

	});

	this.__define({
		aladb: {
			value: new this.alasql.Database('md')
		}
	});

}



function Col_struct(id,width,type,align,sort,caption){
	this.id = id;
	this.width = width;
	this.type = type;
	this.align = align;
	this.sort = sort;
	this.caption = caption;
}

function InterfaceObjs(){

	var iface = this;

	this.get_offset = function(elm) {
		var offset = {left: 0, top:0};
		if (elm.offsetParent) {
			do {
				offset.left += elm.offsetLeft;
				offset.top += elm.offsetTop;
			} while (elm = elm.offsetParent);
		}
		return offset;
	};

	this.normalize_xml = function(str){
		if(!str) return "";
		var entities = { '&':  '&amp;', '"': '&quot;',  "'":  '&apos;', '<': '&lt;', '>': '&gt;'};
		return str.replace(	/[&"'<>]/g, function (s) {return entities[s];});
	};

	this.scale_svg = function(svg_current, size, padding){
		var j, k, svg_head, svg_body, head_ind, vb_ind, svg_head_str, vb_str, viewBox, svg_j = {};

		var height = typeof size == "number" ? size : size.height,
			width = typeof size == "number" ? (size * 1.5).round(0) : size.width,
			max_zoom = typeof size == "number" ? Infinity : (size.zoom || Infinity);

		head_ind = svg_current.indexOf(">");
		svg_head_str = svg_current.substring(5, head_ind);
		svg_head = svg_head_str.split(' ');
		svg_body = svg_current.substr(head_ind+1);
		svg_body = svg_body.substr(0, svg_body.length - 6);

		for(j in svg_head){
			svg_current = svg_head[j].split("=");
			if("width,height,x,y".indexOf(svg_current[0]) != -1){
				svg_current[1] = Number(svg_current[1].replace(/"/g, ""));
				svg_j[svg_current[0]] = svg_current[1];
			}
		}

		if((vb_ind = svg_head_str.indexOf("viewBox="))!=-1){
			vb_str = svg_head_str.substring(vb_ind+9);
			viewBox = 'viewBox="' + vb_str.substring(0, vb_str.indexOf('"')) + '"';
		}else{
			viewBox = 'viewBox="' + (svg_j.x || 0) + ' ' + (svg_j.y || 0) + ' ' + (svg_j.width - padding) + ' ' + (svg_j.height - padding) + '"';
		}

		var init_height = svg_j.height,
			init_width = svg_j.width;

		k = (height - padding) / init_height;
		svg_j.height = height;
		svg_j.width = (init_width * k).round(0);

		if(svg_j.width > width){
			k = (width - padding) / init_width;
			svg_j.height = (init_height * k).round(0);
			svg_j.width = width;
		}

		if(k > max_zoom){
			k = max_zoom;
			svg_j.height = (init_height * k).round(0);
			svg_j.width = (init_width * k).round(0);
		}

		svg_j.x = (svg_j.x * k).round(0);
		svg_j.y = (svg_j.y * k).round(0);

		return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" ' +
			'width="' + svg_j.width + '" ' +
			'height="' + svg_j.height + '" ' +
			'x="' + svg_j.x + '" ' +
			'y="' + svg_j.y + '" ' +
			'xml:space="preserve" ' + viewBox + '>' + svg_body + '</svg>';
	};

	this.bind_help = function (wnd, path) {

		function frm_help(win){
			if(!win.help_path){
				$p.msg.show_msg({
					title: "Справка",
					type: "alert-info",
					text: $p.msg.not_implemented
				});
				return;
			}
		}

		if(wnd instanceof dhtmlXCellObject) {
		}else{
			if(!wnd.help_path && path)
				wnd.help_path = path;

			wnd.button('help').show();
			wnd.button('help').enable();
			wnd.attachEvent("onHelp", frm_help);
		}

	};

	this.set_hash = function (obj, ref, frm, view ) {

		var ext = {},
			hprm = $p.job_prm.parse_url();

		if(arguments.length == 1 && typeof obj == "object"){
			ext = obj;
			if(ext.hasOwnProperty("obj")){
				obj = ext.obj;
				delete ext.obj;
			}
			if(ext.hasOwnProperty("ref")){
				ref = ext.ref;
				delete ext.ref;
			}
			if(ext.hasOwnProperty("frm")){
				frm = ext.frm;
				delete ext.frm;
			}
			if(ext.hasOwnProperty("view")){
				view = ext.view;
				delete ext.view;
			}
		}

		if(obj === undefined)
			obj = hprm.obj || "";
		if(ref === undefined)
			ref = hprm.ref || "";
		if(frm === undefined)
			frm = hprm.frm || "";
		if(view === undefined)
			view = hprm.view || "";

		var hash = "obj=" + obj + "&ref=" + ref + "&frm=" + frm + "&view=" + view;
		for(var key in ext){
			hash += "&" + key + "=" + ext[key];
		}

		if(location.hash.substr(1) == hash)
			iface.hash_route();
		else
			location.hash = hash;
	};

	this.hash_route = function (event) {

		var hprm = $p.job_prm.parse_url(),
			res = $p.eve.callEvent("hash_route", [hprm]),
			mgr;

		if((res !== false) && (!iface.before_route || iface.before_route(event) !== false)){

			if($p.ajax.authorized){

				if(hprm.ref && typeof _md != "undefined"){
					mgr = _md.mgr_by_class_name(hprm.obj);
					if(mgr)
						mgr[hprm.frm || "form_obj"](iface.docs, hprm.ref)

				}else if(hprm.view && iface.swith_view){
					iface.swith_view(hprm.view);

				}

			}
		}

		if(event)
			return iface.cancel_bubble(event);
	};

	this.cancel_bubble = function(e, prevent) {
		var evt = (e || event);
    evt && prevent && evt.preventDefault && evt.preventDefault();
		evt && evt.stopPropagation && evt.stopPropagation();
		if (evt && !evt.cancelBubble){
      evt.cancelBubble = true;
    }
		return false
	};

	this.Col_struct = Col_struct;

	this.init_sidebar = function (items, buttons, icons_path) {

		iface.btn_auth_sync = new iface.OBtnAuthSync();

		iface.btns_nav = function (wrapper) {
			return iface.btn_auth_sync.bind(new iface.OTooolBar({
				wrapper: wrapper,
				class_name: 'md_otbnav',
				width: '260px', height: '28px', top: '3px', right: '3px', name: 'right',
				buttons: buttons,
				onclick: function (name) {
					iface.main.cells(name).setActive(true);
					return false;
				}
			}))
		};

		iface.main = new dhtmlXSideBar({
			parent: document.body,
			icons_path: icons_path || "dist/imgs/",
			width: 180,
			header: true,
			template: "tiles",
			autohide: true,
			items: items,
			offsets: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		});

		iface.main.attachEvent("onSelect", function(id){

			var hprm = $p.job_prm.parse_url();
			if(hprm.view != id)
				iface.set_hash(hprm.obj, hprm.ref, hprm.frm, id);

			iface["view_" + id](iface.main.cells(id));

		});

		iface.main.progressOn();

		var hprm = $p.job_prm.parse_url();
		if(!hprm.view || iface.main.getAllItems().indexOf(hprm.view) == -1){
			iface.set_hash(hprm.obj, hprm.ref, hprm.frm, "doc");
		} else
			setTimeout(iface.hash_route);
	};

	function All_meta_objs(cont, classes, frm_attr) {

		var layout = this.layout = cont.attachLayout({
			pattern: "2U",
			cells: [{
				id: "a",
				text: "Разделы",
				collapsed_text: "Разделы",
				width: 220
			}, {
				id: "b",
				text: "Раздел",
				header: false
			}],
			offsets: { top: 0, right: 0, bottom: 0, left: 0}
		});

		var tree = this.tree = layout.cells("a").attachTreeView();
    tree.attachEvent("onSelect", function (name, mode) {
			if(!mode)
				return;
			var mgr = $p.md.mgr_by_class_name(name);
			if(mgr instanceof DataProcessorsManager){
				mgr.form_rep(layout.cells("b"), frm_attr || {hide_header: true});

			}else if(mgr){
				mgr.form_list(layout.cells("b"), frm_attr || {hide_header: true});
			}

		}.bind(this));


		if(!classes){
			var md_classes = $p.md.get_classes();
			classes = [];
			for(var cl in md_classes){
				if(md_classes[cl].length)
					classes.push(cl);
			}
		}

		if(classes.length == 1){
			$p.md.get_classes()[classes[0]].forEach(function (name) {
				var key = classes[0]+"."+name,
					meta = $p.md.get(key);
				if(!meta.hide){
          tree.addItem(key, meta.list_presentation || meta.synonym);
          tree.setItemIcons(key, {file: "icon_1c_"+classes[0]});
				}
			}.bind(this));

		}else{
			classes.forEach(function (id) {
        tree.addItem(id, $p.msg["meta_"+id]);
        tree.setItemIcons(id, {file: "icon_1c_"+id, folder_opened: "icon_1c_"+id, folder_closed: "icon_1c_"+id});
				$p.md.get_classes()[id].forEach(function (name) {
					var key = id+"."+name,
						meta = $p.md.get(key);
					if(!meta.hide){
            tree.addItem(key, meta.list_presentation || meta.synonym, id);
            tree.setItemIcons(key, {file: "icon_1c_"+id});
					}
				});
			});
		}
	}

	this.All_meta_objs = All_meta_objs;

	function Setting2col(cont) {

		cont.attachHTMLString($p.injected_data['view_settings.html']);
		this.cont = cont.cell.querySelector(".dhx_cell_cont_tabbar");
		this.cont.style.overflow = "auto";

		this.form2 = (function (cont) {

			var form = new dhtmlXForm(cont, [

				{ type:"settings", labelWidth:80, position:"label-left"  },

				{type: "label", labelWidth:320, label: "Адрес CouchDB", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"couch_path", label:"Путь:", validate:"NotEmpty"},
				{type:"template", label:"",value:"",
					note: {text: "Можно указать как относительный, так и абсолютный URL публикации CouchDB", width: 320}},

				{type: "label", labelWidth:320, label: "Адрес http сервиса 1С", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"rest_path", label:"Путь", validate:"NotEmpty"},
				{type:"template", label:"",value:"",
					note: {text: "Можно указать как относительный, так и абсолютный URL публикации 1С OData", width: 320}},

				{type: "label", labelWidth:320, label: "Значение разделителя данных", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"zone", label:"Зона:", numberFormat: ["0", "", ""], validate:"NotEmpty,ValidInteger"},
				{type:"template", label:"",value:"", note: {text: "Для неразделенной публикации, зона = 0", width: 320}},

				{type: "label", labelWidth:320, label: "Суффикс базы пользователя", className: "label_options"},
				{type:"input" , inputWidth: 220, name:"couch_suffix", label:"Суффикс:"},
				{type:"template", label:"",value:"",
					note: {text: "Назначается абоненту при регистрации", width: 320}},

				{type:"block", blockOffset: 0, name:"block_buttons", list:[
					{type: "button", name: "save", value: "<i class='fa fa-floppy-o fa-lg'></i>", tooltip: "Применить настройки и перезагрузить программу"},
					{type:"newcolumn"},
					{type: "button", offsetLeft: 20, name: "reset", value: "<i class='fa fa-refresh fa-lg'></i>", tooltip: "Стереть справочники и перезаполнить данными сервера"}
				]
				}
			]);

			form.cont.style.fontSize = "100%";

			["zone", "couch_path", "couch_suffix", "rest_path"].forEach(function (prm) {
				if(prm == "zone")
					form.setItemValue(prm, $p.wsql.get_user_param(prm));
				else
					form.setItemValue(prm, $p.wsql.get_user_param(prm) || $p.job_prm[prm]);
			});

			form.attachEvent("onChange", function (name, value, state){
				$p.wsql.set_user_param(name, name == "enable_save_pwd" ? state || "" : value);
			});

			form.disableItem("couch_suffix");

			if(!$p.job_prm.rest_path)
				form.disableItem("rest_path");

			form.attachEvent("onButtonClick", function(name){

				if(name == "save"){

					$p.wsql.pouch.log_out();

					setTimeout(function () {
						$p.eve.redirect = true;
						location.reload(true);
					}, 1000);

				} else if(name == "reset"){

					dhtmlx.confirm({
						title: "Сброс данных",
						text: "Стереть справочники и перезаполнить данными сервера?",
						cancel: $p.msg.cancel,
						callback: function(btn) {
							if(btn)
								$p.wsql.pouch.reset_local_data();
						}
					});
				}
			});

			return form;

		})(this.cont.querySelector("[name=form2]").firstChild);

		this.form1 = (function (cont) {

			var form = new dhtmlXForm(cont, [
				{ type:"settings", labelWidth:320, position:"label-left"  },

				{type: "label", label: "Тип устройства", className: "label_options"},
				{ type:"block", blockOffset: 0, name:"block_device_type", list:[
					{ type:"settings", labelAlign:"left", position:"label-right"  },
					{ type:"radio" , name:"device_type", labelWidth:120, label:'<i class="fa fa-desktop"></i> Компьютер', value:"desktop"},
					{ type:"newcolumn"   },
					{ type:"radio" , name:"device_type", labelWidth:150, label:'<i class="fa fa-mobile fa-lg"></i> Телефон, планшет', value:"phone"}
				]  },
				{type:"template", label:"",value:"", note: {text: "Класс устройства определяется автоматически, но пользователь может задать его явно", width: 320}},

				{type: "label", label: "Сохранять пароль пользователя", className: "label_options"},
				{type:"checkbox", name:"enable_save_pwd", label:"Разрешить:", labelWidth:90, checked: $p.wsql.get_user_param("enable_save_pwd", "boolean")},
				{type:"template", label:"",value:"", note: {text: "Не рекомендуется, если к компьютеру имеют доступ посторонние лица", width: 320}},
				{type:"template", label:"",value:"", note: {text: "", width: 320}},

				{type: "label", label: "Подключаемые модули", className: "label_options"},
				{type:"input" , position:"label-top", inputWidth: 320, name:"modifiers", label:"Модификаторы:", value: $p.wsql.get_user_param("modifiers"), rows: 3, style:"height:80px;"},
				{type:"template", label:"",value:"", note: {text: "Список дополнительных модулей", width: 320}}

			]);

			form.cont.style.fontSize = "100%";

			form.checkItem("device_type", $p.job_prm.device_type);

			form.attachEvent("onChange", function (name, value, state){
				$p.wsql.set_user_param(name, name == "enable_save_pwd" ? state || "" : value);

			});

			form.disableItem("modifiers");
			form.getInput("modifiers").onchange = function () {
				$p.wsql.set_user_param("modifiers", this.value);
			};

			return form;

		})(this.cont.querySelector("[name=form1]").firstChild);

	}

	this.Setting2col = Setting2col;

	this.do_reload = function (text, title) {

		var confirm_count = 0;

		function do_reload(){

			dhtmlx.confirm({
				title: title || $p.msg.file_new_date_title,
				text: text || $p.msg.file_new_date,
				ok: "Перезагрузка",
				cancel: "Продолжить",
				callback: function(btn) {

					if(btn){

						$p.wsql.pouch.log_out();

						setTimeout(function () {
							$p.eve.redirect = true;
							location.reload(true);
						}, 1000);

					}else{

						confirm_count++;
						setTimeout(do_reload, confirm_count * 30000);

					}
				}
			});

		}

		do_reload();
	}

  this.check_exit = function (wnd){
    var do_exit;
    this.w.forEachWindow(function (w) {
      if(w != wnd && (w.isModal() || $p.iface.w.getTopmostWindow() == w))
        do_exit = true;
    });
    return do_exit;
  }
}


$p.__define({

	iface: {
		value: new InterfaceObjs(),
		writable: false
	},

	current_user: {
		get: function () {

      if($p.CatUsers && !$p.CatUsers.prototype.hasOwnProperty("role_available")){

        $p.CatUsers.prototype.__define({


          role_available: {
            value: function (name) {
              return true;
            }
          },

          get_acl: {
            value: function(class_name) {
              return "rvuidepo";
            }
          },

        });
      }

      if(!$p.cat || !$p.cat.users){
        return $p.utils.blank.guid;
      }
      var res = $p.cat.users.by_id($p.wsql.get_user_param("user_name"));


			return res;
		}
	},



	load_script: {
		value: function (src, type, callback) {

			return new Promise(function(resolve, reject){

				var s = document.createElement(type);
				if (type == "script") {
					s.type = "text/javascript";
					s.src = src;
					s.async = true;
					s.addEventListener('load', callback ? function () {
						callback();
						resolve();
					} : resolve, false);

				} else {
					s.type = "text/css";
					s.rel = "stylesheet";
					s.href = src;
				}
				document.head.appendChild(s);

				if(type != "script")
					resolve()

			});
		}
	}

});

$p.utils.__define({

  docxtemplater: {
    value: function (blob) {
      return (window.Docxtemplater ?
        Promise.resolve() :
        Promise.all([
          $p.load_script("https://cdn.jsdelivr.net/jszip/2/jszip.min.js", "script"),
          $p.load_script("https://cdn.jsdelivr.net/combine/gh/open-xml-templating/docxtemplater-build/build/docxtemplater-latest.min.js,gh/open-xml-templating/docxtemplater-image-module-build/build/docxtemplater-image-module-latest.min.js", "script"),
        ]))
        .then(function () {
          if(!Docxtemplater.prototype.saveAs){
            Docxtemplater.prototype.saveAs = function (name) {
              var out = this.getZip().generate({type: "blob", mimeType: $p.utils.mime_lookup('docx')});
              $p.wsql.alasql.utils.saveAs(out, name);
            };
          }
          return $p.utils.blob_as_text(blob, 'array');
        })
        .then(function (buffer) {
          return new Docxtemplater().loadZip(new JSZip(buffer));
        });
    }
  }

})

function Pouch(){

	var t = this,
		_paths = {},
		_local, _remote, _auth, _data_loaded;

	t.__define({

		DB: {
			value: typeof PouchDB === "undefined" ?
				require('pouchdb-core')
					.plugin(require('pouchdb-adapter-memory'))
					.plugin(require('pouchdb-adapter-http'))
					.plugin(require('pouchdb-replication'))
					.plugin(require('pouchdb-mapreduce'))
					.plugin(require('pouchdb-find')) : PouchDB
		},

		init: {
			value: function (attr) {
				_paths._mixin(attr);
				if(_paths.path && _paths.path.indexOf("http") != 0 && typeof location != "undefined"){
					_paths.path = location.protocol + "//" + location.host + _paths.path;
				}
			}
		},

		local: {
			get: function () {
				if(!_local){
					var opts = {auto_compaction: true, revs_limit: 2};
          _local = {
            ram: new t.DB(_paths.prefix + _paths.zone + "_ram", opts),
            doc: _paths.direct ? t.remote.doc : new t.DB(_paths.prefix + _paths.zone + "_doc", opts),
            meta: new t.DB(_paths.prefix + "meta", opts),
            sync: {}
          }
				}
				if(_paths.path && !_local._meta){
					_local._meta = new t.DB(_paths.path + "meta", {skip_setup: true});
					t.run_sync(_local.meta, _local._meta, "meta");
				}
				return _local;
			}
		},

		remote: {
			get: function () {
				if(!_remote){
					var opts = {skip_setup: true, adapter: 'http'};
          _remote = {};
          $p.md.bases().forEach(function (db) {
            _remote[db] = db == 'ram' ?
              new t.DB(_paths.path + _paths.zone + "_" + db, opts) :
              new t.DB(_paths.path + _paths.zone + "_" + db + (_paths.suffix ? "_" + _paths.suffix : ""), opts)
          })
				}
				return _remote;
			}
		},

		log_in: {
			value: function (username, password) {

				if (username == undefined && password == undefined){
					if($p.job_prm.guests && $p.job_prm.guests.length) {
						username = $p.job_prm.guests[0].username;
						password = $p.aes.Ctr.decrypt($p.job_prm.guests[0].password);
					}else{
						return Promise.reject(new Error("username & password not defined"));
					}
				}

				if (_auth) {
					if (_auth.username == username){
						return Promise.resolve();
					} else {
						return Promise.reject(new Error("need logout first"));
					}
				}

				var bases = $p.md.bases(),
					try_auth = [];

				this.remote;

				bases.forEach(function(name){
					try_auth.push(
						_remote[name].login(username, password)
					)
				})

				return Promise.all(try_auth)
					.then(function (){

						_auth = {username: username};
						setTimeout(function(){

							if($p.wsql.get_user_param("user_name") != username){
								$p.wsql.set_user_param("user_name", username)
							}

							if($p.wsql.get_user_param("enable_save_pwd")){
								if($p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd")) != password){
									$p.wsql.set_user_param("user_pwd", $p.aes.Ctr.encrypt(password))   
								}
							}
							else if($p.wsql.get_user_param("user_pwd") != ""){
								$p.wsql.set_user_param("user_pwd", "")
							}

							$p.eve.callEvent('user_log_in', [username]);
						});

            try_auth.length = 0;
            bases.forEach(function(dbid) {
              if(t.local[dbid] && t.remote[dbid] && t.local[dbid] != t.remote[dbid]){
                try_auth.push(t.run_sync(t.local[dbid], t.remote[dbid], dbid));
              }
            });
            return Promise.all(try_auth);
					})
          .then(function () {
            if(t.local._loading){
              return new Promise(function (resolve, reject) {
                $p.eve.attachEvent("pouch_data_loaded", resolve);
              });
            }
            else{
              return t.call_data_loaded();
            }
          })
					.catch(function(err) {
						$p.eve.callEvent("user_log_fault", [err])
					})
			}
		},

		log_out: {
			value: function () {

				if(_auth){
					if(_local.sync.doc){
						try{
							_local.sync.doc.cancel();
						}catch(err){}
					}
					if(_local.sync.ram){
						try{
							_local.sync.ram.cancel();
						}catch(err){}
					}
					_auth = null;
				}

				$p.eve.callEvent("log_out");

				if(_paths.direct){
					setTimeout(function () {
						$p.eve.redirect = true;
						location.reload(true);
					}, 1000);
				}

				return _remote && _remote.ram ?
					_remote.ram.logout()
						.then(function () {
							if(_remote && _remote.doc){
								return _remote.doc.logout()
							}
						})
						.then(function () {
							if(_remote && _remote.ram){
								delete _remote.ram;
							}
							if(_remote && _remote.doc){
								delete _remote.doc;
							}
							_remote = null;
							$p.eve.callEvent("user_log_out")
						})
					:
					Promise.resolve();
			}
		},

		reset_local_data: {
			value: function () {

				var destroy_ram = t.local.ram.destroy.bind(t.local.ram),
					destroy_doc = t.local.doc.destroy.bind(t.local.doc),
					do_reload = function (){
						setTimeout(function () {
							$p.eve.redirect = true;
							location.reload(true);
						}, 1000);
					};

				t.log_out();

				setTimeout(function () {
					destroy_ram()
						.then(destroy_doc)
						.catch(destroy_doc)
						.then(do_reload)
						.catch(do_reload);
				}, 1000);

			}
		},

    call_data_loaded: {
		  value: function (page) {
        _data_loaded = true;
        if(!page){
          page = _local.sync._page || {};
        }
        return $p.md.load_doc_ram().then(function () {
          setTimeout(function () {
            $p.eve.callEvent(page.note = "pouch_data_loaded", [page]);
          }, 1000);
        });
      }
    },

		load_data: {
			value: function () {

				var options = {
					limit : 800,
					include_docs: true
				},
					_page = {
						total_rows: 0,
						limit: options.limit,
						page: 0,
						start: Date.now()
					};

				return new Promise(function(resolve, reject){

					function fetchNextPage() {
						t.local.ram.allDocs(options, function (err, response) {

							if (response) {

								_page.page++;
								_page.total_rows = response.total_rows;
								_page.duration = Date.now() - _page.start;
								$p.eve.callEvent("pouch_load_data_page", [_page]);

								if (t.load_changes(response, options))
									fetchNextPage();
								else{
									resolve();
                  t.call_data_loaded(_page);
								}

							} else if(err){
								reject(err);
								$p.eve.callEvent("pouch_load_data_error", [err]);
							}
						});
					}

					t.local.ram.info()
						.then(function (info) {
							if(info.doc_count >= ($p.job_prm.pouch_ram_doc_count || 10)){
								$p.eve.callEvent("pouch_load_data_start", [_page]);
                t.local._loading = true;
								fetchNextPage();
							}else{
								$p.eve.callEvent("pouch_load_data_error", [info]);
								reject(info);
							}
						});
				});

			}
		},

		authorized: {
			get: function () {
				return _auth && _auth.username;
			}
		},


		data_loaded: {
			get: function () {
				return !!_data_loaded;
			}
		},

		run_sync: {
			value: function (local, remote, id){

				var linfo, _page;

				return local.info()
					.then(function (info) {
						linfo = info;
						return remote.info()
					})
					.then(function (rinfo) {

						if(id != "ram"){
              return rinfo;
            }

						return remote.get("data_version")
							.then(function (v) {
								if(v.version != $p.wsql.get_user_param("couch_ram_data_version")){

									if($p.wsql.get_user_param("couch_ram_data_version"))
										rinfo = t.reset_local_data();

									$p.wsql.set_user_param("couch_ram_data_version", v.version);

								}
								return rinfo;
							})
							.catch(function (err) {
								$p.record_log(err);
							})
							.then(function () {
								return rinfo;
							});

					})
					.then(function (rinfo) {

						if(!rinfo){
              return;
            }

            _page = {
              id: id,
              total_rows: rinfo.doc_count + rinfo.doc_del_count,
              local_rows: linfo.doc_count,
              docs_written: 0,
              limit: 200,
              page: 0,
              start: Date.now()
            };

						if(id == "ram" && linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)){
							$p.eve.callEvent("pouch_load_data_start", [_page]);
						}
						else{
              $p.eve.callEvent("pouch_" + id + "_sync_start");
						}

            return new Promise(function(resolve, reject){

              var options = {
                batch_size: 200,
                batches_limit: 6
              };

              function sync_events(sync, options) {

                return sync.on('change', function (change) {

                  if(!_data_loaded && linfo.doc_count < ($p.job_prm.pouch_ram_doc_count || 10)){
                    _page.page++;
                    _page.docs_written = change.docs_written;
                    _page.duration = Date.now() - _page.start;
                    $p.eve.callEvent("pouch_load_data_page", [_page]);
                  }

                  if(id != "ram"){
                    change.update_only = true;
                  }
                  t.load_changes(change);
                  $p.eve.callEvent("pouch_change", [id, change]);

                })
                  .on('paused', function (info) {
                    $p.eve.callEvent("pouch_paused", [id, info]);
                  })
                  .on('active', function (info) {
                    $p.eve.callEvent("pouch_active", [id, info]);
                  })
                  .on('denied', function (info) {
                    $p.eve.callEvent("pouch_denied", [id, info]);
                  })
                  .on('complete', function (info) {
                    if(options){
                      options.live = true;
                      options.retry = true;

                      if(id == "ram" || id == "meta" || $p.wsql.get_user_param("zone") == $p.job_prm.zone_demo){
                        _local.sync[id] = sync_events(local.replicate.from(remote, options));
                      }else{
                        _local.sync[id] = sync_events(local.sync(remote, options));
                      }
                      resolve(id);
                    }
                  })
                  .on('error', function (err) {
                    reject([id, err]);
                    $p.eve.callEvent("pouch_error", [id, err]);
                  });
              }

              if(id == "meta"){
                options.filter = "auth/meta";
                options.live = true;
                options.retry = true;
              }
              else if($p.job_prm.pouch_filter && $p.job_prm.pouch_filter[id]){
                options.filter = $p.job_prm.pouch_filter[id];
              }

              sync_events(local.replicate.from(remote, options), options)

            });

					});
			}
		},

		load_obj: {
			value: function (tObj) {

				return tObj._manager.pouch_db.get(tObj.class_name + "|" + tObj.ref)
					.then(function (res) {
						delete res._id;
						delete res._rev;
						tObj._mixin(res)._set_loaded();
					})
					.catch(function (err) {
						if(err.status != 404)
							throw err;
					})
					.then(function (res) {
						return tObj;
					});
			}
		},

		save_obj: {
			value: function (tObj, attr) {

			  var _data = tObj._data;
        if(!_data || (_data._saving && !_data._modified)){
          return Promise.resolve(tObj);
        }
        if(_data._saving && _data._modified){
          return new Promise(function(resolve, reject) {
            setTimeout(function(){
              resolve(t.save_obj(tObj, attr));
            }, 100);
          });
        }
        _data._saving = true;

				var tmp = tObj._obj._clone(void 0, true),
					db = attr.db || tObj._manager.pouch_db;

        tmp.class_name = tObj.class_name;
				tmp._id = tmp.class_name + "|" + tObj.ref;
				delete tmp.ref;

				if(attr.attachments){
          tmp._attachments = attr.attachments;
        }

				return (tObj.is_new() ? Promise.resolve() : db.get(tmp._id))
					.then(function (res) {
						if(res){
							tmp._rev = res._rev;
							for(var att in res._attachments){
								if(!tmp._attachments)
									tmp._attachments = {};
								if(!tmp._attachments[att])
									tmp._attachments[att] = res._attachments[att];
							}
						}
					})
					.catch(function (err) {
						if(err && err.status != 404){
              throw err;
            }
					})
					.then(function () {
						return db.put(tmp);
					})
					.then(function () {

						if(tObj.is_new())
							tObj._set_loaded(tObj.ref);

						if(tmp._attachments){
							if(!tObj._attachments)
								tObj._attachments = {};
							for(var att in tmp._attachments){
								if(!tObj._attachments[att] || !tmp._attachments[att].stub)
									tObj._attachments[att] = tmp._attachments[att];
							}
						}

            delete _data._saving;
						return tObj;
					})
          .catch(function (err) {
            delete _data._saving;
            if(err && err.status != 404){
              throw err;
            }
          });
			}
		},

		load_changes: {
			value: function(changes, options){

				var docs, doc, res = {}, cn, key;

				if(!options){
					if(changes.direction){
						if(changes.direction != "pull")
							return;
						docs = changes.change.docs;
					}else
						docs = changes.docs;
				}
				else
					docs = changes.rows;

				if (docs.length > 0) {
					if(options){
						options.startkey = docs[docs.length - 1].key;
						options.skip = 1;
					}

					docs.forEach(function (rev) {
						doc = options ? rev.doc : rev;
						if(!doc){
							if((rev.value && rev.value.deleted))
								doc = {
									_id: rev.id,
									_deleted: true
								};
							else if(rev.error)
								return;
						}
						key = doc._id.split("|");
						cn = key[0].split(".");
						doc.ref = key[1];
						delete doc._id;
						delete doc._rev;
						if(!res[cn[0]])
							res[cn[0]] = {};
						if(!res[cn[0]][cn[1]])
							res[cn[0]][cn[1]] = [];
						res[cn[0]][cn[1]].push(doc);
					});

					for(var mgr in res){
						for(cn in res[mgr]){
							if($p[mgr] && $p[mgr][cn]){
								$p[mgr][cn].load_array(res[mgr][cn],
                  changes.update_only && $p[mgr][cn].cachable.indexOf("ram") == -1 ? "update_only" : true);
							}
						}
					}

					return true;
				}

				return false;
			}
		},


		backup_database: {
			value: function(do_zip){



			}
		},

		restore_database: {
			value: function(do_zip){



			}

		}

	});

}





function Messages(){

	this.toString = function(){return "Интернационализация сообщений"};


	if(typeof window !== "undefined" && "dhtmlx" in window){

		this.show_msg = function(attr, delm){
			if(!attr){
        return;
      }
			if(typeof attr == "string"){
				if($p.iface.synctxt){
					$p.iface.synctxt.show_message(attr);
					return;
				}
				attr = {type:"info", text:attr };
			}
			else if(Array.isArray(attr) && attr.length > 1){
        attr = {type: "info", text: '<b>' + attr[0] + '</b><br />' + attr[1]};
      }
			if(delm && typeof delm.setText == "function"){
        delm.setText(attr.text);
      }
			dhtmlx.message(attr);
		};
    dhtmlx.message.position = "bottom";

		this.check_soap_result = function(res){
			if(!res){
				$p.msg.show_msg({
					type: "alert-error",
					text: $p.msg.empty_response,
					title: $p.msg.error_critical});
				return true;

			}else if(res.error=="limit_query"){
				$p.iface.docs.progressOff();
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.limit_query.replace("%1", res["queries"]).replace("%2", res["queries_avalable"]),
					title: $p.msg.srv_overload});
				return true;

			}else if(res.error=="network" || res.error=="empty"){
				$p.iface.docs.progressOff();
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.error_network,
					title: $p.msg.error_critical});
				return true;

			}else if(res.error && res.error_description){
				$p.iface.docs.progressOff();
				if(res.error_description.indexOf("Недостаточно прав") != -1){
					res["error_type"] = "alert-warning";
					res["error_title"] = $p.msg.error_rights;
				}
				$p.msg.show_msg({
					type: res["error_type"] || "alert-error",
					text: res.error_description,
					title: res["error_title"] || $p.msg.error_critical
				});
				return true;

			}else if(res.error && !res.messages){
				$p.iface.docs.progressOff();
				$p.msg.show_msg({
					type: "alert-error",
					title: $p.msg.error_critical,
					text: $p.msg.unknown_error.replace("%1", "unknown_error")
				});
				return true;
			}

		};

		this.show_not_implemented = function(){
			$p.msg.show_msg({type: "alert-warning",
				text: $p.msg.not_implemented,
				title: $p.msg.main_title});
		};

	}
}

if(typeof window !== "undefined" && window.dhx4){
	dhx4.dateFormat.ru = "%d.%m.%Y";
	dhx4.dateLang = "ru";
	dhx4.dateStrings = {
		ru: {
			monthFullName:	["Январь","Февраль","Март","Апрель","Maй","Июнь","Июль","Август","Сентябрь","Oктябрь","Ноябрь","Декабрь"],
			monthShortName:	["Янв","Фев","Maр","Aпр","Maй","Июн","Июл","Aвг","Сен","Окт","Ноя","Дек"],
			dayFullName:	["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],
			dayShortName:	["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]
		}
	};
}


(function (msg){

	msg.store_url_od = "https://chrome.google.com/webstore/detail/hcncallbdlondnoadgjomnhifopfaage";

	msg.argument_is_not_ref = "Аргумент не является ссылкой";
	msg.addr_title = "Ввод адреса";

	msg.cache_update_title = "Обновление кеша браузера";
	msg.cache_update = "Выполняется загрузка измененных файлов<br/>и их кеширование в хранилище браузера";
	msg.cancel = "Отмена";

	msg.delivery_area_empty = "Укажите район доставки";

	msg.empty_login_password = "Не указаны имя пользователя или пароль";
	msg.empty_response = "Пустой ответ сервера";
	msg.empty_geocoding = "Пустой ответ геокодера. Вероятно, отслеживание адреса запрещено в настройках браузера";
	msg.error_geocoding = "Ошибка геокодера";

	msg.error_auth = "Авторизация пользователя не выполнена";
	msg.error_critical = "Критическая ошибка";
	msg.error_metadata = "Ошибка загрузки метаданных конфигурации";
	msg.error_network = "Ошибка сети или сервера - запрос отклонен";
	msg.error_rights = "Ограничение доступа";
	msg.error_low_acl = "Недостаточно прав для выполнения операции";

	msg.file_size = "Запрещена загрузка файлов<br/>размером более ";
	msg.file_confirm_delete = "Подтвердите удаление файла ";
	msg.file_new_date = "Файлы на сервере обновлены<br /> Рекомендуется закрыть браузер и войти<br />повторно для применения обновления";
	msg.file_new_date_title = "Версия файлов";

	msg.init_catalogues = "Загрузка справочников с сервера";
	msg.init_catalogues_meta = ": Метаданные объектов";
	msg.init_catalogues_tables = ": Реструктуризация таблиц";
	msg.init_catalogues_nom = ": Базовые типы + номенклатура";
	msg.init_catalogues_sys = ": Технологические справочники";
	msg.init_login = "Укажите имя пользователя и пароль";

	msg.requery = "Повторите попытку через 1-2 минуты";

	msg.limit_query = "Превышено число обращений к серверу<br/>Запросов за минуту:%1<br/>Лимит запросов:%2<br/>" + msg.requery;
	msg.long_operation = "Длительная операция";
	msg.logged_in = "Авторизован под именем: ";
	msg.log_out_title = "Отключиться от сервера?";
	msg.log_out_break = "<br/>Завершить синхронизацию?";
	msg.sync_title = "Обмен с сервером";
	msg.sync_complite = "Синхронизация завершена";

	msg.main_title = "Окнософт: заказ дилера ";
	msg.mark_delete_confirm = "Пометить объект %1 на удаление?";
	msg.mark_undelete_confirm = "Снять пометку удаления с объекта %1?";
	msg.meta = {
		cat: "Справочник",
		doc: "Документ",
		cch: "План видов характеристик",
		cacc: "Планы счетов",
		tsk : "Задача",
		ireg: "Регистр сведений",
		areg: "Регистр накопления",
		bp: "Бизнес процесс",
		ts_row: "Строка табличной части",
		dp: "Обработка",
		rep: "Отчет"
	};
	msg.meta_cat = "Справочники";
	msg.meta_doc = "Документы";
	msg.meta_cch = "Планы видов характеристик";
	msg.meta_cacc = "Планы счетов";
	msg.meta_tsk = "Задачи";
	msg.meta_ireg = "Регистры сведений";
	msg.meta_areg = "Регистры накопления";
	msg.meta_mgr = "Менеджер";
	msg.meta_cat_mgr = "Менеджер справочников";
	msg.meta_doc_mgr = "Менеджер документов";
	msg.meta_enn_mgr = "Менеджер перечислений";
	msg.meta_ireg_mgr = "Менеджер регистров сведений";
	msg.meta_areg_mgr = "Менеджер регистров накопления";
	msg.meta_accreg_mgr = "Менеджер регистров бухгалтерии";
	msg.meta_dp_mgr = "Менеджер обработок";
	msg.meta_task_mgr = "Менеджер задач";
	msg.meta_bp_mgr = "Менеджер бизнес-процессов";
	msg.meta_reports_mgr = "Менеджер отчетов";
	msg.meta_cacc_mgr = "Менеджер планов счетов";
	msg.meta_cch_mgr = "Менеджер планов видов характеристик";
	msg.meta_extender = "Модификаторы объектов и менеджеров";

	msg.modified_close = "Объект изменен<br/>Закрыть без сохранения?";
	msg.mandatory_title = "Обязательный реквизит";
	msg.mandatory_field = "Укажите значение реквизита '%1'";

	msg.no_metadata = "Не найдены метаданные объекта '%1'";
	msg.no_selected_row = "Не выбрана строка табличной части '%1'";
	msg.no_dhtmlx = "Библиотека dhtmlx не загружена";
	msg.not_implemented = "Не реализовано в текущей версии";

	msg.offline_request = "Запрос к серверу в автономном режиме";
	msg.onbeforeunload = "Окнософт: легкий клиент. Закрыть программу?";
	msg.order_sent_title = "Подтвердите отправку заказа";
	msg.order_sent_message = "Отправленный заказ нельзя изменить.<br/>После проверки менеджером<br/>он будет запущен в работу";

	msg.report_error = "<i class='fa fa-exclamation-circle fa-2x fa-fw'></i> Ошибка";
	msg.report_prepare = "<i class='fa fa-spinner fa-spin fa-2x fa-fw'></i> Подготовка отчета";
	msg.report_need_prepare = "<i class='fa fa-info fa-2x fa-fw'></i> Нажмите 'Сформировать' для получения отчета";
	msg.report_need_online = "<i class='fa fa-plug fa-2x fa-fw'></i> Нет подключения. Отчет недоступен в автономном режиме";

	msg.request_title = "Запрос регистрации";
	msg.request_message = "Заявка зарегистрирована. После обработки менеджером будет сформировано ответное письмо";

	msg.select_from_list = "Выбор из списка";
	msg.select_grp = "Укажите группу, а не элемент";
	msg.select_elm = "Укажите элемент, а не группу";
	msg.select_file_import = "Укажите файл для импорта";

	msg.srv_overload = "Сервер перегружен";
	msg.sub_row_change_disabled = "Текущая строка подчинена продукции.<br/>Строку нельзя изменить-удалить в документе<br/>только через построитель";
	msg.sync_script = "Обновление скриптов приложения:";
	msg.sync_data = "Синхронизация с сервером выполняется:<br />* при первом старте программы<br /> * при обновлении метаданных<br /> * при изменении цен или технологических справочников";
	msg.sync_break = "Прервать синхронизацию";
	msg.sync_no_data = "Файл не содержит подходящих элементов для загрузки";

	msg.tabular_will_cleared = "Табличная часть '%1' будет очищена. Продолжить?";

	msg.unsupported_browser_title = "Браузер не поддерживается";
	msg.unsupported_browser = "Несовместимая версия браузера<br/>Рекомендуется Google Chrome";
	msg.supported_browsers = "Рекомендуется Chrome, Safari или Opera";
	msg.unsupported_mode_title = "Режим не поддерживается";
	msg.unsupported_mode = "Программа не установлена<br/> в <a href='" + msg.store_url_od + "'>приложениях Google Chrome</a>";
	msg.unknown_error = "Неизвестная ошибка в функции '%1'";

	msg.value = "Значение";

})($p.msg);






var _md;

function Meta() {

	var _m = {
		enm: {
			accumulation_record_type: [
				{
					order: 0,
					name: "debit",
					synonym: "Приход"
				},
				{
					order: 1,
					name: "credit",
					synonym: "Расход"
				}
			],
			sort_directions: [
				{
					order: 0,
					name: "asc",
					synonym: "По возрастанию"
				},
				{
					order: 1,
					name: "desc",
					synonym: "По убыванию"
				}
			],
			comparison_types: [
				{
					order: 0,
					name: "gt",
					synonym: "Больше"
				},
				{
					order: 1,
					name: "gte",
					synonym: "Больше или равно"
				},
				{
					order: 2,
					name: "lt",
					synonym: "Меньше"
				},
				{
					order: 3,
					name: "lte",
					synonym: "Меньше или равно "
				},
				{
					order: 4,
					name: "eq",
					synonym: "Равно"
				},
				{
					order: 5,
					name: "ne",
					synonym: "Не равно"
				},
				{
					"order": 6,
					"name": "in",
					"synonym": "В списке"
				},
				{
					order: 7,
					name: "nin",
					synonym: "Не в списке"
				},
				{
					order: 8,
					name: "lke",
					synonym: "Подобно "
				},
				{
					order: 9,
					name: "nlk",
					synonym: "Не подобно"
				}
			]
		},
		cat: {
      meta_objs: {
        fields: {}
      },
      meta_fields: {
        fields: {}
      },
      scheme_settings: {
        name: "scheme_settings",
        synonym: "Настройки отчетов и списков",
        input_by_string: [
          "name"
        ],
        hierarchical: false,
        has_owners: false,
        group_hierarchy: true,
        main_presentation_name: true,
        code_length: 0,
        fields: {
          obj: {
            synonym: "Объект",
            tooltip: "Имя класса метаданных",
            type: {
              types: [
                "string"
              ],
              str_len: 250
            }
          },
          user: {
            synonym: "Пользователь",
            tooltip: "Если пусто - публичная настройка",
            type: {
              types: [
                "string"
              ],
              str_len: 50
            }
          },
          order: {
            synonym: "Порядок",
            tooltip: "Порядок варианта",
            type: {
              types: [
                "number"
              ],
              digits: 6,
              fraction_figits: 0,
            }
          },
          query: {
            synonym: "Запрос",
            tooltip: "Индекс CouchDB или текст SQL",
            type: {
              types: [
                "string"
              ],
              str_len: 0
            }
          },
          date_from: {
            "synonym": "Начало периода",
            "tooltip": "",
            "type": {
              "types": [
                "date"
              ],
              "date_part": "date"
            }
          },
          date_till: {
            "synonym": "Конец периода",
            "tooltip": "",
            "type": {
              "types": [
                "date"
              ],
              "date_part": "date"
            }
          },
          formula: {
            synonym: "Формула",
            tooltip: "Формула инициализации",
            type: {
              types: [
                "cat.formulas"
              ],
              is_ref: true
            }
          },
          tag: {
            synonym: "Дополнительные свойства",
            type: {
              types: [
                "string"
              ],
              str_len: 0
            }
          }
        },
        tabular_sections: {
          fields: {
            name: "fields",
            synonym: "Доступные поля",
            tooltip: "Состав, порядок и ширина колонок",
            fields: {
              parent: {
                synonym: "Родитель",
                tooltip: "Для плоского списка, родитель пустой",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              use: {
                synonym: "Использование",
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                synonym: "Поле",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              width: {
                synonym: "Ширина",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 6
                }
              },
              caption: {
                synonym: "Заголовок",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              tooltip: {
                synonym: "Подсказка",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              ctrl_type: {
                synonym: "Тип",
                tooltip: "Тип элемента управления",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              formatter: {
                synonym: "Формат",
                tooltip: "Функция форматирования",
                type: {
                  types: [
                    "cat.formulas"
                  ],
                  is_ref: true
                }
              },
              editor: {
                synonym: "Редактор",
                tooltip: "Компонент редактирования",
                type: {
                  types: [
                    "cat.formulas"
                  ],
                  is_ref: true
                }
              }
            }
          },
          sorting: {
            name: "sorting",
            synonym: "Поля сортировки",
            tooltip: "",
            fields: {
              parent: {
                synonym: "Родитель",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              use: {
                synonym: "Использование",
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                synonym: "Поле",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              direction: {
                synonym: "Направление",
                tooltip: "",
                type: {
                  types: [
                    "enm.sort_directions"
                  ],
                  "is_ref": true
                }
              }
            }
          },
          dimensions: {
            name: "dimensions",
            synonym: "Поля группировки",
            tooltip: "",
            fields: {
              parent: {
                synonym: "Родитель",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              use: {
                synonym: "Использование",
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                synonym: "Поле",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              }
            }
          },
          resources: {
            name: "resources",
            synonym: "Ресурсы",
            tooltip: "",
            fields: {
              parent: {
                synonym: "Родитель",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              use: {
                synonym: "Использование",
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                synonym: "Поле",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              formula: {
                synonym: "Формула",
                tooltip: "По умолчанию - сумма",
                type: {
                  types: [
                    "cat.formulas"
                  ],
                  is_ref: true
                }
              }
            }
          },
          selection: {
            name: "selection",
            synonym: "Отбор",
            tooltip: "",
            fields: {
              parent: {
                synonym: "Родитель",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              use: {
                synonym: "Использование",
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              left_value: {
                synonym: "Левое значение",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              comparison_type: {
                synonym: "Вид сравнения",
                tooltip: "",
                type: {
                  types: [
                    "enm.comparison_types"
                  ],
                  is_ref: true
                }
              },
              right_value: {
                synonym: "Правое значение",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              }
            }
          },
          params: {
            name: "params",
            synonym: "Параметры",
            tooltip: "",
            fields: {
              param: {
                synonym: "Параметр",
                tooltip: "",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              value_type: {
                synonym: "Тип",
                tooltip: "Тип значения",
                type: {
                  types: [
                    "string"
                  ],
                  str_len: 100
                }
              },
              value: {
                synonym: "Значение",
                tooltip: "Может иметь примитивный или ссылочный тип или массив",
                type: {
                  types: [
                    "string",
                    "number",
                  ],
                  str_len: 0,
                  digits: 15,
                  fraction_figits: 3,
                }
              }
            }
          },
          composition: {
            name: "composition",
            synonym: "Структура",
            tooltip: "",
            fields: {
              parent: {
                "synonym": "Родитель",
                "multiline_mode": false,
                "tooltip": "",
                "type": {
                  "types": [
                    "string"
                  ],
                  "str_len": 10
                }
              },
              use: {
                synonym: "Использование",
                tooltip: "",
                type: {
                  types: [
                    "boolean"
                  ]
                }
              },
              field: {
                "synonym": "Элемент",
                "tooltip": "Элемент структуры отчета",
                "type": {
                  "types": [
                    "string"
                  ],
                  "str_len": 50
                }
              },
              kind: {
                "synonym": "Вид раздела отчета",
                "tooltip": "список, таблица, группировка строк, группировка колонок",
                "type": {
                  "types": [
                    "string"
                  ],
                  "str_len": 50
                }
              },
              definition: {
                "synonym": "Описание",
                "tooltip": "Описание раздела структуры",
                "type": {
                  "types": [
                    "string"
                  ],
                  "str_len": 50
                }
              }
            }
          }
        },
        cachable: "doc"
      }
		},
		doc: {},
		ireg: {
			log: {
				name: "log",
				note: "",
				synonym: "Журнал событий",
				dimensions: {
					date: {
						synonym: "Дата",
						multiline_mode: false,
						tooltip: "Время события",
						type: {
							types: [
								"number"
							],
							digits: 15,
							fraction_figits: 0
						}
					},
					sequence: {
						synonym: "Порядок",
						multiline_mode: false,
						tooltip: "Порядок следования",
						type: {
							types: [
								"number"
							],
							digits: 6,
							fraction_figits: 0
						}
					}
				},
				resources: {
					"class": {
						synonym: "Класс",
						multiline_mode: false,
						tooltip: "Класс события",
						type: {
							types: [
								"string"
							],
							str_len: 100
						}
					},
					note: {
						synonym: "Комментарий",
						multiline_mode: true,
						tooltip: "Текст события",
						type: {
							types: [
								"string"
							],
							str_len: 0
						}
					},
					obj: {
						synonym: "Объект",
						multiline_mode: true,
						tooltip: "Объект, к которому относится событие",
						type: {
							types: [
								"string"
							],
							str_len: 0
						}
					}
				}
			}
		},
		areg: {},
		dp: {
      scheme_settings: {
        name: "scheme_settings",
        synonym: "Варианты настроек",
        fields: {
          scheme: {
            synonym: "Текущая настройка",
            tooltip: "Текущий вариант настроек",
            mandatory: true,
            type: {
              types: [
                "cat.scheme_settings"
              ],
              is_ref: true
            }
          }
        }
      }
    },
		rep: {},
		cch: {},
		cacc: {}
	};

	_md = this;

	function meta_from_pouch(meta_db){

		return meta_db.info()
			.then(function () {
				return meta_db.get('meta');

			})
			.then(function (doc) {
				$p._patch(_m, doc);
				doc = null;
				return meta_db.get('meta_patch');

			}).then(function (doc) {
				$p._patch(_m, doc);
				doc = null;
				delete _m._id;
				delete _m._rev;
				return _m;
			});
	}


	_md.create_managers = function(){};

  _md.bases = function () {
    var res = {};
    for(var i in _m){
      for(var j in _m[i]){
        if(_m[i][j].cachable){
          var _name = _m[i][j].cachable.replace('_remote', '').replace('_ram', '');
          if(_name != 'meta' && _name != 'e1cib' && !res[_name])
            res[_name] = _name;
        }
      }
    }
    return Object.keys(res);
  }

  _md.load_doc_ram = function() {
    var res = [];
    ['cat','cch','ireg'].forEach(function (kind) {
      for (var name in _m[kind]) {
        if (_m[kind][name].cachable == 'doc_ram') {
          res.push(kind + '.' + name);
        }
      }
    });
    return $p.wsql.pouch.local.doc.find({
      selector: {class_name: {$in: res}},
      limit: 10000
    })
      .then($p.wsql.pouch.load_changes);
  }

	_md.init = function (meta_db) {

		var is_local = !meta_db || ($p.wsql.pouch && meta_db == $p.wsql.pouch.local.meta),
			is_remote = meta_db && ($p.wsql.pouch && meta_db == $p.wsql.pouch.local._meta);

		function do_init(){

			if(meta_db && !is_local && !is_remote){
				$p._patch(_m, meta_db);
				meta_db = null;

				_md.create_managers();

			}else{

				return meta_from_pouch(meta_db || $p.wsql.pouch.local.meta)
					.then(function () {
						if(is_local){
							_md.create_managers();

						}else{
							return _m;
						}
					})
					.catch($p.record_log);
			}
		}



		$p.on("pouch_change", function (dbid, change) {

			if (dbid != "meta")
				return;

			if(!_m)
				do_init();

			else if($p.iface && $p.iface.do_reload && change.docs && change.docs.length < 4){

				setTimeout(function () {
					$p.iface.do_reload();
				}, 10000);

			}

		});

		return do_init();

	};

	_md.get = function(class_name, field_name){

		var np = class_name.split(".");

		if(!field_name)
			return _m[np[0]][np[1]];

		var res = {multiline_mode: false, note: "", synonym: "", tooltip: "", type: {is_ref: false,	types: ["string"]}},
			is_doc = "doc,tsk,bp".indexOf(np[0]) != -1,
			is_cat = "cat,cch,cacc,tsk".indexOf(np[0]) != -1;

		if(is_doc && field_name=="number_doc"){
			res.synonym = "Номер";
			res.tooltip = "Номер документа";
			res.type.str_len = 11;

		}else if(is_doc && field_name=="date"){
			res.synonym = "Дата";
			res.tooltip = "Дата документа";
			res.type.date_part = "date_time";
			res.type.types[0] = "date";

		}else if(is_doc && field_name=="posted"){
			res.synonym = "Проведен";
			res.type.types[0] = "boolean";

		}else if(is_cat && field_name=="id"){
			res.synonym = "Код";

		}else if(is_cat && field_name=="name"){
			res.synonym = "Наименование";

		}else if(field_name=="_deleted"){
			res.synonym = "Пометка удаления";
			res.type.types[0] = "boolean";

		}else if(field_name=="is_folder"){
			res.synonym = "Это группа";
			res.type.types[0] = "boolean";

		}else if(field_name=="ref"){
			res.synonym = "Ссылка";
			res.type.is_ref = true;
			res.type.types[0] = class_name;

		}else if(field_name)
			res = _m[np[0]][np[1]].fields[field_name];

		else
			res = _m[np[0]][np[1]];

		return res;
	};

	_md.get_classes = function () {
		var res = {};
		for(var i in _m){
			res[i] = [];
			for(var j in _m[i])
				res[i].push(j);
		}
		return res;
	};

	_md.sql_type = function (mgr, f, mf, pg) {
		var sql;
		if((f == "type" && mgr.table_name == "cch_properties") || (f == "svg" && mgr.table_name == "cat_production_params"))
			sql = " JSON";

		else if(mf.is_ref || mf.types.indexOf("guid") != -1){
			if(!pg)
				sql = " CHAR";

			else if(mf.types.every(function(v){return v.indexOf("enm.") == 0}))
				sql = " character varying(100)";

			else if (!mf.hasOwnProperty("str_len"))
				sql = " uuid";

			else
				sql = " character varying(" + Math.max(36, mf.str_len) + ")";

		}else if(mf.hasOwnProperty("str_len"))
			sql = pg ? (mf.str_len ? " character varying(" + mf.str_len + ")" : " text") : " CHAR";

		else if(mf.date_part)
			if(!pg || mf.date_part == "date")
				sql = " Date";

			else if(mf.date_part == "date_time")
				sql = " timestamp with time zone";

			else
				sql = " time without time zone";

		else if(mf.hasOwnProperty("digits")){
			if(mf.fraction_figits==0)
				sql = pg ? (mf.digits < 7 ? " integer" : " bigint") : " INT";
			else
				sql = pg ? (" numeric(" + mf.digits + "," + mf.fraction_figits + ")") : " FLOAT";

		}else if(mf.types.indexOf("boolean") != -1)
			sql = " BOOLEAN";

		else if(mf.types.indexOf("json") != -1)
			sql = " JSON";

		else
			sql = pg ? " character varying(255)" : " CHAR";

		return sql;
	};

	_md.sql_composite = function (mf, f, f0, pg){
		var res = "";
		if(mf[f].type.types.length > 1 && f != "type"){
			if(!f0)
				f0 = f.substr(0, 29) + "_T";
			else{
				f0 = f0.substr(0, 29) + "_T";
			}

			if(pg)
				res = ', "' + f0 + '" character varying(255)';
			else
				res = _md.sql_mask(f0) + " CHAR";
		}
		return res;
	};

	_md.sql_mask = function(f, t){
		return ", " + (t ? "_t_." : "") + ("`" + f + "`");
	};

	_md.mgr_by_class_name = function(class_name){
		if(class_name){
			var np = class_name.split(".");
			if(np[1] && $p[np[0]])
				return $p[np[0]][np[1]];
		}
	};

	_md.value_mgr = function(row, f, mf, array_enabled, v){

		var property, oproperty, tnames, rt, mgr;

		if(mf._mgr instanceof DataManager){
			return mf._mgr;
		}

		function mf_mgr(mgr){
			if(mgr instanceof DataManager && mf.types.length == 1){
				mf._mgr = mgr;
			}
			return mgr;
		}

		if(mf.types.length == 1){
			tnames = mf.types[0].split(".");
			if(tnames.length > 1 && $p[tnames[0]])
				return mf_mgr($p[tnames[0]][tnames[1]]);

		}else if(v && v.type){
			tnames = v.type.split(".");
			if(tnames.length > 1 && $p[tnames[0]])
				return mf_mgr($p[tnames[0]][tnames[1]]);
		}

		property = row.property || row.param;
		if(f != "value" || !property){

			rt = [];
			mf.types.forEach(function(v){
				tnames = v.split(".");
				if(tnames.length > 1 && $p[tnames[0]][tnames[1]])
					rt.push($p[tnames[0]][tnames[1]]);
			});
			if(rt.length == 1 || row[f] == $p.utils.blank.guid)
				return mf_mgr(rt[0]);

			else if(array_enabled)
				return rt;

			else if((property = row[f]) instanceof DataObj)
				return property._manager;

			else if($p.utils.is_guid(property) && property != $p.utils.blank.guid){
				for(var i in rt){
					mgr = rt[i];
					if(mgr.get(property, false, true))
						return mgr;
				}
			}
		}else{

			if($p.utils.is_data_obj(property)){
				oproperty = property;
			}
			else if($p.utils.is_guid(property)){
				oproperty = $p.cch.properties.get(property, false);
			}
			else{
				return;
			}

			if($p.utils.is_data_obj(oproperty)){

				if(oproperty.is_new()){
					return $p.cat.property_values;
				}

				rt = [];
				oproperty.type.types.some(function(v){
					tnames = v.split(".");
					if(tnames.length > 1 && $p[tnames[0]][tnames[1]]){
						rt.push($p[tnames[0]][tnames[1]]);
					}
					else if(v == "boolean"){
						rt.push({types: ["boolean"]});
						return true
					}
				});
				if(rt.length == 1 || row[f] == $p.utils.blank.guid){
					return mf_mgr(rt[0]);
				}
				else if(array_enabled){
					return rt;
				}
				else if((property = row[f]) instanceof DataObj){
					return property._manager;
				}
				else if($p.utils.is_guid(property) && property != $p.utils.blank.guid){
					for(var i in rt){
						mgr = rt[i];
						if(mgr.get(property, false, true))
							return mgr;
					}
				}
			}
		}
	};

	_md.control_by_type = function (type, val) {
		var ft;

		if(typeof val == "boolean" && type.types.indexOf("boolean") != -1){
			ft = "ch";

		} else if(typeof val == "number" && type.digits) {
			if(type.fraction_figits < 5)
				ft = "calck";
			else
				ft = "edn";

		} else if(val instanceof Date && type.date_part){
			ft = "dhxCalendar";

		} else if(type.is_ref){
			ft = "ocombo";

		} else if(type.date_part) {
			ft = "dhxCalendar";

		} else if(type.digits) {
			if(type.fraction_figits < 5)
				ft = "calck";
			else
				ft = "edn";

		} else if(type.types[0]=="boolean") {
			ft = "ch";

		} else if(type.hasOwnProperty("str_len") && (type.str_len >= 100 || type.str_len == 0)) {
			ft = "txt";

		} else {
			ft = "ed";

		}
		return ft;
	};

	_md.ts_captions = function (class_name, ts_name, source) {
		if(!source)
			source = {};

		var mts = _md.get(class_name).tabular_sections[ts_name],
			mfrm = _md.get(class_name).form,
			fields = mts.fields, mf;

		if(mfrm && mfrm.obj){

			if(!mfrm.obj.tabular_sections[ts_name])
				return;

			source._mixin(mfrm.obj.tabular_sections[ts_name]);

		}else{

			if(ts_name==="contact_information")
				fields = {type: "", kind: "", presentation: ""};

			source.fields = ["row"];
			source.headers = "№";
			source.widths = "40";
			source.min_widths = "";
			source.aligns = "";
			source.sortings = "na";
			source.types = "cntr";

			for(var f in fields){
				mf = mts.fields[f];
				if(!mf.hide){
					source.fields.push(f);
					source.headers += "," + (mf.synonym ? mf.synonym.replace(/,/g, " ") : f);
					source.types += "," + _md.control_by_type(mf.type);
					source.sortings += ",na";
				}
			}
		}

		return true;

	};

	_md.syns_js = function (v) {
		var synJS = {
			DeletionMark: '_deleted',
			Description: 'name',
			DataVersion: 'data_version',    
			IsFolder: 'is_folder',
			Number: 'number_doc',
			Date: 'date',
			Дата: 'date',
			Posted: 'posted',
			Code: 'id',
			Parent_Key: 'parent',
			Owner_Key: 'owner',
			Owner:     'owner',
			Ref_Key: 'ref',
			Ссылка: 'ref',
			LineNumber: 'row'
		};
		if(synJS[v])
			return synJS[v];
		return _m.syns_js[_m.syns_1с.indexOf(v)] || v;
	};

	_md.syns_1с = function (v) {
		var syn1c = {
			_deleted: 'DeletionMark',
			name: 'Description',
			is_folder: 'IsFolder',
			number_doc: 'Number',
			date: 'Date',
			posted: 'Posted',
			id: 'Code',
			ref: 'Ref_Key',
			parent: 'Parent_Key',
			owner: 'Owner_Key',
			row: 'LineNumber'
		};
		if(syn1c[v])
			return syn1c[v];
		return _m.syns_1с[_m.syns_js.indexOf(v)] || v;
	};

	_md.printing_plates = function (pp) {
		if(pp)
			for(var i in pp.doc)
				_m.doc[i].printing_plates = pp.doc[i];

	};

	_md.class_name_from_1c = function (name) {

		var pn = name.split(".");
		if(pn.length == 1)
			return "enm." + name;
		else if(pn[0] == "Перечисление")
			name = "enm.";
		else if(pn[0] == "Справочник")
			name = "cat.";
		else if(pn[0] == "Документ")
			name = "doc.";
		else if(pn[0] == "РегистрСведений")
			name = "ireg.";
		else if(pn[0] == "РегистрНакопления")
			name = "areg.";
		else if(pn[0] == "РегистрБухгалтерии")
			name = "accreg.";
		else if(pn[0] == "ПланВидовХарактеристик")
			name = "cch.";
		else if(pn[0] == "ПланСчетов")
			name = "cacc.";
		else if(pn[0] == "Обработка")
			name = "dp.";
		else if(pn[0] == "Отчет")
			name = "rep.";

		return name + _md.syns_js(pn[1]);

	};

	_md.class_name_to_1c = function (name) {

		var pn = name.split(".");
		if(pn.length == 1)
			return "Перечисление." + name;
		else if(pn[0] == "enm")
			name = "Перечисление.";
		else if(pn[0] == "cat")
			name = "Справочник.";
		else if(pn[0] == "doc")
			name = "Документ.";
		else if(pn[0] == "ireg")
			name = "РегистрСведений.";
		else if(pn[0] == "areg")
			name = "РегистрНакопления.";
		else if(pn[0] == "accreg")
			name = "РегистрБухгалтерии.";
		else if(pn[0] == "cch")
			name = "ПланВидовХарактеристик.";
		else if(pn[0] == "cacc")
			name = "ПланСчетов.";
		else if(pn[0] == "dp")
			name = "Обработка.";
		else if(pn[0] == "rep")
			name = "Отчет.";

		return name + _md.syns_1с(pn[1]);

	};


	_md.create_tables = function(callback, attr){

		var cstep = 0, data_names = [], managers = _md.get_classes(), class_name,
			create = (attr && attr.postgres) ? "" : "USE md; ";

		function on_table_created(){

			cstep--;
			if(cstep==0){
				if(callback)
					callback(create);
				else
					alasql.utils.saveFile("create_tables.sql", create);
			} else
				iteration();
		}

		function iteration(){
			var data = data_names[cstep-1];
			create += data["class"][data.name].get_sql_struct(attr) + "; ";
			on_table_created();
		}

		"enm,cch,cacc,cat,bp,tsk,doc,ireg,areg".split(",").forEach(function (mgr) {
			for(class_name in managers[mgr])
				data_names.push({"class": $p[mgr], "name": managers[mgr][class_name]});
		});
		cstep = data_names.length;

		iteration();

	};


}



function DataManager(class_name){

	var _meta = _md.get(class_name),

		_events = {

			after_create: [],

			after_load: [],

			before_save: [],

			after_save: [],

			value_change: [],

			add_row: [],

			del_row: []
		};

	this.__define({

		cachable: {
			get: function () {

				if(class_name.indexOf("enm.") != -1)
					return "ram";

				if(_meta.cachable)
					return _meta.cachable;

				if(class_name.indexOf("doc.") != -1 || class_name.indexOf("dp.") != -1 || class_name.indexOf("rep.") != -1)
					return "doc";

				return "ram";

			}
		},


		class_name: {
			value: class_name,
			writable: false
		},

		alatable: {
			get : function () {
				return $p.wsql.aladb.tables[this.table_name] ? $p.wsql.aladb.tables[this.table_name].data : []
			}
		},

		metadata: {
			value: function(field){
				if(field)
					return _meta.fields[field] || _meta.tabular_sections[field];
				else
					return _meta;
			}
		},

		on: {
			value: function (name, method) {
				if(typeof name == "object"){
					for(var n in name){
						if(name.hasOwnProperty(n))
							_events[n].push(name[n]);
					}
				}else
					_events[name].push(method);
			}
		},

		off: {
			value: function (name, method) {
        if(typeof name == "object"){

        }else{
          var index = _events[name].indexOf(method);
          if(index != -1){
            _events[name].splice(index, 1);
          }
        }
			}
		},

		handle_event: {
			value: function (obj, name, attr) {
				var res = [], tmp;
				_events[name].forEach(function (method) {
					if(res !== false){
						tmp = method.call(obj, attr);
						if(tmp === false)
							res = tmp;
						else if(tmp)
							res.push(tmp);
					}
				});
				if(res === false){
					return res;

				}else if(res.length){
					if(res.length == 1)
						return res[0];
					else{
						if(res.some(function (v) {return typeof v === "object" && v.then}))
							return Promise.all(res);
						else
							return res;
					}
				}

			}
		},

		by_ref: {
			value: {}
		}
	});

}

DataManager.prototype.__define({

	family_name: {
		get : function () {
			return $p.msg["meta_"+this.class_name.split(".")[0]+"_mgr"].replace($p.msg.meta_mgr+" ", "");
		}
	},

	table_name: {
		get : function(){
			return this.class_name.replace(".", "_");
		}
	},

	find_rows: {
		value: function(selection, callback){
			return $p._find_rows.call(this, this.by_ref, selection, callback);
		}
	},

	extra_fields: {
		value : function(obj){

			var destinations = $p.cat.destinations || $p.cch.destinations,
				pn = _md.class_name_to_1c(this.class_name).replace(".", "_"),
				res = [];

			if(destinations){
				destinations.find_rows({predefined_name: pn}, function (destination) {
					var ts = destination.extra_fields || destination.ДополнительныеРеквизиты;
					if(ts){
						ts.each(function (row) {
							if(!row._deleted && !row.ПометкаУдаления)
								res.push(row.property || row.Свойство);
						});
					}
					return false;
				})

			}

			return res;
		}
	},

	extra_properties: {
		value : function(obj){
			return [];
		}
	},

	obj_constructor: {
		value: function (ts_name) {
			var parts = this.class_name.split("."),
				fn_name = parts[0].charAt(0).toUpperCase() + parts[0].substr(1) + parts[1].charAt(0).toUpperCase() + parts[1].substr(1);

			return ts_name ? fn_name + ts_name.charAt(0).toUpperCase() + ts_name.substr(1) + "Row" : fn_name;

		}
	},

  sync_grid: {
	  value: function(attr, grid){

      var mgr = this;

      function request(){

        if(typeof attr.custom_selection == "function"){
          return attr.custom_selection(attr);

        }else if(mgr.cachable == "ram" || mgr.cachable == "doc_ram"){

          if(attr.action == "get_tree")
            return $p.wsql.promise(mgr.get_sql_struct(attr), [])
              .then($p.iface.data_to_tree);

          else if(attr.action == "get_selection")
            return $p.wsql.promise(mgr.get_sql_struct(attr), [])
              .then(function(data){
                return $p.iface.data_to_grid.call(mgr, data, attr);
              });

        }else if(mgr.cachable.indexOf("doc") == 0 || mgr.cachable.indexOf("remote") == 0){

          if(attr.action == "get_tree")
            return mgr.pouch_tree(attr);

          else if(attr.action == "get_selection")
            return mgr.pouch_selection(attr);

        } else {

          if(attr.action == "get_tree")
            return mgr.rest_tree(attr);

          else if(attr.action == "get_selection")
            return mgr.rest_selection(attr);

        }
      }

      function to_grid(res){

        return new Promise(function(resolve, reject) {

          if(typeof res == "string"){

            if(res.substr(0,1) == "{")
              res = JSON.parse(res);

            if(grid && grid.parse){
              grid.xmlFileUrl = "exec";
              grid.parse(res, function(){
                resolve(res);
              }, "xml");
            }else
              resolve(res);

          }else if(grid instanceof dhtmlXTreeView && grid.loadStruct){
            grid.loadStruct(res, function(){
              resolve(res);
            });

          }else
            resolve(res);

        });

      }

      return request()
        .then(to_grid)
        .catch($p.record_log);

    }
  },

  get_option_list: {
    value: function(val, selection){

      var t = this, l = [], input_by_string, text, sel;

      function check(v){
        if($p.utils.is_equal(v.value, val))
          v.selected = true;
        return v;
      }

      if(selection.presentation && (input_by_string = t.metadata().input_by_string)){
        text = selection.presentation.like;
        delete selection.presentation;
        selection.or = [];
        input_by_string.forEach(function (fld) {
          sel = {};
          sel[fld] = {like: text};
          selection.or.push(sel);
        })
      }

      if(t.cachable.indexOf("ram") != -1 || (selection && selection._local)) {
        t.find_rows(selection, function (v) {
          l.push(check({text: v.presentation, value: v.ref}));
        });
        l.sort(function(a, b) {
          if (a.text < b.text){
            return -1;
          }
          else if (a.text > b.text){
            return 1;
          }
          return 0;
        })
        return Promise.resolve(l);

      }else if(t.cachable != "e1cib"){
        return t.pouch_find_rows(selection)
          .then(function (data) {
            data.forEach(function (v) {
              l.push(check({
                text: v.presentation,
                value: v.ref}));
            });
            return l;
          });
      }
      else{
        var attr = { selection: selection, top: selection._top},
          is_doc = t instanceof DocManager || t instanceof BusinessProcessManager;
        delete selection._top;

        if(is_doc)
          attr.fields = ["ref", "date", "number_doc"];

        else if(t.metadata().main_presentation_name)
          attr.fields = ["ref", "name"];
        else
          attr.fields = ["ref", "id"];

        return _rest.load_array(attr, t)
          .then(function (data) {
            data.forEach(function (v) {
              l.push(check({
                text: is_doc ? (v.number_doc + " от " + $p.moment(v.date).format($p.moment._masks.ldt)) : (v.name || v.id),
                value: v.ref}));
            });
            return l;
          });
      }
    }
  },

  tabular_captions: {
    value: function (tabular, source) {

    }
  },

  get_property_grid_xml: {
    value: function(oxml, o, extra_fields){

      var t = this, i, j, mf, v, ft, txt, row_id, gd = '<rows>',

        default_oxml = function () {
          if(oxml)
            return;
          mf = t.metadata();

          if(mf.form && mf.form.obj && mf.form.obj.head){
            oxml = mf.form.obj.head;

          }else{
            oxml = {" ": []};

            if(o instanceof CatObj){
              if(mf.code_length)
                oxml[" "].push("id");
              if(mf.main_presentation_name)
                oxml[" "].push("name");
            }else if(o instanceof DocObj){
              oxml[" "].push("number_doc");
              oxml[" "].push("date");
            }

            if(!o.is_folder){
              for(i in mf.fields)
                if(i != "predefined_name" && !mf.fields[i].hide)
                  oxml[" "].push(i);
            }

            if(mf.tabular_sections && mf.tabular_sections.extra_fields)
              oxml["Дополнительные реквизиты"] = [];
          }


        },

        txt_by_type = function (fv, mf) {

          if($p.utils.is_data_obj(fv))
            txt = fv.presentation;
          else
            txt = fv;

          if(mf.type.is_ref){
            ;
          } else if(mf.type.date_part) {
            txt = $p.moment(txt).format($p.moment._masks[mf.type.date_part]);

          } else if(mf.type.types[0]=="boolean") {
            txt = txt ? "1" : "0";
          }
        },

        by_type = function(fv){

          ft = _md.control_by_type(mf.type, fv);
          txt_by_type(fv, mf);

        },

        add_xml_row = function(f, tabular){
          if(tabular){
            var pref = f.property || f.param || f.Параметр || f.Свойство,
              pval = f.value != undefined ? f.value : f.Значение;
            if(pref.empty()) {
              row_id = tabular + "|" + "empty";
              ft = "ro";
              txt = "";
              mf = {synonym: "?"};

            }else{
              mf = {synonym: pref.presentation, type: pref.type};
              row_id = tabular + "|" + pref.ref;
              by_type(pval);
              if(ft == "edn")
                ft = "calck";

              if(pref.mandatory)
                ft += '" class="cell_mandatory';
            }
          }
          else if(typeof f === "object"){
            row_id = f.id;
            mf = extra_fields && extra_fields.metadata && extra_fields.metadata[row_id];
            if(!mf){
              mf = {synonym: f.synonym};
            }
            else if(f.synonym){
              mf.synonym = f.synonym;
            }

            ft = f.type;
            txt = "";
            if(f.hasOwnProperty("txt")){
              txt = f.txt;
            }
            else if((v = o[row_id]) !== undefined){
              txt_by_type(v, mf.type ? mf : _md.get(t.class_name, row_id));
            }
          }
          else if(extra_fields && extra_fields.metadata && ((mf = extra_fields.metadata[f]) !== undefined)){
            row_id = f;
            by_type(v = o[f]);
          }
          else if((v = o[f]) !== undefined){
            mf = _md.get(t.class_name, row_id = f);
            if(!mf){
              return;
            }
            by_type(v);
          }
          else{
            return;
          }

          gd += '<row id="' + row_id + '"><cell>' + (mf.synonym || mf.name) +
            '</cell><cell type="' + ft + '">' + txt + '</cell></row>';
        };

      default_oxml();

      for(i in oxml){
        if(i!=" "){
          gd += '<row open="1"><cell>' + i + '</cell>';   
        }

        for(j in oxml[i]){
          add_xml_row(oxml[i][j]);                        
        }

        if(extra_fields && i == extra_fields.title && o[extra_fields.ts]){  
          var added = false,
            destinations_extra_fields = t.extra_fields(o),
            pnames = "property,param,Свойство,Параметр".split(","),
            meta_extra_fields = o[extra_fields.ts]._owner._metadata.tabular_sections[o[extra_fields.ts]._name].fields,
            pname;

          if(pnames.some(function (name) {
              if(meta_extra_fields[name]){
                pname = name;
                return true;
              }
            })){
            o[extra_fields.ts].forEach(function (row) {
              var index = destinations_extra_fields.indexOf(row[pname]);
              if(index != -1)
                destinations_extra_fields.splice(index, 1);
            });
            destinations_extra_fields.forEach(function (property) {
              var row = o[extra_fields.ts].add();
              row[pname] = property;
            });
          };

          o[extra_fields.ts].find_rows(extra_fields.selection, function (row) {
            add_xml_row(row, extra_fields.ts);

          });

        }

        if(i!=" ") gd += '</row>';                          
      }
      gd += '</rows>';
      return gd;
    }
  },

  print: {
    value: function(ref, model, wnd){

      function tune_wnd_print(wnd_print){
        if(wnd && wnd.progressOff)
          wnd.progressOff();
        if(wnd_print)
          wnd_print.focus();
      }

      if(wnd && wnd.progressOn){
        wnd.progressOn();
      }

      setTimeout(tune_wnd_print, 3000);

      if(this._printing_plates[model] instanceof DataObj){
        model = this._printing_plates[model];
      }

      if(model instanceof DataObj && model.execute){

        if(ref instanceof DataObj)
          return model.execute(ref)
            .then(tune_wnd_print);
        else
          return this.get(ref, true, true)
            .then(model.execute.bind(model))
            .then(tune_wnd_print);

      }else{

        var rattr = {};
        $p.ajax.default_attr(rattr, $p.job_prm.irest_url());
        rattr.url += this.rest_name + "(guid'" + $p.utils.fix_guid(ref) + "')" +
          "/Print(model=" + model + ", browser_uid=" + $p.wsql.get_user_param("browser_uid") +")";

        return $p.ajax.get_and_show_blob(rattr.url, rattr, "get")
          .then(tune_wnd_print);
      }

    }
  },

  printing_plates: {
    value: function(){
      var rattr = {}, t = this;

      if(!t._printing_plates){
        if(t.metadata().printing_plates)
          t._printing_plates = t.metadata().printing_plates;

        else if(t.metadata().cachable == "ram" || (t.metadata().cachable && t.metadata().cachable.indexOf("doc") == 0)){
          t._printing_plates = {};
        }
      }

      if(!t._printing_plates && $p.ajax.authorized){
        $p.ajax.default_attr(rattr, $p.job_prm.irest_url());
        rattr.url += t.rest_name + "/Print()";
        return $p.ajax.get_ex(rattr.url, rattr)
          .then(function (req) {
            t._printing_plates = JSON.parse(req.response);
            return t._printing_plates;
          })
          .catch(function () {
          })
          .then(function (pp) {
            return pp || (t._printing_plates = {});
          });
      }

      return Promise.resolve(t._printing_plates);

    }
  }

});


function RefDataManager(class_name) {

	RefDataManager.superclass.constructor.call(this, class_name);

}
RefDataManager._extend(DataManager);

RefDataManager.prototype.__define({

	push: {
		value: function(o, new_ref){
			if(new_ref && (new_ref != o.ref)){
				delete this.by_ref[o.ref];
				this.by_ref[new_ref] = o;
			}else
				this.by_ref[o.ref] = o;
		}
	},

	each: {
		value: 	function(fn){
			for(var i in this.by_ref){
				if(!i || i == $p.utils.blank.guid)
					continue;
				if(fn.call(this, this.by_ref[i]) == true)
					break;
			}
		}
	},

	forEach: {
		value: function (fn) {
			return this.each.call(this, fn);
		}
	},

	get: {
		value: function(ref, force_promise, do_not_create){

			var o = this.by_ref[ref] || this.by_ref[(ref = $p.utils.fix_guid(ref))];

			if(!o){
				if(do_not_create && !force_promise)
					return;
				else
					o = new $p[this.obj_constructor()](ref, this, true);
			}

			if(force_promise === false)
				return o;

			else if(force_promise === undefined && ref === $p.utils.blank.guid)
				return o;

			if(o.is_new()){
				return o.load();	

			}else if(force_promise)
				return Promise.resolve(o);

			else
				return o;
		}
	},

	create: {
		value: function(attr, fill_default, force_obj){

			if(!attr || typeof attr != "object")
				attr = {};
			if(!attr.ref || !$p.utils.is_guid(attr.ref) || $p.utils.is_empty_guid(attr.ref))
				attr.ref = $p.utils.generate_guid();

			var o = this.by_ref[attr.ref];
			if(!o){

				o = new $p[this.obj_constructor()](attr, this);

				if(!fill_default && attr.ref && attr.presentation && Object.keys(attr).length == 2){

				}else{

					if(o instanceof DocObj && o.date == $p.utils.blank.date)
						o.date = new Date();

					var after_create_res = this.handle_event(o, "after_create");

					if((this instanceof DocManager || this instanceof TaskManager || this instanceof BusinessProcessManager)){
						if(!o.number_doc)
							o.new_number_doc();
					}
					else{
						if(!o.id && o._metadata.code_length)
							o.new_number_doc();
					}

					if(after_create_res === false)
						return Promise.resolve(o);

					else if(typeof after_create_res === "object" && after_create_res.then)
						return after_create_res;

					if(this.cachable == "e1cib" && fill_default){
						var rattr = {};
						$p.ajax.default_attr(rattr, $p.job_prm.irest_url());
						rattr.url += this.rest_name + "/Create()";
						return $p.ajax.get_ex(rattr.url, rattr)
							.then(function (req) {
								return o._mixin(JSON.parse(req.response), undefined, ["ref"]);
							});
					}

				}
			}

			return force_obj ? o : Promise.resolve(o);
		}
	},

	unload_obj: {
		value: function(ref) {
			delete this.by_ref[ref];
			this.alatable.some(function (o, i, a) {
				if(o.ref == ref){
					a.splice(i, 1);
					return true;
				}
			});
		}
	},

	find: {
		value: function(val, columns){
			return $p._find(this.by_ref, val, columns);
		}
	},

	load_array: {
		value: function(aattr, forse){

			var ref, obj, res = [];

			for(var i=0; i<aattr.length; i++){

				ref = $p.utils.fix_guid(aattr[i]);
				obj = this.by_ref[ref];

				if(!obj){
					if(forse == "update_only"){
						continue;
					}
					obj = new $p[this.obj_constructor()](aattr[i], this);
					if(forse){
            obj._set_loaded();
          }
				}
				else if(obj.is_new() || forse){
					obj._mixin(aattr[i]);
					obj._set_loaded();
				}
				res.push(obj);
			}
			return res;
		}
	},

	first_folder: {
		value: function(owner){
			for(var i in this.by_ref){
				var o = this.by_ref[i];
				if(o.is_folder && (!owner || $p.utils.is_equal(owner, o.owner)))
					return o;
			}
			return this.get();
		}
	},

	get_sql_struct: {
		value: function(attr){
			var t = this,
				cmd = t.metadata(),
				res = {}, f, f0, trunc_index = 0,
				action = attr && attr.action ? attr.action : "create_table";


			function sql_selection(){

				var ignore_parent = !attr.parent,
					parent = attr.parent || $p.utils.blank.guid,
					owner,
					initial_value = attr.initial_value || $p.utils.blank.guid,
					filter = attr.filter || "",
					set_parent = $p.utils.blank.guid;

				function list_flds(){
					var flds = [], s = "_t_.ref, _t_.`_deleted`";

					if(cmd.form && cmd.form.selection){
						cmd.form.selection.fields.forEach(function (fld) {
							flds.push(fld);
						});

					}else if(t instanceof DocManager){
						flds.push("posted");
						flds.push("date");
						flds.push("number_doc");

					}else{

						if(cmd["hierarchical"] && cmd["group_hierarchy"])
							flds.push("is_folder");
						else
							flds.push("0 as is_folder");

						if(t instanceof ChartOfAccountManager){
							flds.push("id");
							flds.push("name as presentation");

						}else if(cmd["main_presentation_name"])
							flds.push("name as presentation");

						else{
							if(cmd["code_length"])
								flds.push("id as presentation");
							else
								flds.push("'...' as presentation");
						}

						if(cmd["has_owners"])
							flds.push("owner");

						if(cmd["code_length"])
							flds.push("id");

					}

					flds.forEach(function(fld){
						if(fld.indexOf(" as ") != -1)
							s += ", " + fld;
						else
							s += _md.sql_mask(fld, true);
					});
					return s;

				}

				function join_flds(){

					var s = "", parts;

					if(cmd.form && cmd.form.selection){
						for(var i in cmd.form.selection.fields){
							if(cmd.form.selection.fields[i].indexOf(" as ") == -1 || cmd.form.selection.fields[i].indexOf("_t_.") != -1)
								continue;
							parts = cmd.form.selection.fields[i].split(" as ");
							parts[0] = parts[0].split(".");
							if(parts[0].length > 1){
								if(s)
									s+= "\n";
								s+= "left outer join " + parts[0][0] + " on " + parts[0][0] + ".ref = _t_." + parts[1];
							}
						}
					}
					return s;
				}

				function where_flds(){

					var s;

					if(t instanceof ChartOfAccountManager){
						s = " WHERE (" + (filter ? 0 : 1);

					}else if(cmd["hierarchical"]){
						if(cmd["has_owners"])
							s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" +
								(owner == $p.utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
						else
							s = " WHERE (" + (ignore_parent || filter ? 1 : 0) + " OR _t_.parent = '" + parent + "') AND (" + (filter ? 0 : 1);

					}else{
						if(cmd["has_owners"])
							s = " WHERE (" + (owner == $p.utils.blank.guid ? 1 : 0) + " OR _t_.owner = '" + owner + "') AND (" + (filter ? 0 : 1);
						else
							s = " WHERE (" + (filter ? 0 : 1);
					}

					if(t.sql_selection_where_flds){
						s += t.sql_selection_where_flds(filter);

					}else if(t instanceof DocManager)
						s += " OR _t_.number_doc LIKE '" + filter + "'";

					else{
						if(cmd["main_presentation_name"] || t instanceof ChartOfAccountManager)
							s += " OR _t_.name LIKE '" + filter + "'";

						if(cmd["code_length"])
							s += " OR _t_.id LIKE '" + filter + "'";
					}

					s += ") AND (_t_.ref != '" + $p.utils.blank.guid + "')";


					if(attr.selection){
						if(typeof attr.selection == "function"){

						}else
							attr.selection.forEach(function(sel){
								for(var key in sel){

									if(typeof sel[key] == "function"){
										s += "\n AND " + sel[key](t, key) + " ";

									}else if(cmd.fields.hasOwnProperty(key) || key === "ref"){
										if(sel[key] === true)
											s += "\n AND _t_." + key + " ";

										else if(sel[key] === false)
											s += "\n AND (not _t_." + key + ") ";

										else if(typeof sel[key] == "object"){

											if($p.utils.is_data_obj(sel[key]) || $p.utils.is_guid(sel[key]))
												s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";

											else{
												var keys = Object.keys(sel[key]),
													val = sel[key][keys[0]],
													mf = cmd.fields[key],
													vmgr;

												if(mf && mf.type.is_ref){
													vmgr = _md.value_mgr({}, key, mf.type, true, val);
												}

												if(keys[0] == "not")
													s += "\n AND (not _t_." + key + " = '" + val + "') ";

												else if(keys[0] == "in")
													s += "\n AND (_t_." + key + " in (" + sel[key].in.reduce(function(sum, val){
														if(sum){
															sum+=",";
														}
														if(typeof val == "number"){
															sum+=val.toString();
														}else{
															sum+="'" + val + "'";
														}
														return  sum;
													}, "") + ")) ";

												else
													s += "\n AND (_t_." + key + " = '" + val + "') ";
											}

										}else if(typeof sel[key] == "string")
											s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";

										else
											s += "\n AND (_t_." + key + " = " + sel[key] + ") ";

									} else if(key=="is_folder" && cmd.hierarchical && cmd.group_hierarchy){
									}
								}
							});
					}

					return s;
				}

				function order_flds(){

					if(t instanceof ChartOfAccountManager){
						return "ORDER BY id";

					}else if(cmd["hierarchical"]){
						if(cmd["group_hierarchy"])
							return "ORDER BY _t_.is_folder desc, is_initial_value, presentation";
						else
							return "ORDER BY _t_.parent desc, is_initial_value, presentation";
					}else
						return "ORDER BY is_initial_value, presentation";
				}

				function selection_prms(){

					function on_parent(o){

						if(o){
							set_parent = (attr.set_parent = o.parent.ref);
							parent = set_parent;
							ignore_parent = false;
						}else if(!filter && !ignore_parent){
							;

						}

						if(filter && filter.indexOf("%") == -1)
							filter = "%" + filter + "%";

					}

					if(cmd["has_owners"]){
						owner = attr.owner;
						if(attr.selection && typeof attr.selection != "function"){
							attr.selection.forEach(function(sel){
								if(sel.owner){
									owner = typeof sel.owner == "object" ?  sel.owner.valueOf() : sel.owner;
									delete sel.owner;
								}
							});
						}
						if(!owner)
							owner = $p.utils.blank.guid;
					}

					if(initial_value !=  $p.utils.blank.guid && ignore_parent){
						if(cmd["hierarchical"]){
							on_parent(t.get(initial_value, false))
						}else
							on_parent();
					}else
						on_parent();

				}

				selection_prms();

				var sql;
				if(t.sql_selection_list_flds)
					sql = t.sql_selection_list_flds(initial_value);
				else
					sql = ("SELECT %2, case when _t_.ref = '" + initial_value +
					"' then 0 else 1 end as is_initial_value FROM `" + t.table_name + "` AS _t_ %j %3 %4 LIMIT 300")
						.replace("%2", list_flds())
						.replace("%j", join_flds())
					;

				return sql.replace("%3", where_flds()).replace("%4", order_flds());

			}

			function sql_create(){

				var sql = "CREATE TABLE IF NOT EXISTS ";

				if(attr && attr.postgres){
					sql += t.table_name+" (ref uuid PRIMARY KEY NOT NULL, _deleted boolean";

					if(t instanceof DocManager)
						sql += ", posted boolean, date timestamp with time zone, number_doc character(11)";
					else{
						if(cmd.code_length)
							sql += ", id character("+cmd.code_length+")";
						sql += ", name character varying(50), is_folder boolean";
					}

					for(f in cmd.fields){
						if(f.length > 30){
							if(cmd.fields[f].short_name)
								f0 = cmd.fields[f].short_name;
							else{
								trunc_index++;
								f0 = f[0] + trunc_index + f.substr(f.length-27);
							}
						}else
							f0 = f;
						sql += ", " + f0 + _md.sql_type(t, f, cmd.fields[f].type, true) + _md.sql_composite(cmd.fields, f, f0, true);
					}

					for(f in cmd["tabular_sections"])
						sql += ", " + "ts_" + f + " JSON";

				}else{
					sql += "`"+t.table_name+"` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";

					if(t instanceof DocManager)
						sql += ", posted boolean, date Date, number_doc CHAR";
					else
						sql += ", id CHAR, name CHAR, is_folder BOOLEAN";

					for(f in cmd.fields)
						sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.fields[f].type)+ _md.sql_composite(cmd.fields, f);

					for(f in cmd["tabular_sections"])
						sql += ", " + "`ts_" + f + "` JSON";
				}

				sql += ")";

				return sql;
			}

			function sql_update(){
				var fields = ["ref", "_deleted"],
					sql = "INSERT INTO `"+t.table_name+"` (ref, `_deleted`",
					values = "(?";

				if(t.class_name.substr(0, 3)=="cat"){
					sql += ", id, name, is_folder";
					fields.push("id");
					fields.push("name");
					fields.push("is_folder");

				}else if(t.class_name.substr(0, 3)=="doc"){
					sql += ", posted, date, number_doc";
					fields.push("posted");
					fields.push("date");
					fields.push("number_doc");

				}
				for(f in cmd.fields){
					sql += _md.sql_mask(f);
					fields.push(f);
				}
				for(f in cmd["tabular_sections"]){
					sql += ", `ts_" + f + "`";
					fields.push("ts_" + f);
				}
				sql += ") VALUES ";
				for(f = 1; f<fields.length; f++){
					values += ", ?";
				}
				values += ")";
				sql += values;

				return {sql: sql, fields: fields, values: values};
			}


			if(action == "create_table")
				res = sql_create();

			else if(["insert", "update", "replace"].indexOf(action) != -1)
				res[t.table_name] = sql_update();

			else if(action == "select")
				res = "SELECT * FROM `"+t.table_name+"` WHERE ref = ?";

			else if(action == "select_all")
				res = "SELECT * FROM `"+t.table_name+"`";

			else if(action == "delete")
				res = "DELETE FROM `"+t.table_name+"` WHERE ref = ?";

			else if(action == "drop")
				res = "DROP TABLE IF EXISTS `"+t.table_name+"`";

			else if(action == "get_tree"){
				if(!attr.filter || attr.filter.is_folder)
					res = "SELECT ref, parent, name as presentation FROM `" + t.table_name + "` WHERE is_folder order by parent, name";
				else
					res = "SELECT ref, parent, name as presentation FROM `" + t.table_name + "` order by parent, name";
			}

			else if(action == "get_selection")
				res = sql_selection();

			return res;
		}
	},

	caption_flds: {
		value: function(attr){

			var _meta = attr.metadata || this.metadata(),
				str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
				acols = [],	s = "";

			if(_meta.form && _meta.form.selection){
				acols = _meta.form.selection.cols;

			}else if(this instanceof DocManager){
				acols.push(new Col_struct("date", "160", "ro", "left", "server", "Дата"));
				acols.push(new Col_struct("number_doc", "140", "ro", "left", "server", "Номер"));

				if(_meta.fields.note)
					acols.push(new Col_struct("note", "*", "ro", "left", "server", _meta.fields.note.synonym));

				if(_meta.fields.responsible)
					acols.push(new Col_struct("responsible", "*", "ro", "left", "server", _meta.fields.responsible.synonym));


			}else if(this instanceof ChartOfAccountManager){
				acols.push(new Col_struct("id", "140", "ro", "left", "server", "Код"));
				acols.push(new Col_struct("presentation", "*", "ro", "left", "server", "Наименование"));

			}else{

				acols.push(new Col_struct("presentation", "*", "ro", "left", "server", "Наименование"));

			}

			if(attr.get_header && acols.length){
				s = "<head>";
				for(var col in acols){
					s += str_def.replace("%1", acols[col].id).replace("%2", acols[col].width).replace("%3", acols[col].type)
						.replace("%4", acols[col].align).replace("%5", acols[col].sort).replace("%6", acols[col].caption);
				}
				s += "</head>";
			}

			return {head: s, acols: acols};
		}
	},

	load_cached_server_array: {
		value: function (list, alt_rest_name) {

			var query = [], obj,
				t = this,
				mgr = alt_rest_name ? {class_name: t.class_name, rest_name: alt_rest_name} : t,
				check_loaded = !alt_rest_name;

			list.forEach(function (o) {
				obj = t.get(o.ref || o, false, true);
				if(!obj || (check_loaded && obj.is_new()))
					query.push(o.ref || o);
			});
			if(query.length){

				var attr = {
					url: "",
					selection: {ref: {in: query}}
				};
				if(check_loaded)
					attr.fields = ["ref"];

				$p.rest.build_select(attr, mgr);

				return $p.ajax.get_ex(attr.url, attr)
					.then(function (req) {
						var data = JSON.parse(req.response);

						if(check_loaded)
							data = data.value;
						else{
							data = data.data;
							for(var i in data){
								if(!data[i].ref && data[i].id)
									data[i].ref = data[i].id;
								if(data[i].Код){
									data[i].id = data[i].Код;
									delete data[i].Код;
								}
								data[i]._not_set_loaded = true;
							}
						}

						t.load_array(data);
						return(list);
					});

			}else
				return Promise.resolve(list);
		}
	},

	predefined: {
		value: function(name){

			if(!this._predefined)
				this._predefined = {};

			if(!this._predefined[name]){

				this._predefined[name] = this.get();

				this.find_rows({predefined_name: name}, function (el) {
					this._predefined[name] = el;
					return false;
				});
			}

			return this._predefined[name];
		}
	}

});



function DataProcessorsManager(class_name){

	DataProcessorsManager.superclass.constructor.call(this, class_name);

}
DataProcessorsManager._extend(DataManager);

DataProcessorsManager.prototype.__define({

	create: {
		value: function(attr){
			return new $p[this.obj_constructor()](attr || {}, this);
		}
	},

	unload_obj: {
		value: function() {	}
	}
});



function EnumManager(class_name) {

	EnumManager.superclass.constructor.call(this, class_name);

	var a = $p.md.get(class_name);
	for(var i in a)
		new EnumObj(a[i], this);

}
EnumManager._extend(RefDataManager);

EnumManager.prototype.__define({

	get: {
		value: function(ref){

			if(ref instanceof EnumObj)
				return ref;

			else if(!ref || ref == $p.utils.blank.guid)
				ref = "_";

			var o = this[ref];
			if(!o)
				o = new EnumObj({name: ref}, this);

			return o;
		}
	},

	push: {
		value: function(o, new_ref){
			this.__define(new_ref, {
				value : o
			});
		}
	},

	each: {
		value: function (fn) {
			this.alatable.forEach(function (v) {
				if(v.ref && v.ref != "_" && v.ref != $p.utils.blank.guid)
					fn.call(this[v.ref]);
			}.bind(this));
		}
	},

  get_sql_struct: {
	  value: function(attr){

      var res = "CREATE TABLE IF NOT EXISTS ",
        action = attr && attr.action ? attr.action : "create_table";

      if(attr && attr.postgres){
        if(action == "create_table")
          res += this.table_name+
            " (ref character varying(255) PRIMARY KEY NOT NULL, sequence INT, synonym character varying(255))";
        else if(["insert", "update", "replace"].indexOf(action) != -1){
          res = {};
          res[this.table_name] = {
            sql: "INSERT INTO "+this.table_name+" (ref, sequence, synonym) VALUES ($1, $2, $3)",
            fields: ["ref", "sequence", "synonym"],
            values: "($1, $2, $3)"
          };

        }else if(action == "delete")
          res = "DELETE FROM "+this.table_name+" WHERE ref = $1";

      }else {
        if(action == "create_table")
          res += "`"+this.table_name+
            "` (ref CHAR PRIMARY KEY NOT NULL, sequence INT, synonym CHAR)";

        else if(["insert", "update", "replace"].indexOf(action) != -1){
          res = {};
          res[this.table_name] = {
            sql: "INSERT INTO `"+this.table_name+"` (ref, sequence, synonym) VALUES (?, ?, ?)",
            fields: ["ref", "sequence", "synonym"],
            values: "(?, ?, ?)"
          };

        }else if(action == "delete")
          res = "DELETE FROM `"+this.table_name+"` WHERE ref = ?";
      }



      return res;

    }
  },

  get_option_list: {
    value: function(val, selection){
      var l = [], synonym = "", sref;

      function check(v){
        if($p.utils.is_equal(v.value, val))
          v.selected = true;
        return v;
      }

      if(selection){
        for(var i in selection){
          if(i.substr(0,1)=="_")
            continue;
          else if(i == "ref"){
            sref = selection[i].hasOwnProperty("in") ? selection[i].in : selection[i];
          }
          else
            synonym = selection[i];
        }
      }

      if(typeof synonym == "object"){
        if(synonym.like)
          synonym = synonym.like;
        else
          synonym = "";
      }
      synonym = synonym.toLowerCase();

      this.alatable.forEach(function (v) {
        if(synonym){
          if(!v.synonym || v.synonym.toLowerCase().indexOf(synonym) == -1)
            return;
        }
        if(sref){
          if(Array.isArray(sref)){
            if(!sref.some(function (sv) {
                return sv.name == v.ref || sv.ref == v.ref || sv == v.ref;
              }))
              return;
          }else{
            if(sref.name != v.ref && sref.ref != v.ref && sref != v.ref)
              return;
          }
        }
        l.push(check({text: v.synonym || "", value: v.ref}));
      });
      l.sort(function(a, b) {
        if (a.text < b.text){
          return -1;
        }
        else if (a.text > b.text){
          return 1;
        }
        return 0;
      })
      return Promise.resolve(l);
    }
  }

});


function RegisterManager(class_name){

	RegisterManager.superclass.constructor.call(this, class_name);

	this.push = function(o, new_ref){
		if(new_ref && (new_ref != o.ref)){
			delete this.by_ref[o.ref];
			this.by_ref[new_ref] = o;
		}else
			this.by_ref[o.ref] = o;
	};

	this.get = function(attr, force_promise, return_row){

		if(!attr)
			attr = {};
		else if(typeof attr == "string")
			attr = {ref: attr};

		if(attr.ref && return_row)
			return force_promise ? Promise.resolve(this.by_ref[attr.ref]) : this.by_ref[attr.ref];

		attr.action = "select";

		var arr = $p.wsql.alasql(this.get_sql_struct(attr), attr._values),
			res;

		delete attr.action;
		delete attr._values;

		if(arr.length){
			if(return_row)
				res = this.by_ref[this.get_ref(arr[0])];
			else{
				res = [];
				for(var i in arr)
					res.push(this.by_ref[this.get_ref(arr[i])]);
			}
		}

		return force_promise ? Promise.resolve(res) : res;
	};

	this.unload_obj = function(ref) {
		delete this.by_ref[ref];
		this.alatable.some(function (o, i, a) {
			if(o.ref == ref){
				a.splice(i, 1);
				return true;
			}
		});
	};

	this.load_array = function(aattr, forse){
		var ref, obj, res = [];

		for(var i=0; i<aattr.length; i++){
			ref = this.get_ref(aattr[i]);
			obj = this.by_ref[ref];

			if(!obj && !aattr[i]._deleted){
				obj = new $p[this.obj_constructor()](aattr[i], this);
				forse && obj._set_loaded();
			}
			else if(aattr[i]._deleted){
        obj && obj.unload();
				continue;
			}
			else if(obj.is_new() || forse){
				obj._mixin(aattr[i]);
				obj._set_loaded();
			}
			res.push(obj);
		}
		return res;
	};

}
RegisterManager._extend(DataManager);

RegisterManager.prototype.__define({

	get_sql_struct: {
		value: function(attr) {
			var t = this,
				cmd = t.metadata(),
				res = {}, f,
				action = attr && attr.action ? attr.action : "create_table";

			function sql_selection(){

				var filter = attr.filter || "";

				function list_flds(){
					var flds = [], s = "_t_.ref";

					if(cmd.form && cmd.form.selection){
						cmd.form.selection.fields.forEach(function (fld) {
							flds.push(fld);
						});

					}else{

						for(var f in cmd["dimensions"]){
							flds.push(f);
						}
					}

					flds.forEach(function(fld){
						if(fld.indexOf(" as ") != -1)
							s += ", " + fld;
						else
							s += _md.sql_mask(fld, true);
					});
					return s;

				}

				function join_flds(){

					var s = "", parts;

					if(cmd.form && cmd.form.selection){
						for(var i in cmd.form.selection.fields){
							if(cmd.form.selection.fields[i].indexOf(" as ") == -1 || cmd.form.selection.fields[i].indexOf("_t_.") != -1)
								continue;
							parts = cmd.form.selection.fields[i].split(" as ");
							parts[0] = parts[0].split(".");
							if(parts[0].length > 1){
								if(s)
									s+= "\n";
								s+= "left outer join " + parts[0][0] + " on " + parts[0][0] + ".ref = _t_." + parts[1];
							}
						}
					}
					return s;
				}

				function where_flds(){

					var s = " WHERE (" + (filter ? 0 : 1);

					if(t.sql_selection_where_flds){
						s += t.sql_selection_where_flds(filter);

					}

					s += ")";


					if(attr.selection){
						if(typeof attr.selection == "function"){

						}else
							attr.selection.forEach(function(sel){
								for(var key in sel){

									if(typeof sel[key] == "function"){
										s += "\n AND " + sel[key](t, key) + " ";

									}else if(cmd.fields.hasOwnProperty(key)){
										if(sel[key] === true)
											s += "\n AND _t_." + key + " ";

										else if(sel[key] === false)
											s += "\n AND (not _t_." + key + ") ";

										else if(typeof sel[key] == "object"){

											if($p.utils.is_data_obj(sel[key]))
												s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";

											else{
												var keys = Object.keys(sel[key]),
													val = sel[key][keys[0]],
													mf = cmd.fields[key],
													vmgr;

												if(mf && mf.type.is_ref){
													vmgr = _md.value_mgr({}, key, mf.type, true, val);
												}

												if(keys[0] == "not")
													s += "\n AND (not _t_." + key + " = '" + val + "') ";

												else
													s += "\n AND (_t_." + key + " = '" + val + "') ";
											}

										}else if(typeof sel[key] == "string")
											s += "\n AND (_t_." + key + " = '" + sel[key] + "') ";

										else
											s += "\n AND (_t_." + key + " = " + sel[key] + ") ";

									} else if(key=="is_folder" && cmd.hierarchical && cmd.group_hierarchy){
									}
								}
							});
					}

					return s;
				}

				function order_flds(){

					return "";
				}

				if(filter && filter.indexOf("%") == -1)
					filter = "%" + filter + "%";

				var sql;
				if(t.sql_selection_list_flds)
					sql = t.sql_selection_list_flds();
				else
					sql = ("SELECT %2 FROM `" + t.table_name + "` AS _t_ %j %3 %4 LIMIT 300")
						.replace("%2", list_flds())
						.replace("%j", join_flds())
					;

				return sql.replace("%3", where_flds()).replace("%4", order_flds());

			}

			function sql_create(){

				var sql = "CREATE TABLE IF NOT EXISTS ",
					first_field = true;

				if(attr && attr.postgres){
					sql += t.table_name+" (";

					if(cmd.splitted){
						sql += "zone integer";
						first_field = false;
					}

					for(f in cmd.dimensions){
						if(first_field){
							sql += f;
							first_field = false;
						}else
							sql += ", " + f;
						sql += _md.sql_type(t, f, cmd.dimensions[f].type, true) + _md.sql_composite(cmd.dimensions, f, "", true);
					}

					for(f in cmd.resources)
						sql += ", " + f + _md.sql_type(t, f, cmd.resources[f].type, true) + _md.sql_composite(cmd.resources, f, "", true);

					for(f in cmd.attributes)
						sql += ", " + f + _md.sql_type(t, f, cmd.attributes[f].type, true) + _md.sql_composite(cmd.attributes, f, "", true);

					sql += ", PRIMARY KEY (";
					first_field = true;
					if(cmd.splitted){
						sql += "zone";
						first_field = false;
					}
					for(f in cmd["dimensions"]){
						if(first_field){
							sql += f;
							first_field = false;
						}else
							sql += ", " + f;
					}

				}else{
					sql += "`"+t.table_name+"` (ref CHAR PRIMARY KEY NOT NULL, `_deleted` BOOLEAN";


					for(f in cmd.dimensions)
						sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.dimensions[f].type);

					for(f in cmd.resources)
						sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.resources[f].type);

					for(f in cmd.attributes)
						sql += _md.sql_mask(f) + _md.sql_type(t, f, cmd.attributes[f].type);

				}

				sql += ")";

				return sql;
			}

			function sql_update(){
				var sql = "INSERT OR REPLACE INTO `"+t.table_name+"` (",
					fields = [],
					first_field = true;

				for(f in cmd.dimensions){
					if(first_field){
						sql += f;
						first_field = false;
					}else
						sql += ", " + f;
					fields.push(f);
				}
				for(f in cmd.resources){
					sql += ", " + f;
					fields.push(f);
				}
				for(f in cmd.attributes){
					sql += ", " + f;
					fields.push(f);
				}

				sql += ") VALUES (?";
				for(f = 1; f<fields.length; f++){
					sql += ", ?";
				}
				sql += ")";

				return {sql: sql, fields: fields};
			}

			function sql_select(){
				var sql = "SELECT * FROM `"+t.table_name+"` WHERE ",
					first_field = true;
				attr._values = [];

				for(var f in cmd["dimensions"]){

					if(first_field)
						first_field = false;
					else
						sql += " and ";

					sql += "`" + f + "`" + "=?";
					attr._values.push(attr[f]);
				}

				if(first_field)
					sql += "1";

				return sql;
			}


			if(action == "create_table")
				res = sql_create();

			else if(action in {insert:"", update:"", replace:""})
				res[t.table_name] = sql_update();

			else if(action == "select")
				res = sql_select();

			else if(action == "select_all")
				res = sql_select();

			else if(action == "delete")
				res = "DELETE FROM `"+t.table_name+"` WHERE ref = ?";

			else if(action == "drop")
				res = "DROP TABLE IF EXISTS `"+t.table_name+"`";

			else if(action == "get_selection")
				res = sql_selection();

			return res;
		}
	},

	get_ref: {
		value: function(attr){

			if(attr instanceof RegisterRow)
				attr = attr._obj;

			if(attr.ref)
				return attr.ref;

			var key = "",
				dimensions = this.metadata().dimensions;

			for(var j in dimensions){
				key += (key ? "¶" : "");
				if(dimensions[j].type.is_ref)
					key += $p.utils.fix_guid(attr[j]);

				else if(!attr[j] && dimensions[j].type.digits)
					key += "0";

				else if(dimensions[j].date_part)
					key += $p.moment(attr[j] || $p.utils.blank.date).format($p.moment.defaultFormatUtc);

				else if(attr[j]!=undefined)
					key += String(attr[j]);

				else
					key += "$";
			}
			return key;
		}
	},

	caption_flds: {
		value: function(attr){

			var _meta = attr.metadata || this.metadata(),
				str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
				acols = [],	s = "";

			if(_meta.form && _meta.form.selection){
				acols = _meta.form.selection.cols;

			}else{

				for(var f in _meta["dimensions"]){
					acols.push(new Col_struct(f, "*", "ro", "left", "server", _meta["dimensions"][f].synonym));
				}
			}

			if(attr.get_header && acols.length){
				s = "<head>";
				for(var col in acols){
					s += str_def.replace("%1", acols[col].id).replace("%2", acols[col].width).replace("%3", acols[col].type)
						.replace("%4", acols[col].align).replace("%5", acols[col].sort).replace("%6", acols[col].caption);
				}
				s += "</head>";
			}

			return {head: s, acols: acols};
		}
	},

	create: {
		value: function(attr){

			if(!attr || typeof attr != "object")
				attr = {};


			var o = this.by_ref[attr.ref];
			if(!o){

				o = new $p[this.obj_constructor()](attr, this);

				var after_create_res = this.handle_event(o, "after_create");

				if(after_create_res === false)
					return Promise.resolve(o);

				else if(typeof after_create_res === "object" && after_create_res.then)
					return after_create_res;
			}

			return Promise.resolve(o);
		}
	}
});



function InfoRegManager(class_name){

	InfoRegManager.superclass.constructor.call(this, class_name);

}
InfoRegManager._extend(RegisterManager);

InfoRegManager.prototype.slice_first = function(filter){

};

InfoRegManager.prototype.slice_last = function(filter){

};



function AccumRegManager(class_name){

	AccumRegManager.superclass.constructor.call(this, class_name);
}
AccumRegManager._extend(RegisterManager);



function CatManager(class_name) {

	CatManager.superclass.constructor.call(this, class_name);

	if(this.metadata().hierarchical && this.metadata().group_hierarchy){

		$p[this.obj_constructor()].prototype.__define("is_folder", {
			get : function(){ return this._obj.is_folder || false},
			set : function(v){ this._obj.is_folder = $p.utils.fix_boolean(v)},
			enumerable: true,
			configurable: true
		});
	}

}
CatManager._extend(RefDataManager);

CatManager.prototype.by_name = function(name){

	var o;

	this.find_rows({name: name}, function (obj) {
		o = obj;
		return false;
	});

	if(!o)
		o = this.get();

	return o;
};

CatManager.prototype.by_id = function(id){

	var o;

	this.find_rows({id: id}, function (obj) {
		o = obj;
		return false;
	});

	if(!o)
		o = this.get();

	return o;
};

CatManager.prototype.path = function(ref){
	var res = [], tobj;

	if(ref instanceof DataObj)
		tobj = ref;
	else
		tobj = this.get(ref, false, true);
	if(tobj)
		res.push({ref: tobj.ref, presentation: tobj.presentation});

	if(tobj && this.metadata().hierarchical){
		while(true){
			tobj = tobj.parent;
			if(tobj.empty())
				break;
			res.push({ref: tobj.ref, presentation: tobj.presentation});
		}
	}
	return res;
};



function ChartOfCharacteristicManager(class_name){

	ChartOfCharacteristicManager.superclass.constructor.call(this, class_name);

}
ChartOfCharacteristicManager._extend(CatManager);


function ChartOfAccountManager(class_name){

	ChartOfAccountManager.superclass.constructor.call(this, class_name);

}
ChartOfAccountManager._extend(CatManager);


function DocManager(class_name) {


	DocManager.superclass.constructor.call(this, class_name);

}
DocManager._extend(RefDataManager);

function TaskManager(class_name){

	TaskManager.superclass.constructor.call(this, class_name);

}
TaskManager._extend(CatManager);

function BusinessProcessManager(class_name){

	BusinessProcessManager.superclass.constructor.call(this, class_name);

}
BusinessProcessManager._extend(CatManager);


function LogManager(){

	LogManager.superclass.constructor.call(this, "ireg.log");

	var smax;

	this.__define({

		record: {
			value: function(msg){

				if(msg instanceof Error){
          console && console.log(msg);
					msg = {
						class: "error",
						note: msg.toString()
					}
				}
        else if(msg instanceof DataObj){
          console && console.log(msg);
          var _err = msg._data._err;
          msg = {
            class: "error",
            obj: {
              type: msg.class_name,
              ref: msg.ref,
              presentation: msg.presentation
            },
            note: _err ? _err.text : ''
          }
        }
				else if(typeof msg == "object" && !msg.class && !msg.obj){
					msg = {
						class: "obj",
						obj: msg,
						note: msg.note
					};
				}
				else if(typeof msg != "object"){
          msg = {note: msg};
        }

				msg.date = Date.now() + $p.wsql.time_diff;

				if(!smax){
          smax = alasql.compile("select MAX(`sequence`) as `sequence` from `ireg_log` where `date` = ?");
        }
				var res = smax([msg.date]);
        msg.sequence = (!res.length || res[0].sequence === undefined) ? 0 : parseInt(res[0].sequence) + 1;

				if(!msg.class){
          msg.class = "note";
        }

				$p.wsql.alasql("insert into `ireg_log` (`ref`, `date`, `sequence`, `class`, `note`, `obj`) values (?,?,?,?,?,?)",
					[msg.date + "¶" + msg.sequence, msg.date, msg.sequence, msg.class, msg.note, msg.obj ? JSON.stringify(msg.obj) : ""]);

        msg.note && $p.msg && $p.msg.show_msg && $p.msg.show_msg([msg.class, msg.note]);

			}
		},

		backup: {
			value: function(dfrom, dtill){

			}
		},

		restore: {
			value: function(dfrom, dtill){

			}
		},

		clear: {
			value: function(dfrom, dtill){

			}
		},

		show: {
			value: function (pwnd) {

			}
		},

		get: {
			value: function (ref, force_promise, do_not_create) {

				if(typeof ref == "object")
					ref = ref.ref || "";

				if(!this.by_ref[ref]){

					if(force_promise === false)
						return undefined;

					var parts = ref.split("¶");
					$p.wsql.alasql("select * from `ireg_log` where date=" + parts[0] + " and sequence=" + parts[1]).forEach(function (row) {
						new RegisterRow(row, this);
					}.bind(this));
				}

				return force_promise ? Promise.resolve(this.by_ref[ref]) : this.by_ref[ref];
			}
		},

		get_sql_struct: {
			value: function(attr){

				if(attr && attr.action == "get_selection"){
					var sql = "select * from `ireg_log`";
					if(attr.date_from){
						if (attr.date_till)
							sql += " where `date` >= ? and `date` <= ?";
						else
							sql += " where `date` >= ?";
					}else if (attr.date_till)
						sql += " where `date` <= ?";

					return sql;

				}else
					return LogManager.superclass.get_sql_struct.call(this, attr);
			}
		},

		caption_flds: {
			value: function (attr) {

				var str_def = "<column id=\"%1\" width=\"%2\" type=\"%3\" align=\"%4\" sort=\"%5\">%6</column>",
					acols = [], s = "";


				acols.push(new Col_struct("date", "200", "ro", "left", "server", "Дата"));
				acols.push(new Col_struct("class", "100", "ro", "left", "server", "Класс"));
				acols.push(new Col_struct("note", "*", "ro", "left", "server", "Событие"));

				if(attr.get_header){
					s = "<head>";
					for(var col in acols){
						s += str_def.replace("%1", acols[col].id).replace("%2", acols[col].width).replace("%3", acols[col].type)
							.replace("%4", acols[col].align).replace("%5", acols[col].sort).replace("%6", acols[col].caption);
					}
					s += "</head>";
				}

				return {head: s, acols: acols};
			}
		},

		data_to_grid: {
			value: function (data, attr) {
				var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
						.replace("%1", data.length).replace("%2", attr.start)
						.replace("%3", attr.set_parent || "" ),
					caption = this.caption_flds(attr);

				xml += caption.head;

				data.forEach(function(r){
					xml += "<row id=\"" + r.ref + "\"><cell>" +
						$p.moment(r.date - $p.wsql.time_diff).format("DD.MM.YYYY HH:mm:ss") + "." + r.sequence + "</cell>" +
						"<cell>" + (r.class || "") + "</cell><cell>" + (r.note || "") + "</cell></row>";
				});

				return xml + "</rows>";
			}
		}

	});

}
LogManager._extend(InfoRegManager);


function MetaObjManager() {

	MetaObjManager.superclass.constructor.call(this, "cat.meta_objs");
}
MetaObjManager._extend(CatManager);


function MetaFieldManager() {

	MetaFieldManager.superclass.constructor.call(this, "cat.meta_fields");
}
MetaFieldManager._extend(CatManager);


function SchemeSettingsManager() {

	SchemeSettingsManager.superclass.constructor.call(this, "cat.scheme_settings");
}
SchemeSettingsManager._extend(CatManager);





function DataObj(attr, manager) {

	var tmp,
		_ts_ = {};

	if(!(manager instanceof DataProcessorsManager) && !(manager instanceof EnumManager)){
    tmp = manager.get(attr, false, true);
  }

	if(tmp){
		attr = null;
		return tmp;
	}


	this.__define({

		_ts_: {
			value: function( name ) {
				if( !_ts_[name] ) {
					_ts_[name] = new TabularSection(name, this);
				}
				return _ts_[name];
			},
			configurable: true
		},

		_manager: {
			value : manager
		},

    _data: {
		  value: {
        _is_new: !(this instanceof EnumObj)
      }
    },

    _obj: {
		  value: {
        ref: manager instanceof EnumManager ? attr.name : (manager instanceof RegisterManager ? manager.get_ref(attr) : $p.utils.fix_guid(attr))
      }
    }

	});


	if(manager.alatable && manager.push){
		manager.alatable.push(this._obj);
		manager.push(this, this._obj.ref);
	}

	attr = null;

}

DataObj.prototype.__define({

	valueOf: {
		value: function () {
			return this.ref;
		}
	},

	toJSON: {
		value: function () {
			return this._obj;
		}
	},

	toString: {
		value: function () {
			return this.presentation;
		}
	},

  __notify: {
	  value: function (f) {
      if(!this._data._silent)
        Object.getNotifier(this).notify({
          type: 'update',
          name: f,
          oldValue: this._obj[f]
        });
    }
  },

  _getter: {
	  value: function (f) {

      var mf = this._metadata.fields[f].type,
        res = this._obj ? this._obj[f] : "",
        mgr, ref;

      if(f == "type" && typeof res == "object")
        return res;

      else if(f == "ref"){
        return res;

      }else if(mf.is_ref){

        if(mf.digits && typeof res === "number"){
          return res;
        }

        if(mf.hasOwnProperty("str_len") && !$p.utils.is_guid(res)){
          return res;
        }

        if(mgr = _md.value_mgr(this._obj, f, mf)){
          if($p.utils.is_data_mgr(mgr)){
            return mgr.get(res, false);
          }
          else{
            return $p.utils.fetch_type(res, mgr);
          }
        }

        if(res){
          console.log([f, mf, this._obj]);
          return null;
        }

      }else if(mf.date_part)
        return $p.utils.fix_date(this._obj[f], true);

      else if(mf.digits)
        return $p.utils.fix_number(this._obj[f], !mf.hasOwnProperty("str_len"));

      else if(mf.types[0]=="boolean")
        return $p.utils.fix_boolean(this._obj[f]);

      else
        return this._obj[f] || "";
    }
  },

  _getter_ts: {
	  value: function (f) {return this._ts_(f)}
  },

  _setter: {
	  value: function (f, v) {

      if(this._obj[f] == v)
        return;

      this.__notify(f);
      this.__setter(f, v);
      this._data._modified = true;

    }
  },

  __setter: {
    value: function (f, v) {

      var mf = this._metadata.fields[f].type,
        mgr;

      if(f == "type" && v.types)
        this._obj[f] = v;

      else if(f == "ref")

        this._obj[f] = $p.utils.fix_guid(v);

      else if(mf.is_ref){

        if(mf.digits && typeof v == "number" || mf.hasOwnProperty("str_len") && typeof v == "string" && !$p.utils.is_guid(v)){
          this._obj[f] = v;
        }
        else if(typeof v == "boolean" && mf.types.indexOf("boolean") != -1){
          this._obj[f] = v;
        }
        else {
          this._obj[f] = $p.utils.fix_guid(v);

          mgr = _md.value_mgr(this._obj, f, mf, false, v);

          if(mgr){
            if(mgr instanceof EnumManager){
              if(typeof v == "string"){
                this._obj[f] = v;
              }
              else if(!v){
                this._obj[f] = "";
              }
              else if(typeof v == "object"){
                this._obj[f] = v.ref || v.name || "";
              }
            }
            else if(v && v.presentation){
              if(v.type && !(v instanceof DataObj)){
                delete v.type;
              }
              mgr.create(v);
            }
            else if(!$p.utils.is_data_mgr(mgr)){
              this._obj[f] = $p.utils.fetch_type(v, mgr);
            }
          }
          else{
            if(typeof v != "object"){
              this._obj[f] = v;
            }
          }
        }
      }
      else if(mf.date_part){
        this._obj[f] = $p.utils.fix_date(v, true);
      }
      else if(mf.digits){
        this._obj[f] = $p.utils.fix_number(v, !mf.hasOwnProperty("str_len"));
      }
      else if(mf.types[0]=="boolean"){
        this._obj[f] = $p.utils.fix_boolean(v);
      }
      else{
        this._obj[f] = v;
      }

    }
  },

  _setter_ts: {
	  value: function (f, v) {
      var ts = this._ts_(f);
      ts instanceof TabularSection && Array.isArray(v) && ts.load(v);
    }
  },


	_metadata: {
		get : function(){
			return this._manager.metadata()
		}
	},

	_deleted: {
		get : function(){
			return !!this._obj._deleted
		}
	},

	_modified: {
		get : function(){
			if(!this._data)
				return false;
			return !!(this._data._modified)
		}
	},

	is_new: {
		value: function(){
			return this._data._is_new;
		}
	},

	_set_loaded: {
		value: function(ref){
			this._manager.push(this, ref);
			this._data._modified = false;
			this._data._is_new = false;
			return this;
		}
	},

	mark_deleted: {
		value: function(deleted){
			this._obj._deleted = !!deleted;
			this.save();
			this.__notify('_deleted');
			return this;
		}
	},

	ref: {
		get : function(){return this._obj.ref},
		set : function(v){this._obj.ref = $p.utils.fix_guid(v)},
		enumerable : true,
		configurable: true
	},

  class_name: {
    get : function(){return this._manager.class_name},
    set : function(v){this._obj.class_name = v}
  },

	empty: {
		value: function(){
			return $p.utils.is_empty_guid(this._obj.ref);
		}
	},

	load: {
		value: function(){

			var reset_modified = function () {
					reset_modified = null;
					this._data._modified = false;
					return this;
				}.bind(this);

			if(this.ref == $p.utils.blank.guid){
				if(this instanceof CatObj){
          this.id = "000000000";
        }
				else{
          this.number_doc = "000000000";
        }
				return Promise.resolve(this);
			}
			else{
				if(this._manager.cachable && this._manager.cachable != "e1cib"){
					return $p.wsql.pouch.load_obj(this).then(reset_modified);
				}
				else{
          return _rest.load_obj(this).then(reset_modified);
        }
			}
		}
	},

	unload: {
		value: function(){
			var f, obj = this._obj;

			this._manager.unload_obj(this.ref);

			if(this._observers)
				this._observers.length = 0;

			if(this._notis)
				this._notis.length = 0;

			for(f in this._metadata.tabular_sections)
				this[f].clear(true);

			for(f in this){
				if(this.hasOwnProperty(f))
					delete this[f];
			}
			for(f in obj)
				delete obj[f];
			["_ts_","_obj","_data"].forEach(function (f) {
				delete this[f];
			}.bind(this));
			f = obj = null;
		}
	},

	save: {
		value: function (post, operational, attachments) {

			if(this instanceof DocObj && typeof post == "boolean"){
				var initial_posted = this.posted;
				this.posted = post;
			}

			var saver,

				before_save_res = this._manager.handle_event(this, "before_save"),

				reset_modified = function () {
					if(before_save_res === false){
						if(this instanceof DocObj && typeof initial_posted == "boolean" && this.posted != initial_posted){
							this.posted = initial_posted;
						}
					}else{
            this._data._modified = false;
          }
					saver = null;
					before_save_res = null;
					reset_modified = null;
					return this;
				}.bind(this);

			if(before_save_res === false){
				return Promise.reject(reset_modified());
			}
			else if(before_save_res instanceof Promise || typeof before_save_res === "object" && before_save_res.then){
				return before_save_res.then(reset_modified);
			}

			if(this._metadata.hierarchical && !this._obj.parent){
        this._obj.parent = $p.utils.blank.guid;
      }

			if(this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj){
				if($p.utils.blank.date == this.date)
					this.date = new Date();
				if(!this.number_doc)
					this.new_number_doc();
			}
			else{
				if(!this.id)
					this.new_number_doc();
			}

			if($p.msg && $p.msg.show_msg){
				for(var mf in this._metadata.fields){
					if(this._metadata.fields[mf].mandatory && !this._obj[mf]){
						$p.msg.show_msg({
							title: $p.msg.mandatory_title,
							type: "alert-error",
							text: $p.msg.mandatory_field.replace("%1", this._metadata.fields[mf].synonym)
						});
						before_save_res = false;
						return Promise.reject(reset_modified());
					}
				}
			}

			if(this._manager.cachable && this._manager.cachable != "e1cib"){
				saver = $p.wsql.pouch.save_obj;
			}
			else {
				saver = _rest.save_irest;
			}

			return saver(
				this, {
					post: post,
					operational: operational,
					attachments: attachments
				})
				.then(function (obj) {
					return obj._manager.handle_event(obj, "after_save");
				})
				.then(reset_modified);
		}
	},

	get_attachment: {
		value: function (att_id) {
			return this._manager.get_attachment(this.ref, att_id);
		}
	},

	save_attachment: {
		value: function (att_id, attachment, type) {
			return this._manager.save_attachment(this.ref, att_id, attachment, type)
				.then(function (att) {
					if(!this._attachments)
						this._attachments = {};
					if(!this._attachments[att_id] || !att.stub)
						this._attachments[att_id] = att;
					return att;
				}.bind(this));
		}
	},

	delete_attachment: {
		value: function (att_id) {
			return this._manager.delete_attachment(this.ref, att_id)
				.then(function (att) {
					if(this._attachments)
						delete this._attachments[att_id];
					return att;
				}.bind(this));
		}
	},

	_silent: {
		value: function (v) {
			if(typeof v == "boolean")
				this._data._silent = v;
			else{
				this._data._silent = true;
				setTimeout(function () {
					this._data._silent = false;
				}.bind(this));
			}
		}
	},

	print: {
		value: function (model, wnd) {
			return this._manager.print(this, model, wnd);
		}
	}

});


function CatObj(attr, manager) {

	CatObj.superclass.constructor.call(this, attr, manager);

	if(this._data && attr && typeof attr == "object"){
	  this._data._silent = true;
		if(attr._not_set_loaded){
			delete attr._not_set_loaded;
			this._mixin(attr);
		}
		else{
			this._mixin(attr);
			if(!$p.utils.is_empty_guid(this.ref) && (attr.id || attr.name))
				this._set_loaded(this.ref);
		}
    this._data._silent = false;
	}

}
CatObj._extend(DataObj);

CatObj.prototype.__define({

  id: {
    get : function(){ return this._obj.id || ""},
    set : function(v){
      this.__notify('id');
      this._obj.id = v;
    },
    enumerable: true
  },

  name: {
    get : function(){ return this._obj.name || ""},
    set : function(v){
      this.__notify('name');
      this._obj.name = String(v);
    },
    enumerable: true
  },

  presentation: {
    get : function(){
      if(this.name || this.id){
        return this.name || this.id || this._metadata.obj_presentation || this._metadata.synonym;
      }else{
        return this._presentation || "";
      }
    },
    set : function(v){
      if(v){
        this._presentation = String(v);
      }
    }
  },

  _hierarchy: {
    value: function (group) {
      var t = this;
      if(Array.isArray(group)){
        return group.some(function (v) {
          return t._hierarchy(v);
        });
      }
      if(this == group || t.parent == group){
        return true;
      }
      var parent = t.parent;
      if(parent && !parent.empty()){
        return parent._hierarchy(group);
      }
      return group == $p.utils.blank.guid;
    }
  },

  _children: {
    get: function () {
      var  t = this, res = [];
      this._manager.forEach(function (o) {
        if(o != t && o._hierarchy(t)){
          res.push(o);
        }
      });
      return res;
    }
  }

})



function DocObj(attr, manager) {

	var _presentation = "";

	DocObj.superclass.constructor.call(this, attr, manager);

	this.__define('presentation', {
		get : function(){

			if(this.number_doc)
				return (this._metadata.obj_presentation || this._metadata.synonym) + ' №' + this.number_doc + " от " + $p.moment(this.date).format($p.moment._masks.ldt);
			else
				return _presentation || "";

		},
		set : function(v){
			if(v)
				_presentation = String(v);
		}
	});

	if(attr && typeof attr == "object"){
    this._data._silent = true;
    this._mixin(attr);
    this._data._silent = false;
  }

	if(!$p.utils.is_empty_guid(this.ref) && attr.number_doc)
		this._set_loaded(this.ref);

	attr = null;
}
DocObj._extend(DataObj);

function doc_props_date_number(proto){
	proto.__define({

		number_doc: {
			get : function(){ return this._obj.number_doc || ""},
			set : function(v){
				this.__notify('number_doc');
				this._obj.number_doc = v;
			},
			enumerable: true
		},

		date: {
			get : function(){ return this._obj.date || $p.utils.blank.date},
			set : function(v){
				this.__notify('date');
				this._obj.date = $p.utils.fix_date(v, true);
			},
			enumerable: true
		}
	});
}

DocObj.prototype.__define({

	posted: {
		get : function(){ return this._obj.posted || false},
		set : function(v){
			this.__notify('posted');
			this._obj.posted = $p.utils.fix_boolean(v);
		},
		enumerable: true
	}

});
doc_props_date_number(DocObj.prototype);


function DataProcessorObj(attr, manager) {

	DataProcessorObj.superclass.constructor.call(this, attr, manager);

	var f, cmd = manager.metadata();
	for(f in cmd.fields){
	  if(!attr[f]){
      attr[f] = $p.utils.fetch_type("", cmd.fields[f].type);
    }
  }
	for(f in cmd["tabular_sections"]){
	  if(!attr[f]){
      attr[f] = [];
    }
  }

	this._mixin(attr);

}
DataProcessorObj._extend(DataObj);


function TaskObj(attr, manager) {

	TaskObj.superclass.constructor.call(this, attr, manager);


}
TaskObj._extend(CatObj);
doc_props_date_number(TaskObj.prototype);


function BusinessProcessObj(attr, manager) {

	BusinessProcessObj.superclass.constructor.call(this, attr, manager);


}
BusinessProcessObj._extend(CatObj);
doc_props_date_number(BusinessProcessObj.prototype);


function EnumObj(attr, manager) {

	EnumObj.superclass.constructor.call(this, attr, manager);

	if(attr && typeof attr == "object")
		this._mixin(attr);

}
EnumObj._extend(DataObj);

EnumObj.prototype.__define({

	order: {
		get : function(){ return this._obj.sequence},
		set : function(v){ this._obj.sequence = parseInt(v)},
		enumerable: true
	},

	name: {
		get : function(){ return this._obj.ref},
		set : function(v){ this._obj.ref = String(v)},
		enumerable: true
	},

	synonym: {
		get : function(){ return this._obj.synonym || ""},
		set : function(v){ this._obj.synonym = String(v)},
		enumerable: true
	},

	presentation: {
		get : function(){
			return this.synonym || this.name;
		}
	},

	empty: {
		value: function(){
			return !this.ref || this.ref == "_";
		}
	}
});


function RegisterRow(attr, manager){

	RegisterRow.superclass.constructor.call(this, attr, manager);

	if(attr && typeof attr == "object")
		this._mixin(attr);

	for(var check in manager.metadata().dimensions){
		if(!attr.hasOwnProperty(check) && attr.ref){
			var keys = attr.ref.split("¶");
			Object.keys(manager.metadata().dimensions).forEach(function (fld, ind) {
				this[fld] = keys[ind];
			}.bind(this));
			break;
		}
	}

}
RegisterRow._extend(DataObj);

RegisterRow.prototype.__define({

	_metadata: {
		get: function () {
			var _meta = this._manager.metadata();
			if (!_meta.fields)
				_meta.fields = ({})._mixin(_meta.dimensions)._mixin(_meta.resources)._mixin(_meta.attributes);
			return _meta;
		}
	},

	ref: {
		get : function(){
			return this._manager.get_ref(this);
		},
		enumerable: true
	},

	presentation: {
		get: function () {
			return this._metadata.obj_presentation || this._metadata.synonym;
		}
	}
});




function TabularSection(name, owner){

	if(!owner._obj[name])
		owner._obj[name] = [];

	this.__define('_name', {
		value : name,
		enumerable : false
	});

	this.__define('_owner', {
		value : owner,
		enumerable : false
	});

	this.__define("_obj", {
		value: owner._obj[name],
		writable: false,
		enumerable: false
	});
}

TabularSection.prototype.toString = function(){
	return "Табличная часть " + this._owner.class_name + "." + this._name
};

TabularSection.prototype.get = function(index){
	return this._obj[index] ? this._obj[index]._row : null;
};

TabularSection.prototype.count = function(){return this._obj.length};

TabularSection.prototype.clear = function(silent, selection){

  if(!selection){
    this._obj.length = 0;
  }
  else{
    this.find_rows(selection).forEach(function (row) {
      row._row._owner.del(row.row-1, true);
    })
  }

	if(!silent && !this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	return this;
};

TabularSection.prototype.del = function(val, silent){

	var index, _obj = this._obj;

	if(typeof val == "undefined")
		return;

	else if(typeof val == "number")
		index = val;

	else if(_obj[val.row-1]._row === val)
		index = val.row-1;

	else{
		for(var i in _obj)
			if(_obj[i]._row === val){
				index = Number(i);
				delete _obj[i]._row;
				break;
			}
	}
	if(index == undefined)
		return;

	_obj.splice(index, 1);

	_obj.forEach(function (row, index) {
		row.row = index + 1;
	});

	if(!silent && !this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	this._owner._data._modified = true;
};

TabularSection.prototype.find = function(val, columns){
	var res = $p._find(this._obj, val, columns);
	if(res)
		return res._row;
};

TabularSection.prototype.find_rows = function(selection, callback){

	var t = this,
		cb = callback ? function (row) {
			return callback.call(t, row._row);
		} : null;

	return $p._find_rows.call(t, t._obj, selection, cb);

};

TabularSection.prototype.swap = function(rowid1, rowid2){

	var row1 = this._obj[rowid1];
	this._obj[rowid1] = this._obj[rowid2];
	this._obj[rowid2] = row1;
  this._obj[rowid1].row = rowid1 + 1;
  this._obj[rowid2].row = rowid2 + 1;

	if(!this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});
};

TabularSection.prototype.add = function(attr, silent){

	var row = new $p[this._owner._manager.obj_constructor(this._name)](this);

	if(!attr)
		attr = {};

	for(var f in row._metadata.fields)
		row[f] = attr[f] || "";

	row._obj.row = this._obj.push(row._obj);
	row._obj.__define("_row", {
		value: row,
		enumerable: false
	});

	if(!silent && !this._owner._data._silent)
		Object.getNotifier(this._owner).notify({
			type: 'rows',
			tabular: this._name
		});

	attr = null;

	this._owner._data._modified = true;

	return row;
};

TabularSection.prototype.each = function(fn){
	var t = this;
	t._obj.forEach(function(row){
		return fn.call(t, row._row);
	});
};

TabularSection.prototype.forEach = TabularSection.prototype.each;

TabularSection.prototype.group_by = function (dimensions, resources) {

	try{
		var res = this.aggregate(dimensions, resources, "SUM", true);
		return this.clear(true).load(res);

	}catch(err){}
};

TabularSection.prototype.sort = function (fields) {

	if(typeof fields == "string")
		fields = fields.split(",");

	var sql = "select * from ? order by ", res = true;
	fields.forEach(function (f) {
		f = f.trim().replace(/\s{1,}/g," ").split(" ");
		if(res)
			res = false;
		else
			sql += ", ";
		sql += "`" + f[0] + "`";
		if(f[1])
			sql += " " + f[1];
	});

	try{
		res = $p.wsql.alasql(sql, [this._obj]);
		return this.clear(true).load(res);

	}catch(err){
		$p.record_log(err);
	}
};

TabularSection.prototype.aggregate = function (dimensions, resources, aggr, ret_array) {

	if(typeof dimensions == "string")
		dimensions = dimensions.split(",");
	if(typeof resources == "string")
		resources = resources.split(",");
	if(!aggr)
		aggr = "sum";

	if(!dimensions.length && resources.length == 1 && aggr == "sum"){
		return this._obj.reduce(function(sum, row, index, array) {
			return sum + row[resources[0]];
		}, 0);
	}

	var sql, res = true;

	resources.forEach(function (f) {
		if(!sql)
			sql = "select " + aggr + "(`" + f + "`) `" + f + "`";
		else
			sql += ", " + aggr + "(`" + f + "`) `" + f + "`";
	});
	dimensions.forEach(function (f) {
		if(!sql)
			sql = "select `" + f + "`";
		else
			sql += ", `" + f + "`";
	});
	sql += " from ? ";
	dimensions.forEach(function (f) {
		if(res){
			sql += "group by ";
			res = false;
		}
		else
			sql += ", ";
		sql += "`" + f + "`";
	});

	try{
		res = $p.wsql.alasql(sql, [this._obj]);
		if(!ret_array){
			if(resources.length == 1)
				res = res.length ? res[0][resources[0]] : 0;
			else
				res = res.length ? res[0] : {};
		}
		return res;

	}catch(err){
		$p.record_log(err);
	}
};

TabularSection.prototype.load = function(aattr){

	var t = this, arr;

	t.clear(true);
	if(aattr instanceof TabularSection)
		arr = aattr._obj;
	else if(Array.isArray(aattr))
		arr = aattr;
	if(arr)
		arr.forEach(function(row){
			t.add(row, true);
	});

	if(!this._owner._data._silent)
		Object.getNotifier(t._owner).notify({
			type: 'rows',
			tabular: t._name
		});

	return t;
};

TabularSection.prototype.sync_grid = function(grid, selection){
	var grid_data = {rows: []},
		columns = [];

	for(var i = 0; i<grid.getColumnCount(); i++)
		columns.push(grid.getColumnId(i));

	grid.clearAll();
	this.find_rows(selection, function(r){
		var data = [];
		columns.forEach(function (f) {
			if($p.utils.is_data_obj(r[f]))
				data.push(r[f].presentation);
			else
				data.push(r[f]);
		});
		grid_data.rows.push({ id: r.row, data: data });
	});
	if(grid.objBox){
		try{
			grid.parse(grid_data, "json");
			grid.callEvent("onGridReconstructed", []);
		} catch (e){}
	}
};

TabularSection.prototype.toJSON = function () {
	return this._obj;
};


function TabularSectionRow(owner){

	var _obj = {};

	this.__define('_owner', {
		value : owner,
		enumerable : false
	});

	this.__define("_obj", {
		value: _obj,
		writable: false,
		enumerable: false
	});

}

TabularSectionRow.prototype.__define('_metadata', {
	get : function(){ return this._owner._owner._metadata["tabular_sections"][this._owner._name]},
	enumerable : false
});

TabularSectionRow.prototype.__define("row", {
	get : function(){ return this._obj.row || 0},
	enumerable : true
});

TabularSectionRow.prototype.__define("_clone", {
	value : function(){
		return new $p[this._owner._owner._manager.obj_constructor(this._owner._name)](this._owner)._mixin(this._obj);
	},
	enumerable : false
});

TabularSectionRow.prototype._getter = DataObj.prototype._getter;

TabularSectionRow.prototype._setter = function (f, v) {

	if(this._obj[f] == v || (!v && this._obj[f] == $p.utils.blank.guid))
		return;

	var _owner = this._owner._owner;

	if(!_owner._data._silent)
		Object.getNotifier(_owner).notify({
			type: 'row',
			row: this,
			tabular: this._owner._name,
			name: f,
			oldValue: this._obj[f]
		});

	if(this._metadata.fields[f].choice_type){
		var prop;
		if(this._metadata.fields[f].choice_type.path.length == 2)
			prop = this[this._metadata.fields[f].choice_type.path[1]];
		else
			prop = _owner[this._metadata.fields[f].choice_type.path[0]];
		if(prop && prop.type)
			v = $p.utils.fetch_type(v, prop.type);
	}

	DataObj.prototype.__setter.call(this, f, v);
  _owner._data._modified = true;

};





function Rest(){


	this.filter_date = function (fld, dfrom, dtill) {
		if(!dfrom)
			dfrom = new Date("2015-01-01");
		var res = fld + " gt datetime'" + $p.moment(dfrom).format($p.moment._masks.iso) + "'";
		if(dtill)
			res += " and " + fld + " lt datetime'" + $p.moment(dtill).format($p.moment._masks.iso) + "'";
		return res;
	};


	this.to_data = function (rdata, mgr) {
		var o = {},
			cm = mgr.metadata(),
			mf = cm.fields,
			mts = cm.tabular_sections,
			ts, f, tf, row, syn, synts, vmgr;

		if(mgr instanceof RefDataManager){
			if(rdata.hasOwnProperty("DeletionMark"))
				o._deleted = rdata.DeletionMark;

			if(rdata.hasOwnProperty("DataVersion"))
				;
			if(rdata.hasOwnProperty("Ref_Key"))
				o.ref = rdata.Ref_Key;

		}else{
			mf = ({})._mixin(cm.dimensions)._mixin(cm.resources)._mixin(cm.attributes);
		}

		if(mgr instanceof DocManager){
			if(rdata.hasOwnProperty("Number"))
				o.number_doc = rdata.Number || rdata.number_doc;
			else if(rdata.hasOwnProperty("number_doc"))
				o.number_doc = rdata.number_doc;
			if(rdata.hasOwnProperty("Date"))
				o.date = rdata.Date;
			else if(rdata.hasOwnProperty("date"))
				o.date = rdata.date;
			if(rdata.hasOwnProperty("Posted"))
				o.posted = rdata.Posted;
			else if(rdata.hasOwnProperty("posted"))
				o.posted = rdata.posted;

		} else {
			if(cm.main_presentation_name){
				if(rdata.hasOwnProperty("Description"))
					o.name = rdata.Description;
				else if(rdata.hasOwnProperty("name"))
					o.name = rdata.name;
			}

			if(cm.code_length){
				if(rdata.hasOwnProperty("Code"))
					o.id = rdata.Code;
				else if(rdata.hasOwnProperty("id"))
					o.id = rdata.id;
			}
		}

		for(f in mf){
			if(rdata.hasOwnProperty(f)){
				o[f] = rdata[f];
			}else{
				syn = _md.syns_1с(f);
				if(syn.indexOf("_Key") == -1 && mf[f].type.is_ref && rdata[syn+"_Key"])
					syn+="_Key";
				if(!rdata.hasOwnProperty(syn))
					continue;
				o[f] = rdata[syn];
			}
		}

		for(ts in mts){
			synts = (ts == "extra_fields" || rdata.hasOwnProperty(ts)) ? ts : _md.syns_1с(ts);
			if(!rdata.hasOwnProperty(synts))
				continue;
			o[ts] = [];
			if(rdata[synts]){
				rdata[synts].sort(function (a, b) {
					return (a.LineNumber || a.row) > (b.LineNumber || b.row);
				});
				rdata[synts].forEach(function (r) {
					row = {};
					for(tf in mts[ts].fields){
						syn = (r.hasOwnProperty(tf) || (ts == "extra_fields" && (tf == "property" || tf == "value"))) ? tf : _md.syns_1с(tf);
						if(syn.indexOf("_Key") == -1 && mts[ts].fields[tf].type.is_ref && r[syn+"_Key"])
							syn+="_Key";
						row[tf] = r[syn];
					}
					o[ts].push(row);
				});
			}
		}

		return o;
	};


	this.ajax_to_data = function (attr, mgr) {
		return $p.ajax.get_ex(attr.url, attr)
			.then(function (req) {
				return JSON.parse(req.response);
			})
			.then(function (res) {
				var data = [];
				res.value.forEach(function (rdata) {
					data.push(_rest.to_data(rdata, mgr));
				});
				return data;
			});
	};

	this.build_select = function (attr, mgr) {
		var s, f, syn, type, select_str = "";

		function build_condition(fld, val){

			if(typeof val == "function"){
				f += val(mgr, fld);

			}else{

				syn = _md.syns_1с(fld);
				type = _md.get(mgr.class_name, fld);
				if(type){
					type = type.type;
					if(type.is_ref){
						if(syn.indexOf("_Key") == -1 && type.types.length && type.types[0].indexOf("enm.")==-1)
							syn += "_Key";
					}

					if(type.types.length){

						if(["boolean", "number"].indexOf(typeof val) != -1 )
							f += syn + " eq " + val;

						else if((type.is_ref && typeof val != "object") || val instanceof DataObj)
							f += syn + " eq guid'" + val + "'";

						else if(typeof val == "string")
							f += syn + " eq '" + val + "'";

						else if(typeof val == "object"){
							if(val.hasOwnProperty("like"))
								f += syn + " like '%" + val.like + "%'";

							else if(val.hasOwnProperty("not")){
								f += " not (" + build_condition(fld, val.not) + ") ";
							}

							else if(val.hasOwnProperty("in")){
								f += (syn + " in (") + (type.is_ref ? val.in.map(function(v){return "guid'" + v + "'"}).join(",") : val.in.join(",")) + ") ";
							}
						}
					}
				}
			}
		}

		function build_selection(sel){
			for(var fld in sel){

				if(!f)
					f = "&$filter=";
				else
					f += " and ";

				if(fld == "or" && Array.isArray(sel[fld])){
					var first = true;
					sel[fld].forEach(function (element) {

						if(first){
							f += " ( ";
							first = false;
						}else
							f += " or ";

						var key = Object.keys(element)[0];
						build_condition(key, element[key]);

					});
					f += " ) ";

				}else
					build_condition(fld, sel[fld]);

			}
		}

		if(!attr)
			attr = {};

		if(attr.fields){
			attr.fields.forEach(function(fld){
				if(fld == "ref")
					syn = "Ref_Key";
				else{
					syn = _md.syns_1с(fld);
					type = _md.get(mgr.class_name, fld).type;
					if(type.is_ref){
						if(syn.indexOf("_Key") == -1 && type.types.length && type.types[0].indexOf("enm.")==-1)
							syn += "_Key";
					}
				}
				if(!s)
					s = "&$select=";
				else
					s += ",";
				s += syn;
			});
			select_str += s;
		}

		if(attr.selection){
			if(typeof attr.selection == "function"){

			}else if(Array.isArray(attr.selection))
				attr.selection.forEach(build_selection);

			else
				build_selection(attr.selection);

			if(f)
				select_str += f;
		}


		if($p.job_prm.rest &&
			mgr.rest_name.indexOf("Module_") == -1 &&
			mgr.rest_name.indexOf("DataProcessor_") == -1 &&
			mgr.rest_name.indexOf("Report_") == -1 &&
			select_str.indexOf(" like ") == -1 &&
			select_str.indexOf(" in ") == -1 &&
			!mgr.metadata().irest )
			$p.ajax.default_attr(attr, $p.job_prm.rest_url());
		else
			$p.ajax.default_attr(attr, $p.job_prm.irest_url());

		attr.url += mgr.rest_name + "?allowedOnly=true&$format=json&$top=" + (attr.top || 300) + select_str;
	};


	this.load_array = function (attr, mgr) {

		_rest.build_select(attr, mgr);

		return _rest.ajax_to_data(attr, mgr);
	};


	this.load_obj = function (tObj) {

		var attr = {};
		$p.ajax.default_attr(attr, (!tObj._metadata.irest && $p.job_prm.rest) ? $p.job_prm.rest_url() : $p.job_prm.irest_url());
		attr.url += tObj._manager.rest_name + "(guid'" + tObj.ref + "')?$format=json";

		return $p.ajax.get_ex(attr.url, attr)
			.then(function (req) {
				return JSON.parse(req.response);
			})
			.then(function (res) {
				tObj._mixin(_rest.to_data(res, tObj._manager))._set_loaded();
				return tObj;
			})
			.catch(function (err) {
				if(err.status==404)
					return tObj;
				else
					$p.record_log(err);
			});
	};


	this.save_irest = function (tObj, attr) {

		var post_data = JSON.stringify(tObj),
			prm = (attr.post != undefined ? ",post="+attr.post : "")+
				(attr.operational != undefined ? ",operational="+attr.operational : "");

		$p.ajax.default_attr(attr, $p.job_prm.irest_url());
		attr.url += tObj._manager.rest_name + "(guid'"+tObj.ref+"'"+prm+")";

		return $p.ajax.post_ex(attr.url, post_data, attr)
			.then(function (req) {
				return JSON.parse(req.response);
			})
			.then(function (res) {
				return tObj._mixin(res);
			});
	};


	this.save_rest = function (tObj, attr) {

		var atom = tObj.to_atom(),
			url;

		$p.ajax.default_attr(attr, $p.job_prm.rest_url());
		url = attr.url + tObj._manager.rest_name;

		attr.url = url + "(guid'" + tObj.ref + "')?$format=json&$select=Ref_Key,DeletionMark";

		return $p.ajax.get_ex(attr.url, attr)
			.catch(function (err) {
				if(err.status == 404){
					return {response: JSON.stringify({is_new: true})};
				}else
					return Promise.reject(err);
			})
			.then(function (req) {
				return JSON.parse(req.response);
			})
			.then(function (data) {
				if(data.is_new)
					return $p.ajax.post_ex(url, atom, attr);
				else
					return $p.ajax.patch_ex(url + "(guid'" + tObj.ref + "')", atom, attr);
			})
			.then(function (req) {
				var data = xmlToJSON.parseString(req.response, {
					mergeCDATA: false, 
					grokAttr: true, 
					grokText: false, 
					normalize: true, 
					xmlns: false, 
					namespaceKey: '_ns', 
					textKey: '_text', 
					valueKey: '_value', 
					attrKey: '_attr', 
					cdataKey: '_cdata', 
					attrsAsObject: false, 
					stripAttrPrefix: true, 
					stripElemPrefix: true, 
					childrenAsArray: false 
				});
				if(data.entry && data.entry.content && data.entry.updated){
					var p = data.entry.content.properties, r = {}, v;
					for(var i in p){
						if(i.indexOf("_")==0)
							continue;
						if(v = p[i].element){
							r[i] = [];
							if(Array.isArray(v)){
								for(var n in v){
									r[i][n] = {};
									for(var j in v[n])
										if(j.indexOf("_")!=0)
											r[i][n][j] = v[n][j]._text === "false" ? false : v[n][j]._text;
								}
							}else{
								r[i][0] = {};
								for(var j in v)
									if(j.indexOf("_")!=0)
										r[i][0][j] = v[j]._text === "false" ? false : v[j]._text;
							}
						}else
							r[i] = p[i]._text === "false" ? false : p[i]._text;
					}
					return _rest.to_data(r, tObj._manager);
				}
			})
			.then(function (res) {
				return tObj._mixin(res);
			});

	};
}

var _rest = $p.rest = new Rest();



DataManager.prototype.__define("rest_name", {
	get : function(){
		var fp = this.class_name.split("."),
			csyn = {
				cat: "Catalog",
				doc: "Document",
				ireg: "InformationRegister",
				areg: "AccumulationRegister",
				cch: "ChartOfCharacteristicTypes",
				cacc: "ChartOfAccounts",
				tsk: "Task",
				bp: "BusinessProcess"
			};
		return csyn[fp[0]] + "_" + _md.syns_1с(fp[1]);
	},
	enumerable : false
});


DataManager.prototype.rest_tree = function (attr) {

	var t = this,
		cmd = t.metadata(),
		flds = [], ares = [], o, ro, syn, mf;

	$p.ajax.default_attr(attr, (!cmd.irest && $p.job_prm.rest) ? $p.job_prm.rest_url() : $p.job_prm.irest_url());
	attr.url += this.rest_name + "?allowedOnly=true&$format=json&$top=1000&$select=Ref_Key,DeletionMark,Parent_Key,Description&$filter=IsFolder eq true";

	return $p.ajax.get_ex(attr.url, attr)
		.then(function (req) {
			return JSON.parse(req.response);
		})
		.then(function (res) {
			for(var i = 0; i < res.value.length; i++) {
				ro = res.value[i];
				o = {
					ref: ro["Ref_Key"],
					_deleted: ro["DeletionMark"],
					parent: ro["Parent_Key"],
					presentation: ro["Description"]
				};
				ares.push(o);
			}
			return $p.iface.data_to_tree(ares);
		});

};

DataManager.prototype.rest_selection = function (attr) {

	if(attr.action == "get_tree")
		return this.rest_tree(attr);

	var t = this,
		cmd = t.metadata(),
		flds = [],
		ares = [], o, ro, syn, mf,
		select,
		filter_added;

	select = (function(){

		var s = "$select=Ref_Key,DeletionMark";

		if(cmd.form && cmd.form.selection){
			cmd.form.selection.fields.forEach(function (fld) {
				flds.push(fld);
			});

		}else if(t instanceof DocManager){
			flds.push("posted");
			flds.push("date");
			flds.push("number_doc");

		}else if(t instanceof TaskManager){
			flds.push("name as presentation");
			flds.push("date");
			flds.push("number_doc");
			flds.push("completed");

		}else if(t instanceof BusinessProcessManager){
			flds.push("date");
			flds.push("number_doc");
			flds.push("started");
			flds.push("finished");

		}else{

			if(cmd["hierarchical"] && cmd["group_hierarchy"])
				flds.push("is_folder");
			else
				flds.push("0 as is_folder");

			if(cmd["main_presentation_name"])
				flds.push("name as presentation");
			else{
				if(cmd["code_length"])
					flds.push("id as presentation");
				else
					flds.push("'...' as presentation");
			}

			if(cmd["has_owners"])
				flds.push("owner");

			if(cmd["code_length"])
				flds.push("id");

		}

		flds.forEach(function(fld){
			var parts;
			if(fld.indexOf(" as ") != -1){
				parts = fld.split(" as ")[0].split(".");
				if(parts.length == 1)
					fld = parts[0];
				else if(parts[0] != "_t_")
					return;
				else
					fld = parts[1]
			}
			if(fld == "0")
				return;
			syn = _md.syns_1с(fld);
			if(_md.get(t.class_name, fld).type.is_ref){
				if(syn.indexOf("_Key") == -1 && _md.get(t.class_name, fld).type.types.length && _md.get(t.class_name, fld).type.types[0].indexOf("enm.")==-1)
					syn += "_Key";
			}

			s += "," + syn;
		});

		flds.push("ref");
		flds.push("_deleted");

		return s;

	})();


	$p.ajax.default_attr(attr, (!cmd.irest && $p.job_prm.rest) ? $p.job_prm.rest_url() : $p.job_prm.irest_url());
	attr.url += (cmd.irest && cmd.irest.selection ? cmd.irest.selection : this.rest_name) + "?allowedOnly=true&$format=json&$top=1000&" + select;

	if(_md.get(t.class_name, "date") && (attr.date_from || attr.date_till)){
		attr.url += "&$filter=" + _rest.filter_date("Date", attr.date_from, attr.date_till);
		filter_added = true;
	}

	if(cmd["hierarchical"] && attr.parent){
		attr.url += filter_added ? " and " : "&$filter=";
		attr.url += "Parent_Key eq guid'" + attr.parent + "'";
		filter_added = true;
	}

	if(cmd["has_owners"] && attr.owner){
		attr.url += filter_added ? " and " : "&$filter=";
		attr.url += "Owner_Key eq guid'" + attr.owner + "'";
		filter_added = true;
	}

	if(attr.filter){
		attr.url += filter_added ? " and " : "&$filter=";
		attr.url += "$filter eq '" + attr.filter + "'";
		filter_added = true;
	}

	return $p.ajax.get_ex(attr.url, attr)
		.then(function (req) {
			return JSON.parse(req.response);
		})
		.then(function (res) {
			for(var i = 0; i < res.value.length; i++) {
				ro = res.value[i];
				o = {};
				flds.forEach(function (fld) {

					var fldsyn;

					if(fld == "ref") {
						o[fld] = ro["Ref_Key"];
						return;
					}else if(fld.indexOf(" as ") != -1){
						fldsyn = fld.split(" as ")[1];
						fld = fld.split(" as ")[0].split(".");
						fld = fld[fld.length-1];
					}else
						fldsyn = fld;

					syn = _md.syns_1с(fld);
					mf = _md.get(t.class_name, fld);
					if(mf){
						if(syn.indexOf("_Key") == -1 && mf.type.is_ref && mf.type.types.length && mf.type.types[0].indexOf("enm.")==-1)
							syn += "_Key";

						if(mf.type.date_part)
							o[fldsyn] = $p.moment(ro[syn]).format($p.moment._masks[mf.type.date_part]);

						else if(mf.type.is_ref){
							if(!ro[syn] || ro[syn] == $p.utils.blank.guid)
								o[fldsyn] = "";
							else{
								var mgr	= _md.value_mgr(o, fld, mf.type, false, ro[syn]);
								if(mgr)
									o[fldsyn] = mgr.get(ro[syn]).presentation;
								else
									o[fldsyn] = "";
							}
						}else
							o[fldsyn] = ro[syn];
					}
				});
				ares.push(o);
			}
			return $p.iface.data_to_grid.call(t, ares, attr);
		});

};

InfoRegManager.prototype.rest_slice_last = function(selection){

	if(!selection.period)
		selection.period = $p.utils.date_add_day(new Date(), 1);

	var t = this,
		cmd = t.metadata(),
		period = "Period=datetime'" + $p.moment(selection.period).format($p.moment._masks.iso) + "'",
		condition = "";

	for(var fld in cmd.dimensions){

		if(selection[fld] === undefined)
			continue;

		var syn = _md.syns_1с(fld),
			mf = cmd.dimensions[fld];

		if(syn.indexOf("_Key") == -1 && mf.type.is_ref && mf.type.types.length && mf.type.types[0].indexOf("enm.")==-1){
			syn += "_Key";
			if(condition)
				condition+= " and ";
			condition+= syn+" eq guid'"+selection[fld].ref+"'";
		}else{
			if(condition)
				condition+= " and ";

			if(mf.type.digits)
				condition+= syn+" eq "+$p.utils.fix_number(selection[fld]);

			else if(mf.type.date_part)
				condition+= syn+" eq datetime'"+ $p.moment(selection[fld]).format($p.moment._masks.iso) +"'";

			else
				condition+= syn+" eq '"+selection[fld]+"'";
		}

	}

	if(condition)
		period+= ",Condition='"+condition+"'";

	$p.ajax.default_attr(selection, $p.job_prm.rest_url());
	selection.url += this.rest_name + "/SliceLast(%sl)?allowedOnly=true&$format=json&$top=1000".replace("%sl", period);

	return _rest.ajax_to_data(selection, t)
		.then(function (data) {
			return t.load_array(data);
		});
};


DataObj.prototype.to_atom = function (ex_meta) {

	var res = '<entry><category term="StandardODATA.%n" scheme="http://schemas.microsoft.com/ado/2007/08/dataservices/scheme"/>\
				\n<title type="text"/><updated>%d</updated><author/><summary/><content type="application/xml">\
				\n<m:properties xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices" xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata">\
			%p\
			\n</m:properties></content></entry>'
		.replace('%n', this._manager.rest_name)
		.replace('%d', $p.moment().format($p.moment.defaultFormatUtc)),

		prop = '\n<d:Ref_Key>' + this.ref + '</d:Ref_Key>' +
			'\n<d:DeletionMark>' + this._deleted + '</d:DeletionMark>',

		f, mf, fts, ts, mts, pname, v;

	function fields_to_atom(obj){
		var meta_fields = obj._metadata.fields,
			prefix = obj instanceof TabularSectionRow ? '\n\t<d:' : '\n<d:';

		for(f in meta_fields){
			mf = meta_fields[f];
			pname = _md.syns_1с(f);
			v = obj[f];
			if(v instanceof EnumObj)
				v = v.empty() ? "" : v.name;

			else if(v instanceof DataObj){
				if(pname.indexOf("_Key") == -1)
					pname+= '_Key';
				v = v.ref;

			}else if(mf.type.date_part){
				if(v.getFullYear() < 1000)
					v = '0001-01-01T00:00:00Z';
				else
					v = $p.moment(v).format($p.moment.defaultFormatUtc);

			}else if(v == undefined)
				continue;


			prop+= prefix + pname + '>' + v + '</d:' + pname + '>';
		}
	}

	if(this instanceof DocObj){
		prop+= '\n<d:Date>' + $p.moment(this.date).format($p.moment.defaultFormatUtc) + '</d:Date>';
		prop+= '\n<d:Number>' + this.number_doc + '</d:Number>';

	} else {

		if(this._metadata.main_presentation_name)
			prop+= '\n<d:Description>' + this.name + '</d:Description>';

		if(this._metadata.code_length)
			prop+= '\n<d:Code>' + this.id + '</d:Code>';

		if(this._metadata.hierarchical && this._metadata.group_hierarchy)
			prop+= '\n<d:IsFolder>' + this.is_folder + '</d:IsFolder>';

	}

	fields_to_atom(this);

	for(fts in this._metadata.tabular_sections) {

		mts = this._metadata.tabular_sections[fts];

		pname = 'StandardODATA.' + this._manager.rest_name + '_' + _md.syns_1с(fts) + '_RowType';
		ts = this[fts];
		if(ts.count()){
			prop+= '\n<d:' + _md.syns_1с(fts) + ' m:type="Collection(' + pname + ')">';

			ts.each(function (row) {
				prop+= '\n\t<d:element m:type="' + pname + '">';
				prop+= '\n\t<d:LineNumber>' + row.row + '</d:LineNumber>';
				fields_to_atom(row);
				prop+= '\n\t</d:element>';
			});

			prop+= '\n</d:' + _md.syns_1с(fts) + '>';

		}else
			prop+= '\n<d:' + _md.syns_1с(fts) + ' m:type="Collection(' + pname + ')" />';
	}

	return res.replace('%p', prop);

};





DataManager.prototype.__define({

	pouch_load_array: {
		value: function (refs, with_attachments) {

			var options = {
				limit : refs.length + 1,
				include_docs: true,
				keys: refs.map(function (v) {
					return this.class_name + "|" + v;
				}.bind(this))
			};
			if(with_attachments){
				options.attachments = true;
				options.binary = true;
			}

			return this.pouch_db.allDocs(options)
				.then(function (result) {
					return $p.wsql.pouch.load_changes(result, {});
				})
		}
	},

	pouch_load_view: {
		value: function (_view) {

			var t = this, doc, res = [],
				options = {
					limit : 1000,
					include_docs: true,
					startkey: t.class_name + "|",
					endkey: t.class_name + '|\ufff0'
				};

			return new Promise(function(resolve, reject){

				function process_docs(err, result) {

					if (result) {

						if (result.rows.length){

							options.startkey = result.rows[result.rows.length - 1].key;
							options.skip = 1;

							result.rows.forEach(function (rev) {
								doc = rev.doc;
								key = doc._id.split("|");
								doc.ref = key[1];
								res.push(doc);
							});

							t.load_array(res);
							res.length = 0;

							t.pouch_db.query(_view, options, process_docs);

						}else{
							resolve();
						}

					} else if(err){
						reject(err);
					}
				}

				t.pouch_db.query(_view, options, process_docs);

			});
		}
	},

	pouch_db: {
		get: function () {
		  const cachable = this.cachable.replace("_ram", "");
			if(cachable.indexOf("remote") != -1)
				return $p.wsql.pouch.remote[cachable.replace("_remote", "")];
			else
				return $p.wsql.pouch.local[cachable] || $p.wsql.pouch.remote[cachable];
		}
	},

	pouch_find_rows: {
		value: function (selection) {

			var t = this, doc, res = [],
				_raw, _view, _total_count, top, calc_count,
				top_count = 0, skip = 0, skip_count = 0,
				options = {
					limit : 100,
					include_docs: true,
					startkey: t.class_name + "|",
					endkey: t.class_name + '|\ufff0'
				};

			if(selection){

				if(selection._top){
					top = selection._top;
					delete selection._top;
				}else
					top = 300;

				if(selection._raw) {
					_raw = selection._raw;
					delete selection._raw;
				}

				if(selection._total_count) {
					_total_count = selection._total_count;
					delete selection._total_count;
				}

				if(selection._view) {
					_view = selection._view;
					delete selection._view;
				}

				if(selection._key) {

					if(selection._key._order_by == "des"){
						options.startkey = selection._key.endkey || selection._key + '\ufff0';
						options.endkey = selection._key.startkey || selection._key;
						options.descending = true;
					}else{
						options.startkey = selection._key.startkey || selection._key;
						options.endkey = selection._key.endkey || selection._key + '\ufff0';
					}
				}

				if(typeof selection._skip == "number") {
					skip = selection._skip;
					delete selection._skip;
				}

				if(selection._attachments) {
					options.attachments = true;
					options.binary = true;
					delete selection._attachments;
				}

			}

			if(_total_count){

				calc_count = true;
				_total_count = 0;

				if(Object.keys(selection).length <= 1){

					if(selection._key && selection._key.hasOwnProperty("_search")){
						options.include_docs = false;
						options.limit = 100000;

						return t.pouch_db.query(_view, options)
							.then(function (result) {

								result.rows.forEach(function (row) {

									if(!selection._key._search || row.key[row.key.length-1].toLowerCase().indexOf(selection._key._search) != -1){

										_total_count++;

										if(skip) {
											skip_count++;
											if (skip_count < skip)
												return;
										}

										if(top) {
											top_count++;
											if (top_count > top)
												return;
										}

										res.push(row.id);
									}
								});

								delete options.startkey;
								delete options.endkey;
								if(options.descending)
									delete options.descending;
								options.keys = res;
								options.include_docs = true;

								return t.pouch_db.allDocs(options);

							})
							.then(function (result) {
								return {
									rows: result.rows.map(function (row) {

										var doc = row.doc;

										doc.ref = doc._id.split("|")[1];

										if(!_raw){
											delete doc._id;
											delete doc._rev;
										}

										return doc;
									}),
									_total_count: _total_count
								};
							})
					}

				}

			}

			return new Promise(function(resolve, reject){

				function process_docs(err, result) {

					if (result) {

						if (result.rows.length){

							options.startkey = result.rows[result.rows.length - 1].key;
							options.skip = 1;

							result.rows.forEach(function (rev) {
								doc = rev.doc;

								key = doc._id.split("|");
								doc.ref = key[1];

								if(!_raw){
									delete doc._id;
									delete doc._rev;
								}

								if(!$p._selection.call(t, doc, selection))
									return;

								if(calc_count)
									_total_count++;

								if(skip) {
									skip_count++;
									if (skip_count < skip)
										return;
								}

								if(top) {
									top_count++;
									if (top_count > top)
										return;
								}

								res.push(doc);
							});

							if(top && top_count > top && !calc_count) {
								resolve(_raw ? res : t.load_array(res));

							}else
								fetch_next_page();

						}else{
							if(calc_count){
								resolve({
									rows: _raw ? res : t.load_array(res),
									_total_count: _total_count
								});
							}else
								resolve(_raw ? res : t.load_array(res));
						}

					} else if(err){
						reject(err);
					}
				}

				function fetch_next_page() {

					if(_view){
            t.pouch_db.query(_view, options, process_docs);
          }
					else{
            t.pouch_db.allDocs(options, process_docs);
          }
				}

				fetch_next_page();

			});

		}
	},

	pouch_selection: {
		value: function (attr) {

			var t = this,
				cmd = attr.metadata || t.metadata(),
				flds = ["ref", "_deleted"], 
				selection = {
					_raw: true,
					_total_count: true,
					_top: attr.count || 30,
					_skip: attr.start || 0
				},   
				ares = [], o, mf, fldsyn;

			if(cmd.form && cmd.form.selection){
				cmd.form.selection.fields.forEach(function (fld) {
					flds.push(fld);
				});

			}else if(t instanceof DocManager){
				flds.push("posted");
				flds.push("date");
				flds.push("number_doc");

			}else if(t instanceof TaskManager){
				flds.push("name as presentation");
				flds.push("date");
				flds.push("number_doc");
				flds.push("completed");

			}else if(t instanceof BusinessProcessManager){
				flds.push("date");
				flds.push("number_doc");
				flds.push("started");
				flds.push("finished");

			}else{

				if(cmd["hierarchical"] && cmd["group_hierarchy"])
					flds.push("is_folder");
				else
					flds.push("0 as is_folder");

				if(cmd["main_presentation_name"])
					flds.push("name as presentation");
				else{
					if(cmd["code_length"])
						flds.push("id as presentation");
					else
						flds.push("'...' as presentation");
				}

				if(cmd["has_owners"])
					flds.push("owner");

				if(cmd["code_length"])
					flds.push("id");

			}

			if(_md.get(t.class_name, "date") && (attr.date_from || attr.date_till)){

				if(!attr.date_from)
					attr.date_from = new Date("2015-01-01");
				if(!attr.date_till)
					attr.date_till = $p.utils.date_add_day(new Date(), 1);

				selection.date = {between: [attr.date_from, attr.date_till]};

			}

			if(cmd["hierarchical"] && attr.parent)
				selection.parent = attr.parent;

			if(attr.selection){
				if(Array.isArray(attr.selection)){
					attr.selection.forEach(function (asel) {
						for(fldsyn in asel)
							if(fldsyn[0] != "_" || fldsyn == "_view" || fldsyn == "_key")
								selection[fldsyn] = asel[fldsyn];
					});
				}else
					for(fldsyn in attr.selection)
						if(fldsyn[0] != "_" || fldsyn == "_view" || fldsyn == "_key")
							selection[fldsyn] = attr.selection[fldsyn];
			}

			if(selection._key && selection._key._drop_date && selection.date) {
				delete selection.date;
			}

			if(attr.filter && (!selection._key || !selection._key._search)) {
				if(cmd.input_by_string.length == 1)
					selection[cmd.input_by_string] = {like: attr.filter};
				else{
					selection.or = [];
					cmd.input_by_string.forEach(function (ifld) {
						var flt = {};
						flt[ifld] = {like: attr.filter};
						selection.or.push(flt);
					});
				}
			}

			if(selection._key && selection._key._order_by){
				selection._key._order_by = attr.direction;
			}


			return t.pouch_find_rows(selection)
				.then(function (rows) {

					if(rows.hasOwnProperty("_total_count") && rows.hasOwnProperty("rows")){
						attr._total_count = rows._total_count;
						rows = rows.rows
					}

					rows.forEach(function (doc) {

						o = {};
						flds.forEach(function (fld) {

							if(fld == "ref") {
								o[fld] = doc[fld];
								return;
							}else if(fld.indexOf(" as ") != -1){
								fldsyn = fld.split(" as ")[1];
								fld = fld.split(" as ")[0].split(".");
								fld = fld[fld.length-1];
							}else
								fldsyn = fld;

							mf = _md.get(t.class_name, fld);
							if(mf){

								if(mf.type.date_part)
									o[fldsyn] = $p.moment(doc[fld]).format($p.moment._masks[mf.type.date_part]);

								else if(mf.type.is_ref){
									if(!doc[fld] || doc[fld] == $p.utils.blank.guid)
										o[fldsyn] = "";
									else{
										var mgr	= _md.value_mgr(o, fld, mf.type, false, doc[fld]);
										if(mgr)
											o[fldsyn] = mgr.get(doc[fld]).presentation;
										else
											o[fldsyn] = "";
									}
								}else if(typeof doc[fld] === "number" && mf.type.fraction_figits)
									o[fldsyn] = doc[fld].toFixed(mf.type.fraction_figits);

								else
									o[fldsyn] = doc[fld];
							}
						});
						ares.push(o);
					});

					return $p.iface.data_to_grid.call(t, ares, attr);
				})
				.catch($p.record_log);

		}
	},


	pouch_tree: {
		value: function (attr) {

			return this.pouch_find_rows({
				is_folder: true,
				_raw: true,
				_top: attr.count || 300,
				_skip: attr.start || 0
			})
				.then(function (rows) {
					rows.sort(function (a, b) {
						if (a.parent == $p.utils.blank.guid && b.parent != $p.utils.blank.guid)
							return -1;
						if (b.parent == $p.utils.blank.guid && a.parent != $p.utils.blank.guid)
							return 1;
						if (a.name < b.name)
							return -1;
						if (a.name > b.name)
							return 1;
						return 0;
					});
					return rows.map(function (row) {
						return {
							ref: row.ref,
							parent: row.parent,
							presentation: row.name
						}
					});
				})
				.then($p.iface.data_to_tree);
		}
	},

	save_attachment: {
		value: function (ref, att_id, attachment, type) {

			if(!type)
				type = {type: "text/plain"};

			if(!(attachment instanceof Blob) && type.indexOf("text") == -1)
				attachment = new Blob([attachment], {type: type});

			var _rev,
				db = this.pouch_db;
			ref = this.class_name + "|" + $p.utils.fix_guid(ref);

			return db.get(ref)
				.then(function (res) {
					if(res)
						_rev = res._rev;
				})
				.catch(function (err) {
					if(err.status != 404)
						throw err;
				})
				.then(function () {
					return db.putAttachment(ref, att_id, _rev, attachment, type);
				});

		}
	},

	get_attachment: {
		value: function (ref, att_id) {

			return this.pouch_db.getAttachment(this.class_name + "|" + $p.utils.fix_guid(ref), att_id);

		}
	},

	delete_attachment: {
		value: function (ref, att_id) {

			var _rev,
				db = this.pouch_db;
			ref = this.class_name + "|" + $p.utils.fix_guid(ref);

			return db.get(ref)
				.then(function (res) {
					if(res)
						_rev = res._rev;
				})
				.catch(function (err) {
					if(err.status != 404)
						throw err;
				})
				.then(function () {
					return db.removeAttachment(ref, att_id, _rev);
				});
		}
	}

});

DataObj.prototype.__define({

	new_number_doc: {

		value: function (prefix) {

			if(!this._metadata.code_length)
				return;

			if(!prefix){
        prefix = (($p.current_user && $p.current_user.prefix) || "") + ((this.organization && this.organization.prefix) || "");
      }

			var obj = this,
				part = "",
				year = (this.date instanceof Date) ? this.date.getFullYear() : 0,
				code_length = this._metadata.code_length - prefix.length;

			if(this._manager.cachable == "ram")
				return Promise.resolve(this.new_cat_id(prefix));

			return obj._manager.pouch_db.query("doc/number_doc",
				{
					limit : 1,
					include_docs: false,
					startkey: [obj.class_name, year, prefix + '\ufff0'],
					endkey: [obj.class_name, year, prefix],
					descending: true
				})
				.then(function (res) {
					if(res.rows.length){
						var num0 = res.rows[0].key[2];
						for(var i = num0.length-1; i>0; i--){
							if(isNaN(parseInt(num0[i])))
								break;
							part = num0[i] + part;
						}
						part = (parseInt(part || 0) + 1).toFixed(0);
					}else{
						part = "1";
					}
					while (part.length < code_length)
						part = "0" + part;

					if(obj instanceof DocObj || obj instanceof TaskObj || obj instanceof BusinessProcessObj)
						obj.number_doc = prefix + part;
					else
						obj.id = prefix + part;

					return obj;

				});
		}
	},

	new_cat_id: {

		value: function (prefix) {

			if(!prefix)
				prefix = (($p.current_user && $p.current_user.prefix) || "") +
					(this.organization && this.organization.prefix ? this.organization.prefix : ($p.wsql.get_user_param("zone") + "-"));

			var code_length = this._metadata.code_length - prefix.length,
				field = (this instanceof DocObj || this instanceof TaskObj || this instanceof BusinessProcessObj) ? "number_doc" : "id",
				part = "",
				res = $p.wsql.alasql("select top 1 " + field + " as id from ? where " + field + " like '" + prefix + "%' order by " + field + " desc", [this._manager.alatable]);

			if(res.length){
				var num0 = res[0].id || "";
				for(var i = num0.length-1; i>0; i--){
					if(isNaN(parseInt(num0[i])))
						break;
					part = num0[i] + part;
				}
				part = (parseInt(part || 0) + 1).toFixed(0);
			}else{
				part = "1";
			}
			while (part.length < code_length)
				part = "0" + part;

			this[field] = prefix + part;

			return this;
		}
	}
});


$p.iface.OBtnAuthSync = function OBtnAuthSync() {

	var bars = [], spin_timer;


	function btn_click(){

		if($p.wsql.pouch.authorized)
			dhtmlx.confirm({
				title: $p.msg.log_out_title,
				text: $p.msg.logged_in + $p.wsql.pouch.authorized + $p.msg.log_out_break,
				cancel: $p.msg.cancel,
				callback: function(btn) {
					if(btn){
						$p.wsql.pouch.log_out();
					}
				}
			});
		else
			$p.iface.frm_auth({
				modal_dialog: true
			});
	}

	function set_spin(spin){

		if(spin && spin_timer){
			clearTimeout(spin_timer);

		}else{
			bars.forEach(function (bar) {
				if(spin)
					bar.buttons.sync.innerHTML = '<i class="fa fa-refresh fa-spin md-fa-lg"></i>';
				else{
					if($p.wsql.pouch.authorized)
						bar.buttons.sync.innerHTML = '<i class="fa fa-refresh md-fa-lg"></i>';
					else
						bar.buttons.sync.innerHTML = '<i class="fa fa-ban md-fa-lg"></i>';
				}
			});
		}
		spin_timer = spin ? setTimeout(set_spin, 3000) : 0;
	}

	function set_auth(){

		bars.forEach(function (bar) {

			if($p.wsql.pouch.authorized){
				bar.buttons.auth.title = "Отключиться от сервера";
				bar.buttons.auth.innerHTML = '<span class="span_user">' + $p.wsql.pouch.authorized + '</span>';
				bar.buttons.sync.title = "Синхронизация выполняется...";
				bar.buttons.sync.innerHTML = '<i class="fa fa-refresh md-fa-lg"></i>';
			}else{
				bar.buttons.auth.title = "Войти на сервер и включить синхронизацию данных";
				bar.buttons.auth.innerHTML = '&nbsp;<i class="fa fa-sign-in md-fa-lg"></i><span class="span_user">Вход...</span>';
				bar.buttons.sync.title = "Синхронизация не выполняется - пользователь не авторизован на сервере";
				bar.buttons.sync.innerHTML = '<i class="fa fa-ban md-fa-lg"></i>';
			}
		})
	}

	this.bind = function (bar) {
		bar.buttons.auth.onclick = btn_click;
		bar.buttons.sync.onclick = null;
		bars.push(bar);
		setTimeout(set_auth);
		return bar;
	};

	$p.on({

		pouch_load_data_start: function (page) {

			if(!$p.iface.sync)
				$p.iface.wnd_sync();
			$p.iface.sync.create($p.eve.stepper);
			$p.eve.stepper.frm_sync.setItemValue("text_bottom", "Читаем справочники");

			if(page.hasOwnProperty("local_rows") && page.local_rows < 10){
				$p.eve.stepper.wnd_sync.setText("Первый запуск - подготовка данных");
				$p.eve.stepper.frm_sync.setItemValue("text_processed", "Загрузка начального образа");
			}else{
				$p.eve.stepper.wnd_sync.setText("Загрузка данных из IndexedDB");
				$p.eve.stepper.frm_sync.setItemValue("text_processed", "Извлечение начального образа");
			}

			set_spin(true);
		},

		pouch_load_data_page: function (page) {
			set_spin(true);
			var stepper = $p.eve.stepper;
			if(stepper.wnd_sync){
			  var curr = stepper[page.id || "ram"];
        curr.total_rows = page.total_rows;
        curr.page = page.page;
        curr.docs_written = page.docs_written || page.page * page.limit;
        if(curr.docs_written > curr.total_rows){
          curr.total_rows = (curr.docs_written * 1.05).round(0);
        }
        var text_current, text_bottom;
        if(!stepper.doc.docs_written){
          text_current = "Обработано элементов: " + curr.docs_written + " из " + curr.total_rows;
          text_bottom = "Текущий запрос: " + curr.page + " (" + (100 * curr.docs_written/curr.total_rows).toFixed(0) + "%)";
        }
        else{
          var docs_written = stepper.ram.docs_written + stepper.doc.docs_written;
          var total_rows = stepper.ram.total_rows + stepper.doc.total_rows;
          curr = stepper.ram.page + stepper.doc.page;
          text_current = "Обработано ram: " + stepper.ram.docs_written + " из " + stepper.ram.total_rows + "<br />" +
            "Обработано doc: " + stepper.doc.docs_written + " из " + stepper.doc.total_rows;
          text_bottom = "Текущий запрос: " + curr + " (" + (100 * docs_written/total_rows).toFixed(0) + "%)";
        };
        stepper.frm_sync.setItemValue("text_current", text_current);
        stepper.frm_sync.setItemValue("text_bottom", text_bottom);
			}
		},

		pouch_change: function (id, page) {
			set_spin(true);
		},

		pouch_data_loaded: function (page) {
			$p.eve.stepper.wnd_sync && $p.iface.sync.close();
		},

		pouch_load_data_error: function (err) {
			set_spin();
			$p.eve.stepper.wnd_sync && $p.iface.sync.close();
		},

		user_log_in: function (username) {
			set_auth();
		},

		user_log_fault: function () {
			set_auth();
		},

		user_log_out: function () {
			set_auth();
		}
	});
};




var eXcell_proto = new eXcell();

eXcell_proto.input_keydown = function(e, t){

	function obj_on_select(v){
		if(t.source.on_select)
			t.source.on_select.call(t.source, v);
	}

	if(e.keyCode === 8 || e.keyCode === 46){          
		t.setValue("");
		t.grid.editStop();
		if(t.source.on_select)
			t.source.on_select.call(t.source, "");

	}else if(e.keyCode === 9 || e.keyCode === 13)
		t.grid.editStop();                          

	else if(e.keyCode === 115)
		t.cell.firstChild.childNodes[1].onclick(e); 

	else if(e.keyCode === 113){                      
		if(t.source.tabular_section){
			t.mgr = _md.value_mgr(t.source.row, t.source.col, t.source.row._metadata.fields[t.source.col].type);
			if(t.mgr){
				var tv = t.source.row[t.source.col];
				t.mgr.form_obj(t.source.wnd, {
					o: tv,
					on_select: obj_on_select
				});
			}

		}else if(t.fpath.length==1){
			t.mgr = _md.value_mgr(t.source.o._obj, t.fpath[0], t.source.o._metadata.fields[t.fpath[0]].type);
			if(t.mgr){
				var tv = t.source.o[t.fpath[0]];
				t.mgr.form_obj(t.source.wnd, {
					o: tv,
					on_select: obj_on_select
				});
			}
		}
	}

	return $p.iface.cancel_bubble(e);
};

function eXcell_ocombo(cell){

	if (!cell)
		return;

	var t = this;

	t.cell = cell;
	t.grid = cell.parentNode.grid;

	t.setValue=function(val){
		t.setCValue(val instanceof DataObj ? val.presentation : (val || ""));
	};

	t.getValue=function(){
		return t.grid.get_cell_value();

	};

	t.shiftNext = function () {
		t.grid.editStop();
	};

	t.edit=function(){

		if(t.combo)
			return;

		t.val = t.getValue();		
		t.cell.innerHTML = "";
		t.combo = new OCombo({
			parent: t.cell,
			grid: t.grid
		}._mixin(t.grid.get_cell_field()));
		t.combo.getInput().focus();
	};

  t.open_selection = function () {
    t.edit();
    t.combo && t.combo.open_selection && t.combo.open_selection();
  }

	t.detach=function(){
		if(t.combo){

			if(t.combo.getComboText){
				t.setValue(t.combo.getComboText());         
				if(!t.combo.getSelectedValue())
					t.combo.callEvent("onChange");
				var res = !$p.utils.is_equal(t.val, t.getValue());
				t.combo.unload();
				return res;

			} else if(t.combo.unload){
				t.combo.unload();
			}
		}
		return true;
	}
}
eXcell_ocombo.prototype = eXcell_proto;
window.eXcell_ocombo = eXcell_ocombo;

window.eXcell_ref = eXcell_ocombo;

window.eXcell_refc = eXcell_ocombo;

function eXcell_pwd(cell){ 

	var fnedit;
	if (cell){                
		this.cell = cell;
		this.grid = cell.parentNode.grid;
		eXcell_ed.call(this); 
		fnedit = this.edit;
		this.edit = function(){
			fnedit.call(this);
			this.obj.type="password";
		};
		this.setValue=function(){
			this.setCValue("*********");
		};
		this.getValue=function(){
			return this.grid.get_cell_value();

		};
		this.detach=function(){
			if(this.grid.get_cell_field){
				var cf = this.grid.get_cell_field();
				cf.obj[cf.field] = this.obj.value;
			}
			this.setValue();
			fnedit = null;
			return this.val != this.getValue();
		}
	}
}
eXcell_pwd.prototype = eXcell_proto;
window.eXcell_pwd = eXcell_pwd;


dhtmlXCalendarObject.prototype._dateToStr = function(val, format) {
	if(val instanceof Date && val.getFullYear() < 1000)
		return "";
	else
		return window.dhx4.date2str(val, format||this._dateFormat, this._dateStrings());
};

eXcell_dhxCalendar.prototype.edit = function() {

	var arPos = this.grid.getPosition(this.cell);
	this.grid._grid_calendarA._show(false, false);
	this.grid._grid_calendarA.setPosition(arPos[0],arPos[1]+this.cell.offsetHeight);
	this.grid._grid_calendarA._last_operation_calendar = false;


	this.grid.callEvent("onCalendarShow", [this.grid._grid_calendarA, this.cell.parentNode.idd, this.cell._cellIndex]);
	this.cell._cediton = true;
	this.val = this.cell.val;
	if(this.val instanceof Date && this.val.getFullYear() < 1000)
		this.val = new Date();
	this._val = this.cell.innerHTML;
	var t = this.grid._grid_calendarA.draw;
	this.grid._grid_calendarA.draw = function(){};
	this.grid._grid_calendarA.setDateFormat((this.grid._dtmask||"%d.%m.%Y"));
	this.grid._grid_calendarA.setDate(this.val||(new Date()));
	this.grid._grid_calendarA.draw = t;

};

eXcell_dhxCalendar.prototype.setCValue = function(val, val2){
	this.cell.innerHTML = val instanceof Date ? this.grid._grid_calendarA._dateToStr(val) : val;
	this.grid._grid_calendarA.getFormatedDate((this.grid._dtmask||"%d/%m/%Y"),val).toString()
	this.grid.callEvent("onCellChanged", [
		this.cell.parentNode.idd,
		this.cell._cellIndex,
		(arguments.length > 1 ? val2 : val)
	]);
};

(function(){

	function fix_auth(t, method, url, async){
		if(url.indexOf("odata/standard.odata") != -1 || url.indexOf("/hs/rest") != -1){
			var username, password;
			if($p.ajax.authorized){
				username = $p.ajax.username;
				password = $p.aes.Ctr.decrypt($p.ajax.password);

			}else{
				if($p.job_prm.guest_name){
					username = $p.job_prm.guest_name;
					password = $p.aes.Ctr.decrypt($p.job_prm.guest_pwd);

				}else{
					username = $p.wsql.get_user_param("user_name");
					password = $p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd"));
				}
			}
			t.open(method, url, async, username, password);
			t.withCredentials = true;
			t.setRequestHeader("Authorization", "Basic " +
				btoa(unescape(encodeURIComponent(username + ":" + password))));
		}else
			t.open(method, url, async);
	}

	dhx4.ajax._call = function(method, url, postData, async, onLoad, longParams, headers) {

		var t = (window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
		var isQt = (navigator.userAgent.match(/AppleWebKit/) != null && navigator.userAgent.match(/Qt/) != null && navigator.userAgent.match(/Safari/) != null);

		if (async == true) {
			t.onreadystatechange = function() {
				if ((t.readyState == 4) || (isQt == true && t.readyState == 3)) { 
					if (t.status != 200 || t.responseText == "")
						if (!dhx4.callEvent("onAjaxError", [{xmlDoc:t, filePath:url, async:async}])) return;

					window.setTimeout(function(){
						if (typeof(onLoad) == "function") {
							onLoad.apply(window, [{xmlDoc:t, filePath:url, async:async}]); 
						}
						if (longParams != null) {
							if (typeof(longParams.postData) != "undefined") {
								dhx4.ajax.postLong(longParams.url, longParams.postData, onLoad);
							} else {
								dhx4.ajax.getLong(longParams.url, onLoad);
							}
						}
						onLoad = null;
						t = null;
					},1);
				}
			}
		}

		if (method == "GET") {
			url += this._dhxr(url);
		}

		t.open(method, url, async);

		fix_auth(t, method, url, async);

		if (headers != null) {
			for (var key in headers) t.setRequestHeader(key, headers[key]);
		} else if (method == "POST" || method == "PUT" || method == "DELETE") {
			t.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		} else if (method == "GET") {
			postData = null;
		}

		t.setRequestHeader("X-Requested-With", "XMLHttpRequest");

		t.send(postData);

		if (async != true) {
			if ((t.readyState == 4) || (isQt == true && t.readyState == 3)) {
				if (t.status != 200 || t.responseText == "") dhx4.callEvent("onAjaxError", [{xmlDoc:t, filePath:url, async:async}]);
			}
		}

		return {xmlDoc:t, filePath:url, async:async}; 

	};

	dhtmlx.ajax.prototype.send = function(url,params,call){
		var x=this.getXHR();
		if (typeof call == "function")
			call = [call];
		if (typeof params == "object"){
			var t=[];
			for (var a in params){
				var value = params[a];
				if (value === null || value === dhtmlx.undefined)
					value = "";
				t.push(a+"="+encodeURIComponent(value));
			}
			params=t.join("&");
		}
		if (params && !this.post){
			url=url+(url.indexOf("?")!=-1 ? "&" : "?")+params;
			params=null;
		}

		fix_auth(x, this.post?"POST":"GET",url,!this._sync);

		if (this.post)
			x.setRequestHeader('Content-type','application/x-www-form-urlencoded');

		var self=this;
		x.onreadystatechange= function(){
			if (!x.readyState || x.readyState == 4){
				if (call && self)
					for (var i=0; i < call.length; i++)	
						if (call[i])
							call[i].call((self.master||self),x.responseText,x.responseXML,x);
				self.master=null;
				call=self=null;	
			}
		};

		x.send(params||null);
		return x; 
	}

})();

dhtmlXCellObject.prototype.is_visible = function () {
	var rect = this.cell.getBoundingClientRect();
	return rect.right > 0 && rect.bottom > 0;
};


$p.iface.data_to_grid = function (data, attr){

	if(this.data_to_grid)
		return this.data_to_grid(data, attr);

	function cat_picture_class(r){
		var res;
		if(r.hasOwnProperty("posted")){
			res = r.posted ? "cell_doc_posted" : "cell_doc";
		}else{
			res = r.is_folder ? "cell_ref_folder" : "cell_ref_elm";
		}

		if(r._deleted)
			res = res + "_deleted";
		return res ;
	}

	function do_format(v){

		if(v instanceof Date){
			if(v.getHours() || v.getMinutes())
				return $p.moment(v).format($p.moment._masks.date_time);
			else
				return $p.moment(v).format($p.moment._masks.date);

		}else
			return typeof v == "number" ? v : $p.iface.normalize_xml(v || "");
	}

	var xml = "<?xml version='1.0' encoding='UTF-8'?><rows total_count='%1' pos='%2' set_parent='%3'>"
			.replace("%1", attr._total_count || data.length)
      .replace("%2", attr.start)
			.replace("%3", attr.set_parent || "" ),
		caption = this.caption_flds(attr);

	xml += caption.head;

	data.forEach(function(r){
		xml +=  "<row id=\"" + r.ref + "\"><cell class=\"" + cat_picture_class(r) + "\">" + do_format(r[caption.acols[0].id]) + "</cell>";
		for(var col=1; col < caption.acols.length; col++ )
			xml += "<cell>" + do_format(r[caption.acols[col].id]) + "</cell>";

		xml += "</row>";
	});

	return xml + "</rows>";
};

$p.iface.data_to_tree = function (data) {

	var res = [{id: $p.utils.blank.guid, text: "..."}];

	function add_hierarchically(arr, row){
		var curr = {id: row.ref, text: row.presentation, items: []};
		arr.push(curr);
		$p._find_rows(data, {parent: row.ref}, function(r){
			add_hierarchically(curr.items, r);
		});
		if(!curr.items.length)
			delete curr.items;
	}
	$p._find_rows(data, {parent: $p.utils.blank.guid}, function(r){
		add_hierarchically(res, r);
	});

	return res;
};






function ODropdownList(attr){

	var ul = document.createElement('ul'), li, div, a;

	function set_order_text(silent){
		a.innerHTML = attr.values[a.getAttribute("current")];
		if(attr.event_name && !silent)
			dhx4.callEvent(attr.event_name, [a.getAttribute("current")]);
	}

	function body_click(){
		div.classList.remove("open");
	}

	attr.container.innerHTML = '<div class="dropdown_list">' + attr.title + '<a href="#" class="dropdown_list"></a></div>';
	div = attr.container.firstChild;
	a = div.querySelector("a");
	a.setAttribute("current", Array.isArray(attr.values) ? "0" : Object.keys(attr.values)[0]);
	div.onclick = function (e) {
		if(!div.classList.contains("open")){
			div.classList.add("open");
		}else{
			if(e.target.tagName == "LI"){
				for(var i in ul.childNodes){
					if(ul.childNodes[i] == e.target){
						a.setAttribute("current", e.target.getAttribute("current"));
						set_order_text();
						break;
					}
				}
			}
			body_click();
		}
		return $p.iface.cancel_bubble(e);
	};
	div.appendChild(ul);
	ul.className = "dropdown_menu";
	if(attr.class_name){
		div.classList.add(attr.class_name);
		ul.classList.add(attr.class_name);
	}

	for(var i in attr.values){
		li = document.createElement('li');
		var pos = attr.values[i].indexOf('<i');
		li.innerHTML = attr.values[i].substr(pos) + " " + attr.values[i].substr(0, pos);
		li.setAttribute("current", i);
		ul.appendChild(li);
	};

	document.body.addEventListener("keydown", function (e) {
		if(e.keyCode == 27) { 
			div.classList.remove("open");
		}
	});
	document.body.addEventListener("click", body_click);

	this.unload = function () {
		var child;
		while (child = div.lastChild)
			div.removeChild(child);
		attr.container.removeChild(div);
		li = ul = div = a = attr = null;
	};

	set_order_text(true);

}
$p.iface.ODropdownList = ODropdownList;



dhtmlXCellObject.prototype.attachDynTree = function(mgr, filter, callback) {

	if(this.setCollapsedText)
		this.setCollapsedText("Дерево");

	if(!filter)
		filter = {is_folder: true};

	var tree = this.attachTreeView();


	tree.__define({

		filter: {
			get: function () {

			},
			set: function (v) {
				filter = v;
			},
			enumerable: false,
			configurable: false
		}
	});

	setTimeout(function () {

		mgr.sync_grid({
			action: "get_tree",
			filter: filter
		}, tree)
			.then(function (res) {
				if(callback)
					callback(res);
			});

	});

	return tree;
};

function OCombo(attr){

	var _obj, _field, _meta, _mgr, _property, popup_focused,
		t = this,
		_pwnd = {
			on_select: attr.on_select || function (selv) {
				_obj[_field] = selv;
			}
		};

	if(attr.pwnd && attr.pwnd.setModal)
		_pwnd.setModal = attr.pwnd.setModal.bind(attr.pwnd);

	OCombo.superclass.constructor.call(t, attr);

	if(attr.on_select){
		t.getBase().style.border = "none";
		t.getInput().style.left = "-3px";
		if(!attr.is_tabular)
			t.getButton().style.right = "9px";
	} else
		t.getBase().style.marginBottom = "4px";

	if(attr.left)
		t.getBase().style.left = left + "px";

	this.attachEvent("onChange", function(){
		if(_obj && _field){
		  var val = this.getSelectedValue();
		  if(!val && this.getComboText()){
        val = this.getOptionByLabel(this.getComboText());
        if(val){
          val = val.value;
        }
        else{
          this.setComboText("");
        }
      }
      _obj[_field] = val;
    }
	});

	this.attachEvent("onBlur", function(){
		if(!this.getSelectedValue() && this.getComboText()){
      this.setComboText("");
    }
	});

	this.attachEvent("onDynXLS", function (text) {

	  if(!_meta){
	    return;
    }
		if(!_mgr){
      _mgr = _md.value_mgr(_obj, _field, _meta.type);
    }
		if(_mgr){
			t.clearAll();
			(attr.get_option_list || _mgr.get_option_list).call(_mgr, null, get_filter(text))
				.then(function (l) {
					if(t.addOption){
						t.addOption(l);
						t.openSelect();
					}
				});
		}

	});

	function get_filter(text){
		var filter = {_top: 30}, choice;

		if(_mgr && _mgr.metadata().hierarchical && _mgr.metadata().group_hierarchy){
			if(_meta.choice_groups_elm == "elm")
				filter.is_folder = false;
			else if(_meta.choice_groups_elm == "grp" || _field == "parent")
				filter.is_folder = true;
		}

		if(_meta.choice_links)
			_meta.choice_links.forEach(function (choice) {
				if(choice.name && choice.name[0] == "selection"){
					if(_obj instanceof TabularSectionRow){
						if(choice.path.length < 2)
							filter[choice.name[1]] = typeof choice.path[0] == "function" ? choice.path[0] : _obj._owner._owner[choice.path[0]];
						else{
							if(choice.name[1] == "owner" && !_mgr.metadata().has_owners){
								return;
							}
							filter[choice.name[1]] = _obj[choice.path[1]];
						}
					}else{
						filter[choice.name[1]] = typeof choice.path[0] == "function" ? choice.path[0] : _obj[choice.path[0]];
					}
				}
			});

		if(_meta.choice_params)
			_meta.choice_params.forEach(function (choice) {

				var fval = Array.isArray(choice.path) ? {in: choice.path} : choice.path;

				if(!filter[choice.name])
					filter[choice.name] = fval;

				else if(Array.isArray(filter[choice.name]))
					filter[choice.name].push(fval);

				else{
					filter[choice.name] = [filter[choice.name]];
					filter[choice.name].push(fval);
				}
			});

		if(_meta._option_list_local){
			filter._local = true;
		}

		if(text){
			filter.presentation = {like: text};
		}

		if(attr.property && attr.property.filter_params_links){
			attr.property.filter_params_links(filter, attr);
		}

		return filter;
	}


	function aclick(e){
		if(this.name == "select"){
			if(_mgr)
				_mgr.form_selection(_pwnd, {
					initial_value: _obj[_field].ref,
					selection: [get_filter()]
				});
			else
				aclick.call({name: "type"});

		} else if(this.name == "add"){
			if(_mgr)
				_mgr.create({}, true)
					.then(function (o) {
						o._set_loaded(o.ref);
						o.form_obj(attr.pwnd);
					});
		}
		else if(this.name == "open"){
			if(_obj && _obj[_field] && !_obj[_field].empty())
				_obj[_field].form_obj(attr.pwnd);
		}
		else if(_meta && this.name == "type"){
			var tlist = [], tmgr, tmeta, tobj = _obj, tfield = _field;
			_meta.type.types.forEach(function (o) {
				tmgr = _md.mgr_by_class_name(o);
				tmeta = tmgr.metadata();
				tlist.push({
					presentation: tmeta.synonym || tmeta.name,
					mgr: tmgr,
					selected: _mgr === tmgr
				});
			});
			$p.iface.select_from_list(tlist)
				.then(function(v){
					if(tobj[tfield] && ((tobj[tfield].empty && tobj[tfield].empty()) || tobj[tfield]._manager != v.mgr)){
						_mgr = v.mgr;
						_obj = tobj;
						_field = tfield;
						_meta = _obj._metadata.fields[_field];
						_mgr.form_selection({
							on_select: function (selv) {
								_obj[_field] = selv;
								_obj = null;
								_field = null;
								_meta = null;

							}}, {
							selection: [get_filter()]
						});
					}
					_mgr = null;
					tmgr = null;
					tmeta = null;
					tobj = null;
					tfield = null;
				});
		}

		if(e)
			return $p.iface.cancel_bubble(e);
	}

	function popup_hide(){
		popup_focused = false;
		setTimeout(function () {
			if(!popup_focused){
				if($p.iface.popup.p && $p.iface.popup.p.onmouseover)
					$p.iface.popup.p.onmouseover = null;
				if($p.iface.popup.p && $p.iface.popup.p.onmouseout)
					$p.iface.popup.p.onmouseout = null;
				$p.iface.popup.clear();
				$p.iface.popup.hide();
			}
		}, 300);
	}

	function popup_show(){

		if(!_mgr || !_mgr.class_name || _mgr instanceof EnumManager){
      return;
    }

		popup_focused = true;
		var div = document.createElement('div'),
			innerHTML = attr.hide_frm ? "" : "<a href='#' name='select' title='Форма выбора {F4}'>Показать все</a>" +
				"<a href='#' name='open' style='margin-left: 9px;' title='Открыть форму элемента {Ctrl+Shift+F4}'><i class='fa fa-external-link fa-fw'></i></a>";

		if(!attr.hide_frm){
			var _acl = $p.current_user.get_acl(_mgr.class_name);
			if(_acl.indexOf("i") != -1)
				innerHTML += "&nbsp;<a href='#' name='add' title='Создать новый элемент {F8}'><i class='fa fa-plus fa-fwfa-fw'></i></a>";
		}

		if(_meta.type.types.length > 1)
			innerHTML += "&nbsp;<a href='#' name='type' title='Выбрать тип значения {Alt+T}'><i class='fa fa-level-up fa-fw'></i></a>";

		if(innerHTML){
			div.innerHTML = innerHTML;
			for(var i=0; i<div.children.length; i++)
				div.children[i].onclick = aclick;

			$p.iface.popup.clear();
			$p.iface.popup.attachObject(div);
			$p.iface.popup.show(dhx4.absLeft(t.getButton())-77, dhx4.absTop(t.getButton()), t.getButton().offsetWidth, t.getButton().offsetHeight);

			$p.iface.popup.p.onmouseover = function(){
				popup_focused = true;
			};

			$p.iface.popup.p.onmouseout = popup_hide;
		}
	}

	function oncontextmenu(e) {
		setTimeout(popup_show, 10);
		e.preventDefault();
		return false;
	}

	function onkeyup(e) {

		if(!_mgr || _mgr instanceof EnumManager){
      return;
    }

		if(e.keyCode == 115){ 
			if(e.ctrlKey && e.shiftKey){
				if(!_obj[_field].empty())
					_obj[_field].form_obj(attr.pwnd);

			}else if(!e.ctrlKey && !e.shiftKey){
				if(_mgr)
					_mgr.form_selection(_pwnd, {
						initial_value: _obj[_field].ref,
						selection: [get_filter()]
					});
			}
			return $p.iface.cancel_bubble(e);
		}
	}

	function onfocus(e) {
		setTimeout(function () {
			if(t && t.getInput)
				t.getInput().select();
		}, 50);
	}

	t.getButton().addEventListener("mouseover", popup_show);

	t.getButton().addEventListener("mouseout", popup_hide);

	t.getBase().addEventListener("click", $p.iface.cancel_bubble);

	t.getBase().addEventListener("contextmenu", oncontextmenu);

	t.getInput().addEventListener("keyup", onkeyup);

	t.getInput().addEventListener("focus", onfocus);


	function observer(changes){
		if(!t || !t.getBase)
			return;
		else if(!t.getBase().parentElement)
			setTimeout(t.unload);
		else{
			if(_obj instanceof TabularSectionRow){

			}else
				changes.forEach(function(change){
					if(change.name == _field){
						set_value(_obj[_field]);
					}
				});
		}
	}

	function set_value(v){
		if(v && v instanceof DataObj && !v.empty()){
			if(!t.getOption(v.ref))
				t.addOption(v.ref, v.presentation);
			if(t.getSelectedValue() == v.ref)
				return;
			t.setComboValue(v.ref);
		}else if(!t.getSelectedValue()){
			t.setComboValue("");
			t.setComboText("")
		}
	}

	this.attach = function (attr) {

		if(_obj){
			if(_obj instanceof TabularSectionRow)
				Object.unobserve(_obj._owner._owner, observer);
			else
				Object.unobserve(_obj, observer);
		}

		_obj = attr.obj;
		_field = attr.field;
		_property = attr.property;

		if(attr.metadata)
			_meta = attr.metadata;

		else if(_property){
			_meta = _obj._metadata.fields[_field]._clone();
			_meta.type = _property.type;

		}else
			_meta = _obj._metadata.fields[_field];

		t.clearAll();
		_mgr = _md.value_mgr(_obj, _field, _meta.type);

		if(_mgr || attr.get_option_list){
			(attr.get_option_list || _mgr.get_option_list).call(_mgr, _obj[_field], get_filter())
				.then(function (l) {
					if(t.addOption){
						t.addOption(l);
						set_value(_obj[_field]);
					}
				});
		}

		if(_obj instanceof TabularSectionRow)
			Object.observe(_obj._owner._owner, observer, ["row"]);
		else
			Object.observe(_obj, observer, ["update"]);

	};

  this.open_selection = function () {
    aclick.call({name: "select"});
  }

	var _unload = this.unload;
	this.unload = function () {

		popup_hide();

		t.getButton().removeEventListener("mouseover", popup_show);

		t.getButton().removeEventListener("mouseout", popup_hide);

		t.getBase().removeEventListener("click", $p.iface.cancel_bubble);

		t.getBase().removeEventListener("contextmenu", oncontextmenu);

		t.getInput().removeEventListener("keyup", onkeyup);

		t.getInput().removeEventListener("focus", onfocus);

		if(_obj){
			if(_obj instanceof TabularSectionRow)
				Object.unobserve(_obj._owner._owner, observer);
			else
				Object.unobserve(_obj, observer);
		}

		if(t.conf && t.conf.tm_confirm_blur)
			clearTimeout(t.conf.tm_confirm_blur);

		_obj = null;
		_field = null;
		_meta = null;
		_mgr = null;
		_pwnd = null;

		try{ _unload.call(t); }catch(e){}
	};

	if(attr.obj && attr.field)
		this.attach(attr);
	this.enableFilteringMode("between", "dummy", false, false);

	this.__define({
		value: {
			get: function () {
				if(_obj)
					return _obj[_field];
			}
		}
	});

}
OCombo._extend(dhtmlXCombo);
$p.iface.OCombo = OCombo;

$p.iface.select_from_list = function (list, multy) {

	return new Promise(function(resolve, reject){

		if(!Array.isArray(list) || !list.length)
			resolve(undefined);

		else if(list.length == 1)
			resolve(list[0]);


		var options = {
				name: 'wnd_select_from_list',
				wnd: {
					id: 'wnd_select_from_list',
					width: 300,
					height: 300,
					modal: true,
					center: true,
					caption: $p.msg.select_from_list,
					allow_close: true,
					on_close: function () {
						if(rid)
							resolve(list[parseInt(rid)-1]);
						return true;
					}
				}
			},
			rid, sid,
			wnd = $p.iface.dat_blank(null, options.wnd),
			_grid = wnd.attachGrid(),
			_toolbar = wnd.attachToolbar({
				items:[
					{id: "select", type: "button", text: $p.msg.select_from_list},
					{id: "cancel", type: "button", text: "Отмена"}
				],
				onClick: do_select
			});

		function do_select(id){
			if(id != "cancel")
				rid = _grid.getSelectedRowId();
			wnd.close();
		}

		_grid.setIconsPath(dhtmlx.image_path);
		_grid.setImagePath(dhtmlx.image_path);
		_grid.setHeader($p.msg.value);
		_grid.setColTypes("ro");
		_grid.enableAutoWidth(true, 1200, 600);
		_grid.attachEvent("onRowDblClicked", do_select);
		_grid.enableMultiselect(!!multy);
		_grid.setNoHeader(true);
		_grid.init();

		_toolbar.addSpacer("select");

		wnd.hideHeader();
		wnd.cell.offsetParent.querySelector(".dhxwin_brd").style.border = "none"

		list.forEach(function (o, i) {
			var text;
			if(typeof o == "object")
				text = o.presentation || o.text || o.toString();
			else
				text = o.toString();
			_grid.addRow(1+i, text);
			if(o.selected)
				sid = 1+i;
		});
		if(sid)
			_grid.selectRowById(sid);

	});
};

$p.iface.query_value = function (initial, caption) {

  return new Promise(function(resolve, reject){


    var options = {
        name: 'wnd_query_value',
        wnd: {
          width: 300,
          height: 160,
          modal: true,
          center: true,
          caption: caption || 'Введите значение',
          allow_close: true,
          on_close: function () {
            reject();
            return true;
          }
        }
      },
      wnd = $p.iface.dat_blank(null, options.wnd),
      _toolbar = wnd.attachToolbar({
        items:[
          {id: "select", type: "button", text: "<b>Ok</b>"},
          {id: "sp", type: "spacer"},
          {id: "cancel", type: "button", text: "Отмена"}
        ],
        onClick: function (id){
          if(id == "cancel"){
            wnd.close()
          }
          else{
            resolve(wnd.cell.querySelector('INPUT').value);
            wnd.close();
          }
        }
      });

    wnd.attachHTMLString("<input type='text' style='width: 94%; padding: 4px;' value='" + initial + "' />");

  });
};


function ODateRangePicker(container, attr) {

	var _cont = this._cont = document.createElement('div');

	if(container instanceof dhtmlXCellObject){
		container.appendObject(this._cont);
	}else{
		container.appendChild(this._cont);
	}

	this._cont.className = "odaterangepicker";
	this._cont.innerHTML = '<i class="fa fa-calendar"></i>&nbsp; <span></span> &nbsp;<i class="fa fa-caret-down"></i>';

	this.__define({

		set_text: {
			value: 	function() {
				$('span', _cont).html(this.date_from.format('DD MMM YY') + ' - ' + this.date_till.format('DD MMM YY'));
			}
		},

		on: {
			value: function (event, fn) {
				return $(_cont).on(event, fn);
			}
		},

		date_from: {
			get: function () {
				return $(_cont).data('daterangepicker').startDate;
			},
			set: function (v) {
				$(_cont).data('daterangepicker').setStartDate(v);
				this.set_text()
			}
		},

		date_till: {
			get: function () {
				return $(_cont).data('daterangepicker').endDate;
			},
			set: function (v) {
				$(_cont).data('daterangepicker').setEndDate(v);
				this.set_text()
			}
		}
	});

	$(_cont).daterangepicker({
		startDate: attr.date_from ? moment(attr.date_from) : moment().subtract(29, 'days'),
		endDate: moment(attr.date_till),
		showDropdowns: true,
		alwaysShowCalendars: true,
		opens: "left",
		ranges: {
			'Сегодня': [moment(), moment()],
			'Вчера': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			'Последние 7 дней': [moment().subtract(6, 'days'), moment()],
			'Последние 30 дней': [moment().subtract(29, 'days'), moment()],
			'Этот месяц': [moment().startOf('month'), moment().endOf('month')],
			'Прошлый месяц': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		}
	}, this.set_text.bind(this));

	this.set_text();

}

$p.iface.ODateRangePicker = ODateRangePicker;

dhtmlXCellObject.prototype.attachHeadFields = function(attr) {

	var _obj,
		_oxml,
		_meta,
		_mgr,
		_selection,
		_tsname,
		_extra_fields,
		_pwnd,
		_cell = this,
		_grid = _cell.attachGrid(),
		_destructor = _grid.destructor;

	function observer(changes){
		if(!_obj){
			var stack = [];
			changes.forEach(function(change){
				if(stack.indexOf[change.object]==-1){
					stack.push(change.object);
					Object.unobserve(change.object, observer);
					if(_extra_fields && _extra_fields instanceof TabularSection)
						Object.unobserve(change.object, observer_rows);
				}
			});
			stack = null;

		}else if(_grid.entBox && !_grid.entBox.parentElement)
			setTimeout(_grid.destructor);

		else
			changes.forEach(function(change){
				if(change.type == "unload"){
					if(_cell && _cell.close)
						_cell.close();
					else
						_grid.destructor();
				}else
					_grid.forEachRow(function(id){
						if (id == change.name)
							_grid.cells(id,1).setValue(_obj[change.name]);
					});
			});
	}

	function observer_rows(changes){
		var synced;
		changes.forEach(function(change){
			if (!synced && _grid.clearAll && _tsname == change.tabular){
				synced = true;
				_grid.clearAll();
				_grid.parse(_mgr.get_property_grid_xml(_oxml, _obj, {
					title: attr.ts_title,
					ts: _tsname,
					selection: _selection,
					metadata: _meta
				}), function(){

				}, "xml");
			}
		});
	}


	new dhtmlXPropertyGrid(_grid);

	_grid.setInitWidthsP("40,60");
	_grid.setDateFormat("%d.%m.%Y %H:%i");
	_grid.init();
	_grid.setSizes();
	_grid.attachEvent("onPropertyChanged", function(pname, new_value, old_value){
    if(pname || _grid && _grid.getSelectedRowId()){
      return _pwnd.on_select(new_value); 
    }
	});
	_grid.attachEvent("onCheckbox", function(rId, cInd, state){
		if(_obj[rId] != undefined)
			return _pwnd.on_select(state, {obj: _obj, field: rId});

		if(rId.split("|").length > 1)
			return _pwnd.on_select(state, _grid.get_cell_field(rId));
	});
	_grid.attachEvent("onKeyPress", function(code,cFlag,sFlag){

		switch(code) {
			case 13:    
			case 9:     
				if (_grid.editStop)
					_grid.editStop();
				break;

			case 46:    
				break;
		};

	});
	if(attr.read_only){
		_grid.setEditable(false);
	}

	_grid.__define({

		selection: {
			get: function () {
				return _selection;
			},
			set: function (sel) {
				_selection = sel;
				this.reload();
			}
		},

		reload: {
			value: function () {
				observer_rows([{tabular: _tsname}]);
			}
		},

		get_cell_field: {
			value: function (rId) {

				if(!_obj)
					return;

				var res = {row_id: rId || _grid.getSelectedRowId()},
					fpath = res.row_id.split("|");

				if(fpath.length < 2){
					return {obj: _obj, field: fpath[0]}._mixin(_pwnd);

				}else {
					var vr;
					if(_selection){
						_obj[fpath[0]].find_rows(_selection, function (row) {
							if(row.property == fpath[1] || row.param == fpath[1] || row.Свойство == fpath[1] || row.Параметр == fpath[1]){
								vr = row;
								return false;
							}
						});

					}else{
						vr = _obj[fpath[0]].find(fpath[1]);
					}

					if(vr){
						res.obj = vr;
						if(vr["Значение"]){
							res.field = "Значение";
							res.property = vr.Свойство || vr.Параметр;
						} else{
							res.field = "value";
							res.property = vr.property || vr.param;
						}
						return res._mixin(_pwnd);
					}
				}
			},
			enumerable: false
		},

		_obj: {
			get: function () {
				return _obj;
			}
		},

		_owner_cell: {
			get: function () {
				return _cell;
			}
		},

		destructor: {
			value: function () {

				if(_obj)
					Object.unobserve(_obj, observer);
				if(_extra_fields && _extra_fields instanceof TabularSection)
					Object.unobserve(_extra_fields, observer_rows);

				_obj = null;
				_extra_fields = null;
				_meta = null;
				_mgr = null;
				_pwnd = null;

				_destructor.call(_grid);
			}
		},

		attach: {
			value: function (attr) {

				if (_obj)
					Object.unobserve(_obj, observer);

				if(_extra_fields && _extra_fields instanceof TabularSection)
					Object.unobserve(_obj, observer_rows);

				if(attr.oxml)
					_oxml = attr.oxml;

				if(attr.selection)
					_selection = attr.selection;

				_obj = attr.obj;
				_meta = attr.metadata || _obj._metadata.fields;
				_mgr = _obj._manager;
				_tsname = attr.ts || "";
				_extra_fields = _tsname ? _obj[_tsname] : (_obj.extra_fields || _obj["ДополнительныеРеквизиты"]);
				if(_extra_fields && !_tsname)
					_tsname = _obj.extra_fields ? "extra_fields" :  "ДополнительныеРеквизиты";
				_pwnd = {
					on_select: function (selv, cell_field) {
						if(!cell_field)
							cell_field = _grid.get_cell_field();
						if(cell_field){

							var ret_code = _mgr.handle_event(_obj, "value_change", {
								field: cell_field.field,
								value: selv,
								tabular_section: cell_field.row_id ? _tsname : "",
								grid: _grid,
								cell: _grid.cells(cell_field.row_id || cell_field.field, 1),
								wnd: _pwnd.pwnd
							});
							if(typeof ret_code !== "boolean"){
								cell_field.obj[cell_field.field] = selv;
								ret_code = true;
							}
							return ret_code;
						}
					},
					pwnd: attr.pwnd || _cell
				};


				Object.observe(_obj, observer, ["update", "unload"]);

				if(_extra_fields && _extra_fields instanceof TabularSection)
					Object.observe(_obj, observer_rows, ["row", "rows"]);

				if(_tsname && !attr.ts_title)
					attr.ts_title = _obj._metadata.tabular_sections[_tsname].synonym;
				observer_rows([{tabular: _tsname}]);

			}
		}

	});




	if(attr)
		_grid.attach(attr);

	return _grid;
};

dhtmlXGridObject.prototype.get_cell_value = function () {
	var cell_field = this.get_cell_field();
	if(cell_field && cell_field.obj)
		return cell_field.obj[cell_field.field];
};




dhtmlXCellObject.prototype.attachTabular = function(attr) {

	var _obj = attr.obj,
		_tsname = attr.ts,
		_ts = _obj[_tsname],
		_mgr = _obj._manager,
		_meta = attr.metadata || _mgr.metadata().tabular_sections[_tsname].fields,
		_cell = this,
		_source = attr.ts_captions || {},
    _input_filter = "",
    _input_filter_changed = 0,
		_selection = attr.selection || {};

	if(!attr.ts_captions && !_md.ts_captions(_mgr.class_name, _tsname, _source)){
    return;
  }

  _selection.filter_selection = filter_selection;

	var _grid = this.attachGrid(),
		_toolbar = this.attachToolbar(),
		_destructor = _grid.destructor,
		_pwnd = {
			on_select: function (selv) {
				tabular_on_edit(2, null, null, selv);
			},
			pwnd: attr.pwnd || _cell,
			is_tabular: true
		};
	_grid.setDateFormat("%d.%m.%Y %H:%i");
	_grid.enableAccessKeyMap();

	_grid._add_row = function(){
		if(!attr.read_only && !attr.disable_add_del){

			var proto;
			if(_selection){
				for(var sel in _selection){
					if(!_meta[sel] || (typeof _selection[sel] == 'function') || (typeof _selection[sel] == 'object' && !$p.is_data_obj(_selection[sel]))){
						continue;
					}
					if(!proto){
						proto = {};
					}
					proto[sel] = _selection[sel];
				}
			}

      _ts._owner._silent(false);
			var row = _ts.add(proto);

			if(_mgr.handle_event(_obj, "add_row",
					{
						tabular_section: _tsname,
						grid: _grid,
						row: row,
						wnd: _pwnd.pwnd
					}) === false)
				return;

			setTimeout(function () {
				_grid.selectRowById(row.row);
			}, 100);
		}
	};

  _grid._move_row = function(direction){
    if(attr.read_only){
      return;
    }
    var rId = get_sel_index();

    if(rId != undefined){
      _ts._owner._silent(false);
      if(direction == "up"){
        if(rId != 0){
          _ts.swap(rId-1, rId);
          setTimeout(function () {
            _grid.selectRow(rId-1, true);
          }, 100)
        }
      }
      else{
        if(rId < _ts.count() - 1){
          _ts.swap(rId, rId+1);
          setTimeout(function () {
            _grid.selectRow(rId+1, true);
          }, 100)
        }
      }
    }
  }

	_grid._del_row = function(keydown){

		if(!attr.read_only && !attr.disable_add_del){
			var rId = get_sel_index();

			if(rId != undefined){
        _ts._owner._silent(false);
				if(_mgr.handle_event(_obj, "del_row",
						{
							tabular_section: _tsname,
							grid: _grid,
							row: rId,
							wnd: _pwnd.pwnd
						}) === false)
					return;

				_ts.del(rId);

				setTimeout(function () {
					_grid.selectRowById(rId < _ts.count() ? rId + 1 : rId, true);
				}, 100);
			}
		}
	};


	function get_sel_index(silent){
		var selId = _grid.getSelectedRowId();

		if(selId && !isNaN(Number(selId)))
			return Number(selId)-1;

		if(!silent)
			$p.msg.show_msg({
				type: "alert-warning",
				text: $p.msg.no_selected_row.replace("%1", _obj._metadata.tabular_sections[_tsname].synonym || _tsname),
				title: (_obj._metadata.obj_presentation || _obj._metadata.synonym) + ': ' + _obj.presentation
			});
	}


	function tabular_on_edit(stage, rId, cInd, nValue, oValue){

		if(stage != 2 || nValue == oValue)
			return true;

		var cell_field = _grid.get_cell_field();
		if(!cell_field){
      return true;
    }
		var	ret_code = _mgr.handle_event(_obj, "value_change", {
				field: cell_field.field,
				value: nValue,
				tabular_section: _tsname,
				grid: _grid,
				row: cell_field.obj,
				cell: (rId && cInd) ? _grid.cells(rId, cInd) : (_grid.getSelectedCellIndex() >=0 ? _grid.cells() : null),
				wnd: _pwnd.pwnd
			});

		if(typeof ret_code !== "boolean"){
			cell_field.obj[cell_field.field] = nValue;
			ret_code = true;
		}
		return ret_code;
	}

	function observer_rows(changes){
		if(_grid.clearAll){
			changes.some(function(change){
				if (change.type == "rows" && change.tabular == _tsname){
					_ts.sync_grid(_grid, _selection);
					return true;
				}
			});
		}
	}

	function observer(changes){
		if(changes.length > 20){
			try{_ts.sync_grid(_grid, _selection);} catch(err){}
		} else
			changes.forEach(function(change){
				if (_tsname == change.tabular){
					if(!change.row || _grid.getSelectedRowId() != change.row.row)
						_ts.sync_grid(_grid, _selection);
					else{
						if(_grid.getColIndexById(change.name) != undefined){
              if(typeof change.oldValue != "boolean" || typeof change.row[change.name] != "boolean"){
                _grid.cells(change.row.row, _grid.getColIndexById(change.name))
                  .setCValue($p.utils.is_data_obj(change.row[change.name]) ? change.row[change.name].presentation : change.row[change.name]);
              }
            }
					}
				}
			});
	}

	function onpaste(e) {

		if(e.clipboardData.types.indexOf('text/plain') != -1){
			try{
				$p.eve.callEvent("tabular_paste", [{
					obj: _obj,
					grid: _grid,
					tsname: _tsname,
					e: e,
					data: e.clipboardData.getData('text/plain')
				}]);

			}catch(e){
				return;
			}
		}
	}

  function filter_selection(row) {

	  if(!_input_filter){
	    return true;
    }

    var res;
    _source.fields.some(function (fld) {
      var v = row._row[fld];
      if($p.utils.is_data_obj(v)){
        if(!v.is_new() && v.presentation.match(_input_filter)){
          return res = true;
        }
      }
      else if(typeof v == 'number'){
        return res = v.toLocaleString().match(_input_filter);
      }
      else if(v instanceof Date){
        return res = $p.moment(v).format($p.moment._masks.date_time).match(_input_filter);
      }
      else if(v.match){
        return res = v.match(_input_filter);
      }
    })
    return res;
  }

	function filter_change() {

    if(_input_filter_changed){
      clearTimeout(_input_filter_changed);
      _input_filter_changed = 0;
    }

    if(_input_filter != _cell.input_filter.value){
      _input_filter = new RegExp(_cell.input_filter.value, 'i');
      observer_rows([{tabular: _tsname, type: "rows"}]);
    }

  }

  function filter_click() {
    var val = _cell.input_filter.value;
    setTimeout(function () {
      if(val != _cell.input_filter.value)
        filter_change();
    })
  }

  function filter_keydown() {

    if(_input_filter_changed){
      clearTimeout(_input_filter_changed);
    }

    _input_filter_changed = setTimeout(function () {
      if(_input_filter_changed)
        filter_change();
    }, 500);

  }

	_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
	_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_add_del.xml"], function(){

    this.forEachItem(function(id) {
      if(id == "input_filter"){
        _cell.input_filter = _toolbar.getInput(id);
        _cell.input_filter.onchange = filter_change;
        _cell.input_filter.onclick = filter_click;
        _cell.input_filter.onkeydown = filter_keydown;
        _cell.input_filter.type = "search";
        _cell.input_filter.setAttribute("placeholder", "Фильтр");
      }
    })

		this.attachEvent("onclick", function(btn_id){

			switch(btn_id) {

				case "btn_add":
					_grid._add_row();
					break;

				case "btn_delete":
					_grid._del_row();
					break;

        case "btn_up":
          _grid._move_row("up");
          break;

        case "btn_down":
          _grid._move_row("down");
          break;
			}

		});
	});


	_grid.setIconsPath(dhtmlx.image_path);
	_grid.setImagePath(dhtmlx.image_path);
	_grid.setHeader(_source.headers);
	if(_source.min_widths)
		_grid.setInitWidths(_source.widths);
	if(_source.min_widths)
		_grid.setColumnMinWidth(_source.min_widths);
	if(_source.aligns)
		_grid.setColAlign(_source.aligns);
	_grid.setColSorting(_source.sortings);
	_grid.setColTypes(_source.types);
	_grid.setColumnIds(_source.fields.join(","));
	_grid.enableAutoWidth(true, 1200, 600);
	_grid.enableEditTabOnly(true);
	_grid.init();

	if(attr.read_only || attr.disable_add_del){
	  if(attr.read_only){
      _grid.setEditable(false);
    }
		_toolbar.forEachItem(function (name) {
			if(["btn_add", "btn_delete"].indexOf(name) != -1)
				_toolbar.disableItem(name);
		});
	}

	if(attr.reorder){
    var pos = _toolbar.getPosition("btn_delete");
    if(pos){
      _toolbar.addSeparator("sep_up", pos+1);
      _toolbar.addButton("btn_up", pos+2, '<i class="fa fa-arrow-up fa-fw"></i>');
      _toolbar.addButton("btn_down", pos+3, '<i class="fa fa-arrow-down fa-fw"></i>');
      _toolbar.setItemToolTip("btn_up", "Переместить строку вверх");
      _toolbar.setItemToolTip("btn_down", "Переместить строку вниз");
    }
  }

	_grid.__define({

    _obj: {
      get: function () {
        return _obj;
      }
    },

		selection: {
			get: function () {
				return _selection;
			},
			set: function (sel) {
				_selection = sel;
				observer_rows([{tabular: _tsname, type: "rows"}]);
			}
		},

		destructor: {
			value: function () {

				if(_obj){
					Object.unobserve(_obj, observer);
					Object.unobserve(_obj, observer_rows);
				}

				_obj = null;
				_ts = null;
				_meta = null;
				_mgr = null;
				_pwnd = null;
				_cell.detachToolbar();

				_grid.entBox.removeEventListener("paste", onpaste);

				_destructor.call(_grid);
			}
		},

		get_cell_field: {
			value: function () {

				if(_ts){

					var rindex = get_sel_index(true),
						cindex = _grid.getSelectedCellIndex(),
						row, col;

					if(rindex != undefined){
						row = _ts.get(rindex);

					}else if(_grid._last){
						row = _ts.get(_grid._last.row);
					}

					if(cindex >=0){
						col = _grid.getColumnId(cindex);
					}else if(_grid._last){
						col = _grid.getColumnId(_grid._last.cindex);
					}

					if(row && col){
						return {obj: row, field: col, metadata: _meta[col]}._mixin(_pwnd);
					}

				}
			}
		},

		refresh_row: {
			value: function (row) {
				_grid.selectRowById(row.row);
				_grid.forEachCell(row.row, function(cellObj,ind){
					var val = row[_grid.getColumnId(ind)];
					cellObj.setCValue($p.utils.is_data_obj(val) ? val.presentation : val);
				});
			}
		}
	});

	_grid.attachEvent("onEditCell", tabular_on_edit);

  _grid.attachEvent("onCheck", function(rId,cInd,state){
    _grid.selectCell(rId-1, cInd);
    tabular_on_edit(2, rId, cInd, state);
  });

	_grid.attachEvent("onRowSelect", function(rid,ind){
		if(_ts){
			_grid._last = {
				row: rid-1,
				cindex: ind
			}
		}
	});

  _grid.attachEvent("onHeaderClick", function(ind,obj){

    var field = _source.fields[ind];
    if(_grid.disable_sorting || field == 'row'){
      return;
    }
    if(!_grid.sort_fields){
      _grid.sort_fields = [];
      _grid.sort_directions = [];
    }

    var index = _grid.sort_fields.indexOf(field);

    function add_field() {
      if(index == -1){
        _grid.sort_fields.push(field);
        _grid.sort_directions.push("asc");
      }
      else{
        if(_grid.sort_directions[index] == "asc"){
          _grid.sort_directions[index] = "desc";
        }
        else{
          _grid.sort_directions[index] = "asc";
        }
      }
    }

    if(window.event && window.event.shiftKey){
      add_field();
    }
    else{
      if(index == -1){
        _grid.sort_fields.length = 0;
        _grid.sort_directions.length = 0;
      }
      add_field();
    }

    _ts.sort(_grid.sort_fields.map(function (field, index) {
      return field + " " + _grid.sort_directions[index];
    }));

    _ts.sync_grid(_grid);

    for(var col = 0; col < _source.fields.length; col++){
      var field = _source.fields[col];
      var index = _grid.sort_fields.indexOf(field);
      if(index == -1){
        _grid.setSortImgState(false, col);
      }
      else{
        _grid.setSortImgState(true, col, _grid.sort_directions[index]);
        setTimeout(function () {
          if(_grid && _grid.sortImg){
            _grid.sortImg.style.display="inline";
          }
        }, 200);
        break;
      }
    }
  });

	observer_rows([{tabular: _tsname, type: "rows"}]);

	Object.observe(_obj, observer, ["row"]);
	Object.observe(_obj, observer_rows, ["rows"]);

	_grid.entBox.addEventListener('paste', onpaste);

	return _grid;
};



$p.iface.Toolbar_filter = function Toolbar_filter(attr) {

	var t = this,
		input_filter_changed = 0,
		input_filter_width = $p.job_prm.device_type == "desktop" ? 200 : 120,
		custom_selection = {};

	if(!attr.pos)
		attr.pos = 6;

	t.__define({

		custom_selection: {
			get: function () {
				return custom_selection;
			}
		},

		toolbar: {
			get: function () {
				return attr.toolbar;
			}
		},

		call_event: {
			value: function () {

				if(input_filter_changed){
					clearTimeout(input_filter_changed);
					input_filter_changed = 0;
				}

				attr.onchange.call(t, t.get_filter());
			}
		}

	});

	function onkeydown(){

		if(input_filter_changed)
			clearTimeout(input_filter_changed);

		input_filter_changed = setTimeout(function () {
      input_filter_changed && t._prev_input_filter != t.input_filter.value && t.call_event();
		}, 500);
	}

	t.toolbar.addText("div_filter", attr.pos, "");
	t.div = t.toolbar.objPull[t.toolbar.idPrefix + "div_filter"];
	attr.pos++;

	if(attr.manager instanceof DocManager || attr.manager instanceof BusinessProcessManager || attr.manager instanceof TaskManager || attr.period){


		function set_sens(inp, k) {
			if (k == "min")
				t.сalendar.setSensitiveRange(inp.value, null);
			else
				t.сalendar.setSensitiveRange(null, inp.value);
		}

		input_filter_width = $p.job_prm.device_type == "desktop" ? 160 : 120;

		t.toolbar.addInput("input_date_from", attr.pos, "", $p.job_prm.device_type == "desktop" ? 78 : 72);
		attr.pos++;
		t.toolbar.addText("lbl_date_till", attr.pos, "-");
		attr.pos++;
		t.toolbar.addInput("input_date_till", attr.pos, "", $p.job_prm.device_type == "desktop" ? 78 : 72);
		attr.pos++;

		t.input_date_from = t.toolbar.getInput("input_date_from");
		t.input_date_from.onclick = function(){ set_sens(t.input_date_till,"max"); };

		t.input_date_till = t.toolbar.getInput("input_date_till");
		t.input_date_till.onclick = function(){ set_sens(t.input_date_from,"min"); };

		t.сalendar = new dhtmlXCalendarObject([t.input_date_from, t.input_date_till]);
		t.сalendar.attachEvent("onclick", t.call_event);

		if(!attr.date_from)
			attr.date_from = new Date((new Date()).getFullYear().toFixed() + "-01-01");
		if(!attr.date_till)
			attr.date_till = $p.utils.date_add_day(new Date(), 1);
		t.input_date_from.value=$p.moment(attr.date_from).format("L");
		t.input_date_till.value=$p.moment(attr.date_till).format("L");

		if(attr.manager.cachable == "doc" && !attr.custom_selection){

			custom_selection._view = {
				get value(){
					return 'doc/by_date';
				}
			};
			custom_selection._key = {
				get value(){
					var filter = t.get_filter(true);
					return {
						startkey: [attr.manager.class_name, filter.date_from.getFullYear(), filter.date_from.getMonth()+1, filter.date_from.getDate()],
						endkey: [attr.manager.class_name, filter.date_till.getFullYear(), filter.date_till.getMonth()+1, filter.date_till.getDate()],
						_drop_date: true,
						_order_by: true,
						_search: filter.filter.toLowerCase()
					};
				}
			};
		}
	}

	if(!attr.hide_filter){

		t.toolbar.addSeparator("filter_sep", attr.pos);
		attr.pos++;

		t.toolbar.addInput("input_filter", attr.pos, "", input_filter_width);
		t.input_filter = t.toolbar.getInput("input_filter");
		t.input_filter.onchange = function () {
		  t._prev_input_filter != t.input_filter.value && t.call_event();
    };
		t.input_filter.onclick = function () {
			var val = t.input_filter.value;
			setTimeout(function () {
				if(val != t.input_filter.value)
					t.call_event();
			})
		};
		t.input_filter.onkeydown = onkeydown;
		t.input_filter.type = "search";
		t.input_filter.setAttribute("placeholder", "Фильтр");

		t.toolbar.addSpacer("input_filter");

	}else if(t.input_date_till)
		t.toolbar.addSpacer("input_date_till");

	else
		t.toolbar.addSpacer("div_filter");


};
$p.iface.Toolbar_filter.prototype.__define({

	get_filter: {
		value: function (exclude_custom) {

		  if(this.input_filter){
        this._prev_input_filter = this.input_filter.value;
      }

			var res = {
				date_from: this.input_date_from ? $p.utils.date_add_day(dhx4.str2date(this.input_date_from.value), 0, true) : "",
				date_till: this.input_date_till ? $p.utils.date_add_day(dhx4.str2date(this.input_date_till.value), 0, true) : "",
				filter: this.input_filter ? this.input_filter.value : ""
			}, fld, flt;

			if(!exclude_custom){
				for(fld in this.custom_selection){
					if(!res.selection)
						res.selection = [];
					flt = {};
					flt[fld] = this.custom_selection[fld].value;
					res.selection.push(flt);
				}
			}

			return res;
		}
	},

	add_filter: {
		value: function (elm) {

			var pos = this.toolbar.getPosition("input_filter") - 2,
				id = dhx4.newId(),
				width = (this.toolbar.getWidth("input_filter") / 2).round(0);

			this.toolbar.setWidth("input_filter", width);
			this.toolbar.addText("lbl_"+id, pos, elm.text || "");
			pos++;
			this.toolbar.addInput("input_"+id, pos, "", width);

			this.custom_selection[elm.name] = this.toolbar.getInput("input_"+id);
		}
	}
});



$p.iface.dat_blank = function(_dxw, attr) {


	if(!attr)
		attr = {};

	var wnd_dat = (_dxw || $p.iface.w).createWindow({
		id: dhx4.newId(),
		left: attr.left || 700,
		top: attr.top || 20,
		width: attr.width || 220,
		height: attr.height || 300,
		move: true,
		park: !attr.allow_close,
		center: !!attr.center,
		resize: true,
		caption: attr.caption || "Tools"
	});

	var _dxw_area = {
		x: (_dxw || $p.iface.w).vp.clientWidth,
		y: (_dxw || $p.iface.w).vp.clientHeight
	}, _move;

	if(wnd_dat.getPosition()[0] + wnd_dat.getDimension()[0] > _dxw_area.x){
		_dxw_area.x = _dxw_area.x - wnd_dat.getDimension()[0];
		_move = true;
	}else
		_dxw_area.x = wnd_dat.getPosition()[0];

	if(wnd_dat.getPosition()[1] + wnd_dat.getDimension()[1] > _dxw_area.y){
		_dxw_area.y = _dxw_area.y - wnd_dat.getDimension()[1];
		_move = true;
	}else
		_dxw_area.y = wnd_dat.getPosition()[1];

	if(_move){
		if(_dxw_area.x<0 || _dxw_area.y<0)
			wnd_dat.maximize();
		else
			wnd_dat.setPosition(_dxw_area.x, _dxw_area.y);
	}

	_dxw = null;

	if(attr.hasOwnProperty('allow_minmax') && !attr.allow_minmax)
		wnd_dat.button('minmax').hide();

	if(attr.allow_close)
		wnd_dat.button('park').hide();
	else
		wnd_dat.button('close').hide();

	wnd_dat.attachEvent("onClose", function () {

		var allow_close = typeof attr.on_close == "function" ? attr.on_close(wnd_dat) : true;

		if(allow_close){

			if(attr.pwnd_modal && attr.pwnd && attr.pwnd.setModal)
				attr.pwnd.setModal(1);

			return allow_close;
		}

	});

	wnd_dat.setIconCss('without_icon');
	wnd_dat.cell.parentNode.children[1].classList.add('dat_gui');

	$p.iface.bind_help(wnd_dat, attr.help_path);

	wnd_dat.elmnts = {grids: {}};

	wnd_dat.wnd_options = function (options) {
		var pos = wnd_dat.getPosition(),
			sizes = wnd_dat.getDimension(),
			parked = wnd_dat.isParked();
		options.left = pos[0];
		options.top = pos[1];
		options.width = sizes[0];
		options.parked = parked;
		if(!parked)
			options.height = sizes[1];

	};

	wnd_dat.bottom_toolbar = function(oattr){

		var attr = ({
				wrapper: wnd_dat.cell,
				width: '100%',
				height: '28px',
				bottom: '0px',
				left: '0px',
				name: 'tb_bottom',
				buttons: [
					{name: 'btn_cancel', text: 'Отмена', title: 'Закрыть без сохранения', width:'60px', float: 'right'},
					{name: 'btn_ok', b: 'Ок', title: 'Применить изменения', width:'30px', float: 'right'}
				],
				onclick: function (name) {
					return false;
				}
			})._mixin(oattr),

			tb_bottom = new OTooolBar(attr),
			sbar = wnd_dat.attachStatusBar({height: 12});
		sbar.style.zIndex = -1000;
		sbar.firstChild.style.backgroundColor = "transparent";
		sbar.firstChild.style.border = "none";
		return tb_bottom;
	};

	if(attr.modal){
		if(attr.pwnd && attr.pwnd.setModal){
			attr.pwnd_modal = attr.pwnd.isModal();
			attr.pwnd.setModal(0);
		}
		wnd_dat.setModal(1);
	}

	return wnd_dat;
};



$p.iface.pgrid_on_select = function(selv){

	if(selv===undefined)
		return;

	var pgrid = this.grid instanceof dhtmlXGridObject ? this.grid : this,
		source = pgrid.getUserData("", "source"),
		f = pgrid.getSelectedRowId();

	if(source.o[f] != undefined){
		if(typeof source.o[f] == "number")
			source.o[f] = $p.utils.fix_number(selv, true);
		else
			source.o[f] = selv;

	}else if(f.indexOf("fprms") > -1){
		var row = $p._find(source.o.fprms, f.split("|")[1]);
		row.value = selv;
	}

	pgrid.cells().setValue($p.utils.is_data_obj(selv) ? selv.presentation : selv || "");


	if(source.grid_on_change)
		source.grid_on_change.call(pgrid, f, selv);
};

$p.iface.pgrid_on_change = function(pname, new_value, old_value){
	if(pname)
		$p.iface.pgrid_on_select.call(this, new_value);
};

$p.iface.pgrid_on_checkbox = function(rId, cInd, state){

	var pgrid = this.grid instanceof dhtmlXGridObject ? this.grid : this,
		source = pgrid.getUserData("", "source");

	if(source.o[rId] != undefined)
		source.o[rId] = state;

	if(source.grid_on_change)
		source.grid_on_change(rId, state);
};


function _clear_all(){
	$p.iface.docs.__define({
		clear_all: {
			value: function () {
				this.detachToolbar();
				this.detachStatusBar();
				this.detachObject(true);
			},
			enumerable: false
		},
		"Очистить": {
			get: function () {
				return this.clear_all;
			},
			enumerable: false
		},
		"Контейнер": {
			get: function () {
				return this.cell.querySelector(".dhx_cell_cont_layout");
			},
			enumerable: false
		}
	});
}

$p.iface.frm_auth = function (attr, resolve, reject) {

	if(!attr)
		attr = {};

	var _cell, _frm, w, were_errors;

	if(attr.modal_dialog){
		if(!attr.options)
			attr.options = {
				name: "frm_auth",
				caption: "Вход на сервер",
				width: 360,
				height: 300,
				center: true,
				allow_close: true,
				allow_minmax: true,
				modal: true
			};
		_cell = this.auth = this.dat_blank(attr._dxw, attr.options);
		_cell.attachEvent("onClose", function(win){
			if(were_errors){
				reject && reject(err);
			}else if(resolve)
				resolve();
			return true;
		});
    _frm = _cell.attachForm();

	}else{
		_cell = attr.cell || this.docs;
		_frm = this.auth = _cell.attachForm();
		$p.msg.show_msg($p.msg.init_login, _cell);
	}


	function do_auth(login, password){

		$p.ajax.username = login;
		$p.ajax.password = $p.aes.Ctr.encrypt(password);

		if(login){

			if($p.wsql.get_user_param("user_name") != login)
				$p.wsql.set_user_param("user_name", login);					

      var observer = $p.eve.attachEvent("user_log_in", function () {
        $p.eve.detachEvent(observer);
        _cell && _cell.close && _cell.close();
      });

			$p.wsql.pouch.log_in(login, password)
				.then(function () {

					if($p.wsql.get_user_param("enable_save_pwd")){
						if($p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd")) != password)
							$p.wsql.set_user_param("user_pwd", $p.aes.Ctr.encrypt(password));   

					}else if($p.wsql.get_user_param("user_pwd") != "")
						$p.wsql.set_user_param("user_pwd", "");

					$p.eve.logged_in = true;
					if(attr.modal_dialog)
            _cell && _cell.close && _cell.close();
					else if(resolve)
						resolve();

				})
				.catch(function (err) {
					were_errors = true;
          _frm && _frm.onerror &&_frm.onerror(err);
				})
				.then(function () {
					if($p.iface.sync)
						$p.iface.sync.close();
					if(_cell && _cell.progressOff){
						_cell.progressOff();
						if(!were_errors && attr.hide_header)
							_cell.hideHeader();
					}
					if($p.iface.cell_tree && !were_errors)
						$p.iface.cell_tree.expand();
				});

		} else
			this.validate();
	}

	function auth_click(name){

		were_errors = false;
		this.resetValidateCss();

		if(this.getCheckedValue("type") == "guest"){

			var login = this.getItemValue("guest"),
				password = "";
			if($p.job_prm.guests && $p.job_prm.guests.length){
				$p.job_prm.guests.some(function (g) {
					if(g.username == login){
						password = $p.aes.Ctr.decrypt(g.password);
						return true;
					}
				});
			}
			do_auth.call(this, login, password);

		}else if(this.getCheckedValue("type") == "auth"){
			do_auth.call(this, this.getItemValue("login"), this.getItemValue("password"));

		}
	}

	_frm.loadStruct($p.injected_data["form_auth.xml"], function(){

		var selected;

		if($p.job_prm.guests && $p.job_prm.guests.length){

			var guests = $p.job_prm.guests.map(function (g) {
					var v = {
						text: g.username,
						value: g.username
					};
					if($p.wsql.get_user_param("user_name") == g.username){
						v.selected = true;
						selected = g.username;
					}
					return v;
				});

			if(!selected){
				guests[0].selected = true;
				selected = guests[0].value;
			}

			_frm.reloadOptions("guest", guests);
		}

		if($p.wsql.get_user_param("user_name") && $p.wsql.get_user_param("user_name") != selected){
			_frm.setItemValue("login", $p.wsql.get_user_param("user_name"));
			_frm.setItemValue("type", "auth");

			if($p.wsql.get_user_param("enable_save_pwd") && $p.wsql.get_user_param("user_pwd")){
				_frm.setItemValue("password", $p.aes.Ctr.decrypt($p.wsql.get_user_param("user_pwd")));
			}
		}

		if(!attr.modal_dialog){
			if((w = ((_cell.getWidth ? _cell.getWidth() : _cell.cell.offsetWidth) - 500)/2) >= 10)
				_frm.cont.style.paddingLeft = w.toFixed() + "px";
			else
				_frm.cont.style.paddingLeft = "20px";
		}

		setTimeout(function () {

			dhx4.callEvent("on_draw_auth", [_frm]);

			if(($p.wsql.get_user_param("autologin") || attr.try_auto) && (selected || ($p.wsql.get_user_param("user_name") && $p.wsql.get_user_param("user_pwd"))))
				auth_click.call(_frm);

		});
	});

	_frm.attachEvent("onButtonClick", auth_click);

	_frm.attachEvent("onKeyDown",function(inp, ev, name, value){
		if(ev.keyCode == 13){
			if(name == "password" || this.getCheckedValue("type") == "guest"){
				auth_click.call(this);
			}
		}
	});


	_frm.onerror = function (err) {

		$p.ajax.authorized = false;

		var emsg = err.message.toLowerCase();

		if(emsg.indexOf("auth") != -1) {
			$p.msg.show_msg({
				title: $p.msg.main_title + $p.version,
				type: "alert-error",
				text: $p.msg.error_auth
			});
			_frm.setItemValue("password", "");
			_frm.validate();

		}else if(emsg.indexOf("gateway") != -1 || emsg.indexOf("net") != -1) {
			$p.msg.show_msg({
				title: $p.msg.main_title + $p.version,
				type: "alert-error",
				text: $p.msg.error_network
			});
		}
	}



};


$p.iface.open_settings = function (e) {
	var evt = (e || (typeof event != "undefined" ? event : undefined));
	if(evt)
		evt.preventDefault();

	var hprm = $p.job_prm.parse_url();
	$p.iface.set_hash(hprm.obj, hprm.ref, hprm.frm, "settings");

	return $p.iface.cancel_bubble(evt);
};

$p.iface.swith_view = function(name){

	var state,
		iface = $p.iface,

		swith_tree = function(name){

			function compare_text(a, b) {
				if (a.text > b.text) return 1;
				if (a.text < b.text) return -1;
			}

			if(!iface.tree){

				var hprm = $p.job_prm.parse_url();
				if(hprm.obj) {
					var parts = hprm.obj.split('.');
					if(parts.length > 1){

						var mgr = $p.md.mgr_by_class_name(hprm.obj);

						if(typeof iface.docs.close === "function" )
							iface.docs.close();

						if(mgr)
							mgr.form_list(iface.docs, {});
					}
				}
				return;

			}else if(iface.tree._view == name || ["rep", "cal"].indexOf(name) != -1)
				return;

			iface.tree.deleteChildItems(0);
			if(name == "oper"){
				var meta_tree = {id:0, item:[
					{id:"oper_cat", text: $p.msg.meta_cat, open: true, item:[]},
					{id:"oper_doc", text: $p.msg.meta_doc, item:[]},
					{id:"oper_cch", text: $p.msg.meta_cch, item:[]},
					{id:"oper_cacc", text: $p.msg.meta_cacc, item:[]},
					{id:"oper_tsk", text: $p.msg.meta_tsk, item:[]}
				]}, mdn, md,

					tlist = meta_tree.item[0].item;
				for(mdn in $p.cat){
					if(typeof $p.cat[mdn] == "function")
						continue;
					md = $p.cat[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cat." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				tlist = meta_tree.item[1].item;
				for(mdn in $p.doc){
					if(typeof $p.doc[mdn] == "function")
						continue;
					md = $p.doc[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.doc." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				tlist = meta_tree.item[2].item;
				for(mdn in $p.cch){
					if(typeof $p.cch[mdn] == "function")
						continue;
					md = $p.cch[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cch." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				tlist = meta_tree.item[3].item;
				for(mdn in $p.cacc){
					if(typeof $p.cacc[mdn] == "function")
						continue;
					md = $p.cacc[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.cacc." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				tlist = meta_tree.item[4].item;
				for(mdn in $p.tsk){
					if(typeof $p.tsk[mdn] == "function")
						continue;
					md = $p.tsk[mdn].metadata();
					if(md.hide)
						continue;
					tlist.push({id: "oper.tsk." + mdn, text: md.synonym || md.name, tooltip: md.illustration || md.list_presentation});
				}
				tlist.sort(compare_text);

				iface.tree.parse(meta_tree, function(){
					var hprm = $p.job_prm.parse_url();
					if(hprm.obj){
						iface.tree.selectItem(hprm.view+"."+hprm.obj, true);
					}
				}, "json");

			}else{
				iface.tree.loadXML(iface.tree.tree_filteres, function(){

				});

			}

			iface.tree._view = name;
		};

	if(name.indexOf(iface.docs.getViewName())==0)
		return iface.docs.getViewName();

	state = iface.docs.showView(name);
	if (state == true) {
		if(name=="cal" && !window.dhtmlXScheduler){
			$p.load_script("dist/dhtmlxscheduler.min.js", "script", function(){
				scheduler.config.first_hour = 8;
				scheduler.config.last_hour = 22;
				iface.docs.scheduler = iface.docs.attachScheduler(new Date("2015-11-20"), "week", "scheduler_here");
				iface.docs.scheduler.attachEvent("onBeforeViewChange", function(old_mode, old_date, mode, date){
					if(mode == "timeline"){
						$p.msg.show_not_implemented();
						return false;
					}
					return true;
				});
			});

			$p.load_script("dist/dhtmlxscheduler.css", "link");


		}
	}

	swith_tree(name);

	if(name == "def")
		iface.main.showStatusBar();
	else
		iface.main.hideStatusBar();
};


function OTooolBar(attr){
	var _this = this,
		div = document.createElement('div'),
		offset, popup_focused, sub_focused, btn_focused;

	if(!attr.image_path)
		attr.image_path = dhtmlx.image_path;

	if(attr.hasOwnProperty("class_name"))
		div.className = attr.class_name;
	else
		div.className = 'md_otooolbar';

	_this.cell = div;

	_this.buttons = {};

	function bselect(select){
		for(var i=0; i<div.children.length; i++){
			div.children[i].classList.remove('selected');
		}
		if(select && !this.classList.contains('selected'))
			this.classList.add('selected');
	}

	function popup_hide(){
		popup_focused = false;
		setTimeout(function () {
			if(!popup_focused)
				$p.iface.popup.hide();
		}, 300);
	}

	function btn_click(){
		if(attr.onclick)
			attr.onclick.call(_this, this.name.replace(attr.name + '_', ''), attr.name);
	}

	this.add = function(battr){

		var bdiv = $p.iface.add_button(div, attr, battr);

		bdiv.onclick = btn_click;

		bdiv.onmouseover = function(){
			if(battr.title && !battr.sub){
				popup_focused = true;

				$p.iface.popup.clear();
				$p.iface.popup.attachHTML(battr.title);
				$p.iface.popup.show(dhx4.absLeft(bdiv), dhx4.absTop(bdiv), bdiv.offsetWidth, bdiv.offsetHeight);

				$p.iface.popup.p.onmouseover = function(){
					popup_focused = true;
				};

				$p.iface.popup.p.onmouseout = popup_hide;

				if(attr.on_popup)
					attr.on_popup($p.iface.popup, bdiv);
			}
		};

		bdiv.onmouseout = popup_hide;

		_this.buttons[battr.name] = bdiv;

		if(battr.sub){

			function remove_sub(parent){
				if(!parent)
					parent = bdiv;
				if(parent.subdiv && !sub_focused && !btn_focused){
					while(parent.subdiv.firstChild)
						parent.subdiv.removeChild(parent.subdiv.firstChild);
					parent.subdiv.parentNode.removeChild(parent.subdiv);
					parent.subdiv = null;
				}
			}

			bdiv.onmouseover = function(){

				for(var i=0; i<bdiv.parentNode.children.length; i++){
					if(bdiv.parentNode.children[i] != bdiv && bdiv.parentNode.children[i].subdiv){
						remove_sub(bdiv.parentNode.children[i]);
						break;
					}
				}

				btn_focused = true;

				if(!this.subdiv){
					this.subdiv = document.createElement('div');
					this.subdiv.className = 'md_otooolbar';
					offset = $p.iface.get_offset(bdiv);
					if(battr.sub.align == 'right')
						this.subdiv.style.left = (offset.left + bdiv.offsetWidth - (parseInt(battr.sub.width.replace(/\D+/g,"")) || 56)) + 'px';
					else
						this.subdiv.style.left = offset.left + 'px';
					this.subdiv.style.top = (offset.top + div.offsetHeight) + 'px';
					this.subdiv.style.height = battr.sub.height || '198px';
					this.subdiv.style.width = battr.sub.width || '56px';
					for(var i in battr.sub.buttons){
						var bsub = $p.iface.add_button(this.subdiv, attr, battr.sub.buttons[i]);
						bsub.onclick = btn_click;
					}
					attr.wrapper.appendChild(this.subdiv);

					this.subdiv.onmouseover = function () {
						sub_focused = true;
					};

					this.subdiv.onmouseout = function () {
						sub_focused = false;
						setTimeout(remove_sub, 500);
					};

					if(battr.title)
						$p.iface.popup.show(dhx4.absLeft(this.subdiv), dhx4.absTop(this.subdiv), this.subdiv.offsetWidth, this.subdiv.offsetHeight);
				}

			};

			bdiv.onmouseout = function(){
				btn_focused = false;
				setTimeout(remove_sub, 500);
			}
		}
	};

	this.select = function(name){
		for(var i=0; i<div.children.length; i++){
			var btn = div.children[i];
			if(btn.name == attr.name + '_' + name){
				bselect.call(btn, true);
				return;
			}
		}
	};

	this.get_selected = function () {
		for(var i=0; i<div.children.length; i++){
			var btn = div.children[i];
			if(btn.classList.contains('selected'))
				return btn.name;
		}
	};

	this.unload = function(){
		while(div.firstChild)
			div.removeChild(div.firstChild);
		attr.wrapper.removeChild(div);
	};


	attr.wrapper.appendChild(div);
	div.style.width = attr.width || '28px';
	div.style.height = attr.height || '150px';
	div.style.position = 'absolute';

	if(attr.top) div.style.top = attr.top;
	if(attr.left) div.style.left = attr.left;
	if(attr.bottom) div.style.bottom = attr.bottom;
	if(attr.right) div.style.right = attr.right;
	if(attr.paddingRight) div.style.paddingRight = attr.paddingRight;
	if(attr.paddingLeft) div.style.paddingLeft = attr.paddingLeft;

	if(attr.buttons)
		attr.buttons.forEach(function(battr){
			_this.add(battr);
		});

};
$p.iface.OTooolBar = OTooolBar;

$p.iface.add_button = function(parent, attr, battr) {
	var bdiv = document.createElement('div'), html = '';
	bdiv.name = (attr ? attr.name + '_' : '') + battr.name;
	parent.appendChild(bdiv);

	bdiv.className = (battr.name.indexOf("sep_") == 0) ? 'md_otooolbar_sep' : 'md_otooolbar_button';
	if(battr.hasOwnProperty("class_name"))
		bdiv.classList.add(battr.class_name);

	if(battr.img)
		html = '<img src="' + (attr ? attr.image_path : '') + battr.img + '">';
	if(battr.b)
		html +='<b style="vertical-align: super;"> ' + battr.b + '</b>';
	else if(battr.text)
		html +='<span style="vertical-align: super;"> ' + battr.text + '</span>';
	else if(battr.css)
		bdiv.classList.add(battr.css);
	bdiv.innerHTML = html;

	if(battr.float) bdiv.style.float = battr.float;
	if(battr.clear) bdiv.style.clear = battr.clear;
	if(battr.width) bdiv.style.width = battr.width;
	if(battr.paddingRight) bdiv.style.paddingRight = battr.paddingRight;
	if(battr.paddingLeft) bdiv.style.paddingLeft = battr.paddingLeft;

	if(battr.tooltip)
		bdiv.title = battr.tooltip;

	return bdiv;
};



DataManager.prototype.form_obj = function(pwnd, attr){

	var _mgr = this,
		_meta = _mgr.metadata(),
		o = attr.o,
		wnd, options, created, create_id, _title, close_confirmed;

	function frm_create(){

		if(created)
			return;

		if((pwnd instanceof dhtmlXLayoutCell || pwnd instanceof dhtmlXSideBarCell || pwnd instanceof dhtmlXCarouselCell)
			&& (attr.bind_pwnd || attr.Приклеить)) {
			if(typeof pwnd.close == "function")
				pwnd.close(true);
			wnd = pwnd;
			wnd.close = function (on_create) {
				var _wnd = wnd || pwnd;

				if(on_create || check_modified()){

					if(_wnd){

						if(_wnd.elmnts)
							["vault", "vault_pop"].forEach(function (elm) {
								if (_wnd.elmnts[elm] && _wnd.elmnts[elm].unload)
									_wnd.elmnts[elm].unload();
							});

						if(_mgr && _mgr.class_name)
							$p.eve.callEvent("frm_close", [_mgr.class_name, (o && o._obj ? o.ref : "")]);

						if(_wnd.conf){
							_wnd.detachToolbar();
							_wnd.detachStatusBar();
							_wnd.conf.unloading = true;
							_wnd.detachObject(true);
						}
					}
					frm_unload(on_create);

				}
			};
			wnd.elmnts = {grids: {}};

		}else{
			options = {
				name: 'wnd_obj_' + _mgr.class_name,
				wnd: {
					top: 80 + Math.random()*40,
					left: 120 + Math.random()*80,
					width: 700,
					height: 400,
					modal: true,
					center: false,
					pwnd: pwnd,
					allow_close: true,
					allow_minmax: true,
					on_close: frm_close,
					caption: (_meta.obj_presentation || _meta.synonym)
				}
			};
			wnd = $p.iface.dat_blank(null, options.wnd);
		}

		if(!wnd.ref)
			wnd.__define({

				ref: {
					get: function(){
						return o ? o.ref : $p.utils.blank.guid;
					},
					enumerable: false,
					configurable: true
				},

				set_text: {
					value: function(force) {
						if(attr && attr.set_text || wnd && wnd.setText){

							var title = o.presentation;

							if(!title)
								return;

							if(o instanceof CatObj)
								title = (_meta.obj_presentation || _meta.synonym) + ': ' + title;

							else if(o instanceof DocObj)
								title += o.posted ? " (проведен)" : " (не проведен)";

							if(o._modified && title.lastIndexOf("*")!=title.length-1)
								title += " *";

							else if(!o._modified && title.lastIndexOf("*")==title.length-1)
								title = title.replace(" *", "");

							if(force || _title !== title){
								_title = title;
								if(attr.set_text)
									attr.set_text(title);
								else
									wnd.setText(title);
							}
						}
					},
					enumerable: false,
					configurable: true
				}
			});

		wnd.elmnts.frm_tabs = wnd.attachTabbar({
			arrows_mode: "auto",
			offsets: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		});
		wnd.elmnts.frm_tabs.addTab('tab_header','&nbsp;Реквизиты&nbsp;', null, null, true);
		wnd.elmnts.tabs = {'tab_header': wnd.elmnts.frm_tabs.cells('tab_header')};

		wnd.elmnts.frm_toolbar = wnd.attachToolbar();
		wnd.elmnts.frm_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
		wnd.elmnts.frm_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_obj.xml"], function(){

			if(wnd === pwnd)
				this.cont.style.top = "4px";

			this.addSpacer("btn_unpost");
			this.attachEvent("onclick", attr.toolbar_click || toolbar_click);

			var _acl = $p.current_user.get_acl(_mgr.class_name);

			if(_mgr instanceof DocManager && _acl.indexOf("p") != -1){
				this.enableItem("btn_post");
				if(!attr.toolbar_struct)
					this.setItemText("btn_save_close", "<b>Провести и закрыть</b>");
			}else
				this.hideItem("btn_post");

			if(_mgr instanceof DocManager && _acl.indexOf("o") != -1)
				this.enableItem("btn_unpost");
			else
				this.hideItem("btn_unpost");


			if(_acl.indexOf("e") == -1){
				this.hideItem("btn_save_close");
				this.disableItem("btn_save");
			}

			if(attr.on_select)
				this.setItemText("btn_save_close", "Записать и выбрать");

			if(_mgr instanceof CatManager || _mgr instanceof DocManager){

				_mgr.printing_plates().then(function (pp) {
					for(var pid in pp)
						wnd.elmnts.frm_toolbar.addListOption("bs_print", pid, "~", "button", pp[pid].toString());
				});

				wnd.elmnts.vault_pop = new dhtmlXPopup({
					toolbar: this,
					id: "btn_files"
				});
				wnd.elmnts.vault_pop.attachEvent("onShow", show_vault);

			}else
				this.disableItem("bs_print");

			if(wnd != pwnd){
				this.hideItem("btn_close");
			}

		});

		created = true;
	}


	function observer(changes) {
		if(o && wnd && wnd.set_text){
      wnd.set_text();
    }
	}

	function frm_fill(){

		if(!created){
			clearTimeout(create_id);
			frm_create();
		}

		wnd.set_text();
		if(!attr.hide_header && wnd.showHeader){
      wnd.showHeader();
    }

		if(attr.draw_tabular_sections)
			attr.draw_tabular_sections(o, wnd, tabular_init);

		else if(!o.is_folder){
			if(_meta.form && _meta.form.obj && _meta.form.obj.tabular_sections_order)
				_meta.form.obj.tabular_sections_order.forEach(function (ts) {
					tabular_init(ts);
				});

			else
				for(var ts in _meta.tabular_sections){
					if(ts==="extra_fields")
						continue;

					if(o[ts] instanceof TabularSection){
						tabular_init(ts);
					}
				}
		}

		if(attr.draw_pg_header)
			attr.draw_pg_header(o, wnd);

		else{

			var _acl = $p.current_user.get_acl(_mgr.class_name);

			wnd.elmnts.pg_header = wnd.elmnts.tabs.tab_header.attachHeadFields({
				obj: o,
				pwnd: wnd,
				read_only: _acl.indexOf("e") == -1
			});
			wnd.attachEvent("onResizeFinish", function(win){
				wnd.elmnts.pg_header.enableAutoHeight(false, wnd.elmnts.tabs.tab_header._getHeight()-20, true);
			});
		}

		Object.observe(o, observer, ["update", "row"]);


		return {wnd: wnd, o: o};

	}

	function toolbar_click(btn_id){
		if(btn_id=="btn_save_close")
			save("close");

		else if(btn_id=="btn_save")
			save("save");

		else if(btn_id=="btn_post")
			save("post");

		else if(btn_id=="btn_unpost")
			save("unpost");

		else if(btn_id=="btn_close")
			wnd.close();

		else if(btn_id=="btn_go_connection")
			go_connection();

		else if(btn_id.substr(0,4)=="prn_")
			_mgr.print(o, btn_id, wnd);

		else if(btn_id=="btn_import")
			_mgr.import(null, o);

		else if(btn_id=="btn_export")
			_mgr.export({items: [o], pwnd: wnd, obj: true} );

	}

	function go_connection(){
		$p.msg.show_not_implemented();
	}

	function show_vault(){

		if (!wnd.elmnts.vault) {

			wnd.elmnts.vault = wnd.elmnts.vault_pop.attachVault(400, 250, {
				_obj:  o,
				buttonClear: false,
				autoStart: true,
				filesLimit: 10,
				mode: "pouch"
			});
			wnd.elmnts.vault.conf.wnd = wnd;
		}
	}


	function tabular_init(name, toolbar_struct){

		if(!_md.ts_captions(_mgr.class_name, name))
			return;

		wnd.elmnts.frm_tabs.addTab('tab_'+name, '&nbsp;'+_meta.tabular_sections[name].synonym+'&nbsp;');
		wnd.elmnts.tabs['tab_'+name] = wnd.elmnts.frm_tabs.cells('tab_'+name);

		var _acl = $p.current_user.get_acl(_mgr.class_name);

		wnd.elmnts.grids[name] = wnd.elmnts.tabs['tab_'+name].attachTabular({
			obj: o,
			ts: name,
			pwnd: wnd,
			read_only: _acl.indexOf("e") == -1,
			toolbar_struct: toolbar_struct
		});

		if(_acl.indexOf("e") == -1){
			var tabular = wnd.elmnts.tabs['tab_'+name].getAttachedToolbar();
			tabular.disableItem("btn_add");
			tabular.disableItem("btn_delete");
		}

	}

	function save(action){

		wnd.progressOn();

		var post;
		if(o instanceof DocObj){
			if(action == "post")
				post = true;

			else if(action == "unpost")
				post = false;

			else if(action == "close"){
				if($p.current_user.get_acl(_mgr.class_name).indexOf("p") != -1)
					post = true;
			}
		}

		o.save(post)
			.then(function(){

				wnd.progressOff();

				if(action == "close"){
					if(attr.on_select)
						attr.on_select(o);
					wnd.close();

				}else
					wnd.set_text();
			})
			.catch(function(err){
				wnd.progressOff();
				if(err instanceof Error)
					$p.record_log(err);
			});
	}

	function frm_unload(on_create){

		if(attr && attr.on_close && !on_create)
			attr.on_close();

		if(!on_create){
			delete wnd.ref;
			delete wnd.set_text;
			Object.unobserve(o, observer);
			_mgr = wnd = o = _meta = options = pwnd = attr = null;
		}
	}

	function check_modified() {
		if(o._modified && !close_confirmed){
			dhtmlx.confirm({
				title: o.presentation,
				text: $p.msg.modified_close,
				cancel: $p.msg.cancel,
				callback: function(btn) {
					if(btn){
						close_confirmed = true;
						if(o._manager.cachable == "ram")
							this.close();

						else{
							if(o.is_new()){
								o.unload();
								this.close();
							}else{
								setTimeout(o.load.bind(o), 100);
								this.close();
							}
						}
					}
				}.bind(wnd)
			});
			return false;
		}
		return true;
	}

	function frm_close(wnd){

		if(check_modified()){

			setTimeout(frm_unload);

			if(wnd && wnd.elmnts)
				["vault", "vault_pop"].forEach(function (elm) {
					if (wnd.elmnts[elm] && wnd.elmnts[elm].unload)
						wnd.elmnts[elm].unload();
				});

			if(_mgr && _mgr.class_name)
				$p.eve.callEvent("frm_close", [_mgr.class_name, (o && o._obj ? o.ref : "")]);

			return true;
		}
	}


	create_id = setTimeout(frm_create);

	if($p.utils.is_data_obj(o)){

		if(o.is_new() && attr.on_select)
			return _mgr.create({}, true)
				.then(function (tObj) {
					o = tObj;
					tObj = null;
					return frm_fill();
				});
		else if(o.is_new() && !o.empty()){
			return o.load()
				.then(frm_fill);
		}else
			return Promise.resolve(frm_fill());

	}else{

		if(pwnd && pwnd.progressOn)
			pwnd.progressOn();

		return _mgr.get(attr.hasOwnProperty("ref") ? attr.ref : attr, true, true)
			.then(function(tObj){
				o = tObj;
				tObj = null;
				if(pwnd && pwnd.progressOff)
					pwnd.progressOff();
				return frm_fill();
			})
			.catch(function (err) {
				if(pwnd && pwnd.progressOff)
					pwnd.progressOff();
				wnd.close();
				$p.record_log(err);
			});
	}

};

DataObj.prototype.form_obj = function (pwnd, attr) {
	if(!attr)
		attr = {};
	attr.o = this;
	return this._manager.form_obj(pwnd, attr);
};


DataProcessorsManager.prototype.form_rep = function(pwnd, attr) {

	var _mgr = this,
		_meta = _mgr.metadata(),
		wnd, options, _title, close_confirmed;

	if(!attr)
		attr = {};
	if(!attr.date_from)
		attr.date_from = new Date((new Date()).getFullYear().toFixed() + "-01-01");
	if(!attr.date_till)
		attr.date_till = new Date((new Date()).getFullYear().toFixed() + "-12-31");


	function frm_create(){


		if((pwnd instanceof dhtmlXLayoutCell || pwnd instanceof dhtmlXSideBarCell || pwnd instanceof dhtmlXCarouselCell)
			&& (attr.bind_pwnd || attr.Приклеить)) {

			if(wnd == pwnd && wnd._mgr == _mgr)
				return;

			if(typeof pwnd.close == "function")
				pwnd.close(true);

			wnd = pwnd;
			wnd.close = function (on_create) {
				var _wnd = wnd || pwnd;

				if(on_create || check_modified()){

					if(_wnd){

						if(_wnd.conf){
							_wnd.detachToolbar();
							_wnd.detachStatusBar();
							_wnd.conf.unloading = true;
							_wnd.detachObject(true);
						}
					}
					frm_unload(on_create);

				}
			};
			wnd.elmnts = {grids: {}};

		}else{
			options = {
				name: 'wnd_rep_' + _mgr.class_name,
				wnd: {
					top: 80 + Math.random()*40,
					left: 120 + Math.random()*80,
					width: 700,
					height: 400,
					modal: true,
					center: false,
					pwnd: pwnd,
					allow_close: true,
					allow_minmax: true,
					on_close: frm_close,
					caption: (_meta.obj_presentation || _meta.synonym)
				}
			};
			wnd = $p.iface.dat_blank(null, options.wnd);
		}

		wnd._mgr = _mgr;
		wnd.report = _mgr.create();


		if(!wnd.set_text)
			wnd.__define({


				set_text: {
					value: function(force) {
						if(attr && attr.set_text || wnd && wnd.setText){

							var title = (_meta.obj_presentation || _meta.synonym);

							if(force || _title !== title){
								_title = title;
								if(attr.set_text)
									attr.set_text(title);
								else
									wnd.setText(title);
							}
						}
					},
					configurable: true
				}
			});


		wnd.elmnts.layout = wnd.attachLayout({
			pattern: "2U",
			cells: [{
				id: "a",
				text: "Отчет",
				header: false
			}, {
				id: "b",
				text: "Параметры",
				collapsed_text: "Параметры",
				width: 220

			}],
			offsets: { top: 0, right: 0, bottom: 0, left: 0}
		});

		wnd.elmnts.frm_toolbar = wnd.attachToolbar();
		wnd.elmnts.frm_toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
		wnd.elmnts.frm_toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_rep.xml"], function(){

			if(wnd === pwnd)
				this.cont.style.top = "4px";

			this.addSpacer("btn_run");
			this.attachEvent("onclick", attr.toolbar_click || toolbar_click);

		});

		wnd.set_text();
		if(!attr.hide_header && wnd.showHeader)
			wnd.showHeader();

		wnd.elmnts.table = new $p.HandsontableDocument(wnd.elmnts.layout.cells("a"),
			{allow_offline: wnd.report.allow_offline, autorun: false})
			.then(function (rep) {
				if(!rep._online)
					return wnd.elmnts.table = null;
			});

		wnd.elmnts.frm_prm = document.createElement("DIV");
		wnd.elmnts.frm_prm.style = "height: 100%; min-height: 300px; width: 100%";
		wnd.elmnts.layout.cells("b").attachObject(wnd.elmnts.frm_prm);

		wnd.report.daterange = new $p.iface.ODateRangePicker(wnd.elmnts.frm_prm, attr);

	}


	function toolbar_click(btn_id){

		if(btn_id=="btn_close"){
			wnd.close();

		}else if(btn_id=="btn_run"){
			wnd.report.build().then(show).catch(show);

		}else if(btn_id=="btn_print"){

		}else if(btn_id=="btn_save"){

		}else if(btn_id=="btn_load"){

		}else if(btn_id=="btn_export"){
		}

	}


	function show(data) {
		wnd.elmnts.table.requery(data);
	}


	function frm_unload(on_create){

		if(attr && attr.on_close && !on_create)
			attr.on_close();

		if(!on_create){
			delete wnd.set_text;

			if(wnd.elmnts.table)
				wnd.elmnts.table.hot.destroy();

			if(wnd.report.daterange)
				wnd.report.daterange.remove();

			wnd.report = null;

			_mgr = wnd = _meta = options = pwnd = attr = null;
		}
	}

	frm_create();

	return wnd;

};


DataManager.prototype.form_selection = function(pwnd, attr){

	if(!pwnd)
		pwnd = attr && attr.pwnd ? attr.pwnd : {};

	if(!attr && !(pwnd instanceof dhtmlXCellObject)){
		attr = pwnd;
		pwnd = {};
	}

	if(!attr)
		attr = {};


	var _mgr = this,
		_meta = attr.metadata || _mgr.metadata(),
		has_tree = _meta["hierarchical"] && !(_mgr instanceof ChartOfAccountManager),
		wnd, s_col = 0, a_direction = "asc",
		previous_filter = {},
		on_select = pwnd.on_select || attr.on_select;



	function frm_create(){

		if(pwnd instanceof dhtmlXCellObject) {
			if(!(pwnd instanceof dhtmlXTabBarCell) && (typeof pwnd.close == "function"))
				pwnd.close(true);
			wnd = pwnd;
			wnd.close = function (on_create) {
				if(wnd || pwnd){
					(wnd || pwnd).detachToolbar();
					(wnd || pwnd).detachStatusBar();
					if((wnd || pwnd).conf)
						(wnd || pwnd).conf.unloading = true;
					(wnd || pwnd).detachObject(true);
				}
				frm_unload(on_create);
			};
			if(!attr.hide_header){
				setTimeout(function () {
					wnd.showHeader();
				});
			}
		}else{
			wnd = $p.iface.w.createWindow(null, 0, 0, 700, 500);
			wnd.centerOnScreen();
			wnd.setModal(1);
			wnd.button('park').hide();
			wnd.button('minmax').show();
			wnd.button('minmax').enable();
			wnd.attachEvent("onClose", frm_close);
		}

		$p.iface.bind_help(wnd);

		if(wnd.setText && !attr.hide_text)
			wnd.setText('Список ' + (_mgr.class_name.indexOf("doc.") == -1 ? 'справочника "' : 'документов "') + (_meta["list_presentation"] || _meta.synonym) + '"');

		document.body.addEventListener("keydown", body_keydown, false);

		wnd.elmnts = {}

		if(attr.status_bar || !attr.smart_rendering){
			wnd.elmnts.status_bar = wnd.attachStatusBar();
		}

		if(!attr.smart_rendering){
			wnd.elmnts.status_bar.setText("<div id='" + _mgr.class_name.replace(".", "_") + "_select_recinfoArea'></div>");
		}

		wnd.elmnts.toolbar = wnd.attachToolbar();
		wnd.elmnts.toolbar.setIconsPath(dhtmlx.image_path + 'dhxtoolbar' + dhtmlx.skin_suffix());
		wnd.elmnts.toolbar.loadStruct(attr.toolbar_struct || $p.injected_data["toolbar_selection.xml"], function(){

			this.attachEvent("onclick", toolbar_click);

			if(wnd === pwnd){
				this.cont.parentElement.classList.add("dhx_cell_toolbar_no_borders");
				this.cont.parentElement.classList.remove("dhx_cell_toolbar_def");
				this.cont.style.top = "4px";
			}

			var tbattr = {
				manager: _mgr,
				toolbar: this,
				onchange: input_filter_change,
				hide_filter: attr.hide_filter,
				custom_selection: attr.custom_selection
			};
			if(attr.date_from) tbattr.date_from = attr.date_from;
			if(attr.date_till) tbattr.date_till = attr.date_till;
			if(attr.period) tbattr.period = attr.period;
			wnd.elmnts.filter = new $p.iface.Toolbar_filter(tbattr);


			var _acl = $p.current_user.get_acl(_mgr.class_name);

			if(_acl.indexOf("i") == -1)
				this.hideItem("btn_new");

			if(_acl.indexOf("v") == -1)
				this.hideItem("btn_edit");

			if(_acl.indexOf("d") == -1)
				this.hideItem("btn_delete");

			if(!on_select){
				this.hideItem("btn_select");
				this.hideItem("sep1");
				if($p.iface.docs && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper")
					this.addListOption("bs_more", "btn_order_list", "~", "button", "<i class='fa fa-briefcase fa-lg fa-fw'></i> Список заказов");
			}
			this.addListOption("bs_more", "btn_import", "~", "button", "<i class='fa fa-upload fa-lg fa-fw'></i> Загрузить из файла");
			this.addListOption("bs_more", "btn_export", "~", "button", "<i class='fa fa-download fa-lg fa-fw'></i> Выгрузить в файл");


			if(_mgr.printing_plates)
				_mgr.printing_plates().then(function (pp) {
					var added;
					for(var pid in pp){
						wnd.elmnts.toolbar.addListOption("bs_print", pid, "~", "button", pp[pid].toString());
						added = true;
					}
					if(!added)
						wnd.elmnts.toolbar.hideItem("bs_print");
				});
			else
				wnd.elmnts.toolbar.hideItem("bs_print");

			create_tree_and_grid();
		});

		wnd._mgr = _mgr;

		return wnd;
	}

	function body_keydown(evt){

		if(wnd && wnd.is_visible && wnd.is_visible()){
			if (evt.ctrlKey && evt.keyCode == 70){ 
				if(!$p.iface.check_exit(wnd)){
					setTimeout(function(){
						if(wnd.elmnts.filter.input_filter && $p.job_prm.device_type == "desktop")
							wnd.elmnts.filter.input_filter.focus();
					});
					return $p.iface.cancel_bubble(evt);
				}

			} else if(evt.shiftKey && evt.keyCode == 116){ 
				if(!$p.iface.check_exit(wnd)){
					setTimeout(function(){
						wnd.elmnts.grid.reload();
					});
					if(evt.preventDefault)
						evt.preventDefault();
					return $p.iface.cancel_bubble(evt);
				}

			} else if(evt.keyCode == 27){ 
				if(wnd instanceof dhtmlXWindowsCell && !$p.iface.check_exit(wnd)){
					setTimeout(function(){
						wnd.close();
					});
				}
			}
		}
	}

	function input_filter_change(flt){
		if(wnd && wnd.elmnts){
			if(has_tree){
				if(flt.filter || flt.hide_tree)
					wnd.elmnts.cell_tree.collapse();
				else
					wnd.elmnts.cell_tree.expand();
			}
			wnd.elmnts.grid.reload();
		}
	}

	function create_tree_and_grid(){
		var layout, cell_tree, cell_grid, tree, grid, grid_inited;

		if(has_tree){
			layout = wnd.attachLayout('2U');

			cell_grid = layout.cells('b');
			cell_grid.hideHeader();

			cell_tree = wnd.elmnts.cell_tree = layout.cells('a');
			cell_tree.setWidth('220');
			cell_tree.hideHeader();

			tree = wnd.elmnts.tree = cell_tree.attachDynTree(_mgr, null, function(){
				setTimeout(function(){
					if(grid && grid.reload)
						grid.reload();
				}, 20);
			});
			tree.attachEvent("onSelect", function(id, mode){	
				if(!mode)
					return;
				if(this.do_not_reload)
					delete this.do_not_reload;
				else
					setTimeout(function(){
						if(grid && grid.reload)
							grid.reload();
					}, 20);
			});
			tree.attachEvent("onDblClick", function(id){
				select(id);
			});

		}else{
			cell_grid = wnd;
			setTimeout(function(){
				if(grid && grid.reload)
					grid.reload();
			}, 20);
		}

		grid = wnd.elmnts.grid = cell_grid.attachGrid();
		grid.setIconsPath(dhtmlx.image_path);
		grid.setImagePath(dhtmlx.image_path);
		grid.attachEvent("onBeforeSorting", customColumnSort);
		grid.attachEvent("onBeforePageChanged", function(){ return !!this.getRowsNum();});
		grid.attachEvent("onXLE", function(){cell_grid.progressOff(); });
		grid.attachEvent("onXLS", function(){cell_grid.progressOn(); });
		grid.attachEvent("onDynXLS", function(start,count){
			var filter = get_filter(start,count);
			if(!filter)
				return;
			_mgr.sync_grid(filter, grid);
			return false;
		});
		grid.attachEvent("onRowDblClicked", function(rId, cInd){
			if(tree && tree.items[rId]){
				tree.selectItem(rId);
				var pid = tree.getParentId(rId);
				if(pid && pid != $p.utils.blank.guid)
					tree.openItem(pid);
			}else
				select(rId);
		});

		if(attr.smart_rendering){
			grid.enableSmartRendering(true, 50);
		}else{
			grid.setPagingWTMode(true,true,true,[20,30,60]);
			grid.enablePaging(true, 30, 8, _mgr.class_name.replace(".", "_") + "_select_recinfoArea");
			grid.setPagingSkin("toolbar", dhtmlx.skin);
		}

		if($p.iface.docs && $p.iface.docs.getViewName && $p.iface.docs.getViewName() == "oper")
			grid.enableMultiselect(true);

		grid.reload = function(){

			var filter = get_filter();
			if(!filter)
				return Promise.resolve();

			cell_grid.progressOn();
			grid.clearAll();

			return _mgr.sync_grid(filter, grid)
				.then(function(xml){
					if(typeof xml === "object"){
						$p.msg.check_soap_result(xml);

					}else if(!grid_inited){
						if(filter.initial_value){
							var xpos = xml.indexOf("set_parent"),
								xpos2 = xml.indexOf("'>", xpos),
								xh = xml.substr(xpos+12, xpos2-xpos-12);
							if($p.utils.is_guid(xh)){
								if(has_tree){
									tree.do_not_reload = true;
									tree.selectItem(xh, false);
								}
							}
							grid.selectRowById(filter.initial_value);

						}else if(filter.parent && $p.utils.is_guid(filter.parent) && has_tree){
							tree.do_not_reload = true;
							tree.selectItem(filter.parent, false);
						}
						grid.setColumnMinWidth(200, grid.getColIndexById("presentation"));
						grid.enableAutoWidth(true, 1200, 600);
						grid.setSizes();
						grid_inited = true;
						if(wnd.elmnts.filter.input_filter && $p.job_prm.device_type == "desktop")
							wnd.elmnts.filter.input_filter.focus();

						if(attr.on_grid_inited)
							attr.on_grid_inited();
					}

					if (a_direction && grid_inited)
						grid.setSortImgState(true, s_col, a_direction);

					cell_grid.progressOff();

				});
		};
	}

	function toolbar_click(btn_id){

		if(attr.toolbar_click && attr.toolbar_click(btn_id, wnd, _mgr) === false){
			return;
		}

		if(btn_id=="btn_select"){
			select();

		}else if(btn_id=="btn_new"){

			_mgr.create({}, true)
				.then(function (o) {

					if(attr.on_new)
						attr.on_new(o, wnd);

					else if($p.job_prm.keep_hash){
						o.form_obj(wnd);

					} else{
						o._set_loaded(o.ref);
						$p.iface.set_hash(_mgr.class_name, o.ref);
					}
				});


		}else if(btn_id=="btn_edit") {
			var rId = wnd.elmnts.grid.getSelectedRowId();
			if (rId){
				if(attr.on_edit)
					attr.on_edit(_mgr, rId, wnd);

				else if($p.job_prm.keep_hash){

					_mgr.form_obj(wnd, {ref: rId});

				} else
					$p.iface.set_hash(_mgr.class_name, rId);
			}else
				$p.msg.show_msg({
					type: "alert-warning",
					text: $p.msg.no_selected_row.replace("%1", ""),
					title: $p.msg.main_title
				});

		}else if(btn_id.substr(0,4)=="prn_"){
				print(btn_id);

		}else if(btn_id=="btn_order_list"){
			$p.iface.set_hash("", "", "", "def");

		}else if(btn_id=="btn_delete"){
			mark_deleted();

		}else if(btn_id=="btn_import"){
			_mgr.import();

		}else if(btn_id=="btn_export"){
			_mgr.export(wnd.elmnts.grid.getSelectedRowId());

		}else if(btn_id=="btn_requery"){
			previous_filter = {};
			wnd.elmnts.grid.reload();

		}
	}

	function select(rId){

		if(!rId)
			rId = wnd.elmnts.grid.getSelectedRowId();

		var folders;
		if(attr.selection){
			attr.selection.forEach(function(sel){
				for(var key in sel){
					if(key=="is_folder")
						folders = sel[key];
				}
			});
		}

		if(wnd.elmnts.tree &&
			wnd.elmnts.tree.items[rId] &&
			wnd.elmnts.tree.getSelectedId() != rId){
			wnd.elmnts.tree.selectItem(rId, true);
			return;
		}

		if(rId && folders === true && wnd.elmnts.grid.cells(rId, 0).cell.classList.contains("cell_ref_elm")){
			$p.msg.show_msg($p.msg.select_grp);
			return;
		}


		if((!rId && wnd.elmnts.tree) || (wnd.elmnts.tree && wnd.elmnts.tree.getSelectedId() == rId)){
			if(folders === false){
				$p.msg.show_msg($p.msg.select_elm);
				return;
			}
			rId = wnd.elmnts.tree.getSelectedId();
		}

		if(rId){

			if(attr.on_edit)
				attr.on_edit(_mgr, rId, wnd);

			else if(on_select){

				_mgr.get(rId, true)
					.then(function(selv){
						wnd.close();
						on_select.call(pwnd.grid || pwnd, selv);
					});

			} else if($p.job_prm.keep_hash){

				_mgr.form_obj(wnd, {ref: rId});

			} else
				$p.iface.set_hash(_mgr.class_name, rId);

		}
	}

	function print(pid){
		var rId = wnd.elmnts.grid.getSelectedRowId();
		if(rId)
			_mgr.print(rId, pid, wnd);
		else
			$p.msg.show_msg({type: "alert-warning",
				text: $p.msg.no_selected_row.replace("%1", ""),
				title: $p.msg.main_title});
	}

	function mark_deleted(){
		var rId = wnd.elmnts.grid.getSelectedRowId();
		if(rId){
			_mgr.get(rId, true, true)
				.then(function (o) {

					dhtmlx.confirm({
						title: $p.msg.main_title,
						text: o._deleted ? $p.msg.mark_undelete_confirm.replace("%1", o.presentation) : $p.msg.mark_delete_confirm.replace("%1", o.presentation),
						cancel: "Отмена",
						callback: function(btn) {
							if(btn)
								o.mark_deleted(!o._deleted);
						}
					});
				});
		}else
			$p.msg.show_msg({type: "alert-warning",
				text: $p.msg.no_selected_row.replace("%1", ""),
				title: $p.msg.main_title});
	}

	function frm_unload(on_create){

		document.body.removeEventListener("keydown", body_keydown);

		if(attr && attr.on_close && !on_create)
			attr.on_close();

		if(!on_create){
			_mgr = wnd = _meta = previous_filter = on_select = pwnd = attr = null;
		}
	}

	function frm_close(){

		setTimeout(frm_unload, 10);

		if(pwnd.on_unload)
			pwnd.on_unload.call(pwnd.grid || pwnd);

		if(_frm_close){
			$p.eve.detachEvent(_frm_close);
			_frm_close = null;
		}

		return true;
	}

	function get_filter(start, count){
		var filter = wnd.elmnts.filter.get_filter()
				._mixin({
					action: "get_selection",
					metadata: _meta,
					class_name: _mgr.class_name,
					order_by: wnd.elmnts.grid.columnIds[s_col] || s_col,
					direction: a_direction,
					start: start || ((wnd.elmnts.grid.currentPage || 1)-1)*wnd.elmnts.grid.rowsBufferOutSize,
					count: count || wnd.elmnts.grid.rowsBufferOutSize,
					get_header: (previous_filter.get_header == undefined)
				}),
			tparent = has_tree ? wnd.elmnts.tree.getSelectedId() : null;

		if(attr.smart_rendering)
			filter.smart_rendering = true;

		if(attr.date_from && !filter.date_from)
			filter.date_from = attr.date_from;

		if(attr.date_till && !filter.date_till)
			filter.date_till = attr.date_till;

		if(attr.initial_value)
			filter.initial_value = attr.initial_value;

		if(attr.custom_selection)
			filter.custom_selection = attr.custom_selection;

		if(attr.selection){
			if(!filter.selection)
				filter.selection = attr.selection;

			else if(Array.isArray(attr.selection)){
				attr.selection.forEach(function (flt) {
					filter.selection.push(flt);
				});

			}else{
				for(var fld in attr.selection){
					if(!res.selection)
						res.selection = [];
					var flt = {};
					flt[fld] = attr.selection[fld];
					filter.selection.push(flt);
				}
			}
		}

		if(attr.owner && !filter.owner)
			filter.owner = attr.owner;

		filter.parent = ((tparent  || attr.parent) && !filter.filter) ? (tparent || attr.parent) : null;
		if(has_tree && !filter.parent)
			filter.parent = $p.utils.blank.guid;


		for(var f in filter){
			if(previous_filter[f] != filter[f]){
				previous_filter = filter;
				return filter;
			}
		}
	}

	function customColumnSort(ind){
		var a_state = wnd.elmnts.grid.getSortingState();
		s_col=ind;
		a_direction = ((a_state[1] == "des")?"asc":"des");
		wnd.elmnts.grid.reload();
		return true;
	}

	var _frm_close = $p.eve.attachEvent("frm_close", function (class_name, ref) {
		if(_mgr && _mgr.class_name == class_name && wnd && wnd.elmnts){
			wnd.elmnts.grid.reload()
				.then(function () {
					if(!$p.utils.is_empty_guid(ref))
						wnd.elmnts.grid.selectRowById(ref, false, true, true);
				});
		}
	});

	if(has_tree && attr.initial_value && attr.initial_value!= $p.utils.blank.guid && !attr.parent)
		return _mgr.get(attr.initial_value, true)
			.then(function (tObj) {
				attr.parent = tObj.parent.ref;
				attr.set_parent = attr.parent;
				return frm_create();
			});
	else
		return frm_create();
};

DataManager.prototype.form_list = function(pwnd, attr){
	return this.form_selection(pwnd, attr);
};


$p.iface.wnd_sync = function() {

	var _sync = $p.iface.sync = {},
		_stepper;

	_sync.create = function(stepper){
		_stepper = stepper;
		frm_create();
	};

	_sync.update = function(cats){
		_stepper.frm_sync.setItemValue("text_processed", "Обработано элементов: " + _stepper.step * _stepper.step_size + " из " + _stepper.count_all);
		var cat_list = "", md, rcount = 0;
		for(var cat_name in cats){
			rcount++;
			if(rcount > 4)
				break;
			if(cat_list)
				cat_list+= "<br />";
			md = $p.cat[cat_name].metadata();
			cat_list+= (md.list_presentation || md.synonym) + " (" + cats[cat_name].length + ")";
		}
		_stepper.frm_sync.setItemValue("text_current", "Текущий запрос: " + _stepper.step + " (" + Math.round(_stepper.step * _stepper.step_size * 100 / _stepper.count_all) + "%)");
		_stepper.frm_sync.setItemValue("text_bottom", cat_list);

	};

	_sync.close = function(){
		if(_stepper && _stepper.wnd_sync){
			_stepper.wnd_sync.close();
			delete _stepper.wnd_sync;
			delete _stepper.frm_sync;
		}
	};



	function frm_create(){

		var options = {
			name: 'wnd_sync',
			wnd: {
				id: 'wnd_sync',
				top: 130,
				left: 200,
				width: 496,
				height: 290,
				modal: true,
				center: true,
				caption: "Подготовка данных"
			}
		};

		_stepper.wnd_sync = $p.iface.dat_blank(null, options.wnd);

		var str = [
			{ type:"block" , name:"form_block_1", list:[
				{ type:"label" , name:"form_label_1", label: $p.msg.sync_data },
				{ type:"block" , name:"form_block_2", list:[
					{ type:"template",	name:"img_long", className: "img_long" },
					{ type:"newcolumn"   },
					{ type:"template",	name:"text_processed"},
					{ type:"template",	name:"text_current"},
					{ type:"template",	name:"text_bottom"}
				]  }
			]  },
			{ type:"button" , name:"form_button_1", value: $p.msg.sync_break }
		];
		_stepper.frm_sync = _stepper.wnd_sync.attachForm(str);
		_stepper.frm_sync.attachEvent("onButtonClick", function(name) {
			if(_stepper)
				_stepper.do_break = true;
		});

		_stepper.frm_sync.setItemValue("text_processed", "Инициализация");
		_stepper.frm_sync.setItemValue("text_bottom", "Загружается структура таблиц...");
	}
};




DataManager.prototype.export = function(attr){

	if(attr && "string" === typeof attr)
		attr = {items: attr.split(",")};
	else if(!attr)
		attr = {items: []};


	var _mgr = this, wnd,
		options = {
			name: 'export',
			wnd: {
				top: 130,
				left: 200,
				width: 480,
				height: 350
			}
		};

	frm_create();



	function frm_create(){

		$p.wsql.restore_options("data_manager", options);
		options.wnd.caption = "Экспорт " + _mgr.family_name + " '" + (_mgr.metadata().synonym || _mgr.metadata().name) + "'";

		wnd = $p.iface.dat_blank(null, options.wnd);

		wnd.bottom_toolbar({
			buttons: [
				{name: 'btn_cancel', text: '<i class="fa fa-times fa-lg"></i> Отмена', title: 'Отмена', width:'80px', float: 'right'},
				{name: 'btn_ok', b: '<i class="fa fa-floppy-o"></i> Ок', title: 'Выполнить экспорт', width:'50px', float: 'right'}],
			onclick: function (name) {
					if(name == 'btn_ok')
						do_export();
					else
						wnd.close();
					return false;
				}
			});


		wnd.button('close').show();
		wnd.button('park').hide();
		wnd.attachEvent("onClose", frm_close);

		var str = [
			{ type:"fieldset" , name:"form_range", label:"Выгрузить", list:[
				{ type:"settings" , labelWidth:320, labelAlign:"left", position:"label-right"  },
				{ type:"radio" , name:"range", label:"Выделенные строки", value:"selected"  },
				{ type:"radio" , name:"range", label:"Весь справочник", value:"all"  }
			]},
			{ type:"fieldset" , name:"form_fieldset_2", label:"Дополнительно выгрузить", list:[
				{ type:"settings" , labelWidth:160, position:"label-right"  },
				{ type:"checkbox" , name:"meta", label:"Описание метаданных", labelAlign:"left", position:"label-right", checked: options.meta  },
				{ type:"newcolumn"   },
				{ type:"checkbox" , name:"relation", label:"Связанные объекты", position:"label-right", checked: options.relation, tooltip: "Связанные объекты по ссылкам (пока не реализовано)" }
			]  },
			{ type:"fieldset" , name:"fieldset_format", label:"Формат файла", list:[
				{ type:"settings" , labelWidth:60, labelAlign:"left", position:"label-right"  },
				{ type:"radio" , name:"format", label:"json", value:"json", tooltip: "Выгрузить в формате JSON"  },
				{ type:"newcolumn"   },
				{ type:"radio" , name:"format", label:"xlsx", value:"xlsx", tooltip: "Выгрузить в офисном формате XLSX" },
				{ type:"newcolumn"   },
				{ type:"radio" , name:"format", label:"atom", value:"atom", tooltip: "Выгрузить в формате XML Atom" }

			]  }


		];
		wnd.elmnts.frm = wnd.attachForm(str);

		wnd.elmnts.frm.setItemValue("range", options.range || "all");

		if(attr.items && attr.items.length == 1){
			if(attr.obj)
				wnd.elmnts.frm.setItemLabel("range", "selected", "Тек. объект: " + attr.items[0].presentation);
			else
				_mgr.get(attr.items[0], true).then(function (Obj) {
					wnd.elmnts.frm.setItemLabel("range", "selected", "Тек. объект: " + Obj.presentation);
				});
			wnd.elmnts.frm.setItemValue("range", "selected");

		}else if(attr.items && attr.items.length)
			wnd.elmnts.frm.setItemLabel("range", "selected", "Выделенные строки (" + attr.items.length + " элем.)");

		if(_mgr instanceof DocManager)
			wnd.elmnts.frm.setItemLabel("range", "all", "Все документы из кеша (0 элем.)");


		wnd.elmnts.frm.setItemValue("format", options.format || "json");

		wnd.elmnts.frm.attachEvent("onChange", set_availability);

		set_availability();

		if(attr.pwnd && attr.pwnd.isModal && attr.pwnd.isModal()){
			attr.set_pwnd_modal = true;
			attr.pwnd.setModal(false);
		}
		wnd.setModal(true);

	}

	function set_availability(){

		wnd.elmnts.frm.setItemValue("relation", false);
		wnd.elmnts.frm.disableItem("relation");

		if(wnd.elmnts.frm.getItemValue("range") == "all"){
			wnd.elmnts.frm.disableItem("format", "atom");
			if(wnd.elmnts.frm.getItemValue("format") == "atom")
				wnd.elmnts.frm.setItemValue("format", "json");
		}else
			wnd.elmnts.frm.enableItem("format", "atom");

		if(wnd.elmnts.frm.getItemValue("format") == "json"){
			wnd.elmnts.frm.enableItem("meta");

		}else if(wnd.elmnts.frm.getItemValue("format") == "sql"){
			wnd.elmnts.frm.setItemValue("meta", false);
			wnd.elmnts.frm.disableItem("meta");

		}else{
			wnd.elmnts.frm.setItemValue("meta", false);
			wnd.elmnts.frm.disableItem("meta");

		}
	}

	function refresh_options(){
		options.format = wnd.elmnts.frm.getItemValue("format");
		options.range = wnd.elmnts.frm.getItemValue("range");
		options.meta = wnd.elmnts.frm.getItemValue("meta");
		options.relation = wnd.elmnts.frm.getItemValue("relation");
		return options;
	}

	function do_export(){

		refresh_options();

		function export_xlsx(){
			if(attr.obj)
				$p.wsql.alasql("SELECT * INTO XLSX('"+_mgr.table_name+".xlsx',{headers:true}) FROM ?", [attr.items[0]._obj]);
			else
				$p.wsql.alasql("SELECT * INTO XLSX('"+_mgr.table_name+".xlsx',{headers:true}) FROM " + _mgr.table_name);
		}

		var res = {meta: {}, items: {}},
			items = res.items[_mgr.class_name] = [];


		if(options.meta)
			res.meta[_mgr.class_name] = _mgr.metadata();

		if(options.format == "json"){

			if(attr.obj)
				items.push(attr.items[0]._obj);
			else
				_mgr.each(function (o) {
					if(options.range == "all" || attr.items.indexOf(o.ref) != -1)
						items.push(o._obj);
				});

			if(attr.items.length && !items.length)
				_mgr.get(attr.items[0], true).then(function (Obj) {
					items.push(Obj._obj);
					alasql.utils.saveFile(_mgr.table_name+".json", JSON.stringify(res, null, 4));
				});

			else
				alasql.utils.saveFile(_mgr.table_name+".json", JSON.stringify(res, null, 4));

		}else if(options.format == "xlsx"){
			if(!window.xlsx)
				$p.load_script("//cdn.jsdelivr.net/js-xlsx/latest/xlsx.core.min.js", "script", export_xlsx);
			else
				export_xlsx();

		}else if(options.format == "atom" && attr.items.length){

			var po = attr.obj ? Promise.resolve(attr.items[0]) : _mgr.get(attr.items[0], true);
			po.then(function (o) {
				alasql.utils.saveFile(_mgr.table_name+".xml", o.to_atom());
			});

		}else{
			$p.msg.show_not_implemented();
		}
	}

	function frm_close(win){

		$p.iface.popup.hide();
		wnd.wnd_options(options.wnd);
		$p.wsql.save_options("data_manager", refresh_options());

		wnd.setModal(false);
		if(attr.set_pwnd_modal && attr.pwnd.setModal)
			attr.pwnd.setModal(true);

		return true;
	}


};


DataManager.prototype.import = function(file, obj){

	var input_file, imported;

	function import_file(event){

		function do_with_collection(cl_name, items){
			var _mgr = _md.mgr_by_class_name(cl_name);
			if(items.length){
				if(!obj){
					imported = true;
					_mgr.load_array(items, true);
				} else if(obj._manager == _mgr){
					for(var i in items){
						if($p.utils.fix_guid(items[i]) == obj.ref){
							imported = true;
							_mgr.load_array([items[i]], true);
						}
					}
				}
			}
		}

		wnd.close();
		if(input_file.files.length){

			var reader = new FileReader();
			reader.onload = function(e) {
				try{
					var res = JSON.parse(reader.result);

					if(res.items){
						for(var cl_name in res.items)
							do_with_collection(cl_name, res.items[cl_name]);

					}else{
						["cat", "doc", "ireg", "areg", "cch", "cacc"].forEach(function (cl) {
							if(res[cl]) {
								for (var cl_name in res[cl])
									do_with_collection(cl + "." + cl_name, res.cat[cl_name]);
							}
						});
					}
					if(!imported)
						$p.msg.show_msg($p.msg.sync_no_data);

				}catch(err){
					$p.msg.show_msg(err.message);
				}
			};
			reader.readAsText(input_file.files[0]);
		}
	}

	if(!file && typeof window != undefined){

		var options = {
				name: 'import',
				wnd: {
					width: 300,
					height: 100,
					caption: $p.msg.select_file_import
				}
			},
			wnd = $p.iface.dat_blank(null, options.wnd);

		input_file = document.createElement("input");
		input_file.setAttribute("id", "json_file");
		input_file.setAttribute("type", "file");
		input_file.setAttribute("accept", ".json");
		input_file.setAttribute("value", "*.json");
		input_file.onchange = import_file;

		wnd.button('close').show();
		wnd.button('park').hide();
		wnd.attachObject(input_file);
		wnd.centerOnScreen();
		wnd.setModal(true);

		setTimeout(function () {
			input_file.click();
		}, 100);
	}
};


function AppEvents() {

	this.__define({

		init: {
			value: function () {
				$p.__define("job_prm", {
					value: new JobPrm(),
					writable: false
				});
				$p.wsql.init_params();
			}
		},

		do_eventable: {
			value: function (obj) {

				function attach(name, func) {
					name = String(name).toLowerCase();
					if (!this._evnts.data[name])
						this._evnts.data[name] = {};
					var eventId = $p.utils.generate_guid();
					this._evnts.data[name][eventId] = func;
					return eventId;
				}

				function detach(eventId) {

					if(!eventId){
						return detach_all.call(this);
					}

					for (var a in this._evnts.data) {
						var k = 0;
						for (var b in this._evnts.data[a]) {
							if (b == eventId) {
								this._evnts.data[a][b] = null;
								delete this._evnts.data[a][b];
							} else {
								k++;
							}
						}
						if (k == 0) {
							this._evnts.data[a] = null;
							delete this._evnts.data[a];
						}
					}
				}

				 function detach_all() {
					for (var a in this._evnts.data) {
						for (var b in this._evnts.data[a]) {
							this._evnts.data[a][b] = null;
							delete this._evnts.data[a][b];
						}
						this._evnts.data[a] = null;
						delete this._evnts.data[a];
					}
				}

				function call(name, params) {
					name = String(name).toLowerCase();
					if (this._evnts.data[name] == null)
						return true;
					var r = true;
					for (var a in this._evnts.data[name]) {
						r = this._evnts.data[name][a].apply(this, params) && r;
					}
					return r;
				}

				function ontimer() {

					for(var name in this._evnts.evnts){
						var l = this._evnts.evnts[name].length;
						if(l){
							for(var i=0; i<l; i++){
								this.emit(name, this._evnts.evnts[name][i]);
							}
							this._evnts.evnts[name].length = 0;
						}
					}

					this._evnts.timer = 0;
				}

				obj.__define({

					_evnts: {
						value: {
							data: {},
							timer: 0,
							evnts: {}
						}
					},

					on: {
						value: attach
					},

					attachEvent: {
						value: attach
					},

					off: {
						value: detach
					},

					detachEvent: {
						value: detach
					},

					detachAllEvents: {
						value: detach_all
					},

					checkEvent: {
						value: function(name) {
							name = String(name).toLowerCase();
							return (this._evnts.data[name] != null);
						}
					},

					callEvent: {
						value: call
					},

					emit: {
						value: call
					},

					emit_async: {
						value: function callEvent(name, params){

							if(!this._evnts.evnts[name])
								this._evnts.evnts[name] = [];

							this._evnts.evnts[name].push(params);

							if(this._evnts.timer)
								clearTimeout(this._evnts.timer);

							this._evnts.timer = setTimeout(ontimer.bind(this), 4);
						}
					}

				});
			}
		}
	});

	if(typeof window !== "undefined" && window.dhx4){
		for(var p in dhx4){
			this[p] = dhx4[p];
			delete dhx4[p];
		}
		window.dhx4 = this;

	}else if(typeof WorkerGlobalScope === "undefined"){


		this.do_eventable(this);

	}

}

function JobPrm(){

	this.__define({

		offline: {
			value: false,
			writable: true
		},

		local_storage_prefix: {
			value: "",
			writable: true
		},

		create_tables: {
			value: true,
			writable: true
		},

		url_prm: {
			value: typeof window != "undefined" ? this.parse_url() : {}
		}

	});

	$p.eve.callEvent("settings", [this]);

	for(var prm_name in this){
		if(prm_name !== "url_prm" && typeof this[prm_name] !== "function" && this.url_prm.hasOwnProperty[prm_name])
			this[prm_name] = this.url_prm[prm_name];
	}

};

JobPrm.prototype.__define({

  base_url: {
    value: function (){
      return $p.wsql.get_user_param("rest_path") || $p.job_prm.rest_path || "/a/zd/%1/odata/standard.odata/";
    }
  },

  parse_url_str: {
    value: function (prm_str) {
      var prm = {}, tmp = [], pairs;

      if (prm_str[0] === "#" || prm_str[0] === "?")
        prm_str = prm_str.substr(1);

      if (prm_str.length > 2) {

        pairs = decodeURI(prm_str).split('&');

        for (var i in pairs) {   
          tmp = pairs[i].split('=');
          if (tmp[0] == "m") {
            try {
              prm[tmp[0]] = JSON.parse(tmp[1]);
            } catch (e) {
              prm[tmp[0]] = {};
            }
          } else
            prm[tmp[0]] = tmp[1] || "";
        }
      }

      return prm;
    }
  },

  parse_url: {
    value: function () {
      return this.parse_url_str(location.search)._mixin(this.parse_url_str(location.hash));
    }
  },

  rest_url: {
    value: function () {
      var url = this.base_url(),
        zone = $p.wsql.get_user_param("zone", $p.job_prm.zone_is_string ? "string" : "number");
      return zone ? url.replace("%1", zone) : url.replace("%1/", "");
    }
  },

  irest_url: {
    value: function () {
      var url = this.base_url().replace("odata/standard.odata", "hs/rest"),
        zone = $p.wsql.get_user_param("zone", $p.job_prm.zone_is_string ? "string" : "number");
      return zone ? url.replace("%1", zone) : url.replace("%1/", "");
    }
  }

});


function Modifiers(){

	var methods = [];

	this.push = function (method) {
		methods.push(method);
	};

	this.detache = function (method) {
		var index = methods.indexOf(method);
		if(index != -1)
			methods.splice(index, 1);
	};

	this.clear = function () {
		methods.length = 0;
	};

	this.execute = function (context) {

		var res, tres;
		methods.forEach(function (method) {
			if(typeof method === "function")
				tres = method(context);
			else
				tres = $p.injected_data[method](context);
			if(res !== false)
				res = tres;
		});
		return res;
	};

	this.execute_external = function (data) {

		var paths = $p.wsql.get_user_param("modifiers");

		if(paths){
			paths = paths.split('\n').map(function (path) {
				if(path)
					return new Promise(function(resolve, reject){
						$p.load_script(path, "script", resolve);
					});
				else
					return Promise.resolve();
			});
		}else
			paths = [];

		return Promise.all(paths)
			.then(function () {
				this.execute(data);
			}.bind(this));
	};

};




$p.eve.__define({

	set_offline: {
		value: function(offline){
			var current_offline = $p.job_prm['offline'];
			$p.job_prm['offline'] = !!(offline || $p.wsql.get_user_param('offline', 'boolean'));
			if(current_offline != $p.job_prm['offline']){
				current_offline = $p.job_prm['offline'];

			}
		}
	},

	on_rotate: {
		value: function (e) {
			$p.job_prm.device_orient = (window.orientation == 0 || window.orientation == 180 ? "portrait":"landscape");
			if (typeof(e) != "undefined")
				$p.eve.callEvent("onOrientationChange", [$p.job_prm.device_orient]);


		}
	},

	steps: {
		value: {
			load_meta: 0,           
			authorization: 1,       
			create_managers: 2,     
			process_access:  3,     
			load_data_files: 4,     
			load_data_db: 5,        
			load_data_wsql: 6,      
			save_data_wsql: 7       
		}
	},

	log_in: {
		value: function(onstep){

			var irest_attr = {},
				mdd;

			onstep($p.eve.steps.load_meta);

			$p.ajax.default_attr(irest_attr, $p.job_prm.irest_url());

			return ($p.job_prm.offline ? Promise.resolve({responseURL: "", response: ""}) : $p.ajax.get_ex(irest_attr.url, irest_attr))

				.then(function (req) {
					if(!$p.job_prm.offline)
						$p.job_prm.irest_enabled = true;
					if(req.response[0] == "{")
						return JSON.parse(req.response);
				})

				.catch(function () {
				})

				.then(function (res) {


					onstep($p.eve.steps.authorization);

					mdd = res;
					mdd.root = true;

					if($p.job_prm.offline || $p.job_prm.irest_enabled)
						return mdd;

					else
						return $p.ajax.get_ex($p.job_prm.rest_url()+"?$format=json", true)
							.then(function () {
								return mdd;
							});
				})

				.catch(function (err) {

					if($p.iface.auth.onerror)
						$p.iface.auth.onerror(err);

					throw err;
				})

				.then(function (res) {

					onstep($p.eve.steps.load_data_files);

					if($p.job_prm.offline)
						return res;

					$p.eve.callEvent("user_log_in", [$p.ajax.authorized = true]);

					if(typeof res == "string")
						res = JSON.parse(res);

					if($p.msg.check_soap_result(res))
						return;

					if($p.wsql.get_user_param("enable_save_pwd"))
						$p.wsql.set_user_param("user_pwd", $p.ajax.password);

					else if($p.wsql.get_user_param("user_pwd"))
						$p.wsql.set_user_param("user_pwd", "");

					if(res.now_1c && res.now_js)
						$p.wsql.set_user_param("time_diff", res.now_1c - res.now_js);

				})

				.then(function () {
					_md.printing_plates(mdd.printing_plates);
				});
		}
	}

});


(function(w, eve, msg){

	var timer_setted = false,
		cache;

	w.addEventListener('online', eve.set_offline);
	w.addEventListener('offline', function(){eve.set_offline(true);});

	w.addEventListener('load', function(){

		setTimeout(function () {

			function navigate(url){
				if(url && (location.origin + location.pathname).indexOf(url)==-1)
					location.replace(url);
			}

			function init_params(){

				function load_css(){

					var surl = dhtmlx.codebase, load_dhtmlx = true, load_meta = true;
					if(surl.indexOf("cdn.jsdelivr.net")!=-1)
						surl = "//cdn.jsdelivr.net/metadata/latest/";

					for(var i=0; i < document.styleSheets.length; i++){
						if(document.styleSheets[i].href){
							if(document.styleSheets[i].href.indexOf("dhx_web")!=-1 || document.styleSheets[i].href.indexOf("dhx_terrace")!=-1)
								load_dhtmlx = false;
							if(document.styleSheets[i].href.indexOf("metadata.css")!=-1)
								load_meta = false;
						}
					}

					dhtmlx.skin = $p.wsql.get_user_param("skin") || $p.job_prm.skin || "dhx_web";

					if(load_dhtmlx)
						$p.load_script(surl + (dhtmlx.skin == "dhx_web" ? "dhx_web.css" : "dhx_terrace.css"), "link");
					if(load_meta)
						$p.load_script(surl + "metadata.css", "link");

					if($p.job_prm.additional_css)
						$p.job_prm.additional_css.forEach(function (name) {
							if(dhx4.isIE || name.indexOf("ie_only") == -1)
								$p.load_script(name, "link");
						});

					dhtmlx.image_path = "//oknosoft.github.io/metadata.js/lib/imgs/";

					dhtmlx.skin_suffix = function () {
						return dhtmlx.skin.replace("dhx", "") + "/"
					};

					dhx4.ajax.cache = true;

					$p.iface.__define("w", {
						value: new dhtmlXWindows(),
						enumerable: false
					});
					$p.iface.w.setSkin(dhtmlx.skin);

					$p.iface.__define("popup", {
						value: new dhtmlXPopup(),
						enumerable: false
					});

				}

				function load_data() {
					$p.wsql.pouch.load_data()
						.catch($p.record_log);

					if(document.querySelector("#splash")){
						document.querySelector("#splash").parentNode.removeChild(splash);
					}

					eve.callEvent("iface_init", [$p]);
				}

				$p.wsql.init_params();

				if("dhtmlx" in w)
					load_css();

				if(typeof(w.orientation)=="undefined"){
					$p.job_prm.device_orient = w.innerWidth>w.innerHeight ? "landscape" : "portrait";
				}
				else{
					eve.on_rotate();
				}
				w.addEventListener("orientationchange", eve.on_rotate, false);

				eve.stepper = {
					step: 0,
					count_all: 0,
					step_size: 57,
					files: 0,
          ram: {},
          doc: {},
				};

				eve.set_offline(!navigator.onLine);

				if($p.wsql.get_user_param("couch_direct")){

					var on_user_log_in = eve.attachEvent("user_log_in", function () {
						eve.detachEvent(on_user_log_in);
						load_data();
					});

					if($p.wsql.get_user_param("zone") == $p.job_prm.zone_demo &&
							!$p.wsql.get_user_param("user_name") && $p.job_prm.guests.length){
						$p.wsql.set_user_param("enable_save_pwd", true);
						$p.wsql.set_user_param("user_name", $p.job_prm.guests[0].username);
						$p.wsql.set_user_param("user_pwd", $p.job_prm.guests[0].password);
					}

					setTimeout(function () {
						$p.iface.frm_auth({
							modal_dialog: true,
							try_auto: false
						});
					}, 100);
				}
				else{
					setTimeout(load_data, 20);
				}

				if (cache = w.applicationCache){

					cache.addEventListener('noupdate', function(e){

					}, false);

					cache.addEventListener('cached', function(e){
						timer_setted = true;
						if($p.iface.appcache)
							$p.iface.appcache.close();
					}, false);



					cache.addEventListener('updateready', function(e) {
						try{
							cache.swapCache();
						}catch(e){}
						$p.iface.do_reload();
					}, false);

					cache.addEventListener('error', $p.record_log, false);
				}
			}

			if(!w.JSON || !w.indexedDB){
				eve.redirect = true;
				msg.show_msg({type: "alert-error", text: msg.unsupported_browser, title: msg.unsupported_browser_title});
				throw msg.unsupported_browser;
			}

			$p.__define("job_prm", {
				value: new JobPrm(),
				writable: false
			});

			if($p.job_prm.use_ip_geo || $p.job_prm.use_google_geo){

				$p.ipinfo = new IPInfo();

			}
			if ($p.job_prm.use_google_geo) {

				if(!window.google || !window.google.maps){
					$p.on("iface_init", function () {
						setTimeout(function(){
							$p.load_script("https://maps.google.com/maps/api/js?key=" + $p.job_prm.use_google_geo + "&callback=$p.ipinfo.location_callback", "script", function(){});
						}, 100);
					});
				}
				else{
          $p.ipinfo.location_callback();
        }
			}

			if($p.job_prm.allow_post_message){
				w.addEventListener("message", function(event) {

					if($p.job_prm.allow_post_message == "*" || $p.job_prm.allow_post_message == event.origin){

						if(typeof event.data == "string"){
							try{
								var res = eval(event.data);
								if(res && event.source){
									if(typeof res == "object")
										res = JSON.stringify(res);
									else if(typeof res == "function")
										return;
									event.source.postMessage(res, "*");
								}
							}catch(e){
								$p.record_log(e);
							}
						}
					}
				});
			}

			$p.job_prm.__define("device_type", {
				get: function () {
					var device_type = $p.wsql.get_user_param("device_type");
					if(!device_type){
						device_type = (function(i){return (i<800?"phone":(i<1024?"tablet":"desktop"));})(Math.max(screen.width, screen.height));
						$p.wsql.set_user_param("device_type", device_type);
					}
					return device_type;
				},
				set: function (v) {
					$p.wsql.set_user_param("device_type", v);
				}
			});

			document.body.addEventListener("keydown", function (ev) {
				eve.callEvent("keydown", [ev]);
			}, false);

			setTimeout(init_params, 10);

		}, 10);

	}, false);

	w.onbeforeunload = function(){
		if(!eve.redirect)
			return msg.onbeforeunload;
	};

	w.addEventListener("popstat", $p.iface.hash_route);

	w.addEventListener("hashchange", $p.iface.hash_route);

})(window, $p.eve, $p.msg);


function IPInfo(){

	var _yageocoder,
		_ggeocoder,
		_ipgeo,
		_addr = "",
		_parts;

	function YaGeocoder(){

		this.geocode = function (attr) {

			return Promise.resolve(false);
		}
	}



	this.__define({

		ipgeo: {
			value: function () {
				return $p.ajax.get("//api.sypexgeo.net/")
					.then(function (req) {
						return JSON.parse(req.response);
					})
					.catch($p.record_log);
			}
		},

		yageocoder: {
			get : function(){

				if(!_yageocoder)
					_yageocoder = new YaGeocoder();
				return _yageocoder;
			},
			enumerable : false,
			configurable : false
		},

		ggeocoder: {
			get : function(){
				return _ggeocoder;
			},
			enumerable : false,
			configurable : false
		},

		addr: {
			get : function(){
				return _addr;
			}
		},

		parts: {
			get : function(){
				return _parts;
			}
		},

		components: {
			value : function(v, components){
				var i, c, j, street = "", street0 = "", locality = "";
				for(i in components){
					c = components[i];
					for(j in c.types){
						switch(c.types[j]){
							case "route":
								if(c.short_name.indexOf("Unnamed")==-1){
									street = c.short_name + (street ? (" " + street) : "");
									street0 = c.long_name.replace("улица", "").trim();
								}
								break;
							case "administrative_area_level_1":
								v.region = c.long_name;
								break;
							case "administrative_area_level_2":
								v.city = c.short_name;
								v.city_long = c.long_name;
								break;
							case "locality":
								locality = (locality ? (locality + " ") : "") + c.short_name;
								break;
							case "street_number":
                v.house = "дом " + c.short_name;
								break;
							case "postal_code":
								v.postal_code = c.short_name;
								break;
							default:
								break;
						}
					}
				}
				if(v.region && v.region == v.city_long)
					if(v.city.indexOf(locality) == -1)
						v.city = locality;
					else
						v.city = "";
				else if(locality){
					if(v.city.indexOf(locality) == -1 && v.region.indexOf(locality) == -1)
						street = locality + ", " + street;
				}

				if(!v.street || v.street.indexOf(street0)==-1)
					v.street = street;

				return v;
			}
		},

		location_callback: {
			value: function(){

				_ggeocoder = new google.maps.Geocoder();

				$p.eve.callEvent("geo_google_ready");

				if(navigator.geolocation)
					navigator.geolocation.getCurrentPosition(function(position){

						$p.ipinfo.latitude = position.coords.latitude;

						$p.ipinfo.longitude = position.coords.longitude;

						var latlng = new google.maps.LatLng($p.ipinfo.latitude, $p.ipinfo.longitude);

						_ggeocoder.geocode({'latLng': latlng}, function(results, status) {
							if (status == google.maps.GeocoderStatus.OK){
								if(!results[1] || results[0].address_components.length >= results[1].address_components.length)
									_parts = results[0];
								else
									_parts = results[1];
								_addr = _parts.formatted_address;

								$p.eve.callEvent("geo_current_position", [$p.ipinfo.components({}, _parts.address_components)]);
							}
						});

					}, $p.record_log, {
						timeout: 30000
					}
				);
			}
		}
	});

}


function SpreadsheetDocument(attr, events) {

	this._attr = {
		orientation: "portrait",
		title: "",
		content: document.createElement("DIV")
	};

	if(attr && typeof attr == "string"){
		this.content = attr;
	}
	else if(typeof attr == "object"){
		this._mixin(attr);
	}
	attr = null;

  this._events = {

    fill_template: null,

  };
  if(events && typeof events == "object"){
    this._events._mixin(events);
  }
}
SpreadsheetDocument.prototype.__define({

	clear: {
		value: function () {
			while (this._attr.content.firstChild) {
				this._attr.content.removeChild(this._attr.content.firstChild);
			}
		}
	},

	put: {
		value: function (range, attr) {

			var elm;

			if(range instanceof HTMLElement){
				elm = document.createElement(range.tagName);
				elm.innerHTML = range.innerHTML;
				if(!attr)
					attr = range.attributes;
			}else{
				elm = document.createElement("DIV");
				elm.innerHTML = range;
			}

			if(attr){
				Object.keys(attr).forEach(function (key) {
					if(key == "id" || attr[key].name == "id")
						return;
					elm.setAttribute(attr[key].name || key, attr[key].value || attr[key]);
				});
			}

			this._attr.content.appendChild(elm);
		}
	},

  append: {
    value: function (template, data) {

      if(this._events.fill_template){
        data = this._events.fill_template(template, data);
      }

      switch (template.attributes.kind && template.attributes.kind.value){

        case 'row':
          this.draw_rows(template, data);
          break;

        case 'table':
          this.draw_table(template, data);
          break;

        default:
          this.put(dhx4.template(template.innerHTML, data), template.attributes);
          break;
      }
    }
  },

  draw_table: {
    value: function (template, data) {

      var tabular = template.attributes.tabular && template.attributes.tabular.value;
      if(!tabular){
        console.error('Не указана табличная часть в шаблоне ' + template.id);
        return;
      }
      var rows = data[tabular];
      if(!Array.isArray(rows)){
        console.error('В данных отсутствует массив ' + tabular);
        return;
      }

      var cont = document.createElement("div");

      cont.innerHTML = template.innerHTML;

      var table = cont.querySelector("table");

      var tpl_row = table.querySelector("[name=row]");

      if(tpl_row){
        tpl_row.parentElement.removeChild(tpl_row);
      }
      else{
        console.error('Отсутствует <TR name="row"> в шаблоне таблицы');
        return;
      }

      var tpl_grouping = table.querySelector("tbody").querySelectorAll("tr");

      tpl_grouping.forEach(function (elm) {
        elm.parentElement.removeChild(elm);
      });


      var tfoot = table.querySelector("tfoot");
      if(tfoot){
        tfoot.parentElement.removeChild(tfoot);
        tfoot.innerHTML = dhx4.template(tfoot.innerHTML, data);
        table.appendChild(tfoot);
      }


      function put_rows(rows) {
        rows.forEach(function(row) {
          var table_row = document.createElement("TR");
          table_row.innerHTML = dhx4.template(tpl_row.innerHTML, row);
          table.appendChild(table_row);
        });
      }

      var grouping = data._grouping && data._grouping.find_rows({use: true, parent: tabular});
      if(grouping && grouping.length == 1 && tpl_grouping.length){

        var gfield = grouping[0].field;

        $p.wsql.alasql("select distinct `"+gfield+"` from ? order by `"+gfield+"`", [rows])
          .forEach(function (group) {
            var table_row = document.createElement("TR");
            table_row.innerHTML = dhx4.template(tpl_grouping[0].innerHTML, group);
            table.appendChild(table_row);
            put_rows(rows.filter(function (row) {
              return row[gfield] == group[gfield];
            }));
          })
      }
      else{
        put_rows(rows);
      }

      this.put(cont.innerHTML, cont.attributes);
    }
  },

  draw_rows: {
    value: function (template, data) {

      var tabular = template.attributes.tabular && template.attributes.tabular.value;
      if(!tabular){
        console.error('Не указана табличная часть в шаблоне ' + template.id);
        return;
      }
      var rows = data[tabular];
      if(!Array.isArray(rows)){
        console.error('В данных отсутствует массив ' + tabular);
        return;
      }

      for(var i = 0; i < rows.length; i++){
        this.put(dhx4.template(template.innerHTML.replace(/<!---/g, '').replace(/--->/g, ''), rows[i]), template.attributes);
      }
    }
  },

  print: {
    value: function () {

      try{

        if(!($p.injected_data['view_blank.html'] instanceof Blob)){
          $p.injected_data['view_blank.html'] = new Blob([$p.injected_data['view_blank.html']], {type: 'text/html'});
        }

        var doc = this,
          url = window.URL.createObjectURL($p.injected_data['view_blank.html']),
          wnd_print = window.open(
          url, "wnd_print", "fullscreen,menubar=no,toolbar=no,location=no,status=no,directories=no,resizable=yes,scrollbars=yes");

        if (wnd_print.outerWidth < screen.availWidth || wnd_print.outerHeight < screen.availHeight){
          wnd_print.moveTo(0,0);
          wnd_print.resizeTo(screen.availWidth, screen.availHeight);
        }

        wnd_print.onload = function(e) {
          window.URL.revokeObjectURL(url);
          wnd_print.document.body.appendChild(doc.content);
          if(doc.title){
            wnd_print.document.title = doc.title;
          }
          wnd_print.print();
          doc = null;
        };

        return wnd_print;
      }
      catch(err){
        window.URL.revokeObjectURL && window.URL.revokeObjectURL(url);
        $p.msg.show_msg({
          title: $p.msg.bld_title,
          type: "alert-error",
          text: err.message.match("outerWidth") ?
            "Ошибка открытия окна печати<br />Вероятно, в браузере заблокированы всплывающие окна" : err.message
        });
      }
    }
  },

	content: {
		get: function () {
			return this._attr.content
		},
		set: function (v) {

			this.clear();

			if(typeof v == "string")
				this._attr.content.innerHTML = v;

			else if(v instanceof HTMLElement)
				this._attr.content.innerHTML = v.innerHTML;

		}
	},

	title: {
		get: function () {
			return this._attr.title
		},
		set: function (v) {

			this._attr.title = v;

		}
	}

});

$p.SpreadsheetDocument = SpreadsheetDocument;


function HandsontableDocument(container, attr) {

	var init = function () {

		if(this._then)
			this._then(this);

	}.bind(this);

	this._online = (attr && attr.allow_offline) || (navigator.onLine && $p.wsql.pouch.authorized);

	if(container instanceof dhtmlXCellObject){
		this._cont = document.createElement('div');
		container.detachObject(true);
		container.attachObject(this._cont);
	}else{
		this._cont = container;
	}

	this._cont.classList.add("handsontable_wrapper");
	if(!this._online){
		this._cont.innerHTML = $p.msg.report_need_online;
	}else{
		this._cont.innerHTML = attr.autorun ? $p.msg.report_prepare : $p.msg.report_need_prepare;
	}

	this.then = function (callback) {
		this._then = callback;
		return this;
	};

	this.requery = function (opt) {

		if(this.hot)
			this.hot.destroy();

		if(opt instanceof Error){
			this._cont.innerHTML = $p.msg.report_error + (opt.name ? " <b>" + opt.name + "</b>" : "") + (opt.message ? " " + opt.message : "");
		}else{
			this._cont.innerHTML = "";
			this.hot = new Handsontable(this._cont, opt);
		}
	};


	if(typeof Handsontable != "function" && this._online){

		$p.load_script("https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.4.0/pikaday.min.js","script")
			.then(function () {
				return $p.load_script("https://cdnjs.cloudflare.com/ajax/libs/numbro/1.9.2/numbro.min.js","script")
			})
			.then(function () {
				return $p.load_script("https://cdn.jsdelivr.net/g/zeroclipboard,handsontable@0.26(handsontable.min.js)","script")
			})
			.then(function () {
				return Promise.all([
					$p.load_script("https://cdn.jsdelivr.net/handsontable/0.26/handsontable.min.css","link"),
					$p.load_script("https://cdnjs.cloudflare.com/ajax/libs/numbro/1.9.2/languages/ru-RU.min.js","script")
				]);
			})
			.then(init);

	}else{
		setTimeout(init);
	}

}

$p.HandsontableDocument = HandsontableDocument;
$p.injected_data._mixin({"form_auth.xml":"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<items>\n\t<item type=\"settings\" position=\"label-left\" labelWidth=\"80\" inputWidth=\"180\" noteWidth=\"180\"/>\n\t<item type=\"fieldset\" name=\"data\" inputWidth=\"auto\" label=\"Авторизация\">\n\n        <item type=\"radio\" name=\"type\" labelWidth=\"auto\" position=\"label-right\" checked=\"true\" value=\"guest\" label=\"Гостевой (демо) режим\">\n            <item type=\"select\" name=\"guest\" label=\"Роль\">\n                <option value=\"Дилер\" label=\"Дилер\"/>\n            </item>\n        </item>\n\n\t\t<item type=\"radio\" name=\"type\" labelWidth=\"auto\" position=\"label-right\" value=\"auth\" label=\"Есть учетная запись\">\n\t\t\t<item type=\"input\" value=\"\" name=\"login\" label=\"Логин\" validate=\"NotEmpty\" />\n\t\t\t<item type=\"password\" value=\"\" name=\"password\" label=\"Пароль\" validate=\"NotEmpty\" />\n\t\t</item>\n\n\t\t<item type=\"button\" value=\"Войти\" name=\"submit\"/>\n\n        <item type=\"template\" name=\"text_options\" className=\"order_dealer_options\" inputWidth=\"170\"\n              value=\"&lt;a href='#' onclick='$p.iface.open_settings();' title='Страница настроек программы' &gt; &lt;i class='fa fa-cog fa-lg'&gt;&lt;/i&gt; Настройки &lt;/a&gt; &lt;a href='//www.oknosoft.ru/feedback' target='_blank' style='margin-left: 9px;' title='Задать вопрос через форму обратной связи' &gt; &lt;i class='fa fa-question-circle fa-lg'&gt;&lt;/i&gt; Вопрос &lt;/a&gt;\"  />\n\n\t</item>\n</items>","toolbar_add_del.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\n<toolbar>\n    <item id=\"sep0\" type=\"separator\"/>\n    <item id=\"btn_add\" type=\"button\"  text=\"&lt;i class='fa fa-plus-circle fa-fw'&gt;&lt;/i&gt; Добавить\" title=\"Добавить строку\"  />\n    <item id=\"btn_delete\" type=\"button\" text=\"&lt;i class='fa fa-times fa-fw'&gt;&lt;/i&gt; Удалить\"  title=\"Удалить строку\" />\n    <item id=\"sep1\" type=\"separator\"/>\n\n    <item id=\"sp\" type=\"spacer\"/>\n    <item id=\"input_filter\" type=\"buttonInput\" width=\"200\" title=\"Поиск по подстроке\" />\n</toolbar>","toolbar_add_del_compact.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\n<toolbar>\n    <item id=\"btn_add\" type=\"button\"  text=\"&lt;i class='fa fa-plus-circle fa-fw'&gt;&lt;/i&gt;\" title=\"Добавить строку\"  />\n    <item id=\"btn_delete\" type=\"button\" text=\"&lt;i class='fa fa-times fa-fw'&gt;&lt;/i&gt;\"  title=\"Удалить строку\" />\n    <item id=\"sep1\" type=\"separator\"/>\n\n</toolbar>","toolbar_obj.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item id=\"sep0\" type=\"separator\"/>\r\n    <item type=\"button\" id=\"btn_save_close\" text=\"&lt;b&gt;Записать и закрыть&lt;/b&gt;\" title=\"Рассчитать, записать и закрыть\" />\r\n    <item type=\"button\" id=\"btn_save\" text=\"&lt;i class='fa fa-floppy-o fa-fw'&gt;&lt;/i&gt;\" title=\"Рассчитать и записать данные\"/>\r\n    <item type=\"button\" id=\"btn_post\" enabled=\"false\" text=\"&lt;i class='fa fa-check-square-o fa-fw'&gt;&lt;/i&gt;\" title=\"Провести документ\" />\r\n    <item type=\"button\" id=\"btn_unpost\" enabled=\"false\" text=\"&lt;i class='fa fa-square-o fa-fw'&gt;&lt;/i&gt;\" title=\"Отмена проведения\" />\r\n\r\n    <item type=\"button\" id=\"btn_files\" text=\"&lt;i class='fa fa-paperclip fa-fw'&gt;&lt;/i&gt;\" title=\"Присоединенные файлы\"/>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_print\" text=\"&lt;i class='fa fa-print fa-fw'&gt;&lt;/i&gt;\" title=\"Печать\" openAll=\"true\">\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_create_by_virtue\" text=\"&lt;i class='fa fa-bolt fa-fw'&gt;&lt;/i&gt;\" title=\"Создать на основании\" openAll=\"true\" >\r\n        <item type=\"button\" id=\"btn_message\" enabled=\"false\" text=\"Сообщение\" />\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_go_to\" text=\"&lt;i class='fa fa-external-link fa-fw'&gt;&lt;/i&gt;\" title=\"Перейти\" openAll=\"true\" >\r\n        <item type=\"button\" id=\"btn_go_connection\" enabled=\"false\" text=\"Связи\" />\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\"   id=\"bs_more\"  text=\"&lt;i class='fa fa-th-large fa-fw'&gt;&lt;/i&gt;\"  title=\"Дополнительно\" openAll=\"true\">\r\n\r\n        <item type=\"button\" id=\"btn_import\" text=\"&lt;i class='fa fa-upload fa-fw'&gt;&lt;/i&gt; Загрузить из файла\" />\r\n        <item type=\"button\" id=\"btn_export\" text=\"&lt;i class='fa fa-download fa-fw'&gt;&lt;/i&gt; Выгрузить в файл\" />\r\n    </item>\r\n\r\n    <item id=\"sep1\" type=\"separator\"/>\r\n    <item type=\"button\" id=\"btn_close\" text=\"&lt;i class='fa fa-times fa-fw'&gt;&lt;/i&gt;\" title=\"Закрыть форму\"/>\r\n    <item id=\"sep2\" type=\"separator\"/>\r\n\r\n</toolbar>\r\n","toolbar_ok_cancel.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item id=\"btn_ok\"       type=\"button\"   img=\"\"  imgdis=\"\"   text=\"&lt;b&gt;Ок&lt;/b&gt;\"  />\r\n    <item id=\"btn_cancel\"   type=\"button\"\timg=\"\"  imgdis=\"\"   text=\"Отмена\" />\r\n</toolbar>","toolbar_rep.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n    <item id=\"sep0\" type=\"separator\"/>\r\n    <item type=\"button\" id=\"btn_run\" text=\"&lt;i class='fa fa-play fa-fw'&gt;&lt;/i&gt; Сформировать\" title=\"Сформировать отчет\"/>\r\n\r\n    <item type=\"buttonSelect\"   id=\"bs_more\"  text=\"&lt;i class='fa fa-th-large fa-fw'&gt;&lt;/i&gt;\"  title=\"Дополнительно\" openAll=\"true\">\r\n\r\n        <item type=\"button\" id=\"btn_print\" text=\"&lt;i class='fa fa-print fa-fw'&gt;&lt;/i&gt; Печать\" />\r\n\r\n        <item id=\"sep3\" type=\"separator\"/>\r\n\r\n        <item type=\"button\" id=\"btn_export\" text=\"&lt;i class='fa fa-file-excel-o fa-fw'&gt;&lt;/i&gt; Выгрузить в файл\" />\r\n\r\n        <item id=\"sep4\" type=\"separator\"/>\r\n\r\n        <item type=\"button\" id=\"btn_save\" text=\"&lt;i class='fa fa-folder-open-o fa-fw'&gt;&lt;/i&gt; Выбрать вариант\" />\r\n        <item type=\"button\" id=\"btn_load\" text=\"&lt;i class='fa fa-floppy-o fa-fw'&gt;&lt;/i&gt; Сохранить вариант\" />\r\n\r\n    </item>\r\n\r\n    <item id=\"sep1\" type=\"separator\"/>\r\n\r\n</toolbar>\r\n","toolbar_selection.xml":"<?xml version=\"1.0\" encoding='utf-8'?>\r\n<toolbar>\r\n\r\n    <item id=\"sep0\" type=\"separator\"/>\r\n\r\n    <item id=\"btn_select\"   type=\"button\"   title=\"Выбрать элемент списка\" text=\"&lt;b&gt;Выбрать&lt;/b&gt;\"  />\r\n\r\n    <item id=\"sep1\" type=\"separator\"/>\r\n    <item id=\"btn_new\"      type=\"button\"\ttext=\"&lt;i class='fa fa-plus-circle fa-fw'&gt;&lt;/i&gt;\"\ttitle=\"Создать\" />\r\n    <item id=\"btn_edit\"     type=\"button\"\ttext=\"&lt;i class='fa fa-pencil fa-fw'&gt;&lt;/i&gt;\"\ttitle=\"Изменить\" />\r\n    <item id=\"btn_delete\"   type=\"button\"\ttext=\"&lt;i class='fa fa-times fa-fw'&gt;&lt;/i&gt;\"\ttitle=\"Удалить\" />\r\n    <item id=\"sep2\" type=\"separator\"/>\r\n\r\n    <item type=\"buttonSelect\" id=\"bs_print\" text=\"&lt;i class='fa fa-print fa-fw'&gt;&lt;/i&gt; Печать\" openAll=\"true\" >\r\n    </item>\r\n\r\n    <item type=\"buttonSelect\"   id=\"bs_more\"    text=\"&lt;i class='fa fa-th-large fa-fw'&gt;&lt;/i&gt;\" title=\"Дополнительно\" openAll=\"true\">\r\n        <item id=\"btn_requery\"  type=\"button\"\ttext=\"&lt;i class='fa fa-refresh fa-fw'&gt;&lt;/i&gt; Обновить список\" />\r\n    </item>\r\n\r\n    <item id=\"sep3\" type=\"separator\"/>\r\n\r\n</toolbar>"});



var xmlToJSON = (function () {

	this.version = "1.3";

	var options = { 
		mergeCDATA: true, 
		grokAttr: true, 
		grokText: true, 
		normalize: true, 
		xmlns: true, 
		namespaceKey: '_ns', 
		textKey: '_text', 
		valueKey: '_value', 
		attrKey: '_attr', 
		cdataKey: '_cdata', 
		attrsAsObject: true, 
		stripAttrPrefix: true, 
		stripElemPrefix: true, 
		childrenAsArray: true 
	};

	var prefixMatch = new RegExp(/(?!xmlns)^.*:/);
	var trimMatch = new RegExp(/^\s+|\s+$/g);

	this.grokType = function (sValue) {
		if (/^\s*$/.test(sValue)) {
			return null;
		}
		if (/^(?:true|false)$/i.test(sValue)) {
			return sValue.toLowerCase() === "true";
		}
		if (isFinite(sValue)) {
			return parseFloat(sValue);
		}
		return sValue;
	};

	this.parseString = function (xmlString, opt) {
		return this.parseXML(this.stringToXML(xmlString), opt);
	}

	this.parseXML = function (oXMLParent, opt) {

		for (var key in opt) {
			options[key] = opt[key];
		}

		var vResult = {},
			nLength = 0,
			sCollectedTxt = "";

		if (options.xmlns && oXMLParent.namespaceURI) {
			vResult[options.namespaceKey] = oXMLParent.namespaceURI;
		}

		if (oXMLParent.attributes && oXMLParent.attributes.length > 0) {
			var vAttribs = {};

			for (nLength; nLength < oXMLParent.attributes.length; nLength++) {
				var oAttrib = oXMLParent.attributes.item(nLength);
				vContent = {};
				var attribName = '';

				if (options.stripAttrPrefix) {
					attribName = oAttrib.name.replace(prefixMatch, '');

				} else {
					attribName = oAttrib.name;
				}

				if (options.grokAttr) {
					vContent[options.valueKey] = this.grokType(oAttrib.value.replace(trimMatch, ''));
				} else {
					vContent[options.valueKey] = oAttrib.value.replace(trimMatch, '');
				}

				if (options.xmlns && oAttrib.namespaceURI) {
					vContent[options.namespaceKey] = oAttrib.namespaceURI;
				}

				if (options.attrsAsObject) { 
					vAttribs[attribName] = vContent;
				} else {
					vResult[options.attrKey + attribName] = vContent;
				}
			}

			if (options.attrsAsObject) {
				vResult[options.attrKey] = vAttribs;
			} else {}
		}

		if (oXMLParent.hasChildNodes()) {
			for (var oNode, sProp, vContent, nItem = 0; nItem < oXMLParent.childNodes.length; nItem++) {
				oNode = oXMLParent.childNodes.item(nItem);

				if (oNode.nodeType === 4) {
					if (options.mergeCDATA) {
						sCollectedTxt += oNode.nodeValue;
					} else {
						if (vResult.hasOwnProperty(options.cdataKey)) {
							if (vResult[options.cdataKey].constructor !== Array) {
								vResult[options.cdataKey] = [vResult[options.cdataKey]];
							}
							vResult[options.cdataKey].push(oNode.nodeValue);

						} else {
							if (options.childrenAsArray) {
								vResult[options.cdataKey] = [];
								vResult[options.cdataKey].push(oNode.nodeValue);
							} else {
								vResult[options.cdataKey] = oNode.nodeValue;
							}
						}
					}
				} 
				else if (oNode.nodeType === 3) {
					sCollectedTxt += oNode.nodeValue;
				} 
				else if (oNode.nodeType === 1) { 

					if (nLength === 0) {
						vResult = {};
					}

					if (options.stripElemPrefix) {
						sProp = oNode.nodeName.replace(prefixMatch, '');
					} else {
						sProp = oNode.nodeName;
					}

					vContent = xmlToJSON.parseXML(oNode);

					if (vResult.hasOwnProperty(sProp)) {
						if (vResult[sProp].constructor !== Array) {
							vResult[sProp] = [vResult[sProp]];
						}
						vResult[sProp].push(vContent);

					} else {
						if (options.childrenAsArray) {
							vResult[sProp] = [];
							vResult[sProp].push(vContent);
						} else {
							vResult[sProp] = vContent;
						}
						nLength++;
					}
				}
			}
		} else if (!sCollectedTxt) { 
			if (options.childrenAsArray) {
				vResult[options.textKey] = [];
				vResult[options.textKey].push(null);
			} else {
				vResult[options.textKey] = null;
			}
		}

		if (sCollectedTxt) {
			if (options.grokText) {
				var value = this.grokType(sCollectedTxt.replace(trimMatch, ''));
				if (value !== null && value !== undefined) {
					vResult[options.textKey] = value;
				}
			} else if (options.normalize) {
				vResult[options.textKey] = sCollectedTxt.replace(trimMatch, '').replace(/\s+/g, " ");
			} else {
				vResult[options.textKey] = sCollectedTxt.replace(trimMatch, '');
			}
		}

		return vResult;
	}


	this.xmlToString = function (xmlDoc) {
		try {
			var xmlString = xmlDoc.xml ? xmlDoc.xml : (new XMLSerializer()).serializeToString(xmlDoc);
			return xmlString;
		} catch (err) {
			return null;
		}
	}

	this.stringToXML = function (xmlString) {
		try {
			var xmlDoc = null;

			if (window.DOMParser) {

				var parser = new DOMParser();
				xmlDoc = parser.parseFromString(xmlString, "text/xml");

				return xmlDoc;
			} else {
				xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = false;
				xmlDoc.loadXML(xmlString);

				return xmlDoc;
			}
		} catch (e) {
			return null;
		}
	}

	return this;
})();

if (typeof module != "undefined" && module !== null && module.exports) module.exports = xmlToJSON;
else if (typeof define === "function" && define.amd) define(function() {return xmlToJSON});


/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement)
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		, arbitrary_revoke_timeout = 1000 * 40 
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { 
					get_URL().revokeObjectURL(file);
				} else { 
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; 
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
  define([], function() {
    return saveAs;
  });
}






function Aes(default_key) {

	'use strict';


	var Aes = this;



	Aes.cipher = function(input, w) {
		var Nb = 4;               
		var Nr = w.length/Nb - 1; 

		var state = [[],[],[],[]];  
		for (var i=0; i<4*Nb; i++) state[i%4][Math.floor(i/4)] = input[i];

		state = Aes.addRoundKey(state, w, 0, Nb);

		for (var round=1; round<Nr; round++) {
			state = Aes.subBytes(state, Nb);
			state = Aes.shiftRows(state, Nb);
			state = Aes.mixColumns(state, Nb);
			state = Aes.addRoundKey(state, w, round, Nb);
		}

		state = Aes.subBytes(state, Nb);
		state = Aes.shiftRows(state, Nb);
		state = Aes.addRoundKey(state, w, Nr, Nb);

		var output = new Array(4*Nb);  
		for (var i=0; i<4*Nb; i++) output[i] = state[i%4][Math.floor(i/4)];

		return output;
	};



	Aes.keyExpansion = function(key) {
		var Nb = 4;            
		var Nk = key.length/4; 
		var Nr = Nk + 6;       

		var w = new Array(Nb*(Nr+1));
		var temp = new Array(4);

		for (var i=0; i<Nk; i++) {
			var r = [key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]];
			w[i] = r;
		}

		for (var i=Nk; i<(Nb*(Nr+1)); i++) {
			w[i] = new Array(4);
			for (var t=0; t<4; t++) temp[t] = w[i-1][t];
			if (i % Nk == 0) {
				temp = Aes.subWord(Aes.rotWord(temp));
				for (var t=0; t<4; t++) temp[t] ^= Aes.rCon[i/Nk][t];
			}
			else if (Nk > 6 && i%Nk == 4) {
				temp = Aes.subWord(temp);
			}
			for (var t=0; t<4; t++) w[i][t] = w[i-Nk][t] ^ temp[t];
		}

		return w;
	};



	Aes.subBytes = function(s, Nb) {
		for (var r=0; r<4; r++) {
			for (var c=0; c<Nb; c++) s[r][c] = Aes.sBox[s[r][c]];
		}
		return s;
	};



	Aes.shiftRows = function(s, Nb) {
		var t = new Array(4);
		for (var r=1; r<4; r++) {
			for (var c=0; c<4; c++) t[c] = s[r][(c+r)%Nb];  
			for (var c=0; c<4; c++) s[r][c] = t[c];         
		}          
		return s;  
	};



	Aes.mixColumns = function(s, Nb) {
		for (var c=0; c<4; c++) {
			var a = new Array(4);  
			var b = new Array(4);  
			for (var i=0; i<4; i++) {
				a[i] = s[i][c];
				b[i] = s[i][c]&0x80 ? s[i][c]<<1 ^ 0x011b : s[i][c]<<1;
			}
			s[0][c] = b[0] ^ a[1] ^ b[1] ^ a[2] ^ a[3]; 
			s[1][c] = a[0] ^ b[1] ^ a[2] ^ b[2] ^ a[3]; 
			s[2][c] = a[0] ^ a[1] ^ b[2] ^ a[3] ^ b[3]; 
			s[3][c] = a[0] ^ b[0] ^ a[1] ^ a[2] ^ b[3]; 
		}
		return s;
	};



	Aes.addRoundKey = function(state, w, rnd, Nb) {
		for (var r=0; r<4; r++) {
			for (var c=0; c<Nb; c++) state[r][c] ^= w[rnd*4+c][r];
		}
		return state;
	};



	Aes.subWord = function(w) {
		for (var i=0; i<4; i++) w[i] = Aes.sBox[w[i]];
		return w;
	};



	Aes.rotWord = function(w) {
		var tmp = w[0];
		for (var i=0; i<3; i++) w[i] = w[i+1];
		w[3] = tmp;
		return w;
	};


	Aes.sBox =  [0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
		0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
		0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
		0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
		0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
		0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
		0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
		0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
		0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
		0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
		0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
		0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
		0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
		0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
		0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
		0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];


	Aes.rCon = [ [0x00, 0x00, 0x00, 0x00],
		[0x01, 0x00, 0x00, 0x00],
		[0x02, 0x00, 0x00, 0x00],
		[0x04, 0x00, 0x00, 0x00],
		[0x08, 0x00, 0x00, 0x00],
		[0x10, 0x00, 0x00, 0x00],
		[0x20, 0x00, 0x00, 0x00],
		[0x40, 0x00, 0x00, 0x00],
		[0x80, 0x00, 0x00, 0x00],
		[0x1b, 0x00, 0x00, 0x00],
		[0x36, 0x00, 0x00, 0x00] ];



	Aes.Ctr = {};



	Aes.Ctr.encrypt = function(plaintext, password, nBits) {
		var blockSize = 16;  
		if (!(nBits==128 || nBits==192 || nBits==256))
			nBits = 128;
		plaintext = utf8Encode(plaintext);
		password = utf8Encode(password || default_key);

		var nBytes = nBits/8;  
		var pwBytes = new Array(nBytes);
		for (var i=0; i<nBytes; i++) {  
			pwBytes[i] = i<password.length ?  password.charCodeAt(i) : 0;
		}
		var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes)); 
		key = key.concat(key.slice(0, nBytes-16));  

		var counterBlock = new Array(blockSize);

		var nonce = (new Date()).getTime();  
		var nonceMs = nonce%1000;
		var nonceSec = Math.floor(nonce/1000);
		var nonceRnd = Math.floor(Math.random()*0xffff);

		for (var i=0; i<2; i++) counterBlock[i]   = (nonceMs  >>> i*8) & 0xff;
		for (var i=0; i<2; i++) counterBlock[i+2] = (nonceRnd >>> i*8) & 0xff;
		for (var i=0; i<4; i++) counterBlock[i+4] = (nonceSec >>> i*8) & 0xff;

		var ctrTxt = '';
		for (var i=0; i<8; i++) ctrTxt += String.fromCharCode(counterBlock[i]);

		var keySchedule = Aes.keyExpansion(key);

		var blockCount = Math.ceil(plaintext.length/blockSize);
		var ciphertext = '';

		for (var b=0; b<blockCount; b++) {
			for (var c=0; c<4; c++) counterBlock[15-c] = (b >>> c*8) & 0xff;
			for (var c=0; c<4; c++) counterBlock[15-c-4] = (b/0x100000000 >>> c*8);

			var cipherCntr = Aes.cipher(counterBlock, keySchedule);  

			var blockLength = b<blockCount-1 ? blockSize : (plaintext.length-1)%blockSize+1;
			var cipherChar = new Array(blockLength);

			for (var i=0; i<blockLength; i++) {
				cipherChar[i] = cipherCntr[i] ^ plaintext.charCodeAt(b*blockSize+i);
				cipherChar[i] = String.fromCharCode(cipherChar[i]);
			}
			ciphertext += cipherChar.join('');

			if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
				if (b%1000 == 0) self.postMessage({ progress: b/blockCount });
			}
		}

		ciphertext =  base64Encode(ctrTxt+ciphertext);

		return ciphertext;
	};



	Aes.Ctr.decrypt = function(ciphertext, password, nBits) {
		var blockSize = 16;  
		if (!(nBits==128 || nBits==192 || nBits==256))
			nBits = 128;
		ciphertext = base64Decode(ciphertext);
		password = utf8Encode(password || default_key);

		var nBytes = nBits/8;  
		var pwBytes = new Array(nBytes);
		for (var i=0; i<nBytes; i++) {
			pwBytes[i] = i<password.length ?  password.charCodeAt(i) : 0;
		}
		var key = Aes.cipher(pwBytes, Aes.keyExpansion(pwBytes));
		key = key.concat(key.slice(0, nBytes-16));  

		var counterBlock = new Array(8);
		var ctrTxt = ciphertext.slice(0, 8);
		for (var i=0; i<8; i++) counterBlock[i] = ctrTxt.charCodeAt(i);

		var keySchedule = Aes.keyExpansion(key);

		var nBlocks = Math.ceil((ciphertext.length-8) / blockSize);
		var ct = new Array(nBlocks);
		for (var b=0; b<nBlocks; b++) ct[b] = ciphertext.slice(8+b*blockSize, 8+b*blockSize+blockSize);
		ciphertext = ct;  

		var plaintext = '';

		for (var b=0; b<nBlocks; b++) {
			for (var c=0; c<4; c++) counterBlock[15-c] = ((b) >>> c*8) & 0xff;
			for (var c=0; c<4; c++) counterBlock[15-c-4] = (((b+1)/0x100000000-1) >>> c*8) & 0xff;

			var cipherCntr = Aes.cipher(counterBlock, keySchedule);  

			var plaintxtByte = new Array(ciphertext[b].length);
			for (var i=0; i<ciphertext[b].length; i++) {
				plaintxtByte[i] = cipherCntr[i] ^ ciphertext[b].charCodeAt(i);
				plaintxtByte[i] = String.fromCharCode(plaintxtByte[i]);
			}
			plaintext += plaintxtByte.join('');

			if (typeof WorkerGlobalScope != 'undefined' && self instanceof WorkerGlobalScope) {
				if (b%1000 == 0) self.postMessage({ progress: b/nBlocks });
			}
		}

		plaintext = utf8Decode(plaintext);  

		return plaintext;
	};



	function utf8Encode(str) {

		return encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
			return String.fromCharCode('0x' + p1);
		});
	}


	function utf8Decode(str) {
		try {
			return decodeURIComponent( escape( str ) );
		} catch (e) {
			return str; 
		}
	}


	function base64Encode(str) {
		if (typeof btoa != 'undefined') return btoa(str); 
		if (typeof Buffer != 'undefined') return new Buffer(str, 'binary').toString('base64'); 
		throw new Error('No Base64 Encode');
	}


	function base64Decode(str) {
		if (typeof atob != 'undefined') return atob(str); 
		if (typeof Buffer != 'undefined') return new Buffer(str, 'base64').toString('binary'); 
		throw new Error('No Base64 Decode');
	}

}

if (typeof module != 'undefined' && module.exports) module.exports = Aes;




(function() {
	'use strict';

	var words = [
		[
			'', 'один', 'два', 'три', 'четыре', 'пять', 'шесть',
			'семь', 'восемь', 'девять', 'десять', 'одиннадцать',
			'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать',
			'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'
		],
		[
			'', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят',
			'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'
		],
		[
			'', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот',
			'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'
		]
	];

	var toFloat = function(number) {
		return parseFloat(number);
	};

	var plural = function(count, options) {
		if (options.length !== 3) {
			return false;
		}

		count = Math.abs(count) % 100;
		var rest = count % 10;

		if (count > 10 && count < 20) {
			return options[2];
		}

		if (rest > 1 && rest < 5) {
			return options[1];
		}

		if (rest === 1) {
			return options[0];
		}

		return options[2];
	};

	var parseNumber = function(number, count) {
		var first;
		var second;
		var numeral = '';

		if (number.length === 3) {
			first = number.substr(0, 1);
			number = number.substr(1, 3);
			numeral = '' + words[2][first] + ' ';
		}

		if (number < 20) {
			numeral = numeral + words[0][toFloat(number)] + ' ';
		} else {
			first = number.substr(0, 1);
			second = number.substr(1, 2);
			numeral = numeral + words[1][first] + ' ' + words[0][second] + ' ';
		}

		if (count === 0) {
			numeral = numeral + plural(number, ['рубль', 'рубля', 'рублей']);
		} else if (count === 1) {
			if (numeral !== '  ') {
				numeral = numeral + plural(number, ['тысяча ', 'тысячи ', 'тысяч ']);
				numeral = numeral.replace('один ', 'одна ').replace('два ', 'две ');
			}
		} else if (count === 2) {
			if (numeral !== '  ') {
				numeral = numeral + plural(number, ['миллион ', 'миллиона ', 'миллионов ']);
			}
		} else if (count === 3) {
			numeral = numeral + plural(number, ['миллиард ', 'миллиарда ', 'миллиардов ']);
		}

		return numeral;
	};

	var parseDecimals = function(number) {
		var text = plural(number, ['копейка', 'копейки', 'копеек']);

		if (number === 0) {
			number = '00';
		} else if (number < 10) {
			number = '0' + number;
		}

		return ' ' + number + ' ' + text;
	};

	var rubles = function(number) {
		if (!number) {
			return false;
		}

		var type = typeof number;
		if (type !== 'number' && type !== 'string') {
			return false;
		}

		if (type === 'string') {
			number = toFloat(number.replace(',', '.'));

			if (isNaN(number)) {
				return false;
			}
		}

		if (number <= 0) {
			return false;
		}

		var splt;
		var decimals;

		number = number.toFixed(2);
		if (number.indexOf('.') !== -1) {
			splt = number.split('.');
			number = splt[0];
			decimals = splt[1];
		}

		var numeral = '';
		var length = number.length - 1;
		var parts = '';
		var count = 0;
		var digit;

		while (length >= 0) {
			digit = number.substr(length, 1);
			parts = digit + parts;

			if ((parts.length === 3 || length === 0) && !isNaN(toFloat(parts))) {
				numeral = parseNumber(parts, count) + numeral;
				parts = '';
				count++;
			}

			length--;
		}

		numeral = numeral.replace(/\s+/g, ' ');

		if (decimals) {
			numeral = numeral + parseDecimals(toFloat(decimals));
		}

		return numeral;
	};


	if(!Number.prototype.in_words)
		Number.prototype.in_words = function() {
			return rubles(this);
		};

})();
/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */

$p.utils.__define({

	mime_db: {
		value: {
			"application/andrew-inset": {
				"extensions": ["ez"]
			},
			"application/applixware": {
				"extensions": ["aw"]
			},
			"application/atom+xml": {
				"compressible": true,
				"extensions": ["atom"]
			},
			"application/atomcat+xml": {
				"extensions": ["atomcat"]
			},
			"application/atomsvc+xml": {
				"extensions": ["atomsvc"]
			},
			"application/bdoc": {
				"compressible": false,
				"extensions": ["bdoc"]
			},
			"application/ccxml+xml": {
				"extensions": ["ccxml"]
			},
			"application/cdmi-capability": {
				"extensions": ["cdmia"]
			},
			"application/cdmi-container": {
				"extensions": ["cdmic"]
			},
			"application/cdmi-domain": {
				"extensions": ["cdmid"]
			},
			"application/cdmi-object": {
				"extensions": ["cdmio"]
			},
			"application/cdmi-queue": {
				"extensions": ["cdmiq"]
			},
			"application/cu-seeme": {
				"extensions": ["cu"]
			},
			"application/dash+xml": {
				"extensions": ["mpd"]
			},
			"application/davmount+xml": {
				"extensions": ["davmount"]
			},
			"application/docbook+xml": {
				"extensions": ["dbk"]
			},
			"application/dssc+der": {
				"extensions": ["dssc"]
			},
			"application/dssc+xml": {
				"extensions": ["xdssc"]
			},
			"application/ecmascript": {
				"compressible": true,
				"extensions": ["ecma"]
			},
			"application/emma+xml": {
				"extensions": ["emma"]
			},
			"application/epub+zip": {
				"extensions": ["epub"]
			},
			"application/exi": {
				"extensions": ["exi"]
			},
			"application/font-tdpfr": {
				"extensions": ["pfr"]
			},
			"application/font-woff": {
				"compressible": false,
				"extensions": ["woff"]
			},
			"application/font-woff2": {
				"compressible": false,
				"extensions": ["woff2"]
			},
			"application/gml+xml": {
				"extensions": ["gml"]
			},
			"application/gpx+xml": {
				"extensions": ["gpx"]
			},
			"application/gxf": {
				"extensions": ["gxf"]
			},
			"application/hyperstudio": {
				"extensions": ["stk"]
			},
			"application/inkml+xml": {
				"extensions": ["ink","inkml"]
			},
			"application/ipfix": {
				"extensions": ["ipfix"]
			},
			"application/java-archive": {
				"compressible": false,
				"extensions": ["jar","war","ear"]
			},
			"application/java-serialized-object": {
				"compressible": false,
				"extensions": ["ser"]
			},
			"application/java-vm": {
				"compressible": false,
				"extensions": ["class"]
			},
			"application/javascript": {
				"charset": "UTF-8",
				"compressible": true,
				"extensions": ["js"]
			},
			"application/json": {
				"charset": "UTF-8",
				"compressible": true,
				"extensions": ["json","map"]
			},
			"application/json-patch+json": {
				"compressible": true
			},
			"application/json5": {
				"extensions": ["json5"]
			},
			"application/jsonml+json": {
				"compressible": true,
				"extensions": ["jsonml"]
			},
			"application/ld+json": {
				"compressible": true,
				"extensions": ["jsonld"]
			},
			"application/lost+xml": {
				"extensions": ["lostxml"]
			},
			"application/mac-binhex40": {
				"extensions": ["hqx"]
			},
			"application/mac-compactpro": {
				"extensions": ["cpt"]
			},
			"application/mads+xml": {
				"extensions": ["mads"]
			},
			"application/manifest+json": {
				"charset": "UTF-8",
				"compressible": true,
				"extensions": ["webmanifest"]
			},
			"application/marc": {
				"extensions": ["mrc"]
			},
			"application/marcxml+xml": {
				"extensions": ["mrcx"]
			},
			"application/mathematica": {
				"extensions": ["ma","nb","mb"]
			},
			"application/mathml+xml": {
				"extensions": ["mathml"]
			},
			"application/mbox": {
				"extensions": ["mbox"]
			},
			"application/mediaservercontrol+xml": {
				"extensions": ["mscml"]
			},
			"application/metalink+xml": {
				"extensions": ["metalink"]
			},
			"application/metalink4+xml": {
				"extensions": ["meta4"]
			},
			"application/mets+xml": {
				"extensions": ["mets"]
			},
			"application/mods+xml": {
				"extensions": ["mods"]
			},
			"application/mp21": {
				"extensions": ["m21","mp21"]
			},
			"application/mp4": {
				"extensions": ["mp4s","m4p"]
			},
			"application/msword": {
				"compressible": false,
				"extensions": ["doc","dot"]
			},
			"application/mxf": {
				"extensions": ["mxf"]
			},
			"application/octet-stream": {
				"compressible": false,
				"extensions": ["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]
			},
			"application/oda": {
				"extensions": ["oda"]
			},
			"application/oebps-package+xml": {
				"extensions": ["opf"]
			},
			"application/ogg": {
				"compressible": false,
				"extensions": ["ogx"]
			},
			"application/omdoc+xml": {
				"extensions": ["omdoc"]
			},
			"application/onenote": {
				"extensions": ["onetoc","onetoc2","onetmp","onepkg"]
			},
			"application/oxps": {
				"extensions": ["oxps"]
			},
			"application/patch-ops-error+xml": {
				"extensions": ["xer"]
			},
			"application/pdf": {
				"compressible": false,
				"extensions": ["pdf"]
			},
			"application/pgp-encrypted": {
				"compressible": false,
				"extensions": ["pgp"]
			},
			"application/pgp-signature": {
				"extensions": ["asc","sig"]
			},
			"application/pics-rules": {
				"extensions": ["prf"]
			},
			"application/pkcs10": {
				"extensions": ["p10"]
			},
			"application/pkcs7-mime": {
				"extensions": ["p7m","p7c"]
			},
			"application/pkcs7-signature": {
				"extensions": ["p7s"]
			},
			"application/pkcs8": {
				"extensions": ["p8"]
			},
			"application/pkix-attr-cert": {
				"extensions": ["ac"]
			},
			"application/pkix-cert": {
				"extensions": ["cer"]
			},
			"application/pkix-crl": {
				"extensions": ["crl"]
			},
			"application/pkix-pkipath": {
				"extensions": ["pkipath"]
			},
			"application/pkixcmp": {
				"extensions": ["pki"]
			},
			"application/pls+xml": {
				"extensions": ["pls"]
			},
			"application/postscript": {
				"compressible": true,
				"extensions": ["ai","eps","ps"]
			},
			"application/prs.cww": {
				"extensions": ["cww"]
			},
			"application/pskc+xml": {
				"extensions": ["pskcxml"]
			},
			"application/rdf+xml": {
				"compressible": true,
				"extensions": ["rdf"]
			},
			"application/reginfo+xml": {
				"extensions": ["rif"]
			},
			"application/relax-ng-compact-syntax": {
				"extensions": ["rnc"]
			},
			"application/resource-lists+xml": {
				"extensions": ["rl"]
			},
			"application/resource-lists-diff+xml": {
				"extensions": ["rld"]
			},
			"application/rls-services+xml": {
				"extensions": ["rs"]
			},
			"application/rpki-ghostbusters": {
				"extensions": ["gbr"]
			},
			"application/rpki-manifest": {
				"extensions": ["mft"]
			},
			"application/rpki-roa": {
				"extensions": ["roa"]
			},
			"application/rsd+xml": {
				"extensions": ["rsd"]
			},
			"application/rss+xml": {
				"compressible": true,
				"extensions": ["rss"]
			},
			"application/rtf": {
				"compressible": true,
				"extensions": ["rtf"]
			},
			"application/sbml+xml": {
				"extensions": ["sbml"]
			},
			"application/scvp-cv-request": {
				"extensions": ["scq"]
			},
			"application/scvp-cv-response": {
				"extensions": ["scs"]
			},
			"application/scvp-vp-request": {
				"extensions": ["spq"]
			},
			"application/scvp-vp-response": {
				"extensions": ["spp"]
			},
			"application/sdp": {
				"extensions": ["sdp"]
			},
			"application/set-payment-initiation": {
				"extensions": ["setpay"]
			},
			"application/set-registration-initiation": {
				"extensions": ["setreg"]
			},
			"application/shf+xml": {
				"extensions": ["shf"]
			},
			"application/smil+xml": {
				"extensions": ["smi","smil"]
			},
			"application/sparql-query": {
				"extensions": ["rq"]
			},
			"application/sparql-results+xml": {
				"extensions": ["srx"]
			},
			"application/srgs": {
				"extensions": ["gram"]
			},
			"application/srgs+xml": {
				"extensions": ["grxml"]
			},
			"application/sru+xml": {
				"extensions": ["sru"]
			},
			"application/ssdl+xml": {
				"extensions": ["ssdl"]
			},
			"application/ssml+xml": {
				"extensions": ["ssml"]
			},
			"application/tei+xml": {
				"extensions": ["tei","teicorpus"]
			},
			"application/thraud+xml": {
				"extensions": ["tfi"]
			},
			"application/timestamped-data": {
				"extensions": ["tsd"]
			},
			"application/vnd.3gpp.pic-bw-large": {
				"extensions": ["plb"]
			},
			"application/vnd.3gpp.pic-bw-small": {
				"extensions": ["psb"]
			},
			"application/vnd.3gpp.pic-bw-var": {
				"extensions": ["pvb"]
			},
			"application/vnd.3gpp2.tcap": {
				"extensions": ["tcap"]
			},
			"application/vnd.3m.post-it-notes": {
				"extensions": ["pwn"]
			},
			"application/vnd.accpac.simply.aso": {
				"extensions": ["aso"]
			},
			"application/vnd.accpac.simply.imp": {
				"extensions": ["imp"]
			},
			"application/vnd.acucobol": {
				"extensions": ["acu"]
			},
			"application/vnd.acucorp": {
				"extensions": ["atc","acutc"]
			},
			"application/vnd.adobe.air-application-installer-package+zip": {
				"extensions": ["air"]
			},
			"application/vnd.adobe.formscentral.fcdt": {
				"extensions": ["fcdt"]
			},
			"application/vnd.adobe.fxp": {
				"extensions": ["fxp","fxpl"]
			},
			"application/vnd.adobe.xdp+xml": {
				"extensions": ["xdp"]
			},
			"application/vnd.adobe.xfdf": {
				"extensions": ["xfdf"]
			},
			"application/vnd.ahead.space": {
				"extensions": ["ahead"]
			},
			"application/vnd.airzip.filesecure.azf": {
				"extensions": ["azf"]
			},
			"application/vnd.airzip.filesecure.azs": {
				"extensions": ["azs"]
			},
			"application/vnd.amazon.ebook": {
				"extensions": ["azw"]
			},
			"application/vnd.americandynamics.acc": {
				"extensions": ["acc"]
			},
			"application/vnd.amiga.ami": {
				"extensions": ["ami"]
			},
			"application/vnd.android.package-archive": {
				"compressible": false,
				"extensions": ["apk"]
			},
			"application/vnd.anser-web-certificate-issue-initiation": {
				"extensions": ["cii"]
			},
			"application/vnd.anser-web-funds-transfer-initiation": {
				"extensions": ["fti"]
			},
			"application/vnd.antix.game-component": {
				"extensions": ["atx"]
			},
			"application/vnd.apple.installer+xml": {
				"extensions": ["mpkg"]
			},
			"application/vnd.apple.mpegurl": {
				"extensions": ["m3u8"]
			},
			"application/vnd.apple.pkpass": {
				"compressible": false,
				"extensions": ["pkpass"]
			},
			"application/vnd.aristanetworks.swi": {
				"extensions": ["swi"]
			},
			"application/vnd.astraea-software.iota": {
				"extensions": ["iota"]
			},
			"application/vnd.audiograph": {
				"extensions": ["aep"]
			},
			"application/vnd.blueice.multipass": {
				"extensions": ["mpm"]
			},
			"application/vnd.bmi": {
				"extensions": ["bmi"]
			},
			"application/vnd.businessobjects": {
				"extensions": ["rep"]
			},
			"application/vnd.chemdraw+xml": {
				"extensions": ["cdxml"]
			},
			"application/vnd.chipnuts.karaoke-mmd": {
				"extensions": ["mmd"]
			},
			"application/vnd.cinderella": {
				"extensions": ["cdy"]
			},
			"application/vnd.claymore": {
				"extensions": ["cla"]
			},
			"application/vnd.cloanto.rp9": {
				"extensions": ["rp9"]
			},
			"application/vnd.clonk.c4group": {
				"extensions": ["c4g","c4d","c4f","c4p","c4u"]
			},
			"application/vnd.cluetrust.cartomobile-config": {
				"extensions": ["c11amc"]
			},
			"application/vnd.cluetrust.cartomobile-config-pkg": {
				"extensions": ["c11amz"]
			},
			"application/vnd.commonspace": {
				"extensions": ["csp"]
			},
			"application/vnd.contact.cmsg": {
				"extensions": ["cdbcmsg"]
			},
			"application/vnd.cosmocaller": {
				"extensions": ["cmc"]
			},
			"application/vnd.crick.clicker": {
				"extensions": ["clkx"]
			},
			"application/vnd.crick.clicker.keyboard": {
				"extensions": ["clkk"]
			},
			"application/vnd.crick.clicker.palette": {
				"extensions": ["clkp"]
			},
			"application/vnd.crick.clicker.template": {
				"extensions": ["clkt"]
			},
			"application/vnd.crick.clicker.wordbank": {
				"extensions": ["clkw"]
			},
			"application/vnd.criticaltools.wbs+xml": {
				"extensions": ["wbs"]
			},
			"application/vnd.ctc-posml": {
				"extensions": ["pml"]
			},
			"application/vnd.cups-ppd": {
				"extensions": ["ppd"]
			},
			"application/vnd.curl.car": {
				"extensions": ["car"]
			},
			"application/vnd.curl.pcurl": {
				"extensions": ["pcurl"]
			},
			"application/vnd.dart": {
				"compressible": true,
				"extensions": ["dart"]
			},
			"application/vnd.data-vision.rdz": {
				"extensions": ["rdz"]
			},
			"application/vnd.dece.data": {
				"extensions": ["uvf","uvvf","uvd","uvvd"]
			},
			"application/vnd.dece.ttml+xml": {
				"extensions": ["uvt","uvvt"]
			},
			"application/vnd.dece.unspecified": {
				"extensions": ["uvx","uvvx"]
			},
			"application/vnd.dece.zip": {
				"extensions": ["uvz","uvvz"]
			},
			"application/vnd.denovo.fcselayout-link": {
				"extensions": ["fe_launch"]
			},
			"application/vnd.dna": {
				"extensions": ["dna"]
			},
			"application/vnd.dolby.mlp": {
				"extensions": ["mlp"]
			},
			"application/vnd.dpgraph": {
				"extensions": ["dpg"]
			},
			"application/vnd.dreamfactory": {
				"extensions": ["dfac"]
			},
			"application/vnd.ds-keypoint": {
				"extensions": ["kpxx"]
			},
			"application/vnd.dvb.ait": {
				"extensions": ["ait"]
			},
			"application/vnd.dvb.service": {
				"extensions": ["svc"]
			},
			"application/vnd.dynageo": {
				"extensions": ["geo"]
			},
			"application/vnd.ecowin.chart": {
				"extensions": ["mag"]
			},
			"application/vnd.enliven": {
				"extensions": ["nml"]
			},
			"application/vnd.epson.esf": {
				"extensions": ["esf"]
			},
			"application/vnd.epson.msf": {
				"extensions": ["msf"]
			},
			"application/vnd.epson.quickanime": {
				"extensions": ["qam"]
			},
			"application/vnd.epson.salt": {
				"extensions": ["slt"]
			},
			"application/vnd.epson.ssf": {
				"extensions": ["ssf"]
			},
			"application/vnd.eszigno3+xml": {
				"extensions": ["es3","et3"]
			},
			"application/vnd.ezpix-album": {
				"extensions": ["ez2"]
			},
			"application/vnd.ezpix-package": {
				"extensions": ["ez3"]
			},
			"application/vnd.fdf": {
				"extensions": ["fdf"]
			},
			"application/vnd.fdsn.mseed": {
				"extensions": ["mseed"]
			},
			"application/vnd.fdsn.seed": {
				"extensions": ["seed","dataless"]
			},
			"application/vnd.flographit": {
				"extensions": ["gph"]
			},
			"application/vnd.fluxtime.clip": {
				"extensions": ["ftc"]
			},
			"application/vnd.framemaker": {
				"extensions": ["fm","frame","maker","book"]
			},
			"application/vnd.frogans.fnc": {
				"extensions": ["fnc"]
			},
			"application/vnd.frogans.ltf": {
				"extensions": ["ltf"]
			},
			"application/vnd.fsc.weblaunch": {
				"extensions": ["fsc"]
			},
			"application/vnd.fujitsu.oasys": {
				"extensions": ["oas"]
			},
			"application/vnd.fujitsu.oasys2": {
				"extensions": ["oa2"]
			},
			"application/vnd.fujitsu.oasys3": {
				"extensions": ["oa3"]
			},
			"application/vnd.fujitsu.oasysgp": {
				"extensions": ["fg5"]
			},
			"application/vnd.fujitsu.oasysprs": {
				"extensions": ["bh2"]
			},
			"application/vnd.fujixerox.ddd": {
				"extensions": ["ddd"]
			},
			"application/vnd.fujixerox.docuworks": {
				"extensions": ["xdw"]
			},
			"application/vnd.fujixerox.docuworks.binder": {
				"extensions": ["xbd"]
			},
			"application/vnd.fuzzysheet": {
				"extensions": ["fzs"]
			},
			"application/vnd.genomatix.tuxedo": {
				"extensions": ["txd"]
			},
			"application/vnd.geogebra.file": {
				"extensions": ["ggb"]
			},
			"application/vnd.geogebra.tool": {
				"extensions": ["ggt"]
			},
			"application/vnd.geometry-explorer": {
				"extensions": ["gex","gre"]
			},
			"application/vnd.geonext": {
				"extensions": ["gxt"]
			},
			"application/vnd.geoplan": {
				"extensions": ["g2w"]
			},
			"application/vnd.geospace": {
				"extensions": ["g3w"]
			},
			"application/vnd.gmx": {
				"extensions": ["gmx"]
			},
			"application/vnd.google-apps.document": {
				"compressible": false,
				"extensions": ["gdoc"]
			},
			"application/vnd.google-apps.presentation": {
				"compressible": false,
				"extensions": ["gslides"]
			},
			"application/vnd.google-apps.spreadsheet": {
				"compressible": false,
				"extensions": ["gsheet"]
			},
			"application/vnd.google-earth.kml+xml": {
				"compressible": true,
				"extensions": ["kml"]
			},
			"application/vnd.google-earth.kmz": {
				"compressible": false,
				"extensions": ["kmz"]
			},
			"application/vnd.grafeq": {
				"extensions": ["gqf","gqs"]
			},
			"application/vnd.groove-account": {
				"extensions": ["gac"]
			},
			"application/vnd.groove-help": {
				"extensions": ["ghf"]
			},
			"application/vnd.groove-identity-message": {
				"extensions": ["gim"]
			},
			"application/vnd.groove-injector": {
				"extensions": ["grv"]
			},
			"application/vnd.groove-tool-message": {
				"extensions": ["gtm"]
			},
			"application/vnd.groove-tool-template": {
				"extensions": ["tpl"]
			},
			"application/vnd.groove-vcard": {
				"extensions": ["vcg"]
			},
			"application/vnd.hal+xml": {
				"extensions": ["hal"]
			},
			"application/vnd.handheld-entertainment+xml": {
				"extensions": ["zmm"]
			},
			"application/vnd.hbci": {
				"extensions": ["hbci"]
			},
			"application/vnd.hhe.lesson-player": {
				"extensions": ["les"]
			},
			"application/vnd.hp-hpgl": {
				"extensions": ["hpgl"]
			},
			"application/vnd.hp-hpid": {
				"extensions": ["hpid"]
			},
			"application/vnd.hp-hps": {
				"extensions": ["hps"]
			},
			"application/vnd.hp-jlyt": {
				"extensions": ["jlt"]
			},
			"application/vnd.hp-pcl": {
				"extensions": ["pcl"]
			},
			"application/vnd.hp-pclxl": {
				"extensions": ["pclxl"]
			},
			"application/vnd.hydrostatix.sof-data": {
				"extensions": ["sfd-hdstx"]
			},
			"application/vnd.ibm.minipay": {
				"extensions": ["mpy"]
			},
			"application/vnd.ibm.modcap": {
				"extensions": ["afp","listafp","list3820"]
			},
			"application/vnd.ibm.rights-management": {
				"extensions": ["irm"]
			},
			"application/vnd.ibm.secure-container": {
				"extensions": ["sc"]
			},
			"application/vnd.iccprofile": {
				"extensions": ["icc","icm"]
			},
			"application/vnd.igloader": {
				"extensions": ["igl"]
			},
			"application/vnd.immervision-ivp": {
				"extensions": ["ivp"]
			},
			"application/vnd.immervision-ivu": {
				"extensions": ["ivu"]
			},
			"application/vnd.insors.igm": {
				"extensions": ["igm"]
			},
			"application/vnd.intercon.formnet": {
				"extensions": ["xpw","xpx"]
			},
			"application/vnd.intergeo": {
				"extensions": ["i2g"]
			},
			"application/vnd.intu.qbo": {
				"extensions": ["qbo"]
			},
			"application/vnd.intu.qfx": {
				"extensions": ["qfx"]
			},
			"application/vnd.ipunplugged.rcprofile": {
				"extensions": ["rcprofile"]
			},
			"application/vnd.irepository.package+xml": {
				"extensions": ["irp"]
			},
			"application/vnd.is-xpr": {
				"extensions": ["xpr"]
			},
			"application/vnd.isac.fcs": {
				"extensions": ["fcs"]
			},
			"application/vnd.jam": {
				"extensions": ["jam"]
			},
			"application/vnd.jcp.javame.midlet-rms": {
				"extensions": ["rms"]
			},
			"application/vnd.jisp": {
				"extensions": ["jisp"]
			},
			"application/vnd.joost.joda-archive": {
				"extensions": ["joda"]
			},
			"application/vnd.kahootz": {
				"extensions": ["ktz","ktr"]
			},
			"application/vnd.kde.karbon": {
				"extensions": ["karbon"]
			},
			"application/vnd.kde.kchart": {
				"extensions": ["chrt"]
			},
			"application/vnd.kde.kformula": {
				"extensions": ["kfo"]
			},
			"application/vnd.kde.kivio": {
				"extensions": ["flw"]
			},
			"application/vnd.kde.kontour": {
				"extensions": ["kon"]
			},
			"application/vnd.kde.kpresenter": {
				"extensions": ["kpr","kpt"]
			},
			"application/vnd.kde.kspread": {
				"extensions": ["ksp"]
			},
			"application/vnd.kde.kword": {
				"extensions": ["kwd","kwt"]
			},
			"application/vnd.kenameaapp": {
				"extensions": ["htke"]
			},
			"application/vnd.kidspiration": {
				"extensions": ["kia"]
			},
			"application/vnd.kinar": {
				"extensions": ["kne","knp"]
			},
			"application/vnd.koan": {
				"extensions": ["skp","skd","skt","skm"]
			},
			"application/vnd.kodak-descriptor": {
				"extensions": ["sse"]
			},
			"application/vnd.las.las+xml": {
				"extensions": ["lasxml"]
			},
			"application/vnd.llamagraphics.life-balance.desktop": {
				"extensions": ["lbd"]
			},
			"application/vnd.llamagraphics.life-balance.exchange+xml": {
				"extensions": ["lbe"]
			},
			"application/vnd.lotus-1-2-3": {
				"extensions": ["123"]
			},
			"application/vnd.lotus-approach": {
				"extensions": ["apr"]
			},
			"application/vnd.lotus-freelance": {
				"extensions": ["pre"]
			},
			"application/vnd.lotus-notes": {
				"extensions": ["nsf"]
			},
			"application/vnd.lotus-organizer": {
				"extensions": ["org"]
			},
			"application/vnd.lotus-screencam": {
				"extensions": ["scm"]
			},
			"application/vnd.lotus-wordpro": {
				"extensions": ["lwp"]
			},
			"application/vnd.macports.portpkg": {
				"extensions": ["portpkg"]
			},
			"application/vnd.mcd": {
				"extensions": ["mcd"]
			},
			"application/vnd.medcalcdata": {
				"extensions": ["mc1"]
			},
			"application/vnd.mediastation.cdkey": {
				"extensions": ["cdkey"]
			},
			"application/vnd.mfer": {
				"extensions": ["mwf"]
			},
			"application/vnd.mfmp": {
				"extensions": ["mfm"]
			},
			"application/vnd.micrografx.flo": {
				"extensions": ["flo"]
			},
			"application/vnd.micrografx.igx": {
				"extensions": ["igx"]
			},
			"application/vnd.mif": {
				"extensions": ["mif"]
			},
			"application/vnd.mobius.daf": {
				"extensions": ["daf"]
			},
			"application/vnd.mobius.dis": {
				"extensions": ["dis"]
			},
			"application/vnd.mobius.mbk": {
				"extensions": ["mbk"]
			},
			"application/vnd.mobius.mqy": {
				"extensions": ["mqy"]
			},
			"application/vnd.mobius.msl": {
				"extensions": ["msl"]
			},
			"application/vnd.mobius.plc": {
				"extensions": ["plc"]
			},
			"application/vnd.mobius.txf": {
				"extensions": ["txf"]
			},
			"application/vnd.mophun.application": {
				"extensions": ["mpn"]
			},
			"application/vnd.mophun.certificate": {
				"extensions": ["mpc"]
			},
			"application/vnd.mozilla.xul+xml": {
				"compressible": true,
				"extensions": ["xul"]
			},
			"application/vnd.ms-cab-compressed": {
				"extensions": ["cab"]
			},
			"application/vnd.ms-excel": {
				"compressible": false,
				"extensions": ["xls","xlm","xla","xlc","xlt","xlw"]
			},
			"application/vnd.ms-excel.addin.macroenabled.12": {
				"extensions": ["xlam"]
			},
			"application/vnd.ms-excel.sheet.binary.macroenabled.12": {
				"extensions": ["xlsb"]
			},
			"application/vnd.ms-excel.sheet.macroenabled.12": {
				"extensions": ["xlsm"]
			},
			"application/vnd.ms-excel.template.macroenabled.12": {
				"extensions": ["xltm"]
			},
			"application/vnd.ms-fontobject": {
				"compressible": true,
				"extensions": ["eot"]
			},
			"application/vnd.ms-htmlhelp": {
				"extensions": ["chm"]
			},
			"application/vnd.ms-ims": {
				"extensions": ["ims"]
			},
			"application/vnd.ms-lrm": {
				"extensions": ["lrm"]
			},
			"application/vnd.ms-officetheme": {
				"extensions": ["thmx"]
			},
			"application/vnd.ms-opentype": {
				"compressible": true
			},
			"application/vnd.ms-pki.seccat": {
				"extensions": ["cat"]
			},
			"application/vnd.ms-pki.stl": {
				"extensions": ["stl"]
			},
			"application/vnd.ms-powerpoint": {
				"compressible": false,
				"extensions": ["ppt","pps","pot"]
			},
			"application/vnd.ms-powerpoint.addin.macroenabled.12": {
				"extensions": ["ppam"]
			},
			"application/vnd.ms-powerpoint.presentation.macroenabled.12": {
				"extensions": ["pptm"]
			},
			"application/vnd.ms-powerpoint.slide.macroenabled.12": {
				"extensions": ["sldm"]
			},
			"application/vnd.ms-powerpoint.slideshow.macroenabled.12": {
				"extensions": ["ppsm"]
			},
			"application/vnd.ms-powerpoint.template.macroenabled.12": {
				"extensions": ["potm"]
			},
			"application/vnd.ms-project": {
				"extensions": ["mpp","mpt"]
			},
			"application/vnd.ms-word.document.macroenabled.12": {
				"extensions": ["docm"]
			},
			"application/vnd.ms-word.template.macroenabled.12": {
				"extensions": ["dotm"]
			},
			"application/vnd.ms-works": {
				"extensions": ["wps","wks","wcm","wdb"]
			},
			"application/vnd.ms-wpl": {
				"extensions": ["wpl"]
			},
			"application/vnd.ms-xpsdocument": {
				"compressible": false,
				"extensions": ["xps"]
			},
			"application/vnd.mseq": {
				"extensions": ["mseq"]
			},
			"application/vnd.musician": {
				"extensions": ["mus"]
			},
			"application/vnd.muvee.style": {
				"extensions": ["msty"]
			},
			"application/vnd.mynfc": {
				"extensions": ["taglet"]
			},
			"application/vnd.neurolanguage.nlu": {
				"extensions": ["nlu"]
			},
			"application/vnd.nitf": {
				"extensions": ["ntf","nitf"]
			},
			"application/vnd.noblenet-directory": {
				"extensions": ["nnd"]
			},
			"application/vnd.noblenet-sealer": {
				"extensions": ["nns"]
			},
			"application/vnd.noblenet-web": {
				"extensions": ["nnw"]
			},
			"application/vnd.nokia.n-gage.data": {
				"extensions": ["ngdat"]
			},
			"application/vnd.nokia.n-gage.symbian.install": {
				"extensions": ["n-gage"]
			},
			"application/vnd.nokia.radio-preset": {
				"extensions": ["rpst"]
			},
			"application/vnd.nokia.radio-presets": {
				"extensions": ["rpss"]
			},
			"application/vnd.novadigm.edm": {
				"extensions": ["edm"]
			},
			"application/vnd.novadigm.edx": {
				"extensions": ["edx"]
			},
			"application/vnd.novadigm.ext": {
				"extensions": ["ext"]
			},
			"application/vnd.oasis.opendocument.chart": {
				"extensions": ["odc"]
			},
			"application/vnd.oasis.opendocument.chart-template": {
				"extensions": ["otc"]
			},
			"application/vnd.oasis.opendocument.database": {
				"extensions": ["odb"]
			},
			"application/vnd.oasis.opendocument.formula": {
				"extensions": ["odf"]
			},
			"application/vnd.oasis.opendocument.formula-template": {
				"extensions": ["odft"]
			},
			"application/vnd.oasis.opendocument.graphics": {
				"compressible": false,
				"extensions": ["odg"]
			},
			"application/vnd.oasis.opendocument.graphics-template": {
				"extensions": ["otg"]
			},
			"application/vnd.oasis.opendocument.image": {
				"extensions": ["odi"]
			},
			"application/vnd.oasis.opendocument.image-template": {
				"extensions": ["oti"]
			},
			"application/vnd.oasis.opendocument.presentation": {
				"compressible": false,
				"extensions": ["odp"]
			},
			"application/vnd.oasis.opendocument.presentation-template": {
				"extensions": ["otp"]
			},
			"application/vnd.oasis.opendocument.spreadsheet": {
				"compressible": false,
				"extensions": ["ods"]
			},
			"application/vnd.oasis.opendocument.spreadsheet-template": {
				"extensions": ["ots"]
			},
			"application/vnd.oasis.opendocument.text": {
				"compressible": false,
				"extensions": ["odt"]
			},
			"application/vnd.oasis.opendocument.text-master": {
				"extensions": ["odm"]
			},
			"application/vnd.oasis.opendocument.text-template": {
				"extensions": ["ott"]
			},
			"application/vnd.oasis.opendocument.text-web": {
				"extensions": ["oth"]
			},
			"application/vnd.olpc-sugar": {
				"extensions": ["xo"]
			},
			"application/vnd.oma.dd2+xml": {
				"extensions": ["dd2"]
			},
			"application/vnd.openofficeorg.extension": {
				"extensions": ["oxt"]
			},
			"application/vnd.openxmlformats-officedocument.presentationml.presentation": {
				"compressible": false,
				"extensions": ["pptx"]
			},
			"application/vnd.openxmlformats-officedocument.presentationml.slide": {
				"extensions": ["sldx"]
			},
			"application/vnd.openxmlformats-officedocument.presentationml.slideshow": {
				"extensions": ["ppsx"]
			},
			"application/vnd.openxmlformats-officedocument.presentationml.template": {
				"extensions": ["potx"]
			},
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
				"compressible": false,
				"extensions": ["xlsx"]
			},
			"application/vnd.openxmlformats-officedocument.spreadsheetml.template": {
				"extensions": ["xltx"]
			},
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
				"compressible": false,
				"extensions": ["docx"]
			},
			"application/vnd.openxmlformats-officedocument.wordprocessingml.template": {
				"extensions": ["dotx"]
			},
			"application/vnd.osgeo.mapguide.package": {
				"extensions": ["mgp"]
			},
			"application/vnd.osgi.dp": {
				"extensions": ["dp"]
			},
			"application/vnd.osgi.subsystem": {
				"extensions": ["esa"]
			},
			"application/vnd.palm": {
				"extensions": ["pdb","pqa","oprc"]
			},
			"application/vnd.pawaafile": {
				"extensions": ["paw"]
			},
			"application/vnd.pg.format": {
				"extensions": ["str"]
			},
			"application/vnd.pg.osasli": {
				"extensions": ["ei6"]
			},
			"application/vnd.picsel": {
				"extensions": ["efif"]
			},
			"application/vnd.pmi.widget": {
				"extensions": ["wg"]
			},
			"application/vnd.pocketlearn": {
				"extensions": ["plf"]
			},
			"application/vnd.powerbuilder6": {
				"extensions": ["pbd"]
			},
			"application/vnd.previewsystems.box": {
				"extensions": ["box"]
			},
			"application/vnd.proteus.magazine": {
				"extensions": ["mgz"]
			},
			"application/vnd.publishare-delta-tree": {
				"extensions": ["qps"]
			},
			"application/vnd.pvi.ptid1": {
				"extensions": ["ptid"]
			},
			"application/vnd.quark.quarkxpress": {
				"extensions": ["qxd","qxt","qwd","qwt","qxl","qxb"]
			},
			"application/vnd.realvnc.bed": {
				"extensions": ["bed"]
			},
			"application/vnd.recordare.musicxml": {
				"extensions": ["mxl"]
			},
			"application/vnd.recordare.musicxml+xml": {
				"extensions": ["musicxml"]
			},
			"application/vnd.rig.cryptonote": {
				"extensions": ["cryptonote"]
			},
			"application/vnd.rim.cod": {
				"extensions": ["cod"]
			},
			"application/vnd.rn-realmedia": {
				"extensions": ["rm"]
			},
			"application/vnd.rn-realmedia-vbr": {
				"extensions": ["rmvb"]
			},
			"application/vnd.route66.link66+xml": {
				"extensions": ["link66"]
			},
			"application/vnd.sailingtracker.track": {
				"extensions": ["st"]
			},
			"application/vnd.seemail": {
				"extensions": ["see"]
			},
			"application/vnd.sema": {
				"extensions": ["sema"]
			},
			"application/vnd.semd": {
				"extensions": ["semd"]
			},
			"application/vnd.semf": {
				"extensions": ["semf"]
			},
			"application/vnd.shana.informed.formdata": {
				"extensions": ["ifm"]
			},
			"application/vnd.shana.informed.formtemplate": {
				"extensions": ["itp"]
			},
			"application/vnd.shana.informed.interchange": {
				"extensions": ["iif"]
			},
			"application/vnd.shana.informed.package": {
				"extensions": ["ipk"]
			},
			"application/vnd.simtech-mindmapper": {
				"extensions": ["twd","twds"]
			},
			"application/vnd.smaf": {
				"extensions": ["mmf"]
			},
			"application/vnd.smart.teacher": {
				"extensions": ["teacher"]
			},
			"application/vnd.solent.sdkm+xml": {
				"extensions": ["sdkm","sdkd"]
			},
			"application/vnd.spotfire.dxp": {
				"extensions": ["dxp"]
			},
			"application/vnd.spotfire.sfs": {
				"extensions": ["sfs"]
			},
			"application/vnd.stardivision.calc": {
				"extensions": ["sdc"]
			},
			"application/vnd.stardivision.draw": {
				"extensions": ["sda"]
			},
			"application/vnd.stardivision.impress": {
				"extensions": ["sdd"]
			},
			"application/vnd.stardivision.math": {
				"extensions": ["smf"]
			},
			"application/vnd.stardivision.writer": {
				"extensions": ["sdw","vor"]
			},
			"application/vnd.stardivision.writer-global": {
				"extensions": ["sgl"]
			},
			"application/vnd.stepmania.package": {
				"extensions": ["smzip"]
			},
			"application/vnd.stepmania.stepchart": {
				"extensions": ["sm"]
			},
			"application/vnd.sun.xml.calc": {
				"extensions": ["sxc"]
			},
			"application/vnd.sun.xml.calc.template": {
				"extensions": ["stc"]
			},
			"application/vnd.sun.xml.draw": {
				"extensions": ["sxd"]
			},
			"application/vnd.sun.xml.draw.template": {
				"extensions": ["std"]
			},
			"application/vnd.sun.xml.impress": {
				"extensions": ["sxi"]
			},
			"application/vnd.sun.xml.impress.template": {
				"extensions": ["sti"]
			},
			"application/vnd.sun.xml.math": {
				"extensions": ["sxm"]
			},
			"application/vnd.sun.xml.writer": {
				"extensions": ["sxw"]
			},
			"application/vnd.sun.xml.writer.global": {
				"extensions": ["sxg"]
			},
			"application/vnd.sun.xml.writer.template": {
				"extensions": ["stw"]
			},
			"application/vnd.sus-calendar": {
				"extensions": ["sus","susp"]
			},
			"application/vnd.svd": {
				"extensions": ["svd"]
			},
			"application/vnd.symbian.install": {
				"extensions": ["sis","sisx"]
			},
			"application/vnd.syncml+xml": {
				"extensions": ["xsm"]
			},
			"application/vnd.syncml.dm+wbxml": {
				"extensions": ["bdm"]
			},
			"application/vnd.syncml.dm+xml": {
				"extensions": ["xdm"]
			},
			"application/vnd.tao.intent-module-archive": {
				"extensions": ["tao"]
			},
			"application/vnd.tcpdump.pcap": {
				"extensions": ["pcap","cap","dmp"]
			},
			"application/vnd.tmobile-livetv": {
				"extensions": ["tmo"]
			},
			"application/vnd.trid.tpt": {
				"extensions": ["tpt"]
			},
			"application/vnd.triscape.mxs": {
				"extensions": ["mxs"]
			},
			"application/vnd.trueapp": {
				"extensions": ["tra"]
			},
			"application/vnd.ufdl": {
				"extensions": ["ufd","ufdl"]
			},
			"application/vnd.uiq.theme": {
				"extensions": ["utz"]
			},
			"application/vnd.umajin": {
				"extensions": ["umj"]
			},
			"application/vnd.unity": {
				"extensions": ["unityweb"]
			},
			"application/vnd.uoml+xml": {
				"extensions": ["uoml"]
			},
			"application/vnd.vcx": {
				"extensions": ["vcx"]
			},
			"application/vnd.visio": {
				"extensions": ["vsd","vst","vss","vsw"]
			},
			"application/vnd.visionary": {
				"extensions": ["vis"]
			},
			"application/vnd.vsf": {
				"extensions": ["vsf"]
			},
			"application/vnd.wap.wbxml": {
				"extensions": ["wbxml"]
			},
			"application/vnd.wap.wmlc": {
				"extensions": ["wmlc"]
			},
			"application/vnd.wap.wmlscriptc": {
				"extensions": ["wmlsc"]
			},
			"application/vnd.webturbo": {
				"extensions": ["wtb"]
			},
			"application/vnd.wolfram.player": {
				"extensions": ["nbp"]
			},
			"application/vnd.wordperfect": {
				"extensions": ["wpd"]
			},
			"application/vnd.wqd": {
				"extensions": ["wqd"]
			},
			"application/vnd.wt.stf": {
				"extensions": ["stf"]
			},
			"application/vnd.xara": {
				"extensions": ["xar"]
			},
			"application/vnd.xfdl": {
				"extensions": ["xfdl"]
			},
			"application/vnd.yamaha.hv-dic": {
				"extensions": ["hvd"]
			},
			"application/vnd.yamaha.hv-script": {
				"extensions": ["hvs"]
			},
			"application/vnd.yamaha.hv-voice": {
				"extensions": ["hvp"]
			},
			"application/vnd.yamaha.openscoreformat": {
				"extensions": ["osf"]
			},
			"application/vnd.yamaha.openscoreformat.osfpvg+xml": {
				"extensions": ["osfpvg"]
			},
			"application/vnd.yamaha.smaf-audio": {
				"extensions": ["saf"]
			},
			"application/vnd.yamaha.smaf-phrase": {
				"extensions": ["spf"]
			},
			"application/vnd.yellowriver-custom-menu": {
				"extensions": ["cmp"]
			},
			"application/vnd.zul": {
				"extensions": ["zir","zirz"]
			},
			"application/vnd.zzazz.deck+xml": {
				"extensions": ["zaz"]
			},
			"application/voicexml+xml": {
				"extensions": ["vxml"]
			},
			"application/widget": {
				"extensions": ["wgt"]
			},
			"application/winhlp": {
				"extensions": ["hlp"]
			},
			"application/wsdl+xml": {
				"extensions": ["wsdl"]
			},
			"application/wspolicy+xml": {
				"extensions": ["wspolicy"]
			},
			"application/x-7z-compressed": {
				"compressible": false,
				"extensions": ["7z"]
			},
			"application/x-abiword": {
				"extensions": ["abw"]
			},
			"application/x-ace-compressed": {
				"extensions": ["ace"]
			},
			"application/x-apple-diskimage": {
				"extensions": ["dmg"]
			},
			"application/x-authorware-bin": {
				"extensions": ["aab","x32","u32","vox"]
			},
			"application/x-authorware-map": {
				"extensions": ["aam"]
			},
			"application/x-authorware-seg": {
				"extensions": ["aas"]
			},
			"application/x-bcpio": {
				"extensions": ["bcpio"]
			},
			"application/x-bdoc": {
				"compressible": false,
				"extensions": ["bdoc"]
			},
			"application/x-bittorrent": {
				"extensions": ["torrent"]
			},
			"application/x-blorb": {
				"extensions": ["blb","blorb"]
			},
			"application/x-bzip": {
				"compressible": false,
				"extensions": ["bz"]
			},
			"application/x-bzip2": {
				"compressible": false,
				"extensions": ["bz2","boz"]
			},
			"application/x-cbr": {
				"extensions": ["cbr","cba","cbt","cbz","cb7"]
			},
			"application/x-cdlink": {
				"extensions": ["vcd"]
			},
			"application/x-cfs-compressed": {
				"extensions": ["cfs"]
			},
			"application/x-chat": {
				"extensions": ["chat"]
			},
			"application/x-chess-pgn": {
				"extensions": ["pgn"]
			},
			"application/x-chrome-extension": {
				"extensions": ["crx"]
			},
			"application/x-cocoa": {
				"source": "nginx",
				"extensions": ["cco"]
			},
			"application/x-conference": {
				"extensions": ["nsc"]
			},
			"application/x-cpio": {
				"extensions": ["cpio"]
			},
			"application/x-csh": {
				"extensions": ["csh"]
			},
			"application/x-debian-package": {
				"extensions": ["deb","udeb"]
			},
			"application/x-dgc-compressed": {
				"extensions": ["dgc"]
			},
			"application/x-director": {
				"extensions": ["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]
			},
			"application/x-doom": {
				"extensions": ["wad"]
			},
			"application/x-dtbncx+xml": {
				"extensions": ["ncx"]
			},
			"application/x-dtbook+xml": {
				"extensions": ["dtb"]
			},
			"application/x-dtbresource+xml": {
				"extensions": ["res"]
			},
			"application/x-dvi": {
				"compressible": false,
				"extensions": ["dvi"]
			},
			"application/x-envoy": {
				"extensions": ["evy"]
			},
			"application/x-eva": {
				"extensions": ["eva"]
			},
			"application/x-font-bdf": {
				"extensions": ["bdf"]
			},
			"application/x-font-ghostscript": {
				"extensions": ["gsf"]
			},
			"application/x-font-linux-psf": {
				"extensions": ["psf"]
			},
			"application/x-font-otf": {
				"compressible": true,
				"extensions": ["otf"]
			},
			"application/x-font-pcf": {
				"extensions": ["pcf"]
			},
			"application/x-font-snf": {
				"extensions": ["snf"]
			},
			"application/x-font-ttf": {
				"compressible": true,
				"extensions": ["ttf","ttc"]
			},
			"application/x-font-type1": {
				"extensions": ["pfa","pfb","pfm","afm"]
			},
			"application/x-freearc": {
				"extensions": ["arc"]
			},
			"application/x-futuresplash": {
				"extensions": ["spl"]
			},
			"application/x-gca-compressed": {
				"extensions": ["gca"]
			},
			"application/x-glulx": {
				"extensions": ["ulx"]
			},
			"application/x-gnumeric": {
				"extensions": ["gnumeric"]
			},
			"application/x-gramps-xml": {
				"extensions": ["gramps"]
			},
			"application/x-gtar": {
				"extensions": ["gtar"]
			},
			"application/x-hdf": {
				"extensions": ["hdf"]
			},
			"application/x-httpd-php": {
				"compressible": true,
				"extensions": ["php"]
			},
			"application/x-install-instructions": {
				"extensions": ["install"]
			},
			"application/x-iso9660-image": {
				"extensions": ["iso"]
			},
			"application/x-java-archive-diff": {
				"source": "nginx",
				"extensions": ["jardiff"]
			},
			"application/x-java-jnlp-file": {
				"compressible": false,
				"extensions": ["jnlp"]
			},
			"application/x-latex": {
				"compressible": false,
				"extensions": ["latex"]
			},
			"application/x-lua-bytecode": {
				"extensions": ["luac"]
			},
			"application/x-lzh-compressed": {
				"extensions": ["lzh","lha"]
			},
			"application/x-makeself": {
				"source": "nginx",
				"extensions": ["run"]
			},
			"application/x-mie": {
				"extensions": ["mie"]
			},
			"application/x-mobipocket-ebook": {
				"extensions": ["prc","mobi"]
			},
			"application/x-ms-application": {
				"extensions": ["application"]
			},
			"application/x-ms-shortcut": {
				"extensions": ["lnk"]
			},
			"application/x-ms-wmd": {
				"extensions": ["wmd"]
			},
			"application/x-ms-wmz": {
				"extensions": ["wmz"]
			},
			"application/x-ms-xbap": {
				"extensions": ["xbap"]
			},
			"application/x-msaccess": {
				"extensions": ["mdb"]
			},
			"application/x-msbinder": {
				"extensions": ["obd"]
			},
			"application/x-mscardfile": {
				"extensions": ["crd"]
			},
			"application/x-msclip": {
				"extensions": ["clp"]
			},
			"application/x-msdos-program": {
				"extensions": ["exe"]
			},
			"application/x-msdownload": {
				"extensions": ["exe","dll","com","bat","msi"]
			},
			"application/x-msmediaview": {
				"extensions": ["mvb","m13","m14"]
			},
			"application/x-msmetafile": {
				"extensions": ["wmf","wmz","emf","emz"]
			},
			"application/x-msmoney": {
				"extensions": ["mny"]
			},
			"application/x-mspublisher": {
				"extensions": ["pub"]
			},
			"application/x-msschedule": {
				"extensions": ["scd"]
			},
			"application/x-msterminal": {
				"extensions": ["trm"]
			},
			"application/x-mswrite": {
				"extensions": ["wri"]
			},
			"application/x-netcdf": {
				"extensions": ["nc","cdf"]
			},
			"application/x-ns-proxy-autoconfig": {
				"compressible": true,
				"extensions": ["pac"]
			},
			"application/x-nzb": {
				"extensions": ["nzb"]
			},
			"application/x-perl": {
				"source": "nginx",
				"extensions": ["pl","pm"]
			},
			"application/x-pilot": {
				"source": "nginx",
				"extensions": ["prc","pdb"]
			},
			"application/x-pkcs12": {
				"compressible": false,
				"extensions": ["p12","pfx"]
			},
			"application/x-pkcs7-certificates": {
				"extensions": ["p7b","spc"]
			},
			"application/x-pkcs7-certreqresp": {
				"extensions": ["p7r"]
			},
			"application/x-rar-compressed": {
				"compressible": false,
				"extensions": ["rar"]
			},
			"application/x-redhat-package-manager": {
				"source": "nginx",
				"extensions": ["rpm"]
			},
			"application/x-research-info-systems": {
				"extensions": ["ris"]
			},
			"application/x-sea": {
				"source": "nginx",
				"extensions": ["sea"]
			},
			"application/x-sh": {
				"compressible": true,
				"extensions": ["sh"]
			},
			"application/x-shar": {
				"extensions": ["shar"]
			},
			"application/x-shockwave-flash": {
				"compressible": false,
				"extensions": ["swf"]
			},
			"application/x-silverlight-app": {
				"extensions": ["xap"]
			},
			"application/x-sql": {
				"extensions": ["sql"]
			},
			"application/x-stuffit": {
				"compressible": false,
				"extensions": ["sit"]
			},
			"application/x-stuffitx": {
				"extensions": ["sitx"]
			},
			"application/x-subrip": {
				"extensions": ["srt"]
			},
			"application/x-sv4cpio": {
				"extensions": ["sv4cpio"]
			},
			"application/x-sv4crc": {
				"extensions": ["sv4crc"]
			},
			"application/x-t3vm-image": {
				"extensions": ["t3"]
			},
			"application/x-tads": {
				"extensions": ["gam"]
			},
			"application/x-tar": {
				"compressible": true,
				"extensions": ["tar"]
			},
			"application/x-tcl": {
				"extensions": ["tcl","tk"]
			},
			"application/x-tex": {
				"extensions": ["tex"]
			},
			"application/x-tex-tfm": {
				"extensions": ["tfm"]
			},
			"application/x-texinfo": {
				"extensions": ["texinfo","texi"]
			},
			"application/x-tgif": {
				"extensions": ["obj"]
			},
			"application/x-ustar": {
				"extensions": ["ustar"]
			},
			"application/x-wais-source": {
				"extensions": ["src"]
			},
			"application/x-web-app-manifest+json": {
				"compressible": true,
				"extensions": ["webapp"]
			},
			"application/x-x509-ca-cert": {
				"extensions": ["der","crt","pem"]
			},
			"application/x-xfig": {
				"extensions": ["fig"]
			},
			"application/x-xliff+xml": {
				"extensions": ["xlf"]
			},
			"application/x-xpinstall": {
				"compressible": false,
				"extensions": ["xpi"]
			},
			"application/x-xz": {
				"extensions": ["xz"]
			},
			"application/x-zmachine": {
				"extensions": ["z1","z2","z3","z4","z5","z6","z7","z8"]
			},
			"application/xaml+xml": {
				"extensions": ["xaml"]
			},
			"application/xcap-diff+xml": {
				"extensions": ["xdf"]
			},
			"application/xenc+xml": {
				"extensions": ["xenc"]
			},
			"application/xhtml+xml": {
				"compressible": true,
				"extensions": ["xhtml","xht"]
			},
			"application/xml": {
				"compressible": true,
				"extensions": ["xml","xsl","xsd","rng"]
			},
			"application/xml-dtd": {
				"compressible": true,
				"extensions": ["dtd"]
			},
			"application/xop+xml": {
				"compressible": true,
				"extensions": ["xop"]
			},
			"application/xproc+xml": {
				"extensions": ["xpl"]
			},
			"application/xslt+xml": {
				"extensions": ["xslt"]
			},
			"application/xspf+xml": {
				"extensions": ["xspf"]
			},
			"application/xv+xml": {
				"extensions": ["mxml","xhvml","xvml","xvm"]
			},
			"application/yang": {
				"extensions": ["yang"]
			},
			"application/yin+xml": {
				"extensions": ["yin"]
			},
			"application/zip": {
				"compressible": false,
				"extensions": ["zip"]
			},
			"audio/3gpp": {
				"compressible": false,
				"extensions": ["3gpp"]
			},
			"audio/adpcm": {
				"extensions": ["adp"]
			},
			"audio/basic": {
				"compressible": false,
				"extensions": ["au","snd"]
			},
			"audio/midi": {
				"extensions": ["mid","midi","kar","rmi"]
			},
			"audio/mp4": {
				"compressible": false,
				"extensions": ["m4a","mp4a"]
			},
			"audio/mpeg": {
				"compressible": false,
				"extensions": ["mpga","mp2","mp2a","mp3","m2a","m3a"]
			},
			"audio/ogg": {
				"compressible": false,
				"extensions": ["oga","ogg","spx"]
			},
			"audio/s3m": {
				"extensions": ["s3m"]
			},
			"audio/silk": {
				"extensions": ["sil"]
			},
			"audio/vnd.dece.audio": {
				"extensions": ["uva","uvva"]
			},
			"audio/vnd.digital-winds": {
				"extensions": ["eol"]
			},
			"audio/vnd.dra": {
				"extensions": ["dra"]
			},
			"audio/vnd.dts": {
				"extensions": ["dts"]
			},
			"audio/vnd.dts.hd": {
				"extensions": ["dtshd"]
			},
			"audio/vnd.lucent.voice": {
				"extensions": ["lvp"]
			},
			"audio/vnd.ms-playready.media.pya": {
				"extensions": ["pya"]
			},
			"audio/vnd.nuera.ecelp4800": {
				"extensions": ["ecelp4800"]
			},
			"audio/vnd.nuera.ecelp7470": {
				"extensions": ["ecelp7470"]
			},
			"audio/vnd.nuera.ecelp9600": {
				"extensions": ["ecelp9600"]
			},
			"audio/vnd.rip": {
				"extensions": ["rip"]
			},
			"audio/wav": {
				"compressible": false,
				"extensions": ["wav"]
			},
			"audio/wave": {
				"compressible": false,
				"extensions": ["wav"]
			},
			"audio/webm": {
				"compressible": false,
				"extensions": ["weba"]
			},
			"audio/x-aac": {
				"compressible": false,
				"extensions": ["aac"]
			},
			"audio/x-aiff": {
				"extensions": ["aif","aiff","aifc"]
			},
			"audio/x-caf": {
				"compressible": false,
				"extensions": ["caf"]
			},
			"audio/x-flac": {
				"extensions": ["flac"]
			},
			"audio/x-m4a": {
				"source": "nginx",
				"extensions": ["m4a"]
			},
			"audio/x-matroska": {
				"extensions": ["mka"]
			},
			"audio/x-mpegurl": {
				"extensions": ["m3u"]
			},
			"audio/x-ms-wax": {
				"extensions": ["wax"]
			},
			"audio/x-ms-wma": {
				"extensions": ["wma"]
			},
			"audio/x-pn-realaudio": {
				"extensions": ["ram","ra"]
			},
			"audio/x-pn-realaudio-plugin": {
				"extensions": ["rmp"]
			},
			"audio/x-realaudio": {
				"source": "nginx",
				"extensions": ["ra"]
			},
			"audio/x-wav": {
				"extensions": ["wav"]
			},
			"audio/xm": {
				"extensions": ["xm"]
			},
			"chemical/x-cdx": {
				"extensions": ["cdx"]
			},
			"chemical/x-cif": {
				"extensions": ["cif"]
			},
			"chemical/x-cmdf": {
				"extensions": ["cmdf"]
			},
			"chemical/x-cml": {
				"extensions": ["cml"]
			},
			"chemical/x-csml": {
				"extensions": ["csml"]
			},
			"chemical/x-xyz": {
				"extensions": ["xyz"]
			},
			"font/opentype": {
				"compressible": true,
				"extensions": ["otf"]
			},
			"image/bmp": {
				"compressible": true,
				"extensions": ["bmp"]
			},
			"image/cgm": {
				"extensions": ["cgm"]
			},
			"image/g3fax": {
				"extensions": ["g3"]
			},
			"image/gif": {
				"compressible": false,
				"extensions": ["gif"]
			},
			"image/ief": {
				"extensions": ["ief"]
			},
			"image/jpeg": {
				"compressible": false,
				"extensions": ["jpeg","jpg","jpe"]
			},
			"image/ktx": {
				"extensions": ["ktx"]
			},
			"image/png": {
				"compressible": false,
				"extensions": ["png"]
			},
			"image/prs.btif": {
				"extensions": ["btif"]
			},
			"image/sgi": {
				"extensions": ["sgi"]
			},
			"image/svg+xml": {
				"compressible": true,
				"extensions": ["svg","svgz"]
			},
			"image/tiff": {
				"compressible": false,
				"extensions": ["tiff","tif"]
			},
			"image/vnd.adobe.photoshop": {
				"compressible": true,
				"extensions": ["psd"]
			},
			"image/vnd.dece.graphic": {
				"extensions": ["uvi","uvvi","uvg","uvvg"]
			},
			"image/vnd.djvu": {
				"extensions": ["djvu","djv"]
			},
			"image/vnd.dvb.subtitle": {
				"extensions": ["sub"]
			},
			"image/vnd.dwg": {
				"extensions": ["dwg"]
			},
			"image/vnd.dxf": {
				"extensions": ["dxf"]
			},
			"image/vnd.fastbidsheet": {
				"extensions": ["fbs"]
			},
			"image/vnd.fpx": {
				"extensions": ["fpx"]
			},
			"image/vnd.fst": {
				"extensions": ["fst"]
			},
			"image/vnd.fujixerox.edmics-mmr": {
				"extensions": ["mmr"]
			},
			"image/vnd.fujixerox.edmics-rlc": {
				"extensions": ["rlc"]
			},
			"image/vnd.ms-modi": {
				"extensions": ["mdi"]
			},
			"image/vnd.ms-photo": {
				"extensions": ["wdp"]
			},
			"image/vnd.net-fpx": {
				"extensions": ["npx"]
			},
			"image/vnd.wap.wbmp": {
				"extensions": ["wbmp"]
			},
			"image/vnd.xiff": {
				"extensions": ["xif"]
			},
			"image/webp": {
				"extensions": ["webp"]
			},
			"image/x-3ds": {
				"extensions": ["3ds"]
			},
			"image/x-cmu-raster": {
				"extensions": ["ras"]
			},
			"image/x-cmx": {
				"extensions": ["cmx"]
			},
			"image/x-freehand": {
				"extensions": ["fh","fhc","fh4","fh5","fh7"]
			},
			"image/x-icon": {
				"compressible": true,
				"extensions": ["ico"]
			},
			"image/x-jng": {
				"source": "nginx",
				"extensions": ["jng"]
			},
			"image/x-mrsid-image": {
				"extensions": ["sid"]
			},
			"image/x-ms-bmp": {
				"source": "nginx",
				"compressible": true,
				"extensions": ["bmp"]
			},
			"image/x-pcx": {
				"extensions": ["pcx"]
			},
			"image/x-pict": {
				"extensions": ["pic","pct"]
			},
			"image/x-portable-anymap": {
				"extensions": ["pnm"]
			},
			"image/x-portable-bitmap": {
				"extensions": ["pbm"]
			},
			"image/x-portable-graymap": {
				"extensions": ["pgm"]
			},
			"image/x-portable-pixmap": {
				"extensions": ["ppm"]
			},
			"image/x-rgb": {
				"extensions": ["rgb"]
			},
			"image/x-tga": {
				"extensions": ["tga"]
			},
			"image/x-xbitmap": {
				"extensions": ["xbm"]
			},
			"image/x-xpixmap": {
				"extensions": ["xpm"]
			},
			"image/x-xwindowdump": {
				"extensions": ["xwd"]
			},
			"message/rfc822": {
				"compressible": true,
				"extensions": ["eml","mime"]
			},
			"model/iges": {
				"compressible": false,
				"extensions": ["igs","iges"]
			},
			"model/mesh": {
				"compressible": false,
				"extensions": ["msh","mesh","silo"]
			},
			"model/vnd.collada+xml": {
				"extensions": ["dae"]
			},
			"model/vnd.dwf": {
				"extensions": ["dwf"]
			},
			"model/vnd.gdl": {
				"extensions": ["gdl"]
			},
			"model/vnd.gtw": {
				"extensions": ["gtw"]
			},
			"model/vnd.mts": {
				"extensions": ["mts"]
			},
			"model/vnd.vtu": {
				"extensions": ["vtu"]
			},
			"model/vrml": {
				"compressible": false,
				"extensions": ["wrl","vrml"]
			},
			"model/x3d+binary": {
				"compressible": false,
				"extensions": ["x3db","x3dbz"]
			},
			"model/x3d+vrml": {
				"compressible": false,
				"extensions": ["x3dv","x3dvz"]
			},
			"model/x3d+xml": {
				"compressible": true,
				"extensions": ["x3d","x3dz"]
			},
			"text/cache-manifest": {
				"compressible": true,
				"extensions": ["appcache","manifest"]
			},
			"text/calendar": {
				"extensions": ["ics","ifb"]
			},
			"text/coffeescript": {
				"extensions": ["coffee","litcoffee"]
			},
			"text/css": {
				"compressible": true,
				"extensions": ["css"]
			},
			"text/csv": {
				"compressible": true,
				"extensions": ["csv"]
			},
			"text/hjson": {
				"extensions": ["hjson"]
			},
			"text/html": {
				"compressible": true,
				"extensions": ["html","htm","shtml"]
			},
			"text/jade": {
				"extensions": ["jade"]
			},
			"text/jsx": {
				"compressible": true,
				"extensions": ["jsx"]
			},
			"text/less": {
				"extensions": ["less"]
			},
			"text/mathml": {
				"source": "nginx",
				"extensions": ["mml"]
			},
			"text/n3": {
				"compressible": true,
				"extensions": ["n3"]
			},
			"text/plain": {
				"compressible": true,
				"extensions": ["txt","text","conf","def","list","log","in","ini"]
			},
			"text/prs.lines.tag": {
				"extensions": ["dsc"]
			},
			"text/richtext": {
				"compressible": true,
				"extensions": ["rtx"]
			},
			"text/rtf": {
				"compressible": true,
				"extensions": ["rtf"]
			},
			"text/sgml": {
				"extensions": ["sgml","sgm"]
			},
			"text/slim": {
				"extensions": ["slim","slm"]
			},
			"text/stylus": {
				"extensions": ["stylus","styl"]
			},
			"text/tab-separated-values": {
				"compressible": true,
				"extensions": ["tsv"]
			},
			"text/troff": {
				"extensions": ["t","tr","roff","man","me","ms"]
			},
			"text/turtle": {
				"extensions": ["ttl"]
			},
			"text/uri-list": {
				"compressible": true,
				"extensions": ["uri","uris","urls"]
			},
			"text/vcard": {
				"compressible": true,
				"extensions": ["vcard"]
			},
			"text/vnd.curl": {
				"extensions": ["curl"]
			},
			"text/vnd.curl.dcurl": {
				"extensions": ["dcurl"]
			},
			"text/vnd.curl.mcurl": {
				"extensions": ["mcurl"]
			},
			"text/vnd.curl.scurl": {
				"extensions": ["scurl"]
			},
			"text/vnd.dvb.subtitle": {
				"extensions": ["sub"]
			},
			"text/vnd.fly": {
				"extensions": ["fly"]
			},
			"text/vnd.fmi.flexstor": {
				"extensions": ["flx"]
			},
			"text/vnd.graphviz": {
				"extensions": ["gv"]
			},
			"text/vnd.in3d.3dml": {
				"extensions": ["3dml"]
			},
			"text/vnd.in3d.spot": {
				"extensions": ["spot"]
			},
			"text/vnd.sun.j2me.app-descriptor": {
				"extensions": ["jad"]
			},
			"text/vnd.wap.wml": {
				"extensions": ["wml"]
			},
			"text/vnd.wap.wmlscript": {
				"extensions": ["wmls"]
			},
			"text/vtt": {
				"charset": "UTF-8",
				"compressible": true,
				"extensions": ["vtt"]
			},
			"text/x-asm": {
				"extensions": ["s","asm"]
			},
			"text/x-c": {
				"extensions": ["c","cc","cxx","cpp","h","hh","dic"]
			},
			"text/x-component": {
				"source": "nginx",
				"extensions": ["htc"]
			},
			"text/x-fortran": {
				"extensions": ["f","for","f77","f90"]
			},
			"text/x-handlebars-template": {
				"extensions": ["hbs"]
			},
			"text/x-java-source": {
				"extensions": ["java"]
			},
			"text/x-lua": {
				"extensions": ["lua"]
			},
			"text/x-markdown": {
				"compressible": true,
				"extensions": ["markdown","md","mkd"]
			},
			"text/x-nfo": {
				"extensions": ["nfo"]
			},
			"text/x-opml": {
				"extensions": ["opml"]
			},
			"text/x-pascal": {
				"extensions": ["p","pas"]
			},
			"text/x-processing": {
				"compressible": true,
				"extensions": ["pde"]
			},
			"text/x-sass": {
				"extensions": ["sass"]
			},
			"text/x-scss": {
				"extensions": ["scss"]
			},
			"text/x-setext": {
				"extensions": ["etx"]
			},
			"text/x-sfv": {
				"extensions": ["sfv"]
			},
			"text/x-suse-ymp": {
				"compressible": true,
				"extensions": ["ymp"]
			},
			"text/x-uuencode": {
				"extensions": ["uu"]
			},
			"text/x-vcalendar": {
				"extensions": ["vcs"]
			},
			"text/x-vcard": {
				"extensions": ["vcf"]
			},
			"text/xml": {
				"source": "iana",
				"compressible": true,
				"extensions": ["xml"]
			},
			"text/yaml": {
				"extensions": ["yaml","yml"]
			},
			"video/3gpp": {
				"extensions": ["3gp","3gpp"]
			},
			"video/3gpp2": {
				"extensions": ["3g2"]
			},
			"video/h261": {
				"extensions": ["h261"]
			},
			"video/h263": {
				"extensions": ["h263"]
			},
			"video/h264": {
				"extensions": ["h264"]
			},
			"video/jpeg": {
				"extensions": ["jpgv"]
			},
			"video/jpm": {
				"extensions": ["jpm","jpgm"]
			},
			"video/mj2": {
				"extensions": ["mj2","mjp2"]
			},
			"video/mp2t": {
				"extensions": ["ts"]
			},
			"video/mp4": {
				"compressible": false,
				"extensions": ["mp4","mp4v","mpg4"]
			},
			"video/mpeg": {
				"compressible": false,
				"extensions": ["mpeg","mpg","mpe","m1v","m2v"]
			},
			"video/ogg": {
				"compressible": false,
				"extensions": ["ogv"]
			},
			"video/quicktime": {
				"compressible": false,
				"extensions": ["qt","mov"]
			},
			"video/vnd.dece.hd": {
				"extensions": ["uvh","uvvh"]
			},
			"video/vnd.dece.mobile": {
				"extensions": ["uvm","uvvm"]
			},
			"video/vnd.dece.pd": {
				"extensions": ["uvp","uvvp"]
			},
			"video/vnd.dece.sd": {
				"extensions": ["uvs","uvvs"]
			},
			"video/vnd.dece.video": {
				"extensions": ["uvv","uvvv"]
			},
			"video/vnd.dvb.file": {
				"extensions": ["dvb"]
			},
			"video/vnd.fvt": {
				"extensions": ["fvt"]
			},
			"video/vnd.mpegurl": {
				"extensions": ["mxu","m4u"]
			},
			"video/vnd.ms-playready.media.pyv": {
				"extensions": ["pyv"]
			},
			"video/vnd.uvvu.mp4": {
				"extensions": ["uvu","uvvu"]
			},
			"video/vnd.vivo": {
				"extensions": ["viv"]
			},
			"video/webm": {
				"compressible": false,
				"extensions": ["webm"]
			},
			"video/x-f4v": {
				"extensions": ["f4v"]
			},
			"video/x-fli": {
				"extensions": ["fli"]
			},
			"video/x-flv": {
				"compressible": false,
				"extensions": ["flv"]
			},
			"video/x-m4v": {
				"extensions": ["m4v"]
			},
			"video/x-matroska": {
				"compressible": false,
				"extensions": ["mkv","mk3d","mks"]
			},
			"video/x-mng": {
				"extensions": ["mng"]
			},
			"video/x-ms-asf": {
				"extensions": ["asf","asx"]
			},
			"video/x-ms-vob": {
				"extensions": ["vob"]
			},
			"video/x-ms-wm": {
				"extensions": ["wm"]
			},
			"video/x-ms-wmv": {
				"compressible": false,
				"extensions": ["wmv"]
			},
			"video/x-ms-wmx": {
				"extensions": ["wmx"]
			},
			"video/x-ms-wvx": {
				"extensions": ["wvx"]
			},
			"video/x-msvideo": {
				"extensions": ["avi"]
			},
			"video/x-sgi-movie": {
				"extensions": ["movie"]
			},
			"video/x-smv": {
				"extensions": ["smv"]
			},
			"x-conference/x-cooltalk": {
				"extensions": ["ice"]
			}
		}
	},

	mime_lookup: {
		value: function (ext) {

			if(!ext)
				return "application/octet-stream";

			ext = ext.toLowerCase();

			for(var mtype in this.mime_db){
				if(this.mime_db[mtype].extensions && this.mime_db[mtype].extensions.indexOf(ext) != -1)
					return mtype;
			}

			return "application/octet-stream";
		}
	}
});

return $p;
}));
