"use strict";

function LogOffAPI(url) {
    const [msg, setMsg] = React.useState("Logging out...");
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        ajax_alt(
            url,
            (responseData) => {
                setMsg(<p className="react-msg">{responseData.errorMsg}</p>);
                setIsLoading(false);
            },
            (err) => {
                setMsg(<p className="react-error">AJAX failure: {err}</p>);
                setIsLoading(false);
            }
        );
    }, []);

    return (
        <div className="react-box">
            {isLoading ? <p className="react-msg">... Log off confirmation</p> : msg}
        </div>
    );
}
