import axios, { AxiosInstance, AxiosResponse } from "axios";

type PairConversion = {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  target_code: string;
  conversion_rate: number;
};

export class ExchangeRateService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `https://v6.exchangerate-api.com/v6/${
        process.env.EX_RATE_API_KEY || "8e45f993efc9f61be5e892d9"
      }`,
    });

    this.client.interceptors.response.use(this.onResponse, (e) =>
      this.onResponseError(e)
    );
  }

  private onResponse(response: AxiosResponse) {
    return response;
  }

  private onResponseError(error: any) {
    return Promise.reject(error?.response?.data || error);
  }

  public async getLiveRates(
    baseCurrencyCode: string,
    targetCurrencyCode: string
  ) {
    const { data } = await this.client.get<PairConversion>(
      `/pair/${baseCurrencyCode.toUpperCase()}/${targetCurrencyCode.toUpperCase()}`
    );

    return data;
  }
}
