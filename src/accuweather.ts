import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class AccuweatherClient {
  private _client: AxiosInstance;
  constructor(private key?:string) {
    const config: AxiosRequestConfig = {
      baseURL: process.env.API_URL || "http://dataservice.accuweather.com/",
      params: {
        apiKey: this.key
      },
      headers: {
        "Content-Type": "application/json"
      }
      // timeout: 60 * 1000, // Timeout
    };

    this._client = Axios.create(config);
  }

  public getLocationCode = async (zipcode: string): Promise<string | undefined> => {
    const response = await this._client.get("/locations/v1/postalcodes/search", {
      params: {
        q: zipcode
      }
    });
    if (response.data.length) {
      return response.data[0].key;
    }
  }
}
