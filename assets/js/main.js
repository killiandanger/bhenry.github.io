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
    c.div.style.top = `${p.location[0]}px`;
    c.div.style.left = `${p.location[1]}px`;
    c.render();
    if (p.cards.length > 1){
      c.div.classList.add("pile");
    } else {
      c.div.classList.remove("pile");
    }
    $(c.div).droppable({
      greedy: true,
      drop: function( event, ui ) {
        let new_card = ui.draggable.data("c");
        console.log("dropping ", new_card.identifier, " onto ", c.identifier);
        p.cards.unshift(new_card);
        $(c.div).droppable('disable');
        p.render();
      }
    }).droppable('enable');
    $(c.div).draggable({
      containment: "div#board",
      stack: "#board .card",
      start: function(e, ui) {
        console.log("start drag", c.identifier);
        c.div.classList.remove("pile");
        p.cards.shift();
        p.render();
      },
      stop: function(e, ui) {
        console.log("stop drag", c.identifier);
      }
    }).css({position: "absolute", top: p.location[0], left: p.location[1]});
    game.board.append(p.cards[0].div);
  }
  return p;
};

$(game.board).droppable({
  drop: function(event,ui){
    let new_card = ui.draggable.data("c");
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
    card.render = function() {
      card.div.innerHTML = "";
      let inner = "";
      let classes = "card";
      if (card.facing_up) {
        inner = `<div class='rank'>${card.rank}</div><div class='suit'>${card.suit}</div>`;
      } else {
        classes += " cardback";
        inner = `<div class='rank'>&nbsp;</div><div class='suit'>&nbsp;</div>`;
      }

      card.div.className = classes;
      card.div.innerHTML = inner;
    }

    game.cards.unshift(card);
  });
});

// game.deck = game.pile(game.cards.slice(0,5), [40,40]);
util.shuffle(game.cards);
game.deck = game.pile(game.cards, [40,40]);
game.deck.render();

