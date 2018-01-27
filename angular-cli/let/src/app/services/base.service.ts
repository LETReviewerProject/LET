import { AppSettings } from './../helpers/app.settings';
import { Observable } from 'rxjs/Rx';
import { Http, RequestOptions, Headers, Request, RequestMethod } from '@angular/http';

/**
 * Base class implementation of api service 
 */
export class BaseApiService {
	private baseUrl = AppSettings.apiUrl;

	constructor(private http: Http) {
	}

	/**
	 * GET method operation (select)
	 * @param endpoint api url endpoint
	 */
	protected get(endpoint: string) {
		return this.request(endpoint, RequestMethod.Get);
	}

	/**
	 * POST method operation (insert)
	 * @param endpoint api url endpoint
	 * @param body request body
	 */
	protected post(endpoint: string, body: Object) {
		return this.request(endpoint, RequestMethod.Post, body);
	}

	/**
	 * PUT method operation (update)
	 * @param endpoint api url endpoint
	 * @param body request body
	 */
	protected put(endpoint: string, body: Object) {
		return this.request(endpoint, RequestMethod.Put, body);
	}

	/**
	 * 
	 * @param endpoint api url endpoint
	 */
	protected delete(endpoint: string) {
		return this.request(endpoint, RequestMethod.Delete);
	}

	/**
	 * PUT method operation (update)
	 * @param endpoint api url endpoint
	 * @param body request body
	 */
	protected upload(endpoint: string, fileList: File) {
		let file: File = fileList[0];

		let formData:FormData = new FormData();
		formData.append('photo', file, file.name);
		let headers = new Headers();
		/** No need to include Content-Type in Angular 4 */
		headers.append('Content-Type', 'multipart/form-data');
		headers.append('Accept', 'application/json');

		let options = new RequestOptions({ headers: headers });

		return this.http.post(endpoint, formData, options);

	}

	/**
	 * 
	 * @param endpoint endpoint
	 * @param method  request method
	 * @param body request body
	 */
	private request(endpoint: string, method: RequestMethod, body?: Object) {
		const requestOptions: RequestOptions = new RequestOptions({
			url: `${this.baseUrl}${endpoint}`,
			method: method,
			headers: new Headers({
				'Content-Type': 'application/json'
			})
		})

		if (body) {
			requestOptions.body = body;
		}

		const request = new Request(requestOptions);

		return this.http.request(request);
	}

	//handle server error
	protected handleServerError(error: any) {
		return Observable.throw('An error occured while processing request.');
	}

}
