function doSearch(searchValue, advanced) {
	var url = "https://www.geoportal.lt/mapproxy/elasticsearch_gvdr";
	if (advanced) {
		var params = getQueryParams(searchValue, false);
		fetch(url, {
			method: "POST",
			body: JSON.stringify(params),
			headers: {
				"Accept": "application/json"
			}
		}).then(function(response){
			if (response.status == 200) {
				return response.json();
			}
		}).then(function(json){
			if (json && json.hits) {
				var percentage = 0.60;
				modifyResponse(json, percentage);
				if (json.hits.total.value > 0) {
					if (typeof displayResults === "function") { // FIXME...
						displayResults(json.hits.hits, true);
					}
				} else {
					var params = getQueryParams(searchValue, true);
					fetch(url, {
						method: "POST",
						body: JSON.stringify(params),
						headers: {
							"Accept": "application/json"
						}
					}).then(function(response){
						if (response.status == 200) {
							return response.json();
						}
					}).then(function(json){
						if (json && json.hits) {
							modifyResponse(json, percentage);
							if (typeof displayResults === "function") { // FIXME...
								displayResults(json.hits.hits, true);
							}
						}
					});
				}
			}
		});
	} else {
		// https://medium.com/@abderrahman.hamila/cors-is-not-your-nightmare-but-6cbc749400cf
		url += "?q=" + encodeURIComponent(searchValue)
		fetch(url, {
			method: "GET",
			headers: {
				"Accept": "application/json"
			}
		}).then(function(response){
			if (response.status == 200) {
				return response.json();
			}
		}).then(function(json){
			if (json && json.hits) {
				modifyResponse(json);
				if (typeof displayResults === "function") { // FIXME...
					displayResults(json.hits.hits, true);
				}
			}
		});
	}
}

function modifyResponse(response, percentage){
	if (response.hits.hits) {
		var items = [],
			currentItem,
			maxScore,
			geom;
		for (var i = 0; i < response.hits.hits.length; i++) {
			currentItem = response.hits.hits[i];
			if (percentage) {
				if (maxScore && currentItem._score < maxScore * percentage) {
					continue;
				}
				maxScore = currentItem._score;
			}
			geom = currentItem._source.esri_json.replace(/&quot/g, ""); // FIXME! Kažkodėl iš abiejų pusių toks yra @_@
			geom = geom.replace(/\);\s?/g, "),");
			geom = geom.replace(/;/g, "],[");
			geom = geom.replace(/\(\(/g, "[[[");
			geom = geom.replace(/\)\)/g, "]]]");
			geom = geom.replace(/\(/g, "[[");
			geom = geom.replace(/\)/g, "]]");
			geom = geom.replace(/\s/g, ",");
			geom = eval(geom);
			currentItem.geom = geom;
			items.push(currentItem);
		}
		response.hits.hits = items;
	}
}

function getQueryParams(query, isFuzzy, geoShapeFilter){
	isFuzzy = isFuzzy || false;
	var start = 0,
		limit = 40,
		path;
	var queryParams = {
		"query": {},
		"sort": ["_score", "name", "municipality"],
		"_source": {
			"exclude": ["geometry"]
		},
		"from": start,
		"size": limit
	};
	var multiMatch = {
		"query": query,
		"type": "phrase",
		"fields": ["name^5", "name.folded^5", "municipality", "municipality.folded"],
		"slop": 5
	};
	if (geoShapeFilter) {
		queryParams.query = {
			"bool": {
				"must": {
					"multi_match": multiMatch
				},
				"filter": []
			}
		};
		if (geoShapeFilter) {
			queryParams.query.bool.filter.push({
				"geo_shape": {
					"geometry": {
						"shape": geoShapeFilter
					}
				}
			});
		}
		path = queryParams.query.bool.must.multi_match;
	} else {
		queryParams.query = {
			"multi_match": multiMatch
		};
		path = queryParams.query.multi_match;
	}
	if (isFuzzy) {
		path.type = "most_fields";
		path.fields = ["name^5", "name.folded^5", "name.shingle^5", "name.trigram^3", "name.edge^5", "municipality", "municipality.folded", "municipality.shingle", "municipality.trigram", "municipality.edge"];
	}
	if (!query) {
		if (queryParams.query.bool) {
			delete queryParams.query.bool.must;
		}
	}
	return queryParams;
}