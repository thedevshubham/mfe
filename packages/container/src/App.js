import { StylesProvider, createGenerateClassName } from "@material-ui/core";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import Header from "./components/Header";

import { createBrowserHistory } from "history";

const AuthLazy = lazy(() => import("./components/AuthApp"));
const MarketingLazy = lazy(() => import("./components/MarketingApp"));
const DashboardLazy = lazy(() => import("./components/DashboardApp"));

const generateClassName = createGenerateClassName({
  productionPrefix: "co",
});

const history = createBrowserHistory();

export default () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      history.push("/dashboard");
    }
  }, [isSignedIn]);

  return (
    <Router history={history}>
      <StylesProvider generateClassName={generateClassName}>
        <div>
          <Header
            isSignedIn={isSignedIn}
            onSignOut={() => setIsSignedIn(false)}
          />
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path={"/auth"}>
                <AuthLazy onSignIn={() => setIsSignedIn(true)} />
              </Route>
              <Route exact path={"/dashboard"}>
                {!isSignedIn && <Redirect to="/" />}
                <DashboardLazy />
              </Route>
              <Route path={"/"}>
                <MarketingLazy onSignIn={() => setIsSignedIn(true)} />
              </Route>
            </Switch>
          </Suspense>
        </div>
      </StylesProvider>
    </Router>
  );
};
