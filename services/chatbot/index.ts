
export class Chatbot {
  static async sendMessage(message: string): Promise<string> {
    const formdata = new FormData()
    formdata.append('prompt', message)
      
    const res = await fetch('/api/chatbot', {
      method: 'POST',
      body: formdata
    })

    if (res.status !== 200)
      throw new Error("Response status is not 200")

    const json = await res.json()
    return json.text
  }
}
