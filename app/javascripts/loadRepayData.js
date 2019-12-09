window.onload=async function(){
    var addr;
    //获取当前登陆的公钥
    await ajaxGET('GET',"http://127.0.0.1:3000/").then(result =>
        addr = result
    );
    console.log(addr);
    var res;
    await searchCompany(addr).then(result =>
        res = result
    );
    console.log(res);
    document.getElementById("Repayer").innerHTML = "<label class='companyInfo text-center'>还款方：" + decodeURI(res['name']) + "</label>";
};