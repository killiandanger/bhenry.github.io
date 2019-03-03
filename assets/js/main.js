let game = {};

game.board = document.getElementById('game');
game.cardsInHand = [];
game.piles = [];

game.render = function() {
  game.piles.forEach(function(p){
    p.render();
  });
  game.hand.render();
}

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
    game.render();
  }
  return icon;
}

game.dropCard = function(p) {
  let icon = game.clickable('fas fa-bullseye');
  icon.title = 'Place card here';
  icon.onclick = function() {
    game.hand.playCard(p);
  }
  return icon;
}

// game.startPile = function(c) {
//   return function(e) {
//     let p = game.pile([c], [e.clientX, e.clientY]);
//     game.selectedCard = null;
//     game.render();
//   }
// }

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
    game.selectedCard = c;
    game.render();
    //game.board.onclick = game.startPile(c);
    //click handler on board to start a pile
    //click handler on other cards in hand
  }
  return icon;
}

game.cancelCardSelection = function(h, c) {
  let icon = game.clickable('fas fa-undo');
  icon.title = 'Cancel playing this card';
  icon.onclick = function() {
    c.chosen = false;
    game.selectedCard = null;
    game.render();
  }
  return icon;
}

game.flipPile = function(p) {
  let icon = game.clickable('fas fa-sync');
  icon.title = 'Flip this card';
  icon.onclick = function() {
    let c = p.cards[0];
    c.facing_up = !c.facing_up;
    game.render();
  }
  return icon;
}

game.flipCard = function(h, c) {
  let icon = game.clickable('fas fa-sync');
  icon.title = 'Flip this card';
  icon.onclick = function() {
    c.facing_up = !c.facing_up;
    game.render();
  }
  return icon;
}

game.pile = function(cs, coords) {
  let p = {};
  p.cards = cs;
  p.location = coords;
  p.div = document.createElement('div');
  p.div.className = 'pile';
  p.render = function() {
    p.div.innerHTML = "";
    p.div.style.top = `${p.location[0]}px`;
    p.div.style.left = `${p.location[1]}px`;
    if (p.cards.length > 0) {
      let c = p.cards[0];
      c.render();
      c.div.append(game.deckClickables(p))
      p.div.append(c.div);
    }
  }
  let rect = game.board.getBoundingClientRect();
  $(p.div).draggable({
    containment: [rect.left, rect.top, rect.right - 70, rect.bottom - 100],
    cancel: "div.clickables",
    stop: function(e, ui) {
      p.location = [ui.position.top, ui.position.left];
    }
  });
  game.piles.push(p);
  return p;
}

game.handClickables = function(h, c) {
  let cancel = game.cancelCardSelection(h, c);
  let select = game.selectCard(h, c);
  let flip = game.flipCard(h, c);
  let d = document.createElement('div');
  d.className = 'clickables';
  if (c.chosen) {
    d.append(cancel);
  } else {
    d.append(select);
  }
  d.append(flip);
  return d;
}

game.deckClickables = function(p) {
  let drop = game.dropCard(p);
  let draw = game.takeCard(p);
  let flip = game.flipPile(p);
  let d = document.createElement('div');
  d.className = 'clickables';
  if (game.selectedCard) {
    d.append(drop);
  } else {
    d.append(draw);
  }
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
  });
}
$( game.hand.div ).sortable({
  update: function( event, ui ) {
    let temp = [];
    let children = game.hand.div.children;
    for (i = 0; i < children.length; i++) {
      let cardId = children[i].getAttribute('data-card');
      temp.push(cardId);
    }
    game.cardsInHand.sort(function(a,b){
      return (temp.indexOf(a.id) < temp.indexOf(b.id)) ? -1 : 1;
    });
  }
});
$( game.hand.div ).disableSelection();
game.hand.playCard = function(pile) {
  let holder = [];
  game.cardsInHand.forEach(function(c) {
    if ( !c.chosen ) {
      holder.push(c);
    } else {
      c.chosen = false;
      pile.cards.unshift(c);
    }
  });
  game.selectedCard = null;
  game.cardsInHand = holder;
  game.render();
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
game.ranks.forEach(function(r, ri) {
  game.suits.forEach(function(s, si) {
    let card = {};
    card.rank = r;
    card.suit = s;
    card.id = `${ri}-${si}`;
    card.facing_up = false;
    card.div = document.createElement('div');
    card.div.setAttribute('data-card', card.id);
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
  });
});

game.start = function() {
  game.cards = game.shuffle(game.cards);
  game.board.innerHTML = "";
  game.deck = game.pile(game.cards, [100,100]);
  game.board.append(game.deck.div);
  game.board.parentNode.insertBefore(game.hand.div, game.board.nextSibling);
  game.render();
}

game.start();
