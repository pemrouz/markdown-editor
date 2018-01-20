export default function markdownEditor(node, state){
  const decode  = d => d.replace(/\\r\\n/mg, '\n')
      , encode  = d => d.replace(/(<br>|\n)/mg, '\\r\\n')
      , focus   = d => o('.editor').node().focus()
      , value   = decode(defaults(state, 'value', state.default || ''))
      , preview = defaults(state, 'preview', false)
      , o = once(node)
  
  o.on('click.focus', focus)
    .classed('preview', preview)

  o('.editor[contenteditable="true"]', 1)
    .text(value)
    .on('input.md', input)
    .on('paste.md', paste)
    .on('keyup.md', keyup)

  o('markdown-preview', { value })

  function keyup(d, i, el, e) {
    if (e.key == 'p' && e.altKey) 
      o.draw(state.preview = true)

    if (e.key == 'Escape') 
      o.draw(state.preview = false)
  }

  function paste(d, i, el, e){
    e.preventDefault()
    document.execCommand("insertHTML", false, e.clipboardData.getData('text/plain'))
  }

  function input(d, i, el, e) {
    if (state.preview) return e.preventDefault() 
    state.value = el.textContent
    o.draw()   
  }
}