import React, { useState, useEffect } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import Card from "../Card";

import "./Component.scss";

function Component({ content, viewAll }) {
  const history = useHistory();
  const params = useParams();
  const { programId, pageId } = params;

  let {
    id,
    cardType,
    style,
    title,
    subtitle,
    cardImageSize,
    cardImagePosition,
    maxCards,
    cards,
    viewAllText,
  } = content;
  // If view all, force to render as standard so that we get a vertical list.
  if (viewAll) {
    cardType = "standard";
    // If card imagePosition was top or bottom (ex: from a horizontal list), then set imagePosition to left.
    if (cardImagePosition === "top" || cardImagePosition === "bottom") {
      cardImagePosition = "left";
    }
    // If card imagePosition was full switch it to contain.
    if (cardImageSize === "full") {
      cardImageSize = "contain";
    }
  }
  const handleViewAll = () => {
    history.push(`/program/${programId}/page/${pageId}/view-all/${id}`);
  };

  return (
    <div className={`component component--${style}`}>
      <div className="component__header">
        {title && (
          <div className="component__title">
            <div className="component__title-bar"></div>
            <div dangerouslySetInnerHTML={{ __html: title }}></div>
          </div>
        )}
        <div
          className="component__subtitle"
          dangerouslySetInnerHTML={{ __html: subtitle }}
        ></div>
      </div>
      <div
        className={`card card--${cardType} card--image-position-${cardImagePosition} card--image-size-${cardImageSize}`}
      >
        {cards.length > 0
          ? cards
              .slice(0, viewAll ? cards.length : maxCards)
              .map((card, index) => (
                <Card content={card} key={index} imageSize={cardImageSize} />
              ))
          : null}
        {cards.length > maxCards && !viewAll ? (
          <div className="card__item card__view-all" onClick={handleViewAll}>
            <div className="card__content-container">
              <div className="card__content">
                <div className="card__title"></div>
                <div className="card__description">{viewAllText}</div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Component;
