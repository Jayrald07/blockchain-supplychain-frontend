import axios from "axios";
import { host, port } from "../utilities";
import { authHeader } from "./http";

export class TagService {

  static api = axios.create({ baseURL: `${host}:${port}` })

  static async getTags() {
    try {
      const { data } = await this.api.get("/tag", authHeader)
      return data;
    } catch (err: any) {
      return { message: "Error", details: err.message }
    }

  }
}
