"use strict";

const booksFilterSortTable = () => {

    const [isLoading, setIsLoading] = React.useState(true);

    const [dbList, setDbList] = React.useState([]);

    const [error, setError] = React.useState(null);

    const [filterInput, setFilterInput] = React.useState("");

    const [filteredList, setFilteredList] = React.useState([]);
  
    React.useEffect(() => {

        ajax_alt(

            "books/getAll",

            function (dbList) {   
                if (dbList.dbError.length > 0) {
                    console.log("Database error was " + dbList.dbError);
                    setError(dbList.dbError);
                } else {
                    console.log("Data was read from the DB. See next line,");
                    console.log(dbList.booksList);
                    setDbList(dbList.booksList);
                    setFilteredList(dbList.booksList);
            
                }
                setIsLoading(false); 
            },

            function (msg) {      
                console.log("Ajax error encountered: " + msg);
                setError(msg);
                setIsLoading(false); 
            }
        );
    }, []);

    React.useEffect(() => {
        if (!isLoading) {
            sortByProp("user_email", "text");
        }
    }, [isLoading]);

    const doFilter = (filterInputVal) => {
        let newList = filterObjList(dbList, filterInputVal);
        console.log("function doFilter. filterInputVal is: " + filterInputVal +
            ". See filtered list on next line:");
        console.log(newList);
        setFilteredList(newList);
    };
    
    const clearFilter = () => {
        setFilterInput("");
        doFilter(""); 
        sortByProp("user_email", "text");
    };

    const sortByProp = (propName, sortType) => {
        const sortedList = [...filteredList].sort((a, b) => {
            if (sortType === "text") {
                return a[propName].localeCompare(b[propName]);
            } else if (sortType === "number") {
                const aValue = a[propName] === null || a[propName] === '' ? -Infinity : parseFloat(a[propName].replace(/[^\d.-]/g, ""));
                const bValue = b[propName] === null || b[propName] === '' ? -Infinity : parseFloat(b[propName].replace(/[^\d.-]/g, ""));
    
                return aValue - bValue; 
            } else if (sortType === "date") {
                return new Date(a[propName]) - new Date(b[propName]);
            }
            return 0;
        });
    
        setFilteredList(sortedList);
    };   

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="clickSort">
            <h3>
                Filterable Book List &nbsp;
                <input value={filterInput} onChange={(e) => setFilterInput(e.target.value)} />
                &nbsp; 
                <button onClick={() => doFilter(filterInput)}>Search</button> {}
                &nbsp; 
                <button onClick={clearFilter}>Clear</button> {}
            </h3>

            <table>
                <thead>
                <tr>
                    <th onClick={() => sortByProp("user_email", "text")}><img src="icons/sortUpDown16.png" />Email</th>
                    <th className="textAlignCenter">Image</th><th onClick={() => sortByProp("birthday", "date")}className="textAlignCenter"><img src="icons/blackSort.png" />Birthday</th>
                    <th onClick={() => sortByProp("membership_fee", "number")}className="textAlignRight" ><img src="icons/whiteSort.png" />Membership Fee</th>
                    <th onClick={() => sortByProp("user_role_type", "text")}><img src="icons/sortUpDown16.png" />Role</th>
                    <th>Error</th>
                </tr>
                </thead>
                <tbody>
                    {filteredList.map((listObj) => (
                        <tr key={listObj.web_user_id}>
                            <td>{listObj.user_email}</td>
                            <td className="shadowImage textAlignCenter">
                            <img src={listObj.user_image && listObj.user_image.trim().length > 0 ? listObj.user_image : "pics1/null_pic.png"} alt="user"/></td>
                            <td className="textAlignCenter">{listObj.birthday}</td>
                            <td className="textAlignRight">{listObj.membership_fee}</td>
                            <td className="nowrap">{listObj.user_role_type}</td>
                            <td>{listObj.errorMsg}</td> {}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
