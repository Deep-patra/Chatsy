export function append(
  formdata: FormData,
  data: any extends object ? object : any
) {
  for (const key of Object.keys(data)) {
    formdata.append(key, data[key])
  }
}
