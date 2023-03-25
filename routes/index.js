var express = require('express')
var router = express.Router()
var fs = require('fs'),
  path = require('path')

// Import axios
const axios = require('axios')
const FormData = require('form-data')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Beknazar' })
})

/* Endpoint to convert docx file into pdf using pdfskit.com API */
router.post('/convert', async (req, res, next) => {
  console.log('Converting file...')
  // Convert the file from local folder: public/uploads
  const inputPath = path.join(__dirname, '../public/uploads/template.docx')
  const outputPath = path.join(__dirname, '../public/uploads/template.pdf')

  const formData = new FormData()
  formData.append(
    'instructions',
    JSON.stringify({
      parts: [
        {
          file: 'document',
        },
      ],
    })
  )
  formData.append('document', fs.createReadStream(inputPath))
  ;(async () => {
    try {
      const response = await axios.post(
        'https://api.pspdfkit.com/build',
        formData,
        {
          headers: formData.getHeaders({
            Authorization:
              'Bearer pdf_live_I92IcXJIm5n8rVn71qBMsVNJ3iqIpt6T7lKYC1k9HPO',
          }),
          responseType: 'stream',
        }
      )

      response.data.pipe(fs.createWriteStream(outputPath))
      console.log('File converted successfully!')
      // Return the outputFile as response to download
      res.download(outputPath)
    } catch (e) {
      const errorString = await streamToString(e.response.data)
      console.log(errorString)
    }
  })()
  const streamToString = (stream) => {
    const chunks = []
    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      stream.on('error', (err) => reject(err))
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
  }
})

module.exports = router
