const UserTable = ({list}) => {
   
    console.log("UserTable invoked");
    return (
        <div className="clickSort"> 

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Email</th>
                        <th className="textAlignCenter">Image</th>
                        <th className="textAlignCenter">Birthday</th>
                        <th className="textAlignRight">Membership Fee</th>
                        <th>Role</th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        list.map(listObj =>
                            <tr key={listObj.webUserId}>
                                <td>
                                    <a href={'#/userUpdate/:'+listObj.webUserId}><img src="icons/update.png" className="clickLink"/></a>
                                </td>
                                <td>{listObj.userEmail + ' ('+listObj.webUserId+')'}</td>
                                <td className="shadowImage textAlignCenter"><img src={listObj.userImage} /></td>
                                <td className="textAlignCenter">{listObj.birthday}</td>
                                <td className="textAlignRight">{listObj.membershipFee}</td>
                                <td className="nowrap">{listObj.userRoleId} {listObj.userRoleType}</td>
                                <td>{listObj.errorMsg}</td>
                            </tr>
                        )
                    } 
                </tbody>
            </table>
        </div>
    );
};

// Sample User from the JSON file.
/*
      "webUserId": "1",
      "userEmail": "sallyk",
      "userPassword": "p",
      "image": "http://cis-linux2.temple.edu/~sallyk/pics_/sk_2017.jpg",
      "birthday": "",
      "membershipFee": "$123.45",
      "userRoleId": "2",
      "userRoleType": "Edit",
      "errorMsg": ""
 */