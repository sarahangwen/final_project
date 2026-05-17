(function () {
  var currentPath = window.location.pathname.replace(/\/+$/, "") || "/";
  var sidebarLinks = document.querySelectorAll(".sidebar a[href]");

  sidebarLinks.forEach(function (link) {
    var href = (link.getAttribute("href") || "").replace(/\/+$/, "") || "/";

    if (href === "/logout") {
      return;
    }

    if (href === currentPath || (href !== "/" && currentPath.indexOf(href + "/") === 0)) {
      link.classList.add("active");
    }
  });
})();
