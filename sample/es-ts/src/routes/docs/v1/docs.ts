export default ({env, file, string}:any) => {
  return {
    index: (req:any, res:any) => {
      res.writeHeader(200, {
        'Content-Type': 'text/html'
      })
      res.write(string.replace(file.html('template/docs'), {version: req.params.version}))
      res.end()
    }
  }
}