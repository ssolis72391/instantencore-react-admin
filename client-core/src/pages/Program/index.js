import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import Component from "../../components/Component";
import Header from "../../components/Header";
import Page from "../../components/Page";
import getProgram from "../../services/getProgram";

import "./program.scss";

function Program() {
  const history = useHistory();
  const params = useParams();
  const { programId, componentId } = params;
  const [program, setProgram] = useState(null);
  const [page, setPage] = useState(null);

  async function onLoad() {
    try {
      const program = await getProgram(params.programId);
      setProgram(program);
    } catch (error) {}
  }

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    if (program) {
      if (!params.pageId) {
        const page = program.pages.find((page) => page.pageType === "root");
        setPage(page);
        history.replace(`/program/${program.id}/page/${page.id}`);
      } else {
        const page = program.pages.find(
          (page) => page.id === parseInt(params.pageId)
        );
        setPage(page);
      }
    }
  }, [program]);

  useEffect(() => {
    if (program && page) {
      const page = program.pages.find(
        (page) => page.id === parseInt(params.pageId)
      );
      setPage(page);
    }
  }, [page, program, params.pageId]);

  const component = page?.components?.find(
    (item) => item.id === parseInt(componentId)
  );

  return (
    <Page cls="page" title="Program">
      {page ? (
        <Switch>
          <Route
            path="/program/:programId/page/:pageId/view-all/:componentId"
            exact
          >
            <div className="components view-all">
              <Component content={component} viewAll />
            </div>
          </Route>
          <Route
            path={["/program/:programId/page/:pageId", "/program/:programId"]}
          >
            <Header content={page} />
            <div className="components">
              {page.components.map((component, index) => (
                <Component content={component} key={index} />
              ))}
            </div>
          </Route>
        </Switch>
      ) : null}
    </Page>
  );
}

export default Program;
