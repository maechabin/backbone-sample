(function() {
  const Who = Backbone.Model.extend({
    parse(response) {
      console.log(response);
    },
    initialize() {
      // this.listenTo(this, 'sync', d => console.log(d), this);
    },
    defaults: {
      who: 'world',
    },
    url: 'http://localhost:3000/posts',
    save(key, val, options) {
      console.log(this);
      return Backbone.Model.prototype.save.apply(this, arguments);
    },
  });

  const Bar = Backbone.View.extend({
    initialize() {
      console.log('sync');
      this.listenTo(this.model, 'sync', d => console.log(d), this);
    },
  });

  // View
  const AppView = Backbone.View.extend({
    // el - stands for element. Every view has a element associate in with HTML
    //      content will be rendered.
    el: '#container',

    events: {
      click: 'handleClick',
    },

    // template which has the placeholder 'who' to be substitute later
    template: _.template('<h3>Hello <%= who %></h3>'),

    // It's the first function called when this view it's instantiated.
    initialize: function() {
      this.bar = new Bar({ model: who });
      this.render();
      this.model.fetch({ url: 'http://localhost:3000/profile' });
    },
    // $el - it's a cached jQuery object (el), in which you can use jQuery functions
    //       to push content. Like the Hello World in this case.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    },

    handleClick() {
      console.log('click');
      this.model.trigger('sync', this.model, { who: 'bar' });
      // this.model.save(null, {
      //   success(model, resp, options) {
      //     console.log(arguments);
      //   },
      //   error(model, resp, options) {
      //     console.log(arguments);
      //   },
      // });
    },
  });

  const who = new Who();
  const appView = new AppView({ model: who });
})();
