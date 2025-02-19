Todos = SC.Application.create();

// SUGGESTION: Your tags can be stored in a similar way as how todos are stored
Todos.Todo = SC.Object.extend({
  title: null,
  isDone: false
});

Todos.Label = SC.Object.extend({
  title: null,
  isRelevant: false
});

Todos.labelsController = SC.ArrayProxy.create({
	content: [],
	recommendLabelsFor: function(todo){
		var label = Todos.Label.create({ title: "label 1" });
		this.pushObject(label);
	},
	clearLabels: function(){
		this.set('content', []);
	}
});

Todos.todosController = SC.ArrayProxy.create({
  content: [],

  createTodo: function(title) {
    var todo = Todos.Todo.create({ title: title });
    this.pushObject(todo);
  },

  clearCompletedTodos: function() {
    this.filterProperty('isDone', true).forEach(this.removeObject, this);
  },

  remaining: function() {
    return this.filterProperty('isDone', false).get('length');
  }.property('@each.isDone'),

  allAreDone: function(key, value) {
    if (value !== undefined) {
      this.setEach('isDone', value);

      return value;
    } else {
      return !!this.get('length') && this.everyProperty('isDone', true);
    }
  }.property('@each.isDone')
});

Todos.StatsView = SC.View.extend({
  remainingBinding: 'Todos.todosController.remaining',

  remainingString: function() {
    var remaining = this.get('remaining');
    return remaining + (remaining === 1 ? " item" : " items");
  }.property('remaining')
});

// SUGGESTION: Think about using SC.TextArea to get a bigger input field
Todos.CreateTodoView = SC.TextField.extend({
  insertNewline: function() {
    var value = this.get('value');

    if (value) {
      Todos.todosController.createTodo(value);
      this.set('value', '');
      Todos.labelsController.clearLabels();
    }
  },
  keyDown: function(evt) {
  	
  	var spaceKey = 32;
  	var value = this.get('value');
  
    if (evt.keyCode === spaceKey) {
    	Todos.labelsController.recommendLabelsFor(value);
    }
    
  }
  
});

