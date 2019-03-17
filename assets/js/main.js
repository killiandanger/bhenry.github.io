let game = {};

game.board = document.getElementById("board");
game.hand = document.getElementById("hand");

game.suits = ["<span class='red'>♥</span>", '♣', "<span class='red'>♦</span>", '♠'];
game.ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

game.pile = function(cards, coords){
  let p = {};
  p.cards = cards;
  p.location = coords;
  p.render = function(){
    let c = p.cards[0];
    if (!c){
      return;
    }
    c.cards_below = p.cards.length - 1;
    c.div.style.top = `${p.location[0]}px`;
    c.div.style.left = `${p.location[1]}px`;
    c.render();
    $(c.div).droppable({
      greedy: true,
      drop: function(event, ui){
        let new_card = ui.draggable.data("c");
        new_card.cards_below = p.cards.length;
        console.log("dropping", new_card.identifier, "onto", c.identifier);
        p.cards.unshift(new_card);
        $(c.div).droppable('disable');
        p.render();
      }
    }).droppable('enable');
    $(c.div).draggable({
      containment: "div#board",
      stack: "#board .card",
      distance: 6,
      start: function(e, ui){
        console.log("start drag", c.identifier);
        $(c.div).off('mouseup');
        c.div.classList.remove("pile-0", "pile-13", "pile-26", "pile-39", "pile-52");
        p.cards.shift();
        p.render();
      },
      stop: function(e, ui){
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
    console.log("dropping", new_card.identifier, "onto board");
    let new_pile = game.pile([new_card],[new_card.div.style.top, new_card.div.style.left]);
    new_pile.render();
  }
});

game.cards = []
game.suits.forEach(function(s, si){
  game.ranks.forEach(function(r, ri){
    card = util.make_card(s, si, r, ri);
    game.cards.unshift(card);
  });
});

// game.deck = game.pile(game.cards.slice(0,5), [40,40]);
util.shuffle(game.cards);
game.deck = game.pile(game.cards, [40,40]);
game.deck.render();
