import React, { useEffect, useState } from "react";
const AuthLayout = (props) => {
  useEffect(() => {
    const stickyLeftWidth = $(".dashboard-left-sticky").outerWidth();
    const stickyTopWidth = $(".top-header-wrapper").outerHeight();
    $(".dashboard-inner").css({
      marginLeft: `${stickyLeftWidth}px`,
      marginTop: `${stickyTopWidth}px`,
    });
  }, [window.location.pathname]);
  return <div className="auth-layout-wrapper">{props.children}</div>;
};

export default AuthLayout;
