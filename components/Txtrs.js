import React, { useState, useEffect } from "react";

import SendPublicMessage from "../components/SendPublicMessage";
import PublicMessages from "../components/PublicMessages";
import ReceivedMessages from "../components/ReceivedMessages";
import NewSendMessage from "../components/NewSendMessage";
import Conversations from "../components/Conversations";
import Identity from "../components/Identity";
import Account from "../components/Account";

import { web3init } from "../helpers/Web3Helper";

export default function Txtrs() {
  // This is not used atm why are we setting it?
  const [networkName, setNetworkName] = useState("private");
  const [init, setInit] = useState(false);
  const [provider, setProvider] = useState("local");

  useEffect(() => {
    setAccount("local");
  }, []);

  const setAccount = (provider) => {
    setInit(false);
    web3init(provider).then((result) => {
      setInit(true);
      setProvider(provider)
    }).catch((error) => {alert(error); if (provider =="meta") setAccount("local")});


  };

  // This is not used atm
  const getPublicMessages = async () => {
    let messages = [];
    return messages;
  };

  if (!init) {
    return <p>Loading ...</p>;
  }
  return (
    <div>
    <div className="row">
      <div className="col-4 offset-4">
      <Account setAccount={setAccount} provider={provider}/>
      <Identity />
      </div>
    </div>
    <div className="row">
      {/* Public Chat Column */}
      <div className="col-4">
        <h2>Introduce Yourself</h2>
        <SendPublicMessage />
        <PublicMessages />
      </div>

        <div className="col-4">
          <h2>Encrypted Conversations</h2>
          <Conversations />
        </div>

 
    </div>
    </div>
  );
}
