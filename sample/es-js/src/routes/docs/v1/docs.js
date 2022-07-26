export default ({file, string}) => {
  return {
    index: (req, res) => {
      res.writeHeader(200, {
        'Content-Type': 'text/html'
      })
      res.write(string.replace(file.html('template/docs'), {version: req.params.version}))
      res.end()
    }
  }
}