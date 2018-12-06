/*
Coded by Chen Yu-jie by the tutorials of 'The Complete JavaScript Course 2018: Build Real Projects!' course on Udemy
https://www.udemy.com/the-complete-javascript-course/
 */

/* note by Chen Yu-jie
-set up-
0. write down M-V-C using IIFE

-add item-
1. Controller: set the listener on things user will do (e.g. click, keypress...)
2. View: get data from input, then return data
3. Model: create object and prepare to store data, then return new item
4. Controller: pass the input data from View into Mudule, to create item and store data
5. View: get the new item data, then return the item prepared to show onto UI
6. Controller: pass the new item object and call the showItem function

-clear input field-
7. View: clear the input field after enter every item description and value
8. Controller: call the clear field function 

-calculate budget-
9. Model: create function to calculate total income and expense, then return the function to calculate budget and persentage, also return the result
10. Controller: call the calculate function, and get the result
11. View: return function to display budget, total income, total expense and persentage
12. Controller: pass the budget object and call the display budget function

-delete item-
13. Controller: set event listener on delete item
14. Model: return function to delete item
15. Controller: pass the id of delete item and call delete item function
16. View: return function to delete the item on UI
17. Controller: pass the div's id name and call unshown item function

-calculate persentage of each expense-
18. Model: create method using prototype of expense instructor
19. Controller: call the calculate function, and get the result
20. View: return function to display each persentage
21. Controller: pass the array and call the display persentage function

-formatting number-
22. View: create a formatting number function in private scope, and update the code in display related methods (e.g.showBudget, showItem)

-display date-
23. View: create function to display current month and year
24. Controller: call the display date function in init function

-change input field's border color-
25. View: create function to change the input field's border color to improver better UX
26. Controller: create 'change' event listener on input fields and enter button

 */



// DATA controller (Model)
var dataController = (function(){

	// create constuctor in order to build every expense or income item
	var Expense = function(id, des, val){
		this.id = id;
		this.des = des;
		this.val = val;
		this.persentage = -1;
	};

	Expense.prototype.calcPersentage = function(totalInc){
		// calculate the persentage: (expense / income) * 100
        if (totalInc > 0){
            this.persentage = Math.round((this.val / totalInc) * 100);
        } else {
            this.persentage = -1;
        } 
	};

	Expense.prototype.returnPersentage = function(){
		// just return the result of calcPersentage method
		return this.persentage;
	};

	var Income = function(id, des, val){
	    this.id = id;
		this.des = des;
		this.val = val;
	};

	// calculate total income and expense
	var calculateTotal = function(type){
		var sum = 0;
		data.allItems[type].forEach(function(current){
			sum += current.val;
		})
		data.total[type] = sum;
	}

	// create items storage
	var data = {
		allItems: {
			expense: [],
			income: []
		},

		total: {
			expense: 0,
			income: 0
		},

		budget: 0,
		
		persentage: -1
	};

	return {

		addItem: function(inputType, inputDes, inputVal){
			var newItem, itemId, itemArr;
			itemArr = data.allItems[inputType];
			
			// define new item's ID
			if (itemArr.length > 0) {
				itemId = itemArr[itemArr.length - 1].id + 1;
			} else {
				itemId = 0;
			}
			
            // create new item instance
			if (inputType === 'expense'){
				newItem = new Expense(itemId, inputDes, inputVal);
			} else if (inputType === 'income'){
				newItem = new Income(itemId, inputDes, inputVal);
			}

            // push the new item object into data storage
			itemArr.push(newItem);

			return newItem;

		},

		deleteItem: function(itemType, itemId){
			var idArr, idIdx;
			
			idArr = data.allItems[itemType].map(function(current){
				return current.id;
			})

			idIdx = idArr.indexOf(itemId);

			if (idIdx !== -1){
				data.allItems[itemType].splice(idIdx, 1);
			}
		},

		calculateBudget: function(){
			// calculate total income and expense
			calculateTotal('expense');
			calculateTotal('income');

			// calculate the budget: income - expense
			data.budget = data.total.income - data.total.expense;

			// calculate the persentage: (expense / income) * 100
            if (data.total.income > 0){
            	data.persentage = Math.round((data.total.expense / data.total.income) * 100);
            } else {
            	data.persentage = -1;
            } 
		},

		getBudget: function(){
			return {
				totalExp: data.total.expense,
				totalInc: data.total.income,
				budget: data.budget,
				persentage: data.persentage
			};
		},

		calculateEachPersentage: function(){
			data.allItems.expense.forEach(function(current){
				current.calcPersentage(data.total.income);
			});
		},

		getEachPersentage: function(){
			var eachPersentageArr = data.allItems.expense.map(function(current){
				return current.returnPersentage();
			}); 

			return eachPersentageArr;
		},

		test: function(){
			console.log(data);
		}

	}

})();


// UI controller (View)
var uiController = (function(){

	// use another way to call ID or CLASS name, to avoid error if changing names 
	var DOMname = {
        inputType: '.add__type',
		inputDes: '.add__description',
		inputVal: '.add__value',
		inputBtn: '.add__btn',
		expensesList: '.expenses__list',
		incomeList: '.income__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expenseLabel: '.budget__expenses--value',
		persentageLabel: '.budget__expenses--percentage',
		expPersentageLabel: '.item__percentage',
		itemContainer: '.container',
		dateLabel: '.budget__title--month'
	};

	var formatNumber = function(num, type){
		var numSplit, integer, decimal;

		// todo:
		// 1. '+' or '-' before number
		// 2. two decimal points
		// 3. add comma seperating thounsands
		// e.g. 12345 -> 12,345.00
		
		num = Math.abs(num).toFixed(2);// toFixed() return a string
		numSplit = num.split('.');

		integer = numSplit[0];
		if (integer.length > 3){
			integer = integer.substr(0, integer.length - 3) + ',' + integer.substr(integer.length - 3, 3);
		}
		
		decimal = numSplit[1];

		return (type === 'expense' ? '-' : '+') + ' ' + integer + '.' + decimal;
		
	};

	// create a function as same as forEach method for node list
	var nodeListForEach = function(nodelist, callback){
		for (i = 0; i < nodelist.length; i++){
			callback(nodelist[i], i); // function(current, index)
		}
	};

	return {

		getInput: function(){
			// use object to define and return several variables
			return {
				type: document.querySelector(DOMname.inputType).value, // 'income' or 'expense'
				description: document.querySelector(DOMname.inputDes).value,
				value: parseFloat(document.querySelector(DOMname.inputVal).value),
				// The parseFloat() function parses an argument and returns a floating point number. It can convert string to number.
			};
		}, 

		showItem: function(itemObj, itemType){
			var element, html, newHtml;

			// create html string
			if (itemType === 'expense'){
				element = DOMname.expensesList;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (itemType === 'income'){
				element = DOMname.incomeList;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// replace the placeholder text with real input data
			   newHtml = html.replace('%id%', itemObj.id);
			   newHtml = newHtml.replace('%description%', itemObj.des);
			   newHtml = newHtml.replace('%value%', formatNumber(itemObj.val, itemType));

			// insert the HTML into the DOM
			   document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
			
		},

		unShownItem: function(itemIdName){
			var elementNode;

			elementNode = document.getElementById(itemIdName);
			elementNode.parentNode.removeChild(elementNode);

		},

		showBudget: function(dataObj){
			var type;
			
			document.querySelector(DOMname.expenseLabel).textContent = formatNumber(dataObj.totalExp, 'expense');
			document.querySelector(DOMname.incomeLabel).textContent = formatNumber(dataObj.totalInc, 'income');
			
			dataObj.budget < 0 ? type = 'expense' : type = 'income';
            document.querySelector(DOMname.budgetLabel).textContent = formatNumber(dataObj.budget, type);
			
			if(dataObj.persentage > 0){
				document.querySelector(DOMname.persentageLabel).textContent = dataObj.persentage + '%';
			} else {
				document.querySelector(DOMname.persentageLabel).textContent = '---';
			}			
		},

		showEachPersentage: function(dataArr){
			var expenseField;

			// querySelectorAll return NodeList
			expenseField = document.querySelectorAll(DOMname.expPersentageLabel);

			// use the function as same as forEach method for node list and do loop, to show persentage
			nodeListForEach(expenseField, function(current, index){
				if(dataArr[index] > 0) {
				    current.textContent = dataArr[index] + '%';
			    } else {
			    	current.textContent = '---';
			    }
			});
		},

		showDate: function(){
			var now, months, month, year;

			now = new Date();

			months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
			];

			month = now.getMonth();
			year = now.getFullYear();

			document.querySelector(DOMname.dateLabel).textContent = months[month] + ' ' + year;

		},

		clearField: function(){
			var inputField, inputFieldArr;

			// querySelectorAll return NodeList
			inputField = document.querySelectorAll(DOMname.inputDes + ', ' + DOMname.inputVal);

			// convert the NodeList to Array
			inputFieldArr = Array.prototype.slice.call(inputField);

			// loop inputFieldArr and clear the input on UI
			inputFieldArr.forEach(function(current, index, arr){
				current.value = ''; // the 'value' here means the input content 
			});

			// let the cursor focus on description field again after enter the input
			inputField[0].focus();
		},

		changeFieldBorder: function(){
			var inputField;

			// querySelectorAll return NodeList
			inputField = document.querySelectorAll(DOMname.inputType + ', ' + DOMname.inputDes + ', ' + DOMname.inputVal);

			// use the function as same as forEach method for node list and do loop, to change the border color
			nodeListForEach(inputField, function(current, index){
				current.classList.toggle('red-focus');
			});

			// change the buttoncolor
			document.querySelector(DOMname.inputBtn).classList.toggle('red');

		},

		getDOMname: function(){
			return DOMname;
		}

	};

})();

 
// global APP controller (Controller): connect dataController and uiController
var appController = (function(dataCtrl, uiCtrl){

    var setEventListener = function(){

    	// get DOMname from uiController
	    var DOM = uiCtrl.getDOMname();

	    // event: the click and keypress event after user enter somethings
	    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
	    
	    document.addEventListener('keypress', function(event){
		  if (event.keyCode === 13 || event.which === 13){
			ctrlAddItem();
		  }
	    });

	    // event: delete item
	    document.querySelector(DOM.itemContainer).addEventListener('click', ctrlDeleteItem);

	    // event: if user select different input type then change the border and button color
	    document.querySelector(DOM.inputType).addEventListener('change', uiCtrl.changeFieldBorder);
    };
	
	// update budget and display on the UI
	var updateBudget = function(){
		var currentBudget;

		// 1. calculate the budget
		dataCtrl.calculateBudget();

		// 2. get the budget
		currentBudget = dataCtrl.getBudget();

		// 3. display the caculation result on the UI
		uiCtrl.showBudget(currentBudget);
	};
	
	// update the persentage of each expense and display on the UI
	var updateEachPersentage = function(){
		var eachPersentage;

		// 1. calculate the persentage of each expense
		dataCtrl.calculateEachPersentage();

		// 2. get the persentage
		eachPersentage = dataCtrl.getEachPersentage();

		// 3. display the caculation result on the UI
		uiCtrl.showEachPersentage(eachPersentage);
	};


	// get input and display on the UI
	var ctrlAddItem = function(){
		var input, item;

		// 1. get the input data from uiController
		   input = uiCtrl.getInput();
		
		if (input.description !== '' && !isNaN(input.value) && input.value > 0){
		// 2. store the input data to a new item in dataController
		   item = dataCtrl.addItem(input.type, input.description, input.value);
		
		// 3. show the input data to the UI
		   uiCtrl.showItem(item, input.type);
		
		// 4. clear the input fields
		   uiCtrl.clearField();
		
		// 5. calculate the data and display the result on the UI (total and each)
		   updateBudget();
		   updateEachPersentage();
		}
		
	};

	// delete item and update the UI
	var ctrlDeleteItem = function(event){
		var idName, splitIdName, type, id;

		// find which event that is on fire
		idName = event.target.parentNode.parentNode.parentNode.parentNode.id;

		//  each item should have id
		if (idName){
			splitIdName = idName.split('-');
			type = splitIdName[0];
			id = parseInt(splitIdName[1]);

			// 1. delete the data in dataController
			dataCtrl.deleteItem(type, id);

			// 2. delete the item on UI
			uiCtrl.unShownItem(idName);
			
			// 3. update the caculation and display the result on the UI (total and each)
			updateBudget();
			updateEachPersentage();
		}

	};

	return {
		init: function (){
			uiCtrl.showDate();
			uiCtrl.showBudget({
				totalExp: 0,
				totalInc: 0,
				budget: 0,
				persentage: -1
			});
			setEventListener();
		}
	}


})(dataController, uiController);


// call init function at begining
appController.init();