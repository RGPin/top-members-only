async function indexGet(req, res) {
  try {
    res.render("index");
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  indexGet,
};
