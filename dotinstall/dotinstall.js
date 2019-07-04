(function () {
  // Model
  var Task = Backbone.Model.extend({
    defaults: {
      title: 'do something!',
      completed: false,
    },
  });

  var task = new Task();


  // View (DOM要素を作るもの)
  var TaskView = Backbone.View.extend({
    tagName: 'li',
    // className: 'liClass',
    // id: 'liId',
    events: {
      'click .command': 'sayHello',
    },
    sayHello: function () {
        alert('hello!!');
    },
    template: _.template($('#task-temp').html()),
    render: function () {
      var template = this.template(this.model.toJSON());
      this.$el.html(template);
      return this;
    }
  });
  var taskView = new TaskView({ model: task });
  console.log(taskView.render().el);
  
  $('body').append(taskView.render().el);


  // Collection
  var Tasks = Backbone.Collection.extend({
      model: Task,
  })
  var tasks = new Tasks([
    {
      title: 'task1',
      completed: true,    
    },
    {
      title: 'task2',
    },
    {
      title: 'task3',
    }
  ]);

  var TasksView = Backbone.View.extend({
    tagName: 'ul',
    render: function () {
    this.collection.each(function (task) {
      var taskView = new TaskView({ model: task });
      this.$el.append(taskView.render().$el);
    }, this);
    return this;
    }
  });

  var tasksView = new TasksView({ collection: tasks });
  $('#tasks1').html(tasksView.render().el);
})();