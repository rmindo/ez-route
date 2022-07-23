var crypto = require('crypto')

/**
 * Stringify
 * 
 * @param data Data to convert
 */
exports.toStr = (data) => {
  return JSON.stringify(data)
}

/**
 * Hash a string
 * 
 * @param data String to hash
 */
exports.hash = (data) => {
  return crypto.createHash('md5').update(data).digest('hex')
}

/**
 * Encode string to base64
 * 
 * @param string - String to encode
 */
exports.encode = (data) => {
  return Buffer.from(data).toString('base64').replace(/=/g,'')
}

/**
 * Decode base64 string
 * 
 * @param data Base64 string to decode
 */
exports.decode = (data) => {
  return Buffer.from(data, 'base64').toString('utf-8')
}
  
  
/**
 * Signature with HMACSHA256
 * 
 * @param key Secret key
 * @param payload Payload to sign
 */
exports.sign = (key, payload) => {
  let hmac = crypto.createHmac('sha256', exports.encode(key))
  hmac.update(exports.toStr(payload))
  return exports.encode(hmac.digest('hex'))
}
  
  
/**
 * Random String
 * 
 * @param length Length of characters to be generated
 * @param type Type of the characters either numbers or letters else returns alphanumeric
 */
exports.random = (length = 32, type = null) => {
  let o = ''
  let n = '0123456789'
  let s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  
  if(type == 'n') {
    s = n
  }
  else if(type == 'l') {
    s = s
  } else {
    s += n
  }
  for(let i = 0; i < length; i++) {
    o += s.charAt(Math.floor(Math.random() * s.length))
  }
  return o
}


/**
 * Parse authorization
 * 
 * @param data Authorization string to parse
 */
exports.parse = (data) => {
  try {
    var [type, auth] = data.split(' ')
    switch(type) {
      case 'Basic':
        var de = exports.decode(auth).split(':')
        if(de.length == 2) {
          return {
            type,
            username: de[0],
            password: de[1],
          }
        }
      case 'Bearer':
        var en = auth.substring(86)
        return {
          type,
          token: auth,
          signature: en.substring(en.length-86, en.length),
          payload: JSON.parse(exports.decode(en.substring(0, en.length-86)))
        }
    }
  }
  catch(e) {}
}


/**
 * Verify access token
 * 
 * @param key Secret key
 * @param payload Payload to verify
 * @param signature Current signature
 */
exports.verify = (key, payload, signature) => {
  /**
   * Create buffer with signature
   */
  var sig1 = Buffer.from(signature)
  var sig2 = Buffer.from(exports.sign(key, payload))
  /**
   * Check if the same length
   */
  if(sig1.length === sig2.length) {
    /**
     * Compare the signature if its correct
     */
    if(crypto.timingSafeEqual(sig1, sig2)) {
      return true
    }
  }
  return false
}
  

/**
 * Create Token
 * 
 * @param {object} payload
 * @param {string} key
 */
exports.createtoken = (payload, key) => {
  if(payload.hasOwnProperty('exp')) {
    payload.exp = exports.setExpiration(payload.exp)
    let signature = exports.sign(key, payload)
    if(signature) {
      return exports.random(signature.length) + exports.encode(exports.toStr(payload)) + signature
    }
  }
  else {
    throw Error('Missing required field "exp"')
  }
}
        
  
/**
 * Token Expiration
 * 
 * @param exp
 */
exports.setExpiration = (exp) => {
  let date = new Date()
  if(exp.hasOwnProperty('timezon')) {
    date.toLocaleString('en-US', {
      timeZone: exp.timezone
    })
  }
  if(exp.hasOwnProperty('days')) {
    date.setDate(date.getDate()+exp.days)
  }
  return new Date(date).getTime()
}