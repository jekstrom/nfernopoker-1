import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";

import * as enzyme from "enzyme";
import * as Adapter from "enzyme-adapter-react-16";
import { RegisterTestComp } from "./Register";
import { CardContent } from "@material-ui/core";

enzyme.configure({ adapter: new Adapter() })

let component: ShallowWrapper<any, any, any>;

const fakeProps = {
  classes: {},
  secondaryButtonText: "Login instead",
  onSecondaryButton: jest.fn(),
  sendMessage: jest.fn(),
  firebase: {
    createUser: jest.fn().mockResolvedValue({})
  },
  history: ({ push: jest.fn() } as any),
  match: (jest.fn() as any),
  location: (jest.fn() as any),
  params: (jest.fn() as any)
};

describe("Register Component", () => {

  beforeEach(() => {
    component = shallow(<RegisterTestComp {...fakeProps} />);
  });

  it("should render without error", () => {
    expect(component.instance()).toMatchSnapshot();
  });

  it("should always render card content", () => {
    const divs = component.find(CardContent);
    expect(divs.length).toBeGreaterThan(0);
  });


  describe("when secondary button is clicked", () => {

    beforeEach(() => {
      component.find("#secondary-btn").simulate("click");
    });

    it("should call the callback fuction", () => {
      expect(fakeProps.onSecondaryButton).toHaveBeenCalled();
    });

  });

  describe("when valid form was filled", () => {

    beforeEach(() => {
      component.find("#first-name").simulate("change", { target: { name: "first-name", value: "Bob" } });
      component.find("#last-name").simulate("change", { target: { name: "first-name", value: "Smith" } });
      component.find("#email").simulate("change", { target: { name: "email", value: "blah@gmail.com" } });
      component.find("#password").simulate("change", { target: { name: "password", value: "pword123" } });
    });

    describe("and when form was submitted successfully", () => {

      beforeEach(() => {
        const fakeEvent = {
          preventDefault: () => jest.fn(),
          stopPropagation: () => jest.fn()
        };
        component.find("#register-form").simulate("submit", fakeEvent);
      });

      it("should create a new user in firebase", () => {
        expect(fakeProps.firebase.createUser).toHaveBeenCalledWith(
          { email: "blah@gmail.com", password: "pword123" },
          { firstName: "Bob", lastName: "Smith", email: "blah@gmail.com" }
        );
      });

      it("should change url to go to games", () => {
        expect(fakeProps.history.push).toHaveBeenCalledWith("/games");
      });

    });

    describe("and when form submit errors", () => {
      const messageObj = { message: "It all went wrong Bob" };
      beforeEach(() => {

        fakeProps.firebase.createUser = jest.fn().mockRejectedValue(messageObj);
        const fakeEvent = {
          preventDefault: () => jest.fn(),
          stopPropagation: () => jest.fn()
        };
        component.find("#register-form").simulate("submit", fakeEvent);
      });

      it("should send a message so the user is notified", () => {
        expect(fakeProps.sendMessage).toHaveBeenCalledWith(messageObj.message);
      });

    });

  });

  describe("when form was incompletly filled", () => {

    beforeEach(() => {
      component.find("#first-name").simulate("change", { target: { name: "first-name", value: "Bob" } });
    });

    it("should have a disabled submit button", () => {
      const btn = component.find("#submit");
      expect(btn.prop("disabled")).toBeTruthy();
    });

  });

});
