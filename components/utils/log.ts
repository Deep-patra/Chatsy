
/**
 * @desc A logging function for development
 * @param {...any[]} args - Any number of arguments
 */
export default function log(...args: any[]) {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "development")
    console.log(...args)
}
