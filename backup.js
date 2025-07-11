import { exec } from 'node:child_process'

const now = new Date()

const year = `${now.getFullYear()}`
const month = (`${now.getMonth() + 1}`).padStart(2, '0')
const day = (`${now.getDate()}`).padStart(2, '0')
const version = `v${year}.${month}.${day}`
let step = 1


function run (command) {
    console.log(`step:${step} -------> ${command}`)
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                return reject(err)
            }

            const out = stdout.toString()

            step !== 1 && console.log(out)
            resolve(out)
            step++
        })
    })
}


await run(`git checkout master`)
await run(`git checkout -B ${version}`)
// await run(`npm run pull`)
await run(`git push origin ${version} -f`)
await run(`git checkout master`)