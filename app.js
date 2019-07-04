(function() {
  var app = {};

  app.Todo = Backbone.Model.extend({
    defaults: {
      title: '',
      completed: false,
    },
  });

  var todo = new app.Todo({ title: 'Learn Backbone.js', completed: false });

  todo.get('title');
  console.log(todo.get('title'));
  todo.get('completed');
  console.log(todo.get('completed'));
  todo.get('created_at');
  console.log(todo.get('created_at'));
  todo.set('created_at', Date());
  todo.get('created_at');
  console.log(todo.get('created_at'));
})();
