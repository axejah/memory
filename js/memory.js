const game = document.getElementById("game");
let tryCount = 0;

let flippedCard = false;
let lockCards = false;
let firstCard, secondCard;

getData("https://axejah.github.io/memory/assets/data/data.json").then((data) =>
  data.map((club) => {
    return (
      generateDiv(club.filename, club.club),
      generateDiv(club.filename, club.club),
      randomizeClubs()
    );
  })
);

function generateDiv(img, club) {
  let newDiv = document.createElement("div");
  let newImg = document.createElement("img");
  newImg.src = `./assets/img/${img}`;
  newDiv.dataset.club = `${club}`;
  newDiv.appendChild(newImg);
  newDiv.addEventListener("click", flipCard);
  game.appendChild(newDiv);
}

async function getData(url) {
  const res = await fetch(url);
  return await res.json();
}

function randomizeClubs() {
  let clubs = document.querySelectorAll("#game > div");
  clubs.forEach((club) => {
    let flexorder = Math.floor(Math.random() * 1000) + 1;
    club.style.order = flexorder;
  });
}

function flipCard() {
  if (lockCards) return;
  if (this === firstCard) return;
  this.querySelector("img").style.display = "block";

  if (!flippedCard) {
    flippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;

  checkMatch();
}

function checkMatch() {
  let match = firstCard.dataset.club === secondCard.dataset.club;
  match ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  resetBoard();
}

function unflipCards() {
  lockCards = true;
  setTimeout(() => {
    firstCard.querySelector("img").style.display = "none";
    secondCard.querySelector("img").style.display = "none";
    resetBoard();
  }, 1500);
  setTryCount();
}

function resetBoard() {
  [flippedCard, lockCards] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function setTryCount() {
  tryCount++;
  let tryCountSpan = document.getElementById("tries");
  tryCountSpan.innerHTML = `${tryCount}`;
}
