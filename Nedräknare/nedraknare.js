var renderContext = {};

(function(title, endTitle, endDate, bigText) {
  renderContext.title = title;
  if (endTitle) {
    renderContext.endTitle = endTitle;
  }

  renderContext.endDate = endDate;

  if (bigText) {
    renderContext.bigLabel = 'countdownLabel--big';
    renderContext.bigNumber = 'countdownNumber--big';
  } else {
    renderContext.bigLabel = '';
    renderContext.bigNumber = '';
  }
})(
  scriptVariables.Rubrik,
  scriptVariables.Slutrubrik,
  scriptVariables.Slutdatum,
  scriptVariables.Stortext
);
