export default (auth:any) => {
  return {
    text: auth.random(64, 'n')
  }
}