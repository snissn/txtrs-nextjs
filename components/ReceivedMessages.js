import React, { Component, useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import Card from "react-bootstrap/Card";
import ecies from "eth-ecies";
import {
  getContract,
  contract,
  contractws,
  w3,
  users_address,
  getPrivateMessageWS,
  getBlockNumber,
  private_message_bob_stage_2,
} from "../helpers/Web3Helper";
import { colorHash, contrast } from "../helpers/Web3Helper";
import SecretMessage from "./SecretMessage";
import ReceivedMessage from "./ReceivedMessage";
const blockies = require("ethereum-blockies-png");

const EC = require("elliptic").ec;

export default class ReceivedMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      receivedMessages: [],
      errormessage: "",
      keys: {},
      message: undefined,
    };
  }

  async fetch() {
    const response = await this.getPrivateMessages();
    this.setState({ receivedMessages: response });
  }
  async componentDidMount() {
    await this.setUpListeners();
    await this.fetch();
  }

  async setUpListeners() {
    var that = this;
    contractws.events.allEvents(
      "allEvents",
      {
        fromBlock: "latest",
      },
      async function (err, data) {
        console.log("event", data);
        await that.fetch();
      }
    );
  }

  async getPrivateMessages() {
    var messages_count = await contractws.methods
      .get_received_messages_total(users_address)
      .call();
    var messages = [];
    for (var index = messages_count - 1; index >= 0; index--) {
      var private_message_addr = await contractws.methods
        .get_received_message(users_address, index)
        .call();
      var private_message = getPrivateMessageWS(private_message_addr);

      var stage = await private_message.methods.stage().call();
      var plaintext = "";
      var alice = await private_message.methods.alice().call();
      var bob = await private_message.methods.bob().call();
      var bob_public = await private_message.methods.bob_public().call();
      var encrypted_message = await private_message.methods
        .encrypted_message()
        .call();


      var message = {
        stage: stage,
        alice: alice,
        bob: bob,
        id: index,
        address: private_message_addr,
        encrypted_message: encrypted_message,
        bob_public: bob_public,
      };


      messages.push(message);
    }
    return messages;
  }

  render() {
    return (
      <div>
        {this.state.receivedMessages.map((message) => (
          <ReceivedMessage message={message} />

        ))}
      </div>
    );
  }
}
