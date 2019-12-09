function getLogInAddr() {
    return LogincompanyAddr;
}

function jumpToRegisterPage(){
    window.location.href = "../pages/RegisterPage.html";
}

function jumpToLogInPage(){
    window.location.href = "../pages/LoginPage.html";
}

function jumpToInitPage(){
    window.location.href = "../pages/InitPage.html";
}

function emptyRegisterForm() {
    $("#CompanyAddr").val("");
    $("#CompanyID").val("");
    $("#CompanyName").val("");
    $("#CompanyProperty").val("");
    $("#CompanyType").val(0);
}

async function registerResult(){
    var CompanyAddr = $("#CompanyAddr").val();
    var CompanyID = $("#CompanyID").val();
    var CompanyName = encodeURI($("#CompanyName").val());
    var CompanyProperty = $("#CompanyProperty").val();
    var CompanyType = $("#CompanyType").val();
    if(CompanyAddr == ""){
        alert("注册失败：公司公钥为空！");
        emptyRegisterForm();
        return;
    }
    if(CompanyID == ""){
        alert("注册失败：公司ID为空！");
        emptyRegisterForm();
        return;
    }
    if(CompanyName == ""){
        alert("注册失败：公司名称为空！");
        emptyRegisterForm();
        return;
    }
    if(CompanyProperty == ""){
        alert("注册失败：公司资产为空！");
        emptyRegisterForm();
        return;
    }
    var res;
    await CompanyRegister(CompanyAddr, CompanyID, CompanyName, CompanyProperty, CompanyType).then(result =>
        res = result
    );
    if(res['0'] === true){
        alert("注册成功");
    }
    else{
        alert("注册失败：" + res['1']);
    }
    emptyRegisterForm();
    jumpToInitPage();
}

function emptyLogInForm() {
    $("#CompanyAddr").val("");
    $("#CompanyName").val("");
}

async function logInResult() {
    var CompanyAddr = $("#CompanyAddr").val();
    var CompanyName = encodeURI($("#CompanyName").val());
    if(CompanyAddr == ""){
        alert("登陆失败：公司公钥为空！");
        emptyLogInForm();
        return;
    }
    if(CompanyName == ""){
        alert("登陆失败：公司名称为空！");
        emptyLogInForm();
        return;
    }
    var res;
    await searchCompany(CompanyAddr).then(result =>
        res = result
    );
    if(res['0'] === 0x00 || res['name'] !== CompanyName){
        alert("登陆失败：公司名和公钥不匹配");
        emptyLogInForm();
        return;
    }
    //POST请求发送用户公钥给后台
    ajaxPOST('POST',"http://127.0.0.1:3000/",CompanyAddr);
    emptyLogInForm();
    jumpToCompanyPage();
}

function jumpToCompanyPage(){
    window.location.href = "../pages/CompanyPage.html";
}

function jumpToTradingPage(){
    window.location.href = "../pages/trading.html";
}

function emptyTradingForm() {
    $("#ReceiptID").val("");
    $("#SellerAddr").val("");
    $("#SellTime").val("");
    $("#ExpireTime").val("");
    $("#money").val("");
}

async function tradingResult(){
    var ReceiptID = $("#ReceiptID").val();
    var SellerAddr = $("#SellerAddr").val();
    var SellTime = $("#SellTime").val();
    var ExpireTime = $("#ExpireTime").val();
    var money = $("#money").val();
    if(ReceiptID == ""){
        alert("交易失败：单据ID为空！");
        emptyTradingForm();
        return;
    }
    if(SellerAddr == ""){
        alert("交易失败：卖方公钥为空！");
        emptyTradingForm();
        return;
    }
    if(SellTime == ""){
        alert("交易失败：交易日期为空！");
        emptyTradingForm();
        return;
    }
    if(ExpireTime == ""){
        alert("交易失败：逾期日期为空！");
        emptyTradingForm();
        return;
    }
    if(money == ""){
        alert("交易失败：交易金额为空！");
        emptyTradingForm();
        return;
    }
    var purchaser;
    //获取当前登陆的公钥
    await ajaxGET('GET',"http://127.0.0.1:3000/").then(result =>
        purchaser = result
    );

    var res;
    await purchaseSign(ReceiptID, SellerAddr, SellTime, ExpireTime, money, purchaser).then(result =>
        res = result
    );
    if(res['0'] === true){
        alert("交易成功");
    }
    else{
        alert("交易失败：" + res['1']);
    }
    emptyTradingForm();
    jumpToCompanyPage();
}

function jumpToTransferPage(){
    window.location.href = "../pages/transfer.html";
}

function emptyTransferForm() {
    $("#ReceiptID").val("");
    $("#newID").val("");
    $("#toCompany").val("");
    $("#money").val("");
    $("#transferTime").val("");
}

async function transferResult(){
    var ReceiptID = $("#ReceiptID").val();
    var newID = $("#newID").val();
    var toCompany = $("#toCompany").val();
    var money = $("#money").val();
    var transferTime = $("#transferTime").val();
    if(ReceiptID == ""){
        alert("转让失败：单据ID为空！");
        emptyTransferForm();
        return;
    }
    if(newID == ""){
        alert("转让失败：新单据ID为空！");
        emptyTransferForm();
        return;
    }
    if(toCompany == ""){
        alert("转让失败：接收方公钥为空！");
        emptyTransferForm();
        return;
    }
    if(money == ""){
        alert("转让失败：转让金额为空！");
        emptyTransferForm();
        return;
    }
    if(transferTime == ""){
        alert("转让失败：转让日期为空！");
        emptyTransferForm();
        return;
    }
    var fromaddr;
    //获取当前登陆的公钥
    await ajaxGET('GET',"http://127.0.0.1:3000/").then(result =>
        fromaddr = result
    );

    var res;
    await receiptTransfer(ReceiptID, newID, toCompany, money, transferTime, fromaddr).then(result =>
        res = result
    );
    if(res['0'] === true){
        alert("转让成功");
    }
    else{
        alert("转让失败：" + res['1']);
    }
    emptyTransferForm();
    jumpToCompanyPage();
}

function jumpToFinancingPage(){
    window.location.href = "../pages/financing.html";
}

function emptyFinancingForm() {
    $("#ReceiptID").val("");
}


async function financingResult(){
    var ReceiptID = $("#ReceiptID").val();
    if(ReceiptID == ""){
        alert("融资失败：单据ID为空！");
        emptyFinancingForm();
        return;
    }
    var fromaddr;
    //获取当前登陆的公钥
    await ajaxGET('GET',"http://127.0.0.1:3000/").then(result =>
        fromaddr = result
    );

    var res;
    await getFinancing(fromaddr, ReceiptID).then(result =>
        res = result
    );
    if(res['0'] === true){
        alert("融资成功");
    }
    else{
        alert("融资失败：" + res['1']);
    }
    emptyFinancingForm();
    jumpToCompanyPage();
}

function jumpToRepayPage(){
    window.location.href = "../pages/repay.html";
}

function emptyRepayForm() {
    $("#ExpireTime").val("");
}

async function repayResult(){
    var ExpireTime = $("#ExpireTime").val();
    if(ExpireTime == ""){
        alert("还款失败：逾期日期为空！");
        emptyRepayForm();
        return;
    }
    var fromaddr;
    //获取当前登陆的公钥
    await ajaxGET('GET',"http://127.0.0.1:3000/").then(result =>
        fromaddr = result
    );

    var res;
    await payMoney(ExpireTime, fromaddr).then(result =>
        res = result
    );
    if(res['0'] === true){
        alert("还款成功");
    }
    else{
        alert("还款失败：" + res['1']);
    }
    emptyRepayForm();
    jumpToCompanyPage();
}

function logOutResult() {
    ajaxPOST('POST',"http://127.0.0.1:3000/","");//修改当前登陆Addr为空
    jumpToInitPage();
}

function jumpToBillPage(){
    window.location.href = "../pages/BillPage.html";
}

// 封装的ajax方法
function ajaxPOST(method, url, val) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.send(val);
}

function ajaxGET(method, url) {
    return new Promise(function (resolve, reject) {
        var res;
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.send();
        xhr.onload = function(){
            console.log(xhr.status);
            if((xhr.status >= 200 && xhr.status <= 300) || xhr.status === 304){
                console.log(xhr.responseText);
                res = xhr.responseText;
                resolve(res);
                console.log(res);
            }else{
                console.log(error);
            }
        };
    });
}