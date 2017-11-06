import React from 'react';
import ReactDOM from 'react-dom';
import RootView from './RootView';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<RootView />, div);
});
