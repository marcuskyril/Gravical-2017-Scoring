var names = ['kyril', 'marcus', 'jia hui'];

// names.forEach((name) => console.log(name));
//
// var returnMe = (name) => name + '!';
//
// console.log(returnMe('Marcus'));

var person = {
  name: 'Kyril',
  greet: function() {
      names.forEach((name) => {
        console.log(this.name + ' says hi to ' +name);
      });
  }
};

person.greet();

var addStatement = (a, b) => {
  return a + b;
};

var addExpression = (a, b) => a + b;
