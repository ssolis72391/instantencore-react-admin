import React from "react";
import "./Tabs.scss";

function Tabs({ items, handleTabClick, activeTabIndex }) {
  return (
    <div className="tabs">
      {items.map((item, i) => (
        <div
          key={i}
          className={`tab__item${activeTabIndex === i ? " selected" : ""}`}
          onClick={() => handleTabClick(i)}
        >
          {item.title}
        </div>
      ))}
    </div>
  );
}

export default Tabs;
