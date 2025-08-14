function doGet() {
  return HtmlService.createTemplateFromFile('monitor')
    .evaluate()
    .setTitle('Monitor Maestro')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}
