
function generateRandomString() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  let answer = "";
  
  for(let i = 0; i < 3; i ++){
    let number = Math.floor(Math.random()*3);
    let letter = alphabet[Math.floor(Math.random() * alphabet.length)]
    answer += number;
    answer += letter;
  }
  
  // console.log(answer);
  return answer;
  }
//----------------------------------------------------------------
const express = require("express");
const app = express();
const PORT = 8080;
cookieParser = require('cookie-parser');

app.use(cookieParser()); 

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//----------------------------------------------------------------





const urlDatabase = { // <---  use to keep track of all the URLs and their shortened forms. 
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// ----------------------------------------------------------------


  const users = { 
  //   "userRandomID": {
  //     id: "userRandomID", 
  //     email: "user@example.com", 
  //     password: "purple-monkey-dinosaur"
  //   },
  // "user2RandomID": {
  //     id: "user2RandomID", 
  //     email: "user2@example.com", 
  //     password: "dishwasher-funk"
  //   }
  }
  //--------------------------------
  
  class NewUsers {
    constructor(id,email,password){
      this.id = id;
      this.email = email;
      this.password = password;
    }
  
  // adds user to DB
    static addUserToDB(userObj){
     users[userObj.id] = { 
      id : `${userObj.id}`,
      email: `${userObj.email}`,
      password:`${userObj.password}`
       }
  }
  // returns current users in DB
    static seeCurrentUsers(){
      console.log(users);
   }
  
  }
  
//----------------------------------------------------------------
const getUserByEmail = (email) => {
  for (let key of Object.keys(users)) {
    const user = users[key];
    console.log(user, key);
    if( user.email === email){
      // return user object base on userEmail
      return user;
    }
  }
  return false;
}


app.get("/", (req, res) => {
  // res.send("Hello!");
  const templateVars = { name: "john"}
  res.render("viewspractice", templateVars)
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  const user = users[req.cookies.user_id]; // user obj
  let userEmail;
  if(user){ userEmail = user.email};
  console.log(user, userEmail);
  const templateVars = { urls: urlDatabase ,  email: userEmail};
  // templateVars.username = req.cookies.username // this refrenceses usre name 
  // const templateVars = { username : req.cookies.username}
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL, username:req.cookies.username, email: req.cookies.user_id.email};
  // templateVars.username = req.cookies.username
  res.render("urls_new", templateVars);
  
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL,username: req.cookies.username, email: req.cookies.user_id.email};
  // templateVars.username = req.cookies.username
  res.render("urls_show", templateVars);

});
// register
app.get("/register", (req, res) => {
  // templateVars.username = req.cookies.username
  res.render("register");

});

app.get("/login", (req, res) => {
 // templateVars.username = req.cookies.username
 res.render("login");

});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  const longUrl = req.body.longURL
  let shortUrl = generateRandomString()  // Log the POST request body to the console
  // shortURLdeletArray.push(shortUrl);  // <-- pushes newly created short Url to array(database) might not need
  console.log(shortURLdeletArray);
  urlDatabase[shortUrl] = longUrl;
  res.redirect(`/urls/${shortUrl}`);     // Respond with 'Ok' (we will replace this)
});
// delete
app.post("/urls/:shortURL/delete", (req, res) => {

  //  console.log(shortURLdeletArray.length - 1);
   console.log(req.params.shortURL);
   const shortURLDelete = req.params.shortURL;
   delete urlDatabase[shortURLDelete]
   res.redirect(`/urls`);
 
});
// update
app.post("/urls/:shortURL", (req, res) => {
  shortURLUpdate = req.params.shortURL
  newURLEdit = req.body.name_field;
  // console.log(req.params.shortURL);
  // console.log( req.body);
  // console.log( newURLEdit);
  urlDatabase[shortURLUpdate] = newURLEdit;
  res.redirect(`/urls`);

});

//  //cookies
app.post("/login", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  console.log(userEmail, userPassword);
  if (!getUserByEmail(userEmail)) { return res.status(403).send("Email can not be found")};
  
  
    const userFromEamil = getUserByEmail(userEmail);
    if(userPassword !== userFromEamil.password){

      return res.status(403).send("invalid password")
    }
    
    res.cookie("user_id", userFromEamil.id );
  
  console.log(req.body.password)
  // const userName = req.body.longURL
  // console.log(userName);
  // res.cookie( "username", userName);
  // // console.log('Cookies:',req.cookies.username.longURL);
  // if(req.cookies.username ){
  //   console.log('Cookies:',req.cookies.username.longURL);
  // }
  res.redirect(`/urls`);
  // res.send("Cookie Set"); 
});

//logout
app.post("/logout", (req, res) =>{
  res.clearCookie("user_id")
// res.clearCookie("username")
 res.redirect(`/login`);
})

//Register
app.post("/register", (req, res) =>{
  userRandomID = `${generateRandomString()}`;
  const userEmail = req.body.email;
  const userPassword = req.body.password;
  
  // console.log("userRandomID -->", userRandomID);
  // console.log("email -->", req.body.email);
  // console.log("password -->", req.body.password);
  if (userEmail === "" && userPassword === "") {res.status(400).send("You did not enter anything")}; 
  if (getUserByEmail(userEmail)) {res.status(400).send("Email already in records")};
  // new object
  const newUser = new NewUsers(`${userRandomID}`, `${userEmail}`, `${userPassword}`);
  NewUsers.addUserToDB(newUser);
  res.cookie( "user_id", userRandomID);
  // console.log(req.cookies.user_id.email)
  // console.log(users)
  
  res.redirect(`/urls`);
  
  
 })





app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});