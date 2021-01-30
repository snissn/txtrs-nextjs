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
const blockies = require("ethereum-blockies-png");

const EC = require("elliptic").ec;

export default (props) => {
    console.log(props)
    const message = props.message;
    if (message.stage == "1") {
      private_message_bob_stage_2(message.private_message_addr);
    }

    if (message.stage == "3" || message.stage=="4") {
      //decrypt using bob eey
      const ec = new EC("secp256k1");
      console.log("message",message.bob_public)
      var pub_key_readable = Buffer.from(message.bob_public, "hex").toString("hex");
      console.log("should be same kesy bob", message.bob_public, pub_key_readable);

      if (typeof window == "undefined") {
         return;
      }
      //TODO how to manage sub keys
      var ethPrivKey = window.localStorage[pub_key_readable];
      if (ethPrivKey) {
        var pub = Buffer.from(pub_key_readable.slice(2), "hex");
        var pk = ec.keyFromPrivate(ethPrivKey);
        try {
          message.plaintext = ecies
            .decrypt(pk, Buffer.from(message.encrypted_message, "hex"))
            .toString(); // XXX REAL ONE
        } catch (e) {
          console.log(e);
        }

       }
    }


    return (
          <Card bsStyle="info" key={message.id} className="centeralign">
            <Card.Header as="h3">
              <div className="media text-left text-muted pt-3">
                <img
                  className="bd-placeholder-img mr-2 rounded-circle"
                  width="45"
                  height="45"
                  src={blockies.createDataURL({ seed: message.alice })}
                />
                <p className="media-body  mb-0  lh-125 ">
                  {(() => {
                    switch (message.stage) {
                      case "1":
                        return (
                          "Encrypted Message Request From " + message.alice
                        );
                      case "2":
                        return (
                          "Waiting On Encrypted Message from " + message.alice
                        );
                      case "3":
                        return "Encrypted Message From " + message.alice;
                      default:
                        return message.alice;
                    }
                  })()}
                </p>
              </div>
            </Card.Header>
            <Card.Body
              style={{
                backgroundColor: colorHash.hex(message.alice),
                color: contrast(colorHash.hex(message.alice)),
              }}
            >
              <SecretMessage message={message} />
            </Card.Body>
          </Card>
          )
    
}
