import * as React from 'react';
import { shallow, ShallowWrapper } from "enzyme";

import * as enzyme from "enzyme";
import * as Adapter from 'enzyme-adapter-react-16';
import { SnackWrapperTestComp } from './SnackWrapper';
import { Snackbar } from "@material-ui/core";


enzyme.configure({ adapter: new Adapter() })

let component: ShallowWrapper<any, any, any>;
const fakeProps = {
  classes: {},
  message: "hi mom",
  open: true,
  clear: () => { }
};

describe("SnackWrapper Component", () => {

  beforeEach(() => {
    component = shallow(<SnackWrapperTestComp {...fakeProps} />);
  });

  test("should render without error", () => {
    expect(component.instance()).toMatchSnapshot();
  });

  it("always renders a material ui snackbar", () => {
    const divs = component.find(Snackbar);
    expect(divs.length).toBeGreaterThan(0);
  });

});
