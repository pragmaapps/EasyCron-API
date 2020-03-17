
# EasyCron Node.js API

EasyCron is an online cron service. This is a Node.js wrapper around EasyCron's REST API. The recommended way to use this API for our notification use cases is to call the add function of the API inside a firebase database trigger, for example, that is listening for the start of a routine by a user, supplying the necessary parameters like userID and routineID in the payload. At this point, the Job ID should be stored in the firebase, for that routine of the user, within an attribute. Now when the notify function is called by the job, the Job ID should be obtained using the IDs in the payload and also delete the job.


## **Getting started**

1.  Install the `easy-cron` module using `npm`

    ```
    npm install --save https://github.com/ipragmatech/EasyCron-API.git
    ```
1.  Import `easy-cron` and replace `<token>` with your API token. You can obtain the token after login to the easycron website. Please contact [michael.renner@3rbehavioralsolutions.com](mailto:michael.renner@3rbehavioralsolutions.com) for the login details.

    ```
    const easycron = require("easy-cron")({ token: <token> })
    ```

## **Commands**
1.  <strong><code>easycron.add</code></strong>

	   It creates a new cron job and returns a Promise. You can use the promise as <code>.then(function(response){  })</code> and get the Cron Job Id using <code>response.cron_job_id</code>. This id is needed when you want to Enable/Disable/Delete the cron job so it must be saved in the database when you need only a once only job. EasyCron does not provide a once only job so the jobs have to be deleted explicitly.


	Example:


	```
	 easycron.add({
		name: "My Cron Job",
		groupId: 10375,
	 	minute: 8,
	 	hour: 9,
	 	day: 5,
	 	month: 12,
	 	url: "<URL>",
	 	method: 'POST',
	 	timezone: "America/Santiago",
	 	headers:{
	 		"Header-Name-1": "value 1",
	 		"Header-Name-2": "value 2"
	 	},
	 	payload: {
	 		key1: "value 1",
	 		key2: "value 2"
	 	}
	 }).then(function(response) {
	 	console.log("Cron Job Id is " + response.cron_job_id);
	 }).catch(function(error) {
	 	console.log(error)
	 });
	```


	Explanation:



	*   `name (optional)`: It refers to the name of the cron job.
	*   `groupId (optional)`: It refers to the id of the group where cron job should be kept.
	*   `minute, hour, day, month`: These are used to specify a specific time when the cron job will run.
		*   In this example, the cron job will run at every 5th minute from 9:08 to 9:59 on 5th December every year.
		*    You must specify at least one of these options. If any option is omitted, that option is read as "every <option>". For eg., if minute is not specified, then it is assumed to be "every minute" and the job will run at every minute from 9:08 to 9:59 on 5th December every year.
	*   `minuteInterval (optional)`: It is used to specify that the cron job will repeat itself in intervals of specified minutes.
	*   `url`: It refers to the URL which will be called by the cron job.
	*   `method (optional, defaults to GET)`: It specifies the http method to be used for the request.
	*   `timezone`: It specifies the timezone to be used for the request. Must be a valid name from [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) 
	*   `headers (optional)`: It specifies the headers to be used for the request.
	*   `payload (optional)`: It specifies the json object to be sent in the body of request. When this cron job will run, easy cron will send a POST request to the specified URL with payload in body of the request. You can get the payload as follows:

	    ```
	    let payload = JSON.parse(request.body.payload);
	    ```
2.  <strong><code>easycron.addCronExp</code></strong>

	   It creates a new cron job using cron expressions and returns a Promise. You can use the promise as <code>.then(function(response){  })</code> and get the Cron Job Id using <code>response.cron_job_id</code>. This id is needed when you want to Enable/Disable/Delete the cron job so it must be saved in the database when you need only a once only job. EasyCron does not provide a once only job so the jobs have to be deleted explicitly.


	Example:


	```
    easycron.addCronExp({
		name: "My Cron Job",
		groupId: 10375,
    	cron: "4-10/2 1 5 8 *",
    	url: "<url>",
    	method: 'POST',
    	timezone: "America/Santiago",
    	headers:{
    		"Header-Name-1": "value 1",
    		"Header-Name-2": "value 2"
    	},
    	payload: {
    		key1: "value 1",
    		key2: "value 2"
    	}
    }).then(function(response) {
    	console.log("Cron Job Id is " + response.cron_job_id);
    }).catch(function(error) {
    	console.log(error)
    });
	```
	Explanation: 
	*   `cron`: It specifies a cron expression for the cron job. Please refer to [this link](https://www.easycron.com/faq/What-cron-expression-does-easycron-support) to see what expressions are compatible with EasyCron.
	*   Other keys are the same as `cron.add`
3.  <strong><code>easycron.edit</code></strong>

	   It updated an existing cron job and returns a Promise. 


	Example:


	```
    easycron.edit({
    	id: "123456",
		name: "My Cron Job",
		groupId: 10375,
    	cron: "4-10/2 1 5 8 *",
    	url: "<url>",
    	method: 'POST',
    	timezone: "America/Santiago",
    	headers:{
    		"Header-Name-1": "value 1",
    		"Header-Name-2": "value 2"
    	},
    	payload: {
    		key1: "value 1",
    		key2: "value 2"
    	}
    }).then(function(response) {
    	console.log("Cron Job Id is " + response.cron_job_id);
    }).catch(function(error) {
    	console.log(error)
    });
	```
	Explanation: 
	* `id`: This specifies the existing cron job id which needs to be updated.
	* `cron`: It specifies a cron expression for the cron job. Please refer to [this link](https://www.easycron.com/faq/What-cron-expression-does-easycron-support) to see what expressions are compatible with EasyCron. If cron is provided, it is given preference over (minute, hour, day, month, week).
	*   Other keys are the same as `cron.add`

4.  <strong><code>easycron.enable</code></strong>

	   It is used to enable a cron job.


	Example:


	```
    easycron.enable({
    	id: <id>
    }).then(function(response) {
    	console.log(response)
    }).catch(function(error) {
    	console.log(error)
    });
	```
	Explanation: 
	*   `id`: It specifies the id of the cron job.
5.  <strong><code>easycron.disable</code></strong>

    It is used to disable a cron job.

    Example:
    ```
    easycron.disable({
    	id: <id>
    }).then(function(response) {
    	console.log(response)
    }).catch(function(error) {
    	console.log(error)
    });
    ```
    Explanation: 
	*   `id`: It specifies the id of the cron job.
6.  <strong><code>easycron.delete</code></strong>

	It is used to delete a cron job.

	Example:
	```
    easycron.delete({
    	id: <id>
    }).then(function(response) {
    	console.log(response)
    }).catch(function(error) {
    	console.log(error)
    });
	```
	Explanation:
	*   `id`: It specifies the id of the cron job.
7.  <strong><code>easycron.isValidTimezone</code></strong>

	It is used for validating timezone values. It is a synchronous function and returns a `true/false` result;

	Example:
	```
    easycron.isValidTimezone({
    	name: "America/Santiago"
    })
	```
	Explanation:
	*   `name`: It specifies the name of the timezone.