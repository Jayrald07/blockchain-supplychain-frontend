import Input from "../Input/input.index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";

type Form = {
  children?: React.ReactNode;
};

export default ({ children }: Form) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const api = axios.create({ baseURL: "http://localhost:8081" });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { data } = await api.post("/auth", { username, password });

    if (data.message === "Authorized") {
      localStorage.setItem("token", data.token);
      location.href = "/dashboard";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={username}
        type="text"
        label="Username"
        icon={<FontAwesomeIcon icon={faUser} />}
        placeholder="juandelacruz07"
        handler={(e: any) => {
          setUsername(e.target.value);
        }}
      />
      <Input
        value={password}
        type="password"
        label="Password"
        icon={<FontAwesomeIcon icon={faKey} />}
        handler={(e: any) => {
          setPassword(e.target.value);
        }}
      />
      {children}
    </form>
  );
};
