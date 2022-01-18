import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class TitleBar extends React.Component {
  render() {
    const { title, onLogout, goBack, backLabel } = this.props;
    return (
      <div className="page-container__header">
        {goBack && (
          <div className="page-container__header-left-action" onClick={goBack}>
            {backLabel && (
              <button type="button" className="btn btn-link">
                {backLabel}
              </button>
            )}
            {!backLabel && <FontAwesomeIcon icon="angle-left" />}
          </div>
        )}
        <div className="page-container__header-title">{title}</div>
        {onLogout && (
          <div
            className="page-container__header-right-action"
            onClick={onLogout}
          >
            Logout
          </div>
        )}
        {!onLogout && (
          <div className="page-container__header-right-action"></div>
        )}
      </div>
    );
  }
}
