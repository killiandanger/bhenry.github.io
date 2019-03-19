let game = {};
game.game = document.getElementById("game");
game.board = document.getElementById("board");
game.hand = document.getElementById("hand");

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
      containment: "div#game",
      stack: "#game .card",
      distance: 6,
      start: function(e, ui){
        console.log("start drag", c.identifier);
        $(c.div).off('mouseup');
        c.div.classList.remove("pile-13", "pile-26", "pile-39", "pile-52");
        p.cards.shift();
        p.render();
      },
      stop: function(e, ui){
        console.log("stop drag", c.identifier);
      }
    }).css({position: "absolute", top: p.location[0], left: p.location[1]});

    game.game.append(c.div);
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
}).resizable({handles: {s: '.resizer'}});

$(game.hand).droppable({
  drop: function(event,ui){
    let new_card = ui.draggable.data("c");
    new_card.cards_below = 0;
    console.log("dropping", new_card.identifier, "onto hand");
    let new_pile = game.pile([new_card],[new_card.div.style.top, new_card.div.style.left]);
    new_pile.render();
  }
}).resizable({handles: {s: '.resizer'}});

util.shuffle(util.deck);
game.deck = game.pile(util.deck, [0,0]);
//game.deck = game.pile(util.deck.slice(0,5), [40,40]);
game.deck.render();
