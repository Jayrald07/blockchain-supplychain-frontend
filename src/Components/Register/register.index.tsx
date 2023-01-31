import Input from "../Input/input.index";
import "./register.index.css";

export default () => {
  return (
    <form className="reg-asset">
      <h2>Register</h2>
      <section className="reg-input">
        <Input
          type="text"
          label="Organization name"
          placeholder="Organization name"
        />
        <Input
          type="text"
          label="Type of organization"
          placeholder="Type of organization"
        />
      </section>
      <div className="reg-input">
        <Input type="text" label="Address" placeholder="Address" />
      </div>
      <section className="reg-input">
        <Input type="text" label="Username" placeholder="Username" />
        <Input type="text" label="Password" placeholder="Password" />
        <Input type="text" label="Contact number" placeholder="+63xxxxxxxxxx" />
      </section>
      <h2>Node Creation</h2>
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
      </section>
    </form>
  );
};
