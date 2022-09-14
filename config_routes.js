const indexR = require("./routes/index");
const usersR = require("./routes/users");
const booksR = require("./routes/books");
const catR = require("./routes/categories");
const deliverR = require("./routes/delivery");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/books",booksR );
  app.use("/cat",catR );
  app.use("/delivery",deliverR );
  app.use((req, res) => {
    res.status(404).json({ msg: "Url not found, 404 !" });
  })
}



exports.corsAccessControl = (app) => {
  app.all('*', (req, res, next) => {
    console.log("cors",app);
    if (!req.get('Origin')) return next();
    res.set('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type, auth-token, x-api-key');
    next();
  });
}
