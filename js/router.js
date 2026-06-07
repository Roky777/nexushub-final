export function showView(viewId) {
  const views = document.querySelectorAll(".view");

  views.forEach((view) => {
    view.hidden = true;
    view.classList.remove("active-view");
  });

  const activeView = document.getElementById(viewId);

  if (activeView) {
    activeView.hidden = false;
    activeView.classList.add("active-view");
  }
}
