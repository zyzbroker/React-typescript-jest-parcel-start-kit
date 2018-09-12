import * as React from "react";
import {Button, InputGroup, InputGroupAddon, InputGroupText, Input} from "reactstrap";

export class Login extends React.Component {
    public render() {
        return (
            <div>
                <h1>Application Form</h1>
               <InputGroup>
                <InputGroupAddon addonType="prepend">@</InputGroupAddon>
                <Input placeholder="username"/>
               </InputGroup>
               <br/>
               <Button color="primary" size="md" block><i className="fas fa-sign-in-alt"></i>Sign In</Button>
            </div>
        );
    }
}
