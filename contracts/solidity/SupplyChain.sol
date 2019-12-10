pragma solidity ^0.4.4;

contract SupplyChain{
    //企业 厂商 银行
    enum CompanyType{Enterprise,Manufacturer,Bank}
    struct Company{
        bytes32 ID;
        string name;//企业名称
        int credit;//企业信用资产
        int property;//资产（万）
        CompanyType companyType;//企业类型
        mapping(bytes32 => Receipt) sellReceipts;//出售的单据
        mapping(bytes32 => Receipt)  purchaseReceipts;//购买的单据
        bytes32[] ReceiptIdArray;//需要支付的单据ID
    }
    mapping(address => Company) public companyMap;//公司
    mapping(string => address) companyNameMap;//记录公司名和地址的映射

    struct Receipt{
        bytes32 ID;//单据ID
        string seller;//卖家
        string customer;//买家
        string signTime;//签订时间
        string expiredTime;//还款到期时间
        int money;//还款金额
    }
    mapping(bytes32 => Receipt) public ReceiptMap;
    Company[] Companys;//存储所有公司

    event CompanyInChain(address addr,string companyName);//新来公司加入区块链
    event SignReceipt(address seller, address customer, int money,string signDate, string expireDate);//购买签署单据
    event transferReceipt(address tfrom,address tto,int money);//账款转让
    event Financing(address company, int amount);//融资
    event PayDebt(address company, address to, int amount);//还债款

    //公司加入区块链
    function CompanyAddInChain(address _addr, bytes32 _id, string _name,int _property,CompanyType _companyType) public returns(bool,string) {
        //检查是否存在相同ID
        for(uint i = 0;i < Companys.length;i ++){
            if(_id == Companys[i].ID){
                return (false,"Company ID exists");
            }
        }
        Company storage newCompany = companyMap[_addr];
        newCompany.ID = _id;
        newCompany.name = _name;
        newCompany.credit = 30;//刚开始加入信誉额度为0
        newCompany.property = _property;
        newCompany.companyType = _companyType;
        companyMap[_addr] = newCompany;
        companyNameMap[_name] = _addr;
        Companys.push(newCompany);
        emit CompanyInChain(_addr,_name);
        return (true,"company add success");
    }

    //有买家发起交易
    function purchaseSign(bytes32 id,address seller,string sellDate,string expireDate,int money) public returns(bool,string,bytes32){
        //检查是否存在相同ID
        if(ReceiptMap[id].ID != 0x0){
            return (false,"Receipt ID exist",0x0);
        }
        if(companyMap[seller].ID == 0x0 || companyMap[msg.sender].ID == 0x0){
            return (false,"Company doesn't exist",0x0);
        }

        Company storage sellCompany = companyMap[seller];
        Company storage purchaseCompany = companyMap[msg.sender];
        //交易双方必须是企业或厂商
        if(sellCompany.companyType == CompanyType.Bank || purchaseCompany.companyType == CompanyType.Bank){
            return (false,"can't trading with bank",0x0);
        }
        //对卖家和买家增加相同的单据
        Receipt memory newReceipt = Receipt(id,sellCompany.name,purchaseCompany.name,sellDate,expireDate,money);
        sellCompany.sellReceipts[id] = newReceipt;
        purchaseCompany.purchaseReceipts[id] = newReceipt;
        ReceiptMap[id] = newReceipt;//存储单据
        purchaseCompany.ReceiptIdArray.push(id);
        emit SignReceipt(seller,msg.sender,money,sellDate,expireDate);
        return (true,"sign Receipt success",id);
    }

    //msg.sender为转账发起者,thirdCompany为第三方欠债公司
    //transferID为要转移的单据ID,newid为转账后新增的单据ID
    function receiptTransfer(bytes32 transferID,bytes32 newid, address transferTo,int money,string transferTime)public returns (bool,string,bytes32){
        if(ReceiptMap[transferID].ID == 0x0){
            return (false,"transferID not exist",0x0);
        }
        if(ReceiptMap[newid].ID != 0x0){
            return (false,"New ID exist",0x0);
        }
        if(companyMap[transferTo].ID == 0x0 || companyMap[msg.sender].ID == 0x0){
            return (false,"Company doesn't exist",0x0);
        }
        Company storage fromCompany = companyMap[msg.sender];
        Company storage toCompany = companyMap[transferTo];
        //交易双方必须是企业或厂商
        if(fromCompany.companyType == CompanyType.Bank || toCompany.companyType == CompanyType.Bank){
            return (false,"can't trading with bank",0x0);
        }

        if(fromCompany.sellReceipts[transferID].money < money){
            return (false,"this receipts money dones't enough",0x0);
        }
        else{
            address thirdaddr = companyNameMap[fromCompany.sellReceipts[transferID].customer];
            Company storage thirdCompany = companyMap[thirdaddr];
            fromCompany.sellReceipts[transferID].money -= money;//单据金额相应减少
            thirdCompany.purchaseReceipts[transferID].money -= money;//第三方公司单据金额减少
            ReceiptMap[transferID].money -= money;
            //增加接受方和第三方公司之间的单据
            //Receipt memory newReceipt = Receipt(newid,toCompany.name,thirdCompany.name,transferTime,fromCompany.sellReceipts[transferID].expiredTime,money);
            toCompany.sellReceipts[newid] = Receipt(newid,toCompany.name,thirdCompany.name,transferTime,fromCompany.sellReceipts[transferID].expiredTime,money);
            thirdCompany.purchaseReceipts[newid] = Receipt(newid,toCompany.name,thirdCompany.name,transferTime,fromCompany.sellReceipts[transferID].expiredTime,money);
            thirdCompany.ReceiptIdArray.push(newid);
            ReceiptMap[newid] = Receipt(newid,toCompany.name,thirdCompany.name,transferTime,fromCompany.sellReceipts[transferID].expiredTime,money);//存储单据
            //如果金额转账后为0，删除单据
            if(fromCompany.sellReceipts[transferID].money == 0){
                delete fromCompany.sellReceipts[transferID];
                delete thirdCompany.purchaseReceipts[transferID];
                delete ReceiptMap[transferID];
            }

            emit transferReceipt(msg.sender,transferTo,money);
            return (true,"transfer success",newid);
        }
    }

    //融资由银行发起
    function getFinancing(address company, bytes32 Receiptid) public returns(bool, string) {
        if(companyMap[company].ID == 0x0 || companyMap[msg.sender].ID == 0x0){
            return (false,"Company doesn't exist");
        }
        if(companyMap[msg.sender].companyType != CompanyType.Bank){
            return (false,"msg sender is not bank");
        }
        Company storage financingCompany = companyMap[company];
        if(financingCompany.credit < 0){
            return (false,"credit not enough");
        }
        if(companyMap[company].sellReceipts[Receiptid].ID == 0x0){
            companyMap[company].credit -= 10;//如果存在假的单据减少企业信誉额度
            return (false,"Receipt doesn't exist");
        }

        //资产增加
        financingCompany.property += companyMap[company].sellReceipts[Receiptid].money;
        emit Financing(company,companyMap[company].sellReceipts[Receiptid].money);
        //将债权转让给银行
        address thirdAddr = companyNameMap[companyMap[company].sellReceipts[Receiptid].customer];
        Company storage thirdCompany = companyMap[thirdAddr];
        thirdCompany.purchaseReceipts[Receiptid].seller = companyMap[msg.sender].name;
        ReceiptMap[Receiptid].seller = companyMap[msg.sender].name;
        delete companyMap[company].sellReceipts[Receiptid];//删除融资后的单据
        return (true,"financing success");

    }

    function payMoney(string expiredDate) public returns(bool,string) {
        if(companyMap[msg.sender].ID == 0x0){
            return (false,"Company doesn't exist");
        }
        Company storage company = companyMap[msg.sender];
        uint cnt = 0;//有几个该日期的欠款
        for(uint i = 0;i < company.ReceiptIdArray.length;i ++){
            //还该日期的欠款
            if(keccak256(company.purchaseReceipts[company.ReceiptIdArray[i]].expiredTime) == keccak256(expiredDate)){
                address sellAddr = companyNameMap[company.purchaseReceipts[company.ReceiptIdArray[i]].seller];
                Company storage sellCompany = companyMap[sellAddr];
                if(company.property < company.purchaseReceipts[company.ReceiptIdArray[i]].money){
                    company.credit -= 10;//换不起欠款信誉度减少
                    return (false,"company property not enough to pay");
                }
                company.property -= company.purchaseReceipts[company.ReceiptIdArray[i]].money;
                sellCompany.property += company.purchaseReceipts[company.ReceiptIdArray[i]].money;
                company.credit += 10;//按期还款信誉度增加
                cnt ++;
                emit PayDebt(msg.sender, sellAddr, company.purchaseReceipts[company.ReceiptIdArray[i]].money);//还债款
                //删除相应单据
                delete company.purchaseReceipts[company.ReceiptIdArray[i]];
                delete sellCompany.sellReceipts[company.ReceiptIdArray[i]];
                delete ReceiptMap[company.ReceiptIdArray[i]];
                delete company.ReceiptIdArray[i];
            }
        }
        if(cnt == 0){
            return (false, "There is no debt in this date");
        }
        return (true,"pay debt success");
    }
}
