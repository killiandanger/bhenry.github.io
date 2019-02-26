let game = {};

game.suits = ['H', 'C', 'D', 'S']
game.ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
game.deck = []
game.ranks.forEach(function(r){
  game.suits.forEach(function(s){
    let card = {};
    card.rank = r;
    card.suit = s;
    game.deck.push(card);
  })
})

game.start = function(){
  game.deck = game.shuffle(game.deck);
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

game.start();
