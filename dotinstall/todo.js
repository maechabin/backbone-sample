(function () {
  // Model
  var Task = Backbone.Model.extend({
    defaults: {
      title: 'do somthing',
      completed: false,
    },
    validate: function(attrs) {
      if (_.isEmpty(attrs.title)) {
        return 'title must not be empty';
      }
    },
    initialize: function () {
      this.on('invalid', function (model, error) {
        $('#error').html(error);
      })
    }
  });

  // Collection
  var Tasks = Backbone.Collection.extend({ model: Task });

  // view
  var TaskView = Backbone.View.extend({
    tagName: 'li',
    initialize: function () {
      this.model.on('destroy', this.remove, this);
      this.model.on('change', this.render, this);
    },
    events: {
      'click .delete': 'destroy',
      'click .toggle': 'toggle',
    },
    destroy: function () {
      if (confirm('are you sure?')) {
        this.model.destroy();
      }
    },
    toggle: function () {
      this.model.set('completed', !this.model.get('completed'))
    },
    alert() {
      alert('chenge!!!!');
    },
    remove: function () {
      this.$el.remove();
    },
    template: _.template($('#task-template').html()),
    render: function () {
      console.log('render');
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  var TasksView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function () {
      this.collection.on('add', this.addNew, this);
      this.collection.on('change', this.updateCount, this);
      this.collection.on('destroy', this.updateCount, this);
    },
    addNew: function (task) {
      var taskView = new TaskView({ model: task });
      this.$el.append(taskView.render().el);
      $('#title').val('').focus();
      this.updateCount();
    },
    updateCount: function () {
      var uncompletedTasks = this.collection.filter(function (task) {
        return !task.get('completed');
      });
      $('#count').html(uncompletedTasks.length);
    },
    render: function () {
      this.collection.each(function (task) {
        var taskView = new TaskView({ model: task });
        this.$el.append(taskView.render().el);
      }, this);
      this.updateCount();
      return this;
    }
  });

  var AddTaskView = Backbone.View.extend({
    el: '#addTask',
    events: {
      'submit': 'submit',
    },
    submit: function (e) {
      e.preventDefault();
      // var task = new Task({ title: $('#title').val() });
      var task = new Task();
      if (task.set({ title: $('#title').val() }, { validate: true })) {
        this.collection.add(task);
        $('#error').empty();
      }
    }
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
    },
  ]);

  var addTaskView = new AddTaskView({ collection: tasks });
  var tasksView = new TasksView({ collection: tasks });
  $('#tasks').html(tasksView.render().el);
})();