function util () {}


util.shuffle = function (array) {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};


util.touchDevice = false;
window.addEventListener('touchstart', function onFirstTouch() {
  document.body.classList.add('touch-device');
  util.touchDevice = true;
  window.removeEventListener('touchstart', onFirstTouch, false);
}, false);


util.pile_class = function(cards_below){
  if (card.cards_below < 1){
    "pile-0";
  } else if(card.cards_below < 13) {
    "pile-13";
  } else if(card.cards_below < 26) {
    "pile-26";
  } else if(card.cards_below < 39) {
    "pile-39";
  } else {
    "pile-52";
  }
};


util.mousedown = function(c){
  return function(e){
    var data = {}
    data.startclick = Date.now();
    console.log(data.startclick);
    $(c.div).mouseup(util.mouseup(c, data));
  }
}

util.mouseup = function(c, data){
  return function(e){
    $(c.div).off('mouseup');
    console.log(Date.now() - data.startclick);
    if (Date.now() - data.startclick < 200){
      c.flipcard();
    }
  }
}

util.make_card = function(suit, si, rank, ri){
  let card = {};
  card.identifier = `${ri}-${si}`;
  card.rank = rank;
  card.suit = suit;
  card.facing_up = Math.random() < 0.5;
  card.div = document.createElement("div");
  $(card.div).data("c", card);
  $(card.div).mousedown(util.mousedown(card));
  card.render = function() {
    card.div.className = util.pile_class(card.cards_below)
    let inner = "";
    if (card.facing_up) {
      card.div.classList.remove('cardback');
      inner = `<div class='rank'>${card.rank}</div><div class='suit'>${card.suit}</div>`;
    } else {
      card.div.classList.add('cardback');
      inner = `<div class='rank'>&nbsp;</div><div class='suit'>&nbsp;</div>`;
    }
    if (util.touchDevice){

    }
    card.div.innerHTML = inner;
    card.div.classList.add('card');
  }
  card.flipcard = function(){
    card.facing_up = !card.facing_up;
    card.render();
  }
  return card;
};
