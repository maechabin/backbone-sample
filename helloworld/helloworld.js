(function() {
  const Who = Backbone.Model.extend({
    defaults: {
      who: 'world',
    },
    url: '../',
    save(key, val, options) {
      console.log(this);
      return Backbone.Model.prototype.save.apply(this, arguments);
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
      this.render();
      this.model.save(null, {
        success(model, resp, options) {
          console.log(arguments);
        },
        error(model, resp, options) {
          console.log(arguments);
        },
      });
    },
    // $el - it's a cached jQuery object (el), in which you can use jQuery functions
    //       to push content. Like the Hello World in this case.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    },

    handleClick() {
      alert('click');
    },
  });

  const who = new Who();
  const appView = new AppView({ model: who });
})();
