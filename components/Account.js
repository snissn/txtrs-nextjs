import { useState } from "react";
import { web3init } from "../helpers/Web3Helper";

const Account = (props) => {
    const setAccount = props.setAccount;
    const provider = props.provider;

    function handleClick(event) {
        const choice = event.target.value;
        console.log(props, setAccount)
        setAccount(choice);
    }

    return (
        <div onChange={handleClick}>
            <input type="radio" value="local" name="accountChoice" checked={provider == "local"}/> AX Native
            <br />
            <input type="radio" value="meta" name="accountChoice" checked={provider == "meta"}/> MetaMask
        </div>
    );
}
export default Account;
