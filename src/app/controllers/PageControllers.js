class PageController {
  mainPage(req, res) {
    res.send("Hello world!");
  }
}

module.exports = new PageController();
