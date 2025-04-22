const BookTable = ({list}) => {
   
    console.log("BookTable invoked");
    return (
        <div className="clickSort"> 

            <table>
            <thead>
                    <tr>
                        <th></th>
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
                        list.map(listObj =>
                            <tr key={listObj.book_id}>
                                <td>
                                    <a href={'#/bookUpdate/:'+listObj.book_id}><img src="icons/update.png" className="clickLink"/></a>
                                </td>
                                <td>{listObj.book_title + ' ('+listObj.book_id+')'}</td>
                                <td className="shadowImage textAlignCenter"><img src={listObj.book_img} /></td>
                                <td className="textAlignCenter">{listObj.pub_date}</td>
                                <td className="textAlignRight">{listObj.isbn}</td>
                                <td className="nowrap">{listObj.web_user_id} {listObj.userEmail}</td>
                                <td>{listObj.errorMsg}</td>
                            </tr>
                        )
                    } 
                </tbody>
            </table>
        </div>
    );
};

// Sample Book from the JSON file.
/*
    {
        "book_id": "200",
        "book_title": "",
        "isbn": "",
        "book_img": "",
        "pub_date": "",
        "web_user_id": ""
    }
 */