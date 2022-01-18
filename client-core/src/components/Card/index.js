import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import "./Card.scss";

function Card({ content, imageSize }) {
  const history = useHistory();
  const params = useParams();
  const { programId } = params;
  const { image, title, description, action } = content;
  const handleClickCard = () => {
    if (!action) {
      return;
    }
    if (action.type === "page") {
      history.push(`/program/${programId}/page/${action.value}`);
    }
    if (action.type == "link") {
      window.location.href = action.value;
    }
  };

  return (
    <div className="card__item" onClick={() => handleClickCard()}>
      {image ? (
        <div
          className="card__image"
          style={
            imageSize !== "full" ? { backgroundImage: `url("${image}")` } : {}
          }
        >
          {imageSize === "full" ? <img src={image} alt="" /> : null}
        </div>
      ) : null}
      <div className="card__content-container">
        <div className="card__content">
          <div
            className="card__title"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <div
            className="card__description"
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
        </div>
        {action && (title || description) && (
          <div className="card__action">
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
