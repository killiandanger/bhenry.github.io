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
    c.facing_up = !c.facing_up;
    c.render();
  }
  return icon;
}

game.pile = function(cs, coords) {
  let p = {};
  p.location = coords;
  p.div = document.createElement('div');
  p.render = function() {
    p.div.innerHTML = "";
    p.div.append(cs[0].div);
    cs[0].render();
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
    card.facing_up = false;
    card.div = document.createElement('div');
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
      card.div.append(game.takeCard(card));
      card.div.append(game.flipCard(card));
    }
    $(card.div).draggable({containment: $(game.board)});
    game.deck.push(card);
  })
})

game.start();
