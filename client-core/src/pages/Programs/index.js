import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Page from "../../components/Page";
import Tabs from "../../components/Tabs";
import Header from "../../components/Header";

import getPrograms from "../../services/getPrograms";

import "./programs.scss";

function Programs() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const history = useHistory();

  async function onLoad() {
    try {
      const items = await getPrograms();
      setIsLoaded(true);
      setItems(items);
    } catch (error) {
      setIsLoaded(true);
      setError(error);
    }
  }

  useEffect(() => {
    onLoad();
  }, []);

  const handleClickCard = (id) => {
    history.push(`/program/${id}`);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <Page cls="programs-listing" title="All programs">
        <Tabs
          items={items}
          activeTabIndex={selectedTabIndex}
          handleTabClick={setSelectedTabIndex}
        />
        <div className="programs">
          {items.length > 0
            ? items[selectedTabIndex].programSummaries.map(
                (programSummary, i) => (
                  <div
                    onClick={() => handleClickCard(programSummary.id)}
                    key={i}
                  >
                    <Header content={programSummary} isRootHeader />
                  </div>
                )
              )
            : null}
        </div>
      </Page>
    );
  }
}

export default Programs;
