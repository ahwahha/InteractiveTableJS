function InteractiveTable(id) {

	var identifier = id;
	var container = null;
	var tableData = [{ "key": "value" }];
	var originalTableData = null;
	var haveSelection = false;
	var edited = false;
	var tableDefaultSettings = {
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
		"editFilter": 'Edit filter value:',
		"toBegining": '<<',
		"previousPage": '<',
		"nextPage": '>',
		"toEnding": '>>',
		"headersStyle": {
			"border-radius": "5px",
			"border": "#aaa solid 1px",
			"height": "calc(100% - 8px)",
			"display": "flex",
			"flex-flow": "column nowrap",
			"padding": "3px",
			"margin": "1px",
			"text-align": "center",
			"font-weight": "bold",
			"background-color": "#add"
		},
		"filtersStyle": {
			"border-radius": "5px",
			"border": "#aaa solid 1px",
			"margin": "1px",
			"text-align": "center",
			"min-height": "12px",
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
	};
	var tableSettings = JSON.parse(JSON.stringify(tableDefaultSettings));

	getTableSettings = function () {
		return tableSettings;
	}

	toStyleString = function (obj) {
		try {
			var output = '';
			for (let [key, value] of Object.entries(obj || {})) {
				output += key + ':' + value + ';';
			}
			return output;
		} catch (error) {
			throw new Error("error caught @ toStyleString(" + obj + "): " + error);
		}
	}

	var setData = function (data) {
		try {
			edited = false;
			data.forEach((row, index) => {
				row["row-index"] = index + 1;
				row["row-filtered"] = true;
				row["row-selected"] = false;
				row["row-edited"] = false;
			});
			tableData = data;
			originalTableData = JSON.parse(JSON.stringify(data));
			return this;
		} catch (error) {
			throw new Error("error caught @ setData(" + data + "): " + error);
		}
	}

	var resetData = function (data) {
		try {
			edited = false;
			tableData = JSON.parse(JSON.stringify(originalTableData));
			return this;
		} catch (error) {
			throw new Error("error caught @ resetData(" + data + "): " + error);
		}
	}

	var setTableSettings = function (newSettings) {
		try {
			tableSettings = { ...tableSettings, ...newSettings };

			tableSettings['headersStyle'] = { ...tableDefaultSettings['headersStyle'], ...newSettings['headersStyle'] };
			tableSettings['filtersStyle'] = { ...tableDefaultSettings['filtersStyle'], ...newSettings['filtersStyle'] };
			tableSettings['rowsStyle'] = { ...tableDefaultSettings['rowsStyle'], ...newSettings['rowsStyle'] };
			tableSettings['oddRowsStyle'] = { ...tableDefaultSettings['oddRowsStyle'], ...newSettings['oddRowsStyle'] };
			tableSettings['evenRowsStyle'] = { ...tableDefaultSettings['evenRowsStyle'], ...newSettings['evenRowsStyle'] };

			return this;
		} catch (error) {
			throw new Error("error caught @ setTableSettings(" + newSettings + "): " + error);
		}
	}

	var setSelected = function (index, selected) {
		try {
			tableData = tableData.map(row => row['row-index'] === index ? { ...row, 'row-selected': selected } : row)
			return this;
		} catch (error) {
			throw new Error("error caught @ setSelected(" + index + ", " + selected + "): " + error);
		}
	}

	var setAllSelected = function (selected) {
		try {
			tableData = tableData.map(row => ({ ...row, 'row-selected': selected }));
			return this;
		} catch (error) {
			throw new Error("error caught @ setAllSelected(" + selected + "): " + error);
		}
	}

	var setAllFilteredSelected = function (selected) {
		try {
			tableData = tableData.map(row => row['row-filtered'] ? { ...row, 'row-selected': selected } : row);
			return this;
		} catch (error) {
			throw new Error("error caught @ setAllFilteredSelected(" + selected + "): " + error);
		}
	}

	/**
	 * remove all properties with keys starting with 'row-' from input array
	 * @param {*} arr array of objects
	 * @returns 
	 */
	var cleanKeys = function (arr) {
		try {
			output = removeKeys(arr, ['row-%']);
			return output;
		} catch (error) {
			throw new Error("error caught @ removeKeys(" + JSON.stringify(arr) + ", " + JSON.stringify(keys) + "): " + error.toString());
		}
	}

	/**
	 * remove all properties with keys specified in the parameter 'keys' from input array 'arr'
	 * @param {*} arr array of objects
	 * @param {*} keys [String] or [String][]
	 * @returns 
	 */
	var removeKeys = function (arr, keys) {
		try {
			let output = JSON.parse(JSON.stringify(arr));
			if (typeof keys === 'string') {
				if (keys.endsWith('%')) {
					let prefix = keys.slice(0, -1);
					for (let i = 0; i < output.length; i++) {
						for (let key in output[i]) {
							if (key.startsWith(prefix)) {
								delete output[i][key];
							}
						}
					}
				} else {
					for (let i = 0; i < output.length; i++) {
						delete output[i][keys];
					}
				}
			} else if (Array.isArray(keys)) {
				for (let i = 0; i < output.length; i++) {
					for (let j = 0; j < keys.length; j++) {
						if (keys[j].endsWith('%')) {
							let prefix = keys[j].slice(0, -1);
							for (let key in output[i]) {
								if (key.startsWith(prefix)) {
									delete output[i][key];
								}
							}
						} else {
							delete output[i][keys[j]];
						}
					}
				}
			} else {
				throw new Error("keys argument must be a string or an array of strings");
			}
			return output;
		} catch (error) {
			throw new Error("error caught @ removeKeys(" + JSON.stringify(arr) + ", " + JSON.stringify(keys) + "): " + error.toString());
		}
	}

	var deepFilter = function (arr, predicate) {
		try {
			let filteredArr = [];
			for (let obj of arr) {
				if (predicate(obj)) {
					filteredArr.push(JSON.parse(JSON.stringify(obj)));
				}
			}
			return filteredArr;
		} catch (error) {
			throw new Error("error caught @ deepFilter(" + arr + ", " + predicate + "): " + error);
		}
	}

	var setEdited = function (arr) {
		try {
			arr = (arr || tableData);
			for (let i = 0; i < arr.length; i++) {
				let row = arr[i];
				let oriRow = originalTableData.find(origDataRow => origDataRow['row-index'] === row['row-index']);
				edited = false;
				let isEdited = false;
				for (let key in row) {
					if (!key.startsWith('row-')) {
						if (row[key] !== oriRow[key]) {
							isEdited = true;
							break;
						}
					}
				}
				row['row-edited'] = isEdited;
				edited = !(edited && isEdited);
			}
			return this;
		} catch (error) {
			throw new Error("error caught @ setEdited(): " + error.toString());
		}
	}

	var getData = function () {
		try {
			return JSON.parse(JSON.stringify(tableData));
		} catch (error) {
			throw new Error("error caught @ getData(): " + error.toString());
		}
	}

	var getSelected = function (arr) {
		try {
			arr = (arr || tableData);
			let output = deepFilter(arr, row => row['row-selected']);
			return output;
		} catch (error) {
			throw new Error("error caught @ getSelected(): " + error.toString());
		}
	}

	var getFiltered = function (arr) {
		try {
			arr = (arr || tableData);
			let output = deepFilter(arr, row => row['row-filtered']);
			return output;
		} catch (error) {
			throw new Error("error caught @ getFiltered(): " + error.toString());
		}
	}

	var getEdited = function (arr) {
		try {
			arr = (arr || tableData);
			setEdited(arr);
			let output = deepFilter(arr, row => row['row-edited']);
			return output;
		} catch (error) {
			throw new Error("error caught @ getedited(): " + error.toString());
		}
	}

	var sortAsOriginal = function () {
		try {
			tableData.sort((a, b) => a['row-index'] - b['row-index']);
			return this;
		} catch (error) {
			throw new Error("error caught @ sortAsOriginal(): " + error);
		}
	}

	var filterRows = function () {
		try {
			tableData.forEach((row) => {
				let isFiltered = true;
				for (let col of tableSettings['columns']) {
					let matching = match((row[col['data']] || '').toString(), (col['filter'] ? col['filter'] : ''), false);
					if (!matching) {
						isFiltered = false;
						break;
					}
				}
				row["row-filtered"] = isFiltered;
			});
			return this;
		} catch (error) {
			throw new Error("error caught @ filterRows(): " + error);
		}
	}

	var setSorting = function (data, order) {
		tableSettings['sortedBy'] = data;
		tableSettings['ascending'] = order;
		return this;
	}

	var sortRows = function () {
		try {
			let data = tableSettings['sortedBy'];
			let order = tableSettings['ascending'];
			let sortedData = tableData.sort((a, b) => {
				let aValue = a[data] || '';
				let bValue = b[data] || '';
				if (typeof aValue === 'boolean' || typeof bValue === 'boolean') {
					if (aValue === bValue) {
						return 0;
					} else if (aValue && !bValue) {
						return order ? -1 : 1;
					} else {
						return order ? 1 : -1;
					}
				} else if (isDateString(aValue) && isDateString(bValue)) {
					let aNumber = parseDate(aValue);
					let bNumber = parseDate(bValue);
					if (!isNaN(aNumber) && !isNaN(bNumber)) {
						return order ? aNumber - bNumber : bNumber - aNumber;
					}
				} else if (isNumberString(aValue) && isNumberString(bValue)) {
					let aNumber = parseFloat(aValue);
					let bNumber = parseFloat(bValue);
					if (!isNaN(aNumber) && !isNaN(bNumber)) {
						return order ? aNumber - bNumber : bNumber - aNumber;
					}
				} else if (isIntegerString(aValue) && isIntegerString(bValue)) {
					let aInteger = parseInt(aValue);
					let bInteger = parseInt(bValue);
					if (!isNaN(aInteger) && !isNaN(bInteger)) {
						return order ? aInteger - bInteger : bInteger - aInteger;
					}
				} else if (typeof aValue === 'string' && typeof bValue === 'string') {
					return order ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
				}
				return 0;
			});
			tableData = sortedData;
			return this;
		} catch (error) {
			throw new Error("error caught @ sort(" + data + ", " + order + "): " + error);
		}
	}

	var isDateString = function (value) {
		try {
			return /^(\d{2})[-\/](\d{2})[-\/](\d{4})$|^(\d{4})[-\/](\d{2})[-\/](\d{2})$|^(\d{2})[-\/](\d{2})[-\/](\d{4}) (\d{2}):(\d{2}):(\d{2})$/.test(value);
		} catch (error) {
			throw new Error("error caught @ isDateString(" + value + "): " + error);
		}
	}

	var isNumberString = function (value) {
		try {
			return /^(\d+|\d+\.\d+|\.\d+)$/.test(value);
		} catch (error) {
			throw new Error("error caught @ isNumberString(" + value + "): " + error);
		}
	}

	var isIntegerString = function (value) {
		try {
			return /^(\d+)$/.test(value);
		} catch (error) {
			throw new Error("error caught @ isIntegerString(" + value + "): " + error);
		}
	}

	var parseDate = function (value) {
		try {
			let match = null;
			let output = null;
			if (/^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.test(value)) {
				match = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(value);
				if (match) {
					output = new Date(match[3] + '-' + match[2] + '-' + match[1]).getTime();
				}
			} else if (/^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.test(value)) {
				match = /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.exec(value);
				if (match) {
					output = new Date(match[1] + '-' + match[2] + '-' + match[3]).getTime();
				}
			} else if (/^(\d{2})[-\/](\d{2})[-\/](\d{4}) (\d{2}):(\d{2}):(\d{2})$/.test(value)) {
				match = /^(\d{2})[-\/](\d{2})[-\/](\d{4}) (\d{2}):(\d{2}):(\d{2})$/.exec(value);
				if (match) {
					output = new Date(match[3] + '-' + match[2] + '-' + match[1] + 'T' + match[4] + ':' + match[5] + ':' + match[6]).getTime();
				}
			}
			return output;
		} catch (error) {
			throw new Error("error caught @ parseDate(" + value + "): " + error);
		}
	}

	var setStart = function (start) {
		try {
			let rowNumber = parseInt(start);
			if (!Number.isNaN(rowNumber)) {
				tableSettings = {
					...tableSettings
					, start: Math.max(
						Math.min(
							rowNumber,
							tableSettings['end']
						),
						Math.max(
							(getFiltered().length === 0 ? 0 : 1),
							tableSettings['end'] - tableSettings['maxRows'] + 1
						)
					)
				};
			}
			return this;
		} catch (err) {
			throw new Error("error caught @ setStart(" + start + ") - " + err);
		}
	}

	var setEnd = function (end) {
		try {
			let rowNumber = parseInt(end);
			if (!Number.isNaN(rowNumber)) {
				tableSettings = {
					...tableSettings
					, end: Math.min(
						Math.max(
							rowNumber,
							tableSettings['start']
						),
						Math.min(
							getFiltered().length,
							tableSettings['start'] + tableSettings['maxRows'] - 1
						)
					)
				};
			}
			return this;
		} catch (err) {
			throw new Error("error caught @ setEnd(" + end + ") - " + err);
		}
	}

	var toBegining = function () {
		try {
			let length = tableSettings['end'] - tableSettings['start'] + 1;
			tableSettings['start'] = getFiltered().length === 0 ? 0 : 1;
			tableSettings['end'] = Math.min(getFiltered().length, tableSettings['start'] + length - 1);
			return this;
		} catch (err) {
			throw new Error("error caught @ toBegining() - " + err);
		}
	}

	var priviousPage = function () {
		try {
			let length = tableSettings['end'] - tableSettings['start'] + 1;
			tableSettings['start'] = Math.max(getFiltered().length === 0 ? 0 : 1, tableSettings['start'] - length);
			tableSettings['end'] = Math.min(tableData.length, tableSettings['start'] + length - 1);
			return this;
		} catch (err) {
			throw new Error("error caught @ priviousPage() - " + err);
		}
	}

	var nextPage = function () {
		try {
			let length = tableSettings['end'] - tableSettings['start'] + 1;
			tableSettings['end'] = Math.min(getFiltered().length, tableSettings['end'] + length);
			tableSettings['start'] = Math.max(1, tableSettings['end'] - length + 1);
			return this;
		} catch (err) {
			throw new Error("error caught @ nextPage() - " + err);
		}
	}

	var toEnding = function () {
		try {
			let length = tableSettings['end'] - tableSettings['start'] + 1;
			tableSettings['end'] = getFiltered().length;
			tableSettings['start'] = Math.max(1, tableSettings['end'] - length + 1);
			return this;
		} catch (err) {
			throw new Error("error caught @ priviousPage() - " + err);
		}
	}

	var printCheckBox = function (row) {
		try {
			if (!haveSelection) {
				haveSelection = true;
			}
			return '<input type="checkbox" onclick="' + identifier + (!tableSettings['multiSelect'] ? '.setAllSelected(false)' : '') + '.setSelected(' + row['row-index'] + ', checked).refreshTable();" ' + (row['row-selected'] ? 'checked' : '') + '/>';
		} catch (error) {
			throw new Error("error caught @ printCheckBox(" + row + "): " + error);
		}
	}

	var printSelectingGroup = function () {
		try {
			if (tableSettings['multiSelect'] == true && haveSelection) {
				let selectedRows = tableData.filter(row => row['row-selected']);
				let noOfSelected = selectedRows.length;
				let selectAllButton = '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.setAllFilteredSelected(true).refreshTable()">' + tableSettings.selectAllFiltered + '</button>';
				let unselectAllButton = '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.setAllFilteredSelected(false).refreshTable()">' + tableSettings.unselectAllFiltered + '</button>';
				return '<div style="display:flex;flex-flow:row wrap;justify-content:flex-start;align-items:center;column-gap:3px;">' + tableSettings.noOfSelected + noOfSelected + ' <div style="display:flex;flex-flow:row wrap;justify-content:flex-start;align-items:center;column-gap:3px;">' + selectAllButton + unselectAllButton + '</div></div>';
			} else {
				return '';
			}
		} catch (err) {
			throw new Error("error caught @ printSelectingGroup() - " + err);
		}
	}

	var printResetFiltersButton = function () {
		try {
			return '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.resetFilters().filterRows().resetPageNumbers().refreshTable();">' + tableSettings.resetFilters + '</button>';
		} catch (err) {
			throw new Error("error caught @ printResetFiltersButton() - " + err);
		}
	}

	var printResetEditsButton = function () {
		try {
			return edited ? '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.resetData().filterRows().resetPageNumbers().refreshTable();">' + tableSettings.resetEdits + '</button>' : '';
		} catch (err) {
			throw new Error("error caught @ printResetEditsButton() - " + err);
		}
	}

	var printPaginationGroup = function () {
		try {
			let startInput = '<input type="text" style=\'text-align:center; padding: 3px 8px; width: ' + (Math.max(1, Math.ceil(Math.log10(tableData.length))) * 8 + 20) + 'px;\' value="' + tableSettings['start'] + '" onchange="' + identifier + '.setStart(value).refreshTable()" />';
			let endInput = '<input type="text" style=\'text-align:center; padding: 3px 8px; width: ' + (Math.max(1, Math.ceil(Math.log10(tableData.length))) * 8 + 20) + 'px;\' value="' + tableSettings['end'] + '" onchange="' + identifier + '.setEnd(value).refreshTable()" />';
			let totalRows = getFiltered().length;
			let toBeginingButton = '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.toBegining().refreshTable();">' + tableSettings['toBegining'] + '</button>';
			let previousButton = '<button style="margin-left:5px;" class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.priviousPage().refreshTable();">' + tableSettings['previousPage'] + '</button>';
			let nextButton = '<button style="margin-right:5px;" class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.nextPage().refreshTable();">' + tableSettings['nextPage'] + '</button>';
			let toEndingButton = '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.toEnding().refreshTable();">' + tableSettings['toEnding'] + '</button>';
			return '<div style="' + tableSettings['paginationGroupStyle'] + '"><div style="width:100%;display:flex;flex-flow:row wrap;justify-content:center;align-items:center;column-gap:3px;"><div>' + toBeginingButton + previousButton + '</div><div>' + startInput + '<span style=\'margin: 0px 5px;\'>-</span>' + endInput + '<span style=\'margin: 0px 5px;\'>/</span>' + totalRows + '</div><div>' + nextButton + toEndingButton + '</div></div></div>';
		} catch (err) {
			throw new Error("error caught @ printPaginationGroup() - " + err);
		}
	}

	var setFilter = function (index, value) {
		try {
			tableSettings['columns'][index]['filter'] = value;
			return this;
		} catch (err) {
			throw new Error("error caught @ setFilter(" + index + ", " + value + ") - " + err);
		}
	}

	var resetFilters = function () {
		try {
			tableSettings['columns'].forEach((col) => {
				col['filter'] = "";
			});
			return this;
		} catch (err) {
			throw new Error("error caught @ resetFilters() - " + err);
		}
	}

	var resetPageNumbers = function () {
		try {
			let length = tableSettings['end'] - tableSettings['start'] + 1;
			setStart(getFiltered().length === 0 ? 0 : 1);
			setEnd(Math.max(length, tableSettings['defaultEnd']));
			return this;
		} catch (err) {
			throw new Error("error caught @ resetPageNumbers() - " + err);
		}
	}

	var match = function (text, matchingText, caseSensitive) {
		let match = false;

		try {
			if (text === null && matchingText !== '') {
				return false;
			} else if (matchingText.trim() === "") {
				match = true;
			} else {
				let regex = matchingText.trim().startsWith("regex:");

				if (regex) {
					let regexPattern = new RegExp(matchingText.trim().substring(6));
					match = regexPattern.test(text);
				} else {
					if (!caseSensitive) {
						text = text.toUpperCase();
						matchingText = matchingText.toUpperCase();
					}

					let values = [];
					let isQuoteOpen = false;
					let currentWord = "";

					for (let i = 0; i < matchingText.length; i++) {
						let char = matchingText[i];

						if (!isQuoteOpen && (char === " " || char === "," || char === "+" || char === "\t")) {
							if (currentWord !== "") {
								values.push(currentWord);
								currentWord = "";
							}
						} else if (char === "\"") {
							isQuoteOpen = !isQuoteOpen;

							if (!isQuoteOpen && currentWord !== "") {
								values.push(currentWord);
								currentWord = "";
							}
						} else {
							currentWord += char;
						}
					}

					if (currentWord !== "") {
						values.push(currentWord);
					}

					let exclusionSet = [];
					let inclusionSet = [];

					for (let value of values) {
						if (value.startsWith("-")) {
							exclusionSet.push(value.substring(1));
						} else {
							inclusionSet.push(value);
						}
					}

					/*handle excludes*/
					let exclusiveMatch = true;
					for (let value of exclusionSet) {
						exclusiveMatch = exclusiveMatch && text.indexOf(value) === -1;
					}

					/*handle includes*/
					let inclusiveMatch = inclusionSet.length === 0;
					for (let value of inclusionSet) {
						inclusiveMatch = inclusiveMatch || text.indexOf(value) !== -1;
					}

					match = exclusiveMatch && inclusiveMatch;
				}
			}
		} catch (e) {
			throw new Error("error caught @ match(" + text + ", " + matchingText + ", " + (caseSensitive ? "true" : "false") + "): " + e);
		}

		return match;
	}

	var editData = function (index, data, value) {
		try {
			let row = tableData.find((row) => {
				return row['row-index'] === index;
			});
			if (row[data] !== value) {
				if (row['ori-' + data] === undefined) {
					row['ori-' + data] = row[data];
				} else if (row['ori-' + data] === value) {
					delete row['ori-' + data];
				}
				row[data] = value;
				setEdited();
				refreshTable();
			}
			return this;
		} catch (err) {
			throw new Error("error caught @ editData(" + index + ", " + data + ", " + value + "): " + err);
		}
	}

	var stringToAscii = function (str) {
		try {
			let ascii = "";
			for (let i = 0; i < str.length; i++) {
				let charCode = str.charCodeAt(i);
				ascii += "&#" + charCode + ";";
			}
			return ascii;
		} catch (err) {
			throw new Error("error caught @ stringToAscii(" + str + "): " + err);
		}
	}

	var printTable = function () {
		try {
			var html = "";

			sortRows();
			filterRows();

			html += "<table style='width:100%;height:min-content;border-collapse: collapse;'><tbody>";

			/*headers*/
			html += "<tr>";
			tableSettings['columns'].forEach((col) => {
				var headerStyle = { ...(tableSettings['headersStyle'] || {}), ...(col['headerStyle'] || {}) };
				var headerHtml = '<div'
					+ ' style="' + toStyleString(headerStyle) + '"'
					+ ' class="sort-header ' + (tableSettings['sortedBy'] === col['data'] ? 'sorting' : '') + '"'
					+ ' onclick="' + identifier + '.setSorting(\'' + col['data'] + '\', ' + (tableSettings['sortedBy'] === col['data'] ? !tableSettings['ascending'] : tableSettings['ascending']) + ').refreshTable()"'
					+ '>'
					+ '<div style="flex:1;"></div>'
					+ col.header
					+ (tableSettings['sortedBy'] === col['data'] ? (tableSettings['ascending'] ? '&#9650;' : '&#9660;') : '')
					+ '<div style="flex:1;"></div>'
					+ '</div>';
				html += '<td style="padding:0px;">' + headerHtml + '</td>';
			});
			html += '</tr>';

			/*filters*/
			html += '<tr>';
			tableSettings['columns'].forEach((col) => {
				var filterStyle = toStyleString({ ...(tableSettings['filtersStyle'] || {}), ...(col['filterStyle'] || {}) });
				var filterValue = col['filter'] || '';
				var filterHtml = '<div'
					+ ' style="' + filterStyle + '"'
					+ ' onclick="let val = prompt(\'' + tableSettings['editFilter'] + '\',\'' + stringToAscii(filterValue) + '\'); if(val!=null){' + identifier + '.setFilter(' + tableSettings['columns'].indexOf(col) + ',val).filterRows().resetPageNumbers().refreshTable();}"'
					+ '>'
					+ filterValue
					+ '</div>';
				html += '<td style="padding:0px;">' + filterHtml + '</td>';
			});
			html += '</tr>';

			/*rows*/
			let start = tableSettings['start'];
			let end = tableSettings['end'];
			var filteredData = getFiltered().slice(start - 1, end);
			filteredData.forEach((row, index) => {
				var rowsStyle = (col) => {
					return { ...(tableSettings.rowsStyle || ''), ...(col.rowsStyle || '') };
				};
				var oddEvenRowsStyle = (col) => {
					return (index % 2 === 1 ? tableSettings.evenRowsStyle : tableSettings.oddRowsStyle);
				};
				html += '<tr>';
				tableSettings['columns'].forEach((col) => {
					var cellData = row[col['data']] !== null ? row[col['data']] : '';
					if (col.modifier) {
						if (typeof col.modifier === 'function') {
							var clone = Object.assign({}, row);
							cellData = col.modifier(clone);
						}
					}
					html += '<td style="' + toStyleString({ ...oddEvenRowsStyle(col), ...rowsStyle(col) }) + '">' + cellData + '</td>';
				});
				html += '</tr>';
			});

			html += '</tbody></table>';

			html = "<div style='position:relative;width:100%;display:flex;flex-flow:column nowrap;justify-content:flex-start;align-items:center;row-gap:3px;'>"
				+ "<div style='width:100%;display:flex;flex-flow:row wrap;justify-content:flex-start;align-items:center;column-gap:3px;'>"
				+ "<div>" + tableSettings['label'] + "</div>"
				+ "<div style='flex:1;'></div>"
				+ "<div style='" + tableSettings['actionsGroupStyle'] + "'>"
				+ "<div style='display:flex;flex-flow:row wrap;justify-content:flex-start;align-items:center;column-gap:3px;'>"
				+ printSelectingGroup()
				+ printResetFiltersButton()
				+ printResetEditsButton()
				+ "</div>"
				+ "</div>"
				+ "</div>"
				+ "<div style='width:100%;overflow:auto;" + (tableSettings['maxHeight'] ? " max-height:" + tableSettings['maxHeight'] + ";" : "") + "'>" + html + "</div>"
				+ printPaginationGroup()
				+ '</div>\n';

			return html;
		} catch (err) {
			throw new Error("error caught @ printTable(): " + err);
		}
	}

	var fillTable = function (id) {
		try {
			if (document.getElementById(id) !== null) {
				resetPageNumbers();
				document.getElementById(id).innerHTML = printTable();
			}
			container = id;
			return this;
		} catch (err) {
			throw new Error("error caught @ fillTable(" + id + "): " + err);
		}
	}

	var refreshTable = function () {
		try {
			if (document.getElementById(container) !== null) {
				document.getElementById(container).innerHTML = printTable();
			}
			return this;
		} catch (err) {
			throw new Error("error caught @ refreshTable(): " + err);
		}
	}

	return {
		setData, resetData, setTableSettings, getTableSettings,
		setSelected, setAllSelected, setAllFilteredSelected,
		cleanKeys, removeKeys, getData, getSelected, getFiltered, getEdited, sortAsOriginal,
		filterRows, setSorting, sortRows, setStart, setEnd,
		toBegining, priviousPage, nextPage, toEnding,
		printCheckBox, printSelectingGroup, printResetFiltersButton, printResetEditsButton, printPaginationGroup,
		setFilter, resetFilters, resetPageNumbers, editData, printTable, fillTable, refreshTable
	};

}
