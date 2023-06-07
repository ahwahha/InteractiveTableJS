class InteractiveTable {

	constructor(id) {
		this.identifier = id;
		this.container = null;
		this.tableData = [{ "key": "value" }];
		this.originalTableData = null;
		this.sortingBy = null;
		this.ascending = true;
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
					rowsStyle: {}
				}
			],
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
				"border": "#aaa solid 1px",
				"height": "calc(100% - 8px)",
				"display": "flex",
				"flex-flow": "column nowrap",
				"padding": "3px",
				"border-radius": "5px",
				"margin": "1px",
				"text-align": "left",
				"font-weight": "bold",
				"font-size": "12px",
				"background-color": "#add"
			},
			"filtersStyle": {
				"border": "#aaa solid 1px",
				"padding": "3px",
				"border-radius": "5px",
				"margin": "1px",
				"text-align": "center",
				"font-size": "12px",
				"width": "calc(100% - 2px)"
			},
			"rowsStyle": {
				"text-align": "center",
				"font-size": "12px"
			},
			"oddRowsStyle": {},
			"evenRowsStyle": {
				"background-color": "#f9f9f9"
			}
		};
		this.tableSettings = JSON.parse(JSON.stringify(this.tableDefaultSettings));
	}

	toStyleString(obj) {
		try {
			var output = '';
			for (const [key, value] of Object.entries(obj)) {
				output += key + ':' + value + ';';
			}
			return output;
		} catch (error) {
			throw new Error("error caught @ toStyleString(" + obj + "): " + error);
		}
	}

	setData(data) {
		try {
			this.edited = false;
			data.forEach((row, index) => {
				row["row-index"] = index + 1;
				row["row-filtered"] = true;
				row["row-selected"] = false;
				row["row-this.edited"] = false;
			});
			this.tableData = data;
			this.sort("row-index", true);
			this.sortingBy = "row-index";
			this.originalTableData = JSON.parse(JSON.stringify(data));
			return this;
		} catch (error) {
			throw new Error("error caught @ setData(" + data + "): " + error);
		}
	}

	resetData(data) {
		try {
			this.edited = false;
			this.tableData = JSON.parse(JSON.stringify(this.originalTableData));
			return this;
		} catch (error) {
			throw new Error("error caught @ resetData(" + data + "): " + error);
		}
	}

	setTableSettings(newSettings) {
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

	printCheckBox(row) {
		try {
			if (!this.haveSelection) {
				this.haveSelection = true;
			}
			return '<input type="checkbox" onclick="' + this.identifier + (!this.tableSettings['multiSelect'] ? '.setAllSelected(false)' : '') + '.setSelected(' + row['row-index'] + ', this.checked).refreshTable();" ' + (row['row-selected'] ? 'checked' : '') + '/>';
		} catch (error) {
			throw new Error("error caught @ printCheckBox(" + row + "): " + error);
		}
	}

	setSelected(index, selected) {
		try {
			this.tableData = this.tableData.map(row => row['row-index'] === index ? { ...row, 'row-selected': selected } : row)
			return this;
		} catch (error) {
			throw new Error("error caught @ setSelected(" + index + ", " + selected + "): " + error);
		}
	}

	setAllSelected(selected) {
		try {
			this.tableData = this.tableData.map(row => ({ ...row, 'row-selected': selected }));
			return this;
		} catch (error) {
			throw new Error("error caught @ setAllSelected(" + selected + "): " + error);
		}
	}

	setAllFilteredSelected(selected) {
		try {
			this.tableData = this.tableData.map(row => row['row-filtered'] ? { ...row, 'row-selected': selected } : row);
			return this;
		} catch (error) {
			throw new Error("error caught @ setAllFilteredSelected(" + selected + "): " + error);
		}
	}

	removeKey(arr, keys) {
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
			throw new Error("error caught @ removeKey(" + JSON.stringify(arr) + ", " + JSON.stringify(keys) + "): " + error.toString());
		}
	}

	deepFilter(arr, predicate) {
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

	setEdited() {
		try {
			for (let i = 0; i < this.tableData.length; i++) {
				const row = this.tableData[i];
				const origRow = this.originalTableData.find(origDataRow => origDataRow['row-index'] === row['row-index']);
				let isEdited = false;
				for (const key in row) {
					if (key !== 'row-index' && key !== 'row-filtered' && key !== 'row-selected' && key !== 'row-this.edited') {
						if (row[key] !== origRow[key]) {
							isEdited = true;
							break;
						}
					}
				}
				row['row-this.edited'] = isEdited;
			}
			return this;
		} catch (error) {
			throw new Error("error caught @ setEdited(): " + error.toString());
		}
	}

	getSelected(clean = true) {
		try {
			let output = this.deepFilter(this.tableData, row => row['row-selected']);
			if (!clean) {
				return output;
			} else {
				output = this.removeKey(output, ['row-%']);
				return output;
			}
		} catch (error) {
			throw new Error("error caught @ getSelected(): " + error.toString());
		}
	}

	getFiltered(clean = true) {
		try {
			let output = this.deepFilter(this.tableData, row => row['row-filtered']);
			if (!clean) {
				return output;
			} else {
				output = this.removeKey(output, ['row-%']);
				return output;
			}
		} catch (error) {
			throw new Error("error caught @ getFiltered(): " + error.toString());
		}
	}

	getEdited(clean = true) {
		try {
			const output = this.deepFilter(this.tableData, row => row['row-this.edited']);
			if (!clean) {
				return output;
			} else {
				this.removeKey(output, ['row-index', 'row-selected', 'row-filtered', 'row-this.edited']);
				return output;
			}
		} catch (error) {
			throw new Error("error caught @ getthis.edited(): " + error.toString());
		}
	}

	sortAsOriginal() {
		try {
			this.tableData.sort((a, b) => a['row-index'] - b['row-index']);
			return this;
		} catch (error) {
			throw new Error("error caught @ sortAsOriginal(): " + error);
		}
	}

	filterRows() {
		try {
			const length = this.tableSettings['end'] - this.tableSettings['start'] + 1;
			this.tableData.forEach((row) => {
				let isFiltered = true;
				for (const col of this.tableSettings['columns']) {
					let matching = this.match((row[col['data']]||'').toString(), (col['filter'] ? col['filter'] : ''), false);
					if (!matching) {
						isFiltered = false;
						break;
					}
				}
				row["row-filtered"] = isFiltered;
			});
			this.setStart(1);
			this.setEnd(Math.max(length, this.tableSettings['defaultEnd']));
			return this;
		} catch (error) {
			throw new Error("error caught @ filterRows(): " + error);
		}
	}

	sort(data, order = true) {
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
			this.sortingBy = data;
			this.ascending = order;
			return this;
		} catch (error) {
			throw new Error("error caught @ sort(" + data + ", " + order + "): " + error);
		}
	}

	isDateString(value) {
		try {
			return /^(\d{2})[-\/](\d{2})[-\/](\d{4})$|^(\d{4})[-\/](\d{2})[-\/](\d{2})$|^(\d{2})[-\/](\d{2})[-\/](\d{4}) (\d{2}):(\d{2}):(\d{2})$/.test(value);
		} catch (error) {
			throw new Error("error caught @ isDateString(" + value + "): " + error);
		}
	}

	isNumberString(value) {
		try {
			return /^(\d+|\d+\.\d+|\.\d+)$/.test(value);
		} catch (error) {
			throw new Error("error caught @ isNumberString(" + value + "): " + error);
		}
	}

	isIntegerString(value) {
		try {
			return /^(\d+)$/.test(value);
		} catch (error) {
			throw new Error("error caught @ isIntegerString(" + value + "): " + error);
		}
	}

	parseDate(value) {
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

	setStart(start) {
		try {
			let rowNumber = parseInt(start);
			if (!Number.isNaN(rowNumber)) {
				this.tableSettings = { ...this.tableSettings, start: Math.max((this.getFiltered(false).length === 0 ? 0 : 1), Math.min(rowNumber, this.tableSettings['end']), this.tableSettings['end'] - this.tableSettings['maxRows'] + 1) };
			}
			return this;
		} catch (err) {
			throw new Error("error caught @ setStart(" + start + ") - " + err);
		}
	}

	setEnd(end) {
		try {
			let rowNumber = parseInt(end);
			if (!Number.isNaN(rowNumber)) {
				this.tableSettings = { ...this.tableSettings, end: Math.min(Math.max(rowNumber, this.tableSettings['start']), this.getFiltered(false).length, this.tableSettings['start'] + this.tableSettings['maxRows'] - 1) };
			}
			return this;
		} catch (err) {
			throw new Error("error caught @ setEnd(" + end + ") - " + err);
		}
	}

	toBegining() {
		try {
			const length = this.tableSettings['end'] - this.tableSettings['start'] + 1;
			this.tableSettings['start'] = this.getFiltered(false).length === 0 ? 0 : 1;
			this.tableSettings['end'] = Math.min(this.getFiltered(false).length, this.tableSettings['start'] + length - 1);
			return this;
		} catch (err) {
			throw new Error("error caught @ toBegining() - " + err);
		}
	}

	priviousPage() {
		try {
			const length = this.tableSettings['end'] - this.tableSettings['start'] + 1;
			this.tableSettings['start'] = Math.max(this.getFiltered(false).length === 0 ? 0 : 1, this.tableSettings['start'] - length);
			this.tableSettings['end'] = Math.min(this.tableData.length, this.tableSettings['start'] + length - 1);
			return this;
		} catch (err) {
			throw new Error("error caught @ priviousPage() - " + err);
		}
	}

	nextPage() {
		try {
			const length = this.tableSettings['end'] - this.tableSettings['start'] + 1;
			this.tableSettings['end'] = Math.min(this.getFiltered(false).length, this.tableSettings['end'] + length);
			this.tableSettings['start'] = Math.max(1, this.tableSettings['end'] - length + 1);
			return this;
		} catch (err) {
			throw new Error("error caught @ nextPage() - " + err);
		}
	}

	toEnding() {
		try {
			const length = this.tableSettings['end'] - this.tableSettings['start'] + 1;
			this.tableSettings['end'] = this.getFiltered(false).length;
			this.tableSettings['start'] = Math.max(1, this.tableSettings['end'] - length + 1);
			return this;
		} catch (err) {
			throw new Error("error caught @ priviousPage() - " + err);
		}
	}

	printSelectingGroup() {
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

	printResetFiltersButton() {
		try {
			return '<button class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.resetFilters().filterRows().refreshTable();">' + this.tableSettings.resetFilters + '</button>';
		} catch (err) {
			throw new Error("error caught @ printResetFiltersButton() - " + err);
		}
	}

	printResetEditsButton() {
		try {
			return this.edited ? '<button class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.resetData().filterRows().refreshTable();">' + this.tableSettings.resetEdits + '</button>' : '';
		} catch (err) {
			throw new Error("error caught @ printResetEditsButton() - " + err);
		}
	}

	printPaginationGroup() {
		try {
			this.setStart(this.tableSettings['start']);
			this.setEnd(this.tableSettings['end']);
			const startInput = '<input type="text" style=\'text-align:center; padding: 3px 8px; width: ' + (Math.max(1, Math.ceil(Math.log10(this.tableData.length))) * 8 + 20) + 'px;\' value="' + this.tableSettings['start'] + '" onchange="' + this.identifier + '.setStart(this.value).refreshTable()" />';
			const endInput = '<input type="text" style=\'text-align:center; padding: 3px 8px; width: ' + (Math.max(1, Math.ceil(Math.log10(this.tableData.length))) * 8 + 20) + 'px;\' value="' + this.tableSettings['end'] + '" onchange="' + this.identifier + '.setEnd(this.value).refreshTable()" />';
			const totalRows = this.getFiltered(false).length;
			const toBeginingButton = '<button class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.toBegining().refreshTable();">' + this.tableSettings['toBegining'] + '</button>';
			const previousButton = '<button style="margin-left:5px;" class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.priviousPage().refreshTable();">' + this.tableSettings['previousPage'] + '</button>';
			const nextButton = '<button style="margin-right:5px;" class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.nextPage().refreshTable();">' + this.tableSettings['nextPage'] + '</button>';
			const toEndingButton = '<button class="' + this.tableSettings['buttonClass'] + '" onclick="' + this.identifier + '.toEnding().refreshTable();">' + this.tableSettings['toEnding'] + '</button>';
			return '<div style="' + this.tableSettings['paginationGroupStyle'] + '"><div style="width:100%;display:flex;flex-flow:row wrap;justify-content:center;align-items:center;column-gap:3px;"><div>' + toBeginingButton + previousButton + '</div><div>' + startInput + '<span style=\'margin: 0px 5px;\'>-</span>' + endInput + '<span style=\'margin: 0px 5px;\'>/</span>' + totalRows + '</div><div>' + nextButton + toEndingButton + '</div></div></div>';
		} catch (err) {
			throw new Error("error caught @ printPaginationGroup() - " + err);
		}
	}

	setFilter(index, value) {
		try {
			this.tableSettings['columns'][index]['filter'] = value;
			this.tableSettings['start'] = 1;
			this.setEnd(Math.max(length, this.tableSettings['defaultEnd']));
			return this;
		} catch (err) {
			throw new Error("error caught @ setFilter(" + index + ", " + value + ") - " + err);
		}
	}

	resetFilters() {
		try {
			const length = this.tableSettings['end'] - this.tableSettings['start'] + 1;
			this.tableSettings['columns'].forEach((col) => {
				col['filter'] = "";
			});
			this.tableSettings['start'] = 1;
			this.setEnd(Math.max(length, this.tableSettings['defaultEnd']));
			return this;
		} catch (err) {
			throw new Error("error caught @ resetFilters() - " + err);
		}
	}

	match(text, matchingText, caseSensitive) {
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

	editData(index, data, value) {
		try {
			this.edited = true;
			let row = this.tableData.find((row) => {
				return row['row-index'] === index;
			});
			if (row['ori-' + data] === undefined) {
				row['ori-' + data] = row[data];
			}
			row[data] = value;
			this.refreshTable();
			return this;
		} catch (err) {
			throw new Error("error caught @ editData(" + index + ", " + data + ", " + value + "): " + err);
		}
	}

	stringToAscii(str) {
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

	printTable() {
		try {
			var html = "";

			/*headers*/
			html += "<table style='width:100%;height:min-content;'><thead><tr>";
			this.tableSettings['columns'].forEach((col) => {
				var headerStyle = this.toStyleString({ ...(this.tableSettings['headersStyle'] || {}), ...(col['headerStyle'] || {}) });
				var headerHtml = '<div style="' + headerStyle + '" class="sort-header ' + (this.sortingBy === col['data'] ? 'sorting' : '') + '" onclick="' + this.identifier + '.sort(\'' + col['data'] + '\', ' + (this.sortingBy !== col['data'] || !this.ascending) + ').refreshTable()"><div style="flex:1;height:0px;"></div>' + col.header + (this.sortingBy === col['data'] ? (this.ascending ? '&#9650;' : '&#9660;') : '') + '<div style="flex:1;"></div></div>';
				html += '<td style="padding:0px;">' + headerHtml + '</td>';
			});
			html += '</tr>';

			/*filters*/
			html += '<tr>';
			this.tableSettings['columns'].forEach((col) => {
				var filterStyle = this.toStyleString({ ...(this.tableSettings['filtersStyle'] || {}), ...(col['filterStyle'] || {}) });
				var filterValue = col['filter'] || '';
				var filterPlaceholder = col['filterPlaceholder'] || '';
				html += '<td style="padding:0px;"><input style="' + filterStyle + '" class="filtering-input" type="text" style="width:100%;" value="' + this.stringToAscii(filterValue) + '" onchange="' + this.identifier + '.setFilter(' + this.tableSettings['columns'].indexOf(col) + ',this.value).filterRows().refreshTable();" placeholder="' + filterPlaceholder + '" /></td>';
			});
			html += '</tr></head><tbody>';

			/*rows*/
			var start = this.tableSettings['start'];
			var end = this.tableSettings['end'];
			var filteredData = this.getFiltered(false).slice(start - 1, end);
			filteredData.forEach((row, index) => {
				var rowsStyle = (col) => {
					return this.toStyleString({ ...(this.tableSettings.rowsStyle || ''), ...(col.rowsStyle || '') });
				};
				var oddEvenRowsStyle = (col) => {
					return this.toStyleString((index % 2 === 1 ? this.tableSettings.evenRowsStyle : this.tableSettings.oddRowsStyle));
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
					html += '<td style="' + oddEvenRowsStyle(col) + rowsStyle(col) + '">' + cellData + '</td>';
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
				+ "<div style='width:100%;overflow:auto;" + (this.tableSettings['maxHeight'] ? " max-height:" + this.tableSettings['maxHeight'] + ";" : "") + " overflow:auto;'>" + html + "</div>"
				+ this.printPaginationGroup()
				+ '</div>\n';

			return html;
		} catch (err) {
			throw new Error("error caught @ printTable(): " + err);
		}
	}

	fillTable(id) {
		try {
			if (document.getElementById(id) !== null) {
				document.getElementById(id).innerHTML = this.printTable();
			}
			this.container = id;
			return this;
		} catch (err) {
			throw new Error("error caught @ fillTable(" + id + "): " + err);
		}
	}

	refreshTable() {
		try {
			if (document.getElementById(this.container) !== null) {
				document.getElementById(this.container).innerHTML = this.printTable();
			}
			return this;
		} catch (err) {
			throw new Error("error caught @ refreshTable(): " + err);
		}
	}

}
