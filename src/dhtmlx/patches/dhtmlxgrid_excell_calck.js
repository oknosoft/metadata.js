/*
 Product Name: dhtmlxSuite
 Version: 4.1.3
 Edition: Professional
 License: content of this file is covered by DHTMLX Commercial or Enterprise license. Usage without proper license is prohibited. To obtain it contact sales@dhtmlx.com
 Copyright UAB Dinamenta http://www.dhtmlx.com
 */

/**
 *	@desc: calculator editor
 *	@returns: dhtmlxGrid cell editor object
 *	@type: public
 */
function eXcell_calck(cell){
	try{
		this.cell = cell;
		this.grid = this.cell.parentNode.grid;
	}catch(er){}
	this.edit = function(){
		this.val = this.getValue();

		var arPos = this.grid.getPosition(this.cell);
		this.obj = new calcX(arPos[0], arPos[1], this, this.val); // arPos[1]+this.cell.offsetHeight
		this.obj.old_value = this.val;
	};
	this.getValue = function(){
		//this.grid.editStop();
		return this.grid._aplNFb ? this.grid._aplNFb(this.cell.innerHTML.toString()._dhx_trim(),this.cell._cellIndex) : this.cell.value;
	};
	this.detach = function(){
		if (this.obj) {
			this.setValue(this.obj.inputZone.value);
			this.obj.removeSelf();
		}
		this.obj=null;
		return this.val!=this.getValue();
	};

	function calcX(left, top, onReturnSub, val){
		this.top=(top||0);
		this.left=left||0;
		this.onReturnSub=onReturnSub||null;

		this.operandA=0;
		this.operandB=0;
		this.operatorA="";
		this.state=0;
		this.dotState=0;

		var that = this;

		function out_click(e){
			if(e.target != that.onReturnSub.cell && e.path.indexOf(that.topNod) == -1){
				that.removeSelf();
				that.onReturnSub.grid.editStop(false);
			}
		}

		if(!onReturnSub.grid._aplNFb)
			document.addEventListener('click', out_click, false);


		this.calckGo=function(){
			return Math.round((eval((this.operandA || "0")+"*1"+this.operatorA+this.operandB+"*1"))*1000)/1000;
		};

		this.isNumeric=function(str){
			return ((str.search(/[^1234567890]/gi)==-1)?(true):(false));
		};
		this.isOperation=function(str){
			return ((str.search(/[^\+\*\-\/]/gi)==-1)?(true):(false));
		};
		this.onCalcKey=function(e)
		{
			var z=this.innerHTML,
				rZone=that.inputZone;

			if (((that.state==0)||(that.state==2))&&(that.isNumeric(z))){
				if(!((e||event) instanceof KeyboardEvent)){
					(e||event).preventDefault();
					if (rZone.value!="0"){
						if(rZone.selectionStart == rZone.selectionEnd)  //rZone.readOnly || 
							rZone.value+=z;
						else
							rZone.value= rZone.value.substr(0, rZone.selectionStart) + z + rZone.value.substr(rZone.selectionEnd);
					}

					else rZone.value=z;
				}
			}else
				(e||event).preventDefault();

			if ((((that.state==0)||(that.state==2))&&(z=='.'))&&(that.dotState==0)) {
				that.dotState=1;
				rZone.value+=z;
			}
			if ((z=="±"))  {
				rZone.value=rZone.value*(-1);
				//that.dotState=0;
				that.state=0;
			}
			if ((that.state==0)&&(that.isOperation(z)))  { that.operatorA=z;  that.operandA=rZone.value; that.state=1; }
			if ((that.state==2)&&(that.isOperation(z)))  { that.operandB=rZone.value; rZone.value=that.calckGo(); that.operatorA=z;  that.operandA=rZone.value; that.state=1; }
			if ((that.state==2)&&(z=="="))  { that.operandB=rZone.value; rZone.value=that.calckGo(); that.operatorA=z;  that.operandA=rZone.value; that.state=3; }
			if ((that.state==1)&&(that.isNumeric(z))) { rZone.value=z; that.state=2;  that.dotState=0 }
			if ((that.state==3)&&(that.isNumeric(z))) { rZone.value=z; that.state=0; }
			if ((that.state==3)&&(that.isOperation(z))) { that.operatorA=z;  that.operandA=rZone.value; that.state=1; }

			if (z=="C") { rZone.value=0;  if (that.state==1) that.state=2; that.dotState=0   }
			if (z=="π") { rZone.value=Math.PI; if (that.state==1) that.state=2; that.dotState=0  }

			if (z=="Off"){
				rZone.value = that.old_value;
				that.removeSelf();

			}else
				rZone.focus();

			if (e||event)
				(e||event).cancelBubble=true;


		};
		this.sendResult=function(){
			if (that.state==2){
				var rZone=that.inputZone;
				that.operandB=rZone.value;
				rZone.value=that.calckGo();
				that.operatorA=z;
				that.operandA=rZone.value;
				that.state=3; }
			var z=that.inputZone.value;

			if(that.onReturnSub.cell && that.onReturnSub.cell.value != undefined)
				that.onReturnSub.cell.value = z;

			that.removeSelf();
			that.onReturnSub.grid.editStop(false);
		};

		this.removeSelf=function(){
			if (this.topNod.parentNode)
				this.topNod.parentNode.removeChild(this.topNod);

			document.removeEventListener('click', out_click);
		};

		this.keyDown=function(){
			this.className="calcPressed";
		};

		this.keyUp=function(){
			this.className="calcButton";
		};

		this.init_table=function(){

			var table=this.topNod.childNodes[0];

			if ((!table)||(table.tagName!="TABLE"))
				return;
			var root = table.childNodes[0].childNodes;

			for (var i=1; i<root.length; i++)
				for (var j=0; j<root[i].childNodes.length; j++){

					root[i].childNodes[j].onclick=this.onCalcKey;
					root[i].childNodes[j].onmousedown=this.keyDown;
					root[i].childNodes[j].onmouseout=this.keyUp;
					root[i].childNodes[j].onmouseup=this.keyUp;
				}
			this.inputZone=this.topNod.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			if (this.onReturnSub)
			{
				this.topNod.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].onclick=this.sendResult;
				this.topNod.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].calk=this;
			}
			else this.topNod.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].innerHTML="";

			this.inputZone.onkeydown=function(evt){

				var keyCode = evt.keyCode;

				evt.cancelBubble=true;

				function return_prevent(btn){
					if(btn){
						that.keyDown.call(btn, evt);
						that.onCalcKey.call(btn, evt);
						setTimeout(function () {
							that.keyUp.call(btn, evt);
						}, 60);
					}else
						return btn;
				}

				if (keyCode == 13 || keyCode == 9) {
					that.sendResult.call({calk: that});
					return return_prevent(false);

				}else if(keyCode == 27){
					rZone.value = that.old_value;
					that.removeSelf();
					return return_prevent(false);

				}else if(keyCode == 188 || keyCode == 190 || keyCode == 191 || keyCode == 110){
					return return_prevent(root[5].childNodes[1]);	// точка

				}else if(keyCode == 109 || keyCode == 189){
					return return_prevent(root[4].childNodes[3]);	// минус

				}else if(keyCode == 111){
					return return_prevent(root[1].childNodes[3]);	// деление

				}else if(keyCode == 106){
					return return_prevent(root[2].childNodes[3]);	// умножение

				}else if(keyCode == 107 || keyCode == 187){
					return return_prevent(root[3].childNodes[3]);	// плюс

				}else if(keyCode == 96 || keyCode == 48){
					return return_prevent(root[5].childNodes[0]);	// 0

				}else if(keyCode == 97 || keyCode == 49){
					return return_prevent(root[4].childNodes[0]);	// 1

				}else if(keyCode == 98 || keyCode == 50){
					return return_prevent(root[4].childNodes[1]);	// 2

				}else if(keyCode == 99 || keyCode == 51){
					return return_prevent(root[4].childNodes[2]);	// 3

				}else if(keyCode == 100 || keyCode == 52){
					return return_prevent(root[3].childNodes[0]);	// 4

				}else if(keyCode == 101 || keyCode == 53){
					return return_prevent(root[3].childNodes[1]);	// 5

				}else if(keyCode == 102 || keyCode == 54){
					return return_prevent(root[3].childNodes[2]);	// 6

				}else if(keyCode == 103 || keyCode == 55){
					return return_prevent(root[2].childNodes[0]);	// 7

				}else if(keyCode == 104 || keyCode == 56){
					return return_prevent(root[2].childNodes[1]);	// 8

				}else if(keyCode == 105 || keyCode == 57){
					return return_prevent(root[2].childNodes[2]);	// 9

				}else if((keyCode == 8)	// забой
					|| (keyCode == 46) // del
					|| (keyCode >= 16 && keyCode <= 18) // shift-alt-control
					|| (keyCode >= 35 && keyCode <= 40)	// кнопки навигации
					|| (keyCode >= 96 && keyCode <= 105)
					|| (keyCode >= 112 && keyCode <= 123)	// F1-F12
				)
					return;

				else
					return return_prevent(false);

			};
			if($p.job_prm.device_type != "desktop"){
				this.inputZone.readOnly = true;
			}
			that.inputZone.focus();
		};

		this.drawSelf=function(){
			var div=document.createElement("div");
			div.className="calcTable";
			div.style.position="absolute";
			div.style.top=this.top+"px";
			div.style.left=this.left+"px";
			div.innerHTML="<table cellspacing='0' id='calc_01' class='calcTable'><tr><td colspan='4' style='padding: 0px;'><table cellpadding='1' cellspacing='0' width='100%'><tr><td width='100%' style='overflow:hidden; padding: 0px;'><input type='search' class='calcInput' value='0' align='right'></td><td class='calkSubmit'>Ok</td></tr></table></td></tr><tr><td class='calcButton' width='25%'>Off</td><td class='calcButton' width='25%'>C</td><td class='calcButton' width='25%'>π</td><td class='calcButton' width='25%'>/</td></tr><tr><td class='calcButton'>7</td><td class='calcButton'>8</td><td class='calcButton'>9</td><td class='calcButton'>*</td></tr><tr><td class='calcButton'>4</td><td class='calcButton'>5</td><td class='calcButton'>6</td><td class='calcButton'>+</td></tr><tr><td class='calcButton'>1</td><td class='calcButton'>2</td><td class='calcButton'>3</td><td class='calcButton'>-</td></tr><tr><td class='calcButton'>0</td><td class='calcButton'>.</td><td class='calcButton' style='font-family: Arial, Helvetica; font-size: 12pt;'>±</td><td class='calcButton'>=</td></tr></table>";
			div.onclick=function(e){ (e||event).cancelBubble=true; };
			document.body.appendChild(div);
			this.topNod=div;
		};

		this.drawSelf();
		this.init_table();

		if (val){
			var rZone=this.inputZone;
			rZone.value=val*1;
			this.operandA=val*1;
			rZone.select();
			this.state=0;
			this.dotState= this.operandA == Math.round(this.operandA) ? 0 : 1;
		}
		return this;
	};
}

if(!window.eXcell)
	window.eXcell = function eXcell() { };
eXcell_calck.prototype = new eXcell;
eXcell_calck.prototype.setValue = function(val){
	if(!val || val.toString()._dhx_trim()=="")
		val="0";
	else
		val=parseFloat(val);
	if(this.grid._aplNF)
		this.setCValue(this.grid._aplNF(val, this.cell._cellIndex), val);
};


//(c)dhtmlx ltd. www.dhtmlx.com