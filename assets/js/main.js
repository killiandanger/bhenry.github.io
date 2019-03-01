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
    c.facing_up = true;
    game.cardsInHand.push(c);
    p.render();
    game.hand.render();
  }
  return icon;
}

game.selectCard = function(h, c) {
  let icon = game.clickable('far fa-hand-lizard');
  icon.title = 'Play this card';
  icon.onclick = function() {
    game.cardsInHand.forEach(function(c) {
      if (c.chosen == true) {
        c.chosen = false;
      }
    });
    c.chosen = true;
    h.render();
    //click handler on board to start a pile
    //click handler on piles to add card to pile
    //click handler on other cards in hand
  }
  return icon;
}

game.cancelCardSelection = function(h, c) {
  let icon = game.clickable('fas fa-undo');
  icon.title = 'Cancel playing this card';
  icon.onclick = function() {
    c.chosen = false;
    h.render();
    //cleanup click handlers
  }
  return icon;
}

game.flipPile = function(p) {
  let icon = game.clickable('fas fa-sync');
  icon.title = 'Flip this card';
  icon.onclick = function() {
    let c = p.cards[0];
    c.facing_up = !c.facing_up;
    p.render();
  }
  return icon;
}

game.flipCard = function(h, c) {
  let icon = game.clickable('fas fa-sync');
  icon.title = 'Flip this card';
  icon.onclick = function() {
    c.facing_up = !c.facing_up;
    h.render();
  }
  return icon;
}

game.pile = function(cs, coords) {
  let p = {};
  p.cards = cs;
  p.location = coords;
  p.div = document.createElement('div');
  $(p.div).draggable();
  p.render = function() {
    p.div.innerHTML = "";
    if (p.cards.length > 0) {
      let c = p.cards[0];
      c.render();
      c.div.append(game.deckClickables(p))
      p.div.append(c.div);
    }
  }
  return p;
}

game.handClickables = function(h, c) {
  let cancel = game.cancelCardSelection(h, c);
  let play = game.selectCard(h, c);
  let flip = game.flipCard(h, c);
  let d = document.createElement('div');
  d.className = 'clickables';
  if (c.chosen) {
    d.append(cancel);
  } else {
    d.append(play);
  }
  d.append(flip);
  return d;
}

game.deckClickables = function(p) {
  let draw = game.takeCard(p);
  let flip = game.flipPile(p);
  let d = document.createElement('div');
  d.className = 'clickables';
  d.append(draw);
  d.append(flip);
  return d;
}

game.hand = {}
game.hand.div = document.createElement('div');
game.hand.div.className = 'hand';
game.hand.render = function() {
  game.hand.div.innerHTML = '';
  game.cardsInHand.forEach(function(c) {
    game.hand.div.append(c.div);
    c.render();
    c.div.append(game.handClickables(game.hand, c));
  })
}
game.hand.playCard = function(card) {
  let holder = [];
  game.cardsInHand.forEach(function(c) {
    if (! (c.rank == card.rank && c.suit == card.suit) ) {
      holder.push(c);
    }
  })
  game.cardsInHand = holder;
  game.hand.render();
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
game.cards = []
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
      let classes = 'card';
      if (card.facing_up) {
        inner = `<div class='rank'>${card.rank}</div><div class='suit'>${card.suit}</div>`;
      } else {
        classes += ' cardback'
        inner = `<div class='rank'>&nbsp;</div><div class='suit'>&nbsp;</div>`;
      }
      if (card.chosen) {
        classes += ' chosen'
      }
      card.div.className = classes;
      card.div.innerHTML = inner;
    }

    game.cards.push(card);
  })
})

game.start = function() {
  game.cards = game.shuffle(game.cards);
  game.board.innerHTML = "";
  game.deck = game.pile(game.cards, [0,0]);
  game.board.append(game.deck.div);
  game.board.parentNode.insertBefore(game.hand.div, game.board.nextSibling);
  game.hand.render();
  game.deck.render();
}

game.start();
