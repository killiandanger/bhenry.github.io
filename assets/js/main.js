let game = {};

game.board = document.getElementById('board');
game.hand = document.getElementById('hand');

game.suits = ["<span class='red'>♥</span>", '♣', "<span class='red'>♦</span>", '♠'];
game.ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

game.pile = function(cards, coords) {
  let p = {};
  p.cards = cards;
  p.location = coords;
  p.render = function() {
    let c = p.cards[0];
    c.div.style.top = `${p.location[0]}px`;
    c.div.style.left = `${p.location[1]}px`;
    c.render();
    if (p.cards.length > 1){
      c.div.classList.add("pile");
    }
    game.board.append(c.div);
  }
  return p;
};

game.cards = []
game.suits.forEach(function(s, si) {
  game.ranks.forEach(function(r, ri) {
    let card = {};
    card.rank = r;
    card.suit = s;
    card.identifier = `${ri}-${si}`;
    card.facing_up = Math.random() < 0.5;
    card.div = document.createElement('div');
    card.div.setAttribute('data-card', card.identifier);
    card.render = function() {
      card.div.innerHTML = '';
      let inner = '';
      let classes = 'card';
      if (card.facing_up) {
        inner = `<div class='rank'>${card.rank}</div><div class='suit'>${card.suit}</div>`;
      } else {
        classes += ' cardback';
        inner = `<div class='rank'>&nbsp;</div><div class='suit'>&nbsp;</div>`;
      }

      card.div.className = classes;
      card.div.innerHTML = inner;
    }

    game.cards.unshift(card);
  });
});

util.shuffle(game.cards);
game.deck = game.pile(game.cards, [100,100]);
game.deck.render();

