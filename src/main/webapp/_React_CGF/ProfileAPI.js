"use strict";

function ProfileAPI(url) {
    const [msg, setMsg] = React.useState("Loading");
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        ajax_alt(
            url,
            (userData) => {
                if (userData.errorMsg.length > 0) {
                    setMsg(<strong>{userData.errorMsg}</strong>);
                } else {
                    setMsg(
                        <div>
                            <h2>{userData.user_role_id}</h2>
                            Birthday: {userData.birthday}<br />
                            Membership Fee: {userData.membership_fee}<br />
                            User Role: {userData.user_role_id} {userData.user_role_type}<br />
                            <img src={userData.user_image} alt="User" />
                        </div>
                    );
                }
                setIsLoading(false);
            },
            (err) => {
                setMsg("AJAX failure: " + err);
                setIsLoading(false);
            }
        );
    }, []);

    return (
        <div className="profile">
            {isLoading ? <h1>Loading</h1> : msg}
        </div>
    );
}