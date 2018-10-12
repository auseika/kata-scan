const proxyurl = "https://cors-anywhere.herokuapp.com/";
let url;
let username;

const lang = "javascript";

let userArr;
let cwArr;

//dom elements
const inputField = document.querySelector('.inputField');
const tryBtn = document.querySelector('.tryBtn');
const outputField = document.querySelector('.outputField');


async function getKata()  {
  const response = await fetch(proxyurl + url); 
  const json = await response.json();
  return json['data']; 
}

async function click() {
  // too many transformations, not good
  // bad, just bad, but can parse all sorts of input
  // will update later, wanna sleep now
  let result = [];
  outputField.textContent = '';
  const regex = new RegExp(/(https?:\/\/[^\s]+)/g);
  userArr = inputField.value;
  userArr = userArr.trim().split("\n");

  username = userArr.pop().trim();
  url = `https://www.codewars.com/api/v1/users/${username}/code-challenges/completed`;

  userArr = userArr.map(element => element.match(regex)[0]);
  userArr = userArr.filter(element => element != '');
  userArr = userArr.map(element => element.replace(/\/$/, ""));


  cwArr = await getKata();
  cwArr = cwArr.filter(n => n.completedLanguages.includes(lang));
  cwArr = cwArr.map(n => n.slug);

  // too complicated, O(n^2) after apllying to str array
  userArr.forEach(element => {
    let afterSlash = /[^/]*$/.exec(element)[0];
    if (cwArr.includes(afterSlash)) {
      result.push(element + ' +');
    } else  {
      result.push(element + ' -');
    }
  });
  
  console.log(userArr)

  result.forEach(element => {
    outputField.textContent += element + '\r\n';
  });
}

tryBtn.addEventListener('click', click);