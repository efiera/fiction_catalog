"use strict"; // not sure if this is needed in react...

const BookInsertOrUpdate = (props) => {

    // See if this is an Insert or an Updat by checking the path that invoked this component.
    // If the path has a : in it, then its update, else its insert.
    // If update, extract (from the path) the id of the webUser record that is to be updated. 
    // console.log("props for userInsertOrUpdate on next line");
    // console.log(props);

    var action = "insert"; // exact spelling has to match web API @RequestMapping
    var id = "";
    var url = props.location.pathname;
    console.log("url that invoked BookInsertOrUpdate is " + url);
    if (url.search(":") > -1) {
        const url_list = url.split(":");
        id = url_list[url_list.length - 1];
        console.log("to update id " + id);
        action = "update";
    } else {
        console.log("to insert");
    }

    // Set initial values of state variables and receive (from React) a setter function for each one.
    // In React, you create State Variables for anything that (if changed) needs to re-render the UI. 

    // Object (State Variable) that holds all the user entered data. Each object 
    // is linked with a textbox for user input. 
    const [bookData, setBookData] = React.useState(
        {
            "book_id": "",
            "book_title": "",
            "isbn": "",
            "book_img": "",
            "pub_date": "",
            "web_user_id": "",
            "errorMsg": ""
        }
    );

    // State variable to hold the Role List (gotten from getRolesAPI.jsp) 
    // Role List populates the <select tag> for the UI.
    const [roleList, setRoleList] = React.useState([]);

    // Object (State Variable) that holds all the error messages - field level 
    // and form/record level (errorMsg).
    const [errorObj, setErrorObj] = React.useState(
        {
            "book_id": "",
            "book_title": "",
            "isbn": "",
            "book_img": "",
            "pub_date": "",
            "web_user_id": "",
            "errorMsg": ""
        }
    );


    // By having this boolean state variable, we avoid rendering the component 
    // before we are ready to do so. 
    const [isLoading, setIsLoading] = React.useState(true);

    const encodeUserInput = () => {
        var userInputObj = {
            "book_id": bookData.book_id,
            "book_title": bookData.book_title,
            "isbn": bookData.isbn,
            "book_image": bookData.book_image,
            "pub_date": bookData.pub_date,
        };
        console.log("userInputObj on next line");
        console.log(userInputObj);
        // turn the user input object into JSON then run that through 
        // a URI encoder (needed for security on server side, prevents 
        // server from hacks). 
        //return encodeURIComponent(JSON.stringify(userInputObj));
        return encodeURI(JSON.stringify(userInputObj));
    };

    // If you just change the value of a State object's property, then React does not 
    // know that the object has been changed (and thus does re-render the UI). 
    // To get around this, I wrote function setProp that clones the object, changes 
    // the desired property, then returns the clone. THEN React knows that the object 
    // has been changed (and re-renders the UI). 
    const setProp = (obj, propName, propValue) => {
        var o = Object.assign({}, obj); // makes a copy of the object
        o[propName] = propValue; // changes the property of the copy
        // console.log("setProp orig object is");
        // console.log(obj);
        // console.log("after changing " + propName + " to " + propValue + " the new obj is");
        // console.log(o);
        return o; // returns the object copy with the property's value changed.
    };

    // useEffect second parameter is an array of "watch elements" that 
    // (if they change) should trigger the function specified 
    // as the first useEffect parameter.

    // This code should execute just once at initial page render because 
    // the array of watch elements (second parameter to useEffect) is empty.
    React.useEffect(

        () => {

            console.log("AJAX call for role list");
            ajax_alt("role/getAll",

                function (obj) { // obj holds role list from AJAX call
                    console.log("role/getAll Ajax success");
                    if (obj.dbError.length > 0) {  // db error trying to read role list
                        setErrorObj(setProp(errorObj, "book_id", obj.dbError));
                    } else {

                        // role fields (from role/getAll): book_id, userRoleType. 
                        // sort alphabetically by role type (not by id)
                        obj.roleList.sort(function (a, b) {
                            if (a.userRoleType > b.userRoleType) {
                                return 1
                            } else {
                                return -1;
                            }
                            return 0;
                        });
                        console.log('sorted role list on next line');
                        console.log(obj.roleList);
                        setRoleList(obj.roleList);

                        if (action === "update") { //this is update, not insert, get webUser by the id
                            console.log("Now getting webUser record " + id + " for the update");
                            ajax_alt("webUser/getById?book_id=" + id,
                                function (obj) {
                                    if (obj.errorMsg.length > 0) { // obj.errorMsg holds error, e.g., db error
                                        console.log("DB error trying to get the webUser record for udpate");
                                        setErrorObj(setProp(errorObj, "errorMsg", obj.errorMsg));
                                        //setProp = (obj, propName, propValue)

                                    } else { // obj holds the webUser record of the given id
                                        console.log("got the web user record for update (on next line)");
                                        console.log(obj);
                                        setbookData(obj); // prepopulate user data since this is update.
                                    }
                                },
                                function (ajaxErrorMsg) { // AJAX Error Msg from trying to read the webUser to be updated.
                                    setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                                }
                            );
                        }

                    }
                },
                function (ajaxErrorMsg) { // AJAX Error Msg from trying to read the role list.
                    // setRoleError(msg);
                    setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                }
            );
            setIsLoading(false);
        }, []);

    const validate = () => {
        console.log("Validate, should kick off AJAX call");
        // action was set to insert or update above (must match web API @RequestMapping). 
        console.log("Here is the user data that will be sent to the insert/update API");
        console.log(bookData);

        setIsLoading(true);
        ajax_alt("webUser/" + action + "?jsonData=" + encodeUserInput(),

            function (obj) { // obj holds field level error messages
                console.log("These are the error messages (next line)");
                console.log(obj);

                if (obj.errorMsg.length === 0) {
                    // errorMsg = "" means no error, record was inserted (or updated). 
                    obj.errorMsg = "Record Saved !";
                }

                setErrorObj(obj); // show the field level error messages (will all be "" if record was inserted)
                setIsLoading(false);
            },
            function (ajaxErrorMsg) { // AJAX error msg trying to call the insert or update API
                setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                setIsLoading(false);
            }
        );
    };

    if (isLoading) {
        return <div> ... Loading ... </div>;
    }

    return (
        <table className="insertArea">
            <tbody>
                <tr>
                    <td>Id</td>
                    <td>
                        <input value={bookData.web_user_id} disabled />
                    </td>
                    <td className="error">
                        {errorObj.web_user_id}
                    </td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>
                        <input value={bookData.book_title} onChange=
                            {e => setbookData(setProp(bookData, "book_title", e.target.value))}
                        />
                    </td>
                    <td className="error">
                        {errorObj.book_title}
                    </td>
                </tr>
                <tr>
                    <td>Password</td>
                    <td>
                        <input type="password" value={bookData.isbn} onChange=
                            {e => setbookData(setProp(bookData, "isbn", e.target.value))}
                        />
                    </td>
                    <td className="error">
                        {errorObj.isbn}
                    </td>
                </tr>
                <tr>
                    <td>Image</td>
                    <td>
                        <input value={bookData.book_image} onChange=
                            {e => setbookData(setProp(bookData, "book_image", e.target.value))}
                        />
                    </td>
                    <td className="error">
                        {errorObj.book_image}
                    </td>
                </tr>
                <tr>
                    <td>pub_date</td>
                    <td>
                        <input value={bookData.pub_date} onChange=
                            {e => setbookData(setProp(bookData, "pub_date", e.target.value))}
                        />
                    </td>
                    <td className="error">
                        {errorObj.pub_date}
                    </td>
                </tr>
                <tr>
                    <td>
                        <br />
                        <button type="button" onClick={validate}>Save</button>
                    </td>
                    <td className="error" colSpan="2">
                        <br />
                        {errorObj.errorMsg}
                    </td>
                </tr>
            </tbody>
        </table>

    ); // ends the return statement

}; // end of function/component
