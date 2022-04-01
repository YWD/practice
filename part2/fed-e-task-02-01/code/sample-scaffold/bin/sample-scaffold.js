#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const ejs = require('ejs')

inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'Your project name?',
        default: 'my-project'
    }
]).then(answers => {
    const tmplDir = path.join(__dirname, '../templates')
    const destDir = process.cwd()
    fs.readdir(tmplDir, (err, files) => {
        if (err) throw err
        files.forEach(file => {
            ejs.renderFile(path.join(tmplDir, file), answers, (err, result) => {
                if (err) throw err
                fs.writeFileSync(path.join(destDir, file), result)
            })
        })
    })
})
