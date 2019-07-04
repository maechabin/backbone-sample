var app = {};

app.Todo = Backbone.Mode.extend({
  defaults: {
    title: '',
    completed: false,
  }
});
