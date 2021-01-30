import React, { useState, useEffect } from "react";

import SendPublicMessage from "../components/SendPublicMessage";
import PublicMessages from "../components/PublicMessages";
import ReceivedMessages from "../components/ReceivedMessages";
import NewSendMessage from "../components/NewSendMessage";
import Conversations from "../components/Conversations";



import { web3init } from "../helpers/Web3Helper";

export default function Txtrs() {
  // This is not used atm why are we setting it?
  const [networkName, setNetworkName] = useState("private");
  const [init, setInit] = useState(false);

  useEffect(() => {
    web3init().then((result) => {
      setInit(true);
    });
  }, []);

  // This is not used atm
  const getPublicMessages = async () => {
    let messages = [];
    return messages;
  };

  if (!init) {
    return <p>Loading ...</p>;
  }
  return (
    <div className="row">
      {/* Public Chat Column */}
      <div className="col-4">
        <h2>Public Chat</h2>
        <SendPublicMessage />
        <PublicMessages />
      </div>

        <div className="col-4">
          <h2>Encrypted Conversations</h2>
          <Conversations />
        </div>

 
    </div>
  );
}
