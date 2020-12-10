import Head from "next/head";
import styles from "../styles/Home.module.css";
import Identity from "../components/Identity";
import Txtrs from "../components/Txtrs";

export default function Home() {
  return (
    <div className="App">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Txt.rs
        </a>
        <div className="y-2 my-lg-0">
          <Identity />
        </div>
      </nav>
      <div style={{ "max-width": "1500px", margin: "0 auto" }}>
        <h1 className="App-title">
          Secure OTR messaging (like Signal) using a secure ethereum sidechain.
        </h1>
        <p>
          To demo the secure chat, send a public chat message and then click the
          chat button to initiate a private message with yourself
        </p>
        <Txtrs />
      </div>
    </div>
  );
}
