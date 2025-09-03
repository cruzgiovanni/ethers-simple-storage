import { ethers } from "ethers"
import { readFileSync } from "fs"
import "dotenv/config"

async function main() {
  try {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
    const wallet = new ethers.Wallet(
      process.env.PRIVATE_KEY as string,
      provider
    )

    const abi = readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
    let binary = readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8")

    const factory = new ethers.ContractFactory(abi, binary, wallet)
    const contract = await factory.deploy({ gasLimit: 3000000 })
    await contract.deploymentTransaction()?.wait(1)

    const currentFavoriteNumber = await (contract as any).retrieve()
    console.log(
      `Current favorite number is: ${currentFavoriteNumber.toString()}`
    )

    const transactionResponse = await (contract as any).store(7, {
      nonce: await wallet.getNonce(),
    })
    const transactionReceipt = await transactionResponse?.wait(1)
    const updatedFavoriteNumber = await (contract as any).retrieve()
    console.log(
      `Updated favorite number is: ${updatedFavoriteNumber.toString()}`
    )

    // console.log("Let's deploy with only transaction data!")

    // const tx = {
    //   nonce: await wallet.getNonce(),
    //   gasPrice: 20000000000,
    //   gasLimit: 3000000,
    //   to: null,
    //   value: 0,
    //   data: "0x" + binary,
    //   chainId: 1337,
    // }

    // const sentTxResponse = await wallet.sendTransaction(tx) // under the hood it calls tx.sign() and tx.send()
    // await sentTxResponse.wait(1)
    // console.log(sentTxResponse)

    // process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
