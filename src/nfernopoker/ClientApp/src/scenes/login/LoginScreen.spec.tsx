import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";

import * as enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import { LoginScreenTestComp } from "./LoginScreen";
import { Login } from "./Login";
import { Register } from "./Register";
import { Grid } from "@material-ui/core";

enzyme.configure({ adapter: new Adapter() })

let component: ShallowWrapper<any, any, any>;

const fakeProps = {
  classes: {}
};

describe("Login Screen", () => {

  beforeEach(() => {
    component = shallow(<LoginScreenTestComp {...fakeProps} />);
  });

  it("should render without error", () => {
    expect(component.instance()).toMatchSnapshot();
  });

  it("should always render grid content", () => {
    const divs = component.find(Grid);
    expect(divs.length).toBeGreaterThan(0);
  });

  describe("and isLogin", () => {

    beforeEach(() => {
      component.setState({ isLogin: true });
    });

    it("should display the login componet", () => {
      expect(component.find(Login).exists()).toBeTruthy();
      expect(component.find(Register).exists()).toBeFalsy();
    });

  });

  describe("and isLogin is false", () => {

    beforeEach(() => {
      component.setState({ isLogin: false });
    });

    it("should display the register componet", () => {
      expect(component.find(Login).exists()).toBeFalsy();
      expect(component.find(Register).exists()).toBeTruthy();
    });

  });

});
