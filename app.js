// UI Controllor
let UIController = (function() {

    let DOM = {     // Name HTML strings
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        itemID: '',
        itemDescription: '.item__description',
        itemValue: '.item__value',
        incomeContainer: '.income__list',
        expenceContainer: '.expenses__list',
        budgetValue: '.budget__value',
        incomeValue: '.budget__income--value',
        expenceValue: '.budget__expenses--value',
        expencePercentage: '.budget__expenses--percentage',
        containerClearfix: '.container',
        expencePercentLabel: '.item__percentage'
    }

    let ctrlAddItemToUI = function(type, obj) {
        let html, newHTML;
        if (type === 'inc') {       // add html template to html file, then replace with data.
            html = '<div class="item clearfix" id="inc-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            newHTML = html.replace('%ID%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);
            document.querySelector(DOM.incomeContainer).insertAdjacentHTML('beforeend', newHTML);

        } else if (type === 'exp') {
            html = '<div class="item clearfix" id="exp-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            newHTML = html.replace('%ID%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);
            newHTML = newHTML.replace('%percentage%', obj.percent);
            document.querySelector(DOM.expenceContainer).insertAdjacentHTML('beforeend', newHTML);

        }

    }

    let ctrlClearFields = function() {
        let fields, fieldArray;

        fields = document.querySelectorAll(DOM.inputDescription + ',' + DOM.inputValue);
        fieldArray = Array.prototype.slice.call(fields);        // fields is a list data type, Array.prototype allows the use of array methods.

        fieldArray.forEach(function(current, index, array) {    // loops through each element of the array, and runs the function. the parameters of the function are as named.
            current.value = '';
        });

        document.querySelector(DOM.inputDescription).focus();   // select the input to have focus.
    }

    let ctrlDisplayTotals = function(data) {        // show the budget totals of the to of the screen.
        let percent = (data.totals.exp / data.totals.inc) * 100;
        document.querySelector(DOM.budgetValue).textContent = data.totals.inc - data.totals.exp;
        document.querySelector(DOM.incomeValue).textContent = data.totals.inc;
        document.querySelector(DOM.expenceValue).textContent = data.totals.exp;
        document.querySelector(DOM.expencePercentage).textContent = percent;

    }

    let ctrlDisplayPercenages = function(percentages) {
        let fields;
        fields = document.querySelectorAll(DOM.expencePercentLabel);

        nodeListForEach = function(list, callback) { // callback is the below function - current.textContent = pencentage[index] + '%';
            for (let i = 0; i < list.length; i++) {
                callback(list[i], i); // these parameters are used in the function.
            }
        }

        nodeListForEach(fields, function(current, index) {
            current.textContent = percentages[index] + '%';
        })
    }

    /* // HTML template
                        <div class="item clearfix" id="income-0">
                            <div class="ietm__description">Salary</div>
                            <div class="right clearfix">
                                <div class="item__value">+ 2,100.00</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>

                        <div class="item clearfix" id="expense-%ID%">
                            <div class="item__description">%description</div>
                            <div class="right clearfix">
                                <div class="item__value">- %value%</div>
                                <div class="item__percentage">%percentage%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>
  */                  
//  RETURN
    return {
        getInput: function() {
            return {        // get user inputs
                type: document.querySelector(DOM.inputType).value,
                description: document.querySelector(DOM.inputDescription).value,
                value: document.querySelector(DOM.inputValue).value
            }
        },
        
        getDOMStrings: function() { // function for other controllers to access dom string names.
            return DOM;
        },

        addItemToUI: function(type, obj) {
            ctrlAddItemToUI(type, obj);
        },

        ClearFields: function() {
            ctrlClearFields();
        },

        displayTotals: function(totals) {
            ctrlDisplayTotals(totals);
        },

        displayPercenages: function(list) {
            ctrlDisplayPercenages(list);
        }
    }

})();


// Data Controllor
let budgetController = (function() {

    // function constructors
    let Expence = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percent = -1;
    }

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    Expence.prototype.calcPercentage = function(){
        this.percent = Math.round((this.value / data.totals.inc) * 100);
    }

    Expence.prototype.getPercentage = function(){
        return this.percent
    }

//     1. Add data to the internal data structure.
    let data = {
        items: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    }



    //  RETURN
    return {
        addItem: function(typ, desc, val) {
            
            let newItem, ID;
            
            // Create new ID.
            if (data.items[typ].length === 0) {
                ID = 0;
            } else {
                ID = data.items[typ][data.items[typ].length - 1].id + 1;
            }
            

            // Create new item based on function contructors.
            if (typ === 'exp') {
                newItem = new Expence(ID, desc, val)
            } else if (typ === 'inc') { 
                newItem = new Income(ID, desc, val)
            }

            // Push date to data structure.
            data.items[typ].push(newItem);
            // console.log(newItem);
            // console.log(data);
            return newItem;
        },

        calcTotals: function(type, obj) {
            let convertedNumber;

            if (type === 'inc') {
                convertedNumber = parseFloat(obj.value);
                data.totals.inc = data.totals.inc + convertedNumber;
            } else if (type === 'exp') {
                convertedNumber = parseFloat(obj.value);
                data.totals.exp = data.totals.exp + convertedNumber;
            }
            return data;
        },

        calcPercentages: function() {
            data.items.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
            console.log(data);
        },

        getPercentages: function() {
            let allPercentages = data.items.exp.map(function(current) {
                return current.getPercentage();
            });
            return allPercentages
        }
    }

})();
    

// App Controllor

//     1. event handler.
let appController = (function(budgetController, UIController) {



    let setupEventListeners = function() {
        DOM = UIController.getDOMStrings();
        document.querySelector(DOM.addBtn).addEventListener('click', getItem);

        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                getItem();
                // Can I use the retrun from the pevious line to add item to UI??
                // console.log('here3')
            }
        })
        document.querySelector(DOM.containerClearfix).addEventListener('click', deleteItem);
    }

    let getItem = function() {
        let input, newItem, allPercentages;
        // console.log('here2');
    // 1. Get the user input. 
        input = UIController.getInput();      // Get the field input data, as an object. containing type, description and value.
        // console.log(input);
    // 2. Add input to data structure.
        newItem = budgetController.addItem(input.type, input.description, input.value); // splitting the input obj and passing as parameters to addItem function.
        
        // console.log(newItem);
        // addItem returns the latest item with ID as an obj.
    // 3. Add input to UI.
        // console.log(data);
        UIController.addItemToUI(input.type, newItem);
        UIController.ClearFields();
    // 4. Update the header.
        data = budgetController.calcTotals(input.type, newItem);
        // console.log(totals);
        
        UIController.displayTotals(data);

    // 5. udate percentages.
        budgetController.calcPercentages();
        allPercentages = budgetController.getPercentages();
        UIController.displayPercenages(allPercentages);
        //budgetController.calcPercentage();
    }

    let deleteItem = function(event){
        let itemID, item, type, id, el, elid, allPercentages;
        // console.log(event.target);
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;   // e.g. itemID === inc-0
        // console.log(itemID);
        item = itemID.split('-');
        type = item[0];
        id = parseInt(item[1]);
        // delete data entry.
        idArray = data.items[type].map(function(current) {      // array of the same lengh as date[type], with ech element storing the id.
            return current.id;
        })
        // console.log(idArray);
        // console.log(typeof idArray);
        // console.log(id);
        
        index = idArray.indexOf(id);
        // console.log(index);
        data.items[type].splice(index, 1);
        // console.log(data);
        // delete html entry.
        el = document.getElementById(itemID);   // get the element by id
        el.parentNode.removeChild(el); // remove the child of the parent with the id.
        
        budgetController.calcPercentages();
        allPercentages = budgetController.getPercentages();
        UIController.displayPercenages(allPercentages);
        

        // console.log(idArray);
        // console.log(id);
    }

    //  RETURN
    return {
        init: function() {
            console.log('Application has started.');
            setupEventListeners();
        }
    }

})(budgetController, UIController);

appController.init();
//console.log('here1')

// -------------------------------------------------------------------------------

