import Input from "../Input/input.index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";

type Form = {
  children?: React.ReactNode;
  handleResponse: Function
};

export default ({ children, handleResponse }: Form) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const api = axios.create({ baseURL: "http://localhost:8081" });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) return handleResponse({ message: "Error", details: "Please fill in all fields" });

    const { data } = await api.post("/auth", { username, password });
    if (data.message === "Authorized") {
      localStorage.setItem("token", data.token);
      location.href = "/dashboard";
    } else handleResponse(data)
  };

  return (
    <form onSubmit={handleSubmit} className="mb-5">
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
