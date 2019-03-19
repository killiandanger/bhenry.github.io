let store = {};

store.get = function(k){
  return localStorage.getItem(k);
};

store.put = function(k, v){
  localStorage.setItem(k, v);
};

