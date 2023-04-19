import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== "undefinded") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" })
    } catch (e) {
      console.log(e)
    }

    await window.ethereum.request({ method: "eth_requestAccounts" })
    connectButton.innerHTML = "Connected!"
  } else {
    fundButton.innerHTML = "Please Install Metamask"
  }
}

// Fund Function

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}`)
  if (typeof window.ethereum !== "undefinded") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTransactionMine(transactionResponse, provider)
      console.log("Done!")
    } catch (e) {
      console.log(e)
    }
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`)
  // create listner for blockchain
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      )
      resolve()
    })
  })
}

// Balance Function

async function getBalance() {
  if (typeof window.ethereum !== "undefinded") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.utils.formatEther(balance))
  }
}

// Withdraw Function

async function withdraw() {
  if (typeof window.ethereum !== "undefinded") {
    console.log("Withdrawing...")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)

    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider)
    } catch (e) {
      console.log(e)
    }
  }
}
