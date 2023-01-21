import Input from "../Input/input.index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";

type Form = {
  children?: React.ReactNode;
};

export default ({ children }: Form) => {
  return (
    <form>
      <Input
        type="text"
        label="Username"
        icon={<FontAwesomeIcon icon={faUser} />}
        placeholder="juandelacruz07"
      />
      <Input
        type="password"
        label="Password"
        icon={<FontAwesomeIcon icon={faKey} />}
      />
      {children}
    </form>
  );
};
