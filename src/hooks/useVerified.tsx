import { useEffect, useState } from "react";
import { HttpMethod, api } from "../services/http";
import { stringify } from "uuid";

export default (): [string, boolean, (realoadVar: boolean) => void] => {

  const [isVerified, setIsVerified] = useState('LOADING');
  const [isReload, setIsReload] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await api("/account", HttpMethod.GET);

      if (response.details.organization_email_is_verified) setIsVerified('VERIFIED');
      else setIsVerified('NOT VERIFIED');

    })();
  }, [isVerified, isReload]);

  return [isVerified as string, isReload as boolean, setIsReload as () => void];

}