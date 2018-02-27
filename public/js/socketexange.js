var socket = io.connect('http://localhost:8080');

socket.on('table-loaded', function (table) {
    console.log("received table-loaded event");
    console.log(table);
    var content = '<table class="table"><tr>';
    table.columns.forEach(function (col) {
        content += "<th>" + col.name + "</th>";
    });
    content += "</tr>";

    table.rows.forEach(function (row) {
        content += "<tr>";
        row.forEach(function (value) {
            content += "<td contenteditable>" + value + "</td>";
        });
        content += "</tr>";
    });

    content += "</table>";
    $("#content").html(content);
    
});

$("button").click(function () {
    console.log("button click: " + this.id);
    socket.emit('load-table', this.id);
}); 
