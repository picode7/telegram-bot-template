import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'

const logFileName = `data/logs/${new Date().toISOString().replace(/:/g, '-')} log.txt`
fs.mkdirSync(path.dirname(logFileName), { recursive: true })
const logFile = fs.createWriteStream(logFileName, { flags: 'w' })

export function log(...values: any[]) {
  const text = new Date().toISOString() + ' ' + values.map((v) => JSON.stringify(v)).join(' ')
  console.log(text)
  logFile.write(util.format(text + '\n'))
}
