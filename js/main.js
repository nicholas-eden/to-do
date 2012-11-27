//todoCtrl.updateTasks('["frew","rewjkl","sthuf","1","test"]');
//todoCtrl.updateTasks('["go to the gym", "buy groceries"]')
//todoCtrl.toJSON();


var todoCtrl = {};

/******************************
* Initialization
*******************************/

todoCtrl.isReady = false;

todoCtrl.init = function() {
	//store a pointer to the element for future use
	this.$element = $('#todo');
	this.$list = this.$element.find('#tasks');
	//console.log(this.$element);
	if (this.$element.length) {
		this.isReady = true;
		this._addListeners();
		return true;
	} else {
		throw new Error('#tasks element not found');
	}
	
}

todoCtrl.ready = function() {
	//called in all public functions
	//stops execution if controller isn't ready
	if (!this.isReady) {
		throw new Error('todoCtrl not ready');
	}
}







//keep all data in model namespace
todoCtrl.model = {};
todoCtrl.model.tasks = [];

/******************************
* Task Adding
*******************************/

todoCtrl.addTask = function(task) {
	this.ready();
	if (typeof task !== 'string') {
		throw new Error('Task must be a string.');
	} else if (task === '') {
		return false;
	}
	return !!this.model.tasks.push({
		label: task, 
		link: this._addHtmlLi(task)
	});
};

todoCtrl._addHtmlLi = function(task) {
	if (typeof task !== 'string') {
		throw new Error('Task must be a string.');
	}
	//create the li element, saving the pointer
	var $item = $('<li><input type="checkbox" /> <span></span></li>');
	$item.find('span').text(task);
	//append the item to the element
	this.$list.append($item);
	//add listener to the checkbox;
	this._addFinishedListener($item);
	//return the pointer
	return $item;
};

todoCtrl._addFinishedListener = function($item) {
	//binds to the checkbox
	$item.find('input').bind('change', this._changeHandler);
}

todoCtrl._changeHandler = function(e) {
	//get the list element, dont need the checkbox element
	var $parent = $(this).parent();
	$parent.slideUp(function(){
		//calls the removeTask function at the end of the animation
		//$(this) refers to the animated element
		todoCtrl.removeTask($(this));
	});
}


/******************************
* Task Removal
*******************************/

todoCtrl.removeTask = function(task) {
	this.ready();
	//localize the tasks
	var tasks = this.model.tasks;
	var i = tasks.length;
	var current;
	var toRemove;
	if (typeof task === 'string') {
		for (;i--;) {
			current = tasks[i];
			if (current.label === task) {
				toRemove = current;
				break;
			}
		}
	} else if (typeof task === 'object' && task instanceof jQuery) {
		for (;i--;) {
			current = tasks[i];
			if ( current.link.is(task) ) {
				toRemove = current;
				break;
			}
		}
	} else {
		throw new Error('Task must be a string or jQuery object');
	}
	
	if (typeof toRemove === 'undefined') {
		//task not found
		return false;
	}
	
	//remove from html
	toRemove.link.unbind();
	toRemove.link.remove();
	//remove from array
	tasks.splice(i,1);
	
	return true;
}

todoCtrl._removeAllTasks = function() {
	//localize the tasks
	var tasks = this.model.tasks;
	var i = tasks.length;
	var current;
	
	for (;i--;) {
		current = tasks[i];
		current.link.remove();
	}
	
	tasks.length = 0;
	
	return true;
}

/******************************
* JSON handling
*******************************/

todoCtrl.toJSON = function() {
	this.ready();
	//localize the model
	var tasks = this.model.tasks;
	var i = tasks.length;
	//plain array to be created, without the links
	var parsed = [];
	for (;i--;) {
		parsed.push(tasks[i].label);
	}
	console.log(parsed);
	return JSON.stringify(parsed);
}

todoCtrl.updateTasks = function(newData) {
	this.ready();
	var newTasks;
	if (typeof newData === 'string') {
		var strParsed = JSON.parse(newData);
		if (strParsed instanceof Array) {
			newTasks = this._parseArray(strParsed);
		} else {
			throw new Error('Update data must be either an array or JSON encoded array');
		}
	} else if (newData instanceof Array) {
		newTasks = this._parseArray(newData);
	} else {
		throw new Error('Update data must be either an array or JSON encoded array');
	}
	//data is good...
	//remove old data
	this._removeAllTasks();
	
	var i = newTasks.length;
	for (;i--;) {
		this.addTask(newTasks[i]);
	}
	
	return true;
}

todoCtrl._parseArray = function(toParse) {
	var toReturn = []
	//check array formatting
	//must be single level array of strings
	var i = toParse.length;
	var current;
	for (;i--;) {
		current = toParse[i];
		if (typeof current !== 'string') {
			throw new Error('All tasks must be a string');
		}
		toReturn.push(current);
	}
	return toReturn;
}



/******************************
* Input handling
*******************************/

todoCtrl._addListeners = function () {
	var $taskInput = this.$element.find('#taskText');
	var $addButton = this.$element.find('#addButton');
	
	$taskInput.keyup(function(e){
		if(e.keyCode == 13){
			//enter was pressed
			todoCtrl._taskSubmit.call(todoCtrl);
		}
	});
	//button was clicked
	$addButton.click(function() {
		todoCtrl._taskSubmit.call(todoCtrl);
	});
	
}

todoCtrl._taskSubmit = function() {
	var $taskInput = this.$element.find('#taskText');
	
	var text = $.trim($taskInput.val());
	if (text !== '') {
		this.addTask(text);
	}
	$taskInput.val('');
}







