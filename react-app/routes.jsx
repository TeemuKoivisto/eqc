import React from "react";
import { Route } from "react-router";

import App from "./app/App.component";
import Calculate from "./calculate/Calculate.container";
import NotFound from "./app/NotFound.component";

export default (
  <Route>
    <Route path="/" component={App}>
      <Route path="calculate" component={Calculate}/>
      <Route path="*" component={NotFound}/>
    </Route>
  </Route>
);
