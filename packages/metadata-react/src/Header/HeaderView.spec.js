import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';
import HeaderView from './HeaderView';

describe('(Component) <Header />', () => {
  it('should render the correct title', () => {
    const wrapper = shallow(<HeaderView
      authService={{}}
      history={{
        push: () => {
        },
      }}
      isAuthenticated={false}
      loginRequest={() => {
      }}
      logoutSuccess={() => {
      }}/>);
    expect(wrapper.find('h1').text()).to.equal('React Redux Auth0 Kit');
  });
});