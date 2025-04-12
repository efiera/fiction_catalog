"use strict";

const setProp = (obj, propName, propValue) => {
    const o = { ...obj };
    o[propName] = propValue;
    return o;
};

function RegisterUser() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [userData, setUserData] = React.useState({
            web_user_id: "",
            user_email: "",
            user_password: "",
            userPassword2: "",
            user_image: "",
            birthday: "",
            membership_fee: "",
            user_role_id: "",
            errorMsg: ""        
    });
    const [errorObj, setErrorObj] = React.useState({ ...userData });

    const encodeUserInput = () => {
        const input = { ...userData };
        return encodeURI(JSON.stringify(input));
    };

    const saveClicked = () => {
        console.log("save clicked");
        setIsLoading(true);

        ajax_alt("webUser/insert?jsonData=" + encodeUserInput(),
            (obj) => {
                console.log("Error messages:", obj);
                if (!obj.errorMsg) obj.errorMsg = "Record Saved!";
                setErrorObj(obj);
                setIsLoading(false);
            },
            (ajaxErrorMsg) => {
                setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                setIsLoading(false);
            }
        );
    };

    if (isLoading) return <div> ... Loading ... </div>;

    return (
        <table className="insertArea">
            <tbody>
                {[
                    ["Id", "web_user_id", true],
                    ["Email", "user_email"],
                    ["Password", "user_password", false, "password"],
                    ["Re-enter Password", "userPassword2", false, "password"],
                    ["Image", "user_image"],
                    ["Birthday", "birthday"],
                    ["Membership Fee", "membership_fee"],
                    ["Role", "user_role_id"]
                    ].map(([label, field, disabled = false, type = "text"]) => (
                    <tr key={field}>
                        <td>{label}</td>
                        <td>
                            {field === "user_role_id" ? (
                                <select
                                    value={userData[field]}
                                    onChange={e => setUserData(setProp(userData, field, e.target.value))}>
                                    <option value="">-- Select Role --</option>
                                    <option value="1">ADMIN</option>
                                    <option value="2">MEMBER</option>
                                    <option value="3">VIEW</option>
                                </select>
                            ) : (
                                <input
                                    type={type}
                                    value={userData[field]}
                                    disabled={disabled}
                                    onChange={e => setUserData(setProp(userData, field, e.target.value))}
                                />
                        )}
                        </td>
                        <td className="error">{errorObj[field]}</td>
                    </tr>
                ))}
                <tr>
                    <td>
                        <br />
                        <button type="button" onClick={saveClicked}>Save</button>
                    </td>
                    <td className="error" colSpan="2">
                        <br />
                        {errorObj.errorMsg}
                    </td>
                </tr>
            </tbody>
        </table>
    );
}