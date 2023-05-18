# InteractiveTableJS
Highly configurable and interactive HTML table JS library
<br>
Just include the InteractiveTable.js file no matter how to html page to use.<br>
<br>
In brief, this table accepts an array of objects of key-value-pairs, eg:<br>
`array = [{ "key1":"value1", "key2":"value2"}, {"key1":"value3", "key2":"value4"} ...];`<br>
<br>
In most cases you just first obtain the table object by passing it's variable name into it. eg:<br>
`const tableName = InteractiveTable('tableName');`<br>
<br>
Then three functions to make it starts working:<br>
`.setData(array)` : to set the data to the table object.<br>
`.setTableSettings(setting)` : to overwrite default properties if exists in the input object.<br>
`.fillTable(containerName)` : to write the content into the container named as the input.<br>
<br>
There should be one property in tableSettings with key 'columns' which is an array of objects of properties defining what columns with what values to be shown.<br>
`'header'` to be the tag shown in the header row<br>
`'data'` to be the property key of the row value to be shown<br>
These properties may optionally contain one with key 'modifier' valued as below to replace what is orginally to be shown<br>
`'(row)=>{ /*return whatever you want while row is the current iteration of the array you passed in*/ }'`<br>
inside what you return, you may put: <br>
`.printCheckBox(row)` which, when exists, turn on the selecting functionality of the table, and<br>
`.editData(row['row-index'], key, value)` which replace the cell value by your input.<br>
`.refreshTable()` whenever you need to refresh the content to be shown, eg. after .editData be called.<br>
<br>
You can modify text you see on buttons and number of selected notice by change below properties in tableSettings:<br>
`"selectAllFiltered"`<br>
`"unselectAllFiltered"`<br>
`"noOfSelected"`<br>
`"resetFilters"`<br>
`"resetEdits"`<br>
`"toBegining"`<br>
`"previousPage"`<br>
`"nextPage"`<br>
`"toEnding"`<br>
<br>
Default tableSettings is :<br>
`{
	"label": "",
	"columns": [
	    {
		header: "Header",
		data: "",
		headerStyle: "",
		filterStyle: "",
		filter: "",
		filterPlaceholder: "placeholder",
		rowsStyle: "",
		modifier: "(row)=>{return 'data:' + JSON.stringify(row);}"
	    }
	],
	"start": 1,
	"defaultStart": 1,
	"end": 10,
	"defaultEnd": 10,
	"maxRows": 100,
	"buttonClass": 'button',
	"multiSelect": true,
	"headersStyle": 'border: none; height:calc(100% - 8px); display:flex; flex-flow:column nowrap; background-color: #ececff; padding:3px; margin:1px; font-weight:bold; font-weight:bold; font-size:12px;',
	"filtersStyle": 'border:#aaa solid 1px; padding:1px; border-radius:4px; margin:1px; text-align:center; font-size:10px; width: calc(100% - 2px);',
	"rowsStyle": 'text-align:center; font-size:12px;',
	"oddRowsStyle": '',
	"evenRowsStyle": 'background-color:#f9f9f9;',
	"maxHeight": undefined,
	"selectAllFiltered": 'Select all filtered',
	"unselectAllFiltered": 'Unselect all filtered',
	"noOfSelected": 'No. of selected: ',
	"resetFilters": 'Reset filters',
	"resetEdits": 'Reset edits',
	"toBegining": '<<',
	"previousPage": '<',
	"nextPage": '>',
	"toEnding": '>>'
    }`<br>
<br>
You get the subset of the table's data of currently selected/filtered/edited by below functions:<br>
`.getSelected()`<br>
`.getFiltered()`<br>
`.getEdited()`<br>
<br>
Oh if you wish not allowing multiple rows to be able to be selected<br>
change that `"multiSelect"` property as false.<br>
<br>
You can open and modify the example HTML file to see what it does.
