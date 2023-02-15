import React from "react";
import Button from "../Button/button.index";
import Card from "../Card/card.index";
import Form from "../Form/form.index";
import "./login.index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, IconDefinition } from "@fortawesome/free-solid-svg-icons";

export default () => {
  return (
    <div className="login-container">
      <div className="login-content">
        <Form>
          <Button label="Login" icon={<FontAwesomeIcon icon={faSignIn} />} />
        </Form>
        <section className="registration-trigger">
          <label>Don't have an account yet?</label>
          <a href="/register">Create your account here</a>
        </section>
      </div>
    </div>
  );
};
