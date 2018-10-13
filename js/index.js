const proxyurl = 'https://cors-anywhere.herokuapp.com/';
let url;
let username;

const lang = 'javascript';

let userArr;
let cwArr;

// dom elements
const inputField = document.querySelector('.inputField');
const tryBtn = document.querySelector('.tryBtn');
const outputField = document.querySelector('.outputField');


async function getKata()  {
  const response = await fetch(proxyurl + url);
  const json = await response.json();
  return json.data;
}

async function click() {
  // too many transformations, not good
  // bad, just bad, but can parse all (well, almost) sorts of input
  // will update later, wanna sleep now

  // setting storage for result
  let resultY = [];
  let resultN = [];
  // clearing output field
  outputField.textContent = '';
  // setting regex for urls
  const regex = new RegExp(/(https?:\/\/[^\s]+)/g);

  // --- PARSING CODE HERE --- //
  // getting user info
  userArr = inputField.value;
  // splitting text info, transforming into array of lines
  userArr = userArr.trim().split('\n');
  // extracting username, adding it to profile url
  username = userArr.pop().trim();
  url = `https://www.codewars.com/api/v1/users/${username}/code-challenges/completed`;

  // filtering empty strings
  userArr = userArr.filter(element => element !== '');
  // getting urls
  userArr = userArr.map(element => element.match(regex)[0]);
  // extracting last parts of urls ("slugs")
  userArr = userArr.map(element => element.replace(/\/$/, ''));

  // --- JSON HANDLING --- //
  // getting json from Codewars API
  cwArr = await getKata();
  // getting data on requested lang
  cwArr = cwArr.filter(n => n.completedLanguages.includes(lang));
  // extracting "slugs"
  cwArr = cwArr.map(n => n.slug);

  // too complicated, O(n^2) after apllying to str array
  userArr.forEach((element) => {
    // comparing "slugs"
    const afterSlash = /[^/]*$/.exec(element)[0];
    if (cwArr.includes(afterSlash)) {
      resultY.push(element);
    } else  {
      resultN.push(element);
    }
  });

  // finally
  resultY.forEach((element) => {
    const a = document.createElement('a');
    a.setAttribute('href', element);
    a.innerHTML = element;
    outputField.appendChild(a);
    outputField.innerHTML += '<span class="charPlus"> +</span>';
    outputField.innerHTML += '\r\n';
  });

  resultN.forEach((element) => {
    const a = document.createElement('a');
    a.setAttribute('href', element);
    a.setAttribute('target', '_blank');
    a.innerHTML = element;
    outputField.appendChild(a);
    outputField.innerHTML += '<span class="charMinus"> -</span>';
    outputField.innerHTML += '\r\n';
  });
}

tryBtn.addEventListener('click', click);