export default async ({lib, auth}:any) => {
  var misc = lib.misc(auth)
  
  return {
    read: async (req:any, res:any) => {
      res.print({version: req.params.version, random: misc}, 200)
    }
  }
}