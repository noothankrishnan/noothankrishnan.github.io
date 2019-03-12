// Developed by Noothan Krishnan

'use strict';

var myJson, minus=1, plus=-1,unSortedJson=[],sortArrow='&#8659;';

function getData(url){
    const xhrObj=new XMLHttpRequest();
    xhrObj.open('GET',url);
    xhrObj.send();
  
    xhrObj.onreadystatechange=function(){
        if (this.readyState==4 && this.status==200){
          auto=JSON.parse(this.responseText);
          jsonToTable(auto,'showdata');
        }
        else {
            if (this.status!=200){
                console.log('Error Code :', this.status);
            }
        }
    }
   
}


function jsonToTable(json, element,mode='unsorted'){
 
    let table, tableHeader, tableBody;
    myJson=[...json];

    if (mode!='sorted'){
        unSortedJson=[...json];
    }
    
    tableHeader=constructHeader(myJson);
    tableBody=constructTableBody(myJson);
    table=tableHeader+tableBody;
    document.querySelector('.'+element).innerHTML=table;
}

function constructHeader(json){
    let tableHeader='', headerRowItem="",thClass='' ;
    headerRowItem+="<th>Sl.No.</th>";
    
    tableHeader=`<style>
        table {
            border-collapse:collapse;
            font-family: 'arial';
            font-size:0.8rem;
            margin:10px 0; 
        }
            td,th {border:solid 1px silver;padding:8px;}
            th {text-transform:capitalize;color:#000;background:#ddd;cursor:pointer}
            tr:nth-child(even) {background:#eee}
            .arrow-icon-asc::after { 
                content: "\u25b2";
                font-size:0.6rem
              }
              .arrow-icon-desc::after { 
                content: "\u25bc";
                font-size:0.6rem
              }
    </style>`;

    for (let props in json[0]){
        thClass=props.replace(/[\s\.]/g,'');
        headerRowItem+="<th class='" + thClass + "' onclick='doSort(this)'>"+props+"</th>";
    }

    tableHeader+='<table class="jsontotable"><tr>'+headerRowItem;
    return tableHeader;
}

function doConvert(){
   getData(document.querySelector('#url').value);
}

function doReset(){
    jsonToTable(unSortedJson,'showdata');
}

function doSort(obj){

    var column=obj.innerHTML;

    //var column=(obj.innerHTML).substr(0,obj.innerHTML.length-1);

    //columncolumn.substr(0,column.length-1));

   

    if (minus===1){
        minus=-1;
        plus=1;
        
    }
    else {
        minus=1;
        plus=-1;
    }
    
    myJson.sort(function(a,b){
        var returnVal=0;
        
        if (a[column] && b[column] && (a[column].toString().toLowerCase()<b[column].toString().toLowerCase())){
            returnVal= minus;
        }
        else if (a[column] && b[column] && (a[column].toString().toLowerCase()>b[column].toString().toLowerCase())){
            returnVal= plus;
        }
       
         return returnVal;

    });
    jsonToTable(myJson,'showdata','sorted');

    var col=column.replace(/\s/g,'');
    col=col.replace(/\./g,'');
   
   document.querySelector("."+col).style.color="blue";

   if (minus===-1){
    document.querySelector("."+col).classList.add('arrow-icon-asc');
   }
   else {
    document.querySelector("."+col).classList.add('arrow-icon-desc');
   }
 
   //sortArrow='⇓';
}

function constructTableBody(json){
    let rowItem='',ctr=0;
    json.forEach(function(record,index){
        rowItem+="<td>"+(index+1)+".</td>";
        for (let props in record){
            rowItem+="<td>"+record[props]+"</td>";
        }
        rowItem='<tr>'+rowItem + '</tr>'
    })
    return rowItem;
}



