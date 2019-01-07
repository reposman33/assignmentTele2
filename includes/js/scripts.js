(function(){

	var result={};
	var _data={};
	_data.phoneInfo = {};
	_data.phoneInfoFields = ["name","price"];
	_data.phoneInfoDetailedFields = ["name","price","subscription_type"];
	_data.url = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
	//Ajax call met tele2url geeft error: "XMLHttpRequest cannot load https://www.tele2.nl/shop/jsonApi/index.php?dc=_0.3901725795585662. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost' is therefore not allowed access.
	_data.tele2Url="https://www.tele2.nl/shop/jsonApi/index.php";
	//  b laad data van local filesystem
	_data.localFile = _data.url + "/includes/phoneData.txt";

	// jsonp met vanilla JavaScript....
	function getDataXDomain(url){
		var scriptId = "tele2PhoneFinderFeed";
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		script.id = scriptId;
		document.getElementsByTagName("head")[0].appendChild(script);
		// how to consume loaded scipt data??
	};

	// Ajax met vanilla JavaScript
	function getData(url,callBack){
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function(){
			 if (xmlHttp.readyState==4 && xmlHttp.status==200){
			 	if(callBack){
				 	callBack(xmlHttp.responseText);
			 	}
			 }
		};
		xmlHttp.open("GET",url + "?dc=_" + Math.random(),true);
		//xmlHttp.setRequestHeader("Access-Control-Allow-Origin","*");
		xmlHttp.send();
	};


	// meerdere window.onload functies gebruiken...
	function addOnLoad(func){
		var oldOnLoad = window.onload;
		// als window.omload niet bestaat...
		if(typeof window.onload != "function"){
			// is dit de nieuwe window.onload
			window.onload = func;
		}
		else{
			window.onload = function(){
				// voer bestaande window.onload uit (eerst ff checken...)
				if(oldOnLoad){
					oldOnLoad();
				}
				// met de nieuwe functie
				func();
			};
		};
	};

	// laad de json data
	function getPhoneData(url,callBack){
		getData(url,callBack);
		//getDataXDomain(url);
	};


	// verwerk de json data
	function loadData(data){
		// laad kleine boxes
		// laad grote boxes
		var divsBig = document.getElementsByClassName("cols4");
		var divsSmall = document.getElementsByClassName("cols8");
		var divs = [];
		divs = appendArray(divs,divsSmall);
		divs = appendArray(divs,divsBig);
		var jsonData = JSON.parse(data);
		var j=0;
		lengthJsonData=jsonData.length;
		var i=0;
		var lengthDivs=divs.length;
		// voor elke box
		for(; i<lengthDivs; i++){
			// toon een telefoon image
			for(; j<lengthJsonData;j++){
				if(typeof jsonData[j].colors != "undefined" &&
					jsonData[j].colors.length > 0 &&
					typeof jsonData[j].colors[0].images != "undefined" &&
					jsonData[j].colors[0].images.length > 0){
						// toon image
						divs[i].style.backgroundImage = "url('" + jsonData[j].colors[0].images[0].thumb_url + "')";
						divs[i].style.backgroundSize = 'contain';
						divs[i].style.backgroundRepeat = "no-repeat";
						divs[i].style.backgroundPosition = "center";
						// tag div met pone_id voor latere identificatie
						var phoneId = document.createAttribute("phoneId");
						phoneId.value = jsonData[j].entity_id;
						divs[i].setAttributeNode(phoneId);
						// sla te tonen info op voor deze telefoon
						var fields = ["cols8","cols8 first","cols8 last"].indexOf(divs[i].className) > -1 ?
							_data.phoneInfoFields :
							_data.phoneInfoDetailedFields;
						var _phoneInfo = {};
						for(var k = 0,length = fields.length; k < length; k++){
							_phoneInfo[fields[k]] = jsonData[j][fields[k]];
						}
						_data.phoneInfo[jsonData[j].entity_id] = _phoneInfo;

						// toon volgende telefoon image in volgende box
						j++;
						break;
				}
			}
		}
		
		initSelect();

	};


	// utility functie om collecties te combineren
	function appendArray(arr,collection){
		for(var i=0,length=collection.length;i<length;i++){
			arr.push(collection[i]);
		}
		return arr;
	};


	function showPhoneInfo(elementClassname,infoFunction){
		var elements = document.getElementsByClassName(elementClassname);
		for(var i=0,length=elements.length; i<length; i++){
			if(elements[i].addEventListener){
				elements[i].addEventListener("mouseover",function(){infoFunction(this.getAttribute("phoneId"))},true);
				elements[i].addEventListener("mouseout",function(){removePhoneInfo(this.getAttribute("phoneId"))},true);
			}
			else if(elements[i].attachEvent){
				elements[i].attachEvent("onmouseover",function(){infoFunction(this.getAttribute("phoneId"))});
				elements[i].attachEvent("onmouseout",function(){removePhoneInfo(this.getAttribute("phoneId"))});
			}
		}
	};


	function getElementByAttributeValue(attr,value){
		var els = document.getElementsByTagName("*");
		for(var i=0,length=els.length;i<length;i++){
			if(els[i].getAttribute(attr)==value){
				return els[i];
			}
		}
	}


	function showInfo(phoneId){
		var target = getElementByAttributeValue("phoneId",phoneId);
		var infoDiv = document.getElementById("footer");

		if(!target){
			console.log("element with phoneId="+phoneId+"not found!")
			return;
		}
		target.className += target.className.indexOf("phoneImageSelected") > -1 ?
							"" :
							" phoneImageSelected";

		infoDiv.innerHTML = "";
		infoDiv.className = "phoneInfoField";
		for(var field in _data.phoneInfo[phoneId]){
			infoDiv.innerHTML += "<span class='phoneInfoLabel'>" + field + ":</span>" + "<span class='phoneInfoValue'>" + _data.phoneInfo[phoneId][field] + "</span><br>";
		}
		//update de select box
		document.getElementById("phoneSelector").value = phoneId;
	};


	function removePhoneInfo(phoneId){
		var infoField = document.getElementById("footer");
		infoField.innerHTML = "";
		infoField.className = "_footer";

		getElementByAttributeValue("phoneId",phoneId).classList.remove("phoneImageSelected");

		//update de select box
		document.getElementById("phoneSelector").value = "";
	}


	function initSelect(){
		// populate select
		var select = document.getElementById("phoneSelector");
		for(var field in _data.phoneInfo){
			select.options.add(new Option(_data.phoneInfo[field]["name"],field));
		}
		if(select.addEventListener){
			select.addEventListener("change",function(){showInfo(select.value)},false);
		}
		else if(select.attachEvent){
			select.attachEvent("onchange",function(){showInfo(select.value)});
		}
	};

	
	function init(){
		addOnLoad(
			function(){
				getPhoneData(_data.localFile, loadData);
				showPhoneInfo("cols8",showInfo);	
				showPhoneInfo("cols4",showInfo);
			});
	};

	init();

}());

