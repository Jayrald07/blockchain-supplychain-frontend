import axios from "axios";
import { useEffect, useState } from "react"
import { host, port } from "../../utilities";

export default ({ handleValue }: { handleValue: (channel: string) => void }) => {
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
        handleValue(data.details.message.length ? data.details.message[0] : '');
      } else setChannels(['Cannot be fetched']);

    })();
  }, []);

  return <>
    <div className="mb-4">

      <select onChange={e => handleValue(e.target.value)} className="py-2 px-3 text-sm w-full font-light bg-white border-slate-200 border outline-none">
        {
          channels.map(item => <option key={item} value={item}>{item}</option>)
        }
      </select></div>
  </>

}