import React from "react";
import "./Header.scss";

function Header({ content, isRootHeader }) {
  const { header } = content;
  console.log(header.image);
  return (
    <div
      className={`header header--content-${
        header.contentPosition
      } header--image-size-${header.imageSize} ${
        isRootHeader ? "root-header" : ""
      }`}
    >
      {header.image ? (
        <div
          className="header__image"
          style={
            header.imageSize !== "full"
              ? { backgroundImage: `url("${header.image}")` }
              : {}
          }
        >
          {header.imageSize == "full" ? (
            <img src={header.image} alt="" />
          ) : null}
        </div>
      ) : null}
      {(header.pretitle || header.title || header.subtitle) && (
        <div className="header__content">
          <div
            className="header__pretitle"
            dangerouslySetInnerHTML={{ __html: header.pretitle }}
          ></div>
          <div
            className="header__title"
            dangerouslySetInnerHTML={{ __html: header.title }}
          ></div>
          <div
            className="header__subtitle"
            dangerouslySetInnerHTML={{ __html: header.subtitle }}
          ></div>
        </div>
      )}
    </div>
  );
}

export default Header;
