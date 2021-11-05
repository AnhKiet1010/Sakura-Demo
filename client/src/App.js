import React, { lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from "./helpers/router";

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
// const Home = lazy(() => import('./pages/Home'));
const Callback = lazy(() => import('./pages/Callback'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const NotFound = lazy(() => import('./pages/NotFound'));


function App() {
  return (
    <Router>
      <Switch>
        <PublicRoute path="/callback" component={Callback} />
        <PublicRoute exact path="/login" component={Login} />
        <PublicRoute exact path="/register" component={Register} />
        <PrivateRoute exact path="/" component={ChatPage} />
        <PrivateRoute exact path="/chat" component={ChatPage} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;
