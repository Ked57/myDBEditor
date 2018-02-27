var socket = io.connect('http://localhost:8080');
var modificationQueue = [];
var currTable;

socket.on('table-loaded', function (table) {
    console.log("received table-loaded event");
    console.log(table);
    currTable = table;
    var content = '<div id="alertDiv" class="alert alert-success"><strong>Chargement réussi !</strong> La table ' + table.name + ' a été chargée.</div>';
    content += '<table class="table"><tr>';
    table.columns.forEach(function (col) {
        content += "<th>" + col.name + "</th>";
    });
    content += "</tr>";
    var i = 0;
    table.rows.forEach(function (row) {
        var j = 0;
        content += "<tr>";
        row.forEach(function (value) {
            content += '<td contenteditable class="editableCell" id="'+currTable.columns[j].name+";"+i+'">' + value + '</td>';
            ++j;
        });
        content += "</tr>";
        ++i;
    });

    content += "</table>";
    $("#content").html(content);
    $("#alertDiv").delay(1000).fadeOut();
    $(".editableCell").on("input", function () {
        modificationQueue[this.id] = this.innerHTML;
        if (modificationQueue.length == 0) modificationQueue.length++;
        console.log(modificationQueue);
    });
    window.setInterval(function () {
        console.log(modificationQueue);
        if (modificationQueue.length > 0) {
            modificationQueue["table"] = currTable.name;
            socket.emit("auto-update", modificationQueue);
            modificationQueue = [];
            console.log("automaticaly sent update to serve");
        } else console.log("nothing to update");
    }, 1000);    
});

$("button").click(function () {
    console.log("button click: " + this.id);
    socket.emit('load-table', this.id);
}); 
