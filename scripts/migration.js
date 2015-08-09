// functions for localStorage migration
// previous version has different localStorage structure
// here we will convert old data to new structure with new additional data
// Example of difference
// old: localStorage['today'] = ['task1', 'task2']
// new: localStorage['today'] = [{'text': 'task1', 'status': 'td-fin'}, ...]

var MIGRATION = {
    checkOldLocalStorage: function() {
        if (localStorage.length)
            for (day in localStorage) {
                var todoList = JSON.parse(localStorage[day]);
                if (todoList.length > 0)
                    if (todoList[0]['status'] == undefined) {
                        return true;
                    }
            }
    },

    migrateLocalStorage: function() {
        for (day in localStorage) {
            var oldTodoList = JSON.parse(localStorage[day]);
            var newTodoList = [];
            for (var i = 0; i < oldTodoList.length; i++)
                newTodoList.push({'text': oldTodoList[i], 'status': 'td-unfin'});
            localStorage[day] = JSON.stringify(newTodoList);
        }
    }
};