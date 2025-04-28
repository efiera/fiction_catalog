"use strict"; 

const AjaxUserTable = () => {

    console.log("AjaxUserTable running");

    // Tell React that 'items' (an array of objects) is a state variable 
    // that (when changed) should redisplay this component.
    // Set its initial value to [], an empty array.
    const [items, setItems] = React.useState([]);

    // Tell React that "error" is a state variable that (when changed) 
    // should redisplay this component. Set its initial value to null.
    const [error, setError] = React.useState(null);

    // By having this boolean state variable, we avoid calling the UserTable before  
    // we have the data (from AJAX call) to populate UserTable. 
    const [isLoading, setIsLoading] = React.useState(true);

    // useEffect 2nd parameter is an array of elements that 
    // (if any of those state variables change) should trigger the function specified 
    // as the 1st useEffect parameter. 
    // RUN ONCE PATTERN: If you put [] as 2nd param, it runs the 1st param (fn) once. 
    React.useEffect(() => {

        // ajax_alt takes three parameters: the URL to read, Success Fn, Failure Fn.
        ajax_alt(

            //"json/users.json",
            "webUser/getAll",

            function (dbList) {   // success function gets obj from ajax_alt
                if (dbList.dbError.length > 0) {
                    setError(dbList.dbError);
                } else {
                    setItems(dbList.webUserList);
                }
                setIsLoading(false);
            },

            function (msg) {       // failure message gets error message from ajax_alt
                setError(msg);
                setIsLoading(false);
            }
        );
    }, []);

    function deleteListEle(theList, indx) {

        // This javascript "built in function" removes 1 element (2nd param),
        // starting from position indx (1st param)
        theList.splice(indx,1);

        // You have to make React aware that the list has actually changed 
        // or else it won't re-render. Converting to JSON and back does the trick. 
        return JSON.parse(JSON.stringify(theList));
    }

    // invoke a web API passing in userId to say which record you want to delete. 
    // but also remove the row (of the clicked upon icon) from the HTML table -- 
    // if Web API sucessful... 
    function deleteUser(userObj, indx) {

        console.log("To delete user " + userObj.userEmail + "?");

        if (confirm("Do you really want to delete " + userObj.userEmail + "? ")) {

            ajax_alt(

                "webUser/delete?userId=" + userObj.webUserId, // URL for AJAX call to invoke

                // success function (anonymous)
                function (obj) {   // success function gets obj from ajax_alt
                    console.log("successful ajax call");
                    if (obj.errorMsg.length > 0) {
                        console.log("DB error trying to delete the webUser record");
                        //setError(obj.errorMsg);
                        alert(`Error: ${obj.errorMsg}`);
                        console.log(`Error: ${obj.errorMsg}`);
                    } else {
                        console.log("Successfully got webUser record to delete");
                        console.log(obj);
                        setItems(deleteListEle(items, indx));
                        alert("Successfully deleted the record");
                    }
                    setIsLoading(false); // set isLoading last to prevent premature rendering. 
                },

                // failure function (also anonymous)
                function (msg) {
                    alert(`Error: ${msg}`);
                    console.log(`Error: ${msg}`);
                    //setError(msg);
                    setIsLoading(false); // set isLoading last to prevent premature rendering.
                }
            )
            // alert("You have to call the delete web api here and only "+
            // "delete the element from the UI if the delete web api was "+
            // "succesfull (ajax success function AND there's no error message) "+
            // "passed back from the ajax call");

            // setItems(deleteListEle(items, indx));

        }
    } // deleteUser

    function callInsert() {
        window.location.hash = "#/userInsert";
    }

    if (isLoading) {
        return <div>... Loading ...</div>;
    }
    
    return (
        <div>
            {
                error ?
                    <div>Error: {error} </div> :
                    <div className="clickSort">
                        <h3>Web User List&nbsp;
                            <img src="icons/insert.png" onClick={callInsert}/>
                        </h3>
                        <div className="clickSort"> 

            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th className="textAlignCenter">Id</th>
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
                        items.map((listObj, index) =>
                            <tr key={listObj.webUserId}>
                                <td className="textAlignCenter" onClick={() => deleteUser(listObj, index)}   >
                                    <img src="icons/delete.png" />
                                </td>
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
        </div>
        }
        </div>
    );

}; // class AjaxUserTable