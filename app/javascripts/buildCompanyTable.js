var companyList;

function buildCompanyTable(selector) {
    var columns = addAllColumnHeaders(companyList, selector);
    for (var i = 0; i < companyList.length; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = companyList[i][columns[colIndex]];
            if (cellValue == null) cellValue = "";
            row$.append($('<td/>').html(cellValue));
        }
        $(selector).append(row$);
    }
}

async function showCompanyTable(){
    $('#companyTable').html('');
    var addr = $("#CompanyAddr").val();
    var res;
    await searchCompany(addr).then(result =>
        res = result
    );
    var CompanyType = res['companyType'];
    if(CompanyType === "0"){
        companyList = [{
            "公司名称": decodeURI(res['name']),
            "公司资产(万元)": res['property'],
            "公司信誉度": res['credit'],
            "公司类型": "企业"
        }];
    }
    else if(CompanyType === "1"){
        companyList = [{
            "公司名称": decodeURI(res['name']),
            "公司资产(万元)": res['property'],
            "公司信誉度": res['credit'],
            "公司类型": "厂商"
        }];
    }
    else if(CompanyType === "2"){
        companyList = [{
            "公司名称": decodeURI(res['name']),
            "公司资产(万元)": res['property'],
            "公司信誉度": res['credit'],
            "公司类型": "融资机构"
        }];
    }
    buildCompanyTable('#companyTable');
    $("table tr").not(":first").click(function () {
        $("#myModal").modal();
    });
    $('#companyTable').show();


}


