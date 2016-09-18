import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import App from '/client/App.jsx';
import Add from '/client/Add.jsx'
import { renderRoutes } from '/client/routes.jsx'

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('render-target'));
});
