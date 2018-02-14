const React = require('react')

module.exports = {
  Instr: (props) => (
    <div className='instruction'>{props.children}</div>
  ),
  Red: ({children}) => <span className='red'>{children}</span>,
  Blue: ({children}) => <span className='blue'>{children}</span>,
  swap: (options, Red, Blue) => {
    let swapcolor = options ? options.swapcolor : false
    return swapcolor ? {Red: Blue, Blue: Red} : {Red, Blue}
  }
}
