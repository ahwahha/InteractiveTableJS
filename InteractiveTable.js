function InteractiveTable(id) {

	this.identifier = id;
	this.container = null;
	this.tableData = [{ "key": "value" }];
	this.originalTableData = null;
	this.haveSelection = false;
	this.edited = false;
	this.tableDefaultSettings = {
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
	this.tableSettings = JSON.parse(JSON.stringify(this.tableDefaultSettings));
}

InteractiveTable.prototype.toStyleString = function (obj) {
	try {
		var output = '';
		for (const [key, value] of Object.entries(obj || {})) {
			output += key + ':' + value + ';';
		}
		return output;
	} catch (error) {
		throw new Error("error caught @ toStyleString(" + obj + "): " + error);
	}
}

InteractiveTable.prototype.setData = function (data) {
	try {
		this.edited = false;
		data.forEach((row, index) => {
			row["row-index"] = index + 1;
			row["row-filtered"] = true;
			row["row-selected"] = false;
			row["row-edited"] = false;
		});
		this.tableData = data;
		this.originalTableData = JSON.parse(JSON.stringify(data));
		return this;
	} catch (error) {
		throw new Error("error caught @ setData(" + data + "): " + error);
	}
}

InteractiveTable.prototype.resetData = function (data) {
	try {
		this.edited = false;
		this.tableData = JSON.parse(JSON.stringify(this.originalTableData));
		return this;
	} catch (error) {
		throw new Error("error caught @ resetData(" + data + "): " + error);
	}
}

InteractiveTable.prototype.setTableSettings = function (newSettings) {
	try {
		this.tableSettings = { ...this.tableSettings, ...newSettings };

		this.tableSettings['headersStyle'] = { ...this.tableDefaultSettings['headersStyle'], ...newSettings['headersStyle'] };
		this.tableSettings['filtersStyle'] = { ...this.tableDefaultSettings['filtersStyle'], ...newSettings['filtersStyle'] };
		this.tableSettings['rowsStyle'] = { ...this.tableDefaultSettings['rowsStyle'], ...newSettings['rowsStyle'] };
		this.tableSettings['oddRowsStyle'] = { ...this.tableDefaultSettings['oddRowsStyle'], ...newSettings['oddRowsStyle'] };
		this.tableSettings['evenRowsStyle'] = { ...this.tableDefaultSettings['evenRowsStyle'], ...newSettings['evenRowsStyle'] };

		return this;
	} catch (error) {
		throw new Error("error caught @ setTableSettings(" + newSettings + "): " + error);
	}
}

InteractiveTable.prototype.printCheckBox = function (row) {
	try {
		if (!this.haveSelection) {
			this.haveSelection = true;
		}
		return '<input type="checkbox" onclick="' + this.identifier + (!this.tableSettings['multiSelect'] ? '.setAllSelected(false)' : '') + '.setSelected(' + row['row-index'] + ', this.checked).refreshTable();" ' + (row['row-selected'] ? 'checked' : '') + '/>';
	} catch (error) {
		throw new Error("error caught @ printCheckBox(" + row + "): " + error);
	}
}

InteractiveTable.prototype.setSelected = function (index, selected) {
	try {
		this.tableData = this.tableData.map(row => row['row-index'] === index ? { ...row, 'row-selected': selected } : row)
		return this;
	} catch (error) {
		throw new Error("error caught @ setSelected(" + index + ", " + selected + "): " + error);
	}
}

InteractiveTable.prototype.setAllSelected = function (selected) {
	try {
		this.tableData = this.tableData.map(row => ({ ...row, 'row-selected': selected }));
		return this;
	} catch (error) {
		throw new Error("error caught @ setAllSelected(" + selected + "): " + error);
	}
}

InteractiveTable.prototype.setAllFilteredSelected = function (selected) {
	try {
		this.tableData = this.tableData.map(row => row['row-filtered'] ? { ...row, 'row-selected': selected } : row);
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
InteractiveTable.prototype.cleanKeys = function (arr) {
	try {
		output = this.removeKeys(arr, ['row-%']);
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
InteractiveTable.prototype.removeKeys = function (arr, keys) {
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

InteractiveTable.prototype.deepFilter = function (arr, predicate) {
	try {
		const filteredArr = [];
		for (const obj of arr) {
			if (predicate(obj)) {
				filteredArr.push(JSON.parse(JSON.stringify(obj)));
			}
		}
		return filteredArr;
	} catch (error) {
		throw new Error("error caught @ deepFilter(" + arr + ", " + predicate + "): " + error);
	}
}

InteractiveTable.prototype.setEdited = function (arr) {
	try {
		arr = (arr || this.tableData);
		for (let i = 0; i < arr.length; i++) {
			const row = arr[i];
			const oriRow = this.originalTableData.find(origDataRow => origDataRow['row-index'] === row['row-index']);
			this.edited = false;
			let isEdited = false;
			for (const key in row) {
				if (!key.startsWith('row-')) {
					if (row[key] !== oriRow[key]) {
						isEdited = true;
						break;
					}
				}
			}
			row['row-edited'] = isEdited;
			this.edited = !(this.edited && isEdited);
		}
		return this;
	} catch (error) {
		throw new Error("error caught @ setEdited(): " + error.toString());
	}
}

InteractiveTable.prototype.getData = function () {
	try {
		return JSON.parse(JSON.stringify(this.TableData));
	} catch (error) {
		throw new Error("error caught @ getData(): " + error.toString());
	}
}

InteractiveTable.prototype.getSelected = function (arr) {
	try {
		arr = (arr || this.tableData);
		let output = this.deepFilter(arr, row => row['row-selected']);
		return output;
	} catch (error) {
		throw new Error("error caught @ getSelected(): " + error.toString());
	}
}

InteractiveTable.prototype.getFiltered = function (arr) {
	try {
		arr = (arr || this.tableData);
		let output = this.deepFilter(arr, row => row['row-filtered']);
		return output;
	} catch (error) {
		throw new Error("error caught @ getFiltered(): " + error.toString());
	}
}

InteractiveTable.prototype.getEdited = function (arr) {
	try {
		arr = (arr || this.tableData);
		this.setEdited(arr);
		const output = this.deepFilter(arr, row => row['row-edited']);
		return output;
	} catch (error) {
		throw new Error("error caught @ getedited(): " + error.toString());
	}
}

InteractiveTable.prototype.sortAsOriginal = function () {
	try {
		this.tableData.sort((a, b) => a['row-index'] - b['row-index']);
		return this;
	} catch (error) {
		throw new Error("error caught @ sortAsOriginal(): " + error);
	}
}

InteractiveTable.prototype.filterRows = function () {
	try {
		this.tableData.forEach((row) => {
			let isFiltered = true;
			for (const col of this.tableSettings['columns']) {
				let matching = this.match((row[col['data']] || '').toString(), (col['filter'] ? col['filter'] : ''), false);
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

InteractiveTable.prototype.sort = function (data, order) {
	try {
		const sortedData = this.tableData.sort((a, b) => {
			const aValue = a[data] || '';
			const bValue = b[data] || '';
			if (typeof aValue === 'boolean' || typeof bValue === 'boolean') {
				if (aValue === bValue) {
					return 0;
				} else if (aValue && !bValue) {
					return order ? -1 : 1;
				} else {
					return order ? 1 : -1;
				}
			} else if (this.isDateString(aValue) && this.isDateString(bValue)) {
				const aNumber = this.parseDate(aValue);
				const bNumber = this.parseDate(bValue);
				if (!isNaN(aNumber) && !isNaN(bNumber)) {
					return order ? aNumber - bNumber : bNumber - aNumber;
				}
			} else if (this.isNumberString(aValue) && this.isNumberString(bValue)) {
				const aNumber = parseFloat(aValue);
				const bNumber = parseFloat(bValue);
				if (!isNaN(aNumber) && !isNaN(bNumber)) {
					return order ? aNumber - bNumber : bNumber - aNumber;
				}
			} else if (this.isIntegerString(aValue) && this.isIntegerString(bValue)) {
				const aInteger = parseInt(aValue);
				const bInteger = parseInt(bValue);
				if (!isNaN(aInteger) && !isNaN(bInteger)) {
					return order ? aInteger - bInteger : bInteger - aInteger;
				}
			} else if (typeof aValue === 'string' && typeof bValue === 'string') {
				return order ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
			}
			return 0;
		});
		this.tableData = sortedData;
		this.tableSettings['sortedBy'] = data;
		this.tableSettings['ascending'] = order;
		return this;
	} catch (error) {
		throw new Error("error caught @ sort(" + data + ", " + order + "): " + error);
	}
}

InteractiveTable.prototype.isDateString = function (value) {
	try {
		return /^(\d{2})[-\/](\d{2})[-\/](\d{4})$|^(\d{4})[-\/](\d{2})[-\/](\d{2})$|^(\d{2})[-\/](\d{2})[-\/](\d{4}) (\d{2}):(\d{2}):(\d{2})$/.test(value);
	} catch (error) {
		throw new Error("error caught @ isDateString(" + value + "): " + error);
	}
}

InteractiveTable.prototype.isNumberString = function (value) {
	try {
		return /^(\d+|\d+\.\d+|\.\d+)$/.test(value);
	} catch (error) {
		throw new Error("error caught @ isNumberString(" + value + "): " + error);
	}
}

InteractiveTable.prototype.isIntegerString = function (value) {
	try {
		return /^(\d+)$/.test(value);
	} catch (error) {
		throw new Error("error caught @ isIntegerString(" + value + "): " + error);
	}
}

InteractiveTable.prototype.parseDate = function (value) {
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

InteractiveTable.prototype.setStart = function (start) {
	try {
		let rowNumber = parseInt(start);
		if (!Number.isNaN(rowNumber)) {
			this.tableSettings = {
				...this.tableSettings
				, start: Math.max(
					Math.min(
						rowNumber,
						this.tableSettings['end']
					),
					Math.max(
						(this.getFiltered().length === 0 ? 0 : 1),
						this.tableSettings['end'] - this.tableSettings['maxRows'] + 1
					)
				)
			};
		}
		return this;
	} catch (err) {
		throw new Error("error caught @ setStart(" + start + ") - " + err);
	}
}

InteractiveTable.prototype.setEnd = function (end) {
	try {
		let rowNumber = parseInt(end);
		if (!Number.isNaN(rowNumber)) {
			this.tableSettings = {
				...this.tableSettings
				, end: Math.min(
					Math.max(
						rowNumber,
						this.tableSettings['start']
					),
					Math.min(
						this.getFiltered().length,
						this.tableSettings['start'] + this.tableSettings['maxRows'] - 1
					)
				)
			};
		}
		return this;
	} catch (err) {
		throw new Error("error caught @ setEnd(" + end + ") - " + err);
	}
}

InteractiveTable.prototype.toBegining = function () {
	try {
		const length = this.tableSettings['end'] - this.tableSettings['start'] + 1;
		this.tableSettings['start'] = this.getFiltered().length === 0 ? 0 : 1;
		this.tableSettings['end'] = Math.min(this.getFiltered().length, this.tableSettings['start'] + length - 1);
		return this;
	} catch (err) {
		throw new Error("error caught @ toBegining() - " + err);
	}
}

InteractiveTable.prototype.priviousPage = function () {
	try {
		const length = this.tableSettings['end'] - this.tableSettings['start'] + 1;
		this.tableSettings['start'] = Math.max(this.getFiltered().length === 0 ? 0 : 1, this.tableSettings['start'] - length);
		this.tableSettings['end'] = Math.min(this.tableData.length, this.tableSettings['start'] + length - 1);
		return this;
	} catch (err) {
		throw new Error("error caught @ priviousPage() - " + err);
	}
}

InteractiveTable.prototype.nextPage = function () {
	try {
		const length = this.tableSettings['end'] - this.tableSettings['start'] + 1;
		this.tableSettings['end'] = Math.min(this.getFiltered().length, this.tableSettings['end'] + length);
		this.tableSettings['start'] = Math.max(1, this.tableSettings['end'] - length + 1);
		return this;
	} catch (err) {
		throw new Error("error caught @ nextPage() - " + err);
	}
}

InteractiveTable.prototype.toEnding = function () {
	try {
		const length = this.tableSettings['end'] - this.tableSettings['start'] + 1;
		this.tableSettings['end'] = this.getFiltered().length;
		this.tableSettings['start'] = Math.max(1, this.tableSettings['end'] - length + 1);
		return this;
	} catch (err) {
		throw new Error("error caught @ priviousPage() - " + err);
	}
}

InteractiveTable.prototype.printSelectingGroup = function () {
	try {
		if (this.tableSettings['multiSelect'] == true && this.haveSelection) {
			const selectedRows = this.tableData.filter(row => row['row-selected']);
			const noOfSelected = selectedRows.length;
			const selectAllButton = '<button class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.setAllFilteredSelected(true).refreshTable()">' + this.tableSettings.selectAllFiltered + '</button>';
			const unselectAllButton = '<button class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.setAllFilteredSelected(false).refreshTable()">' + this.tableSettings.unselectAllFiltered + '</button>';
			return '<div style="display:flex;flex-flow:row wrap;justify-content:flex-start;align-items:center;column-gap:3px;">' + this.tableSettings.noOfSelected + noOfSelected + ' <div style="display:flex;flex-flow:row wrap;justify-content:flex-start;align-items:center;column-gap:3px;">' + selectAllButton + unselectAllButton + '</div></div>';
		} else {
			return '';
		}
	} catch (err) {
		throw new Error("error caught @ printSelectingGroup() - " + err);
	}
}

InteractiveTable.prototype.printResetFiltersButton = function () {
	try {
		return '<button class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.resetFilters().filterRows().resetPageNumbers().refreshTable();">' + this.tableSettings.resetFilters + '</button>';
	} catch (err) {
		throw new Error("error caught @ printResetFiltersButton() - " + err);
	}
}

InteractiveTable.prototype.printResetEditsButton = function () {
	try {
		return this.edited ? '<button class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.resetData().filterRows().resetPageNumbers().refreshTable();">' + this.tableSettings.resetEdits + '</button>' : '';
	} catch (err) {
		throw new Error("error caught @ printResetEditsButton() - " + err);
	}
}

InteractiveTable.prototype.printPaginationGroup = function () {
	try {
		const startInput = '<input type="text" style=\'text-align:center; padding: 3px 8px; width: ' + (Math.max(1, Math.ceil(Math.log10(this.tableData.length))) * 8 + 20) + 'px;\' value="' + this.tableSettings['start'] + '" onchange="' + this.identifier + '.setStart(this.value).refreshTable()" />';
		const endInput = '<input type="text" style=\'text-align:center; padding: 3px 8px; width: ' + (Math.max(1, Math.ceil(Math.log10(this.tableData.length))) * 8 + 20) + 'px;\' value="' + this.tableSettings['end'] + '" onchange="' + this.identifier + '.setEnd(this.value).refreshTable()" />';
		const totalRows = this.getFiltered().length;
		const toBeginingButton = '<button class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.toBegining().refreshTable();">' + this.tableSettings['toBegining'] + '</button>';
		const previousButton = '<button style="margin-left:5px;" class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.priviousPage().refreshTable();">' + this.tableSettings['previousPage'] + '</button>';
		const nextButton = '<button style="margin-right:5px;" class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.nextPage().refreshTable();">' + this.tableSettings['nextPage'] + '</button>';
		const toEndingButton = '<button class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.toEnding().refreshTable();">' + this.tableSettings['toEnding'] + '</button>';
		return '<div style="' + this.tableSettings['paginationGroupStyle'] + '"><div style="width:100%;display:flex;flex-flow:row wrap;justify-content:center;align-items:center;column-gap:3px;"><div>' + toBeginingButton + previousButton + '</div><div>' + startInput + '<span style=\'margin: 0px 5px;\'>-</span>' + endInput + '<span style=\'margin: 0px 5px;\'>/</span>' + totalRows + '</div><div>' + nextButton + toEndingButton + '</div></div></div>';
	} catch (err) {
		throw new Error("error caught @ printPaginationGroup() - " + err);
	}
}

InteractiveTable.prototype.setFilter = function (index, value) {
	try {
		this.tableSettings['columns'][index]['filter'] = value;
		return this;
	} catch (err) {
		throw new Error("error caught @ setFilter(" + index + ", " + value + ") - " + err);
	}
}

InteractiveTable.prototype.resetFilters = function () {
	try {
		this.tableSettings['columns'].forEach((col) => {
			col['filter'] = "";
		});
		return this;
	} catch (err) {
		throw new Error("error caught @ resetFilters() - " + err);
	}
}

InteractiveTable.prototype.resetPageNumbers = function () {
	try {
		const length = this.tableSettings['end'] - this.tableSettings['start'] + 1;
		this.setStart(this.getFiltered().length === 0 ? 0 : 1);
		this.setEnd(Math.max(length, this.tableSettings['defaultEnd']));
		return this;
	} catch (err) {
		throw new Error("error caught @ resetPageNumbers() - " + err);
	}
}

InteractiveTable.prototype.match = function (text, matchingText, caseSensitive) {
	let match = false;

	try {
		if (text === null && matchingText !== '') {
			return false;
		} else if (matchingText.trim() === "") {
			match = true;
		} else {
			const regex = matchingText.trim().startsWith("regex:");

			if (regex) {
				const regexPattern = new RegExp(matchingText.trim().substring(6));
				match = regexPattern.test(text);
			} else {
				if (!caseSensitive) {
					text = text.toUpperCase();
					matchingText = matchingText.toUpperCase();
				}

				const values = [];
				let isQuoteOpen = false;
				let currentWord = "";

				for (let i = 0; i < matchingText.length; i++) {
					const char = matchingText[i];

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

				const exclusionSet = [];
				const inclusionSet = [];

				for (const value of values) {
					if (value.startsWith("-")) {
						exclusionSet.push(value.substring(1));
					} else {
						inclusionSet.push(value);
					}
				}

				/*handle excludes*/
				let exclusiveMatch = true;
				for (const value of exclusionSet) {
					exclusiveMatch = exclusiveMatch && text.indexOf(value) === -1;
				}

				/*handle includes*/
				let inclusiveMatch = inclusionSet.length === 0;
				for (const value of inclusionSet) {
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

InteractiveTable.prototype.editData = function (index, data, value) {
	try {
		let row = this.tableData.find((row) => {
			return row['row-index'] === index;
		});
		if (row[data] !== value) {
			if (row['ori-' + data] === undefined) {
				row['ori-' + data] = row[data];
			} else if (row['ori-' + data] === value) {
				delete row['ori-' + data];
			}
			row[data] = value;
			this.setEdited();
			this.refreshTable();
		}
		return this;
	} catch (err) {
		throw new Error("error caught @ editData(" + index + ", " + data + ", " + value + "): " + err);
	}
}

InteractiveTable.prototype.stringToAscii = function (str) {
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

InteractiveTable.prototype.printTable = function () {
	try {
		var html = "";

		this.sort(this.tableSettings['sortedBy'], this.tableSettings['ascending']);

		html += "<table style='width:100%;height:min-content;border-collapse: collapse;'><tbody>";

		/*headers*/
		html += "<tr>";
		this.tableSettings['columns'].forEach((col) => {
			var headerStyle = { ...(this.tableSettings['headersStyle'] || {}), ...(col['headerStyle'] || {}) };
			var headerHtml = '<div'
				+ ' style="' + this.toStyleString(headerStyle) + '"'
				+ ' class="sort-header ' + (this.tableSettings['sortedBy'] === col['data'] ? 'sorting' : '') + '"'
				+ ' onclick="' + this.identifier + '.sort(\'' + col['data'] + '\', ' + (this.tableSettings['sortedBy'] !== col['data'] || !this.tableSettings['ascending']) + ').refreshTable()"'
				+ '>'
				+ '<div style="flex:1;"></div>'
				+ col.header
				+ (this.tableSettings['sortedBy'] === col['data'] ? (this.tableSettings['ascending'] ? '&#9650;' : '&#9660;') : '')
				+ '<div style="flex:1;"></div>'
				+ '</div>';
			html += '<td style="padding:0px;' + this.toStyleString(col['widthStyle']) + '">' + headerHtml + '</td>';
		});
		html += '</tr>';

		/*filters*/
		html += '<tr>';
		this.tableSettings['columns'].forEach((col) => {
			var filterStyle = this.toStyleString({ ...(this.tableSettings['filtersStyle'] || {}), ...(col['filterStyle'] || {}) });
			var filterValue = col['filter'] || '';
			var filterPlaceholder = col['filterPlaceholder'] || '';
			var filterHtml = '<div'
				+ ' style="' + filterStyle + '"'
				+ '>'
				+ '<input'
				+ ' class="filtering-input"'
				+ ' style="border:none; width:100%; padding:1px;"'
				+ ' type="text"'
				+ ' placeholder="' + filterPlaceholder + '"'
				+ ' onchange="' + this.identifier + '.setFilter(' + this.tableSettings['columns'].indexOf(col) + ',this.value).filterRows().resetPageNumbers().refreshTable();"'
				+ ' value="' + this.stringToAscii(filterValue) + '"'
				+ '>'
				+ '</div>';
			html += '<td style="padding:0px;' + this.toStyleString(col['widthStyle']) + '">' + filterHtml + '</td>';
		});
		html += '</tr>';

		/*rows*/
		let start = this.tableSettings['start'];
		let end = this.tableSettings['end'];
		var filteredData = this.getFiltered().slice(start - 1, end);
		filteredData.forEach((row, index) => {
			var rowsStyle = (col) => {
				return { ...(this.tableSettings.rowsStyle || ''), ...(col.rowsStyle || '') };
			};
			var oddEvenRowsStyle = (col) => {
				return (index % 2 === 1 ? this.tableSettings.evenRowsStyle : this.tableSettings.oddRowsStyle);
			};
			html += '<tr>';
			this.tableSettings['columns'].forEach((col) => {
				var cellData = row[col['data']] !== null ? row[col['data']] : '';
				if (col.modifier) {
					if (typeof col.modifier === 'function') {
						var clone = Object.assign({}, row);
						cellData = col.modifier(clone);
					}
				}
				html += '<td style="' + this.toStyleString({ ...oddEvenRowsStyle(col), ...rowsStyle(col) }) + '">' + cellData + '</td>';
			});
			html += '</tr>';
		});

		html += '</tbody></table>';

		html = "<div style='position:relative;width:100%;display:flex;flex-flow:column nowrap;justify-content:flex-start;align-items:center;row-gap:3px;'>"
			+ "<div style='width:100%;display:flex;flex-flow:row wrap;justify-content:flex-start;align-items:center;column-gap:3px;'>"
			+ "<div>" + this.tableSettings['label'] + "</div>"
			+ "<div style='flex:1;'></div>"
			+ "<div style='" + this.tableSettings['actionsGroupStyle'] + "'>"
			+ "<div style='display:flex;flex-flow:row wrap;justify-content:flex-start;align-items:center;column-gap:3px;'>"
			+ this.printSelectingGroup()
			+ this.printResetFiltersButton()
			+ this.printResetEditsButton()
			+ "</div>"
			+ "</div>"
			+ "</div>"
			+ "<div style='width:100%;overflow:auto;" + (this.tableSettings['maxHeight'] ? " max-height:" + this.tableSettings['maxHeight'] + ";" : "") + "'>" + html + "</div>"
			+ this.printPaginationGroup()
			+ '</div>\n';

		return html;
	} catch (err) {
		throw new Error("error caught @ printTable(): " + err);
	}
}

InteractiveTable.prototype.fillTable = function (id) {
	try {
		if (document.getElementById(id) !== null) {
			this.resetPageNumbers();
			document.getElementById(id).innerHTML = this.printTable();
		}
		this.container = id;
		return this;
	} catch (err) {
		throw new Error("error caught @ fillTable(" + id + "): " + err);
	}
}

InteractiveTable.prototype.refreshTable = function () {
	try {
		if (document.getElementById(this.container) !== null) {
			document.getElementById(this.container).innerHTML = this.printTable();
		}
		return this;
	} catch (err) {
		throw new Error("error caught @ refreshTable(): " + err);
	}
}

