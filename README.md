# ProofOfWin

The decentralized voting platform is designed for Devfolio hackers, enabling them to cast votes on hackathon projects. Hackers can cast their votes before the winners are officially announced, with voting closing immediately after the announcement. The project with the highest number of votes will receive 50% of the total reward pool as a prize, while the remaining 50% will be distributed among projects that did not win any bounties, ensuring support for all participants. The platform incorporates TLS Notary to verify voter identity, confirming that only legitimate Devfolio hackers can participate in the voting process.

## Smart contract 

Ethereum Sepolia - 0x3F78D38bC490F6cd0Bc346703d618028B7276D78 <br/>
Scroll Sepolia - 0x5208f311d56422153e7b221589b25889e556840d <br/>
Manta Sepolia - 0xAaa906c8C2720c50B69a5Ba54B44253Ea1001C98<br/>

## 🌟 Features

- **Exclusive Voting:** Only verified hackers from Devfolio can cast their votes.
- **Pre-Reveal Voting:** Vote for your favorite projects before the winners are officially announced.
- **Reward System:** 
  - The project with the most votes receives **50% of the prize pool**.
  - **50% of the remaining pool** is distributed among projects that did not win any bounty, ensuring that all creative efforts are acknowledged.
- **TLS Notary Integration:** We use TLS Notary to validate the identity of voters, ensuring a fair voting process without any cheating.

## 🔥 Flow Diagram 

![TLS Notary Image](https://github.com/mxber2022/ETH_KL/raw/main/frontend/public/TLSNotary.png)

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)
- Ethereum wallet (like MetaMask) for interacting with the smart contracts

### Installation (frontend)

1. Clone the repository:
   ```bash
   git clone https://github.com/mxber2022/ETH_KL
   cd ETH_KL
   cd frontend
   ```

2. Install the dependencies:
   ```bash
   yarn
   ```

3. Deploy the smart contracts:
   ```bash
   yarn run deploy
   ```

### Running the Application

Start the application:
```bash
yarn dev
```

### Running the websocat

```bash
websocat --binary -v ws-l:0.0.0.0:55688 tcp:api.devfolio.co:443 
```

### Running the notary server

```bash
cd ETH_KL/V5/tlsn/notary-server
cargo r -r
```

### Running the tls verifier

```bash
cd ETH_KL/tomaru/tlsn-verifier
cargo r -r
```

### Usage

1. Connect your Ethereum wallet (e.g., MetaMask).
2. Verify your identity as a hacker through TLS Notary.
3. Explore the projects and cast your vote!

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgements

- Thanks to the Devfolio team for creating a platform where hackers can showcase their skills!
- Special thanks to the TLS Notary team.

## 📬 Contact

For inquiries or suggestions, feel free to reach out to us at [mxber2022@gmail.com](mailto:mxber2022@gmail.com).

---

Join us in transforming the hackathon experience—where every vote counts, and creativity is celebrated! 🚀
```