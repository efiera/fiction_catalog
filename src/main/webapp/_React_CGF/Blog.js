"use strict"; 

function Blog() {
    return (
        

        <div className="blog">
            <h2>Blog</h2>
            <h3>Server Page</h3>
            <p>
                Click <a href="serpa" target="_blank">here</a> to see my published Server Side Page.
            </p>

            <h3>Proposed Database Table</h3>
            <p>
                The table will contain a list of works (books or other forms of literature) written by each user.
                There can be multiple users co-authoring a book.
            </p>
            <p>Title - Books</p>
            <ul>
                <li>auto increment primary key - books_id, int</li>
                <li>title of the work - name, varchar 50</li>
                <li>URL to picture of the cover - book_img, varchar 1000</li>
                <li>publishing date - pub_date, date &#40;optional&#41;</li>
                <li>page count - pages, int &#40;optional&#41;</li>
                <li>ISBN - isbn, int &#40;optional&#41;</li>
                <li>Goodreads rating - good_rating, int &#40;optional&#41;</li>
                <li>foreign key to user table - web_user, int</li>
            </ul>

            <h3>My Database Experience</h3>
            <p>
                I am currently taking Database Systems at Temple. Otherwise I have very limited experiences working with databases.
            </p>

            <h3>Web Development Experience</h3>
            <p>
                I have no web development experience at all prior to this class! 
            </p>

            <h3>HW 1 Home Page</h3>
            <p>
                Most of this assignment was not hard to actually execute but I struggled to understand what it was
                for a bit. I think a lot of the information I needed to complete it was spread out across multiple
                locations and that got confusing for me. I found it nice that I didn't need to implement a table yet
                or add multiple pages yet.  
            </p>

            <h3>HW 2 Database</h3>
            <p>I found the concepts that I learned in this homework were actually incredibly easy but the process of putting
                it all together was needlessly complex and fiddly and I struggled to understand and follow the instructions
                despite the task itself being, in my opinion, extremely simple. I found the knowledge that I gained valuable,
                but I didn't really care for the process of taking a bunch of screenshots because I found that when I had to 
                go back to correct something it was tough to know what to correct. If I missed any points on this assignment
                I am certain that it is due to the format of the assignment and not because of the concepts involved.
            </p>
            <p>Click <a target="_blank" href='fiera_database.pdf'>here</a> to see my database document.</p>

            <h3>HW 3 SPA</h3>
            <p>
                This assignment was relatively easy to complete though it was sometimes confusing. Parts of the instructions
                seemed extraneous which I thought made it harder. In particular, for a bit I thought each part of this blog was
                supposed to be its own page until I read it again and realized that wasn't necessary. Overall I didn't mind this
                assignment too much.
            </p>
        
        </div>
    );
}