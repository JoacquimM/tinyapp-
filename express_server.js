
//------------- DATA --------------------

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" }
};
//-------------------------------------------
const users = { 
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com", 
    password: "1"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "1"
  }
};

//-------------------------------------------------------
const {generateRandomString, getUserByEmail, urlsForUser} = require("./helper");
const express = require("express");
const app = express();
const PORT = 8080;
let cookieSession = require('cookie-session');
app.use(
  cookieSession({
    name: 'session',
    keys: [ 'key1', 'key2'],
  })
);

const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const { restart } = require("nodemon");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

// ----------------------------------------------------------------
/*
    This class facilitates creation of individual user objects for users object.
*/


class NewUsers {
  constructor(id, email, password) {
    this.id = id;
    this.email = email;
    this.password = bcrypt.hashSync(password, 10);
  }
  
  // adds user to users DB
  static addUserToDB(userObj) {
    console.log("userObj --->", userObj);
    users[userObj.id] = { 
      id : `${userObj.id}`,
      email: `${userObj.email}`,
      password:`${userObj.password}`
    };
  }
  // returns current users in DB
  static seeCurrentUsers() {
    console.log(users);
  }
}
  
//------------------ GET ROUTES ---------------------------

app.get("/", (req, res) => {
  const templateVars = { name: "john"};
  res.render("viewspractice", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  const user = users[req.session.user_id]; 
  let userEmail;
  let templateVars = { urls:{}, email:"", longURL:"", shortURL:"",};
  if (user) { 
    userEmail = user.email;
    templateVars = { urls: urlsForUser(user.id,urlDatabase) ,  email: userEmail, longURL:"", shortURL: req.params.shortURL};
  }
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = req.session.user_id;
  if (! user) { 
    res.redirect("/login");
    return;
  }
  const templateVars = { email: users[req.session.user_id].email};
  res.render("urls_new", templateVars);
  
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, username: req.session.username,  email: users[req.session.user_id].email};
  res.render("urls_show", templateVars);

});
// register
app.get("/register", (req, res) => {
  res.render("register");

});

app.get("/login", (req, res) => {
  res.render("login");

});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {

  const longUrl = req.body.longURL;
  let shortUrl = generateRandomString();  
  const userId =  req.session.user_id;
  urlDatabase[shortUrl] = {longURL:longUrl , userID: userId}; 
  res.redirect(`/urls/${shortUrl}`);     
});


//------------------- POST ROUTES -------------------------------

// EDIT LONG URL //
app.post("/urls/:shortURL", (req, res) => {
  let shortURLUpdate = req.params.shortURL;
  let newURLEdit = req.body.name_field;
  if (req.session.user_id  === urlDatabase[shortURLUpdate].userID) {
    urlDatabase[shortURLUpdate].longURL = newURLEdit;
    res.redirect(`/urls`);
  }
  res.status(401).send("You are not authorized"); 
});

// DELETE //
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURLDelete = req.params.shortURL;
  
  if (req.session.user_id  === urlDatabase[shortURLDelete].userID) {
    delete urlDatabase[shortURLDelete];
    res.redirect(`/urls`);
  }
    
  res.status(401).send("You are not authorized");
 
});



// COOKIES //
app.post("/login", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userFromEmail = getUserByEmail(userEmail,users);
  if (!userFromEmail) { 
    return res.status(403).send("Email can not be found");
  }
  
  if (bcrypt.compareSync(userPassword, userFromEmail.password)) {
    req.session["user_id"] = userFromEmail.id;
    res.redirect(`/urls`);
  } else {
    return res.status(403).send("invalid password");
  }
    
});

// LOGOUT //
app.post("/logout", (req, res) => {
  req.session["user_id"] = null;
  res.redirect(`/login`);
});

// REGISTER //
app.post("/register", (req, res) => {
  const userRandomID = generateRandomString();
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  if (userEmail === "" && userPassword === "") {
    res.status(400).send("You did not enter anything");
  } 
  if (getUserByEmail(userEmail,users)) {
    res.status(400).send("Email already in records")
  };
  const newUser = new NewUsers(`${userRandomID}`, `${userEmail}`, `${userPassword/*hashedPassword*/}`);
  NewUsers.addUserToDB(newUser);
  req.session["user_id"] = userRandomID; //userFromEmail is the user obj in users
  res.redirect(`/urls`);
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = {users};