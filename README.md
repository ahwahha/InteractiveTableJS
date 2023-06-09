# InteractiveTableJS
Highly configurable and interactive HTML table pure JS library
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
There should be one property in tableSettings with key `"columns"` which is an array of objects of properties defining what columns with what values to be shown.<br>
Below properties must be included for each row object inside the `"columns"` array:<br>
`"header"` to be the tag shown in the header row<br>
`"data"` to be the property key of the row value to be shown<br>
<br>
`"modifier"` can be optionally included for each row object inside the `"columns"` array:<br>
`"modifier"` valued as a Function like below to replace what is orginally to be shown<br>
`new Function('row', 'return "whatever html you want to be shown";')`<br>
or `(row)=>{return 'whatever html you want to be shown';}`<br>
or any predefined function which accept the data row.<br>
inside what you return, you may put: <br>
`.printCheckBox(row)` which, when exists, turn on the selecting functionality of the table, and<br>
`.editData(row['row-index'], key, value)` which replace the cell value by your input.<br>
`.refreshTable()` whenever you need to refresh the content to be shown, eg. after .editData be called.<br>
You can have other optional properties inside `"columns"` for overwriting default style and values in table content. Please see the complete list in the default tableSettings['columns'] below.<br>
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
You can also overwriting default style by having `"xxxxStyle"` properties inside tableSettings object. Please see the default values as below:
```xml
{
	"label": "",
	"columns": [
		{
			header: "Header",
			data: "",
			filter: "",
			filterPlaceholder: "placeholder",
			modifier: "(row)=>{return 'data:' + JSON.stringify(row);}",
			headerStyle: {},
			filterStyle: {},
			rowsStyle: {},
			widthStyle: { "width": "auto", "min-width": "auto", "max-width": "auto" }
		}
	],
	"sortedBy": 'row-index',
	"ascending": true,
	"start": 1,
	"defaultStart": 1,
	"end": 10,
	"defaultEnd": 10,
	"maxRows": 100,
	"buttonClass": 'button',
	"multiSelect": true,
	"actionsGroupStyle": '',
	"paginationGroupStyle": '',
	"maxHeight": undefined,
	"selectAllFiltered": 'Select all filtered',
	"unselectAllFiltered": 'Unselect all filtered',
	"noOfSelected": 'No. of selected: ',
	"resetFilters": 'Reset filters',
	"resetEdits": 'Reset edits',
	"toBegining": '<<',
	"previousPage": '<',
	"nextPage": '>',
	"toEnding": '>>',
	"headersStyle": {
		"border": "none",
		"border-radius": "5px",
		"outline": "#aaa solid 1px",
		"height": "calc(100% - 8px)",
		"display": "flex",
		"flex-flow": "column nowrap",
		"padding": "3px",
		"margin": "2px",
		"text-align": "center",
		"font-weight": "bold",
		"background-color": "#add"
	},
	"filtersStyle": {
		"border": "none",
		"border-radius": "5px",
		"outline": "#aaa solid 1px",
		"margin": "2px",
		"text-align": "center",
		"height": "min-content",
		"overflow": "hidden"
	},
	"rowsStyle": {
		"text-align": "center",
	},
	"oddRowsStyle": {},
	"evenRowsStyle": {
		"background-color": "#f9f9f9"
	}
}
```
<br>
You get the subset of the table's data of currently selected/filtered/edited by below functions:<br>
`.getSelected()`<br>
`.getFiltered()`<br>
`.getEdited()`<br>
or by passing one into another like `.getFiltered(getSelected())`<br>
<br>
The result of above methoes contain some extra properties of keys in each table row for keeping the table works.<br>
To remove these properties, just pass the array into the method `.cleanKeys(arr)`<br>
To remove specific properties in each row, you can pass the array into `.removeKeys(arr,keys)`<br>
where `arr` is you array and `keys` to be the property key or an array of property keys you wish to remove<br>
<br>
Oh if you wish not allowing multiple rows to be able to be selected<br>
change that `"multiSelect"` property as false.<br>
<br>
You can open and modify the example HTML file to see what it does.
