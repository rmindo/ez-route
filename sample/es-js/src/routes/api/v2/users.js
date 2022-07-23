export default async ({lib, auth}) => {
  var misc = lib.misc(auth)
  
  return {
    read: async (req, res) => {
      res.print({version: req.params.version, random: misc}, 200)
    }
  }
}