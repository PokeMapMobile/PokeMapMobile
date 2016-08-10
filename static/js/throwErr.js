module.exports = function(err) {
  console.log(err.stack);
  alert(err.stack)
  throw err;
} 
