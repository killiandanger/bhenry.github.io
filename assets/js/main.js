let game = {};

game.board = document.getElementById('game');
game.cardsInHand = [];

game.takeCard = function(p) {
  let icon = document.createElement('i');
  icon.className = 'far fa-hand-lizard';
  icon.title = 'Draw this card';
  // icon.onclick = function() {

  // }
  return icon;
}

game.flipCard = function(p) {
  let icon = document.createElement('i');
  icon.className = 'fas fa-sync';
  icon.title = 'Flip this card';
  icon.onclick = function() {
    let c = p.cards[0];
    c.facing_up = !c.facing_up;
    p.render();
  }
  return icon;
}

game.pile = function(cs, coords) {
  let p = {};
  p.location = coords;
  p.div = document.createElement('div');
  p.cards = cs;
  p.render = function() {
    p.div.innerHTML = "";
    p.div.append(cs[0].div);
    cs[0].render();
    cs[0].div.append(game.takeCard(p));
    cs[0].div.append(game.flipCard(p));
  }
  return p;
}

game.hand = function(coords) {
  let h = {};
  h.location = coords;
  h.div = document.createElement('div');
  h.render = function() {
    h.div.innerHTML = '';
    game.cardsInHand.forEach(function(c) {
      h.div.append(c.div);
      c.facing_up = true;
      c.render();
    })
  }
}

game.shuffle = function(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

game.suits = ["<span class='red'>♥</span>", '♣', "<span class='red'>♦</span>", '♠']
game.ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
game.deck = []
game.ranks.forEach(function(r) {
  game.suits.forEach(function(s) {
    let card = {};
    card.rank = r;
    card.suit = s;
    card.facing_up = false;
    card.div = document.createElement('div');
    card.render = function() {
      card.div.innerHTML = '';
      let inner = '';
      if (card.facing_up) {
        card.div.className = 'card'
        inner = `<div class='rank'>${card.rank}</div><div class='suit'>${card.suit}</div>`;
      } else {
        card.div.className = 'card cardback'
        inner = `<div class='rank'>&nbsp;</div><div class='suit'>&nbsp;</div>`;
      }
      card.div.innerHTML = inner;
    }
    $(card.div).draggable({containment: $(game.board)});
    game.deck.push(card);
  })
})

game.start = function() {
  game.deck = game.shuffle(game.deck);
  game.board.innerHTML = "";
  let deck = game.pile(game.deck, [0,0]);
  game.board.append(deck.div);
  //game.board.append(game.hand.div);
  deck.render();
}

game.start();
