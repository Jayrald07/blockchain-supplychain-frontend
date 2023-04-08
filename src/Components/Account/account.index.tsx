import axios from "axios";
import { useEffect, useState } from "react";
import ButtonIndex from "../Button/button.index";
import HeaderbarIndex from "../HeaderBar/headerbar.index";
import InputIndex from "../Input/input.index";
import NavbarIndex from "../Navbar/navbar.index";
import "./account.index.css";
import AuthIndex from "../Auth/auth.index";

const Account = () => {
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [organizationName, setOrganizationName] = useState("");

  const api = axios.create({ baseURL: "http://localhost:8081" });

  const handleUpdate = async () => {
    const { data } = await api.put(
      "/account",
      {
        organization_address: address,
        organization_phone: phone,
      },
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(data);
  };

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/account", {
        headers: {
          Authorization: `Basic ${localStorage.getItem("token")}`,
        },
      });

      if (data) {
        setUsername(data.username);
        setAddress(data.organization_address);
        setPhone(data.organization_phone);
        setType(data.organization_type_id.organization_type_name);
        setOrganizationName(data.organization_name);
      }
    })();
  }, []);

  return (
    <div className="grid grid-cols-5 h-full">
      <NavbarIndex />
      <section className="col-span-4">
        <HeaderbarIndex />
        <div className="px-32 py-20">
          <h1>
            Account / {organizationName} <small className="badge">{type}</small>
          </h1>
          <section className="account-bar">
            <h4>Contact Information</h4>
          </section>
          <section className="account-profile">
            <div>
              <InputIndex
                label="Address"
                type="text"
                value={address}
                handler={(e: any) => setAddress(e.target.value)}
              />
              <InputIndex
                label="Contact Number"
                type="text"
                value={phone}
                handler={(e: any) => setPhone(e.target.value)}
              />
              <InputIndex
                label="Username"
                type="text"
                value={username}
                handler={(e: any) => setUsername(e.target.value)}
              />
              <ButtonIndex label="Save" handleClick={handleUpdate} />
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default () => <AuthIndex Component={Account} />