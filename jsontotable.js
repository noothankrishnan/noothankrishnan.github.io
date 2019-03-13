// Author: Noothan Krishnan

'use strict';

var auto, myJson, minus = 1,
    plus = -1,
    unSortedJson = [];

function doConvert() {
        getData(document.querySelector('#url').value);
}

function onSuccess(obj) {
    auto = JSON.parse(obj.responseText);
    jsonToTable(auto, 'showdata');
    document.querySelector(".load-icon").classList.remove('lds-hourglass');
}

function getData(url, mode=null) {
    document.querySelector(".load-icon").classList.add('lds-hourglass');
    if (document.querySelector('#url').value.length === 0) {
        return;
    }
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
                console.log('Error Code :', this.status);
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
    var demoUrl = "https://jsonplaceholder.typicode.com/posts";
    document.querySelector('#url').value = demoUrl;
    getData(demoUrl, 'demo');
}

function doReset() {
    if (document.querySelector('#url').value.length > 0) {
        jsonToTable(unSortedJson, 'showdata');
    }
}

function constructHeader(json) {
    let tableHeader = '',
        headerRowItem = "",
        thClass = '';
    headerRowItem += "<th>Sl.No.</th>";

    for (let props in json[0]) {
        thClass = props.replace(/[\s\.]/g, '');
        headerRowItem += "<th title='Click to sort this column' class='" + thClass + "' onclick='doSort(this)'>" + props + "</th>";
    }

    tableHeader = '<table class="json-table"><tr>' + headerRowItem;
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
