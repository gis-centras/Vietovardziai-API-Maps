function createSearchControls() {
	var sidebarDiv = document.getElementById("sidebar"),
		searchControlsDiv = document.createElement("div"),
		searchInput = document.createElement("input"),
		searchButton = document.createElement("button"),
		searchClearButton = document.createElement("button"),
		resultsList = document.createElement("ul");
	searchInput.setAttribute("id", "search-input");
	searchInput.addEventListener("keyup", function(event){
		if (event.keyCode === 13) {
			event.preventDefault();
			search();
		}
	});
	searchButton.innerText = "Ieškoti";
	searchButton.addEventListener("click", search);
	searchButton.setAttribute("id", "search-button");
	searchClearButton.innerText = "Valyti";
	searchClearButton.addEventListener("click", clear);
	searchClearButton.setAttribute("id", "clear-button");
	searchControlsDiv.appendChild(searchInput);
	searchControlsDiv.appendChild(searchButton);
	searchControlsDiv.appendChild(searchClearButton);
	searchControlsDiv.setAttribute("id", "search-controls");
	resultsList.setAttribute("id", "results-list");
	sidebarDiv.appendChild(searchControlsDiv);
	sidebarDiv.appendChild(resultsList);
}

function search() {
	var searchInput = document.getElementById("search-input"),
		searchValue = searchInput.value;
	doSearch(searchValue, false);
}

function clear() {
	var searchInput = document.getElementById("search-input");
	searchInput.value = "";
	clearResultsList();
	if (typeof clearMap === "function") { // FIXME...
		clearMap();
	}
}

function clearResultsList() {
	var resultsList = document.getElementById("results-list");
	while (resultsList.firstChild) {
		resultsList.firstChild.remove();
	}
}

function displayResults(hits, isFuzzy) {
	clearResultsList();
	var resultsList = document.getElementById("results-list"),
		li,
		item;
	for (var i = 0; i < hits.length; i++) {
		item = hits[i];
		if (item._source) {
			var html = '<div>';
			html += '<div><strong>' + item._source["name"] + '</strong></div>';
			html += '<div>';
			html += item._source["localtype"];
			if (item._source["subtype"]) {
				html += ', ' + item._source["subtype"];
			}
			if (item._source["municipality"]) {
				html += ' — ' + item._source["municipality"];
			}
			html += '</div>';
			html += '</div>';
			li = document.createElement("li");
			li.innerHTML = html;
			if (typeof showItemOnMap === "function") { // FIXME...
				li.addEventListener("click", showItemOnMap.bind(this, item));
			}
			resultsList.appendChild(li);
		}
	}
}

document.addEventListener("DOMContentLoaded", function(){
	createSearchControls();
}, false);