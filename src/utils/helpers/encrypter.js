const bcryptjs = require('bcryptjs')

module.exports = class Encrypter {
  async compare (value, hash) {
    const isValid = await bcryptjs.compare(value, hash)
    return isValid
  }
}
