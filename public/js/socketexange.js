var socket = io.connect('http://localhost:8080');
var modificationQueue = [];
var currTable;

socket.on('table-loaded', function (table) {
    console.log("received table-loaded event");
    console.log(table);
    currTable = table;
    var pk = "";
    var content = '<div id="alertDiv" class="alert alert-success"><strong>Chargement réussi !</strong> La table ' + table.name + ' a été chargée.</div>';
    content += '<table class="table"><tr>';
    table.columns.forEach(function (col) {
        if (col.pk == true) {
            pk = col.name;
        }
        content += "<th>" + col.name + "</th>";
    });
    console.log(pk);
    content += "</tr>";

    table.rows.forEach(function (row) {
        var j = 0;
        content += "<tr>";
        row.forEach(function (value) {
            content += '<td contenteditable class="editableCell" id="' + pk + "=" + row[0] +';'+currTable.columns[j].name+'=">' + value + '</td>';
            ++j;
        });
        content += "</tr>";
    });

    content += "</table>";
    $("#content").html(content);
    $("#alertDiv").delay(1000).fadeOut();
    //Toute cette partie permet d'éviter l'envoi de doublons
    $(".editableCell").on("input", function () {
        var id = this.id;
        id = id.split("=");
        var id2 = id[1].split(";");
        var key = 0;
        var i = 0;
        modificationQueue.some(function (value) {
            var str = value.split(";");
            var str1 = str[1].split("=");
            var str2 = str[2].split("=");
            if (id[0] == str1[0] && id[1] == str2[0]) {
                key = i;
                return true;
            }
            ++i;
        });
        if (key >= 0) {
            modificationQueue[key] = currTable.name+';'+this.id + this.innerHTML;
        } else modificationQueue.push(currTable.name + ";"+this.id + this.innerHTML);
        
    });
    window.setInterval(function () {
        if (modificationQueue.length > 0) {
            console.log(modificationQueue);
            socket.emit("auto-update", modificationQueue);
            console.log("automaticaly sent update to server");
            modificationQueue = [];
        } //else console.log("nothing to update");
    }, 1000);    
});

$("button").click(function () {
    var request = { table: this.id, interval: "0;50" };
    console.log("request.table: " + request.table);
    console.log("request.interval: " + request.interval);
    socket.emit('load-table', request);
}); 
