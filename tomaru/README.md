<p align="center">
    <img src="./semaphore/apps/web-app/public/tomaru.png" width=250 />
</p>

# Tomaru

Tomaru is an authentic, anonymous and independent hotel review web3 platform, powered by [TLSNotary](https://tlsnotary.org/) and [Semaphore](https://semaphore.pse.dev/) — built as a hackathon idea demo.

## Motivation

The credibility of reviews on products/services have long frustrated me — especially with hotels given we are often travelling; I can't be sure if those reviews on booking/airbnb/google are genuine (from people who actually booked) and honest (some avoid writing bad reviews to avoid conflict).

## Idea

Reviewers use TLSN to generate proof of a past hotel booking, and get added to a Semaphore group specific to that hotel. Now they can write an anonymous review post. 

Hotel owners can use TLSN to generate proof that they own the hotel's 'booking.com' account, and can reply to the reviewer's post for any clarifications or questions.

## Test it yourself!
1. Clone this repo, install [rust](https://www.rust-lang.org/tools/install), [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) and [foundry](https://getfoundry.sh/)
2. Run the offchain TLSN verifier: `cd tomaru/tlsn-verifier; cargo r -r`
3. In another terminal, install yarn dependencies: `cd tomaru/semaphore; yarn`
4. Compile the Semaphore smart contracts: `cd apps/contracts; yarn compile`
5. Run the webapp and the Semaphore smart contracts: `cd ../..; yarn dev`
6. Browse http://localhost:3000 and have fun!

P/S: You'll have to DM me to get the TLSN attestation though, since this demo only supports a specific hotel that I booked previously on Agoda 😅

## If I've more time...
- Fix on chain verification of TLSN verifier's signature
- Build Agoda TLSN [plugin](https://github.com/tlsnotary/tlsn-plugin-boilerplate/tree/main/examples)!
- Generalise to more than 1 hotel 
- Enable hotel owners to comment
- Store posts and comments offchain to relax char limit
- Use Metamask login
