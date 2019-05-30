const got = require("got");
const error = (message) => {
	return {message};
}
function add(task, expression, API_URL) {
	return new Promise((resolve, reject) => {
		let {
			minute = '*',
				hour = '*',
				day = '*',
				month = '*',
				minuteInterval = null,
				cron: cron_expression = null,
				url = null,
				method: http_method = null,
				headers: http_headers = null,
				payload: posts = null
		} = task;

		let queryString;
		if (expression) {
			if (!(typeof cron_expression === "string" && cron_expression.length > 0)) {
				reject(new Error("cron expression not received in input"));
			}
			queryString = "&cron_expression=" + encodeURIComponent(cron_expression);
		} else {
			if (minute === "*" && hour === "*" && day === "*" && month === "*") {
				reject(new Error("Provide at least minute, hour, day or month in input"));
			}
			const params = {
				minute,
				hour,
				day,
				month
			};

			Object.keys(params).forEach(key => {
				const value = params[key];
				const int = parseInt(value);
				if ( Number.isNaN(int) && value !== "*") {
					reject(new Error(key + " is invalid"));
				}
				params[key] = value === "*" ? "*" : int;
			});

			if (minuteInterval !== null) {
				const int = parseInt(minuteInterval);
				if (!Number.isNaN(int) && minuteInterval > 0) {
					params.minute += "/" + int;
				} else {
					reject(new Error("Invalid minuteInterval received in input"));
				}
			}
			queryString = "&cron_expression=" + encodeURIComponent(params.minute + ' ' + params.hour + ' ' + params.day + ' ' + params.month + " *");
		}
		if(url === null){	
			reject(new Error("url not received in input"));
		} else if (!(typeof url === "string" && url.length > 0)) {
			reject(new Error("Invalid url received in input"));
		}
		queryString += "&url=" + encodeURIComponent(url);

		if(http_method !== null){
			if (!(typeof http_method === "string" && http_method.length > 0)) {
				reject(new Error("Invalid http method received in input"));
			}
			queryString += "&http_method=" + encodeURIComponent(http_method);
		}

		if (http_headers !== null) {
			if( !(http_headers === Object(http_headers) && !Array.isArray(http_headers)) ){
				reject(new Error("Expected headers to be an object"));
			}
			let headers = "";
			Object.keys(http_headers).forEach(key => headers += key + ":" + http_headers[key] + '\n');
			queryString += "&http_headers=" + encodeURIComponent(headers);
		}

		if (posts !== null) {
				if (typeof posts === "object") {
					queryString += "&posts=" + encodeURIComponent("payload=" + JSON.stringify(posts));
				} else {
					reject(new Error("Expected payload to be an object"));
				}
		}
		got.get(API_URL + queryString)
			.then(res => {
				const response = JSON.parse(res.body);
				if(response.error){
					return reject(new Error(response.error.message));
				}
				resolve(response);
			})
			.catch(error => {
				if (error.name) {
					error.message = error.name;
				}
				reject(error);
			});
	});
}

function changeState (task = {}, API_URL) {
	return new Promise((resolve, reject) => {
		let { id = null } = task;
		if(id === null){
			reject(new Error("Cron id not received in input"));
		} else if (!((typeof id === "string" && id.length > 0) || typeof id === "number")) {
			reject(new Error("Invalid cron id received in input"));
		}
		got.get(API_URL + "&id=" + id)
			.then(res => {
				const response = JSON.parse(res.body);
				if (response.error) {
					return reject(new Error(response.error.message));
				}
				resolve(response);
			})
			.catch(error => {
				if (error.name) {
					error.message = error.name;
				}
				reject(error);
			});
	});
}

function easyCron(config = {}) {
	if (!(config && typeof config.token === "string" && config.token.length !== 0)) {
		throw new Error("Token not found");
	}
	const API_URL = "https://www.easycron.com/rest/";
	const token = config.token;

	return {
		add: (task) => add(task, false, API_URL + "add?token=" + token),
		addCronExp: (task) => add(task, true, API_URL + "add?token=" + token),
		enable: (task) => changeState (task, API_URL + "enable?token=" + token),
		disable: (task) => changeState (task, API_URL + "disable?token=" + token),
		delete: (task) => changeState (task, API_URL + "delete?token=" + token)
	}

};

module.exports = easyCron;