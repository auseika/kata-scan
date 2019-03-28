const proxyurl = 'https://cors-anywhere.herokuapp.com/'; // backup server https://fathomless-cliffs-85079.herokuapp.com/
let url;
let username;
const lang = 'javascript';
let userArr;
let cwArr;

const inputField = document.querySelector('.inputField');
const tryBtn = document.querySelector('.tryBtn');
const outputField = document.querySelector('.outputField');


function parseUsername() {
  userArr = inputField.value; // getting user info
  userArr = userArr.trim().split('\n'); // splitting text info, transforming into array of lines
  username = userArr.pop().trim(); // extracting username, global variable for future purposes
  url = `https://www.codewars.com/api/v1/users/${username}/code-challenges/completed`; // inserting username to url
}

function parseURL() {
  const regex = new RegExp(/(https?:\/\/[^\s]+)/g); // setting regex for urls
  userArr = userArr.filter(element => element !== ''); // filtering empty strings
  userArr = userArr.map(element => element.match(regex)[0]); // getting urls
  userArr = userArr.map(element => element.replace(/\/$/, '')); // deleting trailing slashes
}

async function getKata(page = 0) {
  const response = await fetch(proxyurl + url + `?page=${page}`);
  console.log(`Fetching page ${page}`);
  const json = await response.json();
  return json;
}

async function click() {
  // too many transformations, not good, but can parse all (well, almost) sorts of input
  // will update later, wanna sleep now
  const resultY = []; // setting storage for completed katas
  const resultN = []; // setting storage for uncompleted katas
  outputField.textContent = ''; // clearing output field

  // --- PARSING CODE HERE --- //
  parseUsername(); // parsing user input for username
  parseURL(); // parsing user input for urls to katas

  // --- JSON HANDLING --- //
  cwArr = await getKata(); // getting json from Codewars API

  if (cwArr.totalPages > 1) {
    for (let i = 1; i < cwArr.totalPages; i++) {
      let temp = await getKata(i);
      cwArr.data = cwArr.data.concat(temp.data);
    }
  }

  cwArr = cwArr.data.filter(n => n.completedLanguages.includes(lang)); // getting data on requested lang
  cwArr = cwArr.map(n => n.slug); // extracting "slugs"

  // comparing "slugs", filling resulting arrays
  // too complicated, O(n^2) after apllying to str array
  userArr.forEach((element) => {
    const afterSlash = /[^/]*$/.exec(element)[0]; // extracting last parts of urls ("slugs")
    if (cwArr.includes(afterSlash)) {
      resultY.push(element);
    } else {
      resultN.push(element);
    }
  });

  // finally
  resultY.forEach((element) => {
    const a = document.createElement('a');
    a.setAttribute('href', element);
    a.innerHTML = element;
    outputField.appendChild(a);
    outputField.innerHTML += `<span class="charPlus"> +</span>${'\r\n'}`;
  });

  resultN.forEach((element) => {
    const a = document.createElement('a');
    a.setAttribute('href', element);
    a.setAttribute('target', '_blank');
    a.innerHTML = element;
    outputField.appendChild(a);
    outputField.innerHTML += `<span class="charMinus"> -</span>${'\r\n'}`;
  });

  outputField.innerHTML += `${resultY.length}/${resultY.length + resultN.length} completed`;
}

tryBtn.addEventListener('click', click);
