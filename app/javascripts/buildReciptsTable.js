var sellList;

function buildSellTable(selector) {
    var columns = addAllColumnHeaders(sellList, selector);
    for (var i = 0; i < sellList.length; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = sellList[i][columns[colIndex]];
            if (cellValue == null) cellValue = "";
            row$.append($('<td/>').html(cellValue));
        }
        $(selector).append(row$);
    }
}

function addAllColumnHeaders(sellList, selector) {
    var columnSet = [];
    var headerTr$ = $('<tr/>');
    for (var i = 0; i < sellList.length; i++) {
        var rowHash = sellList[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1) {
                columnSet.push(key);
                headerTr$.append($('<th/>').html(key));
            }
        }
    }
    $(selector).append(headerTr$);

    return columnSet;
}

async function showBillTable(){
    $('#billTable').html('');
    var id = $("#ReceiptID").val();
    var res;
    await searchBill(id).then(result =>
        res = result
    );
    sellList = [{
        "卖家": decodeURI(res['seller']),
        "买家": decodeURI(res['customer']),
        "签订时间": res['signTime'],
        "还款到期时间": res['expiredTime'],
        "欠款金额(万元)": res['money']
    }];
    buildSellTable('#billTable');
    $("table tr").not(":first").click(function () {
        $("#myModal").modal();
    });
    $('#billTable').show();
}



