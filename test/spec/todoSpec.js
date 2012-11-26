
describe("ToDo Controller", function() {
	
	it("initiates properly.", function() {
		
		expect(todoCtrl.init()).toBe(true);
	});
	
	
	
	describe("Task adding", function() {
		it("success if is a string", function() {
			
			expect(todoCtrl.addTask('test')).toBe(true);
		});
		
		it("properly pushed to the model", function() {
			
			expect(todoCtrl.model.tasks.length).toBe(1);
		});
		
		it("properly manipulated the DOM", function() {
			
			expect(todoCtrl.$element.find('#tasks li').length).toBe(1);
		});
		
		it("throws an error if it is not a string", function() {
			var testFn = function () {  
				todoCtrl.addTask(null); 
			}  
			expect(testFn).toThrow(new Error('Task must be a string.')); 
		});
		
		it("fails if is an empty string", function() {
			
			expect(todoCtrl.addTask('')).toBe(false);
		});
	});
	
	describe("Task removal", function() {
		it("fails if string does not match a task", function() {
			expect(todoCtrl.removeTask('failure')).toBe(false);
		});
	
		it("successfully removes if is a string", function() {
			expect(todoCtrl.removeTask('test')).toBe(true);
		});
		
		it("properly manipulated the DOM", function() {
			
			expect(todoCtrl.$element.find('#tasks li').length).toBe(0);
		});
		
		it("successfully removes if is a jquery object", function() {
		
			expect(todoCtrl.addTask('another test')).toBe(true);
			var $holder = todoCtrl.$element.find('#tasks li').first();
			
			expect(todoCtrl.removeTask($holder)).toBe(true);
		});
		
		it("properly manipulated the DOM", function() {
			
			expect(todoCtrl.$element.find('#tasks li').length).toBe(0);
		});
		
		
		it("successfully removes all objects", function() {
		
			todoCtrl.addTask('yet another test');
			todoCtrl.addTask('just another test');
			expect(todoCtrl._removeAllTasks()).toBe(true);
		});
		
		it("properly manipulated the DOM", function() {
			
			expect(todoCtrl.$element.find('#tasks li').length).toBe(0);
		});
	});
	
	
	
	
	
	
	describe("JSON Handling", function() {
		
		it("converts to JSON", function() {
			todoCtrl._removeAllTasks();
			todoCtrl.addTask('test 1');
			todoCtrl.addTask('test 2');
			todoCtrl.addTask('test 3');
			todoCtrl.addTask('test 4');
			//todoCtrl.toJSON()
			expect(todoCtrl.toJSON()).toBe('["test 4","test 3","test 2","test 1"]');
		});
		
		it("refuses JSON that is not an array", function() {
			todoCtrl._removeAllTasks();
			
			var testFn = function () {  
				todoCtrl.updateTasks('{}');
			}  
			
			expect(testFn).toThrow( new Error('Update data must be either an array or JSON encoded array')); 
		});
		
		
		it("refuses improper array", function() {
			todoCtrl._removeAllTasks();
			
			var testFn = function () {  
				todoCtrl.updateTasks('[{"a":"b"},"test 3","test 2","test 1"]');
			}  
			
			expect(testFn).toThrow(new Error('All tasks must be a string')); 
		});
		
		
		it("parses JSON array", function() {
			todoCtrl._removeAllTasks();
			expect(todoCtrl.updateTasks('["test 5","test 6","test 7","test 8"]')).toBe(true);
		});
		
		it("handles an array", function() {
			todoCtrl._removeAllTasks();
			expect(todoCtrl.updateTasks(["test 9","test 10","test 11","test 12"])).toBe(true);
		});
		
		
		it("properly pushed to the model", function() {
			expect(todoCtrl.model.tasks.length).toBe(4);
		});
		
		it("properly manipulated the DOM", function() {
			expect(todoCtrl.$element.find('#tasks li').length).toBe(4);
		});
		
	});
	
	
	
	
	describe("Input", function() {
		it("adds when the add button is clicked", function() {
			todoCtrl._removeAllTasks();
			var $taskInput = todoCtrl.$element.find('#taskText');
			var $addButton = todoCtrl.$element.find('#addButton');
			$taskInput.val('test input');
			$addButton.trigger('click');
			expect(todoCtrl.model.tasks.length).toBe(1);
		});
		
		
	});
	
	
	
	
	
	

});
/*

describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});

*/



