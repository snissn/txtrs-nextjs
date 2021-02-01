import Web3 from "web3";
import React, { useState, useEffect } from "react";

import abi from "../contracts/abi_txtrs.json";
import abi_private_message from "../contracts/abi_private_message.json";
const SignerProvider = require("ethjs-provider-signer");
const sign = require("ethjs-signer").sign;
const Eth = require("ethjs-query");

const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

export var w3 = new Web3();

var contract_address = "0x6954fd4298F36FE38f254CF6789ebF755bb0035E";
var contract_address = "0xBEd1F0BE378F63d6C15CB57626CC7FF4c109568C";


export var users_address;


export var contract;
export var contractws;

export function getContract() {
  return contract;
}
export function getPrivateMessageWS(addr) {
  return new w3.eth.Contract(abi_private_message, addr);
}
export function getPrivateMessage(addr) {
  return new w3.eth.Contract(abi_private_message, addr);
}
export function getBlockNumber(addr) {
  return new w3.eth.getBlockNumber();
}
export async function getPrivateMessages() {
  if (!users_address) {
    users_address = '0x0C3DceF0029701def6D807071ce4dF1002F4718e';
  }
  var account = await w3.eth.getAccounts();
  console.log("UA", users_address)
  var messages_count = await contractws.methods
    .get_private_messages_total(users_address)
    .call();
  var messages = [];
  for (var index = messages_count - 1; index >= 0; index--) {
    var private_message_addr = await contractws.methods
      .get_private_message(users_address, index)
      .call();


      /* TODO make this much much easier to fetch data from blockchain */
    var private_message = getPrivateMessageWS(private_message_addr);
    var alice = await private_message.methods.alice().call();
    var bob = await private_message.methods.bob().call();
    var stage = await private_message.methods.stage().call();
    var encrypted_message = await private_message.methods.encrypted_message().call();

    var message = { stage: stage, alice: alice, bob: bob, id: index ,private_message_addr:private_message_addr, encrypted_message: encrypted_message};

    if (stage == 1) {
    }
    if (stage == "2" || stage=="3") {
      var bob_public = await private_message.methods.bob_public().call();
      message["bob_public"] = bob_public;
    }
    message["address"] = private_message_addr;
    message["id"] = index;
    messages.push(message);
  }
  return messages;
}

export async function getSentMessages() {
  var account = await w3.eth.getAccounts();
  var messages_count = await contractws.methods
    .get_sent_messages_total(users_address)
    .call();
  var messages = [];
  for (var index = messages_count - 1; index >= 0; index--) {
    var private_message_addr = await contractws.methods
      .get_sent_message(users_address, index)
      .call();
    var private_message = getPrivateMessageWS(private_message_addr);
    var alice = await private_message.methods.alice().call();
    var bob = await private_message.methods.bob().call();
    var stage = await private_message.methods.stage().call();
    var message = { stage: stage, alice: alice, bob: bob, id: index };

    if (stage == 1) {
    }
    if (stage == "2") {
      var bob_public = await private_message.methods.bob_public().call();
      message["bob_public"] = bob_public;
    }
    message["address"] = private_message_addr;
    message["id"] = index;
    messages.push(message);
  }
  console.log("Messages", messages);
  return messages;
}

export async function private_message_bob_stage_2(private_message_addr) {
  var privateKey = w3.utils.randomHex(32);
  const ec = new EC("secp256k1");
  const ephemPrivKey = ec.keyFromPrivate(privateKey);
  const ephemPubKey = ephemPrivKey.getPublic();
  const ephemPubKeyEncoded = Buffer.from(ephemPubKey.encode());
  const pub_key_readable = Buffer.from(ephemPubKey.encode()).toString("hex");

  window.localStorage.setItem(pub_key_readable, privateKey);

  var accounts = await w3.eth.getAccounts();

  const gasEstimate = await contract.methods
    .pm_bob_reply(private_message_addr, pub_key_readable)
    .estimateGas();

  var send = await contract.methods
    .pm_bob_reply(private_message_addr, pub_key_readable)
    .send({ gas: gasEstimate, gasPrice: 0, from: accounts[0] });
}
function hexToRgb(hex) {
  if (!hex || hex === undefined || hex === "") {
    return undefined;
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : undefined;
}
function rgbToYIQ({ r, g, b }) {
  return (r * 299 + g * 587 + b * 114) / 1000;
}

// Why add types on js? if you want we can do it with propTypes but its silly, You could str8 up used TS instead.
export function contrast(colorHex, threshold) {
  if (colorHex === undefined) {
    return "#000";
  }

  const rgb = hexToRgb(colorHex);

  if (rgb === undefined) {
    return "#000";
  }

  return rgbToYIQ(rgb) >= threshold ? "#000" : "#fff";
}

var ColorHash = require("color-hash");
export var colorHash = new ColorHash();

export async function web3init() {
  // XXX uncomment for metamask
  //if (!!window.ethereum) {
  if (false) {
    w3 = new Web3(window.ethereum)
    await window.ethereum.enable();
  }
  // No Metamask - Check localStorage for address, otherwise create new
  else {
    var ethPrivKey;
    if (typeof window !== "undefined") {
      ethPrivKey = window.localStorage["txt_key"];
    }
    if (!ethPrivKey) {
      var wallet = w3.eth.accounts.wallet.create(1)[0];
      if (typeof window !== "undefined") {
        window.localStorage.setItem("txt_key", wallet.privateKey);
      }
      ethPrivKey = wallet.privateKey;
    }
    var me = w3.eth.accounts.privateKeyToAccount(ethPrivKey);

    console.log("ME", me);
    const address = me.address;
    const privateKey = me.privateKey;
    const account = w3.eth.accounts.privateKeyToAccount(privateKey);
    // Use local web3 provider
    w3 = new Web3("wss://chain.token.ax:443") 

    w3.eth.accounts.wallet.add(account);
    w3.eth.defaultAccount = account.address;

  }
  var accounts = await w3.eth.getAccounts();
  console.log("ACC", accounts)
  users_address = accounts[0]
  console.log(users_address);
  contract = new w3.eth.Contract(abi, contract_address);
  contract.options.from = users_address;
  contractws = contract
  return true;
}
