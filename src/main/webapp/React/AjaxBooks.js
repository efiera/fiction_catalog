//probably safe to delete

const AjaxBooks = () => {

    console.log("AjaxBooks running");

    // Tell React that 'items' (an array of objects) is a state variable 
    // that (when changed) should redisplay this component.
    // Set its initial value to [], an empty array.
    const [items, setItems] = React.useState([]);

    // Tell React that "error" is a state variable that (when changed) 
    // should redisplay this component. Set its initial value to null.
    const [error, setError] = React.useState(null);

    const [isLoading, setIsLoading] = React.useState(true);

    // useEffect 2nd parameter is an array of elements that 
    // (if any of those state variables change) should trigger the function specified 
    // as the 1st useEffect parameter. 
    // RUN ONCE PATTERN: If you put [] as 2nd param, it runs the 1st param (fn) once. 
    React.useEffect(() => {

        // ajax_alt takes three parameters: the URL to read, Success Fn, Failure Fn.
        ajax_alt(
            //url, // URL for AJAX call to invoke
            //"json/books.json", // URL for AJAX call to invoke
            "books/getAll", // URL for AJAX call to invoke

            // success function (anonymous)
            function (dbList) {   // success function gets obj from ajax_alt
                if (dbList.dbError.length > 0) {
                    setError(dbList.dbError);
                } else {
                    console.log("in AjaxBooks, here is book list (on the next line):");
                    console.log(dbList.booksList);
                    setItems(dbList.booksList);
                }
                setIsLoading(false); // set isLoading last to prevent premature rendering. 
            },

            // failure function (also anonymous)
            function (msg) {       // failure function gets error message from ajax_alt
                setError(msg);
                setIsLoading(false); // set isLoading last to prevent premature rendering.
            }
        );
    },
        []);

    if (isLoading) {
        console.log("Is Loading...");
        return <div> Loading... </div>
    }

    if (error) {
        console.log("Error...");
        return <div>Error: {error} </div>;
    }

    console.log("items for BooksTable on next line");
    console.log(items);
    return (
        <div className="clickSort">
            <h3>
                Book List
            </h3>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th className="textAlignCenter">Image</th>
                        <th className="textAlignCenter">Pub Date</th>
                        <th className="textAlignCenter">ISBN</th>
                        <th>User</th>
                        <th>Error</th> 
                    </tr>
                </thead>
                <tbody>
                    {
                        items.map((item, index) =>
                            <tr key={item.book_id}>
                                <td>{item.book_title}</td>
                                <td className="shadowImage textAlignCenter">{item.book_img}</td>
                                <td className="textAlignCenter">{item.pub_date}</td>
                                <td className="textAlignCenter">{item.isbn}</td>
                                <td className="textAlignCenter">{item.web_user_id}</td>
                                <td>{item.errorMsg}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    );

}; // function AjaxUsers 

{/* <th></th>
<th>Title</th>
<th className="textAlignCenter">Image</th>
<th className="textAlignCenter">Pub Date</th>
<th className="textAlignRight">ISBN</th>
<th>User</th>
<th>Error</th> */}