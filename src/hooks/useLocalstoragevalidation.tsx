import { useEffect, useLayoutEffect, useState } from "react";

export default (): string => {
    const [exists, setExists] = useState<string>("validating");

    useEffect(() => {
        if (localStorage.getItem("token")?.trim()) setExists("valid")
        else setExists("invalid");
    }, []);


    return exists;
}