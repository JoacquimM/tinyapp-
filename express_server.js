
function generateRandomString() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  let answer = "";
  
  for(let i = 0; i < 3; i ++){
    let number = Math.floor(Math.random()*3);
    let letter = alphabet[Math.floor(Math.random() * alphabet.length)]
    answer += number;
    answer += letter;
  }
  
  console.log(answer);
  return answer;
  }
//----------------------------------------------------------------
const express = require("express");
const app = express();
const PORT = 8080; 

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//----------------------------------------------------------------





const urlDatabase = { // <---  use to keep track of all the URLs and their shortened forms. 
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

shortURLdeletArray = []

shortURLdeletArrayObj = {}

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: req.params.longURL};
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  console.log(req.body);
  const longUrl = req.body.longURL
  let shortUrl = generateRandomString()  // Log the POST request body to the console
  shortURLdeletArray.push(shortUrl);  // <-- pushes newly created short Url to array(database) might not need
  console.log(shortURLdeletArray);
  urlDatabase[shortUrl] = longUrl;
  res.redirect(`/urls/${shortUrl}`);     // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {

  //  console.log(shortURLdeletArray.length - 1);
   console.log(req.params.shortURL);
   const shortURLDelete = req.params.shortURL;
   delete urlDatabase[shortURLDelete]
   res.redirect(`/urls`);
 
});

// app.delete("/urls/:shortURL/delete", function (req, res) {
//   // res.send('DELETE request to homepage')
//     const shortURLDelete = req.body.shortURL;
//     delete urlDatabase[shortURLDelete];
//   res.redirect(`/urls`);
// })




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});