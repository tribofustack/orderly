export interface IHttpRequest {
  url?: string;
  body?: any;
  params?: any;
  headers?: any;
  query?: any;
}
export interface IHttpResponse {
  status: number;
  body: any;
}

export interface IHttp {
  post(request: IHttpRequest): Promise<IHttpResponse>;
  get(request: IHttpRequest): Promise<IHttpResponse>;
  put(request: IHttpRequest): Promise<IHttpResponse>;
  patch(request: IHttpRequest): Promise<IHttpResponse>;
  delete(request: IHttpRequest): Promise<IHttpResponse>;
}
