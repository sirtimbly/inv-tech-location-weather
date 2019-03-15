import Axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import {Result, EncodedLocation} from './data'

export class AccuweatherClient {
	private _client: AxiosInstance;

	constructor(private key?: string) {
		const config: AxiosRequestConfig = {
			baseURL: process.env.API_URL || 'http://dataservice.accuweather.com',
			params: {
				apikey: this.key
			},
			headers: {
				'Content-Type': 'application/json'
			}
			// Timeout: 60 * 1000, // Timeout
		}

		this._client = Axios.create(config)
	}

	public getLocationCode = async (zipcode: string): Promise<string | undefined> => {
		const response = await this._client.get('/locations/v1/postalcodes/search', {
			params: {
				q: zipcode
			}
		})
		if (response.status === 200 && response.data.length > 0) {
			return response.data[0].Key
		}
	}

	public getConditions = async (location: EncodedLocation): Promise<Result> => {
		const response = await this._client.get('/currentconditions/v1/' + location.locationCode)
		if (response.status === 200 && response.data && response.data.length > 0) {
			return {
				...location,
				currentConditions: response.data[0].WeatherText || '--',
				tempF: response.data[0].Temperature.Imperial.Value || '--',
				rawTime: response.data[0].LocalObservationDateTime || ':'
			}
		}
	}
}
