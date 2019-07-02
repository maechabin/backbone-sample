(function() {
  // Model
  var Staff = Backbone.Model.extend({
    defaults: {
      name: '',
      age: 0,
      updateTime: new Date(),
    },
    initialize: function() {
      console.log('Staff[' + this.cid + ']: ' + JSON.stringify(this));
    },
  });

  var tmpStaff = new Staff();
  tmpStaff.set({ name: 'Murata', age: 15, id: 101 });

  console.log('Staff[' + tmpStaff.cid + ']: ' + JSON.stringify(tmpStaff));

  tmpStaff.set({ name: 'Murata', age: 115, id: 101 });

  console.log('Staff[' + tmpStaff.cid + ']: ' + JSON.stringify(tmpStaff));

  var tmpStaff2 = new Staff({ name: 'Kenichiro', age: 35, id: 102 });

  // Collection
  var Staffs = Backbone.Collection.extend({
    model: Staff,
  });

  var staffs = new Staffs([tmpStaff, tmpStaff2]);

  console.log('staffs: ' + JSON.stringify(staffs));
  console.log('staffs.get(cid): ' + JSON.stringify(staffs.get('c1')));
  console.log('staffs.at(index): ' + JSON.stringify(staffs.at(1)));
  console.log('staffs.get(id): ' + JSON.stringify(staffs.get(102)));
})();
