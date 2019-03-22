let util = {};


util.shuffle = function (arr) {
  let array = arr.slice(0, arr.length+1);
  let currentIndex = array.length, temporaryValue, randomIndex;
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
  if (cards_below < 1){
    return "pile-0";
  } else if(cards_below < 13) {
    return "pile-13";
  } else if(cards_below < 26) {
    return "pile-26";
  } else if(cards_below < 39) {
    return "pile-39";
  } else {
    return "pile-52";
  }
};


util.mousedown = function(c, onSuccess){
  return function(e){
    let data = {}
    data.startclick = Date.now();
    $(c.div).mouseup(util.mouseup(c, data, onSuccess));
  }
}

util.mouseup = function(c, data, onSuccess){
  return function(e){
    $(c.div).off('mouseup');
    if (Date.now() - data.startclick < 200){
      c.flipcard();
      onSuccess();
    }
  }
}

util.suits = ["<span class='red'>♥</span>", '♣', "<span class='red'>♦</span>", '♠'];
util.ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

util.make_card = function(attrs){
  let card = {};
  let ri = attrs.rank_index;
  let si = attrs.suit_index;
  card.identifier = `${ri}-${si}`;
  card.rank = util.ranks[ri];
  card.suit = util.suits[si];
  card.facing_up = attrs.facing_up;
  card.cards_below = attrs.cards_below;
  card.div = document.createElement("div");
  $(card.div).data("c", card);
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

util.make_deck = function(){
  let deck = []
  util.suits.forEach(function(s, si){
    util.ranks.forEach(function(r, ri){
      let card = util.make_card(si, ri);
      deck.unshift(card);
    });
  });
  return deck;
};
