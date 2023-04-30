import axios from "axios";
import { HttpResposne, host, port } from "../utilities";

export enum HttpMethod {
  POST = "post",
  GET = "get"
}

export const api = async (path: string, type: HttpMethod, body: any = {}): Promise<HttpResposne> => {

  const api = axios.create({ baseURL: `${host}:${port}` });

  try {

    if (type === HttpMethod.GET) {
      const { data } = await api.get(path, { timeout: 5000, headers: authHeader.headers });
      return { message: "Done", details: data };
    } else if (type === HttpMethod.POST) {
      const { data } = await api.post(path, body, { timeout: 5000, headers: authHeader.headers });
      return { message: "Done", details: data };
    } else { return { message: "Error", details: 'No Http method supplied' } }

  } catch (error: any) {
    return { message: "Error", details: error.message }
  }

}

export const authHeader = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
}

