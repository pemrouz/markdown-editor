var expect = window.chai.expect
  , container = document.createElement('div')
  , markdown = require('./')
  , editor, preview

describe('Markdown Editor', function(){

  before(function(){
    document.body.appendChild(container)

    ripple
      .resource(markdown)
      .resource('markdown-data', { text: "" } )

  })
  
  beforeEach(function(done){
    container.innerHTML = 
      '<markdown-preview style="width: 200px; height: 200px; right: 0; left: initial">'
    + '# Foo\n\n'
    + 'Bar\n'
    + '</markdown-preview>'
    + '<markdown-editor data="markdown-data" value="# Heh\r\nJigga what?"></markdown-editor>'

    preview = container.children[0]
    editor = container.children[1]
    setTimeout(done, 50)
  })

  after(function(){
    document.body.removeChild(container)
  })

  it('should produce correct markup for preview', function(){  
    expect(preview.shadowRoot.childNodes.length).to.eql(3)
    expect(preview.shadowRoot.childNodes[0].nodeName).to.eql('STYLE')
    expect(preview.shadowRoot.childNodes[1].nodeName).to.eql('#text')
    expect(preview.shadowRoot.childNodes[2].nodeName).to.eql('DIV')
    expect(preview.shadowRoot.childNodes[1].textContent).to.eql("# Foo\n\nBar\n")
    expect(preview.shadowRoot.childNodes[2].innerHTML).to.eql("<h1>Foo</h1>\n<p>Bar</p>\n")
  })

  it('should automatically reflect changes from preview html', function(done){  
    expect(preview.shadowRoot.childNodes[2].innerHTML).to.eql("<h1>Foo</h1>\n<p>Bar</p>\n")
    preview.innerHTML = '# wat'
    setTimeout(function(){
      expect(preview.shadowRoot.childNodes[2].innerHTML).to.eql("<h1>wat</h1>\n")
      done()
    }, 50)
  })

  it('should produce correct markup for editor', function(){  
    expect(editor.shadowRoot.childNodes.length).to.eql(3)
    expect(editor.shadowRoot.childNodes[0].nodeName).to.eql('STYLE')
    expect(editor.shadowRoot.childNodes[1].nodeName).to.eql('TEXTAREA')
    expect(editor.shadowRoot.childNodes[2].nodeName).to.eql('MARKDOWN-PREVIEW')
    expect(editor.shadowRoot.childNodes[1].textContent).to.eql("# Heh\nJigga what?")
    expect(editor.shadowRoot.childNodes[2].shadowRoot.childNodes[1].innerHTML).to.eql("<h1>Heh</h1>\n<p>Jigga what?</p>\n")
  })

  it('should automatically reflect changes from editor html (via ripple)', function(done){  
    expect(editor.shadowRoot.childNodes[1].textContent).to.eql("# Heh\nJigga what?")
    expect(editor.shadowRoot.childNodes[2].shadowRoot.childNodes[1].innerHTML).to.eql("<h1>Heh</h1>\n<p>Jigga what?</p>\n")
    ripple('markdown-data').text = '# wat'
    setTimeout(function(){
      expect(editor.shadowRoot.childNodes[1].textContent).to.eql("# wat")
      expect(editor.shadowRoot.childNodes[2].shadowRoot.childNodes[1].innerHTML).to.eql("<h1>wat</h1>\n")
      done()
    }, 150)
  })

  it('should enter and exit preview mode', function(){  
    editor.focus()
    expect(is.in(to.arr(editor.classList))("preview")).to.be.not.ok
    expect(getComputedStyle(editor.shadowRoot.childNodes[2]).display).to.eql('none')
    d3.event = { which: 80, altKey: true } 
    sel(editor.shadowRoot.childNodes[1]).on('keyup')()
    expect(is.in(to.arr(editor.classList))("preview")).to.be.ok
    expect(getComputedStyle(editor.shadowRoot.childNodes[2]).display).to.eql('block')
    d3.event = { which: 27 }
    sel(editor.shadowRoot.childNodes[1]).on('keyup')()
    expect(is.in(to.arr(editor.classList))("preview")).to.be.not.ok
    expect(getComputedStyle(editor.shadowRoot.childNodes[2]).display).to.eql('none')
  })        


})