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
    const options = {
      gasLimit: 3000000,
    }
    console.log("Deploying, please wait...")
    const contract = await factory.deploy(options)

    console.log(contract)

    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
