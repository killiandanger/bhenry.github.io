let game = {};

game.board = document.getElementById('game')

game.takeCard = function(c) {
  let icon = document.createElement('i');
  icon.className = 'far fa-hand-lizard';
  icon.title = 'Draw this card';
  return icon;
}

game.flipCard = function(c) {
  let icon = document.createElement('i');
  icon.className = 'fas fa-sync';
  icon.title = 'Flip this card';
  icon.onclick = function() {
    c.facing = c.facing == 'down' ? 'up' : 'down';
    c.render();
  }
  return icon;
}

game.card = function(c) {
  let div = document.createElement('div');
  let inner = "";
  div.className = 'card'
  if (c.facing == 'up') {
    inner = `<div class='cardfront'><div class='rank'>${c.rank}</div><div class='suit'>${c.suit}</div></div>`;
  } else {
    inner = "<div class='cardback'></div>";
  }
  div.innerHTML = inner;
  div.append(game.takeCard(c));
  div.append(game.flipCard(c));
  return div;
}

game.pile = function(cs, coords) {
  let p = {};
  p.location = coords;
  p.div = document.createElement('div');
  p.render = function() {
    p.div.innerHTML = "";
    p.div.append(cs[0].div);
  }
  return p;
}

game.start = function() {
  game.deck = game.shuffle(game.deck);
  game.board.innerHTML = "";
  let deck = game.pile(game.deck, [0,0]);
  game.board.append(deck.div);
  deck.render();
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

game.suits = ['♥', '♣', '♦', '♠']
game.ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
game.deck = []
game.ranks.forEach(function(r) {
  game.suits.forEach(function(s) {
    let card = {};
    card.rank = r;
    card.suit = s;
    card.facing = 'down';
    card.div = game.card(card);
    card.render = function() {
      card.div.innerHTML = "";
      card.div.append(game.card(card));
    }
    game.deck.push(card);
  })
})

game.start();
