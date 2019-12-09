window.onload=async function(){
    var addr;
    //获取当前登陆的公钥
    await ajaxGET('GET',"http://127.0.0.1:3000/").then(result =>
        addr = result
    );
    console.log(addr);
    if(addr === ""){
        alert("未登陆");
        jumpToInitPage();
    }
    var res;
    await searchCompany(addr).then(result =>
        res = result
    );
    console.log(res);
    document.getElementById("CompanyName").innerHTML = "<h1>" + decodeURI(res['name']) + "</h1>";
    //document.getElementById("CompanyID").innerHTML = "<label class='companyInfo text-center'>企业ID：" + res['id'] + "</label>";
    document.getElementById("CompanyProperty").innerHTML = "<label class='companyInfo text-center'>企业资产：" + res['property'] + "(万元)</label>";
    document.getElementById("CompanyCredit").innerHTML = "<label class='companyInfo text-center'>企业信誉度：" + res['credit'] + "</label>";
    var CompanyType = res['companyType'];
    if(CompanyType === "0"){
        document.getElementById("CompanyType").innerHTML = "<label class='companyInfo text-center'>企业类型：企业</label>";
    }
    else if(CompanyType === "1"){
        document.getElementById("CompanyType").innerHTML = "<label class='companyInfo text-center'>企业类型：厂商</label>";
    }
    else if(CompanyType === "2"){
        document.getElementById("CompanyType").innerHTML = "<label class='companyInfo text-center'>企业类型：融资机构</label>";
    }
};

