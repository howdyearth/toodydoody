$(document).ready(function() {

function showDay(day) {
    // make active menu element
    $('a[class*=list-active]').removeClass('list-active');
    $('a[href=#'+day+']').addClass('list-active');

    // show task list
    $('ul[id='+day+']').addClass('active').animate({'opacity' : 1}, 500);
}

function redirectId() {
    var linkHash = window.location.hash;
    if (linkHash != '') {
        var day = linkHash.slice(1);
        showDay(day);
    }
    else
        showDay('today');
}

function appendTodoLi(listId, todoText, statusClass) {
    var todoHtml = '<li><span class="td-delete">×</span>';
    todoHtml += '<span class="' + statusClass + '"></span><p>'+todoText+'</p></li>';
    $('ul[id*='+listId+']').append($(todoHtml));    
}
function saveTodo(day, todoText, todoStatus) {
    var todoList = JSON.parse(localStorage[day]);
    todoList.push({"text": todoText, "status": todoStatus});
    localStorage[day] = JSON.stringify(todoList);
}
function saveTodoStatus(todoIndex, todoDay, newStatus) {
    todoList = JSON.parse(localStorage[todoDay]);
    todoList[todoIndex]['status'] = newStatus;
    localStorage[todoDay] = JSON.stringify(todoList);
}
function deleteTodo(day, todoIndex) {
    var todoList = JSON.parse(localStorage[day]);
    todoList.splice(todoIndex, 1);
    localStorage[day] = JSON.stringify(todoList);
}

function checkLocalTodos() {
    if (MIGRATION.checkOldLocalStorage()) {
        MIGRATION.migrateLocalStorage();
        console.log("[!] Old localStorage detected.");
    }
    if (localStorage.length) {
        for (day in localStorage) {
            var todoList = JSON.parse(localStorage[day]);
            for (var i = 0; i < todoList.length; i++) {
                appendTodoLi(day, todoList[i]['text'], todoList[i]['status']);
            }
        }
    }
    else {
        localStorage['today'] = JSON.stringify([]);
        localStorage['tomorrow'] = JSON.stringify([]);
    }
}
//localStorage.clear();
checkLocalTodos();

// add task
function addTask() {
    form = $('input[class=add-todo]');
    var todoText = form.val();
    
    // if the field is empty
    if (todoText == '')     return;
    form.val('');

    //var todoHtml = '<li><span class="td-delete">×</span><span class="td-unfin"></span><p>'+todoText+'</p></li>';
    //$('ul[class*=active]').append($(todoHtml));
    var currentDayId = $('ul[class*=active]').attr('id');
    appendTodoLi(currentDayId , todoText, 'td-unfin');
    saveTodo(currentDayId, todoText, 'td-unfin');
}

// top days menu
$('.days-menu li a').click(function() {
    $('ul[class*=active]').removeClass('active').css('opacity',0);
    var day = $(this).attr('href'); //window.location.hash
    day = day.slice(1);
    showDay(day);
});

// remove task
$('.td-delete').live('click', function() {
    deleteTodo($(this).closest('ul').attr('id'), $(this).closest('li').index());
    $(this).closest('li').animate({'opacity' : 0}, 170).delay(170).queue(function() { $(this).remove(); });
    //deleteTodo();
    //deleteTodo($(this).closest('ul').attr('id'), /*...*/);
});

$('span[class*=fin]').live('click', function() {
    var taskStatus = $(this);
    var statusClass = taskStatus.attr('class');
    var todoIndex = taskStatus.closest('li').index();
    var todoDay = $('ul[class*=active]').attr('id');;

    if (statusClass == 'td-unfin') {
        taskStatus.removeClass('td-unfin').addClass('td-soonfin');
        saveTodoStatus(todoIndex, todoDay, 'td-soonfin');
    }
    else if (statusClass == 'td-soonfin') {
        taskStatus.removeClass('td-soonfin').addClass('td-fin');
        saveTodoStatus(todoIndex, todoDay, 'td-fin');
    }
    else if (statusClass == 'td-fin') {
        taskStatus.removeClass('td-fin').addClass('td-unfin');
        saveTodoStatus(todoIndex, todoDay, 'td-unfin');
    }
});

// to do submenu
$('.todo-list li').live('mouseover', function() {
    $(this).children('span[class=td-delete]').css('display','block');
});
$('.todo-list li').live('mouseout', function() {
    $(this).children('span[class=td-delete]').css('display','');
});

// button pressed
$('span[class=td-add]').click(function() {
    addTask();
});
// enter pressed
$(".add-todo").keypress(function(event) {
  if ( event.which == 13 )
     addTask();
});

// chek hash in address and show it
redirectId();

});

// open description
/*
$('.todo-list li').click(function() {
    if ( $(this).attr("class") != "td-opened" )
        $(this).addClass("td-opened");
    else
        $(this).removeClass("td-opened");
});
*/