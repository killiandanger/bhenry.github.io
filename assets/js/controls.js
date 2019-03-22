$(function(){
  let reset = $("#resetdeck");
  reset.click(function(){
    Object.values(game.piles).map(function(p){
      p.cards.map(function(c){
        $(c.div).remove();
      });
    });
    game.piles = {};
    game.reset();
  });
});

