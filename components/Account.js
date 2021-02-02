import { useState } from "react";
import { web3init } from "../helpers/Web3Helper";

const Account = (props) => {
    const [account, setAccount] = useState('account')
    const [provider, setProvider] = useState('provider');

    function handleClick(event) {
        const choice = event.target.value;
        web3init(choice);
    }

    return (
        <div onChange={handleClick}>
            <input type="radio" value="local" name="accountChoice" /> AX Native
            <br />
            <input type="radio" value="meta" name="accountChoice" /> MetaMask
        </div>
    );
}
export default Account;
