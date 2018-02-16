const React = require('react')

module.exports = {
  Red: ({children}) => <span className='red'>{children}</span>,
  Blue: ({children}) => <span className='blue'>{children}</span>,
  swap: (options, Red, Blue) => {
    let swapcolor = options ? options.swapcolor : false
    return swapcolor ? {Red: Blue, Blue: Red} : {Red, Blue}
  }
}
