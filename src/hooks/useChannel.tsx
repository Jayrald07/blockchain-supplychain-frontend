import axios from "axios";
import { host, port } from "../utilities";
import { useEffect, useState } from "react";

export default () => {

  const [channels, setChannels] = useState<string[]>([]);
  const api = axios.create({ baseURL: `${host}:${port}` });

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/channels', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      console.log(data)
      if (data.message === 'Done' && data.details !== '') {
        setChannels(data.details.message);
      } else setChannels(['Cannot be fetched']);
    })();
  }, []);

  return channels;

}