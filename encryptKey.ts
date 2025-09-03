import { ethers } from "ethers"
import * as fs from "fs"
import "dotenv/config"

const main = async () => {
  try {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string)
    const encryptedJsonKey = await wallet.encrypt(
      process.env.PRIVATE_KEY_PASSWORD as string
    )

    fs.writeFileSync("./.encryptedKey.json", encryptedJsonKey)

    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
