"use strict";

function LogOnAPI() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [msg, setMsg] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
  
    const doLogon = () => {
        setIsLoading(true);
        ajax_alt(
            `session/logonAPI?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
            (userData) => {
                if (userData.errorMsg.length > 0) {
                    setMsg(<strong className="react-error">{userData.errorMsg}</strong>);
                } else {
                    setMsg(
                        <div className="react-msg">
                            {userData.user_role_id}<br />
                            Birthday: {userData.birthday}<br />
                            Membership Fee: {userData.membership_fee}<br />
                            Role: {userData.user_role_id} {userData.user_role_type}<br />
                            <img className="react-img" src={userData.user_image} alt="User" />
                        </div>
                    );
                }
                setIsLoading(false);
            },
            (msg) => {
                setMsg(<strong className="react-error">AJAX failure: {msg}</strong>);
                setIsLoading(false);
            }
        );
    };
  
    return (
        <div className="react-box">
            <h1>Log In</h1>
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={doLogon} disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
            </button>
            <div className="react-msg">{msg}</div>
        </div>
    );
  }
  