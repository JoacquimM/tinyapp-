function generateRandomString() {
  const abc = "abcdefghijklmnopqrstuvwxyz"
  let answer = "";
  
  for(let i = 0; i < 3; i ++){
  let number = Math.floor(Math.random()*3);
  let letter = abc[Math.floor(Math.random() * abc.length)]
  answer += number;
  answer += letter;
  }
  
  console.log(answer);
  }

  module.exports = {generateRandomString}