function InteractiveTable(id) {
	let identifier = id;
	let container = null;
	let tableData = [{ "key": "value" }];
	let originalTableData = null;
	let sortingBy = null;
	let ascending = true;
	let haveSelection = false;
	let edited = false;
	let tableSettings = {
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
		"headersStyle": 'border:#aaa solid 1px; height:calc(100% - 8px); display:flex; flex-flow:column nowrap; padding:3px; border-radius:5px; margin:1px; text-align:left; font-weight:bold; font-size:12px; background-color:#add;',
		"filtersStyle": 'border:#aaa solid 1px; padding:3px; border-radius:5px; margin:1px; text-align:center; font-size:12px; width: calc(100% - 2px);',
		"rowsStyle": 'text-align:center; font-size:12px;',
		"oddRowsStyle": '',
		"evenRowsStyle": 'background-color:#f9f9f9;',
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
		"toEnding": '>>'
	};

	function setData(data) {
		try {
			edited = false;
			data.forEach((row, index) => {
				row["row-index"] = index + 1;
				row["row-filtered"] = true;
				row["row-selected"] = false;
				row["row-edited"] = false;
			});
			tableData = data;
			sort("row-index", true);
			this.sortingBy = "row-index";
			originalTableData = JSON.parse(JSON.stringify(data));
			return this;
		} catch (error) {
			throw new Error("error caught @ setData(" + data + "): " + error);
		}
	}

	function resetData(data) {
		try {
			edited = false;
			tableData = JSON.parse(JSON.stringify(originalTableData));
			return this;
		} catch (error) {
			throw new Error("error caught @ resetData(" + data + "): " + error);
		}
	}

	function setTableSettings(newSettings) {
		try {
			tableSettings = { ...tableSettings, ...newSettings };
			return this;
		} catch (error) {
			throw new Error("error caught @ setTableSettings(" + newSettings + "): " + error);
		}
	}

	function printCheckBox(row) {
		try {
			if (!haveSelection) {
				haveSelection = true;
			}
			return '<input type="checkbox" onclick="' + identifier + (!tableSettings['multiSelect'] ? '.setAllSelected(false)' : '') + '.setSelected(' + row['row-index'] + ', this.checked).refreshTable();" ' + (row['row-selected'] ? 'checked' : '') + '/>';
		} catch (error) {
			throw new Error("error caught @ printCheckBox(" + row + "): " + error);
		}
	}

	function setSelected(index, selected) {
		try {
			tableData = tableData.map(row => row['row-index'] === index ? { ...row, 'row-selected': selected } : row)
			return this;
		} catch (error) {
			throw new Error("error caught @ setSelected(" + index + ", " + selected + "): " + error);
		}
	}

	function setAllSelected(selected) {
		try {
			tableData = tableData.map(row => ({ ...row, 'row-selected': selected }));
			return this;
		} catch (error) {
			throw new Error("error caught @ setAllSelected(" + selected + "): " + error);
		}
	}

	function setAllFilteredSelected(selected) {
		try {
			tableData = tableData.map(row => row['row-filtered'] ? { ...row, 'row-selected': selected } : row);
			return this;
		} catch (error) {
			throw new Error("error caught @ setAllFilteredSelected(" + selected + "): " + error);
		}
	}

	function removeKey(arr, keys) {
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

	function deepFilter(arr, predicate) {
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

	function setEdited() {
		try {
			for (let i = 0; i < tableData.length; i++) {
				const row = tableData[i];
				const origRow = originalTableData.find(origRow => origRow['row-index'] === row['row-index']);
				let isEdited = false;
				for (const key in row) {
					if (key !== 'row-index' && key !== 'row-filtered' && key !== 'row-selected' && key !== 'row-edited') {
						if (row[key] !== origRow[key]) {
							isEdited = true;
							break;
						}
					}
				}
				row['row-edited'] = isEdited;
			}
			return this;
		} catch (error) {
			throw new Error("error caught @ setEdited(): " + error.toString());
		}
	}

	function getSelected(clean = true) {
		try {
			let output = deepFilter(tableData, row => row['row-selected']);
			if (!clean) {
				return output;
			} else {
				output = removeKey(output, ['row-%']);
				return output;
			}
		} catch (error) {
			throw new Error("error caught @ getSelected(): " + error.toString());
		}
	}

	function getFiltered(clean = true) {
		try {
			let output = deepFilter(tableData, row => row['row-filtered']);
			if (!clean) {
				return output;
			} else {
				output = removeKey(output, ['row-%']);
				return output;
			}
		} catch (error) {
			throw new Error("error caught @ getFiltered(): " + error.toString());
		}
	}

	function getEdited(clean = true) {
		try {
			const output = deepFilter(tableData, row => row['row-edited']);
			if (!clean) {
				return output;
			} else {
				removeKey(output, ['row-index', 'row-selected', 'row-filtered', 'row-edited']);
				return output;
			}
		} catch (error) {
			throw new Error("error caught @ getEdited(): " + error.toString());
		}
	}

	function sortAsOriginal() {
		try {
			tableData.sort((a, b) => a['row-index'] - b['row-index']);
			return this;
		} catch (error) {
			throw new Error("error caught @ sortAsOriginal(): " + error);
		}
	}
	function filterRows() {
		try {
			const length = tableSettings['end'] - tableSettings['start'] + 1;
			tableData.forEach((row) => {
				let isFiltered = true;
				for (const col of tableSettings['columns']) {
					let matching = match(row[col['data']], (col['filter'] ? col['filter'] : ''), false);
					if (!matching) {
						isFiltered = false;
						break;
					}
				}
				row["row-filtered"] = isFiltered;
			});
			setStart(1);
			setEnd(Math.max(length, tableSettings['defaultEnd']));
			return this;
		} catch (error) {
			throw new Error("error caught @ filterRows(): " + error);
		}
	}

	function sort(data, order = true) {
		try {
			const sortedData = tableData.sort((a, b) => {
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
				} else if (isDateString(aValue) && isDateString(bValue)) {
					const aNumber = parseDate(aValue);
					const bNumber = parseDate(bValue);
					if (!isNaN(aNumber) && !isNaN(bNumber)) {
						return order ? aNumber - bNumber : bNumber - aNumber;
					}
				} else if (isNumberString(aValue) && isNumberString(bValue)) {
					const aNumber = parseFloat(aValue);
					const bNumber = parseFloat(bValue);
					if (!isNaN(aNumber) && !isNaN(bNumber)) {
						return order ? aNumber - bNumber : bNumber - aNumber;
					}
				} else if (isIntegerString(aValue) && isIntegerString(bValue)) {
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
			tableData = sortedData;
			sortingBy = data;
			ascending = order;
			return this;
		} catch (error) {
			throw new Error("error caught @ sort(" + data + ", " + order + "): " + error);
		}
	}

	function isDateString(value) {
		try {
			return /^(\d{2})[-\/](\d{2})[-\/](\d{4})$|^(\d{4})[-\/](\d{2})[-\/](\d{2})$|^(\d{2})[-\/](\d{2})[-\/](\d{4}) (\d{2}):(\d{2}):(\d{2})$/.test(value);
		} catch (error) {
			throw new Error("error caught @ isDateString(" + value + "): " + error);
		}
	}

	function isNumberString(value) {
		try {
			return /^(\d+|\d+\.\d+|\.\d+)$/.test(value);
		} catch (error) {
			throw new Error("error caught @ isNumberString(" + value + "): " + error);
		}
	}

	function isIntegerString(value) {
		try {
			return /^(\d+)$/.test(value);
		} catch (error) {
			throw new Error("error caught @ isIntegerString(" + value + "): " + error);
		}
	}

	function parseDate(value) {
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

	function setStart(start) {
		try {
			let rowNumber = parseInt(start);
			if (!Number.isNaN(rowNumber)) {
				tableSettings = { ...tableSettings, start: Math.max((getFiltered(false).length === 0 ? 0 : 1), Math.min(rowNumber, tableSettings['end']), tableSettings['end'] - tableSettings['maxRows'] + 1) };
			}
			return this;
		} catch (err) {
			throw new Error("error caught @ setStart(" + start + ") - " + err);
		}
	}

	function setEnd(end) {
		try {
			let rowNumber = parseInt(end);
			if (!Number.isNaN(rowNumber)) {
				tableSettings = { ...tableSettings, end: Math.min(Math.max(rowNumber, tableSettings['start']), getFiltered(false).length, tableSettings['start'] + tableSettings['maxRows'] - 1) };
			}
			return this;
		} catch (err) {
			throw new Error("error caught @ setEnd(" + end + ") - " + err);
		}
	}

	function toBegining() {
		try {
			const length = tableSettings['end'] - tableSettings['start'] + 1;
			tableSettings['start'] = this.getFiltered(false).length === 0 ? 0 : 1;
			tableSettings['end'] = Math.min(this.getFiltered(false).length, tableSettings['start'] + length - 1);
			return this;
		} catch (err) {
			throw new Error("error caught @ priviousPage() - " + err);
		}
	}

	function priviousPage() {
		try {
			const length = tableSettings['end'] - tableSettings['start'] + 1;
			tableSettings['start'] = Math.max(this.getFiltered(false).length === 0 ? 0 : 1, tableSettings['start'] - length);
			tableSettings['end'] = Math.min(tableData.length, tableSettings['start'] + length - 1);
			return this;
		} catch (err) {
			throw new Error("error caught @ priviousPage() - " + err);
		}
	}

	function nextPage() {
		try {
			const length = tableSettings['end'] - tableSettings['start'] + 1;
			tableSettings['end'] = Math.min(getFiltered(false).length, tableSettings['end'] + length);
			tableSettings['start'] = Math.max(1, tableSettings['end'] - length + 1);
			return this;
		} catch (err) {
			throw new Error("error caught @ nextPage() - " + err);
		}
	}

	function toEnding() {
		try {
			const length = tableSettings['end'] - tableSettings['start'] + 1;
			tableSettings['end'] = getFiltered(false).length;
			tableSettings['start'] = Math.max(1, tableSettings['end'] - length + 1);
			return this;
		} catch (err) {
			throw new Error("error caught @ priviousPage() - " + err);
		}
	}

	function printSelectingGroup() {
		try {
			if (tableSettings['multiSelect'] == true && haveSelection) {
				const selectedRows = tableData.filter(row => row['row-selected']);
				const noOfSelected = selectedRows.length;
				const selectAllButton = '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.setAllFilteredSelected(true).refreshTable()">' + tableSettings.selectAllFiltered + '</button>';
				const unselectAllButton = '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.setAllFilteredSelected(false).refreshTable()">' + tableSettings.unselectAllFiltered + '</button>';
				return '<div style=\'display:flex;flex-flow:row wrap;justify-content:flex-start;align-items:center;column-gap:5px;\'>' + tableSettings.noOfSelected + noOfSelected + ' <div>' + selectAllButton + ' ' + unselectAllButton + '</div></div>';
			} else {
				return '';
			}
		} catch (err) {
			throw new Error("error caught @ printSelectingGroup() - " + err);
		}
	}

	function printResetFiltersButton() {
		try {
			return resetFiltersButton = '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.resetFilters().filterRows().refreshTable();">' + tableSettings.resetFilters + '</button>';
		} catch (err) {
			throw new Error("error caught @ printResetFiltersButton() - " + err);
		}
	}

	function printResetEditsButton() {
		try {
			return edited ? resetDataButton = '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.resetData().filterRows().refreshTable();">' + tableSettings.resetEdits + '</button>' : '';
		} catch (err) {
			throw new Error("error caught @ printResetEditsButton() - " + err);
		}
	}

	function printPaginationGroup() {
		try {
			setStart(tableSettings['start']);
			setEnd(tableSettings['end']);
			const startInput = '<input type="text" style=\'text-align:center; padding: 3px 8px; width: ' + (Math.max(1, Math.ceil(Math.log10(tableData.length))) * 8 + 20) + 'px;\' value="' + tableSettings['start'] + '" onchange="' + identifier + '.setStart(this.value).refreshTable()" />';
			const endInput = '<input type="text" style=\'text-align:center; padding: 3px 8px; width: ' + (Math.max(1, Math.ceil(Math.log10(tableData.length))) * 8 + 20) + 'px;\' value="' + tableSettings['end'] + '" onchange="' + identifier + '.setEnd(this.value).refreshTable()" />';
			const totalRows = getFiltered(false).length;
			const toBeginingButton = '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.toBegining().refreshTable();">' + tableSettings['toBegining'] + '</button>';
			const previousButton = '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.priviousPage().refreshTable();">' + tableSettings['previousPage'] + '</button>';
			const nextButton = '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.nextPage().refreshTable();">' + tableSettings['nextPage'] + '</button>';
			const toEndingButton = '<button class="' + tableSettings['buttonClass'] + '" onclick="' + identifier + '.toEnding().refreshTable();">' + tableSettings['toEnding'] + '</button>';
			return '<div style=\'width:100%;display:flex;flex-flow:row wrap;justify-content:center;align-items:center;column-gap:5px; ' + tableSettings['paginationGroupStyle'] + '\'><div>' + toBeginingButton + previousButton + '</div><div>' + startInput + '<span style=\'margin: 0px 5px;\'>-</span>' + endInput + '<span style=\'margin: 0px 5px;\'>/</span>' + totalRows + '</div><div>' + nextButton + toEndingButton + '</div></div>';
		} catch (err) {
			throw new Error("error caught @ printPaginationGroup() - " + err);
		}
	}

	function setFilter(index, value) {
		try {
			tableSettings['columns'][index]['filter'] = value;
			tableSettings['start'] = 1;
			setEnd(Math.max(length, tableSettings['defaultEnd']));
			return this;
		} catch (err) {
			throw new Error("error caught @ setFilter(" + index + ", " + value + ") - " + err);
		}
	}

	function resetFilters() {
		try {
			const length = tableSettings['end'] - tableSettings['start'] + 1;
			tableSettings['columns'].forEach(function (col) {
				col['filter'] = "";
			});
			tableSettings['start'] = 1;
			setEnd(Math.max(length, tableSettings['defaultEnd']));
			return this;
		} catch (err) {
			throw new Error("error caught @ resetFilters() - " + err);
		}
	}

	function match(text, matchingText, caseSensitive) {
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

	function editData(index, data, value) {
		try {
			edited = true;
			let row = tableData.find((row) => {
				return row['row-index'] === index;
			});
			if (row['ori-' + data] === undefined) {
				row['ori-' + data] = row[data];
			}
			row[data] = value;
			refreshTable();
			return this;
		} catch (err) {
			throw new Error("error caught @ editData(" + index + ", " + data + ", " + value + "): " + err);
		}
	}

	function stringToAscii(str) {
		let ascii = "";
		for (let i = 0; i < str.length; i++) {
			let charCode = str.charCodeAt(i);
			ascii += "&#" + charCode + ";";
		}
		return ascii;
	}

	function printTable() {
		try {
			var html = "";

			/*headers*/
			html += "<table style='width:100%;height:min-content;'><thead><tr>";
			tableSettings['columns'].forEach(function (col) {
				var headerStyle = (tableSettings['headersStyle'] || '') + (col['headerStyle'] || '');
				var headerHtml = '<div style="' + headerStyle + '" class="sort-header ' + (sortingBy === col['data'] ? 'sorting' : '') + '" onclick="' + identifier + '.sort(\'' + col['data'] + '\', ' + (sortingBy !== col['data'] || !ascending) + ').refreshTable()"><div style="flex:1;height:0px;"></div>' + col.header + (sortingBy === col['data'] ? (ascending ? '&#9650;' : '&#9660;') : '') + '<div style="flex:1;"></div></div>';
				html += '<td style="padding:0px;">' + headerHtml + '</td>';
			});
			html += '</tr>';

			/*filters*/
			html += '<tr>';
			tableSettings['columns'].forEach(function (col) {
				var filterStyle = (tableSettings['filtersStyle'] || '') + (col['filterStyle'] || '');
				var filterValue = col['filter'] || '';
				var filterPlaceholder = col['filterPlaceholder'] || '';
				html += '<td style="padding:0px;"><input style="' + filterStyle + '" class="filtering-input" type="text" style="width:100%;" value="' + stringToAscii(filterValue) + '" onchange="' + identifier + '.setFilter(' + tableSettings['columns'].indexOf(col) + ',this.value).filterRows().refreshTable();" placeholder="' + filterPlaceholder + '" /></td>';
			});
			html += '</tr></head><tbody>';

			/*rows*/
			var start = tableSettings['start'];
			var end = tableSettings['end'];
			var filteredData = getFiltered(false).slice(start - 1, end);
			filteredData.forEach(function (row, index) {
				var rowsStyle = function (col) {
					return (tableSettings.rowsStyle || '') + (col.rowsStyle || '');
				};
				var oddEvenRowsStyle = function (col) {
					return (index % 2 === 1 ? tableSettings.evenRowsStyle : tableSettings.oddRowsStyle);
				};
				html += '<tr>';
				tableSettings['columns'].forEach(function (col) {
					var cellData = row[col['data']] !== null ? row[col['data']] : '';
					if (col.modifier) {
						var modifier = eval(col.modifier);
						if (typeof modifier === 'function') {
							var clone = Object.assign({}, row);
							cellData = modifier(clone);
						}
					}
					html += '<td style="' + oddEvenRowsStyle(col) + rowsStyle(col) + '">' + cellData + '</td>';
				});
				html += '</tr>';
			});

			html += '</tbody></table>';

			html = "<div style='position:relative;width:100%;display:flex;flex-flow:column nowrap;justify-content:flex-start;align-items:center;row-gap:3px;'>"
				+ "<div style='width:100%;display:flex;flex-flow:row wrap;justify-content:flex-start;align-items:center;column-gap:3px;'>"
				+ "<div>" + tableSettings['label'] + "</div>"
				+ "<div style='flex:1;'></div>"
				+ "<div style='" + tableSettings['actionsGroupStyle'] + "'>"
				+ printSelectingGroup()
				+ printResetFiltersButton()
				+ printResetEditsButton()
				+ "</div>"
				+ "</div>"
				+ "<div style='width:100%;overflow:auto;" + (tableSettings['maxHeight'] ? " max-height:" + tableSettings['maxHeight'] + ";" : "") + " overflow:auto;'>" + html + "</div>"
				+ printPaginationGroup()
				+ '</div>\n';

			return html;
		} catch (err) {
			throw new Error("error caught @ printTable(): " + err);
		}
	}

	function fillTable(id) {
		try {
			if (document.getElementById(id) !== null) {
				document.getElementById(id).innerHTML = printTable();
			}
			container = id;
			return this;
		} catch (err) {
			throw new Error("error caught @ fillTable(" + id + "): " + err);
		}
	}

	function refreshTable() {
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
		setData,
		resetData,
		setTableSettings,
		printCheckBox,
		setSelected,
		setAllSelected,
		setAllFilteredSelected,
		getSelected,
		getFiltered,
		setEdited,
		getEdited,
		sortAsOriginal,
		sort,
		printSelectingGroup,
		setStart,
		setEnd,
		toBegining,
		priviousPage,
		nextPage,
		toEnding,
		printResetFiltersButton,
		setFilter,
		resetFilters,
		filterRows,
		printPaginationGroup,
		editData,
		printTable,
		fillTable,
		refreshTable
	};
}
