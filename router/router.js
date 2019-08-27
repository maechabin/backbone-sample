(function() {
  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      foo: 'foo',
      bar: 'bar',
      'blog(/:id)': 'blog',
    },
    index() {
      console.log('index');
    },
    foo() {
      console.log('foo');
    },
    bar(args) {
      console.log(args);
      console.log('bar');
    },
    blog(id) {
      console.log(id);
    },
  });

  var router = new Router();

  Backbone.history.start();
})();
