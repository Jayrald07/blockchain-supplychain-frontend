import { useState } from "react";
import ButtonIndex from "../Button/button.index";
import Input from "../Input/input.index";
import "./register.index.css";
import axios from "axios";
import { redirect } from "react-router-dom";

const api = axios.create({ baseURL: "http://localhost:8081" });

export default () => {
  const [organizationName, setOrganizationName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [organizationUsername, setOrganizationUsername] = useState("");
  const [organizationPassword, setOrganizationPassword] = useState("");
  const [organizationPhone, setOrganizationPhone] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log(organizationPassword);

    const { data } = await api.post("/organization", {
      organization_name: organizationName,
      organization_type_id: organizationType,
      organization_address: organizationAddress,
      organization_phone: organizationPhone,
      organization_username: organizationUsername,
      organization_password: organizationPassword,
    });
    console.log(data);
    if (data.message === "Organization created!") location.href = "/login";
  };

  return (
    <form onSubmit={handleSubmit} className="reg-asset">
      <h2>Register</h2>
      <section className="reg-input">
        <Input
          value={organizationName}
          type="text"
          label="Organization name"
          placeholder="Organization name"
          handler={(e: any) => {
            setOrganizationName(e.target.value);
          }}
        />
        <div className="selection">
          <label>Type of Organization</label>
          <select
            onChange={(e: any) => {
              setOrganizationType(e.target.value);
            }}
            value={organizationType}
          >
            <option value="63cea2bd100c0250f87ae1a7">Supplier</option>
            <option value="63cea2cc100c0250f87ae1a8">Manufacturer</option>
            <option value="63cea2da100c0250f87ae1a9">
              Distributor/Logistic
            </option>
            <option value="63cea2ea100c0250f87ae1aa">Retailer</option>
          </select>
        </div>
        {/* <Input
          type="text"
          label="Type of organization"
          placeholder="Type of organization"
        /> */}
      </section>
      <div className="reg-input">
        <Input
          value={organizationAddress}
          type="text"
          label="Address"
          placeholder="Address"
          handler={(e: any) => {
            setOrganizationAddress(e.target.value);
          }}
        />
      </div>
      <section className="reg-input">
        <Input
          type="text"
          value={organizationUsername}
          label="Username"
          placeholder="Username"
          handler={(e: any) => {
            setOrganizationUsername(e.target.value);
          }}
        />
        <Input
          type="text"
          value={organizationPassword}
          label="Password"
          placeholder="Password"
          handler={(e: any) => {
            setOrganizationPassword(e.target.value);
          }}
        />
        <Input
          type="text"
          value={organizationPhone}
          label="Contact number"
          placeholder="+63xxxxxxxxxx"
          handler={(e: any) => {
            setOrganizationPhone(e.target.value);
          }}
        />
      </section>
      {/* <h2>Node Creation</h2>
      <section className="reg-input">
        <Input type="text" label="Type of node" placeholder="Type of node" />
      </section>
      <section className="reg-input">
        <Input type="text" label="Private key" placeholder="Private key" />
        <Input
          type="text"
          label="Connection certificate"
          placeholder="Connection certificate"
        />
        <Input type="text" label="Unique ID" placeholder="Unique ID" />
      </section> */}
      <ButtonIndex label="Register" />
    </form>
  );
};
