/// <reference path="../../../declaration/jquery.d.ts"></reference>

import * as React from "react";
import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";

export class Login extends React.Component {
  public componentDidMount() {
    $("#title").html("test jquery");
  }

  public render() {
    return (
      <div>
        <h1 id="title">Application Form</h1>
        <InputGroup>
          <InputGroupAddon addonType="prepend">@</InputGroupAddon>
          <Input placeholder="username" />
        </InputGroup>
        <br />
        <Button color="primary" size="md" block>
          <i className="fas fa-sign-in-alt" />
          Sign In
        </Button>
      </div>
    );
  }
}
