export default (auth) => {
  return {
    text: auth.random(64, 'n')
  }
}