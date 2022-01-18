import React from "react";
import TitleBar from "./TitleBar";
import { connect } from "react-redux";

function Page({
  cls,
  children /* title, status, showLogout, onLogout, goBack, backLabel */,
}) {
  const goBack = () => {
    //this.props.clearMessage();
    //this.props.goBack();
  };

  return <div className={cls}>{children}</div>;
}

export default Page;
