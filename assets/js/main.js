let game = {};

game.board = document.getElementById("board");
game.hand = document.getElementById("hand");

game.suits = ["<span class='red'>♥</span>", '♣', "<span class='red'>♦</span>", '♠'];
game.ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

game.pile = function(cards, coords) {
  let p = {};
  p.cards = cards;
  p.location = coords;
  p.render = function() {
    let c = p.cards[0];
    if (!c){
      return;
    }
    c.cards_below = p.cards.length - 1;
    console.log(p.cards.length);
    c.div.style.top = `${p.location[0]}px`;
    c.div.style.left = `${p.location[1]}px`;
    c.render();
    console.log("binding stff");
    $(c.div).droppable({
      greedy: true,
      drop: function( event, ui ) {
        let new_card = ui.draggable.data("c");
        new_card.cards_below = p.cards.length;
        console.log("dropping ", new_card.identifier, " onto ", c.identifier);
        p.cards.unshift(new_card);
        $(c.div).droppable('disable');
        p.render();
      }
    }).droppable('enable');
    $(c.div).draggable({
      containment: "div#board",
      stack: "#board .card",
      distance: 4,
      start: function(e, ui) {
        console.log("start drag", c.identifier);
        c.div.classList.remove("pile-0", "pile-13", "pile-26", "pile-39", "pile-52");
        p.cards.shift();
        p.render();
      },
      stop: function(e, ui) {
        console.log("stop drag", c.identifier);
      }
    }).css({position: "absolute", top: p.location[0], left: p.location[1]});
    game.board.append(c.div);
  }
  return p;
};

$(game.board).droppable({
  drop: function(event,ui){
    let new_card = ui.draggable.data("c");
    new_card.cards_below = 0;
    console.log("dropping ", new_card.identifier, " onto board");
    let new_pile = game.pile([new_card],[new_card.div.style.top, new_card.div.style.left]);
    new_pile.render();
  }
});

game.cards = []
game.suits.forEach(function(s, si) {
  game.ranks.forEach(function(r, ri) {
    let card = {};
    card.identifier = `${ri}-${si}`;
    card.rank = r;
    card.suit = s;
    card.facing_up = Math.random() < 0.5;
    card.div = document.createElement("div");
    $(card.div).data("c", card);
    $(card.div).click(function(e){
      e.preventDefault();
      card.facing_up = !card.facing_up;
      card.render();
    });
    card.render = function() {
      if (card.cards_below < 1){
        card.div.className = "pile-0";
      } else if(card.cards_below < 13) {
        card.div.className = "pile-13";
      } else if(card.cards_below < 26) {
        card.div.className = "pile-26";
      } else if(card.cards_below < 39) {
        card.div.className = "pile-39";
      } else {
        card.div.className = "pile-52";
      }
      let inner = "";
      if (card.facing_up) {
        card.div.classList.remove('cardback');
        inner = `<div class='rank'>${card.rank}</div><div class='suit'>${card.suit}</div>`;
      } else {
        card.div.classList.add('cardback');
        inner = `<div class='rank'>&nbsp;</div><div class='suit'>&nbsp;</div>`;
      }
      card.div.innerHTML = inner;
      card.div.classList.add('card');
    }

    game.cards.unshift(card);
  });
});

// game.deck = game.pile(game.cards.slice(0,5), [40,40]);
util.shuffle(game.cards);
game.deck = game.pile(game.cards, [40,40]);
game.deck.render();

