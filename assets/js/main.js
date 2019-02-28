let game = {};

game.board = document.getElementById('game');
game.cardsInHand = [];

game.clickable = function(iconClass) {
  let icon = document.createElement('i');
  icon.className = iconClass;
  return icon;
}

game.takeCard = function(p) {
  let icon = game.clickable('far fa-hand-lizard');
  icon.title = 'Draw this card';
  icon.onclick = function() {
    let c = p.cards.shift();
    game.cardsInHand.push(c);
    p.render();
    game.hand.render();
  }
  return icon;
}

game.flipCard = function(p) {
  let icon = game.clickable('fas fa-sync');
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
  $(p.div).draggable({containment: $(game.board)});
  p.cards = cs;
  p.render = function() {
    p.div.innerHTML = "";
    if (p.cards.length > 0) {
      p.div.append(p.cards[0].div);
      p.cards[0].render();
      p.cards[0].div.append(game.takeCard(p));
      p.cards[0].div.append(game.flipCard(p));
    }
  }
  return p;
}

game.hand = {}
game.hand.div = document.createElement('div');
game.hand.div.className = 'hand';
game.hand.render = function() {
  game.hand.div.innerHTML = '';
  game.cardsInHand.forEach(function(c) {
    game.hand.div.append(c.div);
    c.facing_up = true;
    c.render();

  })
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
game.ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K']
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

    game.deck.push(card);
  })
})

game.start = function() {
  game.deck = game.shuffle(game.deck);
  game.board.innerHTML = "";
  let deck = game.pile(game.deck, [0,0]);
  game.board.append(deck.div);
  game.board.parentNode.insertBefore(game.hand.div, game.board.nextSibling);
  game.hand.render();
  deck.render();
}

game.start();
