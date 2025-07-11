import { password } from "../config.json";

export default defineEventHandler(async (event) => {
  const auth = await getHeader(event, "Authorization")
  return auth == password
})
