import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  IHttp,
  IHttpRequest,
  IHttpResponse,
} from 'src/internal/application/ports/http/http';

@Injectable()
export class AxiosHttp implements IHttp {
  async post(request: IHttpRequest): Promise<IHttpResponse> {
    const response = await axios({
      method: 'post',
      headers: request.headers,
      params: request.params,
      data: request.body,
      url: request.url,
    });

    if (response.status !== 200) {
      console.error('\n ErrorResponse: ', response.data);
      throw new Error(`Http error with status ${response.status}`);
    }
    return {
      body: response.data,
      status: response.status,
    };
  }

  async get(request: IHttpRequest): Promise<IHttpResponse> {
    const response = await axios({
      method: 'get',
      url: request.url,
      headers: request.headers,
      params: request.params,
    });
    if (response.status !== 200) {
      throw new Error(`Http error with status ${response.status}`);
    }
    return {
      body: response.data,
      status: response.status,
    };
  }

  async put(request: IHttpRequest): Promise<IHttpResponse> {
    const response = await axios({
      method: 'put',
      headers: request.headers,
      params: request.params,
      data: request.body,
      url: request.url,
    });
    if (response.status !== 200) {
      throw new Error(`Http error with status ${response.status}`);
    }
    return {
      body: response.data,
      status: response.status,
    };
  }

  async patch(request: IHttpRequest): Promise<IHttpResponse> {
    const response = await axios({
      method: 'patch',
      headers: request.headers,
      params: request.params,
      data: request.body,
      url: request.url,
    });
    if (response.status !== 200) {
      throw new Error(`Http error with status ${response.status}`);
    }
    return {
      body: response.data,
      status: response.status,
    };
  }

  async delete(request: IHttpRequest): Promise<IHttpResponse> {
    const response = await axios({
      method: 'delete',
      headers: request.headers,
      params: request.params,
      data: request.body,
      url: request.url,
    });
    if (response.status !== 200) {
      throw new Error(`Http error with status ${response.status}`);
    }
    return {
      body: response.data,
      status: response.status,
    };
  }
}
