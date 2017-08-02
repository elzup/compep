const fs = require('fs')
const { execSync } = require('child_process')

fs.watch('main.cpp', async (event, filename) => {
  console.log(filename)
  try {
    execSync('g++ main.cpp')
  } catch (err) {
    console.log({
      ls_stdout: err.stdout.toString(),
      ls_stderr: err.stderr.toString(),
    })
  }
})
