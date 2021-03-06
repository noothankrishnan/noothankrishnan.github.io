// Author: Noothan Krishnan

'use strict';

var auto, myJson, minus = 1,
    plus = -1,error=0,sortStatus=false,
    unSortedJson = [];

function doRoute(){
    document.querySelector('.showdata').innerHTML = "";
    document.querySelector('.error').innerHTML="";
    var str=document.querySelector('#url').value;

    if (str.trim().substr(0,4)==='http'){
        doConvert(str);
    }
    else
    if ( (str.trim()).substr(0,1)==='{' || (str.trim()).substr(0,1)==='[' ) {
        if ((str.trim()).substr(0,1)==='{'){
            str='['+str+']';
        }
        
        onSuccess(null, str);
    }

    else {
        document.querySelector('.error').innerHTML="Enter a valid JSON source!";
        document.querySelector(".load-icon").classList.remove('lds-hourglass');
    }

}

function doConvert(url) {
        getData(url);
}

function readTextFile(file, callback, encoding){
    var reader=new FileReader();
    reader.addEventListener('load', function(e){
       callback(this.result);
    });

    reader.readAsText(file);
}

function fileChosen(file){
    
if (file.files[0]){
    readTextFile(file.files[0],function(str){

        if ( (str.trim()).substr(0,1)==='{' || (str.trim()).substr(0,1)==='[' ) {
            if ((str.trim()).substr(0,1)==='{'){
                str='['+str+']';
            }
            
            onSuccess(null, str);
        }

        else {
            document.querySelector('.error').innerHTML =file.files[0].name + ' is not a JSON data file! Expected format is [ {"name":"value"}, {"name":"value"} ] or {"name":"value"}';
            document.querySelector(".load-icon").classList.remove('lds-hourglass');
            document.querySelector(".choose-load-icon").classList.remove('lds-hourglass');
        }

         
    });
}

}

function doExtract(){
    document.querySelector('.showdata').innerHTML = "";
    document.querySelector('.error').innerHTML="";
    document.querySelector(".choose-load-icon").classList.add('lds-hourglass');
    fileChosen(document.querySelector('#files'));
}


function onSuccess(obj, jsonData=null) {
    if (jsonData){
        try{
            auto=JSON.parse(jsonData);    
        }
        catch(error){
            document.querySelector('.error').innerHTML=error;
        }
        
    }
    else {
        auto = JSON.parse(obj.responseText);
    }
    jsonToTable(auto, 'showdata');
    document.querySelector(".load-icon").classList.remove('lds-hourglass');
    document.querySelector(".choose-load-icon").classList.remove('lds-hourglass');
}

function getData(url, mode=null) {
    error=0;
    document.querySelector('.error').innerHTML = "";
    if (document.querySelector('#url').value.length === 0) {
        document.querySelector('.showdata').innerHTML = "";
        document.querySelector('.error').innerHTML = "Please enter the URL!";
        document.querySelector('#url').focus();
        return;
    }
    document.querySelector(".load-icon").classList.add('lds-hourglass');
    const xhrObj = new XMLHttpRequest();
    xhrObj.open('GET', url);
    xhrObj.send();
    xhrObj.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (!mode) {
                onSuccess(this);   
            } else {
                setTimeout(() => {
                    onSuccess(this);
                }, 1500);
            }

        } else {
            if (this.status != 200) {
                error=1;
                document.querySelector(".load-icon").classList.remove('lds-hourglass');
                document.querySelector('.showdata').innerHTML = "";
                document.querySelector('.error').innerHTML = "&#9888; Resource Not Found!";
                unSortedJson=[];
                document.querySelector('#url').select();
            }
            
        }

    }
}

function jsonToTable(json, element, mode = 'unsorted') {
        let table, tableHeader, tableBody;
        myJson = [...json];
    
        if (mode != 'sorted') {
            unSortedJson = [...json];
        }
    
        tableHeader = constructHeader(myJson);
        tableBody = constructTableBody(myJson);
        table = tableHeader + tableBody;
        document.querySelector('.' + element).innerHTML = table;
    
}

function showDemo() {
    document.querySelector('.showdata').innerHTML = "";
   // var demoUrl = "https://jsonplaceholder.typicode.com/posts";
    var demoUrl = "https://noothankrishnan.github.io/auto.json";
    document.querySelector('#url').value = demoUrl;
    getData(demoUrl, 'demo');
}

function doReset() {
    if (document.querySelector('#url').value.length > 0 && error===0) {
        jsonToTable(unSortedJson, 'showdata');
    }
}

function constructHeader(json) {
    let tableHeader = '',resetHeader,
        headerRowItem = "",
        thClass = '';
    headerRowItem += "<tr><th>Sl.No.</th>";

    for (let props in json[0]) {
        thClass = props.replace(/[\s\.]/g, '');
        headerRowItem += "<th title='Click to sort this column' class='" + thClass + "' onclick='doSort(this)'>" + props + "</td>";
    }
    resetHeader='<caption id="caption" onClick="doReset()" title="Click to reset the sort" class="reset-header">Reset Sort</caption>';
    tableHeader = '<table class="json-table">'+resetHeader + headerRowItem;
    return tableHeader;
}

function doSort(obj) {

    var column = obj.innerHTML;

    if (minus === 1) {
        minus = -1;
        plus = 1;

    } else {
        minus = 1;
        plus = -1;
    }

    myJson.sort(function(a, b) {
        var returnVal = 0;

        if (a[column] && b[column] && (a[column].toString().toLowerCase() < b[column].toString().toLowerCase())) {
            returnVal = minus;
        } else if (a[column] && b[column] && (a[column].toString().toLowerCase() > b[column].toString().toLowerCase())) {
            returnVal = plus;
        }
        return returnVal;
    });

   
    jsonToTable(myJson, 'showdata', 'sorted');

    document.querySelector("#caption").classList.add('sorted');

    var col = column.replace(/\s/g, '');
    col = col.replace(/\./g, '');

    document.querySelector("." + col).style.color = "blue";

    if (minus === -1) {
        document.querySelector("." + col).classList.add('arrow-icon-asc');
    } else {
        document.querySelector("." + col).classList.add('arrow-icon-desc');
    }

}

function constructTableBody(json) {
    let rowItem = '',
        ctr = 0;
    json.forEach(function(record, index) {
        rowItem += "<td>" + (index + 1) + ".</td>";
        for (let props in record) {
            rowItem += "<td>" + record[props] + "</td>";
        }
        rowItem = '<tr>' + rowItem + '</tr>'
    })
    return rowItem;
}
