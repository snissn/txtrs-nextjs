import React, { Component, useState, useEffect } from "react";
import { w3 } from "../helpers/Web3Helper";
import ReceivedMessage from "./ReceivedMessage";

import {
  contractws,
  getSentMessages,
  getPrivateMessages
} from "../helpers/Web3Helper";
import EncryptMessage from "./EncryptMessage";

export default (props) => {
  const [messages, setMessages] = useState([]);
  const [account, setAccount] = useState(null);

  useEffect(() => {

    async function fetchData() {

      var x = await w3.eth.getAccounts();
      setAccount(x);
    }
    fetchData();

    contractws.events.allEvents(
      "allEvents",
      {
        fromBlock: "latest",
      },
      async function (err, data) {
        console.log("");
        await fetch();
      }
    );

    fetch().then(function () { });
  }, []);

  async function fetch() {
    const messages = await getPrivateMessages();
    console.log(messages)

    setMessages(messages);
  }

  return (
    <div>
      {messages.map((message) => {

        if (message.alice == account) {
          return (
            <EncryptMessage message={message} key={message.id} />
          )
        } else if (message.bob == account) {
          return (
            <ReceivedMessage message={message} key={message.id} />
          );

        }
      }
      )}
    </div>
  );
};
