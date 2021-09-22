const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const routes = require('./util/routes');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');

const app = express();

app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const host = 3000;
const init = () => {
  app.listen(host);
  console.log(`server berjalan pada http://localhost:${host}`);
};

app.use(
    session({
      secret: 'my_secret_key',
      resave: false,
      saveUninitialized: false,
    }),
);

app.use((req, res, next) => {
  if (req.session.userId === undefined) {
    res.locals.username = 'Tamu';
    res.locals.isLoggedIn = false;
  } else {
    res.locals.username = req.session.username;
    res.locals.isLoggedIn = true;
  }
  next();
});

app.get('/', routes.home);
app.get('/login', routes.login);
app.post('/auth', routes.auth);
app.get('/logout', routes.logout);
app.get('/add', routes.add);
app.post('/add', routes.uploadMultiple, routes.addNewProduct);
app.get('/update/:id', routes.update);
app.post('/update', routes.updateById);
app.post('/delete/:id', routes.deleteById);
app.post('/sendmail', routes.sendMail);
app.get('/product/:id', routes.productPage);

init();